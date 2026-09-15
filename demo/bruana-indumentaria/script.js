const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;
const WHATSAPP_NUMBER = "5491170505656";

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
    id: "blusa-valentina",
    nombre: "Blusa Valentina",
    categoria: "Blusas y Tops",
    precio: 19900,
    descuento: 0,
    imagen: "images/blusa-blanca_1x1.webp",
    descripcion:
      "Blusa de gasa blanca con nudo delantero y mangas globo. Combina con jean o pollera, de día o de noche.",
    variantes: [
      { id: "blusa-valentina-s", talle: "S", stock: 8 },
      { id: "blusa-valentina-m", talle: "M", stock: 10 },
      { id: "blusa-valentina-l", talle: "L", stock: 5 },
    ],
    tags: ["blusa", "blanco", "basico", "oficina"],
  },
  {
    id: "vestido-bruma",
    nombre: "Vestido Bruma",
    categoria: "Vestidos",
    precio: 36900,
    descuento: 15,
    imagen: "images/vestido-floreado_1x1.webp",
    descripcion:
      "Vestido floreado de tiras, con corte a la cintura y caída suelta. Ideal para el verano y ocasiones especiales.",
    variantes: [
      { id: "vestido-bruma-s", talle: "S", stock: 6 },
      { id: "vestido-bruma-m", talle: "M", stock: 7 },
      { id: "vestido-bruma-l", talle: "L", stock: 0 },
    ],
    tags: ["vestido", "floreado", "verano", "fiesta"],
  },
  {
    id: "jean-mom-bea",
    nombre: "Jean Mom Bea",
    categoria: "Pantalones",
    precio: 29900,
    descuento: 0,
    imagen: "images/jean-claro_1x1.webp",
    descripcion:
      "Jean mom fit de tiro alto en lavado claro. Un básico que combina con todo el resto del guardarropa.",
    variantes: [
      { id: "jean-mom-bea-36", talle: "36", stock: 4 },
      { id: "jean-mom-bea-38", talle: "38", stock: 9 },
      { id: "jean-mom-bea-40", talle: "40", stock: 7 },
      { id: "jean-mom-bea-42", talle: "42", stock: 3 },
    ],
    tags: ["jean", "claro", "mom fit", "denim"],
  },
  {
    id: "sweater-frida",
    nombre: "Sweater Frida",
    categoria: "Sweaters y Abrigos",
    precio: 27500,
    descuento: 10,
    imagen: "images/sweater-fucsia_1x1.webp",
    descripcion:
      "Sweater tejido oversize en fucsia, mangas globo. El punto justo de abrigo sin perder color.",
    variantes: [
      { id: "sweater-frida-s", talle: "S", stock: 5 },
      { id: "sweater-frida-m", talle: "M", stock: 8 },
      { id: "sweater-frida-l", talle: "L", stock: 4 },
    ],
    tags: ["sweater", "fucsia", "invierno", "tejido"],
  },
  {
    id: "zapatillas-aurora",
    nombre: "Zapatillas Aurora",
    categoria: "Calzado",
    precio: 38900,
    descuento: 0,
    imagen: "images/zapatillas-blancas-rosa_1x1.webp",
    descripcion:
      "Zapatillas urbanas blancas con detalle rosa en el talón. Plantilla acolchada para uso diario.",
    variantes: [
      { id: "zapatillas-aurora-36", talle: "36", stock: 3 },
      { id: "zapatillas-aurora-37", talle: "37", stock: 6 },
      { id: "zapatillas-aurora-38", talle: "38", stock: 6 },
      { id: "zapatillas-aurora-39", talle: "39", stock: 4 },
      { id: "zapatillas-aurora-40", talle: "40", stock: 2 },
    ],
    tags: ["zapatillas", "blanco", "urbano", "calzado"],
  },
  {
    id: "cartera-luna",
    nombre: "Cartera Luna",
    categoria: "Accesorios",
    precio: 24900,
    descuento: 0,
    imagen: "images/cartera-rosa_1x1.webp",
    descripcion:
      "Cartera de mano en cuero ecológico rosa, con manija reforzada y cierre a presión. Talle único.",
    variantes: [{ id: "cartera-luna-unica", talle: null, stock: 11 }],
    tags: ["cartera", "rosa", "accesorio", "cuero ecologico"],
  },
];

const getProducto = (id) => PRODUCTOS.find((p) => p.id === id);
const getVariante = (producto, varianteId) =>
  producto?.variantes.find((v) => v.id === varianteId);
const precioFinal = (p) =>
  p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const varianteDisponible = (p) => p.variantes.find((v) => v.stock > 0);

const Cart = {
  KEY: "bruana_cart",
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
    "display:flex;align-items:center;gap:.6rem;background:#29121d;color:#fff;padding:.85rem 1.3rem;border-radius:999px;box-shadow:0 26px 60px rgb(41 18 29 / .2);font:600 .92rem/1 Outfit,sans-serif;opacity:0;transform:translateY(10px);transition:opacity .3s,transform .3s";
  toast.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#ff8fc4" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg><span>${esc(msg)}</span>`;
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
      <img src="${p.imagen}" width="800" height="800" alt="${esc(p.nombre)}" loading="lazy">
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
    btn.addEventListener("click", () => {
      state.cat = btn.dataset.filterCat;
      document
        .querySelectorAll("[data-filter-cat]")
        .forEach((b) => b.classList.toggle("is-active", b === btn));
      renderCatalogo();
    });
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
      const cat = btn.dataset.gotoCat;
      state.cat = cat;
      document
        .querySelectorAll("[data-filter-cat]")
        .forEach((b) =>
          b.classList.toggle("is-active", b.dataset.filterCat === cat),
        );
      renderCatalogo();
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
  const tieneTalles = p.variantes.some((v) => v.talle);
  const talles = tieneTalles
    ? `
    <div class="qv-talles">
      ${p.variantes.map((v) => `<button type="button" class="qv-talle" data-talle="${v.id}" ${v.stock === 0 ? "disabled" : ""}>${esc(v.talle)}</button>`).join("")}
    </div>`
    : "";
  const relacionados = PRODUCTOS.filter(
    (x) => x.categoria === p.categoria && x.id !== p.id,
  ).slice(0, 3);
  const relacionadosHtml = relacionados.length
    ? `
    <div class="qv-relacionados">
      <h4>También te puede interesar</h4>
      <div class="qv-relacionados-grid">
        ${relacionados.map((r) => `<div class="qv-rel-card" data-open-product="${r.id}"><img src="${r.imagen}" width="200" height="200" alt="${esc(r.nombre)}" loading="lazy"><p>${esc(r.nombre)}</p></div>`).join("")}
      </div>
    </div>`
    : "";
  return `
  <div class="qv-media"><img src="${p.imagen}" width="800" height="800" alt="${esc(p.nombre)}"></div>
  <div class="qv-info">
    <p class="qv-cat">${esc(p.categoria)}</p>
    <h3>${esc(p.nombre)}</h3>
    <div class="qv-precios">
      <span class="qv-precio">${formatearPrecio(final)}</span>
      ${p.descuento > 0 ? `<span class="qv-precio-tachado">${formatearPrecio(p.precio)}</span>` : ""}
    </div>
    <p class="qv-desc">${esc(p.descripcion)}</p>
    ${talles}
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
      showToast("Elegí un talle antes de agregar");
      return;
    }
    Cart.add(qvProducto.id, qvVarianteId, qty());
    showToast(`¡Agregado! ${qvProducto.nombre} en tu carrito`);
  });
  body.querySelector("#qvComprar").addEventListener("click", () => {
    if (!qvVarianteId) {
      showToast("Elegí un talle antes de continuar");
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
      ${variante?.talle ? `<p class="drawer-item-talle">Talle ${esc(variante.talle)}</p>` : ""}
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
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hola Bruana, quiero consultar por la tienda.")}`;
  const lines = ["Hola Bruana, quiero hacer este pedido:", ""];
  items.forEach((item) => {
    const producto = getProducto(item.id);
    if (!producto) return;
    const variante = getVariante(producto, item.varianteId);
    const talle = variante?.talle ? ` (Talle ${variante.talle})` : "";
    lines.push(
      `${item.qty}x ${producto.nombre}${talle} — ${formatearPrecio(precioFinal(producto) * item.qty)}`,
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
  const desktopMq = window.matchMedia("(min-width: 861px)");
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

function initPerchero() {
  const stage = document.getElementById("percheroStage");
  const rack = document.getElementById("percheroRack");
  const steps = rack ? Array.from(rack.querySelectorAll(".hanger-item")) : [];
  const catEl = document.getElementById("rackDetailCat");
  const nameEl = document.getElementById("rackDetailName");
  const priceEl = document.getElementById("rackDetailPrice");
  const btnEl = document.getElementById("rackDetailBtn");
  if (!stage || !rack || !steps.length) return;

  const orden = [
    "blusa-valentina",
    "vestido-bruma",
    "jean-mom-bea",
    "sweater-frida",
    "zapatillas-aurora",
    "cartera-luna",
  ];

  const setActive = (index) => {
    const clamped = Math.max(0, Math.min(orden.length - 1, index));
    steps.forEach((step, i) =>
      step.classList.toggle("is-active", i === clamped),
    );
    const producto = getProducto(orden[clamped]);
    if (!producto) return;
    catEl.textContent = producto.categoria;
    nameEl.textContent = producto.nombre;
    priceEl.textContent = formatearPrecio(precioFinal(producto));
    btnEl.dataset.openProduct = producto.id;
  };

  btnEl?.addEventListener("click", () =>
    openQuickview(btnEl.dataset.openProduct),
  );
  setActive(0);

  if (
    reduceMotion ||
    typeof gsap === "undefined" ||
    typeof ScrollTrigger === "undefined"
  )
    return;

  const mm = gsap.matchMedia();

  mm.add("(min-width: 861px)", () => {
    const st = ScrollTrigger.create({
      trigger: stage,
      start: "top top",
      end: "+=260%",
      pin: true,
      scrub: 0.6,
      onUpdate: (self) =>
        setActive(Math.floor(self.progress * orden.length + 0.0001)),
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
      onUpdate: (self) =>
        setActive(Math.floor(self.progress * orden.length + 0.0001)),
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
initPerchero();
initReveals();
updateCartBadge();

const anio = document.getElementById("anioActual");
if (anio) anio.textContent = new Date().getFullYear();
