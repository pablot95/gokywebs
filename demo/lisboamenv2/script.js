const PRODUCTS = [
  { id: 1, name: "Remera Essential Black", category: "Remeras", price: 32900, image: "images/product-tee-black.png", badge: "Nuevo", description: "Remera oversize de algodón pesado, cuello reforzado y caída amplia.", sizes: ["S", "M", "L", "XL"], tags: "negra basica algodon oversized" },
  { id: 2, name: "Remera Cable Grey", category: "Remeras", price: 34900, image: "images/product-tee-gray.png", badge: "Más elegida", description: "Calce boxy en gris cable, tacto suave y estructura premium.", sizes: ["S", "M", "L"], tags: "gris cable boxy urbana" },
  { id: 3, name: "Remera Washed Carbon", category: "Remeras", price: 36900, image: "images/product-tee-black.png", badge: "", description: "Acabado lavado artesanal y fit relajado para uso diario.", sizes: ["M", "L", "XL"], tags: "lavada carbon vintage" },
  { id: 4, name: "Remera Lisboa Core", category: "Remeras", price: 37900, image: "images/product-tee-gray.png", badge: "Drop 01", description: "Una silueta limpia y pesada inspirada en el streetwear europeo.", sizes: ["S", "M", "L", "XL"], tags: "lisboa core gris premium" },
  { id: 5, name: "Hoodie Rua Washed", category: "Hoodies", price: 58900, image: "images/product-hoodie-washed.png", badge: "Nuevo", description: "Buzo oversize frizado con capucha doble y terminación washed.", sizes: ["M", "L", "XL"], tags: "buzo canguro lavado capucha" },
  { id: 6, name: "Hoodie Crown Heavy", category: "Hoodies", price: 62900, image: "images/product-hoodie-washed.png", badge: "Edición limitada", description: "Hoodie de alto gramaje, hombro caído y volumen controlado.", sizes: ["S", "M", "L"], tags: "crown pesado premium negro" },
  { id: 7, name: "Buzo Cable Crew", category: "Hoodies", price: 54900, image: "images/product-hoodie-washed.png", badge: "", description: "Cuello redondo, puños firmes y fit amplio en tono cable.", sizes: ["S", "M", "L", "XL"], tags: "buzo sin capucha crew gris" },
  { id: 8, name: "Cargo Alfama Wide", category: "Pantalones", price: 56900, image: "images/product-cargo.png", badge: "Más elegido", description: "Pantalón cargo wide leg con bolsillos funcionales y cintura regulable.", sizes: ["S", "M", "L", "XL"], tags: "cargo wide negro alfama" },
  { id: 9, name: "Cargo Bairro Black", category: "Pantalones", price: 59900, image: "images/product-cargo.png", badge: "", description: "Silueta recta amplia en gabardina resistente de uso urbano.", sizes: ["M", "L", "XL"], tags: "pantalon gabardina black recto" },
  { id: 10, name: "Long Sleeve Noite", category: "Remeras", price: 42900, image: "images/product-long-black.png", badge: "", description: "Manga larga oversize con puño suave y largo extendido.", sizes: ["S", "M", "L"], tags: "manga larga noite" },
  { id: 11, name: "Long Sleeve Concrete", category: "Remeras", price: 44900, image: "images/product-long-black.png", badge: "Drop 01", description: "Remera de manga larga pesada con presencia y movimiento.", sizes: ["M", "L", "XL"], tags: "manga larga concrete pesada" },
  { id: 12, name: "Bermuda Tejo Wide", category: "Bermudas", price: 41900, image: "images/product-bermuda.png", badge: "Nuevo", description: "Bermuda amplia de largo bajo rodilla y cintura cómoda.", sizes: ["S", "M", "L", "XL"], tags: "bermuda wide tejo negra" },
  { id: 13, name: "Bermuda Rua Cargo", category: "Bermudas", price: 44900, image: "images/product-bermuda.png", badge: "", description: "Bermuda cargo con bolsillos laterales y calce suelto.", sizes: ["M", "L", "XL"], tags: "short cargo rua bolsillo" },
  { id: 14, name: "Remera Drop 01", category: "Remeras", price: 35900, image: "images/product-tee-black.png", badge: "Últimas unidades", description: "Remera negra esencial del primer drop Lisboa Men.", sizes: ["S", "M"], tags: "drop uno negra limitada" },
  { id: 15, name: "Hoodie Linha Zero", category: "Hoodies", price: 64900, image: "images/product-hoodie-washed.png", badge: "", description: "Volumen extra, frisa compacta y terminaciones reforzadas.", sizes: ["L", "XL"], tags: "hoodie linha zero amplio" },
  { id: 16, name: "Cargo LX Utility", category: "Pantalones", price: 61900, image: "images/product-cargo.png", badge: "Nuevo", description: "Cargo utilitario con seis bolsillos y ajuste en botamangas.", sizes: ["S", "M", "L"], tags: "cargo utility seis bolsillos" }
];

const WHATSAPP_NUMBER = "5493424226186";
const CART_KEY = "lisboamen_demo_cart";
const currency = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });

const state = { query: "", category: "Todos", size: "", price: "", sort: "featured", limit: 12 };
let cart = loadCart();
let activeProduct = null;

const $ = (selector, context = document) => context.querySelector(selector);
const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];

function normalizeText(value) {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_KEY));
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  renderCart();
}

function filteredProducts() {
  const query = normalizeText(state.query.trim());
  const result = PRODUCTS.filter((product) => {
    const searchable = normalizeText(`${product.name} ${product.category} ${product.description} ${product.tags}`);
    const matchesQuery = !query || searchable.includes(query);
    const matchesCategory = state.category === "Todos" || product.category === state.category;
    const matchesSize = !state.size || product.sizes.includes(state.size);
    const matchesPrice = !state.price || (
      (state.price === "under40" && product.price < 40000) ||
      (state.price === "40to55" && product.price >= 40000 && product.price <= 55000) ||
      (state.price === "over55" && product.price > 55000)
    );
    return matchesQuery && matchesCategory && matchesSize && matchesPrice;
  });

  return result.sort((a, b) => {
    if (state.sort === "price-asc") return a.price - b.price;
    if (state.sort === "price-desc") return b.price - a.price;
    if (state.sort === "name") return a.name.localeCompare(b.name);
    return a.id - b.id;
  });
}

function productCard(product) {
  const options = product.sizes.map((size) => `<option value="${size}"${size === "M" ? " selected" : ""}>Talle ${size}</option>`).join("");
  return `
    <article class="product-card reveal" data-id="${product.id}">
      <button class="product-image-button" type="button" data-action="open" aria-label="Ver detalle de ${product.name}">
        <img src="${product.image}" alt="${product.name}" loading="lazy" width="900" height="900">
        ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ""}
      </button>
      <div class="product-info">
        <p class="product-category">${product.category}</p>
        <button class="product-title" type="button" data-action="open">${product.name}</button>
        <p class="product-price">${currency.format(product.price)}</p>
        <div class="card-controls">
          <label class="sr-only" for="size-${product.id}">Talle</label>
          <select id="size-${product.id}" class="card-size">${options}</select>
          <div class="quantity-control" aria-label="Cantidad">
            <button type="button" data-action="decrease" aria-label="Restar unidad">−</button>
            <output aria-live="polite">1</output>
            <button type="button" data-action="increase" aria-label="Sumar unidad">+</button>
          </div>
        </div>
        <button class="add-button" type="button" data-action="add">Agregar al carrito</button>
      </div>
    </article>`;
}

function renderProducts() {
  const products = filteredProducts();
  const visible = products.slice(0, state.limit);
  const grid = $("#product-grid");
  grid.innerHTML = visible.length ? visible.map(productCard).join("") : `
    <div class="empty-results">
      <p>No encontramos prendas con esos filtros.</p>
      <button type="button" class="text-button" data-reset-filters>Limpiar filtros</button>
    </div>`;
  $("#result-count").textContent = `${products.length} ${products.length === 1 ? "producto" : "productos"}`;
  const loadMore = $("#load-more");
  loadMore.hidden = visible.length >= products.length;
  observeReveals();
}

function resetFilters() {
  state.query = "";
  state.category = "Todos";
  state.size = "";
  state.price = "";
  state.sort = "featured";
  state.limit = 12;
  $("#catalog-search").value = "";
  $("#size-filter").value = "";
  $("#price-filter").value = "";
  $("#sort-filter").value = "featured";
  $$("[data-category]").forEach((button) => button.classList.toggle("active", button.dataset.category === "Todos"));
  renderProducts();
}

function addToCart(product, size, quantity = 1) {
  const key = `${product.id}-${size}`;
  const existing = cart.find((item) => item.key === key);
  if (existing) existing.quantity += quantity;
  else cart.push({ key, productId: product.id, size, quantity });
  saveCart();
  showToast(`${product.name} se agregó al carrito`);
}

function cartDetails(item) {
  return { ...item, product: PRODUCTS.find((product) => product.id === item.productId) };
}

function renderCart() {
  cart = cart.filter((item) => PRODUCTS.some((product) => product.id === item.productId) && item.quantity > 0);
  const detailed = cart.map(cartDetails);
  const count = detailed.reduce((sum, item) => sum + item.quantity, 0);
  const total = detailed.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  $$("[data-cart-count]").forEach((element) => {
    element.textContent = count;
    element.hidden = count === 0;
  });
  $("#cart-total").textContent = currency.format(total);
  $("#checkout-whatsapp").disabled = count === 0;
  $("#cart-items").innerHTML = detailed.length ? detailed.map((item) => `
    <article class="cart-item" data-key="${item.key}">
      <img src="${item.product.image}" alt="" width="96" height="96">
      <div class="cart-item-info">
        <h3>${item.product.name}</h3>
        <p>Talle ${item.size} · ${currency.format(item.product.price)}</p>
        <div class="cart-item-actions">
          <div class="quantity-control">
            <button type="button" data-cart-action="decrease" aria-label="Restar unidad">−</button>
            <output>${item.quantity}</output>
            <button type="button" data-cart-action="increase" aria-label="Sumar unidad">+</button>
          </div>
          <button type="button" class="remove-item" data-cart-action="remove">Eliminar</button>
        </div>
      </div>
    </article>`).join("") : `
      <div class="empty-cart">
        <p>Tu carrito está vacío.</p>
        <span>Elegí tus prendas y armá el pedido.</span>
      </div>`;
}

function openCart() {
  $("#cart-drawer").classList.add("open");
  $("#cart-overlay").classList.add("open");
  $("#cart-drawer").setAttribute("aria-hidden", "false");
  document.body.classList.add("locked");
  $("#close-cart").focus();
}

function closeCart() {
  $("#cart-drawer").classList.remove("open");
  $("#cart-overlay").classList.remove("open");
  $("#cart-drawer").setAttribute("aria-hidden", "true");
  document.body.classList.remove("locked");
}

function openProduct(product) {
  activeProduct = product;
  $("#modal-image").src = product.image;
  $("#modal-image").alt = product.name;
  $("#modal-category").textContent = product.category;
  $("#modal-title").textContent = product.name;
  $("#modal-price").textContent = currency.format(product.price);
  $("#modal-description").textContent = product.description;
  $("#modal-sizes").innerHTML = product.sizes.map((size) => `<button type="button" data-modal-size="${size}" class="${size === "M" ? "active" : ""}">${size}</button>`).join("");
  $("#modal-quantity").value = "1";
  $("#product-modal").showModal();
}

function checkoutWhatsApp() {
  if (!cart.length) return;
  const detailed = cart.map(cartDetails);
  const total = detailed.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const lines = detailed.map((item) => `• ${item.quantity}x ${item.product.name} — talle ${item.size} — ${currency.format(item.product.price * item.quantity)}`);
  const message = ["Hola Lisboa Men, quiero hacer este pedido:", "", ...lines, "", `Total: ${currency.format(total)}`, "", "¿Me confirman disponibilidad y formas de pago?"];
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message.join("\n"))}`, "_blank", "noopener,noreferrer");
}

let toastTimer;
function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2400);
}

function observeReveals() {
  if (!("IntersectionObserver" in window)) return $$(".reveal").forEach((item) => item.classList.add("visible"));
  if (!window.revealObserver) {
    window.revealObserver = new IntersectionObserver((entries, observer) => entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    }), { threshold: 0.08 });
  }
  $$(".reveal:not(.visible)").forEach((item) => window.revealObserver.observe(item));
}

$("#product-grid").addEventListener("click", (event) => {
  const card = event.target.closest(".product-card");
  if (!card) return;
  const action = event.target.closest("[data-action]")?.dataset.action;
  if (!action) return;
  const product = PRODUCTS.find((item) => item.id === Number(card.dataset.id));
  const output = $(".quantity-control output", card);
  let quantity = Number(output?.textContent || 1);
  if (action === "open") openProduct(product);
  if (action === "increase") output.textContent = Math.min(quantity + 1, 10);
  if (action === "decrease") output.textContent = Math.max(quantity - 1, 1);
  if (action === "add") {
    addToCart(product, $(".card-size", card).value, quantity);
    output.textContent = "1";
  }
});

$("#product-grid").addEventListener("click", (event) => {
  if (event.target.matches("[data-reset-filters]")) resetFilters();
});

$("#catalog-search").addEventListener("input", (event) => { state.query = event.target.value; state.limit = 12; renderProducts(); });
$("#size-filter").addEventListener("change", (event) => { state.size = event.target.value; state.limit = 12; renderProducts(); });
$("#price-filter").addEventListener("change", (event) => { state.price = event.target.value; state.limit = 12; renderProducts(); });
$("#sort-filter").addEventListener("change", (event) => { state.sort = event.target.value; renderProducts(); });
$("#clear-filters").addEventListener("click", resetFilters);
$("#load-more").addEventListener("click", () => { state.limit += 8; renderProducts(); });

$$("[data-category]").forEach((button) => button.addEventListener("click", () => {
  state.category = button.dataset.category;
  state.limit = 12;
  $$("[data-category]").forEach((item) => item.classList.toggle("active", item === button));
  renderProducts();
}));

$$("[data-open-cart]").forEach((button) => button.addEventListener("click", openCart));
$("#close-cart").addEventListener("click", closeCart);
$("#cart-overlay").addEventListener("click", closeCart);
$("#checkout-whatsapp").addEventListener("click", checkoutWhatsApp);

$("#cart-items").addEventListener("click", (event) => {
  const itemElement = event.target.closest(".cart-item");
  const action = event.target.closest("[data-cart-action]")?.dataset.cartAction;
  if (!itemElement || !action) return;
  const item = cart.find((entry) => entry.key === itemElement.dataset.key);
  if (action === "increase") item.quantity = Math.min(item.quantity + 1, 99);
  if (action === "decrease") item.quantity -= 1;
  if (action === "remove" || item.quantity <= 0) cart = cart.filter((entry) => entry.key !== item.key);
  saveCart();
});

$("#close-modal").addEventListener("click", () => $("#product-modal").close());
$("#product-modal").addEventListener("click", (event) => {
  if (event.target === $("#product-modal")) $("#product-modal").close();
  const size = event.target.closest("[data-modal-size]");
  if (size) $$("[data-modal-size]", $("#modal-sizes")).forEach((button) => button.classList.toggle("active", button === size));
});
$("#modal-minus").addEventListener("click", () => { $("#modal-quantity").value = Math.max(Number($("#modal-quantity").value) - 1, 1); });
$("#modal-plus").addEventListener("click", () => { $("#modal-quantity").value = Math.min(Number($("#modal-quantity").value) + 1, 10); });
$("#modal-add").addEventListener("click", () => {
  const size = $("[data-modal-size].active")?.dataset.modalSize || "M";
  addToCart(activeProduct, size, Number($("#modal-quantity").value));
  $("#product-modal").close();
});

const menuButton = $("#menu-button");
const mobileMenu = $("#mobile-menu");
menuButton.addEventListener("click", () => {
  const open = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!open));
  mobileMenu.classList.toggle("open", !open);
});
$$('a[href^="#"]', mobileMenu).forEach((link) => link.addEventListener("click", () => {
  menuButton.setAttribute("aria-expanded", "false");
  mobileMenu.classList.remove("open");
}));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeCart();
});

$("#year").textContent = new Date().getFullYear();
renderProducts();
renderCart();
observeReveals();
