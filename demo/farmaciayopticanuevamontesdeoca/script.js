"use strict";
let PRODUCTOS = [];
const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;
const WHATSAPP_NUMBER = "5491138100063";
const CATEGORIAS = [
  { id: "optica", nombre: "Óptica", cantidad: 6 },
  { id: "perfumeria", nombre: "Perfumería", cantidad: 4 },
  { id: "regaleria", nombre: "Regalería", cantidad: 6 },
  { id: "bienestar", nombre: "Bienestar", cantidad: 2 },
];
const MODEL = document.body.dataset.modelo === "2" ? 2 : 1;
const CATALOG_URL = MODEL === 2 ? "catalogo-2.html" : "catalogo.html";
const PAGE = document.body.dataset.pagina;
const icons = {
  arrow:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>',
  close:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6"/></svg>',
};
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

const Cart = {
  KEY: "nuevamontesdeoca_cart",
  get() {
    try {
      return JSON.parse(localStorage.getItem(this.KEY)) || [];
    } catch {
      return [];
    }
  },
  save(items) {
    localStorage.setItem(this.KEY, JSON.stringify(items));
    document.dispatchEvent(new CustomEvent("cart:updated"));
  },
  add(producto, qty = 1) {
    const items = this.get();
    const existing = items.find((i) => i.id === producto.id);
    if (existing)
      existing.qty = Math.min(existing.qty + qty, producto.stock ?? 99);
    else
      items.push({ id: producto.id, qty: Math.min(qty, producto.stock ?? 99) });
    this.save(items);
  },
  setQty(id, qty) {
    const items = this.get();
    const it = items.find((i) => i.id === id);
    if (!it) return;
    const p = getProducto(id);
    if (!Number.isFinite(Number(qty))) return;
    it.qty = Math.max(1, Math.min(Math.floor(Number(qty)), p?.stock ?? 99));
    this.save(items);
  },
  remove(id) {
    this.save(this.get().filter((i) => i.id !== id));
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
  syncStock(productos) {
    const items = this.get();
    let changed = false;
    const filtered = items.filter((i) => {
      const p = productos.find((x) => x.id === i.id);
      if (!p || p.stock <= 0) {
        changed = true;
        return false;
      }
      if (i.qty > p.stock) {
        i.qty = p.stock;
        changed = true;
      }
      return true;
    });
    if (changed) this.save(filtered);
  },
};

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
  const desktopMq = window.matchMedia("(min-width: 769px)");
  const close = () => {
    nav.classList.remove("open");
    bd.classList.remove("open");
    nav.removeAttribute("role");
    nav.removeAttribute("aria-modal");
    if (!desktopMq.matches) nav.setAttribute("inert", "");
    toggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("no-scroll");
  };
  const open = () => {
    nav.classList.add("open");
    bd.classList.add("open");
    nav.removeAttribute("inert");
    toggle.setAttribute("aria-expanded", "true");
    document.body.classList.add("no-scroll");
    nav.setAttribute("role", "dialog");
    nav.setAttribute("aria-modal", "true");
    nav.querySelector("button")?.focus();
  };
  toggle.addEventListener("click", () =>
    nav.classList.contains("open") ? close() : open(),
  );
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
    if (desktopMq.matches) {
      if (nav.classList.contains("open")) close();
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

        duration: 1.2,
        clearProps: "filter,transform,opacity",
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

function initFloats() {
  const wsp = document.getElementById("wsp-float");
  const cart = document.getElementById("cart-float");
  let seen = false;
  const sync = () => {
    const scrolled = seen || window.scrollY > 600;
    if (scrolled) seen = true;
    if (scrolled) wsp?.classList.add("visible");
    cart?.classList.toggle("visible", scrolled || Cart.count() > 0);
  };
  window.addEventListener("scroll", sync, { passive: true });
  document.addEventListener("cart:updated", sync);
  cart?.addEventListener("click", openCartDrawer);
  sync();
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

function sanitizeCart(value) {
  if (!Array.isArray(value)) return [];
  const clean = new Map();
  for (const item of value.slice(0, 100)) {
    if (
      !item ||
      typeof item.id !== "string" ||
      !/^[a-z0-9-]{1,64}$/.test(item.id)
    )
      continue;
    const qty = Number(item.qty);
    if (!Number.isFinite(qty) || qty < 1) continue;
    clean.set(item.id, {
      id: item.id,
      qty: Math.min(99, Math.floor(qty) + (clean.get(item.id)?.qty || 0)),
    });
  }
  return [...clean.values()];
}
Cart.get = function () {
  try {
    return sanitizeCart(JSON.parse(localStorage.getItem(this.KEY) || "[]"));
  } catch {
    return [];
  }
};
let memoryCart = null;
const readCart = Cart.get.bind(Cart);
Cart.get = function () {
  return memoryCart === null ? readCart() : sanitizeCart(memoryCart);
};
Cart.save = function (items) {
  const clean = sanitizeCart(items);
  try {
    localStorage.setItem(this.KEY, JSON.stringify(clean));
    memoryCart = null;
  } catch {
    memoryCart = clean;
    showToast("Tu pedido se conserva mientras mantengas esta página abierta.");
  }
  document.dispatchEvent(new CustomEvent("cart:updated"));
};
const canonicalAdd = Cart.add.bind(Cart);
Cart.add = function (product, qty = 1) {
  if (
    !product ||
    product.stock <= 0 ||
    (!Cart.get().some((i) => i.id === product.id) &&
      Cart.get().length >= 100) ||
    !Number.isFinite(Number(qty)) ||
    Number(qty) < 1
  )
    return;
  canonicalAdd(product, Math.min(99, Math.floor(Number(qty))));
};
const refresh = () => {
  if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
};
function remember(items, replace = false) {
  const cartIds = new Set(Cart.get().map((i) => i.id));
  const retained = PRODUCTOS.filter((p) => cartIds.has(p.id));
  const map = new Map((replace ? retained : PRODUCTOS).map((p) => [p.id, p]));
  for (const p of items.slice(0, 100)) map.set(p.id, p);
  const values = [...map.values()];
  PRODUCTOS = [
    ...values.filter((p) => cartIds.has(p.id)),
    ...values.filter((p) => !cartIds.has(p.id)).slice(-100),
  ];
}
async function fetchPage(params, signal) {
  const query = new URLSearchParams(params);
  const response = await window.fetch("api.php?" + query.toString(), {
    signal,
    headers: { Accept: "application/json" },
  });
  if (!response.ok)
    throw new Error("No pudimos cargar el catálogo. Volvé a intentar.");
  const data = await response.json();
  if (!Array.isArray(data.items) || data.items.length > 100)
    throw new Error("La respuesta del catálogo no es válida.");
  return data;
}
function categoryName(id) {
  return CATEGORIAS.find((c) => c.id === id)?.nombre || "Productos";
}
function stepper(qty = 1) {
  return `<div class="stepper"><button type="button" data-qty="-1" aria-label="Quitar una unidad">−</button><output aria-label="Cantidad">${qty}</output><button type="button" data-qty="1" aria-label="Sumar una unidad">+</button></div>`;
}
function productActions(p) {
  return `<div class="prod-actions">${stepper()}<button type="button" class="prod-add" data-add="${esc(p.id)}" aria-label="Agregar ${esc(p.nombre)} al carrito">Agregar<span class="add-long"> al carrito</span></button><button type="button" class="prod-buy" data-buy="${esc(p.id)}">Comprar ahora</button></div>`;
}
function cardHTML(p) {
  return `<article class="prod-card" data-id="${esc(p.id)}" data-animate="subir" style="opacity:0;transform:translateY(32px)"><div class="prod-main"><img src="images/${esc(p.imagenes[0])}" alt="${esc(p.nombre)}; imagen ilustrativa" width="1254" height="1254"><button type="button" class="prod-view" data-product="${esc(p.id)}" aria-label="Ver detalle de ${esc(p.nombre)}"></button><div class="prod-info"><span class="prod-family">${esc(categoryName(p.categoria))}</span><h3>${esc(p.nombre)}</h3><small class="prod-unit">${esc(p.subcategoria)}</small><strong class="prod-price">${formatearPrecio(precioFinal(p))}</strong></div></div>${productActions(p)}</article>`;
}
function errorHTML(message) {
  return `<div class="empty-state"><h3>El catálogo se está haciendo esperar.</h3><p>${esc(message)}</p><button type="button" class="btn btn-outline" data-retry>Volver a intentar</button></div>`;
}
function initCategories() {
  const active = new URLSearchParams(location.search).get("cat");
  document.querySelectorAll("[data-cats-menu]").forEach((menu) => {
    menu.innerHTML = CATEGORIAS.map(
      (c) =>
        `<li><a href="${CATALOG_URL}?cat=${c.id}"${active === c.id ? ' aria-current="page"' : ""}>${c.nombre}<span>${c.cantidad}</span></a></li>`,
    ).join("");
  });
  const wrapper = document.querySelector(".nav-cats"),
    button = wrapper?.querySelector("button"),
    panel = document.getElementById("navCats");
  if (!button || !panel) return;
  let timer;
  const set = (open) => {
    panel.hidden = !open;
    button.setAttribute("aria-expanded", String(open));
  };
  button.addEventListener("click", () => set(panel.hidden));
  wrapper.addEventListener("pointerenter", (e) => {
    if (e.pointerType === "mouse" && window.innerWidth > 768) {
      clearTimeout(timer);
      set(true);
    }
  });
  wrapper.addEventListener("pointerleave", (e) => {
    if (e.pointerType === "mouse" && window.innerWidth > 768)
      timer = setTimeout(() => set(false), 120);
  });
  document.addEventListener("click", (e) => {
    if (!wrapper.contains(e.target)) set(false);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !panel.hidden) {
      set(false);
      button.focus();
    }
  });
  wrapper.addEventListener("focusout", () =>
    setTimeout(() => {
      if (!wrapper.contains(document.activeElement)) set(false);
    }, 0),
  );
}
async function loadFeatured() {
  const grid = document.getElementById("featuredGrid");
  if (!grid) return;
  try {
    const data = await fetchPage({ scope: "home", limit: 6 });
    remember(data.items, true);
    grid.innerHTML = data.items.map(cardHTML).join("");
    revelarNuevos(grid);
    initRail();
    refresh();
  } catch (error) {
    grid.innerHTML = errorHTML(error.message);
  }
}
let catalogController = null,
  nextCursor = null,
  shown = 0,
  activePage = [];
function validatedFilters(search) {
  const params = new URLSearchParams(search),
    result = {};
  const q = (params.get("q") || "").trim().slice(0, 80);
  if (q) result.q = q;
  if (CATEGORIAS.some((c) => c.id === params.get("cat")))
    result.cat = params.get("cat");
  if (["25000", "50000", "100000"].includes(params.get("precio")))
    result.precio = params.get("precio");
  if (["nombre", "precio-asc", "precio-desc"].includes(params.get("orden")))
    result.orden = params.get("orden");
  const validSubs = [
    "Sol",
    "Recetados",
    "Contacto",
    "Fragancias",
    "Carteras",
    "Bijou",
    "Plantillas",
  ];
  if (validSubs.includes(params.get("sub"))) result.sub = params.get("sub");
  return result;
}
function currentFilters() {
  const form = document.getElementById("filters");
  return validatedFilters(new URLSearchParams(new window.FormData(form)));
}
async function loadCatalog(more = false) {
  const form = document.getElementById("filters");
  if (!form) return;
  catalogController?.abort();
  const controller = new window.AbortController();
  catalogController = controller;
  const button = document.getElementById("loadMore"),
    grid = document.getElementById("catalogGrid"),
    rows = document.getElementById("adminRows"),
    count = document.getElementById("resultCount");
  const filters = currentFilters();
  const query = new URLSearchParams(filters);
  const slug = new URLSearchParams(location.search).get("producto");
  if (slug) query.set("producto", slug);
  window.history.replaceState(
    null,
    "",
    location.pathname + (query.size ? "?" + query.toString() : ""),
  );
  button.disabled = true;
  count.textContent = "Buscando en el catálogo…";
  form.setAttribute("aria-busy", "true");
  try {
    const data = await fetchPage(
      {
        scope: PAGE === "admin" ? "admin" : "catalog",
        limit: PAGE === "admin" ? 100 : 16,
        ...filters,
        ...(more && nextCursor ? { cursor: nextCursor } : {}),
      },
      controller.signal,
    );
    if (controller !== catalogController) return;
    if (!more) shown = 0;
    nextCursor = data.nextCursor;
    shown += data.items.length;
    const append =
      more && PAGE !== "admin" && activePage.length + data.items.length <= 100;
    activePage = append ? [...activePage, ...data.items] : data.items;
    remember(activePage, true);
    count.textContent = `${data.total} ${data.total === 1 ? "producto encontrado" : "productos encontrados"}`;
    const crumb = document.getElementById("crumbCategory");
    if (crumb)
      crumb.textContent = filters.cat ? " / " + categoryName(filters.cat) : "";
    if (grid) {
      if (!append) grid.innerHTML = "";
      if (data.items.length)
        grid.insertAdjacentHTML("beforeend", data.items.map(cardHTML).join(""));
      else
        grid.innerHTML =
          '<div class="empty-state"><h3>No encontramos ese producto.</h3><p>Probá otro nombre o quitá algún filtro.</p><button type="button" class="btn btn-outline" data-clear>Ver todos los productos</button></div>';
      revelarNuevos(grid);
    }
    if (rows) {
      rows.innerHTML = data.items.length
        ? data.items
            .map(
              (p) =>
                `<tr data-animate="subir" style="opacity:0;transform:translateY(32px)"><td>${esc(p.nombre)}</td><td>${esc(categoryName(p.categoria))}</td><td>${formatearPrecio(readAdminEdits()[p.id]?.precio || precioFinal(p))}${readAdminEdits()[p.id]?.precio ? " · prueba" : ""}</td><td><button type="button" class="text-link" data-product="${esc(p.id)}">${PAGE === "admin" ? "Editar muestra" : "Ver ficha"} ${icons.arrow}</button></td></tr>`,
            )
            .join("")
        : '<tr><td colspan="4">No hay coincidencias. Probá otra búsqueda.</td></tr>';
      revelarNuevos(rows);
    }
    button.hidden = !nextCursor;
    document.getElementById("pageStatus").textContent = data.total
      ? `Mostrando ${shown - activePage.length + 1}–${shown} de ${data.total}.`
      : "No hay productos con estos filtros.";
    refresh();
  } catch (error) {
    if (error.name === "AbortError") return;
    count.textContent = error.message;
    button.hidden = true;
    if (grid) grid.innerHTML = errorHTML(error.message);
    if (rows)
      rows.innerHTML = `<tr><td colspan="4">${esc(error.message)} <button type="button" class="text-link" data-retry>Volver a intentar</button></td></tr>`;
  } finally {
    if (controller === catalogController) {
      button.disabled = false;
      form.removeAttribute("aria-busy");
    }
  }
}
async function initCatalog() {
  const form = document.getElementById("filters");
  if (!form) return;
  const values = validatedFilters(location.search);
  for (const [key, value] of Object.entries(values))
    if (form.elements[key]) form.elements[key].value = value;
  let timer;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    clearTimeout(timer);
    loadCatalog();
  });
  form.addEventListener("input", (e) => {
    clearTimeout(timer);
    if (e.target.matches("input")) timer = setTimeout(() => loadCatalog(), 280);
  });
  form.addEventListener("change", (e) => {
    if (e.target.matches("select")) {
      clearTimeout(timer);
      loadCatalog();
    }
  });
  form.addEventListener("reset", () => {
    clearTimeout(timer);
    setTimeout(() => loadCatalog(), 0);
  });
  document
    .getElementById("loadMore")
    .addEventListener("click", () => loadCatalog(true));
  await loadCatalog();
}
let activeOverlay = null,
  returnFocus = null;
function openOverlay(overlay) {
  if (activeOverlay && activeOverlay !== overlay) activeOverlay.hidden = true;
  if (!activeOverlay) returnFocus = document.activeElement;
  activeOverlay = overlay;
  overlay.hidden = false;
  document.body.classList.add("no-scroll");
  document
    .querySelectorAll("header,main,footer")
    .forEach((el) => (el.inert = true));
  overlay.querySelector("button,a,input,select")?.focus();
}
function closeOverlay() {
  if (!activeOverlay) return;
  activeOverlay.hidden = true;
  activeOverlay = null;
  document.body.classList.remove("no-scroll");
  document
    .querySelectorAll("header,main,footer")
    .forEach((el) => (el.inert = false));
  const params = new URLSearchParams(location.search);
  params.delete("producto");
  window.history.replaceState(
    null,
    "",
    location.pathname + (params.size ? "?" + params : ""),
  );
  (returnFocus?.isConnected
    ? returnFocus
    : document.querySelector("[data-open-cart]")
  )?.focus();
}
function renderCart() {
  const items = Cart.get(),
    root = document.getElementById("cartItems");
  if (!root) return;
  root.innerHTML = items.length
    ? items
        .map((item) => {
          const p = getProducto(item.id);
          if (!p) return "";
          return `<div class="cart-item" data-cart-id="${esc(p.id)}"><img src="images/${esc(p.imagenes[0])}" alt="${esc(p.nombre)}" width="72" height="84"><div><h3>${esc(p.nombre)}</h3><p class="item-price">${formatearPrecio(precioFinal(p) * item.qty)}</p><div class="cart-item-controls">${stepper(item.qty)}<button type="button" class="remove-item" data-remove="${esc(p.id)}">Quitar</button></div></div></div>`;
        })
        .join("")
    : `<div class="empty-state"><h3>Tu próximo favorito empieza acá.</h3><p>Elegí tus productos y sumalos al pedido.</p><a class="text-link" href="${CATALOG_URL}">Volver al catálogo ${icons.arrow}</a></div>`;
  document.getElementById("cartTotal").textContent = formatearPrecio(
    Cart.total(),
  );
  document.getElementById("checkout").disabled = !items.length;
  const link = document.getElementById("cartWhatsapp");
  link.hidden = !items.length;
  link.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(["Hola Nueva Montes de Oca, quiero consultar este pedido:", ...items.map((item) => `${item.qty} × ${getProducto(item.id)?.nombre || "Producto"} | ${formatearPrecio(precioFinal(getProducto(item.id) || { precio: 0 }) * item.qty)}`), `Total de muestra: ${formatearPrecio(Cart.total())}.`, `¿Me confirman precios, disponibilidad y entrega?`].join("\n"))}`;
}
async function hydrateCart() {
  const items = Cart.get();
  if (!items.length) return;
  const requestedIds = new Set(items.map((item) => item.id));
  const data = await fetchPage({
    scope: "lookup",
    ids: items.map((i) => i.id).join(","),
    limit: 100,
  });
  remember(data.items);
  const current = Cart.get();
  const refreshed = current.flatMap((item) => {
    if (!requestedIds.has(item.id)) return [item];
    const product = data.items.find((candidate) => candidate.id === item.id);
    if (!product || product.stock <= 0) return [];
    return [{ id: item.id, qty: Math.min(item.qty, product.stock) }];
  });
  if (JSON.stringify(current) !== JSON.stringify(refreshed)) Cart.save(refreshed);
}
function openCartDrawer() {
  renderCart();
  openOverlay(document.getElementById("cartOverlay"));
}
let detailRequest = 0;
async function openProduct(id, bySlug = false) {
  const request = ++detailRequest;
  try {
    let p = bySlug ? PRODUCTOS.find((p) => p.slug === id) : getProducto(id);
    if (!p) {
      const result = await fetchPage({
        scope: "lookup",
        limit: 1,
        ...(bySlug ? { slug: id } : { ids: id }),
      });
      p = result.items[0];
      remember(result.items);
    }
    if (!p || request !== detailRequest) return;
    const overlay = document.getElementById("quickOverlay");
    overlay.querySelector(".quick-dialog").innerHTML =
      `<button type="button" class="quick-close icon-btn" data-close aria-label="Cerrar detalle">${icons.close}</button><div class="quick-layout"><div class="quick-photo"><img src="images/${esc(p.imagenes[0])}" width="1254" height="1254" alt="${esc(p.nombre)}; imagen ilustrativa"></div><div class="quick-copy" data-id="${esc(p.id)}"><p class="eyebrow">${esc(categoryName(p.categoria))} · Tienda ilustrativa</p><h2>${esc(p.nombre)}</h2><p>${esc(p.descripcion)}</p><p class="quick-price">${formatearPrecio(precioFinal(p))}</p>${productActions(p)}<small>Precio de muestra. Consultá presentación, precio y disponibilidad antes de pedir.</small></div></div><div class="similar-products"><h3>También te puede servir</h3><div class="similar-list" id="similarList">Buscando otros productos…</div></div>`;
    const params = new URLSearchParams(location.search);
    params.set("producto", p.slug);
    window.history.replaceState(null, "", location.pathname + "?" + params);
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
      description:
        "Producto ilustrativo de la demo de Nueva Montes de Oca. Catálogo y precio a confirmar.",
      image: new URL("images/" + p.imagenes[0], location.href).href,
      offers: {
        "@type": "Offer",
        priceCurrency: "ARS",
        price: precioFinal(p),
        availability: "https://schema.org/PreOrder",
        url: location.href,
      },
    });
    openOverlay(overlay);
    if (PAGE === "admin") initAdminEditor(p);
    try {
      const data = await fetchPage({
        scope: "catalog",
        cat: p.categoria,
        limit: 4,
      });
      if (request !== detailRequest) return;
      remember(data.items);
      const similar = document.getElementById("similarList");
      if (similar)
        similar.innerHTML =
          data.items
            .filter((x) => x.id !== p.id)
            .slice(0, 3)
            .map(
              (x) =>
                `<button type="button" data-product="${esc(x.id)}">${esc(x.nombre)} · ${formatearPrecio(precioFinal(x))}</button>`,
            )
            .join("") || "Explorá otros productos en el catálogo.";
    } catch {
      const similar = document.getElementById("similarList");
      if (similar)
        similar.textContent = "Podés ver más productos en el catálogo.";
    }
  } catch (error) {
    showToast(error.message);
  }
}
function initActions() {
  document
    .querySelectorAll("[data-open-cart]")
    .forEach((b) => b.addEventListener("click", openCartDrawer));
  document.addEventListener("click", (e) => {
    const target = e.target.closest("button");
    if (!target) return;
    if (target.hasAttribute("data-close")) {
      closeOverlay();
      return;
    }
    if (target.hasAttribute("data-clear")) {
      document.getElementById("filters")?.reset();
      return;
    }
    if (target.hasAttribute("data-retry")) {
      PAGE === "home" ? loadFeatured() : loadCatalog();
      return;
    }
    if (target.dataset.product) {
      openProduct(target.dataset.product);
      return;
    }
    if (target.dataset.remove) {
      Cart.remove(target.dataset.remove);
      return;
    }
    if (target.dataset.qty) {
      const parent = target.closest("[data-cart-id]");
      if (parent) {
        const item = Cart.get().find((i) => i.id === parent.dataset.cartId),
          delta = target.dataset.qty;
        if (item) {
          Cart.setQty(item.id, item.qty + Number(delta));
          document
            .querySelector(`[data-cart-id="${item.id}"] [data-qty="${delta}"]`)
            ?.focus();
        }
        return;
      }
      const output = target.closest(".stepper").querySelector("output");
      output.value = String(
        Math.max(
          1,
          Math.min(99, Number(output.value) + Number(target.dataset.qty)),
        ),
      );
      return;
    }
    const id = target.dataset.add || target.dataset.buy;
    if (!id) return;
    const p = getProducto(id),
      container = target.closest("[data-id]");
    if (!p) return;
    const qty = Number(container?.querySelector("output")?.value) || 1;
    Cart.add(p, qty);
    if (target.dataset.buy) openCartDrawer();
    else showToast(`${p.nombre} se sumó a tu pedido.`);
  });
  document.querySelectorAll(".overlay").forEach((overlay) =>
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeOverlay();
    }),
  );
  document.addEventListener("keydown", (e) => {
    const nav = document.getElementById("mainNav"),
      active = activeOverlay || (nav?.classList.contains("open") ? nav : null);
    if (!active) return;
    if (e.key === "Escape" && activeOverlay) {
      closeOverlay();
      return;
    }
    if (e.key !== "Tab") return;
    const focusable = [
      ...active.querySelectorAll(
        'a[href],button:not(:disabled),input,select,[tabindex="0"]',
      ),
    ].filter((el) => el.getClientRects().length && !el.closest("[hidden]"));
    const first = focusable[0],
      last = focusable.at(-1);
    if (!first) return;
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });
  document.getElementById("checkout")?.addEventListener("click", () => {
    if (Cart.count())
      showToast(
        "¡Genial! El pago online se activa al pasar la web a producción.",
      );
  });
  document.addEventListener("cart:updated", () => {
    renderCart();
  });
  window.addEventListener("storage", async (e) => {
    if (e.key === Cart.KEY) {
      try {
        await hydrateCart();
        renderCart();
        updateCartBadge();
      } catch {
        showToast("No pudimos actualizar el pedido. Volvé a intentar.");
      }
    }
  });
}
function initForms() {
  document
    .querySelectorAll("details")
    .forEach((el) => el.addEventListener("toggle", refresh));
  if (new URLSearchParams(location.search).has("buscar"))
    document.querySelector("#filters input")?.focus();
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
async function boot() {
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined")
    gsap.registerPlugin(ScrollTrigger);
  initCategories();
  initNav();
  initModelBarScroll();
  initActions();
  initForms();
  initMap();
  initRail();
  initFloats();
  initHeroMotion();
  await Promise.all([
    loadFeatured(),
    initCatalog(),
    hydrateCart().catch(() =>
      showToast(
        "No pudimos recuperar el pedido guardado. Recargá para volver a intentar.",
      ),
    ),
  ]);
  initReveals();
  updateCartBadge();
  renderCart();
  if (typeof gsap === "undefined")
    document
      .querySelectorAll("[data-animate]")
      .forEach((el) => el.classList.add("in"));
  if (typeof ScrollTrigger !== "undefined")
    window.addEventListener("load", () => ScrollTrigger.refresh());
  const slug = new URLSearchParams(location.search).get("producto");
  if (slug) openProduct(slug, true);
  refresh();
}
boot();

function initRail() {
  const vp = document.getElementById("featuredGrid");
  if (!vp || MODEL !== 1 || vp.dataset.dragReady) return;
  vp.dataset.dragReady = "true";
  let dragging = false,
    moved = false,
    startX = 0,
    startScroll = 0,
    pointerId = null;
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
    if (!moved && Math.abs(dx) < 6) return;
    if (!moved) {
      moved = true;
      vp.classList.add("dragging");
      try {
        vp.setPointerCapture?.(pointerId);
      } catch {
        moved = true;
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
        moved = true;
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
  const prev = document.getElementById("railPrev"),
    next = document.getElementById("railNext");
  const sync = () => {
    const start =
      parseFloat(window.getComputedStyle(vp).paddingInlineStart) || 0;
    if (prev) prev.disabled = vp.scrollLeft <= start + 2;
    if (next)
      next.disabled = vp.scrollLeft >= vp.scrollWidth - vp.clientWidth - 2;
  };
  prev?.addEventListener("click", () =>
    vp.scrollBy({
      left: -vp.clientWidth * 0.7,
      behavior: reduceMotion ? "instant" : "smooth",
    }),
  );
  next?.addEventListener("click", () =>
    vp.scrollBy({
      left: vp.clientWidth * 0.7,
      behavior: reduceMotion ? "instant" : "smooth",
    }),
  );
  vp.addEventListener("scroll", sync, { passive: true });
  window.addEventListener("resize", sync);
  new window.ResizeObserver(sync).observe(vp);
  sync();
}

function readAdminEdits() {
  try {
    const value = JSON.parse(
      window.sessionStorage.getItem("nuevamontesdeoca_admin_preview") || "{}",
    );
    return value && typeof value === "object" && !Array.isArray(value)
      ? value
      : {};
  } catch {
    return {};
  }
}
function initAdminEditor(p) {
  const dialog = document.querySelector(".quick-copy");
  if (!dialog) return;
  const edit = readAdminEdits()[p.id] || {};
  dialog.querySelector(".prod-actions")?.remove();
  dialog.querySelector(".quick-price")?.remove();
  dialog.insertAdjacentHTML(
    "beforeend",
    `<div class="admin-editor"><label>Precio de muestra<input type="number" min="1" max="99999999" step="1" data-edit="precio" value="${esc(edit.precio || p.precio)}"></label><label>Stock de muestra<input type="number" min="0" max="99999" step="1" data-edit="stock" value="${esc(edit.stock ?? p.stock)}"></label><p role="status" id="editStatus">Edición de muestra con autoguardado en esta pestaña.</p></div>`,
  );
  dialog.querySelectorAll("[data-edit]").forEach((input) =>
    input.addEventListener("change", () => {
      const status = document.getElementById("editStatus");
      if (!input.checkValidity() || input.value === "") {
        input.setAttribute("aria-invalid", "true");
        status.textContent =
          "Ingresá un número entero dentro del rango permitido.";
        return;
      }
      input.removeAttribute("aria-invalid");
      const all = readAdminEdits();
      if (!all[p.id] && Object.keys(all).length >= 100) {
        status.textContent =
          "Alcanzaste el límite de 100 productos de prueba por pestaña.";
        return;
      }
      all[p.id] = { ...all[p.id], [input.dataset.edit]: Number(input.value) };
      try {
        window.sessionStorage.setItem(
          "nuevamontesdeoca_admin_preview",
          JSON.stringify(all),
        );
        status.textContent = "Cambio de muestra guardado en esta pestaña.";
        showToast("Cambio de muestra guardado automáticamente.");
        if (input.dataset.edit === "precio") {
          const row = document
            .querySelector(`#adminRows [data-product="${p.id}"]`)
            ?.closest("tr");
          if (row)
            row.children[2].textContent =
              formatearPrecio(Number(input.value)) + " · prueba";
        }
      } catch {
        status.textContent =
          "El navegador no permite guardar esta prueba. Volvé a intentar.";
      }
    }),
  );
}

function initMap() {
  const mapElement = document.getElementById("locationMap");
  if (!mapElement || typeof L === "undefined") return;
  const map = L.map(mapElement, { scrollWheelZoom: false }).setView(
    [-34.639224, -58.374386],
    15,
  );
  map.attributionControl.setPosition("topright");
  L.tileLayer(
    "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    },
  ).addTo(map);
  L.circleMarker([-34.639224, -58.374386], {
    renderer: L.canvas(),
    radius: 8,
    color: "#375d91",
    weight: 1,
    fillColor: "#397c77",
    fillOpacity: 1,
  })
    .addTo(map)
    .bindPopup("Av. Montes de Oca 954 · Ubicación de referencia");
}
