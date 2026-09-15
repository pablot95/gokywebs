/* =========================================================
   COSMÉTICOS AR — script.js
   ========================================================= */

/* ---------- flag de versión de hero (animado / clásico) ---------- */
(function () {
  var p = new URLSearchParams(location.search);
  var clasico = p.get('estilo') === 'clasico' || location.hash === '#clasica';
  if (document.body) document.body.dataset.hero = clasico ? 'clasico' : 'animado';
})();

const WSP = '5493434624900';
const ENVIO_GRATIS_DESDE = 25000;
const BASE = location.pathname.includes('/producto/') ? '../' : '';

/* ---------- helpers ---------- */
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const getProducto = id => PRODUCTOS.find(p => p.id === id);
const catNombre = id => (CATEGORIAS.find(c => c.id === id)?.nombre) || 'Catálogo';
const img = name => BASE + 'images/' + name;

/* ---------- datos ---------- */
const CATEGORIAS = [
  { id: 'perfumeria', nombre: 'Perfumería' },
  { id: 'rostro', nombre: 'Rostro' },
  { id: 'cuerpo', nombre: 'Cuerpo' },
  { id: 'maquillaje', nombre: 'Maquillaje' },
  { id: 'cabello', nombre: 'Cabello' },
];

const PRODUCTOS = [
  // ---- perfumería ----
  { id: 'kaiak', nombre: 'Kaiak Aventura', marca: 'Natura', cat: 'perfumeria', precio: 28900, descuento: 0, stock: 12, img: 'p-kaiak.jpg', destacado: false,
    desc: 'Un amaderado fresco y vibrante para el día a día. Notas de bergamota, cardamomo y madera que acompañan cada aventura sin pesar.' },
  { id: 'luna', nombre: 'Luna Deo Parfum', marca: 'Natura', cat: 'perfumeria', precio: 32500, descuento: 10, stock: 8, img: 'p-luna.jpg', destacado: true,
    desc: 'Floral misterioso y magnético. Corazón de flor de azahar sobre un fondo cálido que deja una estela inolvidable de día y de noche.' },
  { id: 'essencial', nombre: 'Essencial Exclusivo', marca: 'Natura', cat: 'perfumeria', precio: 41900, descuento: 0, stock: 6, img: 'p-essencial.jpg', destacado: true,
    desc: 'El clásico argentino en su versión más elegante. Notas de cuero y especias con una sofisticación que se volvió un ícono.' },
  { id: 'humor', nombre: 'Humor 2', marca: 'Natura', cat: 'perfumeria', precio: 26900, descuento: 0, stock: 10, img: 'p-humor.jpg', destacado: false,
    desc: 'Fresco, divertido y con chispa. Cítricos brillantes y flores blancas para quienes no se toman la vida tan en serio.' },
  { id: 'faraway', nombre: 'Far Away', marca: 'Avon', cat: 'perfumeria', precio: 19900, descuento: 15, stock: 15, img: 'p-faraway.jpg', destacado: false,
    desc: 'Oriental floral envolvente. Un aroma cálido de durazno, freesia y sándalo que transporta a lugares lejanos.' },
  // ---- rostro ----
  { id: 'chronos-serum', nombre: 'Chronos Sérum Antisignos', marca: 'Natura', cat: 'rostro', precio: 34900, descuento: 0, stock: 7, img: 'p-chronos-serum.jpg', destacado: true,
    desc: 'Tratamiento concentrado que reduce líneas de expresión y devuelve firmeza. Textura liviana que penetra al instante.' },
  { id: 'chronos-hidra', nombre: 'Chronos Crema Hidratante', marca: 'Natura', cat: 'rostro', precio: 29900, descuento: 10, stock: 9, img: 'p-chronos-hidra.jpg', destacado: false,
    desc: 'Hidratación profunda durante 24 horas con protección antioxidante. Deja la piel suave, luminosa y descansada.' },
  { id: 'anew-vitc', nombre: 'Anew Vitamina C', marca: 'Avon', cat: 'rostro', precio: 22900, descuento: 0, stock: 11, img: 'p-anew-vitc.jpg', destacado: true,
    desc: 'Sérum iluminador con vitamina C pura que unifica el tono y aporta un glow instantáneo. Tu piel, más despierta.' },
  { id: 'faces-micelar', nombre: 'Agua Micelar Faces', marca: 'Avon', cat: 'rostro', precio: 8900, descuento: 0, stock: 20, img: 'p-faces-micelar.jpg', destacado: false,
    desc: 'Limpia, desmaquilla e hidrata en un solo paso, sin enjuague. Ideal para todo tipo de piel, incluso las más sensibles.' },
  { id: 'dove-facial', nombre: 'Barra de Limpieza Facial', marca: 'Dove', cat: 'rostro', precio: 4500, descuento: 0, stock: 25, img: 'p-dove-facial.jpg', destacado: false,
    desc: 'La suavidad de Dove para el rostro. Con ¼ de crema humectante, limpia sin resecar y cuida la barrera natural de la piel.' },
  { id: 'chronos-solar', nombre: 'Chronos Protector Solar FPS50', marca: 'Natura', cat: 'rostro', precio: 18900, descuento: 0, stock: 14, img: 'p-chronos-solar.jpg', destacado: false,
    desc: 'Protección alta con toque seco y color natural. Cuida del sol mientras uniforma la piel. El paso que no podés saltear.' },
  { id: 'anew-ojos', nombre: 'Anew Contorno de Ojos', marca: 'Avon', cat: 'rostro', precio: 16900, descuento: 20, stock: 8, img: 'p-anew-ojos.jpg', destacado: false,
    desc: 'Reduce ojeras y bolsas mientras desinflama la mirada. Aplicador metálico frío para un efecto descanso inmediato.' },
  { id: 'chronos-gua', nombre: 'Gua Sha de Cuarzo', marca: 'Natura', cat: 'rostro', precio: 12900, descuento: 0, stock: 16, img: 'p-chronos-gua.jpg', destacado: false,
    desc: 'Herramienta de masaje facial que activa la circulación y define el contorno. El ritual de skincare que te vas a querer regalar.' },
  // ---- cuerpo ----
  { id: 'tododia', nombre: 'Tododia Hidratante Corporal', marca: 'Natura', cat: 'cuerpo', precio: 13900, descuento: 0, stock: 18, img: 'p-tododia.jpg', destacado: true,
    desc: 'Hidratación deliciosa de rápida absorción. Deja la piel suave, perfumada y lista en segundos. El clásico que no puede faltar.' },
  { id: 'ekos-pulpa', nombre: 'Ekos Pulpa Hidratante', marca: 'Natura', cat: 'cuerpo', precio: 17900, descuento: 0, stock: 10, img: 'p-ekos-pulpa.jpg', destacado: false,
    desc: 'Textura fresca en gel con ingredientes de la biodiversidad argentina. Nutrición intensa con aroma que enamora.' },
  { id: 'dove-deo', nombre: 'Desodorante Original', marca: 'Dove', cat: 'cuerpo', precio: 3900, descuento: 0, stock: 30, img: 'p-dove-deo.jpg', destacado: false,
    desc: 'Protección 48h con ¼ de crema humectante que cuida la piel de las axilas. Suavidad todo el día, sin manchas.' },
  { id: 'dove-bodywash', nombre: 'Jabón Líquido Corporal', marca: 'Dove', cat: 'cuerpo', precio: 5900, descuento: 10, stock: 22, img: 'p-dove-bodywash.jpg', destacado: false,
    desc: 'Espuma cremosa que limpia con delicadeza y repone humedad. Salís de la ducha con la piel suave desde el primer uso.' },
  { id: 'senses-manos', nombre: 'Crema de Manos Nutritiva', marca: 'Natura', cat: 'cuerpo', precio: 7900, descuento: 0, stock: 17, img: 'p-senses-manos.jpg', destacado: false,
    desc: 'Nutrición profunda que no deja sensación grasa. Manos suaves y protegidas en cualquier momento del día.' },
  { id: 'ekos-jabon', nombre: 'Ekos Jabón Vegetal', marca: 'Natura', cat: 'cuerpo', precio: 6500, descuento: 0, stock: 24, img: 'p-ekos-jabon.jpg', destacado: false,
    desc: 'Jabón en barra artesanal con aceites vegetales. Limpia respetando la piel y perfuma el baño con su aroma natural.' },
  // ---- maquillaje ----
  { id: 'una-base', nombre: 'Una Base Líquida HD', marca: 'Avon', cat: 'maquillaje', precio: 14900, descuento: 0, stock: 13, img: 'p-una-base.jpg', destacado: true,
    desc: 'Cobertura media a alta con acabado natural que dura todo el día. Se funde con la piel para un efecto de segunda piel real.' },
  { id: 'faces-mascara', nombre: 'Máscara de Pestañas', marca: 'Avon', cat: 'maquillaje', precio: 8500, descuento: 0, stock: 19, img: 'p-faces-mascara.jpg', destacado: false,
    desc: 'Volumen y definición sin grumos. El cepillo separa cada pestaña para una mirada intensa que no se desarma.' },
  { id: 'powerstay', nombre: 'Power Stay Labial 16h', marca: 'Avon', cat: 'maquillaje', precio: 9900, descuento: 15, stock: 12, img: 'p-powerstay.jpg', destacado: false,
    desc: 'Color intenso de larguísima duración que no transfiere. Ponételo a la mañana y olvidate de retocarlo.' },
  { id: 'truecolor', nombre: 'True Color Labial', marca: 'Avon', cat: 'maquillaje', precio: 7900, descuento: 0, stock: 21, img: 'p-truecolor.jpg', destacado: false,
    desc: 'Textura cremosa con color vibrante y terminación satinada. El labial de todos los días que sienta siempre bien.' },
  { id: 'una-paleta', nombre: 'Una Paleta de Sombras', marca: 'Avon', cat: 'maquillaje', precio: 15900, descuento: 0, stock: 9, img: 'p-una-paleta.jpg', destacado: true,
    desc: 'Doce tonos ultrapigmentados entre mates y satinados para armar mil looks. Del día a la noche en una sola paleta.' },
  { id: 'faces-rubor', nombre: 'Rubor en Polvo', marca: 'Avon', cat: 'maquillaje', precio: 6900, descuento: 0, stock: 15, img: 'p-faces-rubor.jpg', destacado: false,
    desc: 'Color suave y difuminable que aporta frescura al instante. Un toque saludable que ilumina el rostro en segundos.' },
  // ---- cabello ----
  { id: 'lumina-shampoo', nombre: 'Lumina Shampoo Reparación', marca: 'Natura', cat: 'cabello', precio: 11900, descuento: 0, stock: 14, img: 'p-lumina-shampoo.jpg', destacado: false,
    desc: 'Repara el daño desde la primera lavada. Deja el pelo suave, con brillo y fácil de peinar. Tu cabello, como nuevo.' },
  { id: 'plant-acond', nombre: 'Plant Acondicionador', marca: 'Natura', cat: 'cabello', precio: 11900, descuento: 10, stock: 13, img: 'p-plant-acond.jpg', destacado: false,
    desc: 'Nutrición vegana que desenreda y controla el frizz. Fórmula liviana que cuida el color y respeta el cuero cabelludo.' },
  { id: 'dove-shampoo', nombre: 'Shampoo Nutrición Absoluta', marca: 'Dove', cat: 'cabello', precio: 5500, descuento: 0, stock: 26, img: 'p-dove-shampoo.jpg', destacado: false,
    desc: 'Con activos que penetran hasta la raíz para nutrir el pelo seco. Suavidad y manejabilidad lavado tras lavado.' },
  { id: 'advance-aceite', nombre: 'Advance Techniques Aceite', marca: 'Avon', cat: 'cabello', precio: 10900, descuento: 0, stock: 16, img: 'p-advance-aceite.jpg', destacado: false,
    desc: 'Aceite reparador sin enjuague que sella las puntas y aporta brillo espejo. Unas gotas transforman el pelo apagado.' },
  { id: 'lumina-mascara', nombre: 'Lumina Máscara Capilar', marca: 'Natura', cat: 'cabello', precio: 14900, descuento: 20, stock: 8, img: 'p-lumina-mascara.jpg', destacado: true,
    desc: 'Tratamiento intensivo de uso semanal que recupera el cabello más dañado. Diez minutos para un pelo notablemente más sano.' },
];

/* =========================================================
   CART (canónico)
   ========================================================= */
const Cart = {
  KEY: 'cosmeticosar_cart',
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

/* ---------- wishlist ---------- */
const Wish = {
  KEY: 'cosmeticosar_wishlist',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  has(id) { return this.get().includes(id); },
  toggle(id) {
    const l = this.get(); const i = l.indexOf(id);
    if (i >= 0) l.splice(i, 1); else l.push(id);
    localStorage.setItem(this.KEY, JSON.stringify(l));
    document.dispatchEvent(new CustomEvent('wish:updated'));
    return this.has(id);
  },
};

/* =========================================================
   TOAST
   ========================================================= */
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

/* =========================================================
   SVG icons
   ========================================================= */
const ICON = {
  cart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>',
  heart: '<svg viewBox="0 0 24 24"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>',
  trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>',
};

/* =========================================================
   PRODUCT CARD
   ========================================================= */
function cardHTML(p, stagger) {
  const pf = precioFinal(p);
  const badges = [];
  if (p.descuento > 0) badges.push(`<span class="badge">-${p.descuento}%</span>`);
  if (p.destacado) badges.push(`<span class="badge badge-gold">Top ventas</span>`);
  if (p.stock <= 8) badges.push(`<span class="badge badge-new">Últimas unidades</span>`);
  const st = stagger ? ' data-animate data-animate-stagger style="transform:translateY(26px);opacity:0"' : '';
  return `<article class="prod-card"${st}>
    <div class="prod-badges">${badges.join('')}</div>
    <button class="wish-btn${Wish.has(p.id) ? ' active' : ''}" data-wish="${p.id}" aria-label="Guardar en favoritos">${ICON.heart}</button>
    <a class="prod-media" href="${BASE}producto/index.html?id=${p.id}" aria-label="${esc(p.nombre)}">
      <img src="${img(p.img)}" alt="${esc(p.marca)} ${esc(p.nombre)}" loading="lazy" width="1200" height="1200">
    </a>
    <div class="prod-body">
      <span class="prod-brand">${esc(p.marca)}</span>
      <h3 class="prod-name"><a href="${BASE}producto/index.html?id=${p.id}">${esc(p.nombre)}</a></h3>
      <div class="prod-price-row">
        <span class="prod-price">${formatearPrecio(pf)}</span>
        ${p.descuento > 0 ? `<s class="prod-price-old">${formatearPrecio(p.precio)}</s>` : ''}
      </div>
      <div class="prod-buttons">
        <button class="btn-add" data-add="${p.id}">${ICON.cart} Agregar</button>
        <button class="btn-buy" data-buy="${p.id}">Comprar ahora</button>
      </div>
    </div>
  </article>`;
}

/* =========================================================
   DRAWER CARRITO
   ========================================================= */
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));

function renderCart() {
  const items = Cart.get();
  const wrap = $('#drawerItems'); if (!wrap) return;
  const count = Cart.count();
  const cc = $('#cartCount'); if (cc) { cc.textContent = count; cc.hidden = count === 0; cc.classList.remove('bump'); void cc.offsetWidth; if (count) cc.classList.add('bump'); }
  const dCount = $('#drawerCount'); if (dCount) dCount.textContent = count;

  if (!items.length) {
    wrap.innerHTML = `<div class="cart-empty">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
      <b>Tu carrito está vacío</b>
      <p>Sumá tus productos favoritos y armá tu pedido.</p>
      <a href="${BASE}catalogo.html" class="btn btn-primary" style="margin-top:18px">Ver catálogo</a>
    </div>`;
    $('#drawerFoot').hidden = true;
    renderShipBar(0);
    return;
  }
  wrap.innerHTML = items.map(i => {
    const p = getProducto(i.id); if (!p) return '';
    const pf = precioFinal(p);
    return `<div class="cart-item">
      <img src="${img(p.img)}" alt="${esc(p.nombre)}" width="68" height="68">
      <div>
        <span class="ci-brand">${esc(p.marca)}</span>
        <div class="ci-name">${esc(p.nombre)}</div>
        <div class="ci-price">${formatearPrecio(pf)}</div>
        <div class="ci-controls">
          <div class="qty">
            <button data-dec="${p.id}" aria-label="Restar">−</button>
            <input type="text" inputmode="numeric" value="${i.qty}" data-qtyinput="${p.id}" aria-label="Cantidad">
            <button data-inc="${p.id}" aria-label="Sumar">+</button>
          </div>
          <button class="ci-remove" data-remove="${p.id}">${ICON.trash} Quitar</button>
        </div>
      </div>
      <b>${formatearPrecio(pf * i.qty)}</b>
    </div>`;
  }).join('');
  $('#drawerFoot').hidden = false;
  $('#drawerTotal').textContent = formatearPrecio(Cart.total());
  renderShipBar(Cart.total());
}

function renderShipBar(total) {
  const bar = $('#shipBar'); if (!bar) return;
  if (total >= ENVIO_GRATIS_DESDE) {
    bar.className = 'ship-bar free';
    bar.innerHTML = `<p>🎉 ¡Tenés <b>envío gratis</b> en Paraná!</p><div class="ship-track"><div class="ship-fill" style="width:100%"></div></div>`;
  } else {
    const falta = ENVIO_GRATIS_DESDE - total;
    const pct = Math.min(100, (total / ENVIO_GRATIS_DESDE) * 100);
    bar.className = 'ship-bar';
    bar.innerHTML = `<p>Te faltan <b>${formatearPrecio(falta)}</b> para el envío gratis en Paraná</p><div class="ship-track"><div class="ship-fill" style="width:${pct}%"></div></div>`;
  }
}

/* ---------- drawer open/close + focus trap ---------- */
let lastFocused = null;
function trapFocus(container, e) {
  const foco = container.querySelectorAll('a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])');
  if (!foco.length) return;
  const first = foco[0], last = foco[foco.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}
function openDrawer() {
  lastFocused = document.activeElement;
  $('#cartDrawer').classList.add('open');
  $('#cartDrawer').setAttribute('aria-hidden', 'false');
  $('#overlay').classList.add('open');
  window.lenis?.stop();
  document.body.style.overflow = 'hidden';
  setTimeout(() => $('#cartClose')?.focus(), 100);
}
function closeDrawer() {
  $('#cartDrawer').classList.remove('open');
  $('#cartDrawer').setAttribute('aria-hidden', 'true');
  $('#overlay').classList.remove('open');
  window.lenis?.start();
  document.body.style.overflow = '';
  lastFocused?.focus();
}

/* =========================================================
   ADD / BUY / delegación global
   ========================================================= */
function addToCart(id, qty = 1, open = false) {
  const p = getProducto(id); if (!p) return;
  Cart.add(p, qty);
  if (open) openDrawer();
  else showToast('¡Agregado! Tu carrito te espera 💄');
}

document.addEventListener('click', (e) => {
  const add = e.target.closest('[data-add]');
  const buy = e.target.closest('[data-buy]');
  const wish = e.target.closest('[data-wish]');
  const inc = e.target.closest('[data-inc]');
  const dec = e.target.closest('[data-dec]');
  const rem = e.target.closest('[data-remove]');
  if (add) { addToCart(add.dataset.add, 1, false); }
  if (buy) { addToCart(buy.dataset.buy, 1, true); }
  if (wish) { const on = Wish.toggle(wish.dataset.wish); wish.classList.toggle('active', on); showToast(on ? 'Guardado en favoritos ♥' : 'Quitado de favoritos'); }
  if (inc) { const it = Cart.get().find(i => i.id === inc.dataset.inc); Cart.setQty(inc.dataset.inc, (it?.qty || 1) + 1); }
  if (dec) { const it = Cart.get().find(i => i.id === dec.dataset.dec); Cart.setQty(dec.dataset.dec, (it?.qty || 1) - 1); }
  if (rem) { Cart.remove(rem.dataset.remove); }
});

document.addEventListener('input', (e) => {
  const qi = e.target.closest('[data-qtyinput]');
  if (qi) { const v = parseInt(qi.value.replace(/\D/g, ''), 10); if (!isNaN(v)) Cart.setQty(qi.dataset.qtyinput, v); }
});

document.addEventListener('cart:updated', renderCart);

/* =========================================================
   PÁGINA: HOME
   ========================================================= */
function initHome() {
  const destList = $('#destList');
  if (destList) {
    const destacados = PRODUCTOS.filter(p => p.destacado);
    destList.innerHTML = destacados.map(p => `<li class="splide__slide">${cardHTML(p, false)}</li>`).join('');
    if (typeof Splide !== 'undefined') {
      new Splide('#destSplide', {
        perPage: 4, gap: '20px', padding: { right: '6%' }, pagination: false, arrows: true,
        breakpoints: { 1024: { perPage: 3 }, 768: { perPage: 2, padding: { right: '12%' } }, 560: { perPage: 1, padding: { right: '22%' } } },
      }).mount();
    }
  }
  // mini-cards de productos en el hero túnel
  const heroCards = $('#heroProdCards');
  if (heroCards) {
    const picks = PRODUCTOS.filter(p => p.destacado).slice(0, 3);
    heroCards.innerHTML = picks.map(p => `<a class="mini-card" href="${BASE}producto/index.html?id=${p.id}">
      <img src="${img(p.img)}" alt="${esc(p.nombre)}" loading="lazy" width="190" height="190">
      <div class="mc-body"><span class="mc-cat">${esc(p.marca)}</span><span class="mc-name">${esc(p.nombre)}</span><span class="mc-price">${formatearPrecio(precioFinal(p))}</span></div>
    </a>`).join('');
  }
  // turno form
  const tf = $('#turnoForm');
  if (tf) tf.addEventListener('submit', (e) => {
    e.preventDefault();
    const d = new FormData(tf);
    const nombre = (d.get('nombre') || '').toString().trim() || 'Hola';
    const servicio = d.get('servicio') || 'Asesoría general';
    const dia = d.get('dia') ? new Date(d.get('dia') + 'T00:00').toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' }) : 'a coordinar';
    const hora = d.get('hora') || '';
    const extra = (d.get('mensaje') || '').toString().trim();
    let msg = `¡Hola Cosméticos Ar! Soy ${nombre} y quiero reservar una asesoría de belleza.\n\n• Servicio: ${servicio}\n• Día: ${dia}\n• Horario: ${hora}`;
    if (extra) msg += `\n• Detalle: ${extra}`;
    window.open(`https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
    showToast('¡Te llevamos a WhatsApp para confirmar! ✨');
  });
}

/* =========================================================
   PÁGINA: CATÁLOGO
   ========================================================= */
function initCatalog() {
  const grid = $('#catalogGrid'); if (!grid) return;
  const params = new URLSearchParams(location.search);
  const state = { cat: params.get('cat') || 'all', brand: 'all', offer: 'all', q: '', sort: 'destacados', shown: 12 };
  const PER = 12;

  // chips categorías
  const catChips = $('#catChips');
  catChips.innerHTML = `<button class="chip${state.cat === 'all' ? ' active' : ''}" data-cat="all">Todas <span class="chip-n">${PRODUCTOS.length}</span></button>` +
    CATEGORIAS.map(c => {
      const n = PRODUCTOS.filter(p => p.cat === c.id).length;
      return `<button class="chip${state.cat === c.id ? ' active' : ''}" data-cat="${c.id}">${esc(c.nombre)} <span class="chip-n">${n}</span></button>`;
    }).join('');
  // chips marca
  const marcas = [...new Set(PRODUCTOS.map(p => p.marca))];
  $('#brandChips').innerHTML = `<button class="chip active" data-brand="all">Todas</button>` +
    marcas.map(m => `<button class="chip" data-brand="${esc(m)}">${esc(m)} <span class="chip-n">${PRODUCTOS.filter(p => p.marca === m).length}</span></button>`).join('');

  function filtered() {
    let list = PRODUCTOS.slice();
    if (state.cat !== 'all') list = list.filter(p => p.cat === state.cat);
    if (state.brand !== 'all') list = list.filter(p => p.marca === state.brand);
    if (state.offer === 'sale') list = list.filter(p => p.descuento > 0);
    if (state.q) {
      const q = state.q.toLowerCase();
      list = list.filter(p => (p.nombre + ' ' + p.marca + ' ' + catNombre(p.cat)).toLowerCase().includes(q));
    }
    if (state.sort === 'precio-asc') list.sort((a, b) => precioFinal(a) - precioFinal(b));
    else if (state.sort === 'precio-desc') list.sort((a, b) => precioFinal(b) - precioFinal(a));
    else if (state.sort === 'nombre') list.sort((a, b) => a.nombre.localeCompare(b.nombre));
    else list.sort((a, b) => (b.destacado - a.destacado) || (b.descuento - a.descuento));
    return list;
  }

  function render() {
    const list = filtered();
    const visible = list.slice(0, state.shown);
    $('#catalogCount').innerHTML = `<b>${list.length}</b> ${list.length === 1 ? 'producto' : 'productos'}`;
    if (!list.length) {
      grid.innerHTML = `<div class="no-results">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <b>No encontramos productos</b>
        <p>Probá con otra búsqueda o quitá algún filtro.</p>
        <button class="btn btn-dark" id="clearFilters" style="margin-top:16px">Ver todo el catálogo</button>
      </div>`;
      $('#loadMore').hidden = true;
      $('#clearFilters')?.addEventListener('click', () => { state.cat = 'all'; state.brand = 'all'; state.offer = 'all'; state.q = ''; state.shown = PER; syncUI(); render(); });
      return;
    }
    grid.innerHTML = visible.map(p => cardHTML(p, true)).join('');
    $('#loadMore').hidden = state.shown >= list.length;
    refreshReveal();
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  }

  function syncUI() {
    $$('#catChips .chip').forEach(c => c.classList.toggle('active', c.dataset.cat === state.cat));
    $$('#brandChips .chip').forEach(c => c.classList.toggle('active', c.dataset.brand === state.brand));
    $$('[data-offer]').forEach(c => c.classList.toggle('active', c.dataset.offer === state.offer));
    updateHead();
  }

  function updateHead() {
    const title = state.cat === 'all' ? 'Todo el catálogo' : catNombre(state.cat);
    $('#catalogTitle').textContent = title;
    $('#crumbCat').textContent = title;
    document.title = `${title} — Cosméticos Ar`;
  }

  // eventos filtros
  catChips.addEventListener('click', e => { const b = e.target.closest('[data-cat]'); if (!b) return; state.cat = b.dataset.cat; state.shown = PER; syncUI(); render(); });
  $('#brandChips').addEventListener('click', e => { const b = e.target.closest('[data-brand]'); if (!b) return; state.brand = b.dataset.brand; state.shown = PER; syncUI(); render(); });
  $$('[data-offer]').forEach(b => b.addEventListener('click', () => { state.offer = b.dataset.offer; state.shown = PER; syncUI(); render(); }));
  let tmo; $('#searchInput').addEventListener('input', e => { clearTimeout(tmo); tmo = setTimeout(() => { state.q = e.target.value.trim(); state.shown = PER; render(); }, 220); });
  $('#sortSelect').addEventListener('change', e => { state.sort = e.target.value; render(); });
  $('#loadMore').addEventListener('click', () => { state.shown += PER; render(); });

  // filtros mobile
  const filters = $('#filters'), backdrop = $('#filtersBackdrop'), fToggle = $('#filterToggle');
  function openFilters() { filters.classList.add('open'); backdrop.classList.add('open'); fToggle.setAttribute('aria-expanded', 'true'); document.body.style.overflow = 'hidden'; }
  function closeFilters() { filters.classList.remove('open'); backdrop.classList.remove('open'); fToggle.setAttribute('aria-expanded', 'false'); document.body.style.overflow = ''; }
  fToggle?.addEventListener('click', openFilters);
  $('#filtersClose')?.addEventListener('click', closeFilters);
  backdrop?.addEventListener('click', closeFilters);
  filters?.addEventListener('click', e => { if (e.target.closest('.chip') && window.innerWidth <= 860) setTimeout(closeFilters, 150); });

  updateHead();
  render();
}

/* =========================================================
   PÁGINA: PRODUCTO
   ========================================================= */
function initProducto() {
  const cont = $('#pdpContent'); if (!cont) return;
  const id = new URLSearchParams(location.search).get('id');
  const p = getProducto(id);

  if (!p) {
    cont.innerHTML = `<div class="pdp-notfound">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      <h1>Producto no encontrado</h1>
      <p>Puede que ya no esté disponible o el enlace sea incorrecto.</p>
      <a href="${BASE}catalogo.html" class="btn btn-primary">Volver al catálogo</a>
    </div>`;
    return;
  }

  const pf = precioFinal(p);
  const cuota = Math.round(pf / 3);
  document.title = `${p.marca} ${p.nombre} — Cosméticos Ar`;
  const stockLow = p.stock <= 8;

  cont.innerHTML = `
    <nav class="breadcrumb" aria-label="Ruta"><a href="${BASE}index.html">Inicio</a> · <a href="${BASE}catalogo.html?cat=${p.cat}">${esc(catNombre(p.cat))}</a> · <span>${esc(p.nombre)}</span></nav>
    <div class="pdp-grid">
      <div class="pdp-gallery">
        <div class="pdp-main-img"><img src="${img(p.img)}" alt="${esc(p.marca)} ${esc(p.nombre)}" width="1200" height="1200"></div>
      </div>
      <div class="pdp-info">
        <span class="prod-brand">${esc(p.marca)}</span>
        <h1>${esc(p.nombre)}</h1>
        <div class="pdp-price-row">
          <span class="pdp-price">${formatearPrecio(pf)}</span>
          ${p.descuento > 0 ? `<s class="pdp-price-old">${formatearPrecio(p.precio)}</s><span class="pdp-price-badge">-${p.descuento}%</span>` : ''}
        </div>
        <p class="pdp-cuotas">o <b>3 cuotas sin interés</b> de ${formatearPrecio(cuota)}</p>
        <p class="pdp-desc">${esc(p.desc)}</p>
        <div class="pdp-stock ${stockLow ? 'low' : ''}"><span class="dot"></span>${stockLow ? `¡Últimas ${p.stock} unidades!` : 'Disponible · entrega en el día'}</div>
        <div class="pdp-buy-row">
          <div class="qty">
            <button id="pdpDec" aria-label="Restar">−</button>
            <input type="text" inputmode="numeric" value="1" id="pdpQty" aria-label="Cantidad">
            <button id="pdpInc" aria-label="Sumar">+</button>
          </div>
          <button class="btn btn-add" id="pdpAdd" style="padding:14px 24px">${ICON.cart} Agregar al carrito</button>
          <button class="btn btn-primary" id="pdpBuy">Comprar ahora</button>
          <button class="wish-btn${Wish.has(p.id) ? ' active' : ''}" data-wish="${p.id}" aria-label="Guardar en favoritos" style="position:static">${ICON.heart}</button>
        </div>
        <ul class="pdp-features">
          <li>${ICON.check}<span><b>100% original</b> — revendedora oficial ${esc(p.marca)}</span></li>
          <li>${ICON.check}<span><b>Envío en el día</b> en Paraná, gratis desde ${formatearPrecio(ENVIO_GRATIS_DESDE)}</span></li>
          <li>${ICON.check}<span><b>3 cuotas sin interés</b> con todas las tarjetas</span></li>
          <li>${ICON.check}<span><b>Asesoría gratis</b> — te ayudamos a elegir por WhatsApp</span></li>
        </ul>
      </div>
    </div>`;

  const qtyEl = $('#pdpQty');
  const getQty = () => Math.max(1, parseInt(qtyEl.value.replace(/\D/g, ''), 10) || 1);
  $('#pdpInc').addEventListener('click', () => qtyEl.value = Math.min(getQty() + 1, p.stock));
  $('#pdpDec').addEventListener('click', () => qtyEl.value = Math.max(1, getQty() - 1));
  qtyEl.addEventListener('input', () => { qtyEl.value = qtyEl.value.replace(/\D/g, ''); });
  qtyEl.addEventListener('blur', () => qtyEl.value = getQty());
  $('#pdpAdd').addEventListener('click', () => addToCart(p.id, getQty(), false));
  $('#pdpBuy').addEventListener('click', () => addToCart(p.id, getQty(), true));

  // vistos recientemente
  try {
    const K = 'cosmeticosar_vistos';
    let v = JSON.parse(localStorage.getItem(K)) || [];
    v = [p.id, ...v.filter(x => x !== p.id)].slice(0, 8);
    localStorage.setItem(K, JSON.stringify(v));
  } catch {}

  // relacionados
  const rel = PRODUCTOS.filter(x => x.cat === p.cat && x.id !== p.id).slice(0, 4);
  if (rel.length) {
    $('#relatedSection').hidden = false;
    $('#relatedGrid').innerHTML = rel.map(x => cardHTML(x, true)).join('');
  }

  // sticky add-to-cart mobile
  const sticky = $('#stickyAtc');
  if (sticky) {
    $('#saPrice').textContent = formatearPrecio(pf);
    $('#saName').textContent = p.nombre;
    sticky.hidden = false;
    $('#saAdd').addEventListener('click', () => addToCart(p.id, getQty(), true));
    const addBtn = $('#pdpAdd');
    if ('IntersectionObserver' in window && addBtn) {
      new IntersectionObserver(([e]) => {
        sticky.classList.toggle('show', !e.isIntersecting && e.boundingClientRect.top < 0);
      }, { threshold: 0 }).observe(addBtn);
    }
  }

  // JSON-LD Product
  const ld = document.createElement('script');
  ld.type = 'application/ld+json';
  ld.textContent = JSON.stringify({
    "@context": "https://schema.org", "@type": "Product",
    name: `${p.marca} ${p.nombre}`, brand: { "@type": "Brand", name: p.marca },
    description: p.desc, image: img(p.img), category: catNombre(p.cat),
    offers: { "@type": "Offer", price: pf, priceCurrency: "ARS", availability: "https://schema.org/InStock" }
  });
  document.head.appendChild(ld);
}

/* =========================================================
   ANIMACIONES (reveal + hero túnel)
   ========================================================= */
let revealST = [];
function refreshReveal() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    $$('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
    return;
  }
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    $$('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
    return;
  }
  $$('[data-animate]').forEach(el => {
    if (el.dataset.revealed) return;
    el.dataset.revealed = '1';
    const sib = el.parentElement ? Array.from(el.parentElement.children).filter(c => c.hasAttribute('data-animate-stagger')) : [];
    const idx = el.hasAttribute('data-animate-stagger') ? sib.indexOf(el) : 0;
    gsap.to(el, {
      opacity: 1, y: 0, scale: 1, duration: 0.85, ease: 'power3.out',
      delay: Math.min(idx, 6) * 0.09,
      scrollTrigger: { trigger: el, start: 'top 88%' }
    });
  });
}

function initHeroTunnel() {
  const hero = document.getElementById('hero');
  const animado = document.body.dataset.hero === 'animado';
  const iframe = document.getElementById('hero-bg');

  // clásico: nada de WebGL, reveals normales
  if (!animado) { refreshReveal(); return; }

  // cargar el WebGL solo en modo animado
  if (iframe && iframe.dataset.src && !iframe.src) iframe.src = iframe.dataset.src;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canTunnel = hero && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && !reduce;

  // puente de scroll → iframe
  if (iframe) {
    const post = () => {
      if (!hero) return;
      const r = hero.getBoundingClientRect();
      const max = hero.offsetHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, -r.top / max)) : 0;
      iframe.contentWindow?.postMessage({ type: 'scroll', progress }, '*');
    };
    window.addEventListener('scroll', post, { passive: true });
    window.addEventListener('resize', post);
    iframe.addEventListener('load', post);
    post();
    // pausar/reanudar el iframe fuera del hero
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([e]) => {
        iframe.style.visibility = e.isIntersecting ? 'visible' : 'hidden';
      }, { threshold: 0 }).observe(hero);
    }
  }

  if (!canTunnel) { refreshReveal(); return; }

  hero.classList.add('hero--tunnel');
  const beats = Array.from(hero.querySelectorAll('[data-beat]'));
  const floats = Array.from(hero.querySelectorAll('[data-float]'));
  const step = 1;

  const tl = gsap.timeline({
    scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom bottom', scrub: 0.6 }
  });

  beats.forEach((c, i) => {
    const last = i === beats.length - 1;
    const t0 = i * step;
    if (i === 0) {
      tl.to(c, { scale: 1.5, duration: step * 0.6, ease: "power1.in" }, t0 + step * 0.3)
        .to(c, { autoAlpha: 0, duration: step * 0.3, ease: "power2.in" }, t0 + step * 0.75);
    } else {
      gsap.set(c, { scale: 0.46, autoAlpha: 0, transformOrigin: "50% 50%" });
      tl.to(c, { autoAlpha: 1, duration: step * 0.2 }, t0)
        .to(c, { scale: 1, duration: step * 0.4, ease: "power1.in" }, t0);
      if (!last) tl.to(c, { scale: 1.55, duration: step * 0.45, ease: "power1.in" }, t0 + step)
        .to(c, { autoAlpha: 0, duration: step * 0.32 }, t0 + step * 1.05);
    }
  });

  // floats decorativos con amplitud propia (viajan por el medio del túnel)
  floats.forEach((f, i) => {
    const near = f.dataset.float === 'near';
    const start = 1.4 + i * 0.25;
    gsap.set(f, { scale: near ? 0.3 : 0.5, autoAlpha: 0 });
    tl.to(f, { autoAlpha: 1, duration: step * 0.25 }, start)
      .to(f, { scale: near ? 1.12 : 1, duration: step * 0.9, ease: 'none' }, start)
      .to(f, { scale: near ? 1.9 : 1.5, autoAlpha: 0, duration: step * 0.6, ease: 'power1.in' }, start + step * 1.1);
  });

  refreshReveal();
}

/* =========================================================
   UI GLOBAL (header, drawer, menú, esc)
   ========================================================= */
function initUI() {
  // carrito
  $('#cartToggle')?.addEventListener('click', openDrawer);
  $('#cartClose')?.addEventListener('click', closeDrawer);
  $('#overlay')?.addEventListener('click', closeDrawer);
  $('#checkoutBtn')?.addEventListener('click', () => {
    if (!Cart.count()) return;
    if (typeof confetti === 'function' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.7 }, colors: ['#c8202f', '#b98a54', '#1a1210', '#ffffff'] });
    }
    showToast('¡Genial! El pago online se activa al pasar la web a producción.');
  });

  // menú mobile
  const menuToggle = $('#menuToggle'), nav = $('#mainNav');
  menuToggle?.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', open);
    if (open) { window.lenis?.stop(); document.body.style.overflow = 'hidden'; }
    else { window.lenis?.start(); document.body.style.overflow = ''; }
  });
  nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    if (nav.classList.contains('open')) { nav.classList.remove('open'); menuToggle.setAttribute('aria-expanded', 'false'); window.lenis?.start(); document.body.style.overflow = ''; }
  }));

  // esc + focus trap
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if ($('#cartDrawer')?.classList.contains('open')) closeDrawer();
      if (nav?.classList.contains('open')) { nav.classList.remove('open'); menuToggle.setAttribute('aria-expanded', 'false'); window.lenis?.start(); document.body.style.overflow = ''; }
      const filters = $('#filters'); if (filters?.classList.contains('open')) { filters.classList.remove('open'); $('#filtersBackdrop')?.classList.remove('open'); document.body.style.overflow = ''; }
    }
    if (e.key === 'Tab' && $('#cartDrawer')?.classList.contains('open')) trapFocus($('#cartDrawer'), e);
  });

  // wsp float
  const wsp = $('#wsp-float');
  if (wsp) window.addEventListener('scroll', () => {
    if (window.scrollY > 600) wsp.classList.add('visible'); else wsp.classList.remove('visible');
  }, { passive: true });

  // nav activo por scroll (solo home) — mantener wishlist sincronizada
  document.addEventListener('wish:updated', () => {
    $$('[data-wish]').forEach(b => b.classList.toggle('active', Wish.has(b.dataset.wish)));
  });
}

/* =========================================================
   LENIS + BOOT
   ========================================================= */
function initMotion() {
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }
  if (typeof gsap === 'undefined') {
    document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
  }
  if (typeof Lenis !== 'undefined' && typeof gsap !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const lenis = new Lenis();
    window.lenis = lenis;
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    if (typeof ScrollTrigger !== 'undefined') lenis.on('scroll', ScrollTrigger.update);
  }
  if (typeof ScrollTrigger !== 'undefined') {
    window.addEventListener('load', () => ScrollTrigger.refresh());
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initMotion();
  initUI();
  renderCart();
  initHome();
  initCatalog();
  initProducto();
  initHeroTunnel();
});
