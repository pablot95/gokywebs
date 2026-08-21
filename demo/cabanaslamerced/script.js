const WHATSAPP_NUMBER = '5492324592471';
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const normalizar = s => (s || '').toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
const waHref = lines => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`;
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');

const CATEGORIAS = [
  { id: 'puertas', nombre: 'Puertas', imagen: 'images/puertas-detalle-1200x1200.webp' },
  { id: 'ventanas', nombre: 'Ventanas', imagen: 'images/ventanas-1200x1200.webp' },
  { id: 'placares', nombre: 'Placares', imagen: 'images/placares-1200x1200.webp' },
  { id: 'muebles-cocina', nombre: 'Muebles de cocina', imagen: 'images/muebles-cocina-1200x1200.webp' },
  { id: 'decks-pergolas', nombre: 'Decks y pérgolas', imagen: 'images/decks-pergolas-1200x1200.webp' },
  { id: 'escaleras', nombre: 'Escaleras', imagen: 'images/escaleras-1200x1200.webp' },
  { id: 'revestimientos', nombre: 'Revestimientos', imagen: 'images/muebles-cocina-1200x1200.webp' },
];
const IMG_POR_CATEGORIA = Object.fromEntries(CATEGORIAS.map(c => [c.id, c.imagen]));
const categoriaNombre = id => CATEGORIAS.find(c => c.id === id)?.nombre || id;

const PRODUCTOS_RAW = [
  ['puerta-interior-lisa-70', 'Puerta interior placa lisa 70cm', 'puertas', 'Interior', 'unidad', 85000, 'Puerta de placa lisa, terminación prolija, medida estándar.', 'Puerta interior de placa lisa en 70cm de ancho, marco incluido. Ideal para dormitorios y espacios internos.'],
  ['puerta-interior-entablada-80', 'Puerta interior placa entablada 80cm', 'puertas', 'Interior', 'unidad', 98000, 'Diseño entablado, un poco más de carácter.', 'Puerta interior de placa entablada, 80cm de ancho, marco incluido.'],
  ['puerta-exterior-maciza-80', 'Puerta exterior maciza 80cm', 'puertas', 'Exterior', 'unidad', 165000, 'Madera maciza, pensada para la intemperie.', 'Puerta exterior de madera maciza, tratada para resistir sol y lluvia, 80cm de ancho.', 1, 0],
  ['puerta-doble-hoja-120', 'Puerta doble hoja interior 1.20m', 'puertas', 'Interior', 'unidad', 145000, 'Para vanos amplios, dos hojas parejas.', 'Puerta doble hoja de 1.20m de ancho total, ideal para living o accesos amplios.'],

  ['ventana-madera-1hoja-60', 'Ventana de madera 1 hoja 60x60', 'ventanas', 'Interior', 'unidad', 72000, 'Fija, para baños y espacios chicos.', 'Ventana de madera de una hoja, 60x60cm, vidrio simple incluido.'],
  ['ventana-madera-2hojas-120x100', 'Ventana de madera 2 hojas 120x100', 'ventanas', 'Exterior', 'unidad', 128000, 'Corrediza, buena entrada de luz.', 'Ventana de madera corrediza de dos hojas, 120x100cm, vidrio simple incluido.', 1, 0],
  ['ventana-balcon-150x200', 'Ventana balcón de madera 150x200', 'ventanas', 'Exterior', 'unidad', 215000, 'Abatible, de piso a casi el techo.', 'Ventana balcón abatible de madera, 150x200cm, para accesos a balcón o patio.', 1, 0],
  ['postigon-madera-60x120', 'Postigón de madera 60x120', 'ventanas', 'Exterior', 'unidad', 58000, 'Protección extra para ventanas exteriores.', 'Postigón de madera maciza, 60x120cm, se instala sobre la ventana existente.'],

  ['placard-2puertas-120', 'Placard 2 puertas 1.20m', 'placares', 'Interior', 'unidad', 210000, 'El clásico placard de dormitorio.', 'Placard de melamina de 2 puertas, 1.20m de ancho, con estantes y barral.'],
  ['placard-3puertas-180', 'Placard 3 puertas 1.80m', 'placares', 'Interior', 'unidad', 295000, 'Más guardado, mismo estilo.', 'Placard de melamina de 3 puertas, 1.80m de ancho, con estantes y barral.', 1, 0],
  ['vestidor-medida-metro', 'Vestidor a medida', 'placares', 'A medida', 'metro', 180000, 'Se cotiza por metro lineal de mueble.', 'Vestidor completo a medida, diseñado según el espacio disponible. Precio por metro lineal.'],
  ['placard-rebatidas-espejo-150', 'Placard rebatidas con espejo 1.50m', 'placares', 'Interior', 'unidad', 260000, 'Puertas rebatidas, espejo de cuerpo entero.', 'Placard de melamina con puertas rebatidas y espejo incorporado, 1.50m de ancho.'],

  ['modulo-bajo-mesada-60', 'Módulo bajo mesada 60cm', 'muebles-cocina', 'Interior', 'unidad', 95000, 'Para completar o renovar tu cocina.', 'Módulo bajo mesada de melamina, 60cm de ancho, con puertas y estante interno.'],
  ['modulo-alacena-80', 'Módulo alacena 80cm', 'muebles-cocina', 'Interior', 'unidad', 78000, 'Guardado aéreo, mismo estilo.', 'Módulo alacena de melamina, 80cm de ancho, para complementar los módulos bajos.'],
  ['isla-cocina-medida', 'Isla de cocina a medida', 'muebles-cocina', 'A medida', 'unidad', 340000, 'El centro de una cocina grande.', 'Isla de cocina diseñada a medida según el espacio y el uso — guardado, mesada y terminación a elección.', 1, 0],
  ['mesada-madera-maciza-2m', 'Mesada de madera maciza 2m', 'muebles-cocina', 'Interior', 'unidad', 190000, 'Calidez de madera real en la cocina.', 'Mesada de madera maciza tratada, 2 metros de largo, lista para instalar.'],

  ['deck-madera-m2', 'Deck de madera', 'decks-pergolas', 'Exterior', 'm2', 45000, 'Se cotiza por metro cuadrado.', 'Deck de madera para exterior, tratada para intemperie. Precio por metro cuadrado instalado.', 1, 0],
  ['pergola-simple-3x3', 'Pérgola simple 3x3m', 'decks-pergolas', 'Exterior', 'unidad', 280000, 'Sombra para el patio, estructura simple.', 'Pérgola de madera de 3x3m, estructura simple sin techo, lista para instalar.'],
  ['pergola-policarbonato-4x4', 'Pérgola con techo policarbonato 4x4m', 'decks-pergolas', 'Exterior', 'unidad', 420000, 'Sombra todo el año, con techo.', 'Pérgola de madera de 4x4m con techo de policarbonato, protege de sol y lluvia.', 1, 0],
  ['piso-madera-exterior-m2', 'Piso de madera para exterior', 'decks-pergolas', 'Exterior', 'm2', 38000, 'Se cotiza por metro cuadrado.', 'Piso de madera tratada para espacios exteriores. Precio por metro cuadrado instalado.'],

  ['escalera-recta-escalon', 'Escalera recta de madera', 'escaleras', 'Interior', 'escalon', 32000, 'Se cotiza por escalón.', 'Escalera recta de madera maciza. Precio por escalón, según la cantidad que necesites.'],
  ['escalera-caracol-2m', 'Escalera caracol de madera 2m diámetro', 'escaleras', 'Interior', 'unidad', 580000, 'Para espacios chicos, con carácter.', 'Escalera caracol de madera de 2 metros de diámetro, estructura completa.'],
  ['baranda-madera-metro', 'Baranda de madera', 'escaleras', 'Accesorio', 'metro', 28000, 'Se cotiza por metro lineal.', 'Baranda de madera para escaleras o balcones. Precio por metro lineal.'],
  ['escalera-medida-descanso', 'Escalera a medida con descanso', 'escaleras', 'A medida', 'unidad', 650000, 'Para desniveles más complejos.', 'Escalera de madera a medida, con descanso intermedio, diseñada según el espacio.', 1, 0],

  ['revestimiento-machimbre-m2', 'Revestimiento de madera machimbre', 'revestimientos', 'Interior', 'm2', 22000, 'Se cotiza por metro cuadrado.', 'Revestimiento de madera machimbrada para paredes o techos interiores. Precio por metro cuadrado.'],
  ['revestimiento-simil-ladrillo-m2', 'Revestimiento símil ladrillo', 'revestimientos', 'Exterior', 'm2', 18500, 'Se cotiza por metro cuadrado.', 'Revestimiento símil ladrillo para paredes exteriores. Precio por metro cuadrado.'],
  ['zocalos-madera-metro', 'Zócalos de madera', 'revestimientos', 'Accesorio', 'metro', 4500, 'Se cotiza por metro lineal.', 'Zócalos de madera maciza para terminación de piso. Precio por metro lineal.'],
  ['cielorraso-madera-m2', 'Cielorraso de madera', 'revestimientos', 'Interior', 'm2', 26000, 'Se cotiza por metro cuadrado.', 'Cielorraso de madera para interiores, terminación cálida. Precio por metro cuadrado.'],
];

const PRODUCTOS = PRODUCTOS_RAW.map((row, i) => ({
  id: i + 1,
  slug: row[0], nombre: row[1], categoria: row[2], tipo: row[3], unidad: row[4], precio: row[5],
  descCorta: row[6], descLarga: row[7], destacado: !!row[8], nuevo: !!row[9],
  imagen: IMG_POR_CATEGORIA[row[2]],
}));
const getProducto = id => PRODUCTOS.find(p => p.id === id);
const DESTACADOS = PRODUCTOS.filter(p => p.destacado);
const unidadLabel = u => ({ unidad: null, m2: 'por m²', metro: 'por metro', escalon: 'por escalón' }[u]);

const Cart = {
  KEY: 'cabanaslamerced_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { localStorage.setItem(this.KEY, JSON.stringify(items)); document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(id, qty = 1) {
    const items = this.get();
    const existing = items.find(i => i.id === id);
    if (existing) existing.qty += qty;
    else items.push({ id, qty });
    this.save(items);
  },
  setQty(id, qty) {
    const items = this.get(); const it = items.find(i => i.id === id); if (!it) return;
    it.qty = Math.max(1, qty); this.save(items);
  },
  remove(id) { this.save(this.get().filter(i => i.id !== id)); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + p.precio * i.qty : s; }, 0); },
};

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
}
document.addEventListener('cart:updated', updateCartBadge);

function precioHTML(p) {
  const u = unidadLabel(p.unidad);
  return `${formatearPrecio(p.precio)}${u ? ` <small>${u}</small>` : ''}`;
}

function prodCardHTML(p) {
  return `
    <article class="prod-card" data-id="${p.id}">
      <div class="prod-media" data-open-modal="${p.id}">
        ${p.nuevo ? '<span class="prod-badge">Nuevo</span>' : ''}
        <img src="${p.imagen}" width="1200" height="1200" alt="${esc(p.nombre)}" loading="lazy">
      </div>
      <div class="prod-info">
        <span class="prod-cat">${esc(categoriaNombre(p.categoria))}</span>
        <p class="prod-nombre" data-open-modal="${p.id}">${esc(p.nombre)}</p>
        <p class="prod-precio">${precioHTML(p)}</p>
        <div class="prod-actions">
          <div class="stepper" data-stepper>
            <button type="button" data-step="-1" aria-label="Restar cantidad">&minus;</button>
            <span data-qty>1</span>
            <button type="button" data-step="1" aria-label="Sumar cantidad">+</button>
          </div>
          <button type="button" class="prod-add" data-add="${p.id}">Agregar</button>
        </div>
      </div>
    </article>`;
}

function initProdCardEvents(container) {
  container.querySelectorAll('[data-stepper]').forEach(stepper => {
    stepper.querySelectorAll('[data-step]').forEach(btn => {
      btn.addEventListener('click', () => {
        const span = stepper.querySelector('[data-qty]');
        const next = Math.max(1, parseInt(span.textContent, 10) + parseInt(btn.dataset.step, 10));
        span.textContent = next;
      });
    });
  });
  container.querySelectorAll('[data-add]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.add, 10);
      const card = btn.closest('.prod-card');
      const qty = parseInt(card.querySelector('[data-qty]').textContent, 10) || 1;
      Cart.add(id, qty);
      btn.textContent = 'Agregado ✓';
      btn.classList.add('is-added');
      setTimeout(() => { btn.textContent = 'Agregar'; btn.classList.remove('is-added'); }, 1300);
    });
  });
  container.querySelectorAll('[data-open-modal]').forEach(el => {
    el.addEventListener('click', () => openProductModal(parseInt(el.dataset.openModal, 10)));
  });
}

function renderDestacados() {
  const track = document.getElementById('destacadosTrack');
  if (!track) return;
  track.innerHTML = DESTACADOS.map(prodCardHTML).join('');
  initProdCardEvents(track);
}

function renderCategorias() {
  const grid = document.getElementById('catGrid');
  if (!grid) return;
  grid.innerHTML = CATEGORIAS.map(c => `
    <button type="button" class="cat-card" data-cat="${c.id}" data-animate="up" style="transform:translateY(30px);opacity:0">
      <img src="${c.imagen}" width="800" height="800" alt="Categoría ${esc(c.nombre)}" loading="lazy">
      <span>${esc(c.nombre)}</span>
    </button>`).join('');
  grid.querySelectorAll('[data-cat]').forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.dataset.cat;
      document.getElementById('filtroCategoria').value = cat;
      catalogoState.categoria = cat;
      catalogoState.visibles = 16;
      renderCatalogo();
      document.getElementById('catalogo').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  });
}

function llenarFiltros() {
  const selCat = document.getElementById('filtroCategoria');
  CATEGORIAS.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.id; opt.textContent = c.nombre;
    selCat.appendChild(opt);
  });
  const selTipo = document.getElementById('filtroTipo');
  ['Interior', 'Exterior', 'A medida', 'Accesorio'].forEach(t => {
    const opt = document.createElement('option');
    opt.value = t; opt.textContent = t;
    selTipo.appendChild(opt);
  });
}

const catalogoState = { query: '', categoria: '', tipo: '', visibles: 16 };

function filtrarProductos() {
  const q = normalizar(catalogoState.query.trim());
  return PRODUCTOS.filter(p => {
    if (catalogoState.categoria && p.categoria !== catalogoState.categoria) return false;
    if (catalogoState.tipo && p.tipo !== catalogoState.tipo) return false;
    if (q) {
      const haystack = normalizar([p.nombre, categoriaNombre(p.categoria), p.tipo, p.descCorta, p.descLarga].join(' '));
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}

function renderCatalogo() {
  const grid = document.getElementById('catalogoGrid');
  const count = document.getElementById('resultadosCount');
  const sinResultados = document.getElementById('sinResultados');
  const verMas = document.getElementById('verMas');
  const limpiar = document.getElementById('limpiarFiltros');
  const resultados = filtrarProductos();
  const visibles = resultados.slice(0, catalogoState.visibles);

  grid.innerHTML = visibles.map(prodCardHTML).join('');
  initProdCardEvents(grid);
  grid.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));

  count.textContent = resultados.length === PRODUCTOS.length
    ? `${resultados.length} productos`
    : `${resultados.length} resultado${resultados.length === 1 ? '' : 's'}`;
  sinResultados.hidden = resultados.length > 0;
  grid.hidden = resultados.length === 0;
  verMas.hidden = catalogoState.visibles >= resultados.length;
  limpiar.hidden = !(catalogoState.query || catalogoState.categoria || catalogoState.tipo);
}

function initCatalogo() {
  llenarFiltros();
  const buscador = document.getElementById('buscador');
  const selCat = document.getElementById('filtroCategoria');
  const selTipo = document.getElementById('filtroTipo');
  const limpiar = document.getElementById('limpiarFiltros');
  const sinResultadosLimpiar = document.getElementById('sinResultadosLimpiar');
  const verMas = document.getElementById('verMas');

  let debounceId;
  buscador.addEventListener('input', () => {
    clearTimeout(debounceId);
    debounceId = setTimeout(() => {
      catalogoState.query = buscador.value; catalogoState.visibles = 16; renderCatalogo();
    }, 180);
  });
  selCat.addEventListener('change', () => { catalogoState.categoria = selCat.value; catalogoState.visibles = 16; renderCatalogo(); });
  selTipo.addEventListener('change', () => { catalogoState.tipo = selTipo.value; catalogoState.visibles = 16; renderCatalogo(); });
  const limpiarTodo = () => {
    catalogoState.query = ''; catalogoState.categoria = ''; catalogoState.tipo = ''; catalogoState.visibles = 16;
    buscador.value = ''; selCat.value = ''; selTipo.value = '';
    renderCatalogo();
  };
  limpiar.addEventListener('click', limpiarTodo);
  sinResultadosLimpiar.addEventListener('click', limpiarTodo);
  verMas.addEventListener('click', () => { catalogoState.visibles += 16; renderCatalogo(); });

  renderCatalogo();
}

function openProductModal(id) {
  const p = getProducto(id);
  if (!p) return;
  const modal = document.getElementById('productModal');
  const backdrop = document.getElementById('modalBackdrop');
  const body = document.getElementById('modalBody');
  body.innerHTML = `
    <div class="modal-media"><img src="${p.imagen}" width="1200" height="1200" alt="${esc(p.nombre)}"></div>
    <div class="modal-info">
      <span class="prod-cat">${esc(categoriaNombre(p.categoria))}</span>
      <h3>${esc(p.nombre)}</h3>
      <p class="modal-precio">${precioHTML(p)}</p>
      <div class="modal-tags"><span>${esc(p.tipo)}</span></div>
      <p class="modal-desc">${esc(p.descLarga)}</p>
      <div class="modal-actions">
        <div class="stepper" data-stepper>
          <button type="button" data-step="-1" aria-label="Restar cantidad">&minus;</button>
          <span data-qty>1</span>
          <button type="button" data-step="1" aria-label="Sumar cantidad">+</button>
        </div>
        <button type="button" class="btn btn-cta" data-add="${p.id}">Agregar al carrito</button>
      </div>
    </div>`;
  initProdCardEvents(body);
  body.querySelector('[data-add]').addEventListener('click', () => {
    modal.querySelector('.btn-cta').textContent = 'Agregado ✓';
    setTimeout(closeProductModal, 500);
  });
  modal.classList.add('open'); backdrop.classList.add('open');
  modal.removeAttribute('inert');
  document.body.classList.add('no-scroll');
  document.getElementById('modalClose').focus();
}
function closeProductModal() {
  const modal = document.getElementById('productModal');
  const backdrop = document.getElementById('modalBackdrop');
  modal.classList.remove('open'); backdrop.classList.remove('open');
  modal.setAttribute('inert', '');
  document.body.classList.remove('no-scroll');
}
function initModal() {
  document.getElementById('modalClose').addEventListener('click', closeProductModal);
  document.getElementById('modalBackdrop').addEventListener('click', closeProductModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && document.getElementById('productModal').classList.contains('open')) closeProductModal(); });
}

function renderCartDrawer() {
  const body = document.getElementById('cartDrawerBody');
  const items = Cart.get();
  const totalEl = document.getElementById('drawerTotal');
  const finalizarBtn = document.getElementById('finalizarBtn');
  totalEl.textContent = formatearPrecio(Cart.total());
  finalizarBtn.disabled = items.length === 0;
  if (!items.length) {
    body.innerHTML = `
      <div class="drawer-empty">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3"/></svg>
        <p>Tu carrito está vacío.<br>Recorré el catálogo y sumá lo que necesites.</p>
      </div>`;
    return;
  }
  body.innerHTML = items.map(i => {
    const p = getProducto(i.id);
    if (!p) return '';
    return `
      <div class="drawer-item" data-id="${p.id}">
        <img src="${p.imagen}" width="60" height="60" alt="${esc(p.nombre)}">
        <div class="drawer-item-info">
          <p>${esc(p.nombre)}</p>
          <span class="drawer-item-meta">${formatearPrecio(p.precio)} c/u</span>
          <div class="drawer-item-actions">
            <div class="stepper" data-stepper-cart="${p.id}">
              <button type="button" data-step="-1" aria-label="Restar cantidad">&minus;</button>
              <span data-qty>${i.qty}</span>
              <button type="button" data-step="1" aria-label="Sumar cantidad">+</button>
            </div>
            <button type="button" class="drawer-remove" data-remove="${p.id}">Quitar</button>
          </div>
        </div>
      </div>`;
  }).join('');

  body.querySelectorAll('[data-stepper-cart]').forEach(stepper => {
    const id = parseInt(stepper.dataset.stepperCart, 10);
    stepper.querySelectorAll('[data-step]').forEach(btn => {
      btn.addEventListener('click', () => {
        const span = stepper.querySelector('[data-qty]');
        const next = Math.max(1, parseInt(span.textContent, 10) + parseInt(btn.dataset.step, 10));
        Cart.setQty(id, next);
      });
    });
  });
  body.querySelectorAll('[data-remove]').forEach(btn => {
    btn.addEventListener('click', () => Cart.remove(parseInt(btn.dataset.remove, 10)));
  });
}
document.addEventListener('cart:updated', renderCartDrawer);

function openCartDrawer() {
  const drawer = document.getElementById('cartDrawer');
  const backdrop = document.getElementById('drawerBackdrop');
  renderCartDrawer();
  drawer.classList.add('open'); backdrop.classList.add('open');
  drawer.removeAttribute('inert');
  document.body.classList.add('no-scroll');
  document.getElementById('cartDrawerClose').focus();
}
function closeCartDrawer() {
  const drawer = document.getElementById('cartDrawer');
  const backdrop = document.getElementById('drawerBackdrop');
  drawer.classList.remove('open'); backdrop.classList.remove('open');
  drawer.setAttribute('inert', '');
  document.body.classList.remove('no-scroll');
}
function initDrawer() {
  document.getElementById('cart-btn').addEventListener('click', openCartDrawer);
  document.getElementById('cart-float').addEventListener('click', openCartDrawer);
  document.getElementById('cartDrawerClose').addEventListener('click', closeCartDrawer);
  document.getElementById('drawerBackdrop').addEventListener('click', closeCartDrawer);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && document.getElementById('cartDrawer').classList.contains('open')) closeCartDrawer(); });
  document.getElementById('finalizarBtn').addEventListener('click', () => {
    if (!Cart.get().length) return;
    closeCartDrawer();
    openCheckout();
  });
}

function generarNumeroOperacion() {
  const year = new Date().getFullYear();
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `CLM-${year}-${rand}`;
}

function checkoutFormHTML() {
  return `
    <div class="checkout-steps"><span class="is-active"></span><span></span></div>
    <h2>Finalizar compra</h2>
    <p class="checkout-lead">Completá tus datos para confirmar el pedido.</p>
    <form id="checkoutForm" novalidate>
      <div class="field-row">
        <div class="field">
          <label for="co-nombre">Nombre completo</label>
          <input id="co-nombre" name="nombre" type="text" autocomplete="name" required aria-invalid="false" aria-describedby="co-nombre-error">
          <span class="error-msg" id="co-nombre-error" role="alert" hidden>Ingresá tu nombre.</span>
        </div>
        <div class="field">
          <label for="co-email">Email</label>
          <input id="co-email" name="email" type="email" autocomplete="email" required aria-invalid="false" aria-describedby="co-email-error">
          <span class="error-msg" id="co-email-error" role="alert" hidden>Ingresá un email válido.</span>
        </div>
      </div>
      <div class="field">
        <label for="co-telefono">Teléfono</label>
        <input id="co-telefono" name="telefono" type="tel" inputmode="tel" autocomplete="tel" required aria-invalid="false" aria-describedby="co-telefono-error" placeholder="+54 9 11 1234-5678">
        <span class="error-msg" id="co-telefono-error" role="alert" hidden>Ingresá un teléfono válido.</span>
      </div>
      <div class="radio-group" role="radiogroup" aria-label="Forma de entrega">
        <label class="radio-option"><input type="radio" name="entrega" value="domicilio" checked><span>Envío a domicilio</span></label>
        <label class="radio-option"><input type="radio" name="entrega" value="retiro"><span>Retiro en depósito</span></label>
      </div>
      <div class="field" id="co-direccion-field">
        <label for="co-direccion">Dirección de envío</label>
        <input id="co-direccion" name="direccion" type="text" autocomplete="street-address" required aria-invalid="false" aria-describedby="co-direccion-error">
        <span class="error-msg" id="co-direccion-error" role="alert" hidden>Ingresá tu dirección.</span>
      </div>
      <div class="radio-group" role="radiogroup" aria-label="Medio de pago">
        <label class="radio-option"><input type="radio" name="pago" value="tarjeta" checked><span>Tarjeta de crédito o débito</span></label>
        <label class="radio-option"><input type="radio" name="pago" value="transferencia"><span>Transferencia bancaria</span></label>
        <label class="radio-option"><input type="radio" name="pago" value="efectivo"><span>Efectivo al retirar</span></label>
      </div>
      <div class="checkout-resumen" id="checkoutResumen"></div>
      <button type="submit" class="btn btn-cta btn-block">Confirmar pedido</button>
      <p class="checkout-nota">El pago se coordina por WhatsApp una vez confirmado el pedido — no vas a ingresar datos de tarjeta acá.</p>
    </form>`;
}

function checkoutResumenHTML() {
  const items = Cart.get();
  const lineas = items.map(i => {
    const p = getProducto(i.id); if (!p) return '';
    return `<div class="checkout-resumen-linea"><span>${i.qty} × ${esc(p.nombre)}</span><span>${formatearPrecio(p.precio * i.qty)}</span></div>`;
  }).join('');
  return `${lineas}<div class="checkout-resumen-total"><span>Total</span><span>${formatearPrecio(Cart.total())}</span></div>`;
}

function checkoutConfirmacionHTML(numeroOperacion, datos) {
  const items = Cart.get();
  const lineas = items.map(i => {
    const p = getProducto(i.id); if (!p) return '';
    return `${i.qty} x ${p.nombre}`;
  });
  const mensaje = waHref([
    `Hola Cabañas La Merced! Confirmé el pedido ${numeroOperacion}.`,
    '',
    ...lineas,
    '',
    `Total: ${formatearPrecio(Cart.total())}`,
    `Entrega: ${datos.entrega === 'retiro' ? 'Retiro en depósito' : 'Envío a domicilio'}`,
    `Medio de pago: ${{ tarjeta: 'Tarjeta de crédito/débito', transferencia: 'Transferencia bancaria', efectivo: 'Efectivo al retirar' }[datos.pago]}`,
  ]);
  return `
    <div class="checkout-steps"><span class="is-active"></span><span class="is-active"></span></div>
    <div class="checkout-confirmacion">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M21 11.5a8.38 8.38 0 0 1-9.4 8.4 8.5 8.5 0 1 1 9.4-8.4Z"/><path d="M8 12l2.5 2.5L16 9"/></svg>
      <h2>¡Pedido confirmado!</h2>
      <p>Guardá tu número de operación — lo vas a necesitar si nos escribís.</p>
      <span class="checkout-orden-num">${numeroOperacion}</span>
      <div class="checkout-resumen">${checkoutResumenHTML()}</div>
      <p class="checkout-nota">Te contactamos por WhatsApp a la brevedad para coordinar el pago y la entrega. También podés escribirnos vos.</p>
      <a class="btn btn-cta" href="${mensaje}" target="_blank" rel="noopener noreferrer">Continuar por WhatsApp</a>
    </div>`;
}

function openCheckout() {
  const modal = document.getElementById('checkoutModal');
  const backdrop = document.getElementById('checkoutBackdrop');
  const body = document.getElementById('checkoutBody');
  body.innerHTML = checkoutFormHTML();
  document.getElementById('checkoutResumen').innerHTML = checkoutResumenHTML();

  const form = document.getElementById('checkoutForm');
  const direccionField = document.getElementById('co-direccion-field');
  const direccionInput = document.getElementById('co-direccion');

  if (typeof IMask !== 'undefined') {
    IMask(document.getElementById('co-telefono'), { mask: [
      { mask: '+{54} 9 (00) 0000-0000' },
      { mask: '+{54} 9 (000) 000-0000' },
      { mask: '+{54} 9 (0000) 00-0000' },
    ] });
  }

  form.querySelectorAll('input[name="entrega"]').forEach(radio => {
    radio.addEventListener('change', () => {
      const esRetiro = form.entrega.value === 'retiro';
      direccionField.hidden = esRetiro;
      direccionInput.required = !esRetiro;
    });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    let valido = true;
    const campos = [
      { input: document.getElementById('co-nombre'), check: v => v.trim().length > 1 },
      { input: document.getElementById('co-email'), check: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) },
      { input: document.getElementById('co-telefono'), check: v => v.replace(/\D/g, '').length >= 8 },
    ];
    if (!direccionField.hidden) campos.push({ input: direccionInput, check: v => v.trim().length > 3 });

    campos.forEach(({ input, check }) => {
      const ok = check(input.value);
      input.setAttribute('aria-invalid', String(!ok));
      const errorEl = document.getElementById(input.id + '-error');
      if (errorEl) errorEl.hidden = ok;
      if (!ok) valido = false;
    });

    if (!valido) {
      const primerError = form.querySelector('[aria-invalid="true"]');
      primerError?.focus();
      primerError?.scrollIntoView({ block: 'center', behavior: reduceMotion ? 'auto' : 'smooth' });
      return;
    }

    const datos = { entrega: form.entrega.value, pago: form.pago.value };
    const numeroOperacion = generarNumeroOperacion();
    body.innerHTML = checkoutConfirmacionHTML(numeroOperacion, datos);
    body.querySelector('.checkout-orden-num')?.focus();
    Cart.clear();
  });

  modal.classList.add('open'); backdrop.classList.add('open');
  modal.removeAttribute('inert');
  document.body.classList.add('no-scroll');
  document.getElementById('co-nombre')?.focus();
}
function closeCheckout() {
  const modal = document.getElementById('checkoutModal');
  const backdrop = document.getElementById('checkoutBackdrop');
  modal.classList.remove('open'); backdrop.classList.remove('open');
  modal.setAttribute('inert', '');
  document.body.classList.remove('no-scroll');
}
function initCheckout() {
  document.getElementById('checkoutClose').addEventListener('click', closeCheckout);
  document.getElementById('checkoutBackdrop').addEventListener('click', closeCheckout);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && document.getElementById('checkoutModal').classList.contains('open')) closeCheckout(); });
}

function initReveals() {
  const items = document.querySelectorAll('[data-animate]');
  if (!items.length) return;
  document.querySelectorAll('[data-animate-stagger]').forEach(parent => {
    parent.querySelectorAll('[data-animate]').forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i * 0.1, 0.6)}s`;
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
}

function initRail(id) {
  const vp = document.getElementById(id);
  if (!vp) return;
  vp.addEventListener('wheel', e => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
    const max = vp.scrollWidth - vp.clientWidth;
    if (max <= 1) return;
    const atStart = vp.scrollLeft <= 0, atEnd = vp.scrollLeft >= max - 1;
    if ((e.deltaY < 0 && atStart) || (e.deltaY > 0 && atEnd)) return;
    e.preventDefault();
    vp.scrollLeft += e.deltaY;
  }, { passive: false });

  let dragging = false, moved = false, startX = 0, startScroll = 0, pointerId = null;
  const THRESHOLD = 6;
  vp.addEventListener('pointerdown', e => {
    if (e.pointerType === 'touch' || e.button !== 0) return;
    dragging = true; moved = false; pointerId = e.pointerId;
    startX = e.clientX; startScroll = vp.scrollLeft;
  });
  vp.addEventListener('pointermove', e => {
    if (!dragging || e.pointerId !== pointerId) return;
    const dx = e.clientX - startX;
    if (!moved && Math.abs(dx) < THRESHOLD) return;
    if (!moved) {
      moved = true; vp.classList.add('dragging');
      try { vp.setPointerCapture?.(pointerId); } catch { /* sigue sin capture */ }
    }
    e.preventDefault();
    vp.scrollLeft = startScroll - dx;
  });
  const end = e => {
    if (!dragging || (e && pointerId !== null && e.pointerId !== pointerId)) return;
    dragging = false;
    if (moved) {
      try { vp.releasePointerCapture?.(pointerId); } catch { /* ya liberado */ }
      vp.classList.remove('dragging');
      const kill = ev => { ev.stopPropagation(); ev.preventDefault(); };
      vp.addEventListener('click', kill, { capture: true, once: true });
      setTimeout(() => vp.removeEventListener('click', kill, { capture: true }), 0);
    }
    pointerId = null; moved = false;
  };
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
  vp.addEventListener('dragstart', e => e.preventDefault());
}

function initFloats() {
  const wsp = document.getElementById('wsp-float');
  const cart = document.getElementById('cart-float');
  const sync = () => {
    const scrolled = window.scrollY > 600;
    wsp?.classList.toggle('visible', scrolled);
    cart?.classList.toggle('visible', scrolled || Cart.count() > 0);
  };
  window.addEventListener('scroll', sync, { passive: true });
  document.addEventListener('cart:updated', sync);
  sync();
}

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const OBRA_PASOS = ['cimiento', 'estructura', 'paredes', 'techo', 'terminacion'];
const OBRA_ETIQUETAS = { cimiento: 'Cimiento', estructura: 'Estructura', paredes: 'Paredes', techo: 'Techo', terminacion: 'Terminación' };
const OBRA_METROS_TOTAL = 18;

function initObra() {
  const stage = document.getElementById('obraStage');
  const visual = document.getElementById('obraVisual');
  const cintaFill = document.getElementById('obraCintaFill');
  const cintaNum = document.getElementById('obraCintaNum');
  const caption = document.getElementById('obraCaption');
  if (!stage || !visual) return;

  const update = progress => {
    const pasoIdx = Math.min(OBRA_PASOS.length - 1, Math.floor(progress * OBRA_PASOS.length));
    const paso = OBRA_PASOS[pasoIdx];
    visual.dataset.paso = paso;
    caption.textContent = OBRA_ETIQUETAS[paso];
    cintaFill.style.width = `${(progress * 100).toFixed(1)}%`;
    cintaNum.textContent = `${Math.round(progress * OBRA_METROS_TOTAL)} m`;
  };

  if (reduceMotion) { update(1); return; }

  let ticking = false;
  const onScroll = () => {
    ticking = false;
    const rect = stage.getBoundingClientRect();
    const total = rect.height - window.innerHeight;
    const progress = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
    update(progress);
  };
  const queue = () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } };
  update(0);
  window.addEventListener('scroll', queue, { passive: true });
  window.addEventListener('resize', queue, { passive: true });
}

function initFooterYear() {
  const el = document.getElementById('footerYear');
  if (el) el.textContent = new Date().getFullYear();
}

renderDestacados();
renderCategorias();
initCatalogo();
initReveals();
initNav();
initRail('destacadosRail');
initFloats();
initModal();
initDrawer();
initCheckout();
initObra();
initFooterYear();
updateCartBadge();
