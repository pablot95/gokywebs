/* global AbortController, fetch, innerWidth, history, MutationObserver */
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
  const desktopMq = window.matchMedia("(min-width: 769px)"); // el MISMO breakpoint que el media query de abajo, +1px
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
    cart?.classList.toggle("visible", scrolled || Cart.count() > 0); // con productos adentro, aparece siempre
  };
  window.addEventListener("scroll", sync, { passive: true });
  document.addEventListener("cart:updated", sync);
  cart?.addEventListener("click", openCartDrawer); // el MISMO handler del carrito del header
  sync();
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
  tl.from(hero.querySelectorAll(".hero-eyebrow"), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(
      hero.querySelectorAll("h1"),
      { y: 40, opacity: 0, duration: 1.2, clearProps: "filter" },
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

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const MODEL = document.body.dataset.modelo || "1";
const PAGE = document.body.dataset.pagina;
const CATALOG_URL = MODEL === "2" ? "catalogo-2.html" : "catalogo.html";
const WHATSAPP_NUMBER = "5493751374369";
const CATEGORIAS = [
  { id: "rodantes", nombre: "Casas rodantes", count: 2 },
  { id: "food-trucks", nombre: "Food trucks", count: 2 },
  { id: "motorhomes", nombre: "Motorhomes", count: 2 },
  { id: "modulos", nombre: "Módulos habitacionales", count: 3 },
];
const esc = (s) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
let PRODUCTOS = [];
const getProducto = (id) => PRODUCTOS.find((p) => p.id === id);
function remember(items) {
  for (const p of items) {
    PRODUCTOS = PRODUCTOS.filter((x) => x.id !== p.id);
    PRODUCTOS.push(p);
  }
  if (PRODUCTOS.length > 100) PRODUCTOS = PRODUCTOS.slice(-100);
}
function sanitizeCart(value) {
  if (!Array.isArray(value)) return [];
  const items = [];
  for (const row of value.slice(0, 100)) {
    if (
      !row ||
      typeof row.id !== "string" ||
      !/^[a-zA-Z0-9-]{1,80}$/.test(row.id) ||
      !Number.isSafeInteger(row.qty) ||
      row.qty < 1
    )
      continue;
    const previous = items.find((i) => i.id === row.id);
    if (previous) previous.qty = Math.min(99, previous.qty + row.qty);
    else items.push({ id: row.id, qty: Math.min(99, row.qty) });
  }
  return items;
}
const Cart = {
  KEY: "arandu_cart",
  memory: [],
  get() {
    try {
      return sanitizeCart(JSON.parse(localStorage.getItem(this.KEY) || "[]"));
    } catch {
      return sanitizeCart(this.memory);
    }
  },
  save(items) {
    this.memory = sanitizeCart(items);
    try {
      localStorage.setItem(this.KEY, JSON.stringify(this.memory));
    } catch {
      showToast("La lista se conserva mientras esta página siga abierta.");
    }
    document.dispatchEvent(new CustomEvent("cart:updated"));
  },
  add(producto, qty = 1) {
    if (!producto) return;
    qty = Math.max(1, Math.min(99, Math.floor(Number(qty) || 1)));
    const items = this.get();
    const existing = items.find((i) => i.id === producto.id);
    if (existing) existing.qty = Math.min(existing.qty + qty, 99);
    else if (items.length < 100) items.push({ id: producto.id, qty });
    else {
      showToast("La lista admite hasta 100 modelos.");
      return;
    }
    this.save(items);
  },
  setQty(id, qty) {
    const items = this.get();
    const it = items.find((i) => i.id === id);
    if (!it) return;
    it.qty = Math.max(1, Math.min(99, Math.floor(Number(qty) || 1)));
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
};
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
function whatsapp(lines) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
}
function refresh() {
  if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
}
async function api(params, signal) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== "" && v != null) query.set(k, v);
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
    if (!response.ok) throw new Error("No pudimos cargar los modelos. Volvé a intentar.");
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
const plus =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';
const arrow =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>';
const categoryName = (id) => CATEGORIAS.find((c) => c.id === id)?.nombre || "A medida";
function cardHTML(p) {
  if (PAGE === "admin")
    return `<article class="admin-row" data-animate="subir" style="opacity:0;transform:translateY(24px)"><img src="${esc(p.imagenes[0])}" alt="${esc(p.nombre)}" width="70" height="70"><div><h2>${esc(p.nombre)}</h2><p>${esc(p.id)} · Modelo de demostración</p></div><p>${esc(categoryName(p.categoria))}</p><button type="button" class="btn" data-detail="${esc(p.id)}">Ver ficha</button></article>`;
  return `<article class="product-card" data-animate="subir" style="opacity:0;transform:translateY(32px)"><button class="photo-button" type="button" data-detail="${esc(p.id)}" aria-label="Ver ${esc(p.nombre)}"><span class="product-photo"><img src="${esc(p.imagenes[0])}" alt="${esc(p.nombre)}, imagen ilustrativa" width="1254" height="1254"><span class="product-code">${esc(p.id.toUpperCase())}</span></span></button><div class="product-content"><div><p class="category-label">${esc(categoryName(p.categoria))}</p><h3><button class="product-link" type="button" data-detail="${esc(p.id)}">${esc(p.nombre)}</button></h3></div><button class="product-add" type="button" data-add="${esc(p.id)}" aria-label="Sumar ${esc(p.nombre)} a la cotización">${plus}<span class="add-label">Cotizar</span></button></div></article>`;
}
function errorHTML(message) {
  return `<div class="error-state"><p>${esc(message)}</p><button type="button" class="btn" data-retry>Volver a intentar</button></div>`;
}
async function loadHome() {
  const target = document.getElementById("homeProducts");
  if (!target) return;
  target.setAttribute("aria-busy", "true");
  try {
    const data = await api({ scope: "home", limit: 6 });
    remember(data.items);
    target.innerHTML = data.items.map(cardHTML).join("");
    revelarNuevos(target);
    refresh();
  } catch (error) {
    target.innerHTML = errorHTML(error.message);
  } finally {
    target.setAttribute("aria-busy", "false");
  }
}
function initCategories() {
  const current = new URLSearchParams(location.search).get("cat");
  document.querySelectorAll("[data-cats-menu]").forEach((el) => {
    el.innerHTML = CATEGORIAS.map(
      (c) =>
        `<li><a href="${CATALOG_URL}?cat=${c.id}"${current === c.id ? ' aria-current="page"' : ""}>${esc(c.nombre)} <span>${c.count}</span></a></li>`,
    ).join("");
  });
  const wrapper = document.querySelector(".nav-cats"),
    btn = wrapper?.querySelector("button"),
    panel = document.getElementById("navCats");
  if (!btn || !panel) return;
  let timer;
  const show = () => {
    clearTimeout(timer);
    panel.hidden = false;
    btn.setAttribute("aria-expanded", "true");
  };
  const hide = () => {
    clearTimeout(timer);
    panel.hidden = true;
    btn.setAttribute("aria-expanded", "false");
  };
  btn.addEventListener("click", () => (panel.hidden ? show() : hide()));
  wrapper.addEventListener("pointerenter", (e) => {
    if (e.pointerType === "mouse" && innerWidth > 768) show();
  });
  wrapper.addEventListener("pointerleave", () => {
    if (innerWidth > 768) timer = setTimeout(hide, 120);
  });
  wrapper.addEventListener("focusout", (e) => {
    if (!wrapper.contains(e.relatedTarget)) hide();
  });
  document.addEventListener("click", (e) => {
    if (!wrapper.contains(e.target)) hide();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !panel.hidden) {
      hide();
      btn.focus();
    }
  });
}
let catalogController,
  catalogGeneration = 0,
  nextCursor = null,
  shown = 0;
function readFilters() {
  return {
    cat: document.getElementById("category")?.value || "",
    uso: document.getElementById("use")?.value || "",
    q: document.getElementById("query")?.value.trim() || "",
    orden: document.getElementById("order")?.value || "nombre",
  };
}
function syncFilterURL(filters) {
  const url = new URL(location.href);
  ["cat", "uso", "q", "orden", "buscar", "producto"].forEach((k) => url.searchParams.delete(k));
  Object.entries(filters).forEach(([k, v]) => {
    if (v && !(k === "orden" && v === "nombre")) url.searchParams.set(k, v);
  });
  history.replaceState(null, "", url);
  const crumb = document.getElementById("crumb");
  if (crumb)
    crumb.textContent = filters.cat
      ? categoryName(filters.cat)
      : PAGE === "admin"
        ? "Panel"
        : "Catálogo";
  document.querySelectorAll("[data-cats-menu] a").forEach((a) => {
    if (new URL(a.href).searchParams.get("cat") === filters.cat)
      a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
  const bar = document.querySelector(".gw-modelos");
  if (PAGE === "catalogo")
    bar?.querySelectorAll("a").forEach((a) => {
      const target = new URL(a.href);
      target.search = url.search;
      a.href = target.pathname.split("/").pop() + target.search;
    });
}
async function loadCatalog(more = false) {
  const grid = document.getElementById("catalogGrid");
  if (!grid) return;
  const current = ++catalogGeneration;
  catalogController?.abort();
  catalogController = new AbortController();
  const button = document.getElementById("loadMore"),
    empty = document.getElementById("catalogEmpty"),
    count = document.getElementById("resultCount");
  const filters = readFilters();
  syncFilterURL(filters);
  const cursor = more ? nextCursor : null;
  if (!more) {
    shown = 0;
    nextCursor = null;
    grid.innerHTML = "";
    count.textContent = "Buscando modelos…";
    button.hidden = true;
  }
  empty.hidden = true;
  button.disabled = true;
  grid.setAttribute("aria-busy", "true");
  try {
    const data = await api(
      {
        ...filters,
        scope: PAGE === "admin" ? "admin" : "catalog",
        limit: PAGE === "admin" ? 100 : 16,
        cursor,
      },
      catalogController.signal,
    );
    if (current !== catalogGeneration) return;
    remember(data.items);
    shown += data.items.length;
    if (PAGE === "admin") grid.innerHTML = data.items.map(cardHTML).join("");
    else grid.insertAdjacentHTML("beforeend", data.items.map(cardHTML).join(""));
    nextCursor = data.nextCursor;
    count.textContent =
      PAGE === "admin"
        ? `${data.items.length} en esta página · ${data.total} modelos`
        : `${shown} de ${data.total} modelos`;
    button.hidden = !nextCursor;
    empty.hidden = data.total !== 0;
    if (!empty.hidden) empty.querySelector("h2").classList.add("in");
    revelarNuevos(grid);
    refresh();
  } catch (error) {
    if (error.name !== "AbortError" && current === catalogGeneration) {
      count.textContent = "No se pudo completar la consulta.";
      if (!more) grid.innerHTML = errorHTML(error.message);
      else showToast(error.message);
    }
  } finally {
    if (current === catalogGeneration) {
      button.disabled = false;
      grid.setAttribute("aria-busy", "false");
    }
  }
}
function resetFilters() {
  const form = document.getElementById("catalogFilters");
  if (!form) return;
  form.reset();
  loadCatalog();
}
function initCatalog() {
  const form = document.getElementById("catalogFilters");
  if (!form) return;
  const params = new URLSearchParams(location.search);
  const valid = {
    cat: CATEGORIAS.map((c) => c.id),
    uso: ["viajar", "emprender", "habitar", "trabajar"],
    orden: ["nombre", "nombre-desc"],
  };
  const ids = { cat: "category", uso: "use", orden: "order" };
  Object.entries(valid).forEach(([key, list]) => {
    if (list.includes(params.get(key))) document.getElementById(ids[key]).value = params.get(key);
  });
  document.getElementById("query").value = (params.get("q") || "").slice(0, 80);
  let timer;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    clearTimeout(timer);
    loadCatalog();
  });
  form.addEventListener("change", (e) => {
    if (e.target.matches("select")) loadCatalog();
  });
  document.getElementById("query").addEventListener("input", () => {
    clearTimeout(timer);
    timer = setTimeout(() => loadCatalog(), 300);
  });
  document.getElementById("clearFilters").addEventListener("click", resetFilters);
  document.querySelector("[data-clear]")?.addEventListener("click", resetFilters);
  document.getElementById("loadMore").addEventListener("click", () => loadCatalog(true));
  if (params.has("buscar")) document.getElementById("query").focus();
  return loadCatalog();
}
let lastFocus = null,
  activeOverlay = null,
  modalGeneration = 0;
const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])';
function trapFocus(e) {
  if (e.key !== "Tab") return;
  const elements = [...e.currentTarget.querySelectorAll(FOCUSABLE)].filter(
    (el) => el.getClientRects().length && !el.closest("[hidden]"),
  );
  const first = elements[0],
    last = elements.at(-1);
  if (!first) return;
  if (e.shiftKey && document.activeElement === first) {
    last.focus();
    e.preventDefault();
  } else if (!e.shiftKey && document.activeElement === last) {
    first.focus();
    e.preventDefault();
  }
}
function openOverlay(el) {
  if (activeOverlay && activeOverlay !== el) {
    activeOverlay.hidden = true;
    activeOverlay.removeEventListener("keydown", trapFocus);
  }
  if (!activeOverlay) lastFocus = document.activeElement;
  activeOverlay = el;
  el.hidden = false;
  document.body.classList.add("no-scroll");
  el.addEventListener("keydown", trapFocus);
  el.querySelector(FOCUSABLE)?.focus();
}
function closeOverlay() {
  if (!activeOverlay) return;
  activeOverlay.hidden = true;
  activeOverlay.removeEventListener("keydown", trapFocus);
  activeOverlay = null;
  document.body.classList.remove("no-scroll");
  lastFocus?.focus();
  const url = new URL(location.href);
  url.searchParams.delete("producto");
  history.replaceState(null, "", url);
}
async function findProduct(id, slug) {
  const cached = id ? getProducto(id) : PRODUCTOS.find((p) => p.slug === slug);
  if (cached) return cached;
  const data = await api({ scope: "lookup", ids: id || "", slug: slug || "" });
  remember(data.items);
  return data.items[0];
}
async function openProduct(id, slug) {
  const generation = ++modalGeneration;
  try {
    const p = await findProduct(id, slug);
    if (!p || generation !== modalGeneration) return;
    const content = document.getElementById("productContent");
    content.innerHTML = `<div class="product-detail"><div class="detail-photo"><img src="${esc(p.imagenes[0])}" alt="${esc(p.nombre)}, imagen ilustrativa" width="1254" height="1254"></div><div class="detail-copy"><span class="folio">${esc(p.id.toUpperCase())} / ${esc(categoryName(p.categoria))}</span><h2>${esc(p.nombre)}</h2><p>${esc(p.descripcion)}</p><p class="detail-note">Modelo e imagen de referencia. Medidas, equipamiento, vehículo base, valor y plazos a confirmar en la cotización.</p><label for="detailQty">Cantidad de unidades</label><div class="stepper"><button type="button" data-detail-step="-1" aria-label="Restar una unidad">−</button><output id="detailQty">1</output><button type="button" data-detail-step="1" aria-label="Sumar una unidad">+</button></div><button type="button" class="btn" data-detail-add="${esc(p.id)}">Sumar a mi consulta ${plus}</button><a class="text-link" href="${whatsapp([`Hola Arandú, quiero consultar por ${p.nombre}.`, `¿Podemos conversar sobre las opciones para mi proyecto?`])}" target="_blank" rel="noopener noreferrer">Consultar este modelo ${arrow}</a></div></div><div class="related" hidden><h3>También podés mirar</h3><div class="related-list"></div></div>`;
    const url = new URL(location.href);
    url.searchParams.set("producto", p.slug);
    history.replaceState(null, "", url);
    openOverlay(document.getElementById("productOverlay"));
    const data = await api({ scope: "catalog", cat: p.categoria, limit: 3 });
    if (generation !== modalGeneration) return;
    remember(data.items);
    const related = data.items.filter((x) => x.id !== p.id).slice(0, 2);
    content.querySelector(".related").hidden = related.length === 0;
    content.querySelector(".related-list").innerHTML = related
      .map(
        (x) =>
          `<button type="button" data-detail="${esc(x.id)}">${esc(x.nombre)} ${arrow}</button>`,
      )
      .join("");
  } catch (error) {
    showToast(error.message);
  }
}
async function openCartDrawer() {
  openOverlay(document.getElementById("cartOverlay"));
  document.getElementById("cartItems").innerHTML = '<p class="cart-empty">Cargando tu lista…</p>';
  document.getElementById("cartFooter").hidden = true;
  try {
    const saved = Cart.get();
    if (saved.length) {
      const data = await api({
        scope: "lookup",
        ids: saved.map((i) => i.id).join(","),
        limit: 100,
      });
      remember(data.items);
      const valid = new Set(data.items.map((p) => p.id));
      const cleaned = saved.filter((i) => valid.has(i.id));
      if (cleaned.length !== saved.length) Cart.save(cleaned);
    }
    renderCart();
  } catch (error) {
    document.getElementById("cartItems").innerHTML =
      `<div class="cart-empty"><p>${esc(error.message)}</p><button type="button" class="btn" data-retry-cart>Volver a intentar</button></div>`;
  }
}
function renderCart() {
  const items = Cart.get(),
    target = document.getElementById("cartItems");
  if (!target) return;
  document.getElementById("cartFooter").hidden = items.length === 0;
  if (!items.length) {
    target.innerHTML = `<div class="cart-empty"><h3>¿Qué proyecto tenés en mente?</h3><p>Explorá las líneas y agregá los modelos que quieras consultar.</p><a class="btn" href="${CATALOG_URL}">Explorar el catálogo ${arrow}</a></div>`;
    return;
  }
  target.innerHTML = items
    .map((i) => {
      const p = getProducto(i.id);
      if (!p) return "";
      return `<article class="cart-line"><img src="${esc(p.imagenes[0])}" alt="${esc(p.nombre)}" width="70" height="85"><div><h3>${esc(p.nombre)}</h3><div class="stepper"><button type="button" data-qty="${esc(i.id)}" data-delta="-1" aria-label="Restar ${esc(p.nombre)}">−</button><output>${i.qty}</output><button type="button" data-qty="${esc(i.id)}" data-delta="1" aria-label="Sumar ${esc(p.nombre)}">+</button></div></div><button type="button" class="icon-btn remove" data-remove="${esc(i.id)}" aria-label="Quitar ${esc(p.nombre)}">×</button></article>`;
    })
    .join("");
  updateQuote();
}
function updateQuote() {
  const items = Cart.get(),
    country = document.getElementById("destination")?.value || "Argentina";
  document.getElementById("quoteLink").href = whatsapp([
    "Hola Arandú, quiero pedir una cotización:",
    ...items.map((i) => `${i.qty} × ${getProducto(i.id)?.nombre || i.id}`),
    `Destino del proyecto: ${country}.`,
    "¿Podemos definir medidas, equipamiento y plazos?",
  ]);
}
function initInteractions() {
  document.addEventListener("cart:updated", () => {
    updateCartBadge();
    if (activeOverlay?.id === "cartOverlay") renderCart();
  });
  document.addEventListener("click", async (e) => {
    const target = e.target.closest("button,a");
    if (!target) return;
    if (target.matches("[data-detail]")) {
      openProduct(target.dataset.detail);
      return;
    }
    if (target.matches("[data-add],[data-detail-add]")) {
      const id = target.dataset.add || target.dataset.detailAdd;
      try {
        const p = await findProduct(id);
        const qty = target.dataset.detailAdd
          ? Number(document.getElementById("detailQty").value) || 1
          : 1;
        Cart.add(p, qty);
        showToast("Modelo agregado a tu consulta.");
      } catch (error) {
        showToast(error.message);
      }
      return;
    }
    if (target.matches("[data-detail-step]")) {
      const output = document.getElementById("detailQty");
      output.value = Math.max(
        1,
        Math.min(99, Number(output.value) + Number(target.dataset.detailStep)),
      );
    }
    if (target.matches("[data-open-cart],[data-retry-cart]")) openCartDrawer();
    if (target.matches("[data-close]")) {
      modalGeneration++;
      closeOverlay();
    }
    if (target.matches("[data-remove]")) {
      Cart.remove(target.dataset.remove);
      document.querySelector("#cartItems button, #quoteLink")?.focus();
    }
    if (target.matches("[data-qty]")) {
      const id = target.dataset.qty,
        delta = target.dataset.delta,
        item = Cart.get().find((i) => i.id === id);
      Cart.setQty(id, (item?.qty || 1) + Number(delta));
      document.querySelector(`[data-qty="${id}"][data-delta="${delta}"]`)?.focus();
    }
    if (target.matches("[data-retry]")) PAGE === "home" ? loadHome() : loadCatalog();
  });
  document.querySelectorAll(".overlay").forEach((el) =>
    el.addEventListener("click", (e) => {
      if (e.target === el) {
        modalGeneration++;
        closeOverlay();
      }
    }),
  );
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && activeOverlay) {
      modalGeneration++;
      closeOverlay();
    }
  });
  document.getElementById("destination")?.addEventListener("change", updateQuote);
  const country = document.getElementById("country");
  country?.addEventListener("change", () => {
    const value = country.value;
    document.getElementById("countryHint").textContent =
      value === "Argentina"
        ? "Contanos tu ciudad en Argentina y el tipo de unidad que necesitás."
        : `Contanos la ciudad de destino en ${value}. La logística y la documentación se evalúan para cada proyecto.`;
    document.querySelector(".country-link").href = whatsapp([
      "Hola Arandú, quiero consultar por un proyecto a medida.",
      `El destino es ${value}. ¿Podemos conversar sobre las opciones y la coordinación?`,
    ]);
  });
  document.querySelectorAll("details").forEach((el) => el.addEventListener("toggle", refresh));
  const nav = document.getElementById("mainNav"),
    toggle = document.getElementById("menuToggle");
  const syncDialog = () => {
    if (nav.classList.contains("open")) {
      nav.setAttribute("role", "dialog");
      nav.setAttribute("aria-modal", "true");
      nav.addEventListener("keydown", trapFocus);
    } else {
      nav.removeAttribute("role");
      nav.removeAttribute("aria-modal");
      nav.removeEventListener("keydown", trapFocus);
    }
  };
  new MutationObserver(syncDialog).observe(nav, { attributes: true, attributeFilter: ["class"] });
  window.matchMedia("(min-width:769px)").addEventListener("change", (e) => {
    if (e.matches && nav.classList.contains("open")) {
      toggle.click();
      nav.removeAttribute("inert");
    }
  });
}
if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined")
  gsap.registerPlugin(ScrollTrigger);
if (typeof ScrollTrigger !== "undefined")
  window.addEventListener("load", () => ScrollTrigger.refresh());
initCategories();
initNav();
initModelBarScroll();
initInteractions();
updateCartBadge();
initFloats();
initHeroMotion();
const initialSlug = new URLSearchParams(location.search).get("producto");
Promise.all([loadHome(), initCatalog()]).finally(() => {
  initReveals();
  if (initialSlug) openProduct(null, initialSlug);
  if (typeof gsap === "undefined")
    document.querySelectorAll("[data-animate]").forEach((el) => el.classList.add("in"));
});
