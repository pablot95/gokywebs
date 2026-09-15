const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;
const WHATSAPP_NUMBER = "5493484549007";

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
    id: "vela-ambar-bosque",
    nombre: "Vela Ámbar Bosque",
    categoria: "Velas",
    precio: 18900,
    descuento: 0,
    varianteLabel: "Aroma",
    imagen: "images/vela-ambar-con-tapa-de-madera_1x1.webp",
    descripcion:
      "Vela de cera de soja en frasco ámbar con tapa de madera. Mecha de algodón y unas 40 horas de encendido. El frasco se puede reusar cuando se termina.",
    variantes: [
      { id: "vela-ambar-bosque-ambar", valor: "Ámbar & Sándalo", stock: 12 },
      { id: "vela-ambar-bosque-vainilla", valor: "Vainilla", stock: 9 },
      { id: "vela-ambar-bosque-cedro", valor: "Cedro", stock: 6 },
    ],
    tags: ["vela", "soja", "ambar", "madera", "frasco"],
  },
  {
    id: "vela-ceramica-acanalada",
    nombre: "Vela Cerámica Acanalada",
    categoria: "Velas",
    precio: 22500,
    descuento: 0,
    varianteLabel: "Aroma",
    imagen: "images/vela-ceramica-acanalada_1x1.webp",
    descripcion:
      "Vela en recipiente de cerámica acanalada color crudo. Cuando se termina la cera, el recipiente queda como macetero o portalápices.",
    variantes: [
      { id: "vela-ceramica-lavanda", valor: "Lavanda", stock: 8 },
      { id: "vela-ceramica-te", valor: "Té Blanco", stock: 10 },
      { id: "vela-ceramica-higo", valor: "Higo", stock: 0 },
    ],
    tags: ["vela", "ceramica", "acanalada", "crudo", "soja"],
  },
  {
    id: "vela-soja-flores",
    nombre: "Vela de Soja con Flores",
    categoria: "Velas",
    precio: 16900,
    descuento: 10,
    varianteLabel: "Aroma",
    imagen: "images/vela-de-soja-con-flores_1x1.webp",
    descripcion:
      "Vela de soja con flores secas embebidas en la cera y mecha de madera que crepita al encenderse. Vaso de vidrio transparente.",
    variantes: [
      { id: "vela-soja-flores-jazmin", valor: "Jazmín", stock: 7 },
      { id: "vela-soja-flores-frutos", valor: "Frutos Rojos", stock: 11 },
    ],
    tags: ["vela", "soja", "flores", "mecha de madera", "vidrio"],
  },
  {
    id: "difusor-varillas",
    nombre: "Difusor de Varillas",
    categoria: "Fragancias",
    precio: 24900,
    descuento: 0,
    varianteLabel: "Aroma",
    imagen: "images/difusor-de-varillas-dorado_1x1.webp",
    descripcion:
      "Difusor de 200 ml con tapa dorada y varillas de rattan. Perfuma de forma constante sin encender nada — ideal para baño y entrada.",
    variantes: [
      { id: "difusor-varillas-eucalipto", valor: "Eucalipto", stock: 9 },
      { id: "difusor-varillas-ambar", valor: "Vainilla & Ámbar", stock: 7 },
      { id: "difusor-varillas-citricos", valor: "Cítricos", stock: 5 },
    ],
    tags: ["difusor", "varillas", "rattan", "dorado", "fragancia"],
  },
  {
    id: "home-spray",
    nombre: "Home Spray Textil",
    categoria: "Fragancias",
    precio: 14500,
    descuento: 0,
    varianteLabel: "Aroma",
    imagen: "images/home-spray-frasco-dorado_1x1.webp",
    descripcion:
      "Home spray de 120 ml en frasco estriado con válvula dorada. Se puede usar sobre cortinas, almohadones y ropa de cama.",
    variantes: [
      { id: "home-spray-lavanda", valor: "Lavanda", stock: 14 },
      { id: "home-spray-algodon", valor: "Algodón", stock: 12 },
      { id: "home-spray-citricos", valor: "Cítricos", stock: 8 },
    ],
    tags: ["home spray", "textil", "frasco", "dorado", "fragancia"],
  },
  {
    id: "set-fragancias",
    nombre: "Set Fragancias Premium",
    categoria: "Fragancias",
    precio: 52900,
    descuento: 0,
    varianteLabel: "Presentación",
    imagen: "images/fragancias-y-difusores-premium_5x3.webp",
    descripcion:
      "El set completo: difusor de varillas, home spray y perfume de ambiente en frascos de vidrio con detalles dorados. Viene listo para regalar.",
    variantes: [
      { id: "set-fragancias-caja", valor: "Caja de regalo", stock: 5 },
    ],
    tags: ["set", "regalo", "difusor", "spray", "premium", "fragancia"],
  },
  {
    id: "jarron-organico",
    nombre: "Jarrón Orgánico",
    categoria: "Decoración",
    precio: 28900,
    descuento: 0,
    varianteLabel: "Color",
    imagen: "images/jarron-decorativo-minimalista_1x1.webp",
    descripcion:
      "Jarrón de cerámica mate con forma orgánica calada. Queda bien solo o con dos ramas secas; no necesita mucho más.",
    variantes: [
      { id: "jarron-organico-arena", valor: "Arena", stock: 6 },
      { id: "jarron-organico-blanco", valor: "Blanco roto", stock: 4 },
    ],
    tags: ["jarron", "ceramica", "deco", "minimalista", "decoracion"],
  },
];

const getProducto = (id) => PRODUCTOS.find((p) => p.id === id);
const getVariante = (producto, varianteId) =>
  producto?.variantes.find((v) => v.id === varianteId);
const precioFinal = (p) =>
  p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const varianteDisponible = (p) => p.variantes.find((v) => v.stock > 0);

const Cart = {
  KEY: "vero_cart",
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
    const variante = getVariante(getProducto(id), varianteId);
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
    'display:flex;align-items:center;gap:.6rem;background:#241f1a;color:#fff;padding:.85rem 1.3rem;box-shadow:0 28px 62px rgb(42 38 34 / .3);font:500 .88rem/1 "Josefin Sans",sans-serif;letter-spacing:.04em;opacity:0;transform:translateY(10px);transition:opacity .3s,transform .3s';
  toast.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#d4af37" stroke-width="2.4"><path d="M20 6L9 17l-5-5"/></svg><span>${esc(msg)}</span>`;
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
  <article class="producto-card" data-animate style="transform:translateY(18px);opacity:0">
    <div class="producto-media" data-open-product="${p.id}">
      ${badge}
      <img src="${p.imagen}" width="1200" height="1200" alt="${esc(p.nombre)}" loading="lazy">
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
      const aromas = p.variantes.map((v) => v.valor).join(" ");
      const haystack = normalizar(
        [p.nombre, p.categoria, aromas, ...p.tags].join(" "),
      );
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
      span.textContent = Math.max(
        1,
        Math.min(
          99,
          parseInt(span.textContent, 10) + Number(stepBtn.dataset.step),
        ),
      );
      return;
    }
    const addBtn = e.target.closest("[data-quick-add]");
    if (addBtn) {
      const producto = getProducto(addBtn.dataset.quickAdd);
      const variante = varianteDisponible(producto);
      if (!producto || !variante) return;
      const wrap = addBtn
        .closest(".producto-card")
        .querySelector("[data-stepper]");
      const qty =
        parseInt(wrap.querySelector("[data-qty]").textContent, 10) || 1;
      Cart.add(producto.id, variante.id, qty);
      showToast(`¡Agregada! ${producto.nombre}`);
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
      <h4>También te puede gustar</h4>
      <div class="qv-relacionados-grid">
        ${relacionados.map((r) => `<div class="qv-rel-card" data-open-product="${r.id}"><img src="${r.imagen}" width="200" height="200" alt="${esc(r.nombre)}" loading="lazy"><p>${esc(r.nombre)}</p></div>`).join("")}
      </div>
    </div>`
    : "";
  return `
  <div class="qv-media"><img src="${p.imagen}" width="1200" height="1200" alt="${esc(p.nombre)}"></div>
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
      <button type="button" class="btn btn-ghost" id="qvAgregar">Agregar</button>
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
    showToast(`¡Agregada! ${qvProducto.nombre}`);
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
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hola VERO, quiero consultar por la tienda.")}`;
  const lines = ["Hola VERO, quiero hacer este pedido:", ""];
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
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5"/><circle cx="17.5" cy="20" r="1.5"/></svg>
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
      const next =
        parseInt(wrap.querySelector("[data-qty]").textContent, 10) +
        Number(stepBtn.dataset.step);
      if (next < 1) return;
      Cart.setQty(id, varianteId, next);
      return;
    }
    const removeBtn = e.target.closest("[data-drawer-remove]");
    if (removeBtn) {
      const [id, varianteId] = removeBtn.dataset.drawerRemove.split("|");
      Cart.remove(id, varianteId);
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

  const mobileQuery = window.matchMedia("(max-width: 900px)");
  const syncInert = () => {
    if (mobileQuery.matches && !nav.classList.contains("open"))
      nav.setAttribute("inert", "");
    else nav.removeAttribute("inert");
  };

  const close = () => {
    nav.classList.remove("open");
    bd.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("no-scroll");
    syncInert();
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

  syncInert();
  mobileQuery.addEventListener("change", syncInert);
  window.addEventListener("load", syncInert);
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

function initEncender() {
  const stage = document.getElementById("encenderStage");
  const foto = document.getElementById("escenaFoto");
  const halo = document.getElementById("escenaHalo");
  const tags = stage ? Array.from(stage.querySelectorAll(".escena-tag")) : [];
  const pasos = stage
    ? Array.from(stage.querySelectorAll(".encender-pasos li"))
    : [];
  if (!stage || !foto || !halo || !pasos.length) return;

  const BRILLO_MIN = 0.3;
  const BRILLO_MAX = 1;
  const SAT_MIN = 0.55;
  const SAT_MAX = 1.05;
  const suavizar = (t) => 1 - Math.pow(1 - t, 2.2);

  const setProgress = (progress) => {
    const p = Math.max(0, Math.min(1, progress));
    const luz = suavizar(p);
    foto.style.filter = `brightness(${(BRILLO_MIN + (BRILLO_MAX - BRILLO_MIN) * luz).toFixed(3)}) saturate(${(SAT_MIN + (SAT_MAX - SAT_MIN) * luz).toFixed(3)})`;
    halo.style.opacity = (
      Math.max(0, Math.min(1, (p - 0.08) / 0.5)) * 0.95
    ).toFixed(3);

    const encendidas = Math.min(
      tags.length,
      Math.floor(p * (tags.length + 0.6)),
    );
    tags.forEach((tag, i) => tag.classList.toggle("is-on", i < encendidas));

    const activo = Math.min(
      pasos.length - 1,
      Math.floor(p * pasos.length + 0.0001),
    );
    pasos.forEach((paso, i) => paso.classList.toggle("is-on", i === activo));
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

  mm.add("(min-width: 901px)", () => {
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

  mm.add("(max-width: 900px)", () => {
    stage.classList.add("is-static-mobile");
    setProgress(1);
    return () => {
      stage.classList.remove("is-static-mobile");
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
initEncender();
initReveals();
updateCartBadge();

const anio = document.getElementById("anioActual");
if (anio) anio.textContent = new Date().getFullYear();
