"use strict";
const CATEGORIAS = [
  { id: "fundas", nombre: "Fundas", count: 10 },
  { id: "accesorios", nombre: "Accesorios", count: 6 },
  { id: "tecnologia", nombre: "Tecnología", count: 4 },
  { id: "extras", nombre: "Extras", count: 3 },
  { id: "sorteos", nombre: "Sorteos", count: 1 },
];
const WHATSAPP_NUMBER = "5492284695736";
const PRODUCTOS = [];
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const modelo = document.body.dataset.modelo === "2" ? 2 : 1;
const catalogURL = modelo === 2 ? "catalogo-2.html" : "catalogo.html";
const raffleURL = modelo === 2 ? "sorteos-2.html" : "sorteos.html";
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
const getProducto = (id) => PRODUCTOS.find((p) => p.id === id);
const normalize = (s) =>
  String(s)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
const iconPaths = {
  cart: '<path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/>',
  heart:
    '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>',
  arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
};
const icon = (n) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${iconPaths[n] || ""}</svg>`;
function readStore(key, fallback = [], session = false) {
  try {
    const value = JSON.parse((session ? window.sessionStorage : localStorage).getItem(key));
    return value ?? fallback;
  } catch {
    return fallback;
  }
}
function writeStore(key, value, session = false) {
  try {
    (session ? window.sessionStorage : localStorage).setItem(key, JSON.stringify(value));
    return true;
  } catch {
    showToast("No se pudo guardar en este navegador. Revisá el espacio disponible.");
    return false;
  }
}
function cleanCart(raw) {
  if (!Array.isArray(raw)) return [];
  const seen = new Set();
  return raw
    .slice(0, 50)
    .filter(
      (i) =>
        i &&
        typeof i.id === "string" &&
        i.id.length < 100 &&
        typeof i.variante === "string" &&
        i.variante.length < 100 &&
        Number.isInteger(i.qty) &&
        i.qty > 0 &&
        i.qty <= 99,
    )
    .filter((i) => {
      const key = i.id + "|" + i.variante;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .map((i) => ({ id: i.id, variante: i.variante, qty: i.qty }));
}
const Cart = {
  KEY: "byfridacase_cart",
  get() {
    return cleanCart(readStore(this.KEY));
  },
  save(items) {
    const ok = writeStore(this.KEY, cleanCart(items));
    if (ok) document.dispatchEvent(new CustomEvent("cart:updated"));
    return ok;
  },
  add(producto, qty = 1, variante = producto.variantes[0]) {
    if (!producto || producto.stock <= 0 || !producto.variantes.includes(variante)) return false;
    const items = this.get();
    const existing = items.find((i) => i.id === producto.id && i.variante === variante);
    const otherQty = items
      .filter((i) => i.id === producto.id && i !== existing)
      .reduce((n, i) => n + i.qty, 0);
    const available = Math.max(0, Math.min(99, producto.stock) - otherQty);
    if (!available) return false;
    qty = Math.max(1, Math.min(99, Math.floor(Number(qty) || 1)));
    if (existing) {
      const next = Math.min(existing.qty + qty, available);
      if (next === existing.qty) return false;
      existing.qty = next;
    } else {
      if (items.length >= 50) {
        showToast("El carrito admite hasta 50 líneas.");
        return false;
      }
      items.push({ id: producto.id, variante, qty: Math.min(qty, available) });
    }
    return this.save(items);
  },
  setQty(id, variante, qty) {
    const items = this.get(),
      it = items.find((i) => i.id === id && i.variante === variante),
      p = getProducto(id);
    if (!it || !p) return;
    const others = items.filter((i) => i.id === id && i !== it).reduce((n, i) => n + i.qty, 0);
    it.qty = Math.max(1, Math.min(Math.floor(Number(qty) || 1), p.stock - others, 99));
    this.save(items);
  },
  remove(id, variante) {
    this.save(this.get().filter((i) => i.id !== id || i.variante !== variante));
  },
  clear() {
    this.save([]);
  },
  count() {
    return this.get().reduce((s, i) => s + i.qty, 0);
  },
  total() {
    return this.get().reduce((s, i) => {
      const p = getProducto(i.id);
      return p ? s + precioFinal(p) * i.qty : s;
    }, 0);
  },
};
function cacheProducts(items) {
  for (const p of items) {
    const index = PRODUCTOS.findIndex((x) => x.id === p.id);
    if (index >= 0) PRODUCTOS.splice(index, 1);
    PRODUCTOS.push(p);
  }
  while (PRODUCTOS.length > 100) PRODUCTOS.shift();
}
async function api(params = {}) {
  const url = new URL("api.php", location.href);
  for (const [key, value] of Object.entries(params))
    if (value !== "" && value !== null && value !== undefined)
      url.searchParams.set(key, String(value));
  const response = await window.fetch(url, { cache: "no-store" });
  const data = await response.json();
  if (!response.ok || !Array.isArray(data.items) || data.items.length > 100)
    throw new Error(data.error || "No pudimos cargar los productos.");
  cacheProducts(data.items);
  return data;
}
async function lookup(ids) {
  if (!ids.length) return [];
  return (
    await api({ scope: "lookup", ids: [...new Set(ids)].slice(0, 100).join(","), limit: 100 })
  ).items;
}
function wishes() {
  const raw = readStore("byfridacase_wishlist");
  return Array.isArray(raw)
    ? [...new Set(raw.filter((x) => typeof x === "string").slice(0, 100))]
    : [];
}
function syncWishes() {
  const list = wishes();
  document.querySelectorAll("[data-wish-count]").forEach((b) => {
    b.textContent = list.length;
    b.hidden = !list.length;
  });
  document
    .querySelectorAll("[data-wish]")
    .forEach((b) => b.setAttribute("aria-pressed", String(list.includes(b.dataset.wish))));
}
function toggleWish(id) {
  const list = wishes(),
    yes = list.includes(id);
  writeStore(
    "byfridacase_wishlist",
    yes ? list.filter((x) => x !== id) : [...list, id].slice(-100),
  );
  syncWishes();
  showToast(yes ? "Lo sacamos de tus favoritos." : "Guardado entre tus favoritos.");
}
function productPhoto(p, cls = "") {
  const img = p.imagenes?.[0];
  return img
    ? `<img class="${cls}" src="${esc(img)}" width="1254" height="1254" alt="${esc(p.nombre)}">`
    : '<span role="img" aria-label="Fotografía pendiente"></span>';
}
function stepper(p, qty = 1, variant = "") {
  return `<div class="stepper"><button type="button" data-qty="-1" aria-label="Restar una unidad">−</button><input type="number" min="1" max="${Math.min(p.stock, 99)}" value="${qty}" aria-label="Cantidad de ${esc(p.nombre)}" data-quantity data-product="${esc(p.id)}" data-variant="${esc(variant)}"><button type="button" data-qty="1" aria-label="Sumar una unidad">+</button></div>`;
}
function card(p, rail = false) {
  const liked = wishes().includes(p.id);
  return `<div class="product-wrap" data-animate="${rail ? "der" : "subir"}" style="opacity:0;transform:translate${rail ? "X(48px)" : "Y(28px)"}"><article class="product-card" data-product-card="${esc(p.id)}"><a class="product-image ${p.imagenes.length ? "" : "no-photo"} ${p.imagenes[0]?.includes("01_imagen") ? "is-pink" : ""}" href="${catalogURL}?producto=${esc(p.slug)}" data-detail="${esc(p.id)}">${productPhoto(p)}<span class="product-badge">${p.stock === 0 ? "Sin stock" : p.descuento ? `−${p.descuento}%` : p.nuevo ? "Nuevo" : p.marca}</span></a><button class="icon-btn wish-btn" type="button" aria-label="Guardar ${esc(p.nombre)} en favoritos" aria-pressed="${liked}" data-wish="${esc(p.id)}">${icon("heart")}</button><div class="product-info"><span class="product-meta">${esc(p.marca)} · ${p.categoria === "fundas" ? "elegí tu modelo" : esc(CATEGORIAS.find((c) => c.id === p.categoria)?.nombre || p.categoria)}</span><h3><a href="${catalogURL}?producto=${esc(p.slug)}" data-detail="${esc(p.id)}">${esc(p.nombre)}</a></h3><div class="product-price"><strong>${formatearPrecio(precioFinal(p))}</strong>${p.descuento ? `<s>${formatearPrecio(p.precio)}</s>` : ""}</div><div class="prod-actions">${stepper(p)}<button type="button" class="prod-add" data-add="${esc(p.id)}" ${p.stock ? "" : "disabled"}>${icon("cart")}<span>${p.stock ? "Agregar" : "Sin stock"}</span></button></div><button type="button" class="quick-buy" data-buy="${esc(p.id)}" ${p.stock ? "" : "disabled"}>Comprar ahora</button></div></article></div>`;
}
function refresh() {
  if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
}
function renderError(container, error, retry) {
  container.innerHTML = `<div class="empty-state"><p>${esc(error.message || "No pudimos cargar este contenido.")}</p><button type="button" class="btn btn-soft" data-retry>Volver a intentar</button></div>`;
  container.querySelector("[data-retry]").addEventListener("click", retry);
}
function initCategories() {
  const active = new URLSearchParams(location.search).get("cat");
  document.querySelectorAll("[data-cats-menu]").forEach((el) => {
    el.innerHTML = CATEGORIAS.map(
      (c) =>
        `<li><a href="${catalogURL}?cat=${c.id}"${active === c.id ? ' aria-current="page"' : ""}><span>${c.nombre}</span><small>${c.count}</small></a></li>`,
    ).join("");
  });
  const strip = document.querySelector("[data-category-strip]");
  if (strip)
    strip.innerHTML = CATEGORIAS.map(
      (c, i) =>
        `<a href="${catalogURL}?cat=${c.id}" data-animate="escala" style="opacity:0;transform:translateY(20px) scale(.92)"><span>${c.nombre}</span><small>0${i + 1}</small></a>`,
    ).join("");
  const panel = document.getElementById("navCats"),
    button = document.querySelector(".nav-cats__btn"),
    wrap = document.querySelector(".nav-cats");
  if (!button) return;
  let timer;
  const set = (on) => {
    panel.hidden = !on;
    button.setAttribute("aria-expanded", String(on));
  };
  button.addEventListener("click", () => set(panel.hidden));
  wrap.addEventListener("mouseenter", () => {
    if (window.matchMedia("(min-width:901px)").matches) {
      clearTimeout(timer);
      set(true);
    }
  });
  wrap.addEventListener("mouseleave", () => {
    if (window.matchMedia("(min-width:901px)").matches) timer = setTimeout(() => set(false), 120);
  });
  wrap.addEventListener("focusin", () => {
    if (window.matchMedia("(min-width:901px)").matches) {
      clearTimeout(timer);
      set(true);
    }
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
let featureVersion = 0;
async function loadFeatured(tab = "novedades") {
  const track = document.getElementById("featuredProducts");
  if (!track) return;
  const version = ++featureVersion;
  track.setAttribute("aria-busy", "true");
  try {
    const data = await api({ scope: "home", limit: 8, tab });
    if (version !== featureVersion) return;
    track.innerHTML = data.items.map((p) => card(p, true)).join("");
    document.getElementById("productRail").scrollLeft = 0;
    revelarNuevos(track);
    syncWishes();
    updateRailArrows();
    refresh();
  } catch (error) {
    if (version === featureVersion) renderError(track, error, () => loadFeatured(tab));
  } finally {
    if (version === featureVersion) track.removeAttribute("aria-busy");
  }
}
function updateRailArrows() {
  const vp = document.getElementById("productRail");
  if (!vp) return;
  const track = vp.firstElementChild;
  const start = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
  const prev = document.querySelector("[data-rail-prev]"),
    next = document.querySelector("[data-rail-next]");
  prev.disabled = vp.scrollLeft <= start + 2;
  next.disabled = vp.scrollLeft >= vp.scrollWidth - vp.clientWidth - 2;
}
function initFeatured() {
  const vp = document.getElementById("productRail");
  if (!vp) return;
  initRailDrag(vp);
  vp.addEventListener("scroll", updateRailArrows, { passive: true });
  document.querySelectorAll("[data-feature-tab]").forEach((b) =>
    b.addEventListener("click", () => {
      document.querySelectorAll("[data-feature-tab]").forEach((x) => {
        x.classList.toggle("active", x === b);
        x.setAttribute("aria-pressed", String(x === b));
      });
      loadFeatured(b.dataset.featureTab);
    }),
  );
  document
    .querySelector("[data-rail-prev]")
    .addEventListener("click", () =>
      vp.scrollBy({ left: -vp.clientWidth * 0.7, behavior: reduceMotion ? "instant" : "smooth" }),
    );
  document
    .querySelector("[data-rail-next]")
    .addEventListener("click", () =>
      vp.scrollBy({ left: vp.clientWidth * 0.7, behavior: reduceMotion ? "instant" : "smooth" }),
    );
  window.addEventListener("resize", updateRailArrows);
}
let activeDialog = null,
  lastTrigger = null;
const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])';
function trap(e) {
  if (e.key !== "Tab") return;
  const els = [...e.currentTarget.querySelectorAll(FOCUSABLE)].filter(
    (el) => el.getClientRects().length,
  );
  if (!els.length) return;
  const first = els[0],
    last = els[els.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    last.focus();
    e.preventDefault();
  } else if (!e.shiftKey && document.activeElement === last) {
    first.focus();
    e.preventDefault();
  }
}
function openDialog(backdrop, trigger) {
  if (!backdrop) return;
  if (activeDialog) closeDialog(false);
  lastTrigger = trigger || document.activeElement;
  activeDialog = backdrop;
  backdrop.hidden = false;
  document.body.classList.add("no-scroll");
  backdrop.addEventListener("keydown", trap);
  requestAnimationFrame(() => {
    backdrop.classList.add("open");
    backdrop.querySelector(FOCUSABLE)?.focus();
  });
  document.querySelector("main")?.setAttribute("inert", "");
  document.querySelector(".site-header")?.setAttribute("inert", "");
}
function closeDialog(restore = true) {
  if (!activeDialog) return;
  const old = activeDialog;
  old.classList.remove("open");
  old.hidden = true;
  old.removeEventListener("keydown", trap);
  activeDialog = null;
  document.body.classList.remove("no-scroll");
  document.querySelector("main")?.removeAttribute("inert");
  document.querySelector(".site-header")?.removeAttribute("inert");
  if (restore) lastTrigger?.focus();
}
function initDialogs() {
  document
    .querySelectorAll("[data-close-dialog]")
    .forEach((b) => b.addEventListener("click", () => closeDialog()));
  document.querySelectorAll(".dialog-backdrop").forEach((b) =>
    b.addEventListener("click", (e) => {
      if (e.target === b) closeDialog();
    }),
  );
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDialog();
  });
  document
    .querySelectorAll("[data-open-cart]")
    .forEach((b) => b.addEventListener("click", () => openCartDrawer(b)));
}
let detailVersion = 0;
async function openProduct(id, buy = false) {
  let p = getProducto(id);
  if (!p) {
    try {
      p = (await lookup([id]))[0];
    } catch (e) {
      showToast(e.message);
      return;
    }
  }
  if (!p) return;
  if (p.categoria === "sorteos") {
    location.href = raffleURL;
    return;
  }
  const version = ++detailVersion;
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
    name: p.nombre,
    description: "Producto ilustrativo de la demo. " + p.descripcion,
    image: p.imagenes.map((src) => new URL(src, location.href).href),
    offers: {
      "@type": "Offer",
      priceCurrency: "ARS",
      price: precioFinal(p),
      availability: "https://schema.org/" + (p.stock ? "InStock" : "OutOfStock"),
    },
  });
  const area = document.getElementById("productDetail");
  area.innerHTML = `<div class="detail-grid"><div class="detail-image">${productPhoto(p)}</div><div class="detail-copy"><span class="eyebrow">${esc(p.marca)} · BYFRIDACASE</span><h2>${esc(p.nombre)}</h2><p>${esc(p.descripcion)}</p><div class="product-price"><strong>${formatearPrecio(precioFinal(p))}</strong>${p.descuento ? `<s>${formatearPrecio(p.precio)}</s>` : ""}</div><label for="detailVariant">${p.categoria === "fundas" ? "Modelo de tu celular" : "Elegí la variante"}</label><select id="detailVariant">${p.variantes.map((v) => `<option>${esc(v)}</option>`).join("")}</select><div class="prod-actions">${stepper(p)}<button type="button" class="prod-add" data-detail-add="${esc(p.id)}" ${p.stock ? "" : "disabled"}>${p.stock ? "Agregar al carrito" : "Sin stock"}</button></div><button type="button" class="btn btn-soft" data-detail-buy="${esc(p.id)}" ${p.stock ? "" : "disabled"}>Comprar ahora</button><small>Producto de muestra · confirmá la compatibilidad exacta. ${p.stock ? "Stock ilustrativo: " + p.stock : "Sin stock en esta variante de ejemplo."}</small></div></div><div class="related" id="relatedProducts"></div>`;
  document.querySelector("#productBackdrop [role=dialog]").setAttribute("aria-label", p.nombre);
  openDialog(document.getElementById("productBackdrop"));
  if (buy) area.querySelector("#detailVariant")?.focus();
  try {
    const data = await api({ scope: "catalog", cat: p.categoria, limit: 4 });
    if (version !== detailVersion) return;
    document.getElementById("relatedProducts").innerHTML =
      "<p>También te puede gustar</p>" +
      data.items
        .filter((x) => x.id !== id)
        .slice(0, 3)
        .map(
          (x) =>
            `<button type="button" data-detail="${esc(x.id)}">${esc(x.nombre)} ${icon("arrow")}</button>`,
        )
        .join("");
  } catch {
    document.getElementById("relatedProducts").textContent = "";
  }
}
async function addProduct(id, button, buy = false) {
  let p = getProducto(id);
  if (!p) {
    try {
      p = (await lookup([id]))[0];
    } catch (error) {
      showToast(error.message);
      return;
    }
  }
  if (!p) return;
  if (p.categoria === "sorteos") {
    location.href = raffleURL;
    return;
  }
  if (
    p.variantes.length > 1 &&
    !button.hasAttribute("data-detail-add") &&
    !button.hasAttribute("data-detail-buy")
  ) {
    openProduct(id, buy);
    return;
  }
  const root = button.closest(".detail-copy,.product-card");
  const qty = Number(root?.querySelector("[data-quantity]")?.value || 1),
    variant = root?.querySelector("#detailVariant")?.value || p.variantes[0];
  if (Cart.add(p, qty, variant)) {
    showToast("¡Listo! Lo sumamos a tu carrito.");
    if (buy) openCartDrawer(button);
  } else showToast("Ya agregaste el stock disponible de esta muestra.");
}
async function hydrateCart() {
  const raw = Cart.get();
  if (!raw.length) return;
  const products = await lookup(raw.map((i) => i.id));
  const stock = new Map(products.map((p) => [p.id, Math.min(p.stock, 99)]));
  const clean = [];
  for (const i of raw) {
    const p = products.find((x) => x.id === i.id);
    if (!p || !p.variantes.includes(i.variante) || !(stock.get(i.id) > 0)) continue;
    const qty = Math.min(i.qty, stock.get(i.id));
    clean.push({ ...i, qty });
    stock.set(i.id, stock.get(i.id) - qty);
  }
  if (JSON.stringify(clean) !== JSON.stringify(raw)) Cart.save(clean);
}
function renderCart() {
  const area = document.getElementById("cartItems");
  if (!area) return;
  const items = Cart.get();
  document.getElementById("cartTotal").textContent = formatearPrecio(Cart.total());
  document.getElementById("checkoutBtn").disabled = !items.length;
  area.innerHTML = items.length
    ? items
        .map((i) => {
          const p = getProducto(i.id);
          if (!p) return "";
          return `<article class="cart-item">${productPhoto(p)}<div><h3>${esc(p.nombre)}</h3><small>${esc(i.variante)}</small><strong>${formatearPrecio(precioFinal(p) * i.qty)}</strong><div class="cart-item-controls">${stepper(p, i.qty, i.variante)}<button type="button" class="text-link" data-remove="${esc(i.id)}" data-variant="${esc(i.variante)}">Quitar</button></div></div></article>`;
        })
        .join("")
    : `<div class="empty-state"><p>Tu próximo favorito todavía está en la tienda.</p><a class="btn btn-soft" href="${catalogURL}">Volver al catálogo ${icon("arrow")}</a></div>`;
}
async function openCartDrawer(trigger) {
  openDialog(document.getElementById("cartBackdrop"), trigger);
  document.getElementById("cartItems").innerHTML = "<p>Actualizando tu carrito…</p>";
  document.getElementById("checkoutBtn").disabled = true;
  try {
    await hydrateCart();
    renderCart();
  } catch (error) {
    renderError(document.getElementById("cartItems"), error, () => openCartDrawer());
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
function initProductActions() {
  document.addEventListener("click", (e) => {
    const b = e.target.closest("button,a");
    if (!b) return;
    if (b.dataset.wish) {
      toggleWish(b.dataset.wish);
      return;
    }
    if (b.dataset.detail) {
      e.preventDefault();
      openProduct(b.dataset.detail);
      return;
    }
    for (const key of ["add", "buy", "detailAdd", "detailBuy"])
      if (b.dataset[key]) {
        addProduct(b.dataset[key], b, key.toLowerCase().includes("buy"));
        return;
      }
    if (b.dataset.qty) {
      const input = b.closest(".stepper").querySelector("input");
      input.value = Math.max(
        1,
        Math.min(Number(input.max) || 99, Number(input.value) + Number(b.dataset.qty)),
      );
      if (b.closest(".cart-item")) {
        Cart.setQty(input.dataset.product, input.dataset.variant, Number(input.value));
        renderCart();
      }
    }
    if (b.dataset.remove) {
      Cart.remove(b.dataset.remove, b.dataset.variant);
      renderCart();
    }
  });
  document.addEventListener("change", (e) => {
    if (e.target.matches("[data-quantity]")) {
      const input = e.target;
      input.value = Math.max(
        1,
        Math.min(Number(input.max) || 99, Math.floor(Number(input.value) || 1)),
      );
      if (input.closest(".cart-item")) {
        Cart.setQty(input.dataset.product, input.dataset.variant, Number(input.value));
        renderCart();
      }
    }
  });
  document.addEventListener("cart:updated", updateCartBadge);
  updateCartBadge();
}
let catalogCursor = null,
  catalogVersion = 0,
  catalogShown = 0,
  catalogLoading = false,
  catalogParams = {};
function filtersFromURL() {
  const p = new URLSearchParams(location.search);
  return {
    cat: CATEGORIAS.some((c) => c.id === p.get("cat")) ? p.get("cat") : "",
    marca: ["Apple", "Samsung", "Motorola", "Xiaomi", "Universal"].includes(p.get("marca"))
      ? p.get("marca")
      : "",
    q: (p.get("q") || "").slice(0, 80),
    precio: Math.max(0, Math.min(1000000, Number(p.get("precio")) || 0)) || "",
    orden: ["precio-asc", "precio-desc"].includes(p.get("orden")) ? p.get("orden") : "nombre",
    stock: p.get("stock") === "1" ? "1" : "",
    tab: ["ofertas", "novedades"].includes(p.get("tab")) ? p.get("tab") : "",
    favoritos: p.get("favoritos") === "1" ? "1" : "",
  };
}
async function loadCatalog(more = false) {
  const grid = document.getElementById("catalogGrid");
  if (!grid) return;
  if (more && catalogLoading) return;
  const version = ++catalogVersion;
  catalogLoading = true;
  const button = document.getElementById("catalogMore");
  button.disabled = true;
  grid.setAttribute("aria-busy", "true");
  if (!more) {
    catalogShown = 0;
    catalogCursor = null;
    grid.innerHTML = Array.from({ length: 4 }, () => '<div class="skeleton"></div>').join("");
  }
  try {
    let data;
    const params = {
      ...catalogParams,
      scope: "catalog",
      limit: 16,
      cursor: more ? catalogCursor : "",
    };
    delete params.favoritos;
    if (catalogParams.favoritos) {
      const list = wishes();
      if (!list.length) data = { items: [], total: 0, nextCursor: null };
      else {
        params.scope = "lookup";
        params.ids = list.join(",");
        data = await api(params);
      }
    } else data = await api(params);
    if (version !== catalogVersion) return;
    catalogCursor = data.nextCursor;
    catalogShown += data.items.length;
    if (!more) grid.innerHTML = "";
    grid.insertAdjacentHTML("beforeend", data.items.map((p) => card(p)).join(""));
    while (grid.children.length > 48) grid.firstElementChild.remove();
    if (!data.items.length && !more)
      grid.innerHTML = `<div class="empty-state"><p>${catalogParams.favoritos ? "Todavía no hay favoritos para esta búsqueda." : "No encontramos esa combinación."}</p><button type="button" class="btn btn-soft" data-clear-empty>Ver todos los productos</button></div>`;
    grid.querySelector("[data-clear-empty]")?.addEventListener("click", clearCatalog);
    document.getElementById("catalogCount").textContent =
      `${catalogParams.favoritos ? "Tus favoritos · " : ""}${data.total} productos · ${catalogShown > 48 ? "últimos 48 de " + catalogShown : catalogShown} mostrados`;
    document.getElementById("crumbCategory").textContent =
      CATEGORIAS.find((c) => c.id === catalogParams.cat)?.nombre || "Catálogo";
    button.hidden = !catalogCursor;
    revelarNuevos(grid);
    syncWishes();
    refresh();
  } catch (error) {
    if (version === catalogVersion) {
      if (!more) renderError(grid, error, () => loadCatalog());
      else showToast(error.message);
    }
  } finally {
    if (version === catalogVersion) {
      catalogLoading = false;
      button.disabled = false;
      grid.removeAttribute("aria-busy");
    }
  }
}
function clearCatalog() {
  catalogParams = {
    cat: "",
    marca: "",
    q: "",
    precio: "",
    orden: "nombre",
    stock: "",
    tab: "",
    favoritos: "",
  };
  fillFilters();
  saveFilterURL();
  loadCatalog();
}
function fillFilters() {
  const ids = {
    category: "cat",
    brandFilter: "marca",
    query: "q",
    priceFilter: "precio",
    sortFilter: "orden",
  };
  for (const [id, key] of Object.entries(ids))
    document.getElementById(id).value = catalogParams[key];
  document.getElementById("stockFilter").checked = !!catalogParams.stock;
}
function saveFilterURL() {
  const url = new URL(location.href);
  url.search = "";
  for (const [k, v] of Object.entries(catalogParams))
    if (v && !(k === "orden" && v === "nombre")) url.searchParams.set(k, v);
  window.history.replaceState({}, "", url);
  document.querySelectorAll(".gw-modelos__btn").forEach((a) => {
    const u = new URL(a.href);
    u.search = url.search;
    a.href = u.pathname + u.search;
  });
}
function initCatalog() {
  const form = document.getElementById("catalogFilters");
  if (!form) return;
  document
    .getElementById("category")
    .insertAdjacentHTML(
      "beforeend",
      CATEGORIAS.map((c) => `<option value="${c.id}">${c.nombre}</option>`).join(""),
    );
  catalogParams = filtersFromURL();
  fillFilters();
  const apply = () => {
    catalogParams = {
      ...catalogParams,
      cat: form.elements.cat.value,
      marca: form.elements.marca.value,
      q: form.elements.q.value.trim(),
      precio: Math.max(0, Number(form.elements.precio.value) || 0) || "",
      orden: form.elements.orden.value,
      stock: form.elements.stock.checked ? "1" : "",
    };
    saveFilterURL();
    loadCatalog();
  };
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    apply();
  });
  form.addEventListener("change", apply);
  document.getElementById("clearFilters").addEventListener("click", clearCatalog);
  document.getElementById("catalogMore").addEventListener("click", () => loadCatalog(true));
  if (window.innerWidth <= 900) form.querySelector("details").open = false;
  if (new URLSearchParams(location.search).has("buscar")) document.getElementById("query").focus();
  saveFilterURL();
}
function sessionList(key) {
  const value = readStore(key, [], true);
  return Array.isArray(value) ? value.slice(-100) : [];
}
function initRaffle() {
  const form = document.getElementById("raffleForm");
  if (!form) return;
  const phone = document.getElementById("participantPhone");
  if (typeof window.IMask !== "undefined") window.IMask(phone, { mask: "+{54} 9 0000000000" });
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = form.elements.nombre.value.trim(),
      city = form.elements.ciudad.value.trim(),
      tel = form.elements.telefono.value.replace(/\D/g, ""),
      qty = Number(form.elements.cantidad.value);
    const error = document.getElementById("raffleError");
    const invalid = [
      [form.elements.nombre, name.length < 2],
      [form.elements.ciudad, city.length < 2],
      [phone, tel.length < 10 || tel.length > 13],
      [form.elements.cantidad, !Number.isInteger(qty) || qty < 1 || qty > 10],
    ];
    invalid.forEach(([field, bad]) => field.setAttribute("aria-invalid", String(bad)));
    const first = invalid.find(([, bad]) => bad);
    if (first) {
      error.textContent =
        "Completá nombre, ciudad, teléfono válido y entre 1 y 10 participaciones.";
      error.hidden = false;
      first[0].focus();
      return;
    }
    error.hidden = true;
    const button = form.querySelector("[type=submit]");
    button.disabled = true;
    try {
      const p = (await lookup(["bf-024"]))[0];
      if (!p) throw new Error("La participación de prueba no está disponible.");
      if (
        !writeStore("byfridacase_participant", { nombre: name, ciudad: city, telefono: tel }, true)
      )
        return;
      if (Cart.add(p, qty, "Participación")) {
        showToast("Participación de prueba agregada. No se realizará ningún cobro.");
        await openCartDrawer(button);
      } else showToast("Ya alcanzaste el límite de participaciones de esta muestra.");
    } catch (err) {
      showToast(err.message);
    } finally {
      button.disabled = false;
    }
  });
}
let checkingOut = false;
async function checkout() {
  if (checkingOut || !Cart.count()) return;
  checkingOut = true;
  const button = document.getElementById("checkoutBtn");
  button.disabled = true;
  button.textContent = "Preparando pedido de prueba…";
  try {
    await hydrateCart();
    const items = Cart.get();
    if (!items.length) {
      renderCart();
      return;
    }
    const participation = items.find((i) => i.id === "bf-024");
    const participant = readStore("byfridacase_participant", null, true);
    if (participation && !participant) {
      showToast("Completá tus datos en Sorteos antes de continuar.");
      location.href = raffleURL;
      return;
    }
    const orders = sessionList("byfridacase_orders");
    const order = {
      id: "DEMO-" + Date.now().toString(36).toUpperCase(),
      fecha: new Date().toISOString(),
      total: Cart.total(),
      items: items.map((i) => ({ ...i, nombre: getProducto(i.id)?.nombre || i.id })),
      pago: "pendiente",
      envio: "por preparar",
    };
    if (!writeStore("byfridacase_orders", [...orders, order].slice(-20), true)) return;
    if (participation) {
      const participants = sessionList("byfridacase_participants");
      writeStore(
        "byfridacase_participants",
        [
          ...participants,
          { ...participant, order: order.id, qty: participation.qty, pago: "pendiente" },
        ].slice(-100),
        true,
      );
    }
    Cart.clear();
    renderCart();
    showToast("¡Genial! El pago online se activa al pasar la web a producción.");
    showToast("Pedido de prueba guardado en el panel de esta sesión.");
  } catch (error) {
    showToast(error.message);
  } finally {
    checkingOut = false;
    button.textContent = "Finalizar compra";
    button.disabled = !Cart.count();
  }
}
function initReviews() {
  const out = document.getElementById("reviewQuote");
  if (!out) return;
  const entries = [
    "Acá vas a encontrar cómo se ve una reseña de la tienda.",
    "Las fotos y opiniones de tus compras van a tener su lugar acá.",
    "Cada experiencia ayuda a elegir el próximo accesorio.",
  ];
  let current = 0;
  const change = (dir) => {
    current = (current + dir + entries.length) % entries.length;
    out.querySelector("p").textContent = entries[current];
    document.getElementById("reviewPosition").textContent = `0${current + 1} / 03`;
  };
  document.querySelector("[data-review-prev]").addEventListener("click", () => change(-1));
  document.querySelector("[data-review-next]").addEventListener("click", () => change(1));
}
function initCatCursor() {
  if (reduceMotion || !window.matchMedia("(hover:hover) and (pointer:fine)").matches) return;
  const cursor = document.querySelector(".cat-cursor");
  if (!cursor) return;
  const paw = cursor.querySelector("path");
  const openPaw = paw.getAttribute("d");
  document.body.classList.add("paw-enabled");
  window.addEventListener("pointermove", (e) => {
    cursor.style.transform = `translate(${e.clientX - 8}px,${e.clientY - 5}px)`;
    cursor.classList.toggle("visible", !e.target.closest("input,textarea,select"));
  });
  window.addEventListener("pointerdown", () => {
    cursor.classList.add("pressed");
    paw.setAttribute(
      "d",
      "M8 28V22c0-5 5-6 8-3 3-4 8-4 10-1 4-1 6 1 6 5v4c0 9-4 13-12 13S8 36 8 28Z",
    );
  });
  window.addEventListener("pointerup", () => {
    cursor.classList.remove("pressed");
    paw.setAttribute("d", openPaw);
  });
  window.addEventListener("blur", () => {
    cursor.classList.remove("visible", "pressed");
    paw.setAttribute("d", openPaw);
  });
  document.documentElement.addEventListener("pointerleave", () =>
    cursor.classList.remove("visible"),
  );
}
function initHeroMotion() {
  if (reduceMotion || typeof gsap === "undefined") return;
  const hero = document.querySelector(".hero");
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
  const img = hero.querySelector("[data-hero-img]");
  if (img) tl.from(img, { scale: 1.08, duration: 1.6 }, 0);
  tl.from(
    hero.querySelector(".hero-brand"),
    { rotate: -3, y: 18, opacity: 0, duration: 1.1, clearProps: "all" },
    0.1,
  )
    .from(hero.querySelector("h1"), { y: 22, opacity: 0, duration: 0.8, clearProps: "all" }, 0.25)
    .from(
      hero.querySelector(".hero-lead"),
      { y: 18, opacity: 0, duration: 0.8, clearProps: "all" },
      0.4,
    )
    .from(
      hero.querySelectorAll(".hero-ctas>*"),
      { y: 18, opacity: 0, duration: 0.7, stagger: 0.08, clearProps: "all" },
      0.55,
    )
    .from(
      hero.querySelector(".hero-raffle"),
      { x: 24, opacity: 0, duration: 0.7, clearProps: "all" },
      0.6,
    );
}
let adminCursor = null,
  adminVersion = 0,
  adminLoading = false,
  adminQuery = "",
  editorId = null,
  editorImage = null;
function edits() {
  const raw = readStore("byfridacase_edits", {});
  return raw && typeof raw === "object" && !Array.isArray(raw) ? raw : {};
}
function adminRow(p) {
  return `<article class="admin-row" data-admin-product="${esc(p.id)}" data-animate="subir" style="opacity:0;transform:translateY(28px)">${productPhoto(p)}<div><h3>${esc(p.nombre)}</h3><small>${esc(p.categoria)} · ${esc(p.marca)}</small></div><strong>${formatearPrecio(p.precio)}</strong><span class="stock-label">Stock: ${p.stock}</span><button type="button" data-edit="${esc(p.id)}">Editar</button></article>`;
}
async function loadAdmin(more = false) {
  const list = document.getElementById("adminList");
  if (!list) return;
  if (more && adminLoading) return;
  const version = ++adminVersion;
  adminLoading = true;
  const button = document.getElementById("adminMore");
  button.disabled = true;
  try {
    const data = await api({
      scope: "admin",
      limit: 100,
      q: adminQuery,
      cursor: more ? adminCursor : "",
    });
    if (version !== adminVersion) return;
    adminCursor = data.nextCursor;
    const changes = edits();
    const local = more
      ? []
      : Object.values(changes).filter(
          (p) => p.id.startsWith("local-") && normalize(p.nombre).includes(normalize(adminQuery)),
        );
    const page = [...local, ...data.items.map((p) => changes[p.id] || p)].slice(0, 100);
    list.innerHTML = page.map(adminRow).join("");
    document.getElementById("adminCount").textContent =
      `${data.total} productos de muestra · ${page.length} en esta página${Object.keys(changes).length ? " · hay cambios locales" : ""}`;
    button.hidden = !adminCursor;
    revelarNuevos(list);
    refresh();
  } catch (error) {
    if (version === adminVersion) renderError(list, error, () => loadAdmin());
  } finally {
    if (version === adminVersion) {
      adminLoading = false;
      button.disabled = false;
    }
  }
}
function openEditor(id) {
  let p = edits()[id] || getProducto(id);
  if (!p)
    p = {
      id: "local-" + Date.now().toString(36),
      nombre: "",
      precio: 1,
      stock: 1,
      descripcion: "",
      categoria: "fundas",
      marca: "Universal",
      variantes: ["Único"],
      imagenes: [],
      descuento: 0,
    };
  editorId = p.id;
  editorImage = p.imagenes[0] || null;
  const form = document.getElementById("productEditor");
  for (const key of ["nombre", "precio", "stock", "descripcion", "categoria"])
    form.elements[key].value = p[key];
  form.elements.foto.value = "";
  const img = document.getElementById("editorPhoto");
  img.hidden = !editorImage;
  if (editorImage) img.src = editorImage;
  document.getElementById("editorError").hidden = true;
  document.getElementById("editStatus").textContent =
    "Los cambios válidos se guardan automáticamente en este navegador.";
  openDialog(document.getElementById("editorBackdrop"));
}
function saveEditor() {
  const form = document.getElementById("productEditor");
  if (!form.checkValidity()) {
    document.getElementById("editStatus").textContent =
      "Completá los campos requeridos para guardar la ficha.";
    return;
  }
  const old = edits()[editorId] ||
    getProducto(editorId) || {
      id: editorId,
      marca: "Universal",
      variantes: ["Único"],
      descuento: 0,
    };
  const p = {
    ...old,
    nombre: form.elements.nombre.value.trim(),
    precio: Number(form.elements.precio.value),
    stock: Number(form.elements.stock.value),
    descripcion: form.elements.descripcion.value.trim(),
    categoria: form.elements.categoria.value,
    imagenes: editorImage ? [editorImage] : [],
  };
  if (
    p.nombre.length < 2 ||
    p.descripcion.length < 3 ||
    !Number.isInteger(p.stock) ||
    !Number.isFinite(p.precio)
  )
    return;
  const changes = edits();
  if (!changes[p.id] && Object.keys(changes).length >= 30) {
    showToast("La vista previa permite editar hasta 30 fichas.");
    return;
  }
  changes[p.id] = p;
  if (writeStore("byfridacase_edits", changes)) {
    document.getElementById("editStatus").textContent =
      "Guardado en este navegador · solo vista previa";
    const row = document.querySelector(`[data-admin-product="${p.id}"]`);
    if (row) {
      const temp = document.createElement("div");
      temp.innerHTML = adminRow(p);
      const replacement = temp.firstElementChild;
      replacement.classList.add("in");
      row.replaceWith(replacement);
    } else loadAdmin();
  }
}
function renderOrders() {
  const list = document.getElementById("ordersList");
  if (!list) return;
  const orders = sessionList("byfridacase_orders");
  document.querySelector("#adminOrders>.empty-state").hidden = orders.length > 0;
  list.innerHTML = orders
    .slice()
    .reverse()
    .map(
      (o) =>
        `<article class="order-card"><h3>${esc(o.id)} · ${formatearPrecio(o.total)}</h3><p>${o.items.map((i) => `${esc(i.nombre)} × ${i.qty}`).join(" · ")}</p><label>Estado de pago de prueba<select data-order-pay="${esc(o.id)}">${["pendiente", "pagado", "cancelado"].map((s) => `<option ${s === o.pago ? "selected" : ""}>${s}</option>`).join("")}</select></label><label>Estado de envío de prueba<select data-order-ship="${esc(o.id)}">${["por preparar", "preparando", "enviado", "entregado"].map((s) => `<option ${s === o.envio ? "selected" : ""}>${s}</option>`).join("")}</select></label></article>`,
    )
    .join("");
}
function renderParticipants() {
  const el = document.getElementById("participantsList");
  if (!el) return;
  const rows = sessionList("byfridacase_participants");
  el.innerHTML = rows.length
    ? rows
        .map(
          (p) =>
            `<div class="participant-row"><strong>${esc(p.nombre)}</strong><span>${esc(p.ciudad)}</span><span>${esc(p.telefono)}</span><span>${p.qty} participación(es)</span><span>Pago de prueba: ${esc(p.pago)}</span><small>${esc(p.order)}</small></div>`,
        )
        .join("")
    : '<div class="empty-state"><p>Todavía no hay participaciones de prueba.</p><span>Completá el formulario de Sorteos y finalizá el pedido para verlas acá.</span></div>';
}
function initAdmin() {
  if (!document.getElementById("adminList")) return;
  document.getElementById("adminSearch").addEventListener("submit", (e) => {
    e.preventDefault();
    adminQuery = document.getElementById("adminQuery").value.trim();
    loadAdmin();
  });
  document.getElementById("adminMore").addEventListener("click", () => loadAdmin(true));
  document.getElementById("newProduct").addEventListener("click", () => openEditor());
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-edit]");
    if (b) openEditor(b.dataset.edit);
  });
  document.querySelectorAll("[data-admin-tab]").forEach((b) =>
    b.addEventListener("click", () => {
      const tab = b.dataset.adminTab;
      document.querySelectorAll("[data-admin-tab]").forEach((x) => {
        x.classList.toggle("active", x === b);
        x.setAttribute("aria-pressed", String(x === b));
      });
      document.getElementById("adminProducts").hidden = tab !== "productos";
      document.getElementById("adminOrders").hidden = tab !== "pedidos";
      document.getElementById("adminParticipants").hidden = tab !== "participantes";
      renderOrders();
      renderParticipants();
      refresh();
    }),
  );
  const form = document.getElementById("productEditor");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    saveEditor();
    if (form.checkValidity()) closeDialog();
  });
  form.addEventListener("change", (e) => {
    if (e.target.name !== "foto") saveEditor();
  });
  form.elements.foto.addEventListener("change", () => {
    const file = form.elements.foto.files[0];
    if (!file) return;
    const error = document.getElementById("editorError");
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 250000) {
      error.textContent = "Elegí una foto JPG, PNG o WebP de hasta 250 KB para esta vista previa.";
      error.hidden = false;
      return;
    }
    error.hidden = true;
    const reader = new window.FileReader();
    reader.onload = () => {
      editorImage = reader.result;
      const img = document.getElementById("editorPhoto");
      img.src = editorImage;
      img.hidden = false;
      saveEditor();
    };
    reader.readAsDataURL(file);
  });
  document.addEventListener("change", (e) => {
    const pay = e.target.dataset.orderPay,
      ship = e.target.dataset.orderShip;
    if (!pay && !ship) return;
    const orders = sessionList("byfridacase_orders"),
      o = orders.find((x) => x.id === (pay || ship));
    if (!o) return;
    o[pay ? "pago" : "envio"] = e.target.value;
    writeStore("byfridacase_orders", orders, true);
    if (pay) {
      const people = sessionList("byfridacase_participants");
      people.forEach((p) => {
        if (p.order === pay) p.pago = e.target.value;
      });
      writeStore("byfridacase_participants", people, true);
    }
    showToast("Estado de prueba actualizado.");
  });
  document.getElementById("drawDemo").addEventListener("click", () => {
    const entries = sessionList("byfridacase_participants").filter(
      (p) => p.pago === "pagado" && p.qty > 0,
    );
    const total = entries.reduce((n, p) => n + Math.min(99, p.qty), 0);
    const result = document.getElementById("drawResult");
    if (!total) {
      result.textContent = "No hay participaciones con pago de prueba marcado como pagado.";
      return;
    }
    const random = new Uint32Array(1);
    const max = Math.floor(4294967296 / total) * total;
    do {
      window.crypto.getRandomValues(random);
    } while (random[0] >= max);
    let ticket = random[0] % total;
    const winner = entries.find((p) => {
      ticket -= Math.min(99, p.qty);
      return ticket < 0;
    });
    result.textContent = `Resultado de simulación: ${winner.nombre}, ${winner.ciudad}. No es un ganador real.`;
  });
  document.getElementById("clearDemoPeople").addEventListener("click", () => {
    window.sessionStorage.removeItem("byfridacase_participant");
    window.sessionStorage.removeItem("byfridacase_participants");
    document.getElementById("drawResult").textContent = "";
    renderParticipants();
    showToast("Datos de participantes de prueba borrados.");
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
  cart?.addEventListener("click", () => openCartDrawer(cart));
  sync();
}
document.addEventListener("contextmenu", (e) => e.preventDefault());
document.addEventListener("dragstart", (e) => e.preventDefault());
document.addEventListener("keydown", (e) => {
  const k = e.key.toLowerCase();
  if (
    k === "f12" ||
    (e.ctrlKey && e.shiftKey && ["i", "j", "c"].includes(k)) ||
    (e.ctrlKey && k === "u")
  )
    e.preventDefault();
});
if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined")
  gsap.registerPlugin(ScrollTrigger);
if (typeof ScrollTrigger !== "undefined")
  window.addEventListener("load", () => ScrollTrigger.refresh());
async function boot() {
  document.querySelectorAll('a[href^="https://wa.me/"]').forEach((a) => {
    const url = new URL(a.href);
    url.pathname = "/" + WHATSAPP_NUMBER;
    a.href = url.href;
  });
  const initialSlug = new URLSearchParams(location.search).get("producto");
  const editor = document.getElementById("editorBackdrop");
  if (editor) document.body.appendChild(editor);
  initCategories();
  initNav();
  initDialogs();
  initProductActions();
  initCatalog();
  initFeatured();
  initAdmin();
  initRaffle();
  initReviews();
  initCatCursor();
  initModelBarScroll();
  initFloats();
  initHeroMotion();
  syncWishes();
  document.getElementById("checkoutBtn")?.addEventListener("click", checkout);
  document
    .querySelectorAll("[data-tiktok]")
    .forEach((b) =>
      b.addEventListener("click", () =>
        showToast("El enlace de TikTok se agregará cuando Byfridacase confirme su usuario."),
      ),
    );
  await Promise.allSettled([loadFeatured(), loadCatalog(), loadAdmin()]);
  initReveals();
  if (typeof gsap === "undefined")
    document.querySelectorAll("[data-animate]").forEach((el) => el.classList.add("in"));
  if (initialSlug) {
    try {
      const data = await api({ scope: "lookup", slug: initialSlug, limit: 1 });
      if (data.items[0]) openProduct(data.items[0].id);
    } catch {
      showToast("No pudimos abrir ese producto.");
    }
  }
}

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
  const desktopMq = window.matchMedia("(min-width: 901px)");
  const close = () => {
    nav.removeAttribute("role");
    nav.removeAttribute("aria-modal");
    nav.removeEventListener("keydown", trap);
    nav.classList.remove("open");
    bd.classList.remove("open");
    if (!desktopMq.matches) nav.setAttribute("inert", "");
    toggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("no-scroll");
  };
  const open = () => {
    nav.setAttribute("role", "dialog");
    nav.setAttribute("aria-modal", "true");
    nav.addEventListener("keydown", trap);
    nav.classList.add("open");
    bd.classList.add("open");
    nav.removeAttribute("inert");
    toggle.setAttribute("aria-expanded", "true");
    document.body.classList.add("no-scroll");
    nav.querySelector("a")?.focus();
  };
  toggle.addEventListener("click", () => (nav.classList.contains("open") ? close() : open()));
  closeBtn?.addEventListener("click", () => {
    close();
    toggle.focus();
  });
  bd.addEventListener("click", close);
  nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", close));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("open")) {
      close();
      toggle.focus();
    }
  });
  const syncInert = () => {
    if (desktopMq.matches) nav.removeAttribute("inert");
    else if (!nav.classList.contains("open")) nav.setAttribute("inert", "");
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

let revealsListos = false;
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
    showTimer = setTimeout(() => bar.classList.remove("gw-modelos--scrolling"), 120);
  };
  window.addEventListener(
    "scroll",
    () => {
      if (!frame) frame = requestAnimationFrame(update);
    },
    { passive: true },
  );
}

function initRailDrag(vp) {
  if (!vp) return;
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
        vp.classList.add("dragging");
      }
    }
    e.preventDefault();
    vp.scrollLeft = startScroll - dx;
  });
  const end = (e) => {
    if (!dragging || (e && pointerId !== null && e.pointerId !== pointerId)) return;
    dragging = false;
    if (moved) {
      try {
        vp.releasePointerCapture?.(pointerId);
      } catch {
        vp.classList.remove("dragging");
      }
      vp.classList.remove("dragging");
      const kill = (ev) => {
        ev.stopPropagation();
        ev.preventDefault();
      };
      vp.addEventListener("click", kill, { capture: true, once: true });
      setTimeout(() => vp.removeEventListener("click", kill, { capture: true }), 0);
    }
    pointerId = null;
    moved = false;
  };
  vp.addEventListener("pointerup", end);
  vp.addEventListener("pointercancel", end);
  vp.addEventListener("dragstart", (e) => e.preventDefault());
}

boot();
