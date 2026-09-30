const WHATSAPP = '5491164014520';
const STORAGE_KEY = 'sabor-de-familia-demo-consulta';

// Categorías confirmadas en el brief. Las variedades y los precios se consultan.
const products = [
  { id: 'pizzas', category: 'pizzas', name: 'Pizzas', image: 'images/03_cuadrada_pizza.webp', number: '01', description: 'Para cortar en porciones y que nadie se quede sin la suya.', badge: 'Para compartir' },
  { id: 'hamburguesas', category: 'hamburguesas', name: 'Hamburguesas', image: 'images/04_cuadrada_hamburguesa.webp', number: '02', description: 'Ese clásico que siempre entra bien en cualquier plan.', badge: 'Un antojo clásico' },
  { id: 'milanesas', category: 'milanesas', name: 'Milanesas', image: 'images/05_cuadrada_milanesa.webp', number: '03', description: 'Hay variedad para elegir: contanos cuál te gustaría probar.', badge: 'Varias opciones' },
  { id: 'panchos', category: 'panchos', name: 'Panchos', image: 'images/panchos.webp', number: '04', description: 'Una opción fácil, rica y lista para disfrutar.', badge: 'Para darse un gusto' },
  { id: 'sandwiches', category: 'sandwiches', name: 'Sándwiches', image: 'images/sandwiches.webp', number: '05', description: 'Cuando querés algo abundante para seguir el día.', badge: 'Para cualquier momento' }
];

const productGrid = document.querySelector('#product-grid');
const emptyState = document.querySelector('#empty-state');
const searchInput = document.querySelector('#menu-search');
const filters = [...document.querySelectorAll('[data-filter]')];
const cartDialog = document.querySelector('#cart-dialog');
const cartItems = document.querySelector('#cart-items');
const cartCount = document.querySelector('#cart-count');
const cartButton = document.querySelector('#floating-cart');
const cartSend = document.querySelector('#cart-send');
const cartNote = document.querySelector('#cart-note');
let currentFilter = 'todos';
let cart = {};

try {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  if (saved && typeof saved === 'object' && !Array.isArray(saved)) {
    for (const product of products) {
      const quantity = Number(saved[product.id]);
      if (Number.isInteger(quantity) && quantity > 0 && quantity <= 99) cart[product.id] = quantity;
    }
  }
} catch (_) { /* La demo sigue funcionando si el almacenamiento está deshabilitado. */ }

function normalized(value) {
  return String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function renderProducts() {
  const term = normalized(searchInput.value.trim());
  const visible = products.filter(product =>
    (currentFilter === 'todos' || product.category === currentFilter) &&
    normalized(`${product.name} ${product.description}`).includes(term)
  );

  productGrid.innerHTML = visible.map(product => `
    <article class="product-card">
      <div class="product-media"><img src="${product.image}" alt="${product.name} de Sabor de familia" width="1254" height="1254" loading="lazy"><span class="product-badge">${product.badge}</span></div>
      <div class="product-info"><span class="product-number">${product.number} / LA CARTA</span><h3>${product.name}</h3><p>${product.description}</p><div class="product-bottom"><span>Variedades y precios a consultar</span><button class="add-button" type="button" data-add="${product.id}" aria-label="Sumar ${product.name} a mi consulta">＋</button></div></div>
    </article>`).join('');
  emptyState.hidden = visible.length > 0;
}

function persistCart() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cart)); } catch (_) {}
}

function updateCart() {
  const count = Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);
  cartCount.textContent = count;
  cartButton.setAttribute('aria-label', `Abrir mi consulta, ${count} ${count === 1 ? 'producto' : 'productos'}`);
  cartSend.disabled = count === 0;

  const selected = products.filter(product => cart[product.id]);
  cartItems.innerHTML = selected.length ? selected.map(product => `
    <div class="cart-item"><img src="${product.image}" alt="" width="58" height="58"><div class="cart-item-main"><strong>${product.name}</strong><small>Variedad a confirmar</small></div><div class="cart-qty"><button type="button" data-decrease="${product.id}" aria-label="Quitar una unidad de ${product.name}">−</button><span>${cart[product.id]}</span><button type="button" data-increase="${product.id}" aria-label="Sumar una unidad de ${product.name}">＋</button></div></div>`).join('') : '<div class="cart-empty"><span aria-hidden="true">✳</span>Tu consulta está vacía.<br>Elegí algo rico de la carta.</div>';
  persistCart();
}

function changeQuantity(id, difference) {
  if (!products.some(product => product.id === id)) return;
  cart[id] = Math.min(99, Math.max(0, (cart[id] || 0) + difference));
  if (!cart[id]) delete cart[id];
  updateCart();
}

filters.forEach(button => button.addEventListener('click', () => {
  currentFilter = button.dataset.filter;
  filters.forEach(filter => {
    const active = filter === button;
    filter.classList.toggle('active', active);
    filter.setAttribute('aria-pressed', String(active));
  });
  renderProducts();
}));

searchInput.addEventListener('input', renderProducts);
document.querySelector('#clear-filters').addEventListener('click', () => {
  searchInput.value = '';
  filters[0].click();
  searchInput.focus();
});

productGrid.addEventListener('click', event => {
  const button = event.target.closest('[data-add]');
  if (!button) return;
  changeQuantity(button.dataset.add, 1);
  button.classList.add('added');
  button.textContent = '✓';
  window.setTimeout(() => { button.classList.remove('added'); button.textContent = '＋'; }, 800);
});

cartItems.addEventListener('click', event => {
  const increase = event.target.closest('[data-increase]');
  const decrease = event.target.closest('[data-decrease]');
  if (increase) changeQuantity(increase.dataset.increase, 1);
  if (decrease) changeQuantity(decrease.dataset.decrease, -1);
});

cartButton.addEventListener('click', () => cartDialog.showModal());
document.querySelector('.cart-close').addEventListener('click', () => cartDialog.close());
cartDialog.addEventListener('click', event => { if (event.target === cartDialog) cartDialog.close(); });

cartSend.addEventListener('click', () => {
  const lines = products.filter(product => cart[product.id]).map(product => `• ${cart[product.id]} × ${product.name}`);
  if (!lines.length) return;
  const note = cartNote.value.trim();
  const message = [
    'Hola, quiero consultar por un pedido en Sabor de familia:',
    '',
    ...lines,
    ...(note ? ['', `Variedad o detalle: ${note}`] : []),
    '',
    '¿Me confirman disponibilidad, precios y entrega?'
  ].join('\n');
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
});

const menuToggle = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('#mobile-nav');
menuToggle.addEventListener('click', () => {
  const opening = mobileNav.hidden;
  mobileNav.hidden = !opening;
  menuToggle.setAttribute('aria-expanded', String(opening));
  menuToggle.setAttribute('aria-label', opening ? 'Cerrar menú' : 'Abrir menú');
});
mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  mobileNav.hidden = true;
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Abrir menú');
}));

document.querySelector('#year').textContent = new Date().getFullYear();
renderProducts();
updateCart();
