(() => {
  "use strict";

  const PHONE = "5493885883373";
  const STORAGE_KEY = "urban-wear-cart-v1";
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const money = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });

  const productCards = $$(".product-card");
  const products = Object.fromEntries(productCards.map((card) => [card.dataset.id, {
    id: card.dataset.id,
    name: card.dataset.name,
    category: card.dataset.category,
    price: Number(card.dataset.price),
    image: $("img", card)?.getAttribute("src") || ""
  }]));

  let cart = loadCart();
  let toastTimer;

  function loadCart() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      return Array.isArray(saved) ? saved.filter((item) => products[item.id] && item.qty > 0) : [];
    } catch {
      return [];
    }
  }

  function saveCart() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }

  function showToast(message) {
    const toast = $("#toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
  }

  function addProduct(id) {
    if (!products[id]) return;
    const current = cart.find((item) => item.id === id);
    if (current) current.qty += 1;
    else cart.push({ id, qty: 1 });
    saveCart();
    renderCart();
    showToast(`${products[id].name} se agregó al carrito`);
  }

  function removeProduct(id) {
    cart = cart.filter((item) => item.id !== id);
    saveCart();
    renderCart();
  }

  function renderCart() {
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    $$('[data-cart-count]').forEach((badge) => { badge.textContent = String(count); });

    const items = $("#cartItems");
    const empty = $("#cartEmpty");
    const footer = $("#cartFooter");
    if (!items || !empty || !footer) return;

    if (!cart.length) {
      items.innerHTML = "";
      empty.hidden = false;
      footer.hidden = true;
      return;
    }

    empty.hidden = true;
    footer.hidden = false;
    items.innerHTML = cart.map((item) => {
      const product = products[item.id];
      return `<article class="cart-item">
        <img src="${product.image}" alt="">
        <div><strong>${product.name}</strong><span>${item.qty} × ${money.format(product.price)}</span></div>
        <button type="button" data-remove="${product.id}" aria-label="Quitar ${product.name}">×</button>
      </article>`;
    }).join("");

    const total = cart.reduce((sum, item) => sum + products[item.id].price * item.qty, 0);
    $("#cartTotal").textContent = money.format(total);
    const detail = cart.map((item) => `${item.qty}x ${products[item.id].name} — ${money.format(products[item.id].price * item.qty)}`).join("\n");
    $("#checkoutButton").href = `https://wa.me/${PHONE}?text=${encodeURIComponent(`Hola Urban Wear! Quiero pedir:\n${detail}\n\nTotal: ${money.format(total)}`)}`;
  }

  function openCart() {
    const drawer = $("#cartDrawer");
    const backdrop = $("#drawerBackdrop");
    backdrop.hidden = false;
    drawer.classList.add("open");
    drawer.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
    $("#cartClose")?.focus();
  }

  function closeCart() {
    const drawer = $("#cartDrawer");
    const backdrop = $("#drawerBackdrop");
    drawer.classList.remove("open");
    drawer.setAttribute("aria-hidden", "true");
    backdrop.hidden = true;
    document.body.classList.remove("no-scroll");
  }

  function filterProducts(query = "", category = "todas") {
    const normalized = query.trim().toLocaleLowerCase("es");
    let visible = 0;
    productCards.forEach((card) => {
      const matchesText = !normalized || `${card.dataset.name} ${card.dataset.category}`.toLocaleLowerCase("es").includes(normalized);
      const matchesCategory = category === "todas" || (category === "ofertas" ? !!$(".product-media > span", card) : card.dataset.category === category);
      card.hidden = !(matchesText && matchesCategory);
      if (!card.hidden) visible += 1;
    });
    const result = $("#searchResult");
    if (result) result.textContent = normalized || category !== "todas" ? `${visible} ${visible === 1 ? "producto encontrado" : "productos encontrados"}` : "";
  }

  function setupMenu() {
    const button = $("#menuButton");
    const nav = $("#mainNav");
    if (!button || !nav) return;
    const close = () => { nav.classList.remove("open"); button.setAttribute("aria-expanded", "false"); };
    button.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      button.setAttribute("aria-expanded", String(open));
    });
    $$("a", nav).forEach((link) => link.addEventListener("click", close));
    document.addEventListener("click", (event) => {
      if (!nav.contains(event.target) && !button.contains(event.target)) close();
    });
  }

  function setupSearch() {
    const panel = $("#searchPanel");
    const input = $("#productSearch");
    const open = () => { panel.hidden = false; requestAnimationFrame(() => input.focus()); };
    const close = () => { panel.hidden = true; };
    $("#searchButton")?.addEventListener("click", open);
    $("#searchClose")?.addEventListener("click", close);
    input?.addEventListener("input", () => {
      filterProducts(input.value);
      $("#destacados")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  $$("[data-add]").forEach((button) => button.addEventListener("click", () => addProduct(button.closest(".product-card")?.dataset.id)));
  $$(".cart-open").forEach((button) => button.addEventListener("click", openCart));
  $("#cartClose")?.addEventListener("click", closeCart);
  $("#drawerBackdrop")?.addEventListener("click", closeCart);
  $("#cartItems")?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-remove]");
    if (button) removeProduct(button.dataset.remove);
  });
  $("#clearCart")?.addEventListener("click", () => { cart = []; saveCart(); renderCart(); });
  $("#checkoutButton")?.addEventListener("click", closeCart);

  $$("[data-category]").forEach((card) => card.addEventListener("click", () => {
    filterProducts("", card.dataset.category);
    $("#productSearch").value = "";
  }));

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    closeCart();
    $("#searchPanel").hidden = true;
    $("#mainNav").classList.remove("open");
    $("#menuButton").setAttribute("aria-expanded", "false");
  });

  setupMenu();
  setupSearch();
  renderCart();
})();
