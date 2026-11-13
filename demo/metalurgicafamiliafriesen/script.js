/* eslint no-empty: ["error", { "allowEmptyCatch": true }] */
"use strict";
const WHATSAPP_NUMBER = "5492954537747";
const CATEGORIAS = [
  { id: "tinglados", nombre: "Tinglados", count: 3 },
  { id: "galpones", nombre: "Galpones", count: 6 },
];
const USOS = { resguardo: "Resguardo", deposito: "Depósito", trabajo: "Trabajo" };
const PRODUCTOS = new Map();
const cartProducts = new Map();
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isModel2 = document.body.classList.contains("m2");
const catalogUrl = isModel2 ? "catalogo-2.html" : "catalogo.html";
const esc = (s) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
const normalizar = (s) =>
  String(s ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
const getProducto = (id) => PRODUCTOS.get(id) || cartProducts.get(id);
const quantity = (n) => Math.max(1, Math.min(99, Math.floor(Number(n) || 1)));
const whatsapp = (lines) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
const plus =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';
const arrow =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>';
let revealsListos = false;
let activeOverlay = null;
let previousFocus = null;
let quickRequest = 0;
let quickProduct = null;
let quickQty = 1;
let cartRequest = 0;

const Cart = {
  KEY: "metalurgicafamiliafriesen_cart",
  get() {
    try {
      const raw = JSON.parse(localStorage.getItem(this.KEY));
      if (!Array.isArray(raw)) return [];
      const items = new Map();
      for (const item of raw.slice(0, 40)) {
        if (
          !item ||
          typeof item.id !== "string" ||
          !/^friesen-[a-z0-9-]{1,80}$/.test(item.id) ||
          !Number.isInteger(item.qty) ||
          item.qty < 1
        )
          continue;
        const current = items.get(item.id);
        items.set(item.id, {
          id: item.id,
          qty: quantity((current?.qty || 0) + item.qty),
        });
      }
      return [...items.values()];
    } catch {
      return [];
    }
  },
  save(items) {
    try {
      localStorage.setItem(this.KEY, JSON.stringify(items));
    } catch {
      showToast(
        "El navegador no pudo guardar la lista. Habilitá el almacenamiento para continuar.",
      );
      return false;
    }
    const ids = new Set(items.map((i) => i.id));
    for (const id of cartProducts.keys()) if (!ids.has(id)) cartProducts.delete(id);
    document.dispatchEvent(new CustomEvent("cart:updated"));
    return true;
  },
  add(producto, qty = 1) {
    if (!producto?.id) return false;
    const items = this.get();
    const existing = items.find((i) => i.id === producto.id);
    if (!existing && items.length >= 40) {
      showToast("Podés consultar hasta 40 referencias en una lista.");
      return false;
    }
    if (existing) existing.qty = quantity(existing.qty + quantity(qty));
    else items.push({ id: producto.id, qty: quantity(qty) });
    cartProducts.set(producto.id, producto);
    return this.save(items);
  },
  setQty(id, qty) {
    const items = this.get();
    const item = items.find((i) => i.id === id);
    if (!item) return false;
    item.qty = quantity(qty);
    return this.save(items);
  },
  remove(id) {
    return this.save(this.get().filter((i) => i.id !== id));
  },
  clear() {
    return this.save([]);
  },
  count() {
    return this.get().reduce((sum, item) => sum + item.qty, 0);
  },
};

function cacheProducts(items) {
  for (const product of items) {
    PRODUCTOS.delete(product.id);
    PRODUCTOS.set(product.id, product);
    while (PRODUCTOS.size > 100) PRODUCTOS.delete(PRODUCTOS.keys().next().value);
  }
}

async function requestProducts(params, signal) {
  const url = new URL("api.php", location.href);
  for (const [key, value] of Object.entries(params)) {
    if (value !== "" && value !== null && value !== undefined)
      url.searchParams.set(key, String(value));
  }
  if (params.q) url.searchParams.set("q", normalizar(params.q));
  const response = await window.fetch(url, {
    signal,
    cache: "no-store",
    headers: { Accept: "application/json" },
  });
  if (!response.ok) throw new Error("No pudimos cargar las propuestas.");
  const data = await response.json();
  const cap = { home: 6, catalog: 16, admin: 100, lookup: 100 }[params.scope] || 16;
  if (!Array.isArray(data.items) || data.items.length > cap)
    throw new Error("Respuesta inválida.");
  cacheProducts(data.items);
  return data;
}

function refreshScroll() {
  if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
}

function stepper(qty, id = "") {
  return `<div class="stepper"${id ? ` data-stepper="${esc(id)}"` : ""}><button type="button" data-step="-1" aria-label="Quitar una unidad"${qty <= 1 ? " disabled" : ""}>−</button><output aria-live="polite">${qty}</output><button type="button" data-step="1" aria-label="Sumar una unidad"${qty >= 99 ? " disabled" : ""}>+</button></div>`;
}

function cardHTML(product, role = "subir") {
  const category =
    CATEGORIAS.find((c) => c.id === product.categoria)?.nombre || "Estructura";
  return `<article class="prod-card" data-product-id="${esc(product.id)}" data-animate="${role}" style="opacity:0;transform:translate${role === "der" ? "X" : "Y"}(28px)"><button class="prod-photo" type="button" data-product="${esc(product.id)}" aria-label="Ver ${esc(product.nombre)}"><img src="${esc(product.imagenes[0])}" width="1024" height="1024" alt="${esc(product.nombre)}, imagen ilustrativa"><span class="photo-hint">${plus}</span></button><div class="prod-info"><p class="prod-category">${esc(category)}</p><h3 class="prod-name"><button type="button" data-product="${esc(product.id)}">${esc(product.nombre)}</button></h3><p class="prod-meta">Presupuesto a consultar</p><div class="prod-actions"><button class="btn prod-add" type="button" data-add="${esc(product.id)}" aria-label="Agregar ${esc(product.nombre)} a tu consulta">${plus} Agregar</button><button class="icon-btn" type="button" data-product="${esc(product.id)}" aria-label="Ver detalle de ${esc(product.nombre)}">${arrow}</button></div></div></article>`;
}

async function resolveProduct(id) {
  const cached = getProducto(id);
  if (cached) return cached;
  const data = await requestProducts({ scope: "lookup", ids: id, limit: 1 });
  return data.items[0];
}

function trapFocus(event) {
  if (event.key !== "Tab") return;
  const container =
    activeOverlay?.querySelector('[role="dialog"]') ||
    document.querySelector(".main-nav.open");
  if (!container) return;
  const items = [
    ...container.querySelectorAll(
      'a[href],button:not([disabled]),input:not([disabled]),select,textarea,[tabindex="0"]',
    ),
  ].filter((el) => el.getClientRects().length && !el.closest("[hidden]"));
  const first = items[0],
    last = items.at(-1);
  if (!first) {
    event.preventDefault();
    container.focus();
    return;
  }
  if (
    event.shiftKey &&
    (document.activeElement === first || !container.contains(document.activeElement))
  ) {
    event.preventDefault();
    last.focus();
  } else if (
    !event.shiftKey &&
    (document.activeElement === last || !container.contains(document.activeElement))
  ) {
    event.preventDefault();
    first.focus();
  }
}

function openOverlay(overlay) {
  if (activeOverlay !== overlay) {
    previousFocus = previousFocus || document.activeElement;
    if (activeOverlay) {
      activeOverlay.hidden = true;
      activeOverlay.classList.remove("open");
    }
  }
  activeOverlay = overlay;
  overlay.hidden = false;
  document.body.classList.add("no-scroll");
  document.querySelector("main").inert = true;
  document.querySelector(".site-header").inert = true;
  document.querySelector(".site-footer").inert = true;
  requestAnimationFrame(() => {
    if (activeOverlay === overlay) overlay.classList.add("open");
  });
  overlay.querySelector("[data-close-overlay]")?.focus();
}

function closeOverlay() {
  if (!activeOverlay) return;
  quickRequest++;
  activeOverlay.classList.remove("open");
  activeOverlay.hidden = true;
  activeOverlay = null;
  document.body.classList.remove("no-scroll");
  document.querySelector("main").inert = false;
  document.querySelector(".site-header").inert = false;
  document.querySelector(".site-footer").inert = false;
  if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
  else document.querySelector("[data-open-cart]")?.focus();
  previousFocus = null;
}

function renderQuick() {
  const product = quickProduct;
  if (!product) return;
  const url = whatsapp([
    "Hola, me interesa esta referencia de Metalúrgica Familia Friesen.",
    `${product.nombre} × ${quickQty}`,
    "¿Me orientás con las medidas y el presupuesto?",
    "Referencia ilustrativa de la demo.",
  ]);
  document.getElementById("productContent").innerHTML =
    `<div class="quick-layout"><div class="quick-photo"><img src="${esc(product.imagenes[0])}" width="1024" height="1024" alt="${esc(product.nombre)}, referencia ilustrativa"></div><div class="quick-copy"><p class="eyebrow">${esc(CATEGORIAS.find((c) => c.id === product.categoria)?.nombre || "Estructura")}</p><h2>${esc(product.nombre)}</h2><p>${esc(product.descripcion)}</p><p class="micro">Imagen y propuesta ilustrativas. Consultá medidas, materiales y disponibilidad.</p><div class="quick-controls"><span>Cantidad de referencia</span>${stepper(quickQty)}</div><div class="quick-actions"><button type="button" class="btn" id="quickAdd">Agregar a mi consulta ${plus}</button><a class="btn btn-outline" id="quickWhatsapp" href="${url}" target="_blank" rel="noopener noreferrer">Consultar esta propuesta ${arrow}</a></div></div></div><div class="related" id="related" hidden><h3>Otras referencias de esta categoría</h3><div class="related-items" id="relatedItems"></div></div>`;
  document
    .querySelector("#productOverlay [role=dialog]")
    .setAttribute("aria-label", product.nombre);
  let schema = document.getElementById("productSchema");
  if (!schema) {
    schema = document.createElement("script");
    schema.id = "productSchema";
    schema.type = "application/ld+json";
    document.head.appendChild(schema);
  }
  schema.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.nombre,
    description: product.descripcion,
    image: new URL(product.imagenes[0], location.href).href,
    brand: { "@type": "Brand", name: "Metalúrgica Familia Friesen" },
  });
}

async function openProduct(id) {
  const turn = ++quickRequest;
  try {
    const product = await resolveProduct(id);
    if (!product || turn !== quickRequest) return;
    quickProduct = product;
    quickQty = 1;
    renderQuick();
    openOverlay(document.getElementById("productOverlay"));
    const data = await requestProducts({
      scope: "catalog",
      cat: product.categoria,
      limit: 4,
    });
    if (turn !== quickRequest || activeOverlay?.id !== "productOverlay") return;
    const related = data.items.filter((p) => p.id !== product.id).slice(0, 3);
    document.getElementById("relatedItems").innerHTML = related
      .map(
        (p) =>
          `<button type="button" data-product="${esc(p.id)}">${esc(p.nombre)}</button>`,
      )
      .join("");
    document.getElementById("related").hidden = !related.length;
  } catch {
    if (turn === quickRequest)
      showToast("No pudimos abrir la propuesta. Intentá de nuevo.");
  }
}

async function hydrateCart() {
  const turn = ++cartRequest;
  const before = Cart.get();
  if (!before.length) return;
  const data = await requestProducts({
    scope: "lookup",
    ids: before.map((i) => i.id).join(","),
    limit: 100,
  });
  if (turn !== cartRequest) return;
  const current = Cart.get();
  const requested = new Set(before.map((i) => i.id));
  const found = new Set(data.items.map((p) => p.id));
  const activeIds = new Set(current.map((i) => i.id));
  for (const product of data.items)
    if (activeIds.has(product.id)) cartProducts.set(product.id, product);
  const valid = current.filter((i) => !requested.has(i.id) || found.has(i.id));
  if (valid.length !== current.length) Cart.save(valid);
}

function renderCart() {
  const items = Cart.get();
  const target = document.getElementById("cartItems");
  const bottom = document.getElementById("cartBottom");
  if (!items.length) {
    target.innerHTML = `<div class="empty-state"><p>Tu próximo proyecto empieza con una idea.</p><a class="btn" href="${catalogUrl}">Explorar propuestas ${arrow}</a></div>`;
    bottom.hidden = true;
    return;
  }
  const unresolved = items.some((i) => !getProducto(i.id));
  target.innerHTML = items
    .map((item) => {
      const product = getProducto(item.id);
      if (!product) return '<p class="loading-state">Cargando referencia…</p>';
      return `<article class="cart-row"><img src="${esc(product.imagenes[0])}" width="72" height="72" alt="${esc(product.nombre)}"><div><h3>${esc(product.nombre)}</h3>${stepper(item.qty, item.id)}<button type="button" class="text-button" data-remove="${esc(item.id)}" aria-label="Quitar ${esc(product.nombre)}">Quitar</button></div></article>`;
    })
    .join("");
  bottom.hidden = unresolved;
  document.getElementById("quoteCart").href = whatsapp([
    "Hola, quisiera cotizar estas referencias de Metalúrgica Familia Friesen.",
    "",
    ...items.map(
      (item) => `${getProducto(item.id)?.nombre || "Referencia"} × ${item.qty}`,
    ),
    "",
    "¿Me orientás con las medidas, características y presupuesto?",
    "Referencias ilustrativas de la demo.",
  ]);
}

async function openCartDrawer() {
  quickRequest++;
  openOverlay(document.getElementById("cartOverlay"));
  renderCart();
  try {
    await hydrateCart();
    if (activeOverlay?.id === "cartOverlay") renderCart();
  } catch {
    if (activeOverlay?.id !== "cartOverlay") return;
    const items = document.getElementById("cartItems");
    if (Cart.get().some((i) => !getProducto(i.id)))
      items.innerHTML =
        '<div class="empty-state"><p>No pudimos recuperar la lista.</p><button type="button" class="btn" data-retry-cart>Reintentar</button></div>';
    else showToast("Las referencias guardadas siguen disponibles para consultar.");
  }
}

function initCategories() {
  const menu = document.getElementById("categoryMenu");
  const toggle = document.getElementById("categoryToggle");
  if (!menu || !toggle) return;
  const active = new URLSearchParams(location.search).get("cat");
  menu.innerHTML =
    CATEGORIAS.map(
      (c) =>
        `<a href="${catalogUrl}?cat=${c.id}"${active === c.id && document.body.dataset.pagina === "catalogo" ? ' aria-current="page"' : ""}><span>${c.nombre}</span><small>${c.count} propuestas</small></a>`,
    ).join("") + `<a href="${catalogUrl}">Ver todo el catálogo ${arrow}</a>`;
  const select = document.getElementById("categoryFilter");
  if (select)
    select.insertAdjacentHTML(
      "beforeend",
      CATEGORIAS.map((c) => `<option value="${c.id}">${c.nombre}</option>`).join(""),
    );
  let closeTimer;
  const setOpen = (open) => {
    clearTimeout(closeTimer);
    menu.hidden = !open;
    toggle.setAttribute("aria-expanded", String(open));
  };
  toggle.addEventListener("click", () =>
    setOpen(
      menu.hidden || window.matchMedia("(min-width:769px) and (hover:hover)").matches,
    ),
  );
  const parent = toggle.parentElement;
  parent.addEventListener("mouseenter", () => {
    if (window.matchMedia("(min-width:769px) and (hover:hover)").matches) setOpen(true);
  });
  parent.addEventListener("mouseleave", () => {
    if (window.matchMedia("(min-width:769px) and (hover:hover)").matches)
      closeTimer = setTimeout(() => setOpen(false), 120);
  });
  parent.addEventListener("focusin", () => {
    clearTimeout(closeTimer);
  });
  parent.addEventListener("focusout", (event) => {
    if (!parent.contains(event.relatedTarget)) setOpen(false);
  });
  document.addEventListener("click", (event) => {
    if (!parent.contains(event.target)) setOpen(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !menu.hidden) {
      setOpen(false);
      toggle.focus();
    }
  });
}

async function initFeatured() {
  const target = document.getElementById("featuredProducts");
  if (!target) return;
  const error = document.getElementById("featuredError");
  let busy = false;
  const load = async () => {
    if (busy) return;
    busy = true;
    target.setAttribute("aria-busy", "true");
    error.hidden = true;
    try {
      const data = await requestProducts({ scope: "home", limit: 6 });
      target.innerHTML = data.items
        .map((p) => cardHTML(p, isModel2 ? "subir" : "der"))
        .join("");
      revelarNuevos(target);
      refreshScroll();
    } catch {
      target.innerHTML = "";
      error.hidden = false;
    } finally {
      busy = false;
      target.setAttribute("aria-busy", "false");
    }
  };
  document.getElementById("retryFeatured").addEventListener("click", load);
  await load();
  const rail = document.getElementById("featuredRail");
  if (isModel2) return;
  initRailDrag(rail);
  const prev = document.getElementById("railPrev"),
    next = document.getElementById("railNext");
  const sync = () => {
    const start = parseFloat(window.getComputedStyle(target).paddingInlineStart) || 0;
    prev.disabled = rail.scrollLeft <= start + 2;
    next.disabled = rail.scrollLeft >= rail.scrollWidth - rail.clientWidth - 2;
  };
  prev.addEventListener("click", () =>
    rail.scrollBy({ left: -356, behavior: reduceMotion ? "instant" : "smooth" }),
  );
  next.addEventListener("click", () =>
    rail.scrollBy({ left: 356, behavior: reduceMotion ? "instant" : "smooth" }),
  );
  rail.addEventListener("scroll", sync, { passive: true });
  window.addEventListener("resize", sync, { passive: true });
  sync();
}

async function initCatalog() {
  const grid = document.getElementById("catalogProducts");
  if (!grid) return;
  const controls = {
    q: document.getElementById("searchInput"),
    cat: document.getElementById("categoryFilter"),
    uso: document.getElementById("useFilter"),
    orden: document.getElementById("sortFilter"),
  };
  const params = new URLSearchParams(location.search);
  controls.q.value = (params.get("q") || "").slice(0, 80);
  controls.cat.value = CATEGORIAS.some((c) => c.id === params.get("cat"))
    ? params.get("cat")
    : "";
  controls.uso.value = Object.hasOwn(USOS, params.get("uso")) ? params.get("uso") : "";
  controls.orden.value = params.get("orden") === "nombre-desc" ? "nombre-desc" : "nombre";
  const slug = params.get("producto");
  const more = document.getElementById("loadMore"),
    status = document.getElementById("catalogStatus"),
    error = document.getElementById("catalogError"),
    empty = document.getElementById("catalogEmpty");
  let cursor = null,
    controller,
    request = 0,
    busy = false,
    timer;
  const load = async (append = false) => {
    if (append && (busy || !cursor)) return;
    controller?.abort();
    controller = new window.AbortController();
    const turn = ++request;
    busy = true;
    more.disabled = true;
    error.hidden = true;
    empty.hidden = true;
    grid.setAttribute("aria-busy", "true");
    status.textContent = "Buscando propuestas…";
    const filters = Object.fromEntries(
      Object.entries(controls).map(([key, el]) => [key, el.value]),
    );
    const url = new URL(location.href);
    url.search = "";
    for (const [key, value] of Object.entries(filters))
      if (value && !(key === "orden" && value === "nombre"))
        url.searchParams.set(key, value);
    if (slug) url.searchParams.set("producto", slug);
    window.history.replaceState(null, "", url);
    document.getElementById("catalogCrumb").textContent =
      CATEGORIAS.find((c) => c.id === filters.cat)?.nombre || "Catálogo";
    try {
      const data = await requestProducts(
        { scope: "catalog", limit: 16, ...filters, cursor: append ? cursor : null },
        controller.signal,
      );
      if (turn !== request) return;
      if (!append || grid.children.length + data.items.length > 96) grid.innerHTML = "";
      grid.insertAdjacentHTML("beforeend", data.items.map((p) => cardHTML(p)).join(""));
      cursor = data.nextCursor;
      more.hidden = !cursor;
      empty.hidden = data.total !== 0;
      status.textContent = `${data.total} ${data.total === 1 ? "propuesta" : "propuestas"} · mostrando ${grid.children.length}`;
      revelarNuevos(grid);
      refreshScroll();
    } catch (e) {
      if (e.name !== "AbortError" && turn === request) {
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
  const schedule = () => {
    clearTimeout(timer);
    controller?.abort();
    timer = setTimeout(() => load(), 280);
  };
  controls.q.addEventListener("input", schedule);
  for (const key of ["cat", "uso", "orden"])
    controls[key].addEventListener("change", () => {
      clearTimeout(timer);
      load();
    });
  document.getElementById("catalogSearch").addEventListener("submit", (e) => {
    e.preventDefault();
    clearTimeout(timer);
    load();
  });
  const clear = () => {
    clearTimeout(timer);
    for (const [key, el] of Object.entries(controls))
      el.value = key === "orden" ? "nombre" : "";
    load();
  };
  document.getElementById("clearFilters").addEventListener("click", clear);
  document.querySelector("[data-clear-filters]").addEventListener("click", clear);
  more.addEventListener("click", () => load(true));
  document.getElementById("retryCatalog").addEventListener("click", () => load());
  const toggle = document.querySelector(".filter-toggle");
  toggle.addEventListener("click", () => {
    const open = document.getElementById("catalogFilters").classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
    refreshScroll();
  });
  await load();
  if (params.get("buscar") === "1") controls.q.focus();
  if (slug) {
    try {
      const data = await requestProducts({ scope: "lookup", slug, limit: 1 });
      if (data.items[0]) openProduct(data.items[0].id);
    } catch {
      showToast("No pudimos abrir esa referencia. Podés buscarla en el catálogo.");
    }
  }
}

async function initAdmin() {
  const target = document.getElementById("adminProducts");
  if (!target) return;
  const search = document.getElementById("adminSearch"),
    more = document.getElementById("adminMore"),
    first = document.getElementById("adminFirst"),
    retry = document.getElementById("adminRetry"),
    status = document.getElementById("adminStatus");
  let cursor = null,
    controller,
    request = 0,
    page = 0,
    busy = false,
    timer;
  const load = async (next = false) => {
    if (next && (busy || !cursor)) return;
    controller?.abort();
    controller = new window.AbortController();
    const turn = ++request;
    busy = true;
    more.disabled = true;
    retry.hidden = true;
    target.setAttribute("aria-busy", "true");
    status.textContent = "Buscando propuestas…";
    try {
      const data = await requestProducts(
        { scope: "admin", limit: 100, q: search.value, cursor: next ? cursor : null },
        controller.signal,
      );
      if (turn !== request) return;
      page = next ? page + 1 : 1;
      cursor = data.nextCursor;
      PRODUCTOS.clear();
      cacheProducts(data.items);
      target.innerHTML = data.items
        .map(
          (p) =>
            `<article class="admin-row" data-admin-product="${esc(p.id)}" data-animate="subir" style="opacity:0;transform:translateY(28px)"><img src="${esc(p.imagenes[0])}" width="100" height="100" alt="${esc(p.nombre)}"><div><label>Nombre<input type="text" value="${esc(p.nombre)}" maxlength="100" required data-admin-field="nombre"></label><p class="micro">${esc(CATEGORIAS.find((c) => c.id === p.categoria)?.nombre)} · ${esc(USOS[p.uso])}</p><p class="micro" data-edit-status aria-live="polite">Propuesta ilustrativa</p><button type="button" class="text-button" data-reset-product="${esc(p.id)}">Restablecer</button></div><label>Descripción<textarea maxlength="500" required data-admin-field="descripcion">${esc(p.descripcion)}</textarea></label></article>`,
        )
        .join("");
      if (!data.items.length)
        target.innerHTML =
          '<p class="empty-state">No encontramos propuestas. Probá otra búsqueda.</p>';
      status.textContent = `Página ${page} · ${data.items.length} de ${data.total} propuestas encontradas`;
      more.hidden = !cursor;
      first.hidden = page === 1;
      revelarNuevos(target);
      refreshScroll();
    } catch (e) {
      if (e.name !== "AbortError" && turn === request) {
        status.textContent = "No pudimos cargar la página. Intentá de nuevo.";
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
  search.addEventListener("input", () => {
    clearTimeout(timer);
    controller?.abort();
    timer = setTimeout(() => load(), 280);
  });
  document.getElementById("adminSearchForm").addEventListener("submit", (e) => {
    e.preventDefault();
    clearTimeout(timer);
    load();
  });
  more.addEventListener("click", () => load(true));
  first.addEventListener("click", () => load());
  retry.addEventListener("click", () => load());
  target.addEventListener("change", (e) => {
    const input = e.target.closest("[data-admin-field]");
    if (!input) return;
    const valid = input.value.trim().length > 0;
    input.setAttribute("aria-invalid", String(!valid));
    input
      .closest("[data-admin-product]")
      .querySelector("[data-edit-status]").textContent = valid
      ? "Cambio aplicado a esta prueba."
      : "Completá este campo para continuar.";
    if (valid) showToast("Cambio de prueba aplicado.");
  });
  target.addEventListener("click", (e) => {
    const button = e.target.closest("[data-reset-product]");
    if (!button) return;
    const product = getProducto(button.dataset.resetProduct),
      row = button.closest("[data-admin-product]");
    if (!product) return;
    row.querySelectorAll("[data-admin-field]").forEach((input) => {
      input.value = product[input.dataset.adminField];
      input.removeAttribute("aria-invalid");
    });
    row.querySelector("[data-edit-status]").textContent = "Propuesta ilustrativa";
  });
  await load();
}

function initInteractions() {
  document.addEventListener("click", async (event) => {
    const productButton = event.target.closest("[data-product]");
    if (productButton) {
      openProduct(productButton.dataset.product);
      return;
    }
    const add = event.target.closest("[data-add]");
    if (add) {
      add.disabled = true;
      try {
        const product = await resolveProduct(add.dataset.add);
        if (Cart.add(product)) showToast("Referencia agregada a tu consulta.");
      } catch {
        showToast("No pudimos agregar la referencia. Intentá de nuevo.");
      } finally {
        add.disabled = false;
      }
      return;
    }
    if (event.target.closest("[data-open-cart],[data-retry-cart]")) {
      openCartDrawer();
      return;
    }
    if (event.target.closest("[data-close-overlay]")) {
      closeOverlay();
      return;
    }
    if (event.target === activeOverlay) {
      closeOverlay();
      return;
    }
    if (event.target.closest("#quickAdd")) {
      if (Cart.add(quickProduct, quickQty))
        showToast("Referencia agregada a tu consulta.");
      return;
    }
    const remove = event.target.closest("[data-remove]");
    if (remove) {
      Cart.remove(remove.dataset.remove);
      return;
    }
    const step = event.target.closest("[data-step]");
    if (step) {
      const parent = step.closest(".stepper"),
        id = parent.dataset.stepper,
        delta = Number(step.dataset.step);
      if (id) {
        const item = Cart.get().find((i) => i.id === id);
        if (item) Cart.setQty(id, item.qty + delta);
      } else {
        quickQty = quantity(quickQty + delta);
        parent.querySelector("output").textContent = quickQty;
        parent.querySelector('[data-step="-1"]').disabled = quickQty === 1;
        parent.querySelector('[data-step="1"]').disabled = quickQty === 99;
        document.getElementById("quickWhatsapp").href = whatsapp([
          "Hola, quiero consultar esta referencia de Metalúrgica Familia Friesen.",
          `${quickProduct.nombre} × ${quickQty}`,
          "¿Me orientás con las medidas y el presupuesto?",
          "Referencia ilustrativa de la demo.",
        ]);
      }
    }
  });
  document.getElementById("clearCart")?.addEventListener("click", () => Cart.clear());
  document.addEventListener("keydown", (event) => {
    trapFocus(event);
    if (event.key === "Escape") closeOverlay();
  });
  document.addEventListener("cart:updated", () => {
    if (activeOverlay?.id === "cartOverlay") renderCart();
  });
  window.addEventListener("storage", (event) => {
    if (event.key === Cart.KEY) {
      cartProducts.clear();
      updateCartBadge();
      if (activeOverlay?.id === "cartOverlay") openCartDrawer();
    }
  });
}

function initFloats() {
  const wsp = document.getElementById("wsp-float"),
    cart = document.getElementById("cart-float");
  let seen = false;
  const sync = () => {
    if (window.scrollY > 600) seen = true;
    wsp?.classList.toggle("visible", seen);
    cart?.classList.toggle("visible", seen || Cart.count() > 0);
  };
  window.addEventListener("scroll", sync, { passive: true });
  document.addEventListener("cart:updated", sync);
  cart?.addEventListener("click", openCartDrawer);
  sync();
}

async function init() {
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined")
    gsap.registerPlugin(ScrollTrigger);
  initCategories();
  initNav();
  initInteractions();
  initModelBarScroll();
  initFloats();
  updateCartBadge();
  initHeroMotion();
  const questions = [...document.querySelectorAll(".faq details")];
  if (questions.length) {
    const schema = document.createElement("script");
    schema.type = "application/ld+json";
    schema.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: questions.map(question => ({
        "@type": "Question",
        name: question.querySelector("summary").textContent.trim(),
        acceptedAnswer: { "@type": "Answer", text: question.querySelector("p").textContent.trim() },
      })),
    });
    document.head.appendChild(schema);
  }
  document
    .querySelectorAll("details")
    .forEach((el) => el.addEventListener("toggle", refreshScroll));
  try {
    await Promise.all([initFeatured(), initCatalog(), initAdmin()]);
  } finally {
    initReveals();
    if (typeof gsap === "undefined")
      document.querySelectorAll("[data-animate]").forEach((el) => el.classList.add("in"));
    refreshScroll();
  }
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
      { y: 40, opacity: 0, filter: "blur(10px)", duration: 1.2, clearProps: "filter" },
      0.2,
    )
    .from(hero.querySelectorAll(".hero-lead"), { y: 26, opacity: 0, duration: 1 }, 0.45)
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
document.addEventListener("cart:updated", updateCartBadge);

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
      } catch {}
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
      } catch {}
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
init();
