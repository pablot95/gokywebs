const WSP = '5491171473191';
const IG = 'dualdrip.ba';
const ENVIO_GRATIS_DESDE = 220000;

const BASE = location.pathname.includes('/producto/') ? '../' : '';

const CATEGORIAS = [
  { id: 'zapatillas', nombre: 'Zapatillas', img: 'zap-urban-low', desc: 'Siluetas chunky, retro y low que definen el fit.' },
  { id: 'buzos', nombre: 'Buzos & Hoodies', img: 'buzo-hoodie-blackout', desc: 'Heavyweight, boxy y oversize para todo el año.' },
  { id: 'remeras', nombre: 'Remeras', img: 'rem-oversize-negra', desc: 'Boxy fit y drop-shoulder de gramaje pesado.' },
  { id: 'camperas', nombre: 'Camperas', img: 'camp-varsity', desc: 'Varsity, puffer y coach para las capas de arriba.' },
  { id: 'accesorios', nombre: 'Accesorios', img: 'acc-bandolera', desc: 'Gorras y bandoleras que cierran el outfit.' },
];

const PRODUCTOS = [
  { id: 1, slug: 'chunky-runner-cream', nombre: 'Chunky Runner Cream', categoria: 'zapatillas', estado: 'Deadstock', precio: 420000, descuento: 0, stock: 3, talles: ['40', '41', '42', '43', '44'], destacado: true, badge: 'Nuevo', img: 'zap-chunky-runner', tags: ['chunky', 'dad shoes', 'crema', 'runner', 'suela alta'], descripcion: 'Silueta chunky de suela sculpted en crema y blanco roto. Cuero y mesh premium, con volumen exacto para dominar cualquier fit oversize. Pieza deadstock, sin uso, con caja original.' },
  { id: 2, slug: 'urban-low-og', nombre: 'Urban Low OG', categoria: 'zapatillas', estado: 'Como nuevo', precio: 365000, descuento: 15, stock: 2, talles: ['39', '40', '41', '42', '43'], img: 'zap-urban-low', tags: ['low', 'blanco', 'negro', 'clasica', 'og'], descripcion: 'La low top clásica en blanco y negro que combina con todo. Cuero flexible y toe box limpio. Estado como nuevo, usada muy pocas veces, sin marcas visibles.' },
  { id: 3, slug: 'retro-low-canvas', nombre: 'Retro Low Canvas', categoria: 'zapatillas', estado: 'Deadstock', precio: 185000, descuento: 0, stock: 5, talles: ['40', '41', '42', '43', '44', '45'], img: 'zap-retro-low', tags: ['lona', 'canvas', 'retro', 'blanco', 'skate'], descripcion: 'Lona premium con puntera reforzada y suela vulcanizada. El básico retro que nunca falla, con horma cómoda para uso diario. Deadstock con etiquetas.' },
  { id: 4, slug: 'minimal-low-bone', nombre: 'Minimal Low Bone', categoria: 'zapatillas', estado: 'Deadstock', precio: 210000, descuento: 0, stock: 4, talles: ['39', '40', '41', '42'], img: 'zap-minimal-low', tags: ['minimal', 'bone', 'low', 'blanco', 'clean'], descripcion: 'Diseño minimal en tono bone, sin logos que griten. Perfecta para el fit clean y monocromo. Materiales livianos y transpirables. Pieza sin uso.' },

  { id: 5, slug: 'hoodie-oversize-boxy-blackout', nombre: 'Hoodie Oversize Boxy Blackout', categoria: 'buzos', estado: 'Deadstock', precio: 145000, descuento: 0, stock: 6, talles: ['S', 'M', 'L', 'XL'], destacado: true, badge: 'Nuevo', img: 'buzo-hoodie-blackout', tags: ['hoodie', 'oversize', 'boxy', 'negro', 'heavyweight'], descripcion: 'Frisa peinada de 420 gsm, corte boxy y hombros caídos. Capucha doble y puños acanalados. El hoodie negro que buscabas para el layering de invierno. Deadstock.' },
  { id: 6, slug: 'hoodie-heavyweight-bone', nombre: 'Hoodie Heavyweight Bone', categoria: 'buzos', estado: 'Deadstock', precio: 138000, descuento: 0, stock: 4, talles: ['M', 'L', 'XL'], img: 'buzo-hoodie-bone', tags: ['hoodie', 'bone', 'crema', 'heavyweight', 'oversize'], descripcion: 'Tono bone cálido en frisa pesada, con caída oversize y interior perchado. La opción neutra que combina con toda la paleta. Sin uso, con etiqueta.' },
  { id: 7, slug: 'buzo-crewneck-total-black', nombre: 'Buzo Crewneck Total Black', categoria: 'buzos', estado: 'Usado · 9/10', precio: 112000, descuento: 20, stock: 3, talles: ['S', 'M', 'L'], img: 'buzo-crewneck-total', tags: ['crewneck', 'negro', 'buzo', 'total black', 'liso'], descripcion: 'Crewneck negro liso de gramaje medio, corte relajado y ribs firmes. Un básico premium para cualquier estación. Estado 9/10, apenas usado, impecable.' },
  { id: 8, slug: 'buzo-washed-grey', nombre: 'Buzo Washed Grey Melange', categoria: 'buzos', estado: 'Deadstock', precio: 128000, descuento: 0, stock: 1, talles: ['M', 'L'], badge: 'Última unidad', img: 'buzo-hoodie-grey', tags: ['gris', 'washed', 'melange', 'hoodie', 'lavado'], descripcion: 'Lavado especial que le da ese gris melange vintage. Frisa suave con capucha estructurada. Queda una sola unidad de esta pieza. Deadstock.' },

  { id: 9, slug: 'remera-heavyweight-boxy-blanco', nombre: 'Remera Heavyweight Boxy Blanco', categoria: 'remeras', estado: 'Deadstock', precio: 58000, descuento: 0, stock: 8, talles: ['S', 'M', 'L', 'XL', 'XXL'], destacado: true, badge: 'Nuevo', img: 'rem-heavyweight-blanco', tags: ['remera', 'blanca', 'boxy', 'heavyweight', 'oversize'], descripcion: 'Jersey de 240 gsm que se planta solo. Corte boxy con hombro caído y cuello reforzado que no se deforma. El blanco base de todo guardarropa. Deadstock.' },
  { id: 10, slug: 'remera-oversize-drop-negra', nombre: 'Remera Oversize Drop Negra', categoria: 'remeras', estado: 'Deadstock', precio: 64000, descuento: 10, stock: 6, talles: ['S', 'M', 'L', 'XL'], img: 'rem-oversize-negra', tags: ['remera', 'negra', 'oversize', 'drop shoulder'], descripcion: 'Drop-shoulder marcado y largo extra para el fit oversize real. Algodón pesado en negro profundo que no destiñe. Sin uso, con etiqueta.' },
  { id: 11, slug: 'remera-boxy-premium', nombre: 'Remera Boxy Premium Negra', categoria: 'remeras', estado: 'Deadstock', precio: 49000, descuento: 0, stock: 0, talles: ['S', 'M', 'L'], img: 'rem-boxy-hanger', tags: ['remera', 'negra', 'boxy', 'premium', 'básica'], descripcion: 'Boxy fit premium en negro, costuras planas y cuello acanalado. La base perfecta para estampar o usar limpia. Pieza agotada por ahora.' },

  { id: 12, slug: 'campera-varsity-letterman', nombre: 'Campera Varsity Letterman', categoria: 'camperas', estado: 'Deadstock', precio: 325000, descuento: 0, stock: 2, talles: ['M', 'L', 'XL'], destacado: true, badge: 'Nuevo', img: 'camp-varsity', tags: ['varsity', 'letterman', 'campera', 'lana', 'cuero'], descripcion: 'Cuerpo de lana y mangas contrastadas estilo college. Botonera a presión, ribs tejidos y bolsillos welt. La statement piece del outfit. Deadstock con caja.' },
  { id: 13, slug: 'campera-puffer-cropped-onyx', nombre: 'Campera Puffer Cropped Onyx', categoria: 'camperas', estado: 'Como nuevo', precio: 248000, descuento: 15, stock: 3, talles: ['S', 'M', 'L'], img: 'camp-puffer', tags: ['puffer', 'inflable', 'negra', 'cropped', 'onyx'], descripcion: 'Puffer cropped negro mate con relleno térmico y baffles definidos. Corte corto para stackear con hoodies largos. Estado como nuevo, sin roturas ni manchas.' },
  { id: 14, slug: 'campera-coach-storm', nombre: 'Campera Coach Storm', categoria: 'camperas', estado: 'Deadstock', precio: 168000, descuento: 0, stock: 4, talles: ['M', 'L', 'XL'], img: 'camp-coach', tags: ['coach', 'rompeviento', 'negra', 'nylon', 'liviana'], descripcion: 'Coach jacket de nylon liviano, ideal para entretiempo. Cierre a presión, forro interno y caída recta. Un clásico del streetwear noventoso. Deadstock.' },

  { id: 15, slug: 'gorra-curved-negra', nombre: 'Gorra Curved Negra', categoria: 'accesorios', estado: 'Deadstock', precio: 38000, descuento: 0, stock: 10, talles: ['Único'], badge: 'Nuevo', img: 'acc-gorra', tags: ['gorra', 'cap', 'curved', 'negra', 'ajustable'], descripcion: 'Visera curva, panel estructurado y cierre metálico ajustable. Negro total para combinar con cualquier fit. Nueva, sin uso.' },
  { id: 16, slug: 'bandolera-crossbody-cuero', nombre: 'Bandolera Crossbody Cuero', categoria: 'accesorios', estado: 'Deadstock', precio: 52000, descuento: 10, stock: 5, talles: ['Único'], img: 'acc-bandolera', tags: ['bandolera', 'crossbody', 'cuero', 'negra', 'dorado'], descripcion: 'Cuero sintético premium con hebilla dorada y correa regulable. Compacta pero con lugar para lo esencial. El detalle que sube cualquier look. Deadstock.' },
];

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const norm = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const getProducto = id => PRODUCTOS.find(p => p.id === id);
const imgUrl = name => `${BASE}images/${name}.webp`;
const prodUrl = p => `${BASE}producto/?id=${p.id}`;
const catName = id => CATEGORIAS.find(c => c.id === id)?.nombre || 'Otros';

const Cart = {
  KEY: 'dualdrip_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { localStorage.setItem(this.KEY, JSON.stringify(items)); document.dispatchEvent(new CustomEvent('cart:updated')); },
  lineIndex(items, id, talle) { return items.findIndex(i => i.id === id && (i.talle || '') === (talle || '')); },
  add(producto, qty = 1, talle = '') {
    const items = this.get();
    const idx = this.lineIndex(items, producto.id, talle);
    if (idx > -1) items[idx].qty = Math.min(items[idx].qty + qty, producto.stock || 99);
    else items.push({ id: producto.id, talle: talle || '', qty: Math.min(qty, producto.stock || 99) });
    this.save(items);
  },
  setQty(id, talle, qty) {
    const items = this.get();
    const idx = this.lineIndex(items, id, talle);
    if (idx < 0) return;
    const p = getProducto(id);
    items[idx].qty = Math.max(1, Math.min(qty, p?.stock || 99));
    this.save(items);
  },
  remove(id, talle) { this.save(this.get().filter(i => !(i.id === id && (i.talle || '') === (talle || '')))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); },
};

const Wish = {
  KEY: 'dualdrip_wishlist',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  has(id) { return this.get().includes(id); },
  toggle(id) {
    const list = this.get();
    const i = list.indexOf(id);
    if (i > -1) list.splice(i, 1); else list.push(id);
    localStorage.setItem(this.KEY, JSON.stringify(list));
    document.dispatchEvent(new CustomEvent('wish:updated'));
    return this.has(id);
  },
};

function whatsappPedido() {
  const items = Cart.get();
  if (!items.length) return `https://wa.me/${WSP}?text=${encodeURIComponent('¡Hola Dualdrip! Quería hacer una consulta sobre el catálogo.')}`;
  const lineas = ['¡Hola Dualdrip! Quiero coordinar este pedido:', ''];
  items.forEach(i => {
    const p = getProducto(i.id); if (!p) return;
    const t = i.talle ? ` · Talle ${i.talle}` : '';
    lineas.push(`• ${p.nombre}${t} ×${i.qty} — ${formatearPrecio(precioFinal(p) * i.qty)}`);
  });
  lineas.push('', `Total estimado: ${formatearPrecio(Cart.total())}`, '¿Sigue disponible?');
  return `https://wa.me/${WSP}?text=${encodeURIComponent(lineas.join('\n'))}`;
}

function whatsappProducto(p, talle) {
  const t = talle ? ` en talle ${talle}` : '';
  const msg = `¡Hola Dualdrip! Me interesa "${p.nombre}"${t} (${formatearPrecio(precioFinal(p))}). ¿Está disponible?`;
  return `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
}

function showToast(msg) {
  let wrap = document.querySelector('.toast-wrap');
  if (!wrap) { wrap = document.createElement('div'); wrap.className = 'toast-wrap'; wrap.setAttribute('aria-live', 'polite'); document.body.appendChild(wrap); }
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  toast.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg><span>${esc(msg)}</span>`;
  wrap.appendChild(toast);
  setTimeout(() => { toast.classList.add('hiding'); setTimeout(() => toast.remove(), 220); }, 3000);
}

const ICON = {
  cart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M2.5 3h2.2l2.2 12.4a1.6 1.6 0 0 0 1.6 1.3h8.4a1.6 1.6 0 0 0 1.6-1.3L21.5 7H6"/></svg>',
  heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 5.6a5 5 0 0 0-7.1 0L12 7.3l-1.7-1.7a5 5 0 1 0-7.1 7.1L12 21l8.8-8.3a5 5 0 0 0 0-7.1z"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  minus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 12h14"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>',
  wsp: '<svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>',
};

function cardHTML(p, i = 0) {
  const final = precioFinal(p);
  const agotado = p.stock <= 0;
  const badge = agotado ? '<span class="tag tag--out">Agotado</span>' : (p.descuento > 0 ? `<span class="tag tag--sale">-${p.descuento}%</span>` : (p.badge ? `<span class="tag">${esc(p.badge)}</span>` : ''));
  const wished = Wish.has(p.id) ? ' is-wished' : '';
  return `<article class="card" data-animate="up" style="--i:${i}">
    <a class="card__media" href="${prodUrl(p)}" aria-label="${esc(p.nombre)}">
      <img src="${imgUrl(p.img)}" alt="${esc(p.nombre)} — ${esc(catName(p.categoria))}" width="1200" height="1500" loading="lazy">
      <span class="card__estado">${esc(p.estado)}</span>
      ${badge}
    </a>
    <button class="card__wish${wished}" data-wish="${p.id}" aria-label="Guardar en favoritos" aria-pressed="${Wish.has(p.id)}">${ICON.heart}</button>
    <div class="card__body">
      <span class="card__cat">${esc(catName(p.categoria))}</span>
      <h3 class="card__name"><a href="${prodUrl(p)}">${esc(p.nombre)}</a></h3>
      <div class="card__price">
        <span class="price">${formatearPrecio(final)}</span>
        ${p.descuento > 0 ? `<s class="price-old">${formatearPrecio(p.precio)}</s>` : ''}
      </div>
      <div class="card__actions">
        ${agotado
          ? `<a class="btn btn--ghost btn--block" href="${whatsappProducto(p, '')}" target="_blank" rel="noopener">Avisame cuando entre</a>`
          : `<button class="btn btn--gold btn--block" data-add="${p.id}">Agregar</button>
             <button class="btn btn--ghost btn--block" data-buy="${p.id}">Comprar ahora</button>`}
      </div>
    </div>
  </article>`;
}

function bindCardActions(scope = document) {
  scope.querySelectorAll('[data-add]').forEach(b => b.addEventListener('click', () => {
    const p = getProducto(+b.dataset.add); if (!p) return;
    Cart.add(p, 1, ''); pulseCartBtn(); showToast(`${p.nombre} sumado al carrito`);
  }));
  scope.querySelectorAll('[data-buy]').forEach(b => b.addEventListener('click', () => {
    const p = getProducto(+b.dataset.buy); if (!p) return;
    Cart.add(p, 1, ''); pulseCartBtn(); openCart();
  }));
  scope.querySelectorAll('[data-wish]').forEach(b => b.addEventListener('click', () => {
    const on = Wish.toggle(+b.dataset.wish);
    b.classList.toggle('is-wished', on); b.setAttribute('aria-pressed', on);
    showToast(on ? 'Guardado en favoritos' : 'Quitado de favoritos');
  }));
}

let cartBtnEl;
function pulseCartBtn() {
  cartBtnEl = cartBtnEl || document.getElementById('cart-btn');
  if (!cartBtnEl) return;
  cartBtnEl.classList.remove('bump'); void cartBtnEl.offsetWidth; cartBtnEl.classList.add('bump');
}

function renderCartCount() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(el => {
    el.textContent = n; el.hidden = n === 0;
  });
}

let lastFocus = null;
function openCart() {
  const drawer = document.getElementById('cart-drawer');
  const overlay = document.getElementById('overlay');
  if (!drawer) return;
  lastFocus = document.activeElement;
  renderCart();
  drawer.classList.add('open'); overlay.classList.add('show');
  drawer.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  const close = drawer.querySelector('.drawer__close');
  close && close.focus();
  document.addEventListener('keydown', cartKeydown);
}
function closeCart() {
  const drawer = document.getElementById('cart-drawer');
  const overlay = document.getElementById('overlay');
  if (!drawer) return;
  drawer.classList.remove('open'); overlay.classList.remove('show');
  drawer.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  document.removeEventListener('keydown', cartKeydown);
  lastFocus && lastFocus.focus();
}
function cartKeydown(e) {
  if (e.key === 'Escape') { closeCart(); return; }
  if (e.key !== 'Tab') return;
  const drawer = document.getElementById('cart-drawer');
  const f = drawer.querySelectorAll('button, a[href], input, [tabindex]:not([tabindex="-1"])');
  const list = Array.from(f).filter(el => !el.disabled && el.offsetParent !== null);
  if (!list.length) return;
  const first = list[0], last = list[list.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

function renderCart() {
  const body = document.getElementById('cart-body');
  const foot = document.getElementById('cart-foot');
  if (!body) return;
  const items = Cart.get();
  if (!items.length) {
    body.innerHTML = `<div class="cart-empty">
      <div class="cart-empty__icon">${ICON.cart}</div>
      <p>Tu carrito está vacío.</p>
      <span>Sumá tus piezas favoritas y coordinamos el pedido por WhatsApp.</span>
      <a class="btn btn--gold" href="${BASE}catalogo.html">Ver el catálogo</a>
    </div>`;
    foot.innerHTML = '';
    return;
  }
  body.innerHTML = items.map(i => {
    const p = getProducto(i.id); if (!p) return '';
    const final = precioFinal(p);
    return `<div class="cart-line">
      <a href="${prodUrl(p)}" class="cart-line__img"><img src="${imgUrl(p.img)}" alt="${esc(p.nombre)}" width="120" height="150" loading="lazy"></a>
      <div class="cart-line__info">
        <h4>${esc(p.nombre)}</h4>
        ${i.talle ? `<span class="cart-line__talle">Talle ${esc(i.talle)}</span>` : ''}
        <div class="cart-line__price">${formatearPrecio(final)}</div>
        <div class="qty">
          <button class="qty__btn" data-dec="${p.id}" data-talle="${esc(i.talle)}" aria-label="Restar">${ICON.minus}</button>
          <span class="qty__val">${i.qty}</span>
          <button class="qty__btn" data-inc="${p.id}" data-talle="${esc(i.talle)}" aria-label="Sumar" ${i.qty >= p.stock ? 'disabled' : ''}>${ICON.plus}</button>
        </div>
      </div>
      <button class="cart-line__del" data-del="${p.id}" data-talle="${esc(i.talle)}" aria-label="Quitar ${esc(p.nombre)}">${ICON.close}</button>
    </div>`;
  }).join('');

  const total = Cart.total();
  const falta = ENVIO_GRATIS_DESDE - total;
  const pct = Math.min(100, Math.round(total / ENVIO_GRATIS_DESDE * 100));
  foot.innerHTML = `
    <div class="ship-bar">
      <div class="ship-bar__txt">${falta > 0 ? `Te faltan <strong>${formatearPrecio(falta)}</strong> para el envío gratis` : '¡Tenés envío gratis! 🎉'}</div>
      <div class="ship-bar__track"><span style="width:${pct}%"></span></div>
    </div>
    <div class="cart-total"><span>Total</span><strong>${formatearPrecio(total)}</strong></div>
    <a class="btn btn--gold btn--block btn--lg" href="${whatsappPedido()}" target="_blank" rel="noopener" id="cart-wsp">${ICON.wsp}<span>Finalizar pedido por WhatsApp</span></a>
    <button class="cart-clear" data-clear>Vaciar carrito</button>`;

  body.querySelectorAll('[data-inc]').forEach(b => b.addEventListener('click', () => { const p = getProducto(+b.dataset.inc); Cart.setQty(p.id, b.dataset.talle, (Cart.get().find(x => x.id === p.id && (x.talle || '') === b.dataset.talle)?.qty || 1) + 1); }));
  body.querySelectorAll('[data-dec]').forEach(b => b.addEventListener('click', () => { const p = getProducto(+b.dataset.dec); const cur = Cart.get().find(x => x.id === p.id && (x.talle || '') === b.dataset.talle)?.qty || 1; if (cur <= 1) Cart.remove(p.id, b.dataset.talle); else Cart.setQty(p.id, b.dataset.talle, cur - 1); }));
  body.querySelectorAll('[data-del]').forEach(b => b.addEventListener('click', () => Cart.remove(+b.dataset.del, b.dataset.talle)));
  foot.querySelector('[data-clear]')?.addEventListener('click', () => { Cart.clear(); showToast('Carrito vaciado'); });
}

function initHeader() {
  const cartBtn = document.getElementById('cart-btn');
  cartBtn && cartBtn.addEventListener('click', openCart);
  document.getElementById('overlay')?.addEventListener('click', () => { closeCart(); closeMenu(); });
  document.querySelector('.drawer__close')?.addEventListener('click', closeCart);

  const toggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('nav-mobile');
  if (toggle && menu) {
    const openMenu = () => {
      menu.classList.add('open');
      document.getElementById('overlay').classList.add('show');
      toggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      menu.querySelector('a')?.focus();
      document.addEventListener('keydown', menuKeydown);
    };
    toggle.addEventListener('click', () => { menu.classList.contains('open') ? closeMenu() : openMenu(); });
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  }
  document.addEventListener('cart:updated', () => { renderCartCount(); if (document.getElementById('cart-drawer')?.classList.contains('open')) renderCart(); });
  renderCartCount();
}
function menuKeydown(e) { if (e.key === 'Escape') closeMenu(); }
function closeMenu() {
  const menu = document.getElementById('nav-mobile');
  const toggle = document.getElementById('menu-toggle');
  if (!menu || !menu.classList.contains('open')) return;
  menu.classList.remove('open');
  if (!document.getElementById('cart-drawer')?.classList.contains('open')) document.getElementById('overlay')?.classList.remove('show');
  toggle?.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
  document.removeEventListener('keydown', menuKeydown);
  toggle?.focus();
}

function observeRevealElements(els, options) {
  const targets = new Map();
  els.forEach(el => {
    const target = el.dataset.animate === 'clip' ? el.parentElement : el;
    if (!target) return;
    const group = targets.get(target) || [];
    group.push(el);
    targets.set(target, group);
  });
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      targets.get(e.target)?.forEach(el => el.classList.add('is-in'));
      io.unobserve(e.target);
    });
  }, options);
  targets.forEach((_, target) => io.observe(target));
}

function initReveal() {
  const els = document.querySelectorAll('[data-animate]');
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    els.forEach(el => el.classList.add('is-in')); return;
  }
  observeRevealElements(els, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
}
function observeNew(scope) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { scope.querySelectorAll('[data-animate]').forEach(el => el.classList.add('is-in')); return; }
  observeRevealElements(scope.querySelectorAll('[data-animate]:not(.is-in)'), { threshold: 0.1 });
}

function initWspFloat() {
  const btn = document.getElementById('wsp-float');
  if (!btn) return;
  btn.href = `https://wa.me/${WSP}?text=${encodeURIComponent('¡Hola Dualdrip! Vi el catálogo y quería consultar por una pieza.')}`;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) btn.classList.add('visible'); else btn.classList.remove('visible');
  }, { passive: true });
}

function renderHome() {
  const destGrid = document.getElementById('destacados');
  if (destGrid) {
    const dest = PRODUCTOS.filter(p => p.destacado);
    destGrid.innerHTML = dest.map((p, i) => cardHTML(p, i)).join('');
    bindCardActions(destGrid);
  }
  const catGrid = document.getElementById('categorias');
  if (catGrid) {
    catGrid.innerHTML = CATEGORIAS.map((c, i) => `
      <a class="cat-card" href="${BASE}catalogo.html?cat=${c.id}" data-animate="up" style="--i:${i}">
        <img src="${imgUrl(c.img)}" alt="Categoría ${esc(c.nombre)}" width="1200" height="1500" loading="lazy">
        <div class="cat-card__body">
          <span class="cat-card__count">${PRODUCTOS.filter(p => p.categoria === c.id).length} piezas</span>
          <h3>${esc(c.nombre)}</h3>
          <span class="cat-card__link">Ver categoría →</span>
        </div>
      </a>`).join('');
  }
}

const CatalogState = { cat: 'all', estado: 'all', talle: 'all', sort: 'relevancia', q: '', soloDesc: false, soloStock: false, shown: 12 };

function catalogFiltered() {
  let list = PRODUCTOS.slice();
  if (CatalogState.cat !== 'all') list = list.filter(p => p.categoria === CatalogState.cat);
  if (CatalogState.estado !== 'all') list = list.filter(p => norm(p.estado).startsWith(norm(CatalogState.estado)));
  if (CatalogState.talle !== 'all') list = list.filter(p => p.talles.includes(CatalogState.talle));
  if (CatalogState.soloDesc) list = list.filter(p => p.descuento > 0);
  if (CatalogState.soloStock) list = list.filter(p => p.stock > 0);
  if (CatalogState.q) {
    const q = norm(CatalogState.q);
    list = list.filter(p => norm(`${p.nombre} ${catName(p.categoria)} ${p.estado} ${p.tags.join(' ')}`).includes(q));
  }
  const s = CatalogState.sort;
  if (s === 'precio-asc') list.sort((a, b) => precioFinal(a) - precioFinal(b));
  else if (s === 'precio-desc') list.sort((a, b) => precioFinal(b) - precioFinal(a));
  else if (s === 'nombre') list.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
  else list.sort((a, b) => (b.destacado ? 1 : 0) - (a.destacado ? 1 : 0) || (b.stock > 0 ? 1 : 0) - (a.stock > 0 ? 1 : 0));
  return list;
}

function renderCatalog() {
  const grid = document.getElementById('cat-grid');
  if (!grid) return;
  const list = catalogFiltered();
  const total = list.length;
  const slice = list.slice(0, CatalogState.shown);
  const countEl = document.getElementById('cat-count');
  if (countEl) countEl.textContent = total === 1 ? '1 resultado' : `${total} resultados`;

  if (!total) {
    grid.innerHTML = `<div class="empty">
      <div class="empty__icon">${ICON.search}</div>
      <h3>Sin resultados</h3>
      <p>No encontramos piezas con esos filtros. Probá aflojar la búsqueda.</p>
      <button class="btn btn--gold" data-reset>Limpiar filtros</button>
    </div>`;
    grid.querySelector('[data-reset]')?.addEventListener('click', resetFilters);
  } else {
    grid.innerHTML = slice.map((p, i) => cardHTML(p, i % 12)).join('');
    bindCardActions(grid);
    observeNew(grid);
  }
  const more = document.getElementById('load-more');
  if (more) more.hidden = CatalogState.shown >= total;
}

function resetFilters() {
  Object.assign(CatalogState, { cat: 'all', estado: 'all', talle: 'all', sort: 'relevancia', q: '', soloDesc: false, soloStock: false, shown: 12 });
  syncFilterUI();
  renderCatalog();
}

function syncFilterUI() {
  document.querySelectorAll('[data-cat-chip]').forEach(b => b.classList.toggle('is-active', b.dataset.catChip === CatalogState.cat));
  const q = document.getElementById('search-input'); if (q) q.value = CatalogState.q;
  const est = document.getElementById('f-estado'); if (est) est.value = CatalogState.estado;
  const tal = document.getElementById('f-talle'); if (tal) tal.value = CatalogState.talle;
  const sort = document.getElementById('f-sort'); if (sort) sort.value = CatalogState.sort;
  const sd = document.getElementById('f-desc'); if (sd) sd.checked = CatalogState.soloDesc;
  const ss = document.getElementById('f-stock'); if (ss) ss.checked = CatalogState.soloStock;
}

function initCatalog() {
  const grid = document.getElementById('cat-grid');
  if (!grid) return;
  const params = new URLSearchParams(location.search);
  if (params.get('cat') && CATEGORIAS.some(c => c.id === params.get('cat'))) CatalogState.cat = params.get('cat');
  if (params.get('q')) CatalogState.q = params.get('q');
  if (params.get('soloDesc') === '1') CatalogState.soloDesc = true;

  const chipsWrap = document.getElementById('cat-chips');
  if (chipsWrap) {
    chipsWrap.innerHTML = [{ id: 'all', nombre: 'Todo' }, ...CATEGORIAS].map(c =>
      `<button class="chip" data-cat-chip="${c.id}">${esc(c.nombre)}</button>`).join('');
    chipsWrap.querySelectorAll('[data-cat-chip]').forEach(b => b.addEventListener('click', () => {
      CatalogState.cat = b.dataset.catChip; CatalogState.shown = 12; syncFilterUI(); renderCatalog();
    }));
  }
  const tallesAll = [...new Set(PRODUCTOS.flatMap(p => p.talles))].filter(t => t !== 'Único');
  const tal = document.getElementById('f-talle');
  if (tal) tal.innerHTML = '<option value="all">Todos los talles</option>' + tallesAll.map(t => `<option value="${t}">${t}</option>`).join('');

  const on = (id, ev, fn) => { const el = document.getElementById(id); el && el.addEventListener(ev, fn); };
  let t;
  on('search-input', 'input', e => { clearTimeout(t); t = setTimeout(() => { CatalogState.q = e.target.value; CatalogState.shown = 12; renderCatalog(); }, 180); });
  on('f-estado', 'change', e => { CatalogState.estado = e.target.value; CatalogState.shown = 12; renderCatalog(); });
  on('f-talle', 'change', e => { CatalogState.talle = e.target.value; CatalogState.shown = 12; renderCatalog(); });
  on('f-sort', 'change', e => { CatalogState.sort = e.target.value; renderCatalog(); });
  on('f-desc', 'change', e => { CatalogState.soloDesc = e.target.checked; CatalogState.shown = 12; renderCatalog(); });
  on('f-stock', 'change', e => { CatalogState.soloStock = e.target.checked; CatalogState.shown = 12; renderCatalog(); });
  on('load-more', 'click', () => { CatalogState.shown += 12; renderCatalog(); });
  document.querySelectorAll('[data-reset]').forEach(b => b.addEventListener('click', resetFilters));

  const fToggle = document.getElementById('filters-toggle');
  const fPanel = document.getElementById('filters-panel');
  if (fToggle && fPanel) fToggle.addEventListener('click', () => {
    const open = fPanel.classList.toggle('open'); fToggle.setAttribute('aria-expanded', open);
  });

  syncFilterUI();
  renderCatalog();
}

function initProducto() {
  const root = document.getElementById('producto');
  if (!root) return;
  const id = +new URLSearchParams(location.search).get('id');
  const p = getProducto(id);
  if (!p) {
    root.innerHTML = `<div class="empty empty--page">
      <h1>Pieza no encontrada</h1>
      <p>Puede que ya se haya vendido o el enlace esté roto.</p>
      <a class="btn btn--gold" href="${BASE}catalogo.html">Volver al catálogo</a>
    </div>`;
    document.title = 'Pieza no encontrada — Dualdrip';
    return;
  }
  document.title = `${p.nombre} — Dualdrip`;
  const md = document.getElementById('meta-desc'); if (md) md.setAttribute('content', p.descripcion.slice(0, 155));
  const final = precioFinal(p);
  const agotado = p.stock <= 0;
  let talleSel = '';

  root.innerHTML = `
    <nav class="crumbs" data-animate="up"><a href="${BASE}index.html">Inicio</a> / <a href="${BASE}catalogo.html?cat=${p.categoria}">${esc(catName(p.categoria))}</a> / <span>${esc(p.nombre)}</span></nav>
    <div class="pd">
      <div class="pd__media" data-animate="clip">
        <img src="${imgUrl(p.img)}" alt="${esc(p.nombre)} — ${esc(catName(p.categoria))}" width="1200" height="1500">
        <span class="pd__estado">${esc(p.estado)}</span>
        ${p.descuento > 0 ? `<span class="tag tag--sale pd__tag">-${p.descuento}%</span>` : (p.badge && !agotado ? `<span class="tag pd__tag">${esc(p.badge)}</span>` : '')}
      </div>
      <div class="pd__info" data-animate="right">
        <span class="pd__cat">${esc(catName(p.categoria))} · ${esc(p.estado)}</span>
        <h1 class="pd__name">${esc(p.nombre)}</h1>
        <div class="pd__price">
          <span class="price">${formatearPrecio(final)}</span>
          ${p.descuento > 0 ? `<s class="price-old">${formatearPrecio(p.precio)}</s><span class="pd__save">Ahorrás ${formatearPrecio(p.precio - final)}</span>` : ''}
        </div>
        <p class="pd__desc">${esc(p.descripcion)}</p>
        <div class="pd__talles">
          <span class="pd__label">Talle</span>
          <div class="talles" id="talles">${p.talles.map(t => `<button class="talle" data-talle="${esc(t)}">${esc(t)}</button>`).join('')}</div>
        </div>
        <div class="pd__stock">${agotado ? '<span class="dot dot--out"></span> Sin stock por ahora' : (p.stock <= 3 ? `<span class="dot dot--low"></span> Últimas ${p.stock} unidades` : '<span class="dot"></span> Disponible')}</div>
        <div class="pd__qty">
          <span class="pd__label">Cantidad</span>
          <div class="qty qty--lg">
            <button class="qty__btn" id="q-dec" aria-label="Restar">${ICON.minus}</button>
            <span class="qty__val" id="q-val">1</span>
            <button class="qty__btn" id="q-inc" aria-label="Sumar">${ICON.plus}</button>
          </div>
        </div>
        <div class="pd__cta">
          ${agotado
            ? `<a class="btn btn--gold btn--lg btn--block" href="${whatsappProducto(p, '')}" target="_blank" rel="noopener">${ICON.wsp}<span>Consultar por WhatsApp</span></a>`
            : `<button class="btn btn--gold btn--lg btn--block" id="pd-add">Agregar al carrito</button>
               <button class="btn btn--dark btn--lg btn--block" id="pd-buy">Comprar ahora</button>`}
          <button class="btn btn--ghost btn--lg pd__wish" id="pd-wish" aria-pressed="${Wish.has(p.id)}">${ICON.heart}<span>${Wish.has(p.id) ? 'Guardado' : 'Favorito'}</span></button>
        </div>
        <ul class="pd__trust">
          <li>Piezas originales verificadas una por una</li>
          <li>Coordinás la compra directo por WhatsApp</li>
          <li>Envíos a todo el país · Retiro en CABA</li>
        </ul>
      </div>
    </div>`;

  const qVal = root.querySelector('#q-val');
  let qty = 1;
  root.querySelector('#q-inc')?.addEventListener('click', () => { qty = Math.min(qty + 1, p.stock || 1); qVal.textContent = qty; });
  root.querySelector('#q-dec')?.addEventListener('click', () => { qty = Math.max(1, qty - 1); qVal.textContent = qty; });
  root.querySelectorAll('#talles .talle').forEach(b => b.addEventListener('click', () => {
    root.querySelectorAll('#talles .talle').forEach(x => x.classList.remove('is-sel'));
    b.classList.add('is-sel'); talleSel = b.dataset.talle;
  }));
  const needTalle = () => {
    if (p.talles.length > 1 && p.talles[0] !== 'Único' && !talleSel) { showToast('Elegí un talle primero'); return true; }
    return false;
  };
  root.querySelector('#pd-add')?.addEventListener('click', () => { if (needTalle()) return; Cart.add(p, qty, talleSel || (p.talles[0] === 'Único' ? 'Único' : '')); pulseCartBtn(); showToast(`${p.nombre} sumado al carrito`); });
  root.querySelector('#pd-buy')?.addEventListener('click', () => { if (needTalle()) return; Cart.add(p, qty, talleSel || (p.talles[0] === 'Único' ? 'Único' : '')); pulseCartBtn(); openCart(); });
  root.querySelector('#pd-wish')?.addEventListener('click', (e) => {
    const on = Wish.toggle(p.id); e.currentTarget.setAttribute('aria-pressed', on);
    e.currentTarget.querySelector('span').textContent = on ? 'Guardado' : 'Favorito';
    showToast(on ? 'Guardado en favoritos' : 'Quitado de favoritos');
  });

  const rel = document.getElementById('relacionados');
  if (rel) {
    const otros = PRODUCTOS.filter(x => x.categoria === p.categoria && x.id !== p.id).slice(0, 4);
    const fill = otros.length < 4 ? PRODUCTOS.filter(x => x.id !== p.id && !otros.includes(x)).slice(0, 4 - otros.length) : [];
    rel.innerHTML = [...otros, ...fill].map((x, i) => cardHTML(x, i)).join('');
    bindCardActions(rel);
  }

  const ld = document.getElementById('ld-product');
  if (ld) ld.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, image: [location.origin + '/' + imgUrl(p.img).replace('../', '')],
    description: p.descripcion, category: catName(p.categoria),
    offers: { '@type': 'Offer', priceCurrency: 'ARS', price: final, availability: agotado ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock' }
  });

  observeNew(root);
}

function initMarquee() {
  document.querySelectorAll('.marquee__track').forEach(tr => {
    if (tr.children.length && tr.dataset.dup !== '1') { tr.innerHTML += tr.innerHTML; tr.dataset.dup = '1'; }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.classList.add('js-ready');
  initHeader();
  initWspFloat();
  initMarquee();
  renderHome();
  initCatalog();
  initProducto();
  initReveal();
  document.addEventListener('wish:updated', renderCartCount);
});
