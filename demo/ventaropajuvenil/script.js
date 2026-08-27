const PRODUCTS = [
  { id: 'bomber-roja', name: 'Bomber Impact', price: 69900, image: 'images/producto-bomber.jpg', category: 'abrigos', categoryLabel: 'Abrigos', sizes: ['S', 'M', 'L'], tag: 'NUEVO' },
  { id: 'crop-racing', name: 'Top Racing', price: 32900, image: 'images/producto-crop.jpg', category: 'tops', categoryLabel: 'Tops', sizes: ['XS', 'S', 'M', 'L'], tag: 'BEST SELLER' },
  { id: 'hoodie-red', name: 'Hoodie Red Mood', price: 58900, image: 'images/producto-hoodie.jpg', category: 'abrigos', categoryLabel: 'Abrigos', sizes: ['S', 'M', 'L', 'XL'], tag: 'DROP 01' },
  { id: 'jean-wide', name: 'Jean Wide Energy', price: 64900, image: 'images/producto-jean.jpg', category: 'denim', categoryLabel: 'Denim', sizes: ['34', '36', '38', '40', '42', '44'], tag: 'TREND' },
  { id: 'remera-graphic', name: 'Remera Graphic Oversize', price: 38900, image: 'images/producto-remera.jpg', category: 'remeras', categoryLabel: 'Remeras', sizes: ['S', 'M', 'L', 'XL'], tag: 'OVERSIZE' },
  { id: 'vestido-roses', name: 'Vestido Midnight Roses', price: 54900, image: 'images/producto-vestido.webp', category: 'vestidos', categoryLabel: 'Vestidos', sizes: ['XS', 'S', 'M', 'L'], tag: 'NOCHE' }
];

const STORAGE_KEY = 'ventaropajuvenil_cart_v1';
const WHATSAPP_NUMBER = '5491122340057';
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.site-nav');
const drawer = document.querySelector('#cart-drawer');
const backdrop = document.querySelector('#cart-backdrop');
const productGrid = document.querySelector('#product-grid');
const emptyProducts = document.querySelector('#empty-products');
const searchInput = document.querySelector('#product-search');
const sortSelect = document.querySelector('#product-sort');
const resultCount = document.querySelector('#result-count');
const cartBody = document.querySelector('#cart-body');
const cartTotal = document.querySelector('#cart-total');
let activeCategory = 'todos';
let lastFocusedElement = null;
let cart = loadCart();

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;'
  }[character]));
}

function formatPrice(value) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency', currency: 'ARS', maximumFractionDigits: 0
  }).format(value);
}

function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    if (!Array.isArray(saved)) return [];
    return saved.filter((item) => (
      PRODUCTS.some((product) => product.id === item.id)
      && typeof item.size === 'string'
      && Number.isInteger(item.qty)
      && item.qty > 0
    ));
  } catch {
    return [];
  }
}

function saveCart() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}

function getProduct(productId) {
  return PRODUCTS.find((product) => product.id === productId);
}

function renderProducts() {
  if (!productGrid) return;
  const query = searchInput?.value.trim().toLocaleLowerCase('es') || '';
  const sort = sortSelect?.value || 'featured';
  let visibleProducts = PRODUCTS.filter((product) => {
    const matchesCategory = activeCategory === 'todos' || product.category === activeCategory;
    const haystack = `${product.name} ${product.categoryLabel} ${product.tag}`.toLocaleLowerCase('es');
    return matchesCategory && haystack.includes(query);
  });

  if (sort === 'price-asc') visibleProducts.sort((a, b) => a.price - b.price);
  if (sort === 'price-desc') visibleProducts.sort((a, b) => b.price - a.price);

  productGrid.innerHTML = visibleProducts.map((product) => `
    <article class="product-card reveal is-visible" data-category="${escapeHtml(product.category)}">
      <div class="product-media">
        <img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}" loading="lazy" width="560" height="700">
        <span class="product-tag">${escapeHtml(product.tag)}</span>
      </div>
      <div class="product-info">
        <div class="product-line"><h3>${escapeHtml(product.name)}</h3><strong>${formatPrice(product.price)}</strong></div>
        <p class="product-category">${escapeHtml(product.categoryLabel)}</p>
        <div class="product-actions">
          <label><span class="sr-only">Talle de ${escapeHtml(product.name)}</span><select data-size aria-label="Elegir talle de ${escapeHtml(product.name)}">${product.sizes.map((size) => `<option value="${escapeHtml(size)}">Talle ${escapeHtml(size)}</option>`).join('')}</select></label>
          <button type="button" data-add="${escapeHtml(product.id)}">Agregar</button>
        </div>
      </div>
    </article>
  `).join('');

  if (resultCount) resultCount.textContent = String(visibleProducts.length);
  if (emptyProducts) emptyProducts.hidden = visibleProducts.length > 0;
  productGrid.hidden = visibleProducts.length === 0;
}

function addToCart(productId, size) {
  const product = getProduct(productId);
  if (!product) return;
  const selectedSize = product.sizes.includes(size) ? size : product.sizes[0];
  const existingItem = cart.find((item) => item.id === productId && item.size === selectedSize);
  if (existingItem) existingItem.qty += 1;
  else cart.push({ id: productId, size: selectedSize, qty: 1 });
  saveCart();
  renderCart();
  openCart();
}

function changeQuantity(productId, size, difference) {
  const item = cart.find((cartItem) => cartItem.id === productId && cartItem.size === size);
  if (!item) return;
  item.qty += difference;
  if (item.qty <= 0) cart = cart.filter((cartItem) => !(cartItem.id === productId && cartItem.size === size));
  saveCart();
  renderCart();
}

function removeCartItem(productId, size) {
  cart = cart.filter((item) => !(item.id === productId && item.size === size));
  saveCart();
  renderCart();
}

function renderCart() {
  const itemCount = cart.reduce((total, item) => total + item.qty, 0);
  document.querySelectorAll('[data-cart-count]').forEach((counter) => { counter.textContent = String(itemCount); });
  const total = cart.reduce((sum, item) => {
    const product = getProduct(item.id);
    return sum + (product ? product.price * item.qty : 0);
  }, 0);
  if (cartTotal) cartTotal.textContent = formatPrice(total);
  if (!cartBody) return;

  if (cart.length === 0) {
    cartBody.innerHTML = '<div class="cart-empty"><strong>TU BOLSA ESTÁ VACÍA.</strong><p>Elegí una prenda y empezá a armar tu look.</p><a class="button button-dark" href="#tienda" data-close-cart>Ver productos</a></div>';
    return;
  }

  cartBody.innerHTML = cart.map((item) => {
    const product = getProduct(item.id);
    if (!product) return '';
    return `
      <article class="cart-item">
        <img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}" width="78" height="96">
        <div class="cart-item-info"><strong>${escapeHtml(product.name)}</strong><small>Talle ${escapeHtml(item.size)}</small><span>${formatPrice(product.price * item.qty)}</span></div>
        <div class="cart-item-controls">
          <button type="button" data-remove="${escapeHtml(product.id)}" data-size="${escapeHtml(item.size)}">Quitar</button>
          <div class="qty-control">
            <button type="button" aria-label="Quitar una unidad" data-qty="-1" data-product="${escapeHtml(product.id)}" data-size="${escapeHtml(item.size)}">−</button>
            <span>${item.qty}</span>
            <button type="button" aria-label="Agregar una unidad" data-qty="1" data-product="${escapeHtml(product.id)}" data-size="${escapeHtml(item.size)}">+</button>
          </div>
        </div>
      </article>`;
  }).join('');
}

function openCart() {
  if (!drawer || !backdrop) return;
  lastFocusedElement = document.activeElement;
  drawer.removeAttribute('inert');
  drawer.classList.add('is-open');
  backdrop.classList.add('is-open');
  document.body.classList.add('is-locked');
  drawer.querySelector('#cart-close')?.focus();
}

function closeCart() {
  if (!drawer || !backdrop) return;
  drawer.classList.remove('is-open');
  backdrop.classList.remove('is-open');
  drawer.setAttribute('inert', '');
  document.body.classList.remove('is-locked');
  if (lastFocusedElement instanceof HTMLElement) lastFocusedElement.focus();
}

function setCategory(category) {
  activeCategory = category;
  document.querySelectorAll('[data-filter]').forEach((button) => {
    const isActive = button.dataset.filter === category;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });
  renderProducts();
}

function checkoutOnWhatsApp() {
  if (cart.length === 0) { openCart(); return; }
  const lines = cart.map((item) => {
    const product = getProduct(item.id);
    return product ? `- ${item.qty}x ${product.name} · Talle ${item.size} · ${formatPrice(product.price * item.qty)}` : '';
  }).filter(Boolean);
  const total = cart.reduce((sum, item) => {
    const product = getProduct(item.id);
    return sum + (product ? product.price * item.qty : 0);
  }, 0);
  const message = ['Hola, quiero hacer este pedido en VentaRopaJuvenil:', '', ...lines, '', `Total: ${formatPrice(total)}`, '', '¿Me confirmás disponibilidad y cómo coordinamos?'].join('\n');
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
}

menuButton?.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  navigation?.classList.toggle('is-open', !isOpen);
});

navigation?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  menuButton?.setAttribute('aria-expanded', 'false');
  navigation.classList.remove('is-open');
}));

document.querySelector('#cart-open')?.addEventListener('click', openCart);
document.querySelector('#cart-close')?.addEventListener('click', closeCart);
backdrop?.addEventListener('click', closeCart);
document.querySelector('#checkout')?.addEventListener('click', checkoutOnWhatsApp);

document.addEventListener('click', (event) => {
  const addButton = event.target.closest('[data-add]');
  if (addButton) {
    const card = addButton.closest('.product-card');
    addToCart(addButton.dataset.add, card?.querySelector('[data-size]')?.value || 'M');
    return;
  }
  const quantityButton = event.target.closest('[data-qty]');
  if (quantityButton) {
    changeQuantity(quantityButton.dataset.product, quantityButton.dataset.size, Number(quantityButton.dataset.qty));
    return;
  }
  const removeButton = event.target.closest('[data-remove]');
  if (removeButton) {
    removeCartItem(removeButton.dataset.remove, removeButton.dataset.size);
    return;
  }
  if (event.target.closest('[data-close-cart]')) closeCart();
});

document.querySelectorAll('[data-filter]').forEach((button) => {
  button.setAttribute('aria-pressed', String(button.dataset.filter === activeCategory));
  button.addEventListener('click', () => setCategory(button.dataset.filter));
});
document.querySelectorAll('[data-category-link]').forEach((link) => link.addEventListener('click', () => setCategory(link.dataset.categoryLink)));
searchInput?.addEventListener('input', renderProducts);
sortSelect?.addEventListener('change', renderProducts);
document.querySelector('#clear-filters')?.addEventListener('click', () => {
  if (searchInput) searchInput.value = '';
  if (sortSelect) sortSelect.value = 'featured';
  setCategory('todos');
});
document.querySelector('[data-focus-search]')?.addEventListener('click', () => {
  document.querySelector('#tienda')?.scrollIntoView({ behavior: 'smooth' });
  window.setTimeout(() => searchInput?.focus(), 500);
});

document.querySelectorAll('.faq details').forEach((detail) => {
  detail.addEventListener('toggle', () => {
    const icon = detail.querySelector('summary span');
    if (icon) icon.textContent = detail.open ? '−' : '+';
    if (!detail.open) return;
    document.querySelectorAll('.faq details').forEach((otherDetail) => { if (otherDetail !== detail) otherDetail.open = false; });
  });
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && drawer?.classList.contains('is-open')) closeCart();
});

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      currentObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
} else {
  document.querySelectorAll('.reveal').forEach((element) => element.classList.add('is-visible'));
}

const year = document.querySelector('#year');
if (year) year.textContent = String(new Date().getFullYear());
renderProducts();
renderCart();
