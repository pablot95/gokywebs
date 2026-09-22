/* ===================================================================
   VentasBrothers — script.js
   =================================================================== */
"use strict";

const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;
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
const norm = (s) =>
  String(s ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

/* ===================================================================
   Datos — categorías y fixtures
   =================================================================== */
const CATEGORIAS = [
  {
    id: "mascota",
    nombre: "Mascota",
    subcats: [
      { id: "comida-accesorios", nombre: "Comida y accesorios" },
      { id: "descanso-paseo", nombre: "Descanso y paseo" },
    ],
  },
  {
    id: "hogar",
    nombre: "Hogar",
    subcats: [
      { id: "textiles-aromas", nombre: "Textiles y aromas" },
      { id: "vajilla-living", nombre: "Vajilla y living" },
    ],
  },
];

const SUBCAT_ICON = {
  "comida-accesorios":
    '<path d="M4 10a8 4 0 0 0 16 0"/><path d="M4 10a8 4 0 0 1 16 0"/><path d="M4 10v3a8 4 0 0 0 16 0v-3"/>',
  "descanso-paseo":
    '<path d="M12 15c-3.3 0-6 1.6-6 4v1h12v-1c0-2.4-2.7-4-6-4Z"/><circle cx="7.5" cy="7" r="1.6"/><circle cx="12" cy="5.4" r="1.6"/><circle cx="16.5" cy="7" r="1.6"/><circle cx="9.2" cy="10.6" r="1.4"/>',
  "textiles-aromas":
    '<path d="M12 3c1.6 2 2.4 3.6 2.4 5a2.4 2.4 0 1 1-4.8 0c0-1.4.8-3 2.4-5Z"/><path d="M6 21v-6a6 6 0 0 1 12 0v6"/>',
  "vajilla-living":
    '<path d="M5 4h14l-1.2 9.4a4 4 0 0 1-4 3.6h-3.6a4 4 0 0 1-4-3.6L5 4Z"/><path d="M9 21h6"/><path d="M12 17v4"/>',
};

const PRODUCTOS = [
  {
    id: 1,
    nombre: "Bowl de acero para perro grande",
    categoria: "mascota",
    subcategoria: "comida-accesorios",
    precio: 18900,
    descuento: 0,
    stock: 14,
    imagen: "prod-bowl-acero.webp",
    descripcion:
      "Cuenco de acero inoxidable con base antideslizante, apto para razas grandes.",
  },
  {
    id: 2,
    nombre: "Bowl de cerámica para gato",
    categoria: "mascota",
    subcategoria: "comida-accesorios",
    precio: 14500,
    descuento: 0,
    stock: 20,
    imagen: "prod-bowl-ceramica.webp",
    descripcion:
      "Cuenco de cerámica esmaltada, borde bajo pensado para bigotes sensibles.",
  },
  {
    id: 3,
    nombre: "Frasco de golosinas caseras",
    categoria: "mascota",
    subcategoria: "comida-accesorios",
    precio: 9800,
    descuento: 15,
    stock: 30,
    imagen: "prod-tarro-golosinas.webp",
    descripcion:
      "Galletitas horneadas sin conservantes, en frasco de vidrio hermético de 400g.",
    tag: "Más vendido",
  },
  {
    id: 4,
    nombre: "Dispenser de agua con filtro",
    categoria: "mascota",
    subcategoria: "comida-accesorios",
    precio: 26400,
    descuento: 0,
    stock: 9,
    imagen: null,
    descripcion:
      "Fuente de agua circulante de 2 litros, con filtro de carbón activado.",
    tag: "Nuevo",
  },
  {
    id: 5,
    nombre: "Set de premios naturales x3",
    categoria: "mascota",
    subcategoria: "comida-accesorios",
    precio: 12200,
    descuento: 10,
    stock: 18,
    imagen: null,
    descripcion:
      "Tres variedades de snacks 100% naturales, ideales para el adiestramiento.",
  },
  {
    id: 6,
    nombre: "Correa de cuero trenzado",
    categoria: "mascota",
    subcategoria: "descanso-paseo",
    precio: 22400,
    descuento: 0,
    stock: 11,
    imagen: null,
    descripcion: "Cuero vacuno curtido a mano, 1,5m, mosquetón de bronce.",
  },
  {
    id: 7,
    nombre: "Cama acolchada gris topo",
    categoria: "mascota",
    subcategoria: "descanso-paseo",
    precio: 34900,
    descuento: 0,
    stock: 6,
    imagen: null,
    descripcion: "Relleno viscoelástico, funda desmontable y lavable, talle M.",
    tag: "Últimas unidades",
  },
  {
    id: 8,
    nombre: "Manta polar antipelo",
    categoria: "mascota",
    subcategoria: "descanso-paseo",
    precio: 11200,
    descuento: 0,
    stock: 24,
    imagen: null,
    descripcion: "Microfibra suave que no retiene pelos, 100x140cm.",
  },
  {
    id: 9,
    nombre: "Cepillo de cerdas naturales",
    categoria: "mascota",
    subcategoria: "descanso-paseo",
    precio: 8400,
    descuento: 0,
    stock: 27,
    imagen: null,
    descripcion: "Mango de madera, ideal para pelo corto y mediano.",
  },
  {
    id: 10,
    nombre: "Transportadora de lona reforzada",
    categoria: "mascota",
    subcategoria: "descanso-paseo",
    precio: 28700,
    descuento: 0,
    stock: 7,
    imagen: null,
    descripcion:
      "Apta para viajes cortos, ventilación en cuatro caras, hasta 8kg.",
    tag: "Últimas unidades",
  },
  {
    id: 11,
    nombre: "Set de toallas de algodón x2",
    categoria: "hogar",
    subcategoria: "textiles-aromas",
    precio: 16800,
    descuento: 0,
    stock: 16,
    imagen: "prod-toallas.webp",
    descripcion: "Algodón peinado 550g/m², en tono piedra y ciruela.",
  },
  {
    id: 12,
    nombre: "Vela y difusor de ambiente",
    categoria: "hogar",
    subcategoria: "textiles-aromas",
    precio: 12900,
    descuento: 0,
    stock: 22,
    imagen: "prod-vela-difusor.webp",
    descripcion:
      "Set de vela de soja y difusor de varillas, aroma a madera y cedro.",
    tag: "Más vendido",
  },
  {
    id: 13,
    nombre: "Manta de lino natural",
    categoria: "hogar",
    subcategoria: "textiles-aromas",
    precio: 24300,
    descuento: 20,
    stock: 10,
    imagen: null,
    descripcion: "Lino 100%, tejido liviano de verano, 180x220cm.",
  },
  {
    id: 14,
    nombre: "Cojín de lino texturado",
    categoria: "hogar",
    subcategoria: "textiles-aromas",
    precio: 15400,
    descuento: 0,
    stock: 19,
    imagen: null,
    descripcion: "Funda de lino grueso con relleno de plumón, 45x45cm.",
  },
  {
    id: 15,
    nombre: "Aromatizador textil en spray",
    categoria: "hogar",
    subcategoria: "textiles-aromas",
    precio: 7600,
    descuento: 0,
    stock: 31,
    imagen: null,
    descripcion: "Fórmula sin alcohol, aroma a flor de azahar, 250ml.",
    tag: "Nuevo",
  },
  {
    id: 16,
    nombre: "Cesto de mimbre grande",
    categoria: "hogar",
    subcategoria: "vajilla-living",
    precio: 19500,
    descuento: 0,
    stock: 13,
    imagen: "prod-cestos-mimbre.webp",
    descripcion: "Mimbre natural tejido a mano, con asas reforzadas.",
  },
  {
    id: 17,
    nombre: "Set de tazones de cerámica x4",
    categoria: "hogar",
    subcategoria: "vajilla-living",
    precio: 21700,
    descuento: 0,
    stock: 15,
    imagen: null,
    descripcion:
      "Esmalte reactivo, cada pieza con variaciones únicas de color.",
  },
  {
    id: 18,
    nombre: "Portavelas de vidrio soplado",
    categoria: "hogar",
    subcategoria: "vajilla-living",
    precio: 9200,
    descuento: 0,
    stock: 25,
    imagen: null,
    descripcion: "Vidrio soplado a mano, set de 2 tamaños.",
  },
  {
    id: 19,
    nombre: "Tabla de madera para servir",
    categoria: "hogar",
    subcategoria: "vajilla-living",
    precio: 17600,
    descuento: 10,
    stock: 12,
    imagen: null,
    descripcion: "Algarrobo macizo, asa tallada, 40x22cm.",
  },
  {
    id: 20,
    nombre: "Jarra de cerámica artesanal",
    categoria: "hogar",
    subcategoria: "vajilla-living",
    precio: 18200,
    descuento: 0,
    stock: 14,
    imagen: null,
    descripcion: "Torneada a mano, capacidad 1,2 litros.",
  },
];

const getProducto = (id) => PRODUCTOS.find((p) => p.id === id);
const nombreCategoria = (id) =>
  CATEGORIAS.find((c) => c.id === id)?.nombre || id;
const nombreSubcat = (id) =>
  CATEGORIAS.flatMap((c) => c.subcats).find((s) => s.id === id)?.nombre || id;

/* ===================================================================
   Carrito canónico
   =================================================================== */
const Cart = {
  KEY: "ventasbrothers_cart",
  get() {
    try {
      return JSON.parse(localStorage.getItem(this.KEY)) || [];
    } catch {
      return [];
    }
  },
  save(items) {
    try {
      localStorage.setItem(this.KEY, JSON.stringify(items));
    } catch {
      /* storage no disponible */
    }
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
    it.qty = Math.max(1, Math.min(qty, p?.stock ?? 99));
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
};

/* ===================================================================
   Toast
   =================================================================== */
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

/* ===================================================================
   Anti-copia — obligatorio
   =================================================================== */
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

/* ===================================================================
   Nav mobile — snippet §6
   =================================================================== */
function initNav() {
  const toggle = document.getElementById("menuToggle");
  const nav = document.getElementById("mainNav");
  const closeBtn = document.getElementById("navClose");
  if (!toggle || !nav) return;
  let bd = document.querySelector(".nav-backdrop");
  if (!bd) {
    bd = document.createElement("div");
    bd.className = "nav-backdrop";
    document.body.appendChild(bd);
  }
  const desktopMq = window.matchMedia("(min-width: 900px)");
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
    if (desktopMq.matches) nav.removeAttribute("inert");
    else if (!nav.classList.contains("open")) nav.setAttribute("inert", "");
  };
  desktopMq.addEventListener("change", syncInert);
  syncInert();
}

/* ===================================================================
   Reveals — snippet §7, literal
   =================================================================== */
function initReveals() {
  const items = document.querySelectorAll("[data-animate]");
  if (!items.length) return;
  document.querySelectorAll("[data-animate-stagger]").forEach((parent) => {
    parent.querySelectorAll("[data-animate]").forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i * 0.1, 0.6)}s`;
    });
  });
  if (!("IntersectionObserver" in window) || reduceMotion) {
    items.forEach((el) => el.classList.add("in"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
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
    items.forEach((el) => {
      if (el.classList.contains("in")) return;
      const r = el.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight) {
        el.classList.add("in");
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
  window.addEventListener("load", queueSweep);
  window.addEventListener("scroll", queueSweep, { passive: true });
  window.addEventListener("resize", queueSweep, { passive: true });
}
let revealsListos = false;
function marcarRevealsListos() {
  revealsListos = true;
}
function revelarNuevos(cont) {
  if (!revealsListos || !cont) return;
  cont.querySelectorAll("[data-animate]:not(.in)").forEach((el) => {
    el.classList.add("in");
  });
}

/* ===================================================================
   Floats: carrito + WhatsApp — snippet §8
   =================================================================== */
function initFloats() {
  const wsp = document.getElementById("wsp-float");
  const cart = document.getElementById("cart-float");
  const sync = () => {
    const scrolled = window.scrollY > 600;
    wsp?.classList.toggle("visible", scrolled);
    cart?.classList.toggle("visible", scrolled || Cart.count() > 0);
  };
  window.addEventListener("scroll", sync, { passive: true });
  document.addEventListener("cart:updated", sync);
  cart?.addEventListener("click", () => openCartDrawer());
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

/* ===================================================================
   Producto: render de card
   =================================================================== */
function iconoSubcat(subcat) {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true">${SUBCAT_ICON[subcat] || SUBCAT_ICON["vajilla-living"]}</svg>`;
}

function mediaProducto(p) {
  if (p.imagen)
    return `<img src="images/${p.imagen}" alt="${esc(p.nombre)}" loading="lazy" width="600" height="600">`;
  return `<div class="prod-card__placa" style="background:${p.categoria === "mascota" ? "linear-gradient(160deg,#FBEFFB,#F6DCF5)" : "linear-gradient(160deg,#EAF6EE,#DCF0E2)"}">${iconoSubcat(p.subcategoria)}<span>${esc(p.nombre)}</span></div>`;
}

function renderProductCard(p, { compact = false } = {}) {
  const precio = precioFinal(p);
  const tieneDesc = p.descuento > 0;
  return `
  <article class="prod-card" data-id="${p.id}">
    <div class="prod-card__media" data-open-quickview="${p.id}">
      ${mediaProducto(p)}
      <div class="prod-card__badges">
        ${tieneDesc ? `<span class="badge badge-primary">-${p.descuento}%</span>` : ""}
        ${p.tag ? `<span class="badge badge-ink">${esc(p.tag)}</span>` : ""}
      </div>
    </div>
    <div class="prod-card__body">
      <p class="prod-card__cat">${esc(nombreSubcat(p.subcategoria))}</p>
      <a href="#" class="prod-card__name" data-open-quickview="${p.id}">${esc(p.nombre)}</a>
      <div class="prod-card__price">
        <strong>${formatearPrecio(precio)}</strong>
        ${tieneDesc ? `<s>${formatearPrecio(p.precio)}</s>` : ""}
      </div>
      ${
        compact
          ? ""
          : `
      <div class="prod-actions">
        <div class="stepper" data-stepper="${p.id}">
          <button type="button" data-step="-1" aria-label="Restar cantidad">–</button>
          <span data-qty>1</span>
          <button type="button" data-step="1" aria-label="Sumar cantidad">+</button>
        </div>
        <button type="button" class="btn btn-outline btn-sm prod-add" data-add="${p.id}">Agregar</button>
        <button type="button" class="btn btn-cta btn-sm prod-buy" data-buy="${p.id}" aria-label="Comprar ahora">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
        </button>
      </div>`
      }
    </div>
  </article>`;
}

function qtyFromStepper(cont, id) {
  const el = cont.querySelector(`[data-stepper="${id}"] [data-qty]`);
  return el ? parseInt(el.textContent, 10) || 1 : 1;
}

function wireProductCards(root) {
  root.querySelectorAll("[data-stepper]").forEach((st) => {
    const id = Number(st.dataset.stepper);
    const p = getProducto(id);
    const span = st.querySelector("[data-qty]");
    st.querySelectorAll("[data-step]").forEach((btn) => {
      btn.addEventListener("click", () => {
        let v = parseInt(span.textContent, 10) || 1;
        v = Math.max(1, Math.min(v + Number(btn.dataset.step), p?.stock ?? 99));
        span.textContent = v;
      });
    });
  });
  root.querySelectorAll("[data-add]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.add);
      const p = getProducto(id);
      if (!p) return;
      const qty = qtyFromStepper(root, id);
      Cart.add(p, qty);
      showToast(`${p.nombre} agregado al carrito`);
    });
  });
  root.querySelectorAll("[data-buy]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.buy);
      const p = getProducto(id);
      if (!p) return;
      const qty = qtyFromStepper(root, id);
      Cart.add(p, qty);
      openCartDrawer();
    });
  });
  root.querySelectorAll("[data-open-quickview]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      openQuickView(Number(el.dataset.openQuickview));
    });
  });
}

/* ===================================================================
   Catálogo con filtros (Modelo B)
   =================================================================== */
const catalogoState = {
  q: "",
  categorias: [],
  subcats: [],
  precioMax: 40000,
  soloStock: false,
  orden: "relevancia",
  visibles: 16,
};

function productosFiltrados() {
  let list = PRODUCTOS.filter((p) => {
    if (catalogoState.q) {
      const hay = norm(
        `${p.nombre} ${nombreCategoria(p.categoria)} ${nombreSubcat(p.subcategoria)} ${p.descripcion}`,
      );
      if (!hay.includes(norm(catalogoState.q))) return false;
    }
    if (
      catalogoState.categorias.length &&
      !catalogoState.categorias.includes(p.categoria)
    )
      return false;
    if (
      catalogoState.subcats.length &&
      !catalogoState.subcats.includes(p.subcategoria)
    )
      return false;
    if (precioFinal(p) > catalogoState.precioMax) return false;
    if (catalogoState.soloStock && p.stock <= 0) return false;
    return true;
  });
  switch (catalogoState.orden) {
    case "precio-asc":
      list = list.slice().sort((a, b) => precioFinal(a) - precioFinal(b));
      break;
    case "precio-desc":
      list = list.slice().sort((a, b) => precioFinal(b) - precioFinal(a));
      break;
    case "nombre":
      list = list
        .slice()
        .sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
      break;
  }
  return list;
}

function renderCatalogo() {
  const grid = document.getElementById("catalogoGrid");
  const resultados = document.getElementById("catalogoResultados");
  const verMasWrap = document.getElementById("verMasWrap");
  const vacio = document.getElementById("catalogoVacio");
  if (!grid) return;
  const todos = productosFiltrados();
  const visibles = todos.slice(0, catalogoState.visibles);

  if (resultados)
    resultados.textContent = `${todos.length} producto${todos.length === 1 ? "" : "s"}`;

  if (!todos.length) {
    grid.innerHTML = "";
    if (vacio) vacio.hidden = false;
    if (verMasWrap) verMasWrap.hidden = true;
    return;
  }
  if (vacio) vacio.hidden = true;
  grid.innerHTML = visibles.map((p) => renderProductCard(p)).join("");
  wireProductCards(grid);
  revelarNuevos(grid);
  if (verMasWrap) verMasWrap.hidden = todos.length <= catalogoState.visibles;
}

function initCatalogo() {
  const grid = document.getElementById("catalogoGrid");
  if (!grid) return;

  const catGroup = document.getElementById("filtroCategorias");
  if (catGroup) {
    catGroup.innerHTML = CATEGORIAS.map(
      (c) => `
      <label class="filtro-opt">
        <input type="checkbox" data-f="cat" value="${c.id}">
        <span>${esc(c.nombre)} <small>(${PRODUCTOS.filter((p) => p.categoria === c.id).length})</small></span>
      </label>`,
    ).join("");
  }
  const subGroup = document.getElementById("filtroSubcats");
  if (subGroup) {
    subGroup.innerHTML = CATEGORIAS.flatMap((c) => c.subcats)
      .map(
        (s) => `
      <label class="filtro-opt">
        <input type="checkbox" data-f="sub" value="${s.id}">
        <span>${esc(s.nombre)} <small>(${PRODUCTOS.filter((p) => p.subcategoria === s.id).length})</small></span>
      </label>`,
      )
      .join("");
  }

  const syncFromInputs = () => {
    catalogoState.categorias = [
      ...document.querySelectorAll('input[data-f="cat"]:checked'),
    ].map((i) => i.value);
    catalogoState.subcats = [
      ...document.querySelectorAll('input[data-f="sub"]:checked'),
    ].map((i) => i.value);
    catalogoState.soloStock =
      document.querySelector('input[data-f="stock"]')?.checked ?? false;
    catalogoState.visibles = 16;
    renderCatalogo();
  };

  document.addEventListener("change", (e) => {
    if (e.target.matches("input[data-f]")) syncFromInputs();
  });

  const buscador = document.getElementById("catalogoBuscador");
  if (buscador) {
    buscador.addEventListener("input", () => {
      catalogoState.q = buscador.value;
      catalogoState.visibles = 16;
      renderCatalogo();
    });
  }
  const heroBuscador = document.getElementById("heroBuscador");
  if (heroBuscador) {
    const heroForm = heroBuscador.closest("form");
    heroForm?.addEventListener("submit", (e) => {
      e.preventDefault();
      catalogoState.q = heroBuscador.value;
      document
        .getElementById("catalogo")
        ?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
      renderCatalogo();
      if (buscador) buscador.value = heroBuscador.value;
    });
  }

  document.querySelectorAll("[data-filtro-mundo]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      const cat = el.dataset.filtroMundo;
      document.querySelectorAll('input[data-f="cat"]').forEach((i) => {
        i.checked = i.value === cat;
      });
      document.querySelectorAll('input[data-f="sub"]').forEach((i) => {
        i.checked = false;
      });
      syncFromInputs();
      document
        .getElementById("catalogo")
        ?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
    });
  });

  const precio = document.getElementById("filtroPrecio");
  const precioVal = document.getElementById("filtroPrecioVal");
  if (precio) {
    precio.addEventListener("input", () => {
      catalogoState.precioMax = Number(precio.value);
      if (precioVal) precioVal.textContent = formatearPrecio(precio.value);
      catalogoState.visibles = 16;
      renderCatalogo();
    });
  }
  const orden = document.getElementById("filtroOrden");
  orden?.addEventListener("change", () => {
    catalogoState.orden = orden.value;
    renderCatalogo();
  });

  document.getElementById("filtroLimpiar")?.addEventListener("click", () => {
    document.querySelectorAll("input[data-f]").forEach((i) => {
      if (i.type === "checkbox") i.checked = false;
    });
    if (precio) {
      precio.value = 40000;
      if (precioVal) precioVal.textContent = formatearPrecio(40000);
    }
    if (buscador) buscador.value = "";
    if (orden) orden.value = "relevancia";
    Object.assign(catalogoState, {
      q: "",
      categorias: [],
      subcats: [],
      precioMax: 40000,
      soloStock: false,
      orden: "relevancia",
      visibles: 16,
    });
    renderCatalogo();
  });
  document
    .getElementById("catalogoVacioLimpiar")
    ?.addEventListener("click", () =>
      document.getElementById("filtroLimpiar")?.click(),
    );

  document.getElementById("verMasBtn")?.addEventListener("click", () => {
    catalogoState.visibles += 16;
    renderCatalogo();
  });

  const filtrosToggle = document.getElementById("filtrosToggle");
  const filtrosPanel = document.getElementById("filtrosPanel");
  const filtrosClose = document.getElementById("filtrosClose");
  const filtrosApply = document.getElementById("filtrosApply");
  if (filtrosToggle && filtrosPanel) {
    let fbd = document.querySelector(".nav-backdrop");
    const open = () => {
      filtrosPanel.classList.add("open");
      (fbd || document.body).classList.add("open");
      document.body.classList.add("no-scroll");
    };
    const close = () => {
      filtrosPanel.classList.remove("open");
      fbd?.classList.remove("open");
      document.body.classList.remove("no-scroll");
    };
    filtrosToggle.addEventListener("click", open);
    filtrosClose?.addEventListener("click", close);
    filtrosApply?.addEventListener("click", close);
  }

  renderCatalogo();
}

/* ===================================================================
   Mosaico de productos (Modelo C)
   =================================================================== */
function initMosaico() {
  const grid = document.getElementById("mosaicoGrid");
  if (!grid) return;
  const destacados = [3, 16, 7, 12, 1, 20];
  grid.innerHTML = destacados
    .map((id) => renderProductCard(getProducto(id), { compact: true }))
    .join("");
  wireProductCards(grid);
}

/* ===================================================================
   Rail de destacados — snippet §7b
   =================================================================== */
function initRail(sectionId, ids) {
  const section = document.getElementById(sectionId);
  if (!section) return;
  const vp = section.querySelector(".rail-vp");
  const track = section.querySelector(".rail-track");
  if (!vp || !track) return;
  track.innerHTML = ids
    .map((id) => renderProductCard(getProducto(id), { compact: true }))
    .join("");
  wireProductCards(track);

  const prev = section.querySelector("[data-rail-prev]");
  const next = section.querySelector("[data-rail-next]");
  const cardW = () =>
    track.querySelector(".prod-card")?.getBoundingClientRect().width || 260;

  let isDown = false,
    moved = false,
    startX = 0,
    scrollStart = 0,
    pointerId = null;
  vp.addEventListener("pointerdown", (e) => {
    isDown = true;
    moved = false;
    startX = e.clientX;
    scrollStart = vp.scrollLeft;
    pointerId = e.pointerId;
  });
  vp.addEventListener("pointermove", (e) => {
    if (!isDown) return;
    const dx = e.clientX - startX;
    if (!moved && Math.abs(dx) > 6) {
      moved = true;
      vp.classList.add("dragging");
      try {
        vp.setPointerCapture?.(pointerId);
      } catch {
        /* sin capture el drag igual funciona */
      }
    }
    if (moved) vp.scrollLeft = scrollStart - dx;
  });
  const end = () => {
    if (moved) {
      try {
        vp.releasePointerCapture?.(pointerId);
      } catch {
        /* ya liberado */
      }
    }
    isDown = false;
    setTimeout(() => {
      vp.classList.remove("dragging");
      moved = false;
    }, 0);
  };
  vp.addEventListener("pointerup", end);
  vp.addEventListener("pointerleave", () => {
    if (isDown) end();
  });
  vp.addEventListener(
    "click",
    (e) => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
    true,
  );

  const syncArrows = () => {
    const inicio =
      parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
    if (prev) prev.disabled = vp.scrollLeft <= inicio + 2;
    if (next)
      next.disabled = vp.scrollLeft >= vp.scrollWidth - vp.clientWidth - 2;
  };
  prev?.addEventListener("click", () =>
    vp.scrollBy({
      left: -cardW() * 2,
      behavior: reduceMotion ? "auto" : "smooth",
    }),
  );
  next?.addEventListener("click", () =>
    vp.scrollBy({
      left: cardW() * 2,
      behavior: reduceMotion ? "auto" : "smooth",
    }),
  );
  vp.addEventListener("scroll", syncArrows, { passive: true });
  syncArrows();
}

/* ===================================================================
   La vidriera que se recorre — MOMENTO PROPIO
   =================================================================== */
const VIDRIERA_IDS = [1, 11, 3, 12, 2, 16];

function initVidriera(rootId) {
  const root = document.getElementById(rootId);
  if (!root) return;
  const wrap = root.querySelector(".vidriera-wrap");
  const scene = root.querySelector(".vidriera-scene");
  const media = root.querySelector(".vidriera-media");
  const copy = root.querySelector(".vidriera-copy");
  const dotsWrap = root.querySelector(".vidriera-dots");
  const bar = root.querySelector(".vidriera-bar__fill");
  const countCur = root.querySelector("[data-vidriera-cur]");
  if (!wrap || !scene || !media || !copy) return;

  const piezas = VIDRIERA_IDS.map(getProducto).filter(Boolean);

  media.innerHTML = piezas
    .map(
      (p, i) => `
    <div class="vidriera-frame${i === 0 ? " is-active" : ""}" data-frame="${i}">
      <span class="vidriera-frame__tag badge ${p.categoria === "mascota" ? "badge-primary" : "badge-secondary"}">${esc(nombreCategoria(p.categoria))}</span>
      <img src="images/${p.imagen}" alt="${esc(p.nombre)}" ${i === 0 ? "" : 'loading="lazy"'} width="900" height="900">
    </div>`,
    )
    .join("");

  copy.innerHTML = piezas
    .map((p, i) => {
      const precio = precioFinal(p);
      const tieneDesc = p.descuento > 0;
      return `
    <div class="vidriera-copy__item${i === 0 ? " is-active" : ""}" data-copy="${i}">
      <p class="vidriera-copy__cat">${esc(nombreSubcat(p.subcategoria))}</p>
      <h3 class="vidriera-copy__name">${esc(p.nombre)}</h3>
      <p class="vidriera-copy__desc">${esc(p.descripcion)}</p>
      <p class="vidriera-copy__price"><strong>${formatearPrecio(precio)}</strong>${tieneDesc ? `<s>${formatearPrecio(p.precio)}</s>` : ""}</p>
      <button type="button" class="btn btn-cta" data-vidriera-add="${p.id}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6h15l-1.5 9h-12z"/><path d="M6 6 5 3H2"/><circle cx="9.5" cy="20" r="1.4" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.4" fill="currentColor" stroke="none"/></svg>
        Agregar al carrito
      </button>
    </div>`;
    })
    .join("");
  if (dotsWrap)
    dotsWrap.innerHTML = piezas
      .map(
        (_, i) =>
          `<span data-dot="${i}" class="${i === 0 ? "is-active" : ""}"></span>`,
      )
      .join("");

  copy.querySelectorAll("[data-vidriera-add]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const p = getProducto(Number(btn.dataset.vidrieraAdd));
      if (!p) return;
      Cart.add(p, 1);
      showToast(`${p.nombre} agregado al carrito`);
    });
  });

  const frames = [...media.querySelectorAll(".vidriera-frame")];
  const copyItems = [...copy.querySelectorAll(".vidriera-copy__item")];
  const dots = dotsWrap ? [...dotsWrap.querySelectorAll("span")] : [];
  let activeIdx = 0;

  const setActive = (idx) => {
    if (idx === activeIdx) return;
    activeIdx = idx;
    frames.forEach((f, i) => f.classList.toggle("is-active", i === idx));
    copyItems.forEach((c, i) => c.classList.toggle("is-active", i === idx));
    dots.forEach((d, i) => d.classList.toggle("is-active", i === idx));
    if (countCur) countCur.textContent = String(idx + 1).padStart(2, "0");
  };

  let ticking = false;
  const update = () => {
    ticking = false;
    const rect = wrap.getBoundingClientRect();
    const sceneH = scene.offsetHeight;
    const recorrido = wrap.offsetHeight - sceneH;
    let p = recorrido > 0 ? -rect.top / recorrido : 0;
    p = Math.max(0, Math.min(1, p));
    const idx = Math.min(piezas.length - 1, Math.floor(p * piezas.length));
    setActive(idx);
    if (bar) bar.style.width = `${p * 100}%`;
  };
  const queue = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  };
  window.addEventListener("scroll", queue, { passive: true });
  window.addEventListener("resize", queue, { passive: true });
  window.addEventListener("load", queue);
  queue();
}

/* ===================================================================
   Calculadora de envío — componente funcional (Correo Argentino)
   =================================================================== */
function zonaEnvio(cpStr) {
  const n = parseInt(cpStr, 10);
  if (!n || n < 1000 || n > 9420) return null;
  if (n >= 1000 && n <= 1499)
    return { zona: "CABA", dias: "2 a 3", costo: 3500 };
  if (n >= 1600 && n <= 1899)
    return { zona: "GBA", dias: "2 a 3", costo: 3900 };
  if ((n >= 1500 && n <= 1599) || (n >= 1900 && n <= 2999))
    return { zona: "Buenos Aires (interior)", dias: "4 a 5", costo: 5200 };
  if (n >= 3000 && n <= 3999)
    return { zona: "Litoral y Mesopotamia", dias: "4 a 6", costo: 5600 };
  if (n >= 4000 && n <= 4999)
    return { zona: "Centro, Cuyo y NOA", dias: "5 a 6", costo: 5900 };
  if (n >= 5000 && n <= 5999)
    return { zona: "Córdoba y Cuyo", dias: "4 a 5", costo: 5400 };
  if (n >= 6000 && n <= 7999)
    return { zona: "Buenos Aires y La Pampa", dias: "4 a 5", costo: 5200 };
  if (n >= 8000 && n <= 8999)
    return { zona: "Patagonia norte", dias: "6 a 8", costo: 6800 };
  if (n >= 9000 && n <= 9420)
    return {
      zona: "Patagonia sur y Tierra del Fuego",
      dias: "7 a 9",
      costo: 7500,
    };
  return { zona: "Argentina", dias: "4 a 7", costo: 5800 };
}

function initEnvioCalc() {
  const form = document.getElementById("envioForm");
  if (!form) return;
  const input = document.getElementById("envioCp");
  const result = document.getElementById("envioResult");
  const error = document.getElementById("envioError");
  const zonaEl = document.getElementById("envioZona");
  const diasEl = document.getElementById("envioDias");
  const costoEl = document.getElementById("envioCosto");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const r = zonaEnvio(input.value.trim());
    if (!r) {
      if (result) result.hidden = true;
      if (error) error.hidden = false;
      return;
    }
    if (error) error.hidden = true;
    if (zonaEl) zonaEl.textContent = r.zona;
    if (diasEl) diasEl.textContent = `${r.dias} días hábiles`;
    if (costoEl) costoEl.textContent = `Desde ${formatearPrecio(r.costo)}`;
    if (result) result.hidden = false;
  });
}

/* ===================================================================
   Carrito: drawer
   =================================================================== */
function renderCartDrawer() {
  const body = document.getElementById("cartBody");
  const foot = document.getElementById("cartFoot");
  if (!body) return;
  const items = Cart.get();
  if (!items.length) {
    body.innerHTML = `
      <div class="cart-empty">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>
        <p>Tu carrito está vacío por ahora.</p>
        <button type="button" class="btn btn-outline btn-sm" data-cart-seguir>Seguir mirando</button>
      </div>`;
    body
      .querySelector("[data-cart-seguir]")
      ?.addEventListener("click", closeCartDrawer);
    if (foot) foot.hidden = true;
    return;
  }
  if (foot) foot.hidden = false;
  body.innerHTML = items
    .map((i) => {
      const p = getProducto(i.id);
      if (!p) return "";
      const precio = precioFinal(p);
      return `
    <div class="cart-line" data-line="${p.id}">
      ${p.imagen ? `<img src="images/${p.imagen}" alt="${esc(p.nombre)}" width="68" height="68">` : `<div class="cart-line-noimg" style="width:68px;height:68px;border-radius:3px;background:${p.categoria === "mascota" ? "#FBEFFB" : "#EAF6EE"};flex-shrink:0"></div>`}
      <div class="cart-line__info">
        <p>${esc(p.nombre)}</p>
        <p class="cart-line__price">${formatearPrecio(precio)} c/u</p>
        <div class="cart-line__row">
          <div class="stepper" data-cart-stepper="${p.id}">
            <button type="button" data-cart-step="-1" aria-label="Restar">–</button>
            <span data-qty>${i.qty}</span>
            <button type="button" data-cart-step="1" aria-label="Sumar">+</button>
          </div>
          <button type="button" class="cart-line__remove" data-cart-remove="${p.id}">Quitar</button>
        </div>
      </div>
    </div>`;
    })
    .join("");

  body.querySelectorAll("[data-cart-stepper]").forEach((st) => {
    const id = Number(st.dataset.cartStepper);
    const span = st.querySelector("[data-qty]");
    st.querySelectorAll("[data-cart-step]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const v =
          (parseInt(span.textContent, 10) || 1) + Number(btn.dataset.cartStep);
        if (v < 1) {
          Cart.remove(id);
        } else {
          Cart.setQty(id, v);
        }
      });
    });
  });
  body
    .querySelectorAll("[data-cart-remove]")
    .forEach((btn) =>
      btn.addEventListener("click", () =>
        Cart.remove(Number(btn.dataset.cartRemove)),
      ),
    );

  const totalEl = document.getElementById("cartTotal");
  if (totalEl) totalEl.textContent = formatearPrecio(Cart.total());
}
document.addEventListener("cart:updated", renderCartDrawer);

function openCartDrawer() {
  const drawer = document.getElementById("cartDrawer");
  const bd = document.getElementById("cartBackdrop");
  if (!drawer) return;
  renderCartDrawer();
  drawer.classList.add("open");
  bd?.classList.add("open");
  document.body.classList.add("no-scroll");
  drawer.querySelector(".cart-close")?.focus();
}
function closeCartDrawer() {
  const drawer = document.getElementById("cartDrawer");
  const bd = document.getElementById("cartBackdrop");
  drawer?.classList.remove("open");
  bd?.classList.remove("open");
  document.body.classList.remove("no-scroll");
}
function initCartDrawer() {
  document
    .getElementById("cart-icon-btn")
    ?.addEventListener("click", openCartDrawer);
  document
    .getElementById("cartClose")
    ?.addEventListener("click", closeCartDrawer);
  document
    .getElementById("cartBackdrop")
    ?.addEventListener("click", closeCartDrawer);
  document.addEventListener("keydown", (e) => {
    if (
      e.key === "Escape" &&
      document.getElementById("cartDrawer")?.classList.contains("open")
    )
      closeCartDrawer();
  });
  document.getElementById("cartCheckout")?.addEventListener("click", () => {
    showToast(
      "¡Genial! El pago online se activa al pasar la web a producción.",
    );
  });
  renderCartDrawer();
}

/* ===================================================================
   Vista rápida (quick view)
   =================================================================== */
function openQuickView(id) {
  const p = getProducto(id);
  if (!p) return;
  const bd = document.getElementById("quickviewBackdrop");
  const box = document.getElementById("quickview");
  if (!bd || !box) return;
  const precio = precioFinal(p);
  const tieneDesc = p.descuento > 0;
  const relacionados = PRODUCTOS.filter(
    (x) => x.subcategoria === p.subcategoria && x.id !== p.id,
  ).slice(0, 3);
  box.innerHTML = `
    <button type="button" class="quickview-close" id="quickviewClose" aria-label="Cerrar">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
    </button>
    <div class="quickview-media">${mediaProducto(p)}</div>
    <div class="quickview-body">
      <p class="prod-card__cat">${esc(nombreSubcat(p.subcategoria))}</p>
      <h2>${esc(p.nombre)}</h2>
      <div class="prod-card__price"><strong>${formatearPrecio(precio)}</strong>${tieneDesc ? `<s>${formatearPrecio(p.precio)}</s>` : ""}</div>
      <p class="quickview-desc">${esc(p.descripcion)}</p>
      <div class="prod-actions">
        <div class="stepper" data-stepper="${p.id}">
          <button type="button" data-step="-1" aria-label="Restar cantidad">–</button>
          <span data-qty>1</span>
          <button type="button" data-step="1" aria-label="Sumar cantidad">+</button>
        </div>
      </div>
      <div class="quickview-actions">
        <button type="button" class="btn btn-outline" data-add="${p.id}">Agregar al carrito</button>
        <button type="button" class="btn btn-cta" data-buy="${p.id}">Comprar ahora</button>
      </div>
      ${
        relacionados.length
          ? `
      <div class="quickview-relacionados">
        <h3>También te puede interesar</h3>
        <div class="quickview-relacionados-grid">${relacionados.map((r) => renderProductCard(r, { compact: true })).join("")}</div>
      </div>`
          : ""
      }
    </div>`;
  wireProductCards(box);
  box.querySelector("[data-buy]")?.addEventListener("click", closeQuickView);
  document
    .getElementById("quickviewClose")
    ?.addEventListener("click", closeQuickView);
  bd.classList.add("open");
  document.body.classList.add("no-scroll");
}
function closeQuickView() {
  document.getElementById("quickviewBackdrop")?.classList.remove("open");
  if (
    !document.getElementById("cartDrawer")?.classList.contains("open") &&
    !document.getElementById("mainNav")?.classList.contains("open") &&
    !document.getElementById("filtrosPanel")?.classList.contains("open")
  ) {
    document.body.classList.remove("no-scroll");
  }
}
function initQuickView() {
  document
    .getElementById("quickviewBackdrop")
    ?.addEventListener("click", (e) => {
      if (e.target.id === "quickviewBackdrop") closeQuickView();
    });
  document.addEventListener("keydown", (e) => {
    if (
      e.key === "Escape" &&
      document.getElementById("quickviewBackdrop")?.classList.contains("open")
    )
      closeQuickView();
  });
}

/* ===================================================================
   Init
   =================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  initCatalogo();
  initMosaico();
  initRail("destacados", [4, 13, 6, 17, 9, 19, 5, 14]);
  initRail("lo-nuevo", [4, 15, 10, 7, 13, 18, 9, 6]);
  initVidriera("vidrieraB");
  initVidriera("vidrieraC");
  initEnvioCalc();
  initReveals();
  marcarRevealsListos();
  initNav();
  initFloats();
  initCartDrawer();
  initQuickView();
  updateCartBadge();
});
