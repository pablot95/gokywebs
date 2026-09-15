const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;
const WHATSAPP_NUMBER = "5492665030608";

if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}
if (typeof gsap === "undefined") {
  document.querySelectorAll("[data-animate]").forEach((el) => {
    el.style.opacity = 1;
    el.style.transform = "none";
  });
}
if (typeof ScrollTrigger !== "undefined") {
  window.addEventListener("load", () => ScrollTrigger.refresh());
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
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

const esc = (s) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
const formatearPrecio = (n) => "$" + Math.round(n).toLocaleString("es-AR");
const normalizar = (s) =>
  String(s ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

const PRODUCTOS = [
  {
    id: "campera-inflable-azul",
    nombre: "Campera Inflable Unisex",
    categoria: "Camperas",
    precio: 54900,
    descuento: 0,
    varianteLabel: "Talle",
    imagen: "images/camperas-inflables-colores.webp",
    imagenWidth: 1194,
    imagenHeight: 774,
    imagenClase: "imagen-contain",
    descripcion:
      "Campera inflable liviana con cuello alto, cierre frontal y bolsillos laterales. Disponible en azul marino, negro y verde oliva; consultanos el color al confirmar.",
    variantes: [
      { id: "campera-inflable-azul-s", valor: "S", stock: 5 },
      { id: "campera-inflable-azul-m", valor: "M", stock: 9 },
      { id: "campera-inflable-azul-l", valor: "L", stock: 7 },
      { id: "campera-inflable-azul-xl", valor: "XL", stock: 3 },
    ],
    tags: ["campera", "inflable", "azul", "negro", "verde oliva", "abrigo"],
  },
  {
    id: "conjunto-pro-azul",
    nombre: "Conjunto Pro Azul",
    categoria: "Conjuntos Deportivos",
    precio: 42900,
    descuento: 0,
    varianteLabel: "Talle",
    imagen: "images/buzo-deportivo-azul_1x1.webp",
    descripcion:
      "Conjunto deportivo de acetato azul, negro y blanco. Campera con cierre y pantalón a juego, ideales para entrenar o para la vida diaria.",
    variantes: [
      { id: "conjunto-pro-azul-s", valor: "S", stock: 6 },
      { id: "conjunto-pro-azul-m", valor: "M", stock: 8 },
      { id: "conjunto-pro-azul-l", valor: "L", stock: 5 },
      { id: "conjunto-pro-azul-xl", valor: "XL", stock: 0 },
    ],
    tags: ["conjunto", "azul", "acetato", "entrenamiento"],
  },
  {
    id: "conjunto-elite-negro",
    nombre: "Conjunto Elite Negro",
    categoria: "Conjuntos Deportivos",
    precio: 39900,
    descuento: 10,
    varianteLabel: "Talle",
    imagen: "images/conjunto-deportivo-negro_1x1.webp",
    descripcion:
      "Conjunto de frizza negro con detalle de rayas blancas. Campera y pantalón de corte clásico, cómodo para entrenar o para el día a día.",
    variantes: [
      { id: "conjunto-elite-negro-s", valor: "S", stock: 7 },
      { id: "conjunto-elite-negro-m", valor: "M", stock: 10 },
      { id: "conjunto-elite-negro-l", valor: "L", stock: 6 },
      { id: "conjunto-elite-negro-xl", valor: "XL", stock: 4 },
    ],
    tags: ["conjunto", "negro", "frizza", "entrenamiento"],
  },
  {
    id: "pantalon-deportivo-negro",
    nombre: "Pantalón Deportivo Negro",
    categoria: "Pantalones",
    precio: 22900,
    descuento: 0,
    varianteLabel: "Talle",
    imagen: "images/pantalon-deportivo-negro_1x1.webp",
    descripcion:
      "Pantalón deportivo negro de frizza con puño en el tobillo y detalle de raya lateral. Se combina con cualquier campera del catálogo.",
    variantes: [
      { id: "pantalon-deportivo-negro-s", valor: "S", stock: 8 },
      { id: "pantalon-deportivo-negro-m", valor: "M", stock: 11 },
      { id: "pantalon-deportivo-negro-l", valor: "L", stock: 9 },
      { id: "pantalon-deportivo-negro-xl", valor: "XL", stock: 5 },
    ],
    tags: ["pantalon", "negro", "frizza"],
  },
  {
    id: "pecheras-entrenamiento",
    nombre: "Pechera Lisa de Microfibra",
    categoria: "Pecheras",
    precio: 7600,
    descuento: 0,
    varianteLabel: "Color",
    imagen: "images/pecheras-microfibra-colores.webp",
    imagenWidth: 1200,
    imagenHeight: 572,
    imagenClase: "imagen-contain",
    descripcion:
      "Pechera lisa de microfibra premium: liviana, resistente, transpirable y de secado rápido. Se vende por unidad.",
    variantes: [
      { id: "pecheras-entrenamiento-negro", valor: "Negro", stock: 18 },
      { id: "pecheras-entrenamiento-azul", valor: "Azul", stock: 22 },
      { id: "pecheras-entrenamiento-verde", valor: "Verde", stock: 20 },
      { id: "pecheras-entrenamiento-naranja", valor: "Naranja", stock: 18 },
      { id: "pecheras-entrenamiento-rojo", valor: "Rojo", stock: 20 },
      { id: "pecheras-entrenamiento-blanco", valor: "Blanco", stock: 16 },
    ],
    tags: ["pechera", "microfibra", "entrenamiento", "equipo", "colores"],
  },
  {
    id: "pack-pecheras-lisas",
    nombre: "Pack x10 Pecheras Lisas",
    categoria: "Pecheras",
    precio: 40000,
    descuento: 0,
    varianteLabel: "Combinación",
    imagen: "images/pecheras-microfibra-colores.webp",
    imagenWidth: 1200,
    imagenHeight: 572,
    imagenClase: "imagen-contain",
    descripcion:
      "Pack de 10 pecheras lisas de microfibra premium. Elegí un solo color o armá una combinación para tu equipo.",
    variantes: [
      { id: "pack-lisas-un-color", valor: "Un color", stock: 12 },
      { id: "pack-lisas-surtidas", valor: "Colores surtidos", stock: 12 },
    ],
    tags: ["pack", "pecheras", "lisas", "equipo", "microfibra"],
  },
  {
    id: "pecheras-numeradas",
    nombre: "Pack x10 Pecheras Numeradas",
    categoria: "Pecheras",
    precio: 50000,
    descuento: 0,
    varianteLabel: "Combinación",
    imagen: "images/modelos-pecheras-base-textil.webp",
    imagenWidth: 786,
    imagenHeight: 1360,
    imagenClase: "imagen-contain",
    descripcion:
      "Pack de 10 pecheras con numeración, ideal para entrenamientos, clubes y competencias. Coordinamos números y colores al confirmar.",
    variantes: [
      { id: "pecheras-numeradas-un-color", valor: "Un color", stock: 10 },
      { id: "pecheras-numeradas-surtidas", valor: "Colores surtidos", stock: 10 },
    ],
    tags: ["pack", "pechera", "numerada", "equipo", "entrenamiento"],
  },
];

const getProducto = (id) => PRODUCTOS.find((p) => p.id === id);
const getVariante = (producto, varianteId) =>
  producto?.variantes.find((v) => v.id === varianteId);
const precioFinal = (p) =>
  p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const varianteDisponible = (p) => p.variantes.find((v) => v.stock > 0);

const Cart = {
  KEY: "basetextil_cart",
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
  add(id, varianteId, qty = 1) {
    const producto = getProducto(id);
    const variante = getVariante(producto, varianteId);
    if (!producto || !variante) return;
    const items = this.get();
    const existing = items.find(
      (i) => i.id === id && i.varianteId === varianteId,
    );
    if (existing) existing.qty = Math.min(existing.qty + qty, variante.stock);
    else items.push({ id, varianteId, qty: Math.min(qty, variante.stock) });
    this.save(items);
  },
  setQty(id, varianteId, qty) {
    const items = this.get();
    const it = items.find((i) => i.id === id && i.varianteId === varianteId);
    if (!it) return;
    const producto = getProducto(id);
    const variante = getVariante(producto, varianteId);
    it.qty = Math.max(1, Math.min(qty, variante?.stock ?? 99));
    this.save(items);
  },
  remove(id, varianteId) {
    this.save(
      this.get().filter((i) => !(i.id === id && i.varianteId === varianteId)),
    );
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

function showToast(msg) {
  let wrap = document.querySelector(".toast-wrap");
  if (!wrap) {
    wrap = document.createElement("div");
    wrap.className = "toast-wrap";
    wrap.style.cssText =
      "position:fixed;bottom:24px;left:50%;transform:translateX(-50%);z-index:200;display:flex;flex-direction:column;gap:.5rem;align-items:center";
    wrap.setAttribute("aria-live", "polite");
    document.body.appendChild(wrap);
  }
  const toast = document.createElement("div");
  toast.setAttribute("role", "status");
  toast.style.cssText =
    "display:flex;align-items:center;gap:.6rem;background:#0f1e2e;color:#fff;padding:.85rem 1.3rem;border-radius:999px;box-shadow:0 26px 60px rgb(15 30 46 / .25);font:600 .92rem/1 Sora,sans-serif;opacity:0;transform:translateY(10px);transition:opacity .3s,transform .3s";
  toast.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#ffd700" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg><span>${esc(msg)}</span>`;
  wrap.appendChild(toast);
  requestAnimationFrame(() => {
    toast.style.opacity = "1";
    toast.style.transform = "none";
  });
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
    setTimeout(() => toast.remove(), 220);
  }, 3200);
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

let revealsListos = false;
function revelarNuevos(cont) {
  if (!revealsListos) return;
  cont.querySelectorAll("[data-animate]:not(.in)").forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i * 0.06, 0.4)}s`;
    requestAnimationFrame(() => el.classList.add("in"));
  });
}

const state = { cat: "todas", precio: "todos", query: "" };

function productoCardHtml(p) {
  const variante = varianteDisponible(p);
  const final = precioFinal(p);
  const badge =
    p.descuento > 0
      ? `<span class="producto-badge">-${p.descuento}%</span>`
      : "";
  return `
  <article class="producto-card" data-animate style="transform:translateY(20px);opacity:0">
    <div class="producto-media" data-open-product="${p.id}">
      ${badge}
      <img class="${p.imagenClase || ""}" src="${p.imagen}" width="${p.imagenWidth || 1200}" height="${p.imagenHeight || 1200}" alt="${esc(p.nombre)}" loading="lazy">
    </div>
    <div class="producto-info">
      <p class="producto-cat">${esc(p.categoria)}</p>
      <p class="producto-nombre" data-open-product="${p.id}">${esc(p.nombre)}</p>
      <div class="producto-precios">
        <span class="producto-precio">${formatearPrecio(final)}</span>
        ${p.descuento > 0 ? `<span class="producto-precio-tachado">${formatearPrecio(p.precio)}</span>` : ""}
      </div>
      <div class="producto-acciones">
        <div class="stepper" data-stepper="${p.id}">
          <button type="button" data-step="-1" aria-label="Restar cantidad">−</button>
          <span data-qty="1">1</span>
          <button type="button" data-step="1" aria-label="Sumar cantidad">+</button>
        </div>
        <button type="button" class="btn-agregar" data-quick-add="${p.id}" ${!variante ? "disabled" : ""}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>
          ${variante ? "Agregar" : "Sin stock"}
        </button>
      </div>
    </div>
  </article>`;
}

function filtrarProductos() {
  const q = normalizar(state.query);
  return PRODUCTOS.filter((p) => {
    if (state.cat !== "todas" && p.categoria !== state.cat) return false;
    if (state.precio !== "todos") {
      const [min, max] = state.precio.split("-").map(Number);
      const final = precioFinal(p);
      if (final < min || final > max) return false;
    }
    if (q) {
      const haystack = normalizar([p.nombre, p.categoria, ...p.tags].join(" "));
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}

function setCategoria(cat) {
  state.cat = cat;
  document
    .querySelectorAll("[data-filter-cat]")
    .forEach((b) =>
      b.classList.toggle("is-active", b.dataset.filterCat === cat),
    );
  renderCatalogo();
}

function renderCatalogo() {
  const grid = document.getElementById("catalogoGrid");
  const vacio = document.getElementById("catalogoVacio");
  const contador = document.getElementById("catalogoContador");
  if (!grid) return;
  const resultado = filtrarProductos();
  contador.textContent =
    resultado.length === 1 ? "1 producto" : `${resultado.length} productos`;
  grid.innerHTML = resultado.map(productoCardHtml).join("");
  vacio.hidden = resultado.length > 0;
  grid.hidden = resultado.length === 0;
  revelarNuevos(grid);
  if (typeof ScrollTrigger !== "undefined")
    requestAnimationFrame(() => ScrollTrigger.refresh());
}

function initCatalogo() {
  const grid = document.getElementById("catalogoGrid");
  const buscador = document.getElementById("buscador-input");
  const limpiar = document.getElementById("limpiarFiltros");
  if (!grid) return;

  document.querySelectorAll("[data-filter-cat]").forEach((btn) => {
    btn.addEventListener("click", () => setCategoria(btn.dataset.filterCat));
  });
  document.querySelectorAll("[data-filter-precio]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.precio = btn.dataset.filterPrecio;
      document
        .querySelectorAll("[data-filter-precio]")
        .forEach((b) => b.classList.toggle("is-active", b === btn));
      renderCatalogo();
    });
  });
  buscador?.addEventListener("input", () => {
    state.query = buscador.value;
    renderCatalogo();
  });
  limpiar?.addEventListener("click", () => {
    state.cat = "todas";
    state.precio = "todos";
    state.query = "";
    if (buscador) buscador.value = "";
    document
      .querySelectorAll("[data-filter-cat]")
      .forEach((b) =>
        b.classList.toggle("is-active", b.dataset.filterCat === "todas"),
      );
    document
      .querySelectorAll("[data-filter-precio]")
      .forEach((b) =>
        b.classList.toggle("is-active", b.dataset.filterPrecio === "todos"),
      );
    renderCatalogo();
  });

  grid.addEventListener("click", (e) => {
    const stepBtn = e.target.closest("[data-step]");
    if (stepBtn) {
      const wrap = stepBtn.closest("[data-stepper]");
      const span = wrap.querySelector("[data-qty]");
      const next = Math.max(
        1,
        Math.min(
          99,
          parseInt(span.textContent, 10) + Number(stepBtn.dataset.step),
        ),
      );
      span.textContent = next;
      return;
    }
    const addBtn = e.target.closest("[data-quick-add]");
    if (addBtn) {
      const id = addBtn.dataset.quickAdd;
      const producto = getProducto(id);
      const variante = varianteDisponible(producto);
      if (!producto || !variante) return;
      const wrap = addBtn
        .closest(".producto-card")
        .querySelector("[data-stepper]");
      const qty =
        parseInt(wrap.querySelector("[data-qty]").textContent, 10) || 1;
      Cart.add(id, variante.id, qty);
      showToast(`¡Agregado! ${producto.nombre} en tu carrito`);
      return;
    }
    const openBtn = e.target.closest("[data-open-product]");
    if (openBtn) openQuickview(openBtn.dataset.openProduct);
  });

  document.querySelectorAll("[data-goto-cat]").forEach((btn) => {
    btn.addEventListener("click", () => {
      setCategoria(btn.dataset.gotoCat);
      document
        .getElementById("catalogo")
        ?.scrollIntoView({ behavior: "auto", block: "start" });
    });
  });

  renderCatalogo();
}

let qvProducto = null;
let qvVarianteId = null;

function quickviewHtml(p) {
  const final = precioFinal(p);
  const opciones = `
    <div class="qv-talles">
      ${p.variantes.map((v) => `<button type="button" class="qv-talle" data-talle="${v.id}" ${v.stock === 0 ? "disabled" : ""}>${esc(v.valor)}</button>`).join("")}
    </div>`;
  const relacionados = PRODUCTOS.filter(
    (x) => x.categoria === p.categoria && x.id !== p.id,
  ).slice(0, 3);
  const relacionadosHtml = relacionados.length
    ? `
    <div class="qv-relacionados">
      <h4>También te puede interesar</h4>
      <div class="qv-relacionados-grid">
        ${relacionados.map((r) => `<div class="qv-rel-card" data-open-product="${r.id}"><img class="${r.imagenClase || ""}" src="${r.imagen}" width="${r.imagenWidth || 200}" height="${r.imagenHeight || 200}" alt="${esc(r.nombre)}" loading="lazy"><p>${esc(r.nombre)}</p></div>`).join("")}
      </div>
    </div>`
    : "";
  return `
  <div class="qv-media"><img class="${p.imagenClase || ""}" src="${p.imagen}" width="${p.imagenWidth || 1200}" height="${p.imagenHeight || 1200}" alt="${esc(p.nombre)}"></div>
  <div class="qv-info">
    <p class="qv-cat">${esc(p.categoria)}</p>
    <h3>${esc(p.nombre)}</h3>
    <div class="qv-precios">
      <span class="qv-precio">${formatearPrecio(final)}</span>
      ${p.descuento > 0 ? `<span class="qv-precio-tachado">${formatearPrecio(p.precio)}</span>` : ""}
    </div>
    <p class="qv-desc">${esc(p.descripcion)}</p>
    <p class="qv-cat" style="margin-top:.6rem">${esc(p.varianteLabel)}</p>
    ${opciones}
    <div class="stepper" data-stepper="qv">
      <button type="button" data-step="-1" aria-label="Restar cantidad">−</button>
      <span data-qty="1">1</span>
      <button type="button" data-step="1" aria-label="Sumar cantidad">+</button>
    </div>
    <div class="qv-actions">
      <button type="button" class="btn btn-ghost" id="qvAgregar">Agregar al carrito</button>
      <button type="button" class="btn btn-cta" id="qvComprar">Comprar ahora</button>
    </div>
    ${relacionadosHtml}
  </div>`;
}

function openQuickview(id) {
  const producto = getProducto(id);
  if (!producto) return;
  qvProducto = producto;
  qvVarianteId = varianteDisponible(producto)?.id ?? null;
  const body = document.getElementById("quickviewBody");
  body.innerHTML = quickviewHtml(producto);
  body.querySelectorAll(".qv-talle").forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.talle === qvVarianteId);
    btn.addEventListener("click", () => {
      qvVarianteId = btn.dataset.talle;
      body
        .querySelectorAll(".qv-talle")
        .forEach((b) => b.classList.toggle("is-active", b === btn));
    });
  });
  body.querySelectorAll("[data-open-product]").forEach((card) => {
    card.addEventListener("click", () =>
      openQuickview(card.dataset.openProduct),
    );
  });
  const stepper = body.querySelector('[data-stepper="qv"]');
  stepper.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-step]");
    if (!btn) return;
    const span = stepper.querySelector("[data-qty]");
    span.textContent = Math.max(
      1,
      Math.min(99, parseInt(span.textContent, 10) + Number(btn.dataset.step)),
    );
  });
  const qty = () =>
    parseInt(stepper.querySelector("[data-qty]").textContent, 10) || 1;
  body.querySelector("#qvAgregar").addEventListener("click", () => {
    if (!qvVarianteId) {
      showToast(
        `Elegí ${qvProducto.varianteLabel.toLowerCase()} antes de agregar`,
      );
      return;
    }
    Cart.add(qvProducto.id, qvVarianteId, qty());
    showToast(`¡Agregado! ${qvProducto.nombre} en tu carrito`);
  });
  body.querySelector("#qvComprar").addEventListener("click", () => {
    if (!qvVarianteId) {
      showToast(
        `Elegí ${qvProducto.varianteLabel.toLowerCase()} antes de continuar`,
      );
      return;
    }
    Cart.add(qvProducto.id, qvVarianteId, qty());
    closeQuickview();
    openDrawer();
  });

  const modal = document.getElementById("quickview");
  const backdrop = document.getElementById("modalBackdrop");
  modal.classList.add("open");
  backdrop.classList.add("open");
  modal.removeAttribute("inert");
  document.body.classList.add("no-scroll", "quickview-open");
  document.getElementById("quickviewClose")?.focus();
}

function closeQuickview() {
  const modal = document.getElementById("quickview");
  const backdrop = document.getElementById("modalBackdrop");
  modal.classList.remove("open");
  backdrop.classList.remove("open");
  modal.setAttribute("inert", "");
  document.body.classList.remove("no-scroll", "quickview-open");
}

function initQuickview() {
  document
    .getElementById("quickviewClose")
    ?.addEventListener("click", closeQuickview);
  document
    .getElementById("modalBackdrop")
    ?.addEventListener("click", closeQuickview);
  document.addEventListener("keydown", (e) => {
    if (
      e.key === "Escape" &&
      document.getElementById("quickview").classList.contains("open")
    )
      closeQuickview();
  });
}

function drawerItemHtml(item) {
  const producto = getProducto(item.id);
  if (!producto) return "";
  const variante = getVariante(producto, item.varianteId);
  const final = precioFinal(producto);
  return `
  <div class="drawer-item">
    <img src="${producto.imagen}" width="68" height="68" alt="${esc(producto.nombre)}">
    <div class="drawer-item-info">
      <h4>${esc(producto.nombre)}</h4>
      ${variante ? `<p class="drawer-item-talle">${esc(producto.varianteLabel)}: ${esc(variante.valor)}</p>` : ""}
      <div class="drawer-item-row">
        <div class="stepper" data-drawer-stepper="${item.id}|${item.varianteId}">
          <button type="button" data-step="-1" aria-label="Restar cantidad">−</button>
          <span data-qty>${item.qty}</span>
          <button type="button" data-step="1" aria-label="Sumar cantidad">+</button>
        </div>
        <span class="drawer-item-precio">${formatearPrecio(final * item.qty)}</span>
      </div>
      <button type="button" class="drawer-item-remove" data-drawer-remove="${item.id}|${item.varianteId}">Quitar</button>
    </div>
  </div>`;
}

function buildWhatsappPedido() {
  const items = Cart.get();
  if (!items.length)
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hola Base Textil, quiero consultar por la tienda.")}`;
  const lines = ["Hola Base Textil, quiero hacer este pedido:", ""];
  items.forEach((item) => {
    const producto = getProducto(item.id);
    if (!producto) return;
    const variante = getVariante(producto, item.varianteId);
    const opcion = variante
      ? ` (${producto.varianteLabel} ${variante.valor})`
      : "";
    lines.push(
      `${item.qty}x ${producto.nombre}${opcion} — ${formatearPrecio(precioFinal(producto) * item.qty)}`,
    );
  });
  lines.push("", `Total: ${formatearPrecio(Cart.total())}`);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
}

function renderDrawer() {
  const body = document.getElementById("drawerBody");
  const footer = document.getElementById("drawerFooter");
  const totalEl = document.getElementById("drawerTotal");
  const items = Cart.get();
  if (!items.length) {
    body.innerHTML = `
      <div class="drawer-empty">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5"/><circle cx="17.5" cy="20" r="1.5"/></svg>
        <p>Tu carrito está vacío — todavía no elegiste nada.</p>
        <a class="btn btn-cta" href="#catalogo" data-drawer-cta>Ver el catálogo</a>
      </div>`;
    footer.hidden = true;
    return;
  }
  footer.hidden = false;
  body.innerHTML = items.map(drawerItemHtml).join("");
  totalEl.textContent = formatearPrecio(Cart.total());
  document.getElementById("wspPedido").href = buildWhatsappPedido();
}
document.addEventListener("cart:updated", renderDrawer);

function openDrawer() {
  renderDrawer();
  const drawer = document.getElementById("cartDrawer");
  const backdrop = document.getElementById("drawerBackdrop");
  drawer.classList.add("open");
  backdrop.classList.add("open");
  drawer.removeAttribute("inert");
  document.body.classList.add("no-scroll", "drawer-open");
  document.getElementById("drawerClose")?.focus();
}
function closeDrawer() {
  const drawer = document.getElementById("cartDrawer");
  const backdrop = document.getElementById("drawerBackdrop");
  drawer.classList.remove("open");
  backdrop.classList.remove("open");
  drawer.setAttribute("inert", "");
  document.body.classList.remove("no-scroll", "drawer-open");
}

function initDrawer() {
  document.getElementById("cart-btn")?.addEventListener("click", openDrawer);
  document.getElementById("cart-float")?.addEventListener("click", openDrawer);
  document
    .getElementById("drawerClose")
    ?.addEventListener("click", closeDrawer);
  document
    .getElementById("drawerBackdrop")
    ?.addEventListener("click", closeDrawer);
  document.addEventListener("keydown", (e) => {
    if (
      e.key === "Escape" &&
      document.getElementById("cartDrawer").classList.contains("open")
    )
      closeDrawer();
  });
  document.getElementById("drawerBody")?.addEventListener("click", (e) => {
    const stepBtn = e.target.closest("[data-step]");
    if (stepBtn) {
      const wrap = stepBtn.closest("[data-drawer-stepper]");
      const [id, varianteId] = wrap.dataset.drawerStepper.split("|");
      const span = wrap.querySelector("[data-qty]");
      const next =
        parseInt(span.textContent, 10) + Number(stepBtn.dataset.step);
      if (next < 1) return;
      Cart.setQty(id, varianteId === "null" ? null : varianteId, next);
      return;
    }
    const removeBtn = e.target.closest("[data-drawer-remove]");
    if (removeBtn) {
      const [id, varianteId] = removeBtn.dataset.drawerRemove.split("|");
      Cart.remove(id, varianteId === "null" ? null : varianteId);
      return;
    }
    if (e.target.closest("[data-drawer-cta]")) closeDrawer();
  });
  document.getElementById("finalizarCompra")?.addEventListener("click", () => {
    showToast(
      "¡Genial! El pago online se activa al pasar la web a producción.",
    );
  });
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
    document.body.appendChild(bd);
  }
  const close = () => {
    nav.classList.remove("open");
    bd.classList.remove("open");
    nav.setAttribute("inert", "");
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
  nav.querySelectorAll("a[data-nav-cat]").forEach((a) => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      setCategoria(a.dataset.navCat);
      close();
      document
        .getElementById("catalogo")
        ?.scrollIntoView({ behavior: "auto", block: "start" });
    });
  });
  nav
    .querySelectorAll("a:not([data-nav-cat])")
    .forEach((a) => a.addEventListener("click", close));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("open")) {
      close();
      toggle.focus();
    }
  });
}

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
  sync();
}

function initArco() {
  const stage = document.getElementById("arcoStage");
  const track = document.getElementById("arcoTrack");
  const checkpoints = track
    ? Array.from(track.querySelectorAll(".checkpoint"))
    : [];
  const fill = document.getElementById("arcoFill");
  if (!stage || !track || !checkpoints.length) return;

  const pathLength = fill?.getTotalLength ? fill.getTotalLength() : 1360;
  if (fill) {
    fill.style.strokeDasharray = String(pathLength);
    fill.style.strokeDashoffset = String(pathLength);
  }

  const setProgress = (progress) => {
    const clamped = Math.max(0, Math.min(1, progress));
    if (fill) fill.style.strokeDashoffset = String(pathLength * (1 - clamped));
    const litCount = Math.min(
      checkpoints.length,
      Math.floor(clamped * checkpoints.length + 0.0001),
    );
    checkpoints.forEach((cp, i) => cp.classList.toggle("is-on", i < litCount));
  };

  if (
    reduceMotion ||
    typeof gsap === "undefined" ||
    typeof ScrollTrigger === "undefined"
  ) {
    setProgress(1);
    return;
  }

  setProgress(0);

  const mm = gsap.matchMedia();

  mm.add("(min-width: 861px)", () => {
    const st = ScrollTrigger.create({
      trigger: stage,
      start: "top top",
      end: "+=240%",
      pin: true,
      scrub: 0.6,
      onUpdate: (self) => setProgress(self.progress),
    });
    return () => st.kill();
  });

  mm.add("(max-width: 860px)", () => {
    stage.classList.add("is-sticky-mobile");
    requestAnimationFrame(() => ScrollTrigger.refresh());
    const st = ScrollTrigger.create({
      trigger: stage,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.6,
      invalidateOnRefresh: true,
      onUpdate: (self) => setProgress(self.progress),
    });
    return () => {
      stage.classList.remove("is-sticky-mobile");
      st.kill();
    };
  });
}

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
    revealsListos = true;
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
  revealsListos = true;
}

initCatalogo();
initQuickview();
initDrawer();
initNav();
initFloats();
initArco();
initReveals();
updateCartBadge();

const anio = document.getElementById("anioActual");
if (anio) anio.textContent = new Date().getFullYear();
