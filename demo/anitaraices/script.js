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
    closeBtn?.focus();
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

function initFloats() {
  const wsp = document.getElementById("wsp-float");
  const cart = document.getElementById("cart-float");
  let scrolled = false;
  const sync = () => {
    scrolled = scrolled || window.scrollY > 600;
    wsp?.classList.toggle("visible", scrolled);
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

function initHeroMotion() {
  if (reduceMotion || typeof gsap === "undefined") return;
  const hero = document.querySelector(".hero");
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
  const img = hero.querySelector("[data-hero-img]");
  if (img) tl.from(img, { scale: 1.1, duration: 1.8 }, 0);
  tl.from(hero.querySelectorAll(".hero-eyebrow"), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(
      hero.querySelectorAll("h1"),
      { y: 40, opacity: 0, filter: "blur(10px)", duration: 1.2, clearProps: "filter" },
      0.2,
    )
    .from(hero.querySelectorAll(".hero-lead"), { y: 26, opacity: 0, duration: 1 }, 0.45)
    .from(
      hero.querySelectorAll(".hero-ctas .btn"),
      { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: "transform,opacity" },
      0.6,
    )
    .from(
      hero.querySelectorAll(".sello, .hero-badge"),
      { scale: 0.92, opacity: 0, duration: 1.1, stagger: 0.1, clearProps: "transform,opacity" },
      0.65,
    );
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

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const MODEL = document.body.dataset.modelo || "1";
const PAGE = document.body.dataset.pagina;
const CATALOG_URL = MODEL === "2" ? "catalogo-2.html" : "catalogo.html";
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
const normalize = (s) =>
  String(s ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
const CATEGORIAS = [
  {
    id: "hogar",
    nombre: "Hogar",
    count: 4,
    descripcion: "Materas y paraguas para acompañar tus días.",
    sub: [
      { id: "materas", nombre: "Materas", count: 2 },
      { id: "paraguas", nombre: "Paraguas", count: 2 },
    ],
  },
  {
    id: "familia",
    nombre: "Familia",
    count: 12,
    descripcion: "Pijamas, pantuflas, ojotas, carteras y accesorios.",
    sub: [
      { id: "pijamas", nombre: "Pijamas", count: 4 },
      { id: "calzado", nombre: "Pantuflas y ojotas", count: 4 },
      { id: "bolsos", nombre: "Carteras, bolsos y billeteras", count: 4 },
    ],
  },
  {
    id: "bienestar",
    nombre: "Bienestar",
    count: 4,
    descripcion: "Velas y jabones artesanales de elaboración propia.",
    sub: [
      { id: "velas", nombre: "Velas artesanales", count: 2 },
      { id: "jabones", nombre: "Jabones artesanales", count: 2 },
    ],
  },
];
let PRODUCTOS = [];
const getProducto = (id) => PRODUCTOS.find((p) => p.id === id);
function remember(items) {
  for (const p of items) {
    PRODUCTOS = PRODUCTOS.filter((x) => x.id !== p.id);
    PRODUCTOS.push(p);
  }
  if (PRODUCTOS.length > 100) PRODUCTOS = PRODUCTOS.slice(-100);
}
const Cart = {
  KEY: "anitaraices_cart",
  memory: [],
  get() {
    let parsed;
    try {
      parsed = JSON.parse(localStorage.getItem(this.KEY) || "[]");
    } catch {
      parsed = this.memory;
    }
    if (!Array.isArray(parsed)) return [];
    const result = [];
    for (const item of parsed.slice(0, 100)) {
      if (
        !item ||
        typeof item.id !== "string" ||
        !/^[a-zA-Z0-9-]{1,80}$/.test(item.id) ||
        ![
          "S",
          "M",
          "L",
          "XL",
          "U",
          "4",
          "6",
          "8",
          "10",
          "28-29",
          "30-31",
          "32-33",
          "35-36",
          "37-38",
          "39-40",
        ].includes(item.talle) ||
        !Number.isSafeInteger(item.qty) ||
        item.qty < 1
      )
        continue;
      const previous = result.find((x) => x.id === item.id && x.talle === item.talle);
      if (previous) previous.qty = Math.min(99, previous.qty + item.qty);
      else result.push({ id: item.id, talle: item.talle, qty: Math.min(99, item.qty) });
    }
    return result;
  },
  save(items) {
    this.memory = items;
    try {
      localStorage.setItem(this.KEY, JSON.stringify(items));
    } catch {
      showToast("Tu navegador no permite guardar el carrito entre páginas.");
    }
    document.dispatchEvent(new CustomEvent("cart:updated"));
  },
  add(producto, qty = 1, talle = "") {
    if (!producto || producto.stock <= 0 || !producto.variantes.includes(talle)) return false;
    qty = Math.max(1, Math.floor(Number(qty) || 1));
    const items = this.get();
    const used = items.filter((i) => i.id === producto.id).reduce((sum, i) => sum + i.qty, 0);
    const allowed = Math.min(qty, Math.max(0, producto.stock - used));
    if (!allowed) return false;
    const existing = items.find((i) => i.id === producto.id && i.talle === talle);
    if (existing) existing.qty += allowed;
    else if (items.length < 100) items.push({ id: producto.id, talle, qty: allowed });
    else return false;
    this.save(items);
    return true;
  },
  setQty(id, qty, talle) {
    const items = this.get();
    const it = items.find((i) => i.id === id && i.talle === talle);
    const p = getProducto(id);
    if (!it || !p || p.stock <= 0) return;
    const other = items
      .filter((i) => i.id === id && i.talle !== talle)
      .reduce((sum, i) => sum + i.qty, 0);
    it.qty = Math.max(1, Math.min(Math.floor(Number(qty) || 1), Math.max(1, p.stock - other)));
    this.save(items);
  },
  remove(id, talle) {
    this.save(this.get().filter((i) => i.id !== id || i.talle !== talle));
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
  syncStock(productos) {
    const current = this.get();
    const used = new Map();
    const result = [];
    current.forEach((i) => {
      const p = productos.find((x) => x.id === i.id);
      if (!p || p.stock <= 0 || !p.variantes.includes(i.talle)) return;
      const qty = Math.min(i.qty, Math.max(0, p.stock - (used.get(i.id) || 0)));
      if (!qty) return;
      result.push({ id: i.id, talle: i.talle, qty });
      used.set(i.id, (used.get(i.id) || 0) + qty);
    });
    if (JSON.stringify(result) !== JSON.stringify(current)) this.save(result);
  },
};

async function api(params, signal) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, val]) => {
    if (val !== "" && val != null) query.set(key, val);
  });
  const controller = new AbortController();
  const abort = () => controller.abort();
  if (signal?.aborted) abort();
  signal?.addEventListener("abort", abort, { once: true });
  const timer = setTimeout(abort, 12000);
  try {
    const response = await fetch("api.php?" + query, {
      signal: controller.signal,
      cache: "no-store",
    });
    if (!response.ok) throw new Error("No pudimos cargar la tienda. Volvé a intentar.");
    const data = await response.json();
    if (!Array.isArray(data.items) || data.items.length > 100)
      throw new Error("La respuesta del catálogo no es válida.");
    return data;
  } catch (error) {
    if (error.name === "AbortError" && !signal?.aborted)
      throw new Error("La consulta está tardando. Volvé a intentar.", { cause: error });
    throw error;
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener("abort", abort);
  }
}
function refresh() {
  if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
}
const arrow =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>';
function prices(p) {
  return `<strong>${formatearPrecio(precioFinal(p))}</strong>${p.descuento ? `<s>${formatearPrecio(p.precio)}</s>` : ""}`;
}
function productPhoto(p) {
  return p.imagenes.length
    ? `<img src="${esc(p.imagenes[0])}" alt="${esc(p.nombre)} en color ${esc(p.color)}" width="1254" height="1254">`
    : `<span class="photo-pending" aria-label="Imagen del producto pendiente de confirmar">Anita<span>Raíces</span></span>`;
}
function options(p, _context) {
  const varied = p.variantes.length > 1;
  return `<div class="prod-options">${varied ? `<label><span>Talle</span><select data-size aria-label="Talle de ${esc(p.nombre)}">${p.variantes.map((s) => `<option>${esc(s)}</option>`).join("")}</select></label>` : '<input type="hidden" data-size value="U">'}<div class="stepper"><button type="button" data-step="-1" aria-label="Quitar una unidad de ${esc(p.nombre)}">−</button><output data-qty aria-label="Cantidad">1</output><button type="button" data-step="1" aria-label="Sumar una unidad de ${esc(p.nombre)}">+</button></div><label class="compact-qty-wrap"><span>Cant.</span><input class="compact-qty" type="number" min="1" max="${Math.max(1, p.stock)}" value="1" data-qty-input aria-label="Cantidad de ${esc(p.nombre)}"></label></div><div class="prod-actions"><button type="button" class="prod-add" data-add${p.stock <= 0 ? " disabled" : ""}><span class="add-long">${p.stock <= 0 ? "Sin stock" : "Agregar al carrito"}</span><span class="add-short">${p.stock <= 0 ? "Sin stock" : "Agregar"}</span></button>${p.stock > 0 ? '<button type="button" class="prod-buy" data-buy>Comprar ahora</button>' : ""}</div>`;
}
function card(p, kind = "subir") {
  return `<article class="prod-card" data-product="${esc(p.id)}" data-animate="${kind}" style="opacity:0;transform:translateY(24px)"><div class="prod-photo"><button type="button" data-open-product="${esc(p.id)}" aria-label="Ver ${esc(p.nombre)}">${productPhoto(p)}<span class="prod-view" aria-hidden="true">Ver de cerca ↗</span></button>${p.descuento ? `<span class="prod-badge">−${p.descuento}%</span>` : ""}</div><div class="prod-info"><span class="prod-category">${esc(CATEGORIAS.find((c) => c.id === p.categoria)?.nombre)}</span><h3><span class="prod-title">${esc(p.nombre)}</span></h3><p class="prod-prices">${prices(p)}</p>${options(p, "card")}</div></article>`;
}
function retryHTML(action) {
  return `<div class="error-state"><p>No pudimos cargar la tienda.</p><button type="button" class="btn btn-dark" data-retry="${action}">Volver a intentar</button></div>`;
}

function initCategories() {
  const query = new URLSearchParams(location.search);
  document.querySelectorAll("[data-cats-menu]").forEach((menu) => {
    menu.innerHTML = CATEGORIAS.map(
      (c) =>
        `<li><a href="${CATALOG_URL}?cat=${c.id}"${query.get("cat") === c.id ? ' aria-current="page"' : ""}>${c.nombre}<small>${c.count}</small></a></li>`,
    ).join("");
  });
  const cats = document.querySelector("[data-categories]");
  if (cats)
    cats.innerHTML = CATEGORIAS.map(
      (c, i) =>
        `<div data-animate="subir" style="opacity:0;transform:translateY(24px)"><a class="category-link cat-${c.id}" href="${CATALOG_URL}?cat=${c.id}"><span class="category-num">0${i + 1}</span><div><h3>${c.nombre}</h3><p>${c.descripcion}</p></div>${arrow}</a></div>`,
    ).join("");
  const category = document.getElementById("categorySelect");
  const sub = document.getElementById("subSelect");
  if (category)
    category.insertAdjacentHTML(
      "beforeend",
      CATEGORIAS.map((c) => `<option value="${c.id}">${c.nombre}</option>`).join(""),
    );
  if (sub)
    sub.insertAdjacentHTML(
      "beforeend",
      CATEGORIAS.flatMap((c) => c.sub)
        .map((s) => `<option value="${s.id}">${s.nombre}</option>`)
        .join(""),
    );
  const wrap = document.querySelector(".nav-cats");
  if (!wrap) return;
  const button = wrap.querySelector("button");
  const panel = wrap.querySelector(".nav-cats__panel");
  let timer;
  const set = (open) => {
    panel.hidden = !open;
    button.setAttribute("aria-expanded", String(open));
  };
  button.addEventListener("click", () => set(panel.hidden));
  wrap.addEventListener("mouseenter", () => {
    if (matchMedia("(hover:hover) and (min-width:769px)").matches) {
      clearTimeout(timer);
      set(true);
    }
  });
  wrap.addEventListener("mouseleave", () => {
    if (matchMedia("(min-width:769px)").matches) timer = setTimeout(() => set(false), 120);
  });
  wrap.addEventListener("focusin", () => {
    if (matchMedia("(min-width:769px)").matches) {
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
      button.focus();
        set(false);
    }
  });
}

async function loadHome() {
  const target = document.getElementById("featuredRail");
  if (!target) return;
  try {
    const data = await api({ scope: "home", limit: 6 });
    remember(data.items);
    target.innerHTML = data.items.map((p) => card(p)).join("");
    revelarNuevos(target);
    refresh();
  } catch {
    target.innerHTML = retryHTML("home");
  }
}

const catalogState = { cursor: null, shown: 0, windowCount: 0, controller: null, serial: 0 };
function filterParams() {
  const form = document.getElementById("filterForm");
  const params = Object.fromEntries(new FormData(form));
  if (params.cat && params.sub) {
    const cat = CATEGORIAS.find((c) => c.id === params.cat);
    if (!cat?.sub.some((s) => s.id === params.sub)) {
      params.sub = "";
      form.elements.sub.value = "";
    }
  }
  return params;
}
function syncURL(params) {
  const url = new URL(location.href);
  const product = url.searchParams.get("producto");
  url.search = "";
  Object.entries(params).forEach(([key, val]) => {
    if (val && !(key === "orden" && val === "nombre")) url.searchParams.set(key, val);
  });
  if (product) url.searchParams.set("producto", product);
  history.replaceState({}, "", url);
}
async function loadCatalog(more = false) {
  const grid = document.getElementById("catalogGrid");
  if (!grid) return;
  catalogState.controller?.abort();
  const controller = new AbortController();
  catalogState.controller = controller;
  const serial = ++catalogState.serial;
  const params = filterParams();
  syncURL(params);
  const button = document.getElementById("loadMore");
  const empty = document.getElementById("catalogEmpty");
  button.disabled = true;
  if (!more) {
    catalogState.cursor = null;
    catalogState.shown = 0;
    catalogState.windowCount = 0;
    empty.hidden = true;
    grid.innerHTML = '<div class="skeleton" role="status">Buscando tus favoritos…</div>';
  }
  try {
    const data = await api(
      { ...params, scope: "catalog", limit: 16, cursor: more ? catalogState.cursor : null },
      controller.signal,
    );
    if (serial !== catalogState.serial) return;
    remember(data.items);
    if (!more || catalogState.windowCount + data.items.length > 96) {
      grid.innerHTML = "";
      catalogState.windowCount = 0;
    }
    grid.insertAdjacentHTML("beforeend", data.items.map((p) => card(p)).join(""));
    catalogState.cursor = data.nextCursor;
    catalogState.shown += data.items.length;
    catalogState.windowCount += data.items.length;
    button.hidden = !data.nextCursor;
    empty.hidden = data.total > 0;
    if (!empty.hidden) revelarNuevos(empty.parentElement);
    document.getElementById("resultCount").textContent =
      `${data.total} ${data.total === 1 ? "producto" : "productos"}`;
    document.getElementById("pageInfo").textContent = data.total
      ? `Mostrando ${catalogState.shown - catalogState.windowCount + 1}–${catalogState.shown} de ${data.total}`
      : "";
    document.getElementById("catalogCrumb").textContent =
      CATEGORIAS.find((c) => c.id === params.cat)?.nombre || "Catálogo";
    revelarNuevos(grid);
    refresh();
  } catch (error) {
    if (error.name === "AbortError") return;
    if (more) showToast("No pudimos cargar la siguiente página. Volvé a intentar.");
    else {
      grid.innerHTML = retryHTML("catalog");
      document.getElementById("resultCount").textContent =
        "La tienda no está disponible en este momento.";
      button.hidden = true;
    }
  } finally {
    if (serial === catalogState.serial) button.disabled = false;
  }
}
function initCatalog() {
  const form = document.getElementById("filterForm");
  if (!form) return;
  const params = new URLSearchParams(location.search);
  for (const el of form.elements) {
    if (!el.name || !params.has(el.name)) continue;
    const value = params.get(el.name);
    if (el.tagName === "SELECT")
      el.value = [...el.options].some((o) => o.value === value) ? value : el.options[0].value;
    else if (el.type === "checkbox") el.checked = value === "1";
    else if (el.type === "search") el.value = value.slice(0, 80);
  }
  let timer;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    clearTimeout(timer);
    loadCatalog();
  });
  form.addEventListener("change", () => {
    clearTimeout(timer);
    loadCatalog();
  });
  form.elements.q.addEventListener("input", () => {
    clearTimeout(timer);
    timer = setTimeout(() => loadCatalog(), 280);
  });
  const clear = () => {
    clearTimeout(timer);
    form.reset();
    loadCatalog();
  };
  document.getElementById("clearFilters").addEventListener("click", clear);
  document.querySelector("[data-reset-filters]").addEventListener("click", clear);
  document.getElementById("loadMore").addEventListener("click", () => loadCatalog(true));
  if (params.get("buscar") === "1") form.elements.q.focus({ preventScroll: true });
  const empty = document.getElementById("catalogEmpty");
  empty.dataset.animate = "subir";
  empty.style.opacity = "0";
  empty.style.transform = "translateY(32px)";
  return loadCatalog();
}

const adminState = { cursor: null, seen: 0, controller: null, serial: 0 };
async function loadAdmin(more = false) {
  const list = document.getElementById("adminList");
  if (!list) return;
  adminState.controller?.abort();
  const controller = new AbortController();
  adminState.controller = controller;
  const serial = ++adminState.serial;
  const button = document.getElementById("adminMore");
  const query = normalize(document.getElementById("adminQuery").value).slice(0, 80);
  button.disabled = true;
  if (!more) {
    adminState.cursor = null;
    adminState.seen = 0;
  }
  try {
    const data = await api(
      { scope: "admin", limit: 100, q: query, cursor: more ? adminState.cursor : null },
      controller.signal,
    );
    if (serial !== adminState.serial) return;
    PRODUCTOS = data.items;
    const start = adminState.seen + 1;
    adminState.seen += data.items.length;
    adminState.cursor = data.nextCursor;
    list.innerHTML =
      data.items
        .map(
          (p) =>
            `<article class="admin-row" data-animate="subir" style="opacity:0;transform:translateY(32px)"><div class="thumb">${productPhoto(p)}</div><div><h3>${esc(p.nombre)}</h3><p>${esc(p.variantes.join(" · "))} / ${esc(p.color)}</p></div><strong>${formatearPrecio(precioFinal(p))}</strong><div><small>${p.stock ? `${p.stock} unidades de ejemplo` : "Sin stock de ejemplo"}</small><button type="button" class="text-link" data-open-product="${esc(p.id)}">Ver ficha ${arrow}</button></div></article>`,
        )
        .join("") ||
      '<div class="empty-state"><p>No encontramos productos. Probá otra búsqueda.</p></div>';
    document.getElementById("adminCount").textContent = data.total
      ? `${start}–${adminState.seen} de ${data.total} productos`
      : "Sin resultados";
    button.hidden = !data.nextCursor;
    revelarNuevos(list);
  } catch (error) {
    if (error.name !== "AbortError") {
      list.innerHTML = retryHTML("admin");
      document.getElementById("adminCount").textContent = "No pudimos cargar los productos.";
    }
  } finally {
    if (serial === adminState.serial) button.disabled = false;
  }
}
function initAdmin() {
  const form = document.getElementById("adminSearch");
  if (!form) return;
  let timer;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    clearTimeout(timer);
    loadAdmin();
  });
  document.getElementById("adminQuery").addEventListener("input", () => {
    clearTimeout(timer);
    timer = setTimeout(() => loadAdmin(), 300);
  });
  document.getElementById("adminMore").addEventListener("click", () => loadAdmin(true));
  return loadAdmin();
}

let currentDialog = null;
let returnFocus = null;
let inertBefore = [];
function openDialog(id) {
  if (currentDialog) closeDialog(false);
  const backdrop = document.getElementById(id);
  returnFocus = document.activeElement;
  backdrop.hidden = false;
  currentDialog = backdrop;
  document.body.classList.add("no-scroll");
  inertBefore = [
    ...document.querySelectorAll("body > header, body > main, body > footer, .gw-modelos, .floats"),
  ].map((el) => [el, el.inert]);
  inertBefore.forEach(([el]) => {
    el.inert = true;
  });
  backdrop.querySelector("[role=dialog]").focus();
}
function closeDialog(restore = true) {
  if (!currentDialog) return;
  const wasProduct = currentDialog.id === "productBackdrop";
  currentDialog.hidden = true;
  currentDialog = null;
  inertBefore.forEach(([el, was]) => {
    el.inert = was;
  });
  inertBefore = [];
  document.body.classList.remove("no-scroll");
  if (wasProduct) {
    const url = new URL(location.href);
    url.searchParams.delete("producto");
    history.replaceState({}, "", url);
  }
  if (restore && returnFocus?.isConnected) returnFocus.focus();
}
function trapTab(e, root) {
  const focusable = [
    ...root.querySelectorAll('a[href],button:not(:disabled),input,select,textarea,[tabindex="0"]'),
  ].filter(
    (el) =>
      el.getClientRects().length &&
      getComputedStyle(el).visibility !== "hidden" &&
      !el.closest("[hidden],[inert]"),
  );
  if (!focusable.length) {
    e.preventDefault();
    return;
  }
  const first = focusable[0],
    last = focusable[focusable.length - 1];
  if (e.shiftKey && (document.activeElement === first || !root.contains(document.activeElement))) {
    e.preventDefault();
    last.focus();
  } else if (
    !e.shiftKey &&
    (document.activeElement === last || !focusable.includes(document.activeElement))
  ) {
    e.preventDefault();
    first.focus();
  }
}
function initDialogs() {
  document.querySelectorAll(".dialog-backdrop").forEach((backdrop) =>
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop || e.target.closest("[data-close-dialog]")) closeDialog();
    }),
  );
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && currentDialog) {
      e.preventDefault();
      closeDialog();
    } else if (e.key === "Tab") {
      if (currentDialog) trapTab(e, currentDialog);
      else if (document.getElementById("mainNav")?.classList.contains("open"))
        trapTab(e, document.getElementById("mainNav"));
    }
  });
  const nav = document.getElementById("mainNav");
  const syncRole = () => {
    const open = nav.classList.contains("open") && innerWidth <= 768;
    if (open) {
      nav.setAttribute("role", "dialog");
      nav.setAttribute("aria-modal", "true");
    } else {
      nav.removeAttribute("role");
      nav.removeAttribute("aria-modal");
    }
  };
  new MutationObserver(syncRole).observe(nav, { attributes: true, attributeFilter: ["class"] });
  window.addEventListener(
    "resize",
    () => {
      if (innerWidth > 768 && nav.classList.contains("open"))
        document.getElementById("navClose").click();
      syncRole();
    },
    { passive: true },
  );
}
async function hydrateCart() {
  const ids = [...new Set(Cart.get().map((i) => i.id))];
  if (!ids.length) return;
  const data = await api({ scope: "lookup", limit: Math.min(ids.length, 100), ids: ids.join(",") });
  remember(data.items);
  Cart.syncStock(data.items);
}
function renderCart() {
  const items = Cart.get();
  const target = document.getElementById("cartItems");
  target.innerHTML = items.length
    ? items
        .map((i) => {
          const p = getProducto(i.id);
          if (!p) return "";
          return `<article class="cart-line"><div class="thumb">${productPhoto(p)}</div><div><h3>${esc(p.nombre)}</h3><p>${i.talle === "U" ? "Único" : "Talle " + esc(i.talle)} · ${formatearPrecio(precioFinal(p))}</p><div class="cart-line-controls"><div class="stepper"><button type="button" data-cart-step="-1" data-id="${esc(i.id)}" data-talle="${esc(i.talle)}" aria-label="Quitar una unidad">−</button><output>${i.qty}</output><button type="button" data-cart-step="1" data-id="${esc(i.id)}" data-talle="${esc(i.talle)}" aria-label="Sumar una unidad">+</button></div><button type="button" data-cart-remove="${esc(i.id)}" data-talle="${esc(i.talle)}">Quitar</button></div></div></article>`;
        })
        .join("")
    : `<div class="cart-empty"><h3>Hay lugar para tus favoritos.</h3><p>Cuando elijas un producto, la vas a encontrar acá.</p><a class="btn btn-dark" href="${CATALOG_URL}">Explorar el catálogo</a></div>`;
  document.getElementById("cartTotal").textContent = formatearPrecio(Cart.total());
  document.getElementById("checkoutBtn").disabled = !items.length;
}
async function openCartDrawer() {
  openDialog("cartBackdrop");
  document.getElementById("cartItems").innerHTML =
    '<p class="cart-empty" role="status">Preparando tus favoritos…</p>';
  document.getElementById("checkoutBtn").disabled = true;
  try {
    await hydrateCart();
    renderCart();
  } catch {
    document.getElementById("cartItems").innerHTML = retryHTML("cart");
    document.getElementById("cartTotal").textContent = "—";
  }
}
let detailSerial = 0;
async function openProduct(id, slug = "") {
  const serial = ++detailSerial;
  openDialog("productBackdrop");
  const target = document.getElementById("productDetail");
  target.innerHTML = '<div class="skeleton" role="status">Preparando el detalle…</div>';
  try {
    let p = id ? getProducto(id) : null;
    if (!p) {
      const data = await api({ scope: "lookup", limit: 1, ids: id || "", slug });
      remember(data.items);
      p = data.items[0];
    }
    if (serial !== detailSerial || currentDialog?.id !== "productBackdrop") return;
    if (!p) {
      closeDialog();
      return;
    }
    target.innerHTML = `<div class="detail-grid" data-product="${esc(p.id)}"><div class="detail-photo">${productPhoto(p)}</div><div class="detail-copy"><p class="eyebrow">ANITA RAÍCES · ${esc(p.color)}</p><h2>${esc(p.nombre)}</h2><div class="prod-prices">${prices(p)}</div><p>${esc(p.descripcion)}</p>${options(p, "detail")}<p class="demo-note">Fotos, productos, precios y stock ilustrativos. Consultá las opciones reales antes de elegir.</p><a class="text-link" href="https://wa.me/5492302631856?text=${encodeURIComponent("Hola, me interesa " + p.nombre + ". ¿Me contás las opciones y medidas disponibles?")}" target="_blank" rel="noopener">Consultar este producto ${arrow}</a></div></div><div class="similar"><h3>También puede ir con vos.</h3><div class="similar-list" id="similarList"></div></div>`;
    const url = new URL(location.href);
    url.searchParams.set("producto", p.slug);
    history.replaceState({}, "", url);
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
      name: p.nombre + " (demostración)",
      image: p.imagenes.length ? new URL(p.imagenes[0], location.href).href : undefined,
      description: p.descripcion + " Producto ilustrativo de demo.",
      offers: {
        "@type": "Offer",
        priceCurrency: "ARS",
        price: precioFinal(p),
        availability: p.stock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        url: location.href,
      },
    });
    const related = await api({ scope: "catalog", limit: 3, cat: p.categoria });
    if (serial !== detailSerial || currentDialog?.id !== "productBackdrop") return;
    remember(related.items);
    const list = document.getElementById("similarList");
    if (list)
      list.innerHTML = related.items
        .filter((x) => x.id !== p.id)
        .slice(0, 2)
        .map(
          (x) =>
            `<button type="button" class="similar-item" data-open-product="${esc(x.id)}"><div class="thumb">${productPhoto(x)}</div><span>${esc(x.nombre)}<br>${formatearPrecio(precioFinal(x))}</span></button>`,
        )
        .join("");
  } catch {
    if (serial === detailSerial && !target.querySelector(".detail-grid"))
      target.innerHTML =
        '<div class="empty-state"><h2>No pudimos abrir el producto.</h2><p>Cerrá este detalle y volvé a intentarlo.</p></div>';
  }
}
function initActions() {
  document.addEventListener("click", async (e) => {
    const trigger = e.target.closest("button");
    if (!trigger) return;
    if (trigger.hasAttribute("data-open-cart")) {
      openCartDrawer();
      return;
    }
    if (trigger.hasAttribute("data-open-product")) {
      openProduct(trigger.dataset.openProduct);
      return;
    }
    if (trigger.dataset.retry) {
      ({ home: loadHome, catalog: loadCatalog, admin: loadAdmin, cart: openCartDrawer })[
        trigger.dataset.retry
      ]?.();
      return;
    }
    if (trigger.hasAttribute("data-cart-remove")) {
      Cart.remove(trigger.dataset.cartRemove, trigger.dataset.talle);
      renderCart();
      return;
    }
    if (trigger.hasAttribute("data-cart-step")) {
      const line = Cart.get().find(
        (i) => i.id === trigger.dataset.id && i.talle === trigger.dataset.talle,
      );
      if (line) {
        Cart.setQty(line.id, line.qty + Number(trigger.dataset.cartStep), line.talle);
        renderCart();
      }
      return;
    }
    const owner = trigger.closest("[data-product]");
    if (!owner) return;
    let p = getProducto(owner.dataset.product);
    if (!p) {
      trigger.disabled = true;
      try {
        const data = await api({ scope: "lookup", ids: owner.dataset.product, limit: 1 });
        remember(data.items);
        p = data.items[0];
      } catch {
        showToast("No pudimos consultar el producto. Intentá de nuevo.");
      } finally {
        trigger.disabled = false;
      }
    }
    if (!p) return;
    const output = owner.querySelector("[data-qty]");
    if (trigger.hasAttribute("data-step")) {
      output.textContent = Math.max(
        1,
        Math.min(Math.max(1, p.stock), Number(output.textContent) + Number(trigger.dataset.step)),
      );
      owner.querySelector("[data-qty-input]").value = output.textContent;
      return;
    }
    if (trigger.hasAttribute("data-add") || trigger.hasAttribute("data-buy")) {
      const talle = owner.querySelector("[data-size]").value;
      if (!Cart.add(p, Number(output.textContent), talle)) {
        showToast("Ya agregaste la cantidad disponible para esta demo.");
        return;
      }
      if (trigger.hasAttribute("data-buy")) openCartDrawer();
      else showToast(`${p.nombre}${talle === "U" ? "" : ", talle " + talle} se agregó al carrito.`);
    }
  });
  document.getElementById("checkoutBtn").addEventListener("click", () => {
    if (Cart.count()) showToast("¡Genial! El pago online se activa al pasar la web a producción.");
  });
  document.addEventListener("change", (e) => {
    if (!e.target.matches("[data-qty-input]")) return;
    const input = e.target;
    const qty = Math.max(1, Math.min(Number(input.max), Math.floor(Number(input.value) || 1)));
    input.value = qty;
    input.closest("[data-product]").querySelector("[data-qty]").textContent = qty;
  });
  window.addEventListener("storage", (e) => {
    if (e.key === Cart.KEY) {
      updateCartBadge();
      if (currentDialog?.id === "cartBackdrop") openCartDrawer();
    }
  });
  document.querySelectorAll("details").forEach((el) => el.addEventListener("toggle", refresh));
}

if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined")
  gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === "undefined")
  document.querySelectorAll("[data-animate]").forEach((el) => el.classList.add("in"));
if (typeof ScrollTrigger !== "undefined")
  window.addEventListener("load", () => ScrollTrigger.refresh());
initCategories();
initNav();
initDialogs();
initActions();
initModelBarScroll();
initFloats();
updateCartBadge();
initHeroMotion();
Promise.allSettled([loadHome(), initCatalog(), initAdmin()]).then(initReveals);
if (PAGE !== "admin") hydrateCart().catch(() => {});
const initialProduct = new URLSearchParams(location.search).get("producto");
if (initialProduct) openProduct("", initialProduct.slice(0, 100));

document.querySelectorAll(".gw-modelos__btn").forEach((a) => {
  if (PAGE === "catalogo") a.href += location.search;
});
