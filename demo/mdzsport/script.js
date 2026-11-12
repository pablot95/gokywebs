"use strict";
const WHATSAPP_NUMBER = "5491135103503";
const CATEGORIAS = [
  { id: "camisetas", nombre: "Camisetas", count: 4 },
  { id: "shorts", nombre: "Shorts", count: 2 },
  { id: "conjuntos", nombre: "Conjuntos", count: 1 },
  { id: "botines", nombre: "Botines", count: 1 },
  { id: "camperas", nombre: "Camperas", count: 1 },
];
const PRODUCTOS = new Map();
const cartProducts = new Map();
const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;
const isModel2 = document.body.classList.contains("m2");
const catalogUrl = isModel2 ? "catalogo-2.html" : "catalogo.html";
const esc = (s) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
const formatearPrecio = (n) => "$" + Math.round(n).toLocaleString("es-AR");
const precioFinal = (p) =>
  p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const getProducto = (id) => PRODUCTOS.get(id) || cartProducts.get(id);
const normalizar = (s) =>
  String(s)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
let revealsListos = false;
let activeOverlay = null;
let previousFocus = null;
let quickProduct = null;
let quickSize = "";
let quickQty = 1;
let quickBuy = false;
let quickRequest = 0;
const Cart = {
  KEY: "mdzsport_cart",
  get() {
    try {
      const raw = JSON.parse(localStorage.getItem(this.KEY));
      if (!Array.isArray(raw)) return [];
      const unique = new Map();
      for (const item of raw.slice(0, 40)) {
        if (
          !item ||
          typeof item.id !== "string" ||
          !/^mdz-[a-z0-9-]{1,60}$/.test(item.id) ||
          typeof item.talle !== "string" ||
          !/^(S|M|L|XL|38|39|40|41|42)$/.test(item.talle) ||
          !Number.isInteger(item.qty) ||
          item.qty < 1
        )
          continue;
        const key = item.id + "|" + item.talle;
        if (!unique.has(key))
          unique.set(key, {
            id: item.id,
            talle: item.talle,
            qty: Math.min(99, item.qty),
          });
      }
      return [...unique.values()];
    } catch {
      return [];
    }
  },
  save(items) {
    try {
      localStorage.setItem(this.KEY, JSON.stringify(items));
    } catch {
      showToast(
        "Tu navegador no pudo guardar el carrito. Habilitá el almacenamiento para continuar.",
      );
      return false;
    }
    document.dispatchEvent(new CustomEvent("cart:updated"));
    return true;
  },
  add(producto, qty = 1, talle = "") {
    if (!producto?.variantes.includes(talle) || producto.stock <= 0)
      return false;
    const items = this.get();
    const existing = items.find(
      (i) => i.id === producto.id && i.talle === talle,
    );
    const total = items
      .filter((i) => i.id === producto.id)
      .reduce((sum, i) => sum + i.qty, 0);
    const available = Math.max(0, producto.stock - total);
    if (!available) {
      showToast("Ya agregaste todas las unidades de muestra disponibles.");
      return false;
    }
    if (!existing && items.length >= 40) {
      showToast("El carrito admite hasta 40 combinaciones.");
      return false;
    }
    const amount = Math.min(
      Math.max(1, Math.floor(Number(qty) || 1)),
      available,
    );
    if (existing) existing.qty += amount;
    else items.push({ id: producto.id, talle, qty: amount });
    cartProducts.set(producto.id, producto);
    return this.save(items);
  },
  setQty(id, qty, talle) {
    const items = this.get();
    const it = items.find((i) => i.id === id && i.talle === talle);
    if (!it) return;
    const p = getProducto(id);
    if (!p) return;
    const other = items
      .filter((i) => i.id === id && i !== it)
      .reduce((sum, i) => sum + i.qty, 0);
    it.qty = Math.max(
      1,
      Math.min(Math.floor(Number(qty) || 1), Math.max(1, p.stock - other)),
    );
    this.save(items);
  },
  remove(id, talle) {
    this.save(this.get().filter((i) => !(i.id === id && i.talle === talle)));
  },
  clear() {
    this.save([]);
  },
  count() {
    return this.get().reduce((sum, i) => sum + i.qty, 0);
  },
  total() {
    return this.get().reduce((sum, i) => {
      const p = getProducto(i.id);
      return p ? sum + precioFinal(p) * i.qty : sum;
    }, 0);
  },
  syncStock(products) {
    const used = new Map();
    const current = this.get();
    const items = current.flatMap((i) => {
      const p = products.find((x) => x.id === i.id);
      if (!p || p.stock <= 0 || !p.variantes.includes(i.talle)) return [];
      const available = Math.max(0, p.stock - (used.get(i.id) || 0));
      if (!available) return [];
      const qty = Math.min(i.qty, available);
      used.set(i.id, (used.get(i.id) || 0) + qty);
      return [{ ...i, qty }];
    });
    if (JSON.stringify(items) !== JSON.stringify(current)) this.save(items);
  },
};
function cacheProducts(items) {
  for (const p of items) {
    PRODUCTOS.delete(p.id);
    PRODUCTOS.set(p.id, p);
    while (PRODUCTOS.size > 100)
      PRODUCTOS.delete(PRODUCTOS.keys().next().value);
  }
}
async function requestProducts(params, signal) {
  const url = new URL("api.php", location.href);
  for (const [k, v] of Object.entries(params))
    if (v !== "" && v !== null && v !== undefined)
      url.searchParams.set(k, String(v));
  if (params.q) url.searchParams.set("q", normalizar(params.q));
  const response = await window.fetch(url, {
    signal,
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  if (!response.ok) throw new Error("No pudimos cargar los productos.");
  const data = await response.json();
  if (!Array.isArray(data.items) || data.items.length > 100)
    throw new Error("Respuesta de catálogo inválida.");
  cacheProducts(data.items);
  return data;
}
function refreshScroll() {
  if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
}
const iconPlus =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';
function priceHTML(p) {
  return `<span class="prod-price ${p.descuento > 0 ? "sale-price" : ""}">${formatearPrecio(precioFinal(p))}${p.descuento > 0 ? `<s>${formatearPrecio(p.precio)}</s>` : ""}</span>`;
}
function stepper(qty, id = "") {
  return `<div class="stepper"${id ? ` data-stepper="${esc(id)}"` : ""}><button type="button" data-step="-1" aria-label="Quitar una unidad">−</button><output aria-live="polite">${qty}</output><button type="button" data-step="1" aria-label="Sumar una unidad">+</button></div>`;
}
function cardHTML(p, role = "subir") {
  return `<article class="prod-card" data-id="${esc(p.id)}" data-animate="${role}" style="opacity:0;transform:translate${role === "der" ? "X" : "Y"}(32px)"><button class="prod-photo" type="button" data-product="${esc(p.id)}" aria-label="Ver ${esc(p.nombre)}"><img src="${esc(p.imagenes[0])}" width="1024" height="1024" alt="${esc(p.nombre)}">${p.descuento > 0 ? `<span class="badge">−${p.descuento}% · muestra</span>` : ""}${p.stock <= 0 ? '<span class="badge">Sin stock de muestra</span>' : ""}<span class="photo-hint">${iconPlus}</span></button><div class="prod-info"><p class="prod-category">${esc(p.categoria)} / MDZ SPORT</p><a class="prod-title" href="${catalogUrl}?producto=${encodeURIComponent(p.slug)}" data-product="${esc(p.id)}">${esc(p.nombre)}</a>${priceHTML(p)}<div class="prod-actions">${stepper(1, p.id)}<button class="prod-add" type="button" data-add="${esc(p.id)}"${p.stock <= 0 ? " disabled" : ""}>Agregar al carrito</button></div><button class="prod-buy-now" type="button" data-buy="${esc(p.id)}"${p.stock <= 0 ? " disabled" : ""}>Comprar ahora</button></div></article>`;
}
function openOverlay(overlay) {
  if (!activeOverlay) previousFocus = document.activeElement;
  if (activeOverlay) activeOverlay.hidden = true;
  activeOverlay = overlay;
  overlay.hidden = false;
  document.body.classList.add("no-scroll");
  document
    .querySelectorAll("body > header,body > main,body > footer")
    .forEach((el) => (el.inert = true));
  overlay.querySelector("button, a, input")?.focus();
}
function closeOverlay() {
  if (!activeOverlay) return;
  activeOverlay.hidden = true;
  activeOverlay = null;
  document.body.classList.remove("no-scroll");
  document
    .querySelectorAll("body > header,body > main,body > footer")
    .forEach((el) => (el.inert = false));
  previousFocus?.focus();
}
function trapFocus(e, container) {
  if (e.key !== "Tab") return;
  const focusable = [
    ...container.querySelectorAll(
      'a[href],button:not([disabled]),input,select,textarea,[tabindex="0"]',
    ),
  ].filter(
    (el) => el.getClientRects().length && !el.closest("[hidden],[inert]"),
  );
  const first = focusable[0],
    last = focusable[focusable.length - 1];
  if (
    e.shiftKey &&
    (document.activeElement === first ||
      !container.contains(document.activeElement))
  ) {
    e.preventDefault();
    last?.focus();
  } else if (
    !e.shiftKey &&
    (document.activeElement === last ||
      !container.contains(document.activeElement))
  ) {
    e.preventDefault();
    first?.focus();
  }
}
async function openProduct(id, qty = 1, buy = false) {
  const p = getProducto(id);
  if (!p) return;
  const turn = ++quickRequest;
  quickProduct = p;
  quickSize = "";
  quickQty = qty;
  quickBuy = buy;
  const content = document.getElementById("quickContent");
  content.innerHTML = `<div class="quick-grid"><figure class="quick-image"><img src="${esc(p.imagenes[0])}" width="1024" height="1024" alt="${esc(p.nombre)}"></figure><div class="quick-copy"><p class="eyebrow">${esc(p.categoria)} / MDZ SPORT</p><h2>${esc(p.nombre)}</h2>${priceHTML(p)}<p class="quick-description">${esc(p.descripcion)}</p><span class="variant-label" id="sizeLabel">Elegí tu talle</span><div class="sizes" role="group" aria-labelledby="sizeLabel">${p.variantes.map((size) => `<button type="button" data-size="${esc(size)}" aria-pressed="false">${esc(size)}</button>`).join("")}</div><p class="variant-error" id="variantError" role="status"></p><div class="modal-actions">${stepper(qty, "quick")}<button class="btn btn-buy" id="quickAdd" type="button"${p.stock <= 0 ? " disabled" : ""}>${p.stock <= 0 ? "Sin stock de muestra" : "Agregar al carrito"}</button><button class="btn btn-line" id="quickBuy" type="button"${p.stock <= 0 ? " disabled" : ""}>Comprar ahora</button></div><p class="micro">Foto, precio, talles y stock ilustrativos. Confirmá el producto real con MDZ SPORT.</p><a class="text-link" href="https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hola MDZ SPORT, quiero consultar por " + p.nombre + ". ¿Qué talles tienen disponibles?")}" target="_blank" rel="noopener noreferrer">Consultar por esta prenda</a></div></div><div class="quick-related" id="quickRelated" hidden><p>También te puede interesar</p><div class="related-list"></div></div>`;
  openOverlay(document.getElementById("quickOverlay"));
  let schema = document.getElementById("productSchema");
  if (!schema) {
    schema = document.createElement("script");
    schema.type = "application/ld+json";
    schema.id = "productSchema";
    document.head.appendChild(schema);
  }
  schema.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.nombre + " (producto de muestra)",
    image: new URL(p.imagenes[0], location.href).href,
    description: "Producto ilustrativo de demo. " + p.descripcion,
    offers: {
      "@type": "Offer",
      priceCurrency: "ARS",
      price: precioFinal(p),
      availability:
        "https://schema.org/" + (p.stock > 0 ? "InStock" : "OutOfStock"),
      url: new URL(catalogUrl + "?producto=" + p.slug, location.href).href,
    },
  });
  try {
    const result = await requestProducts({
      scope: "catalog",
      cat: p.categoria,
      limit: 4,
    });
    if (turn !== quickRequest || quickProduct?.id !== p.id) return;
    const related = result.items.filter((item) => item.id !== p.id).slice(0, 3);
    const box = document.getElementById("quickRelated");
    if (!box) return;
    box.hidden = !related.length;
    box.querySelector(".related-list").innerHTML = related
      .map(
        (item) =>
          `<button class="related-item" type="button" data-product="${esc(item.id)}"><img src="${esc(item.imagenes[0])}" width="62" height="62" alt=""><span>${esc(item.nombre)}<br>${formatearPrecio(precioFinal(item))}</span></button>`,
      )
      .join("");
  } catch {
    return;
  }
}
function addQuick(buy = false) {
  if (!quickProduct) return;
  if (!quickSize) {
    document.getElementById("variantError").textContent =
      "Elegí un talle para seguir.";
    document.querySelector("[data-size]")?.focus();
    return;
  }
  if (Cart.add(quickProduct, quickQty, quickSize)) {
    showToast(`${quickProduct.nombre} · ${quickSize} se agregó a tu carrito.`);
    if (buy || quickBuy) openCartDrawer();
    else closeOverlay();
  }
}
let cartHydration = null;
async function hydrateCart() {
  if (cartHydration) return cartHydration;
  const ids = [...new Set(Cart.get().map((i) => i.id))];
  if (!ids.length) return;
  cartHydration = (async () => {
    const result = await requestProducts({
      scope: "lookup",
      ids: ids.join(","),
      limit: 100,
    });
    cartProducts.clear();
    for (const p of result.items) cartProducts.set(p.id, p);
    Cart.syncStock(result.items);
  })();
  try {
    await cartHydration;
  } finally {
    cartHydration = null;
  }
}
function renderCart() {
  const target = document.getElementById("cartItems"),
    items = Cart.get();
  if (!target) return;
  const summary = document.getElementById("cartSummary");
  summary.hidden = !items.length;
  if (!items.length) {
    target.innerHTML = `<div class="cart-empty"><p class="eyebrow">Todavía no empezó el partido</p><p>Elegí una prenda y tu talle para empezar.</p><a class="btn" href="${catalogUrl}">Volver al catálogo</a></div>`;
    return;
  }
  target.innerHTML = items
    .map((i) => {
      const p = getProducto(i.id);
      if (!p) return "";
      return `<div class="cart-line" data-cart-id="${esc(i.id)}" data-cart-size="${esc(i.talle)}"><img src="${esc(p.imagenes[0])}" width="76" height="90" alt="${esc(p.nombre)}"><div><h3>${esc(p.nombre)}</h3><p class="micro">Talle ${esc(i.talle)} · ${formatearPrecio(precioFinal(p))}</p><div class="cart-line-bottom">${stepper(i.qty, "cart")}<strong>${formatearPrecio(precioFinal(p) * i.qty)}</strong></div><button class="remove-line" data-remove="${esc(i.id)}" type="button">Quitar del carrito</button></div></div>`;
    })
    .join("");
  document.getElementById("cartTotal").textContent = formatearPrecio(
    Cart.total(),
  );
}
async function openCartDrawer() {
  const target = document.getElementById("cartItems");
  openOverlay(document.getElementById("cartOverlay"));
  target.innerHTML = '<p class="micro">Revisando tu carrito...</p>';
  document.getElementById("cartSummary").hidden = true;
  try {
    await hydrateCart();
    renderCart();
  } catch {
    target.innerHTML =
      '<div class="cart-empty"><p>No pudimos revisar los precios actuales.</p><button class="btn" id="cartRetry" type="button">Reintentar</button></div>';
  }
}
function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll("[data-cart-count]").forEach((b) => {
    b.textContent = n;
    b.hidden = n === 0;
    b.classList.remove("bump");
    void b.offsetWidth;
    if (n) b.classList.add("bump");
  });
}
function initFloats() {
  const wsp = document.getElementById("wsp-float"),
    cart = document.getElementById("cart-float");
  let seen = false;
  const sync = () => {
    seen = seen || window.scrollY > 600;
    wsp?.classList.toggle("visible", seen);
    cart?.classList.toggle("visible", seen || Cart.count() > 0);
  };
  window.addEventListener("scroll", sync, { passive: true });
  document.addEventListener("cart:updated", sync);
  cart?.addEventListener("click", openCartDrawer);
  sync();
}
function initInteractions() {
  document
    .querySelector(".header-cart")
    ?.addEventListener("click", openCartDrawer);
  document.addEventListener("cart:updated", () => {
    updateCartBadge();
    if (activeOverlay?.id === "cartOverlay") renderCart();
  });
  document.addEventListener("keydown", (e) => {
    if (activeOverlay) {
      if (e.key === "Escape") closeOverlay();
      else trapFocus(e, activeOverlay);
    } else if (document.querySelector(".main-nav.open"))
      trapFocus(e, document.getElementById("mainNav"));
  });
  document.querySelectorAll(".overlay").forEach((el) =>
    el.addEventListener("click", (e) => {
      if (e.target === el) closeOverlay();
    }),
  );
  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-close-dialog]")) {
      closeOverlay();
      return;
    }
    const product = e.target.closest("[data-product]");
    if (product) {
      e.preventDefault();
      openProduct(product.dataset.product);
      return;
    }
    const add = e.target.closest("[data-add],[data-buy]");
    if (add) {
      const qty = Number(
        add.closest(".prod-card")?.querySelector("output")?.value || 1,
      );
      openProduct(
        add.dataset.add || add.dataset.buy,
        qty,
        Boolean(add.dataset.buy),
      );
      return;
    }
    const size = e.target.closest("[data-size]");
    if (size) {
      quickSize = size.dataset.size;
      document
        .querySelectorAll("[data-size]")
        .forEach((b) => b.setAttribute("aria-pressed", String(b === size)));
      document.getElementById("variantError").textContent = "";
      return;
    }
    const step = e.target.closest("[data-step]");
    if (step) {
      const control = step.closest(".stepper"),
        amount = Number(step.dataset.step),
        line = step.closest(".cart-line");
      if (line) {
        const i = Cart.get().find(
          (x) =>
            x.id === line.dataset.cartId && x.talle === line.dataset.cartSize,
        );
        if (i) Cart.setQty(i.id, i.qty + amount, i.talle);
        return;
      }
      const p =
        control.dataset.stepper === "quick"
          ? quickProduct
          : getProducto(control.dataset.stepper);
      const qty = Math.max(
        1,
        Math.min(
          (Number(control.querySelector("output").value) || 1) + amount,
          p?.stock || 1,
        ),
      );
      control.querySelector("output").value = qty;
      if (control.dataset.stepper === "quick") quickQty = qty;
      return;
    }
    const remove = e.target.closest("[data-remove]");
    if (remove) {
      Cart.remove(
        remove.dataset.remove,
        remove.closest(".cart-line").dataset.cartSize,
      );
      return;
    }
    if (e.target.closest("#quickAdd")) addQuick();
    if (e.target.closest("#quickBuy")) addQuick(true);
    if (e.target.closest("#cartRetry")) openCartDrawer();
    if (e.target.closest("#checkoutButton") && Cart.count())
      showToast(
        "¡Genial! El pago online se activa al pasar la web a producción.",
      );
  });
  window.addEventListener("storage", (e) => {
    if (e.key === Cart.KEY) {
      updateCartBadge();
      if (activeOverlay?.id === "cartOverlay") openCartDrawer();
    }
  });
}
function initCategories() {
  const wrap = document.querySelector(".category-nav"),
    button = wrap?.querySelector("button"),
    panel = document.getElementById("categoryDropdown");
  if (!wrap || !button || !panel) return;
  let timer;
  const set = (open) => {
    panel.hidden = !open;
    button.setAttribute("aria-expanded", String(open));
  };
  const active = new URLSearchParams(location.search).get("cat");
  panel.querySelectorAll("a").forEach((a) => {
    if (new URL(a.href).searchParams.get("cat") === active && active)
      a.setAttribute("aria-current", "page");
  });
  button.addEventListener("click", () => set(panel.hidden));
  wrap.addEventListener("mouseenter", () => {
    if (window.matchMedia("(min-width:769px) and (hover:hover)").matches) {
      clearTimeout(timer);
      set(true);
    }
  });
  wrap.addEventListener("mouseleave", () => {
    if (window.matchMedia("(min-width:769px)").matches)
      timer = setTimeout(() => set(false), 120);
  });
  wrap.addEventListener("focusout", (e) => {
    if (!wrap.contains(e.relatedTarget)) set(false);
  });
  document.addEventListener("click", (e) => {
    if (!wrap.contains(e.target)) set(false);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !panel.hidden) {
      set(false);
      button.focus();
    }
  });
}
function initRailDrag(vp) {
  if (!vp || isModel2) return;
  let dragging = false,
    moved = false,
    startX = 0,
    startScroll = 0,
    pointerId = null;
  const THRESHOLD = 6;
  vp.addEventListener("pointerdown", (e) => {
    if (e.pointerType === "touch" || e.button !== 0) return;
    dragging = true;
    moved = false;
    pointerId = e.pointerId;
    startX = e.clientX;
    startScroll = vp.scrollLeft;
  });
  vp.addEventListener("pointermove", (e) => {
    if (!dragging || e.pointerId !== pointerId) return;
    const dx = e.clientX - startX;
    if (!moved && Math.abs(dx) < THRESHOLD) return;
    if (!moved) {
      moved = true;
      vp.classList.add("dragging");
      try {
        vp.setPointerCapture?.(pointerId);
      } catch {
        pointerId = e.pointerId;
      }
    }
    e.preventDefault();
    vp.scrollLeft = startScroll - dx;
  });
  const end = (e) => {
    if (!dragging || (e && pointerId !== null && e.pointerId !== pointerId))
      return;
    dragging = false;
    if (moved) {
      try {
        vp.releasePointerCapture?.(pointerId);
      } catch {
        pointerId = null;
      }
      vp.classList.remove("dragging");
      const kill = (ev) => {
        ev.stopPropagation();
        ev.preventDefault();
      };
      vp.addEventListener("click", kill, { capture: true, once: true });
      setTimeout(
        () => vp.removeEventListener("click", kill, { capture: true }),
        0,
      );
    }
    pointerId = null;
    moved = false;
  };
  vp.addEventListener("pointerup", end);
  vp.addEventListener("pointercancel", end);
  vp.addEventListener("dragstart", (e) => e.preventDefault());
}
async function initFeatured() {
  const target = document.getElementById("featuredProducts");
  if (!target) return;
  try {
    const data = await requestProducts({ scope: "home", limit: 6 });
    target.innerHTML = data.items
      .map((p) => cardHTML(p, isModel2 ? "subir" : "der"))
      .join("");
    const vp = document.getElementById("featuredRail");
    initRailDrag(vp);
    const prev = document.querySelector("[data-rail-prev]"),
      next = document.querySelector("[data-rail-next]");
    const sync = () => {
      const start =
        parseFloat(window.getComputedStyle(target).paddingInlineStart) || 0;
      prev.disabled = vp.scrollLeft <= start + 2;
      next.disabled = vp.scrollLeft >= vp.scrollWidth - vp.clientWidth - 2;
    };
    prev?.addEventListener("click", () =>
      vp.scrollBy({
        left: -vp.clientWidth * 0.75,
        behavior: reduceMotion ? "instant" : "smooth",
      }),
    );
    next?.addEventListener("click", () =>
      vp.scrollBy({
        left: vp.clientWidth * 0.75,
        behavior: reduceMotion ? "instant" : "smooth",
      }),
    );
    vp.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    sync();
    refreshScroll();
  } catch {
    target.innerHTML = `<div class="empty-state"><p>No pudimos cargar las prendas.</p><a class="text-link" href="${catalogUrl}">Abrir el catálogo</a></div>`;
  }
}
function validFilters(params) {
  const pick = (key, values) =>
    values.includes(params.get(key)) ? params.get(key) : "";
  return {
    cat: pick(
      "cat",
      CATEGORIAS.map((c) => c.id),
    ),
    q: (params.get("q") || "").slice(0, 80),
    talle: pick("talle", ["S", "M", "L", "XL", "38", "39", "40", "41", "42"]),
    precio: pick("precio", ["30000", "50000", "80000"]),
    stock: pick("stock", ["1"]),
    orden: pick("orden", ["nombre", "precio-asc", "precio-desc"]) || "nombre",
  };
}
async function initCatalog() {
  const grid = document.getElementById("catalogProducts");
  if (!grid) return;
  const controls = {
    q: document.getElementById("catalogSearch"),
    cat: document.getElementById("filterCat"),
    talle: document.getElementById("filterSize"),
    precio: document.getElementById("filterPrice"),
    stock: document.getElementById("filterStock"),
    orden: document.getElementById("catalogOrder"),
  };
  const params = new URLSearchParams(location.search),
    initial = validFilters(params),
    slug = params.get("producto");
  for (const [key, el] of Object.entries(controls))
    if (key === "stock") el.checked = initial[key] === "1";
    else el.value = initial[key];
  let cursor = null,
    controller = null,
    request = 0,
    busy = false;
  const more = document.getElementById("catalogMore"),
    status = document.getElementById("catalogStatus"),
    empty = document.getElementById("catalogEmpty"),
    error = document.getElementById("catalogError");
  const values = () =>
    Object.fromEntries(
      Object.entries(controls).map(([key, el]) => [
        key,
        key === "stock" ? (el.checked ? "1" : "") : el.value,
      ]),
    );
  const load = async (append = false) => {
    if (append && (busy || !cursor)) return;
    controller?.abort();
    controller = new window.AbortController();
    const turn = ++request;
    busy = true;
    more.disabled = true;
    error.hidden = true;
    empty.hidden = true;
    const filters = values();
    const query = new URLSearchParams();
    for (const [k, v] of Object.entries(filters))
      if (v && (k !== "orden" || v !== "nombre")) query.set(k, v);
    if (slug) query.set("producto", slug);
    window.history.replaceState(
      null,
      "",
      location.pathname + (query.size ? "?" + query.toString() : ""),
    );
    document.querySelectorAll(".gw-modelos__btn").forEach((a) => {
      a.href =
        (a.dataset.modelo === "1" ? "catalogo.html" : "catalogo-2.html") +
        (query.size ? "?" + query.toString() : "");
    });
    const cat = CATEGORIAS.find((c) => c.id === filters.cat);
    document.getElementById("catalogTitle").textContent =
      cat?.nombre || "Elegí tu próximo equipo";
    document.getElementById("breadcrumbCategory").textContent = cat
      ? "/ " + cat.nombre
      : "";
    if (!append) {
      cursor = null;
      grid.innerHTML =
        '<div class="skeleton" role="status" aria-label="Cargando productos"></div>';
      more.hidden = true;
      status.textContent = "Buscando prendas...";
    }
    grid.setAttribute("aria-busy", "true");
    try {
      const data = await requestProducts(
        {
          scope: "catalog",
          limit: 16,
          ...filters,
          cursor: append ? cursor : null,
        },
        controller.signal,
      );
      if (turn !== request) return;
      if (!append) grid.innerHTML = "";
      if (grid.children.length + data.items.length > 96) grid.innerHTML = "";
      grid.insertAdjacentHTML(
        "beforeend",
        data.items.map((p) => cardHTML(p)).join(""),
      );
      cursor = data.nextCursor;
      empty.hidden = data.total !== 0;
      more.hidden = !cursor;
      status.textContent = `${data.total} ${data.total === 1 ? "producto" : "productos"} · mostrando ${grid.children.length}`;
      revelarNuevos(grid);
      refreshScroll();
    } catch (e) {
      if (e.name !== "AbortError") {
        if (!append) grid.innerHTML = "";
        error.hidden = false;
        status.textContent = "No se pudo completar la búsqueda.";
      }
    } finally {
      if (turn === request) {
        busy = false;
        more.disabled = false;
        grid.setAttribute("aria-busy", "false");
      }
    }
  };
  let timer;
  controls.q.addEventListener("input", () => {
    clearTimeout(timer);
    timer = setTimeout(() => load(), 300);
  });
  for (const [key, el] of Object.entries(controls))
    if (key !== "q")
      el.addEventListener("change", () => {
        clearTimeout(timer);
        load();
      });
  const clear = () => {
    clearTimeout(timer);
    for (const [key, el] of Object.entries(controls))
      if (key === "stock") el.checked = false;
      else el.value = key === "orden" ? "nombre" : "";
    load();
  };
  document.getElementById("clearFilters").addEventListener("click", clear);
  document
    .querySelector("[data-clear-filters]")
    .addEventListener("click", clear);
  more.addEventListener("click", () => load(true));
  document
    .getElementById("retryCatalog")
    .addEventListener("click", () => load());
  const toggle = document.querySelector(".filter-toggle");
  toggle.addEventListener("click", () => {
    const open = document
      .getElementById("catalogFilters")
      .classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
    refreshScroll();
  });
  await load();
  if (slug)
    try {
      const result = await requestProducts({ scope: "lookup", slug, limit: 1 });
      if (result.items[0]) openProduct(result.items[0].id);
    } catch {
      return;
    }
}
async function initAdmin() {
  const target = document.getElementById("adminProducts");
  if (!target) return;
  const search = document.getElementById("adminSearch"),
    more = document.getElementById("adminMore"),
    first = document.getElementById("adminFirst"),
    status = document.getElementById("adminStatus"),
    retry = document.getElementById("adminRetry");
  let cursor = null,
    controller = null,
    request = 0,
    page = 0,
    busy = false;
  const edits = new Map();
  const load = async (next = false) => {
    if (next && (busy || !cursor)) return;
    controller?.abort();
    controller = new window.AbortController();
    const turn = ++request;
    busy = true;
    more.disabled = true;
    retry.hidden = true;
    if (!next) {
      cursor = null;
      page = 0;
    }
    status.textContent = "Buscando productos...";
    target.setAttribute("aria-busy", "true");
    try {
      const data = await requestProducts(
        {
          scope: "admin",
          limit: 100,
          q: search.value,
          cursor: next ? cursor : null,
        },
        controller.signal,
      );
      if (turn !== request) return;
      page++;
      cursor = data.nextCursor;
      edits.clear();
      PRODUCTOS.clear();
      cacheProducts(data.items);
      target.innerHTML = data.items
        .map(
          (p) =>
            `<article class="admin-row" data-admin-id="${esc(p.id)}" data-animate="subir" style="opacity:0;transform:translateY(24px)"><img src="${esc(p.imagenes[0])}" width="66" height="66" alt="${esc(p.nombre)}"><div><strong>${esc(p.nombre)}</strong><p class="muted">${esc(p.categoria)} · ${esc(p.id)}</p><p class="micro" data-edit-status>Producto de muestra</p></div><label>Precio ($)<input type="number" min="1" max="99999999" step="1" value="${p.precio}" data-admin-field="precio" aria-label="Precio de ${esc(p.nombre)}"></label><label>Stock<input type="number" min="0" max="99999" step="1" value="${p.stock}" data-admin-field="stock" aria-label="Stock de ${esc(p.nombre)}"></label><button type="button" data-admin-reset="${esc(p.id)}">Restablecer</button></article>`,
        )
        .join("");
      if (!data.items.length)
        target.innerHTML =
          '<div class="empty-state"><h2>No encontramos productos</h2><p>Probá buscar por nombre o categoría.</p></div>';
      status.textContent = `Página ${page} · ${data.items.length} de ${data.total} productos encontrados`;
      more.hidden = !cursor;
      first.hidden = page === 1;
      revelarNuevos(target);
      refreshScroll();
    } catch (e) {
      if (e.name !== "AbortError") {
        status.textContent =
          "No pudimos cargar los productos. Intentá de nuevo.";
        retry.hidden = false;
      }
    } finally {
      if (turn === request) {
        busy = false;
        more.disabled = false;
        target.setAttribute("aria-busy", "false");
      }
    }
  };
  let timer;
  search.addEventListener("input", () => {
    clearTimeout(timer);
    timer = setTimeout(() => load(), 300);
  });
  more.addEventListener("click", () => load(true));
  first.addEventListener("click", () => load());
  retry.addEventListener("click", () => load());
  document.getElementById("adminReset").addEventListener("click", () => {
    search.value = "";
    load();
    showToast("La prueba volvió a sus valores iniciales.");
  });
  target.addEventListener("change", (e) => {
    const input = e.target.closest("[data-admin-field]");
    if (!input) return;
    const row = input.closest("[data-admin-id]"),
      p = getProducto(row.dataset.adminId),
      value = Number(input.value);
    if (!p) return;
    const valid =
      input.value !== "" &&
      Number.isInteger(value) &&
      value >= Number(input.min) &&
      value <= Number(input.max);
    input.setAttribute("aria-invalid", String(!valid));
    if (!valid) {
      row.querySelector("[data-edit-status]").textContent =
        "Revisá el valor: tiene que ser un número entero válido.";
      return;
    }
    edits.set(p.id, {
      ...(edits.get(p.id) || {}),
      [input.dataset.adminField]: value,
    });
    row.querySelector("[data-edit-status]").textContent =
      "Cambio aplicado a esta prueba.";
    showToast("Cambio de prueba aplicado.");
  });
  target.addEventListener("click", (e) => {
    const button = e.target.closest("[data-admin-reset]");
    if (!button) return;
    const row = button.closest("[data-admin-id]"),
      p = getProducto(button.dataset.adminReset);
    if (!p) return;
    edits.delete(p.id);
    row.querySelectorAll("[data-admin-field]").forEach((input) => {
      input.value = p[input.dataset.adminField];
      input.removeAttribute("aria-invalid");
    });
    row.querySelector("[data-edit-status]").textContent = "Producto de muestra";
  });
  await load();
}
function initMap() {
  const target = document.getElementById("locationMap");
  if (!target) return;
  if (typeof L === "undefined") {
    target.innerHTML =
      '<p class="micro">El mapa no está disponible en este momento. Consultá la dirección por WhatsApp.</p>';
    return;
  }
  const map = L.map(target, {
    scrollWheelZoom: false,
    dragging: !window.matchMedia("(pointer:coarse)").matches,
  }).setView([-34.6037, -58.3816], 11);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
  }).addTo(map);
}
async function init() {
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined")
    gsap.registerPlugin(ScrollTrigger);
  initNav();
  initCategories();
  initInteractions();
  initModelBarScroll();
  initFloats();
  updateCartBadge();
  initHeroMotion();
  initMap();
  try {
    await Promise.all([initFeatured(), initCatalog(), initAdmin()]);
  } finally {
    initReveals();
    if (typeof gsap === "undefined")
      document
        .querySelectorAll("[data-animate]")
        .forEach((el) => el.classList.add("in"));
    refreshScroll();
  }
  hydrateCart().catch(() => {});
}
window.addEventListener("load", refreshScroll);

function showToast(msg) {
  let wrap = document.querySelector(".toast-wrap");
  if (!wrap) {
    wrap = document.createElement("div");
    wrap.className = "toast-wrap";
    wrap.setAttribute("aria-live", "polite");
    document.body.appendChild(wrap);
  }
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.setAttribute("role", "status");
  toast.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg><span>${esc(msg)}</span>`;
  wrap.appendChild(toast);
  setTimeout(() => {
    toast.classList.add("hiding");
    setTimeout(() => toast.remove(), 220);
  }, 3200);
}

document.addEventListener("contextmenu", (e) => e.preventDefault());
document.addEventListener("dragstart", (e) => e.preventDefault());
document.addEventListener("keydown", (e) => {
  const k = e.key.toLowerCase();
  if (
    k === "f12" ||
    (e.ctrlKey && e.shiftKey && ["i", "j", "c"].includes(k)) ||
    (e.ctrlKey && k === "u")
  ) {
    e.preventDefault();
  }
});

function initNav() {
  const toggle = document.getElementById("menuToggle");
  const nav = document.getElementById("mainNav");
  const closeBtn = document.getElementById("navClose");
  if (!toggle || !nav) return;
  let bd = document.querySelector(".nav-backdrop");
  if (!bd) {
    bd = document.createElement("div");
    bd.className = "nav-backdrop";
    (document.querySelector(".site-header") || document.body).appendChild(bd);
  }
  const desktopMq = window.matchMedia("(min-width: 769px)");
  const close = () => {
    nav.classList.remove("open");
    bd.classList.remove("open");
    if (!desktopMq.matches) nav.setAttribute("inert", "");
    toggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("no-scroll");
    nav.removeAttribute("role");
    nav.removeAttribute("aria-modal");
  };
  const open = () => {
    nav.classList.add("open");
    bd.classList.add("open");
    nav.removeAttribute("inert");
    nav.setAttribute("role", "dialog");
    nav.setAttribute("aria-modal", "true");
    toggle.setAttribute("aria-expanded", "true");
    document.body.classList.add("no-scroll");
    nav.querySelector("a")?.focus();
  };
  toggle.addEventListener("click", () =>
    nav.classList.contains("open") ? close() : open(),
  );
  closeBtn?.addEventListener("click", () => {
    close();
    toggle.focus();
  });
  bd.addEventListener("click", () => {
    close();
    toggle.focus();
  });
  nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", close));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("open")) {
      close();
      toggle.focus();
    }
  });
  const syncInert = () => {
    if (desktopMq.matches) {
      close();
      nav.removeAttribute("inert");
    } else if (!nav.classList.contains("open")) nav.setAttribute("inert", "");
  };
  desktopMq.addEventListener("change", syncInert);
  syncInert();
}

function initReveals() {
  revealsListos = true;
  const items = document.querySelectorAll("[data-animate]");
  if (!items.length) return;
  if (!("IntersectionObserver" in window) || reduceMotion) {
    items.forEach((el) => el.classList.add("in"));
    return;
  }
  const entrar = (el, n) => {
    const d = Math.min(n * 0.1, 0.6);
    el.style.transitionDelay = `${d}s`;
    el.classList.add("in");
    setTimeout(
      () => {
        el.style.transitionDelay = "";
      },
      (d + 1.2) * 1000,
    );
  };
  const io = new IntersectionObserver(
    (entries) => {
      let n = 0;
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entrar(entry.target, n++);
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0, rootMargin: "0px 0px -7% 0px" },
  );
  items.forEach((el) => io.observe(el));

  let queued = false;
  const sweep = () => {
    queued = false;
    let pending = 0;
    let n = 0;
    items.forEach((el) => {
      if (el.classList.contains("in")) return;
      const r = el.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight) {
        entrar(el, n++);
        io.unobserve(el);
      } else pending++;
    });
    if (!pending) {
      window.removeEventListener("scroll", queueSweep);
      window.removeEventListener("resize", queueSweep);
    }
  };
  const queueSweep = () => {
    if (!queued) {
      queued = true;
      requestAnimationFrame(sweep);
    }
  };
  requestAnimationFrame(() => requestAnimationFrame(queueSweep));
  window.addEventListener("load", queueSweep);
  window.addEventListener("scroll", queueSweep, { passive: true });
  window.addEventListener("resize", queueSweep, { passive: true });
}

function initModelBarScroll() {
  const bar = document.querySelector(".gw-modelos");
  if (!bar) return;
  let showTimer = 0;
  let frame = 0;
  const update = () => {
    frame = 0;
    if (window.scrollY <= 8) {
      bar.classList.remove("gw-modelos--scrolling");
      return;
    }
    bar.classList.add("gw-modelos--scrolling");
    clearTimeout(showTimer);
    showTimer = setTimeout(
      () => bar.classList.remove("gw-modelos--scrolling"),
      120,
    );
  };
  window.addEventListener(
    "scroll",
    () => {
      if (!frame) frame = requestAnimationFrame(update);
    },
    { passive: true },
  );
}

function initHeroMotion() {
  if (reduceMotion || typeof gsap === "undefined") return;
  const hero = document.querySelector(".hero");
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
  const img = hero.querySelector("[data-hero-img]");
  if (img) tl.from(img, { scale: 1.1, duration: 1.8 }, 0);
  tl.from(
    hero.querySelectorAll(".hero-eyebrow"),
    { y: 18, opacity: 0, duration: 0.9 },
    0.1,
  )
    .from(
      hero.querySelectorAll("h1"),
      {
        y: 40,
        opacity: 0,
        filter: "blur(10px)",
        duration: 1.2,
        clearProps: "filter",
      },
      0.2,
    )
    .from(
      hero.querySelectorAll(".hero-lead"),
      { y: 26, opacity: 0, duration: 1 },
      0.45,
    )
    .from(
      hero.querySelectorAll(".hero-ctas .btn"),
      {
        y: 22,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        clearProps: "transform,opacity",
      },
      0.6,
    )
    .from(
      hero.querySelectorAll(".sello, .hero-badge"),
      {
        scale: 0.92,
        opacity: 0,
        duration: 1.1,
        stagger: 0.1,
        clearProps: "transform,opacity",
      },
      0.65,
    );
}
function revelarNuevos(cont) {
  if (!revealsListos || !cont) return;
  const nuevos = [...cont.querySelectorAll("[data-animate]:not(.in)")];
  if (!nuevos.length) return;
  if (reduceMotion) {
    nuevos.forEach((el) => el.classList.add("in"));
    return;
  }
  requestAnimationFrame(() =>
    requestAnimationFrame(() =>
      nuevos.forEach((el, i) => {
        const d = Math.min(i * 0.06, 0.6);
        el.style.transitionDelay = `${d}s`;
        el.classList.add("in");
        setTimeout(
          () => {
            el.style.transitionDelay = "";
          },
          (d + 1.2) * 1000,
        );
      }),
    ),
  );
}
init();
