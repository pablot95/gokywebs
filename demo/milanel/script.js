const WHATSAPP_NUMBER = "5493513188893";
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
const normalizar = (s) =>
  (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
const formatPrecio = (n) => "$" + Math.round(n).toLocaleString("es-AR");

const CATEGORIAS = [
  {
    id: "milanesas-simples",
    nombre: "Milanesas simples",
    imagen: "images/cutlets-rebozados-1200x1200.webp",
  },
  {
    id: "milanesas-rellenas",
    nombre: "Milanesas rellenas",
    imagen: "images/milanesa-cortada-plato-1200x1200.webp",
  },
  {
    id: "nuggets-bocaditos",
    nombre: "Nuggets y bocaditos",
    imagen: "images/cutlets-rebozados-1200x1200.webp",
  },
  {
    id: "combos",
    nombre: "Combos familiares",
    imagen: "images/milanesa-frita-plato-1200x1200.webp",
  },
  {
    id: "pollo-trozado",
    nombre: "Pollo trozado",
    imagen: "images/pechuga-fresca-par-1200x1200.webp",
  },
];
const categoriaNombre = (id) =>
  CATEGORIAS.find((c) => c.id === id)?.nombre || id;

const IMG = {
  crudo: "images/cutlets-rebozados-1200x1200.webp",
  relleno: "images/milanesa-cortada-plato-1200x1200.webp",
  frito: "images/milanesa-frita-plato-1200x1200.webp",
  pechuga: "images/pechuga-fresca-par-1200x1200.webp",
  rebozado: "images/rebozado-casero-hierbas-1600x1300.webp",
};

const PRODUCTOS_RAW = [
  [
    "mil-clasica-x4",
    "Milanesa de pechuga clásica x4",
    "milanesas-simples",
    "Bandeja",
    IMG.crudo,
    "Rebozado casero, lista para freír o al horno.",
    "Nuestra milanesa de siempre: pechuga fileteada a mano y pasada por nuestro rebozado casero de pan rallado y hierbas.",
    8500,
    0,
    true,
    false,
  ],
  [
    "mil-fina-x6",
    "Milanesa de pechuga fileteada finita x6",
    "milanesas-simples",
    "Bandeja",
    IMG.crudo,
    "Corte finito, ideal para milanesa a caballo.",
    "Fileteada bien fina para que quede crocante por fuera y se cocine parejo. Rinde para 6 porciones.",
    11200,
    0,
    false,
    false,
  ],
  [
    "mil-kilo",
    "Milanesa de pechuga por kilo",
    "milanesas-simples",
    "Kg",
    IMG.pechuga,
    "Para freezer, comprá la cantidad que necesites.",
    "La misma milanesa de siempre, vendida por kilo para quienes quieren stockear en el freezer.",
    9800,
    0,
    true,
    false,
  ],
  [
    "mil-xl-x2",
    "Milanesa de pechuga extra grande x2",
    "milanesas-simples",
    "Bandeja",
    IMG.crudo,
    "Porción generosa, para los que comen de verdad.",
    "Dos milanesas grandes, pensadas para una porción principal sin acompañamiento.",
    6400,
    0,
    false,
    false,
  ],
  [
    "mil-jyq-x4",
    "Milanesa rellena de jamón y queso x4",
    "milanesas-rellenas",
    "Bandeja",
    IMG.relleno,
    "La clásica rellena, lista para hornear.",
    "Pechuga rellena con jamón cocido y queso, cerrada a mano y rebozada con nuestra mezcla casera.",
    10900,
    0,
    true,
    true,
  ],
  [
    "mil-espinaca-x4",
    "Milanesa rellena de espinaca y ricota x4",
    "milanesas-rellenas",
    "Bandeja",
    IMG.relleno,
    "Para el día que querés algo distinto.",
    "Relleno de espinaca salteada y ricota, con el mismo rebozado casero de siempre.",
    11500,
    0,
    false,
    false,
  ],
  [
    "mil-napo-x3",
    "Milanesa a la napolitana lista para hornear x3",
    "milanesas-rellenas",
    "Bandeja",
    IMG.relleno,
    "Con salsa, jamón y muzzarella, solo falta el horno.",
    "Ya armada con salsa, jamón y muzzarella encima — la metés al horno y listo.",
    12800,
    0,
    true,
    true,
  ],
  [
    "mil-roquefort-x4",
    "Milanesa rellena de roquefort x4",
    "milanesas-rellenas",
    "Bandeja",
    IMG.relleno,
    "Para los que se animan al roquefort.",
    "Relleno de roquefort suave, pensado para quienes buscan un sabor más fuerte.",
    12200,
    0,
    false,
    false,
  ],
  [
    "nuggets-caseros-x20",
    "Nuggets de pollo caseros x20",
    "nuggets-bocaditos",
    "Pack",
    IMG.rebozado,
    "Bocado a bocado, ideal para los chicos.",
    "Nuggets hechos con pechuga entera (no pasta de pollo), rebozados a mano de a uno.",
    7900,
    0,
    true,
    false,
  ],
  [
    "bocaditos-pechuga-x16",
    "Bocaditos de pechuga rebozados x16",
    "nuggets-bocaditos",
    "Pack",
    IMG.crudo,
    "Para picar o para el almuerzo rápido.",
    "Trozos de pechuga rebozados, más grandes que un nugget, ideales para acompañar con arroz o puré.",
    7200,
    0,
    false,
    false,
  ],
  [
    "tiras-supremas-500",
    "Supremas en tiras rebozadas x500g",
    "nuggets-bocaditos",
    "Bandeja",
    IMG.crudo,
    "Para milanesas a la tira o wraps.",
    "Tiras de pechuga rebozadas, prácticas para servir en wraps, sandwiches o como guarnición.",
    6800,
    0,
    false,
    false,
  ],
  [
    "nuggets-familiar-x40",
    "Nuggets familiares x40",
    "nuggets-bocaditos",
    "Pack",
    IMG.rebozado,
    "El pack grande para toda la semana.",
    "Mismo nugget casero de siempre, en el formato grande para freezer.",
    13500,
    10,
    true,
    false,
  ],
  [
    "combo-familiar-x8",
    "Combo Familiar x8 milanesas",
    "combos",
    "Pack",
    IMG.frito,
    "8 milanesas clásicas para toda la mesa.",
    "El combo de siempre: 8 milanesas de pechuga clásicas, listas para freír.",
    16900,
    15,
    true,
    false,
  ],
  [
    "combo-finde-x6",
    "Combo Finde x6 milanesas + papas",
    "combos",
    "Pack",
    IMG.frito,
    "Milanesas y papas, para no cocinar el finde.",
    "6 milanesas clásicas más una bolsa de papas para freír — el combo del sábado.",
    15400,
    0,
    true,
    false,
  ],
  [
    "combo-duo-x4",
    "Combo Dúo x4 milanesas",
    "combos",
    "Pack",
    IMG.crudo,
    "Para dos, sin que sobre ni falte.",
    "4 milanesas clásicas, el tamaño justo para una pareja o dos personas.",
    9600,
    0,
    false,
    false,
  ],
  [
    "combo-fiesta-x12",
    "Combo Fiesta x12 milanesas",
    "combos",
    "Pack",
    IMG.frito,
    "Para juntada grande, sin quedarte corto.",
    "12 milanesas clásicas, pensado para cumpleaños, reuniones o juntadas grandes.",
    24500,
    10,
    false,
    false,
  ],
  [
    "pechuga-sin-rebozar-kg",
    "Pechuga fresca sin rebozar",
    "pollo-trozado",
    "Kg",
    IMG.pechuga,
    "La materia prima, para tu propia receta.",
    "Pechuga fresca deshuesada, sin rebozar, para quien prefiere cocinarla a su manera.",
    7600,
    0,
    false,
    false,
  ],
  [
    "supremas-kg",
    "Supremas de pollo",
    "pollo-trozado",
    "Kg",
    IMG.pechuga,
    "Con hueso, para horno o parrilla.",
    "Supremas de pollo frescas, con hueso, ideales para horno o parrilla.",
    8200,
    0,
    false,
    false,
  ],
  [
    "pata-muslo-kg",
    "Pata-muslo",
    "pollo-trozado",
    "Kg",
    IMG.pechuga,
    "El corte de siempre, para guisos y horno.",
    "Pata-muslo fresco, el corte clásico para guisos, horno o parrilla.",
    4900,
    0,
    true,
    false,
  ],
  [
    "pollo-milanga-kg",
    "Pollo trozado para milanga (deshuesado)",
    "pollo-trozado",
    "Kg",
    IMG.pechuga,
    "Ya deshuesado, listo para tu propio rebozado.",
    "Pechuga fileteada, deshuesada y lista para rebozar en casa a tu gusto.",
    8900,
    0,
    false,
    true,
  ],
];

const PRODUCTOS = PRODUCTOS_RAW.map((row) => ({
  id: row[0],
  nombre: row[1],
  categoria: row[2],
  formato: row[3],
  imagen: row[4],
  descCorta: row[5],
  descLarga: row[6],
  precio: row[7],
  descuento: row[8],
  destacado: row[9],
  nuevo: row[10],
  stock: 20,
}));
const DESTACADOS = PRODUCTOS.filter((p) => p.destacado);
const getProducto = (id) => PRODUCTOS.find((p) => p.id === id);
const precioFinal = (p) =>
  p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;

function initWspLinks() {
  document.querySelectorAll("[data-wsp-msg]").forEach((a) => {
    const msg = a.dataset.wspMsg;
    if (!msg) return;
    a.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  });
}

const Cart = {
  KEY: "milanel_cart",
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

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll("[data-cart-count], #cartBadge").forEach((b) => {
    b.textContent = n;
    b.hidden = n === 0;
    b.classList.remove("bump");
    void b.offsetWidth;
    if (n) b.classList.add("bump");
  });
}
document.addEventListener("cart:updated", updateCartBadge);

function prodCardHTML(p) {
  const final = precioFinal(p);
  const sinStock = p.stock <= 0;
  const badges = [];
  if (p.descuento)
    badges.push(`<span class="badge badge-sale">-${p.descuento}%</span>`);
  if (p.nuevo) badges.push('<span class="badge badge-nuevo">Nuevo</span>');
  return `
    <article class="card" data-id="${p.id}">
      <div class="card-media" data-open-modal="${p.id}">
        ${badges.length ? `<div class="card-badges">${badges.join("")}</div>` : ""}
        <img src="${p.imagen}" alt="${esc(p.nombre)}" width="1200" height="1200" loading="lazy">
        <button type="button" class="card-quick" data-quick="${p.id}" aria-label="Vista rápida de ${esc(p.nombre)}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z"/><circle cx="12" cy="12" r="3"/></svg>
        </button>
      </div>
      <div class="card-body">
        <span class="card-cat">${esc(categoriaNombre(p.categoria))}</span>
        <p class="card-title" data-open-modal="${p.id}">${esc(p.nombre)}</p>
        ${
          sinStock
            ? '<p class="card-sin-stock">Sin stock por el momento</p>'
            : `<div class="card-precios">
              <span class="card-precio">${formatPrecio(final)}</span>
              ${p.descuento ? `<span class="card-precio-antes">${formatPrecio(p.precio)}</span>` : ""}
            </div>`
        }
        <div class="card-actions">
          <div class="stepper" data-stepper>
            <button type="button" data-step="-1" aria-label="Restar cantidad">&minus;</button>
            <span data-qty>1</span>
            <button type="button" data-step="1" aria-label="Sumar cantidad">+</button>
          </div>
          <button type="button" class="card-add" data-add="${p.id}" ${sinStock ? "disabled" : ""}>${sinStock ? "Sin stock" : "Agregar"}</button>
        </div>
      </div>
    </article>`;
}

function initProdCardEvents(container) {
  container.querySelectorAll("[data-stepper]").forEach((stepper) => {
    stepper.querySelectorAll("[data-step]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const span = stepper.querySelector("[data-qty]");
        const next = Math.max(
          1,
          parseInt(span.textContent, 10) + parseInt(btn.dataset.step, 10),
        );
        span.textContent = next;
      });
    });
  });
  container.querySelectorAll("[data-add]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const p = getProducto(btn.dataset.add);
      if (!p) return;
      const card = btn.closest("article");
      const qty = parseInt(
        card.querySelector("[data-qty]")?.textContent || "1",
        10,
      );
      Cart.add(p, qty);
      const qtySpan = card.querySelector("[data-qty]");
      if (qtySpan) qtySpan.textContent = "1";
      btn.classList.add("is-added");
      const original = btn.textContent;
      btn.textContent = "¡Agregado!";
      setTimeout(() => {
        btn.classList.remove("is-added");
        btn.textContent = original;
      }, 1200);
      mostrarToast(`Agregaste ${p.nombre} a tu pedido`);
    });
  });
  container
    .querySelectorAll("[data-open-modal], [data-quick]")
    .forEach((el) => {
      el.addEventListener("click", () =>
        openProductModal(el.dataset.openModal || el.dataset.quick),
      );
    });
}

function renderDestacados() {
  const track = document.getElementById("destacadosTrack");
  if (!track) return;
  track.innerHTML = DESTACADOS.map(prodCardHTML).join("");
  initProdCardEvents(track);
  initRailDrag(document.getElementById("destacadosRail"));
}

function renderCategorias() {
  const grid = document.getElementById("catGrid");
  if (!grid) return;
  grid.innerHTML = CATEGORIAS.map(
    (c) => `
    <button type="button" class="cat-card" data-cat="${c.id}" data-animate="up" style="transform:translateY(30px);opacity:0">
      <img src="${c.imagen}" width="800" height="1000" alt="Categoría ${esc(c.nombre)}" loading="lazy">
      <span>${esc(c.nombre)}</span>
    </button>`,
  ).join("");
  grid.querySelectorAll("[data-cat]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const cat = btn.dataset.cat;
      const select = document.getElementById("filtroCategoria");
      select.value = cat;
      catalogoState.categoria = cat;
      catalogoState.visibles = 16;
      renderCatalogo();
      document
        .getElementById("catalogo")
        .scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
    });
  });
}

const catalogoState = { query: "", categoria: "", formato: "", visibles: 16 };

function filtrarProductos() {
  const q = normalizar(catalogoState.query.trim());
  return PRODUCTOS.filter((p) => {
    if (catalogoState.categoria && p.categoria !== catalogoState.categoria)
      return false;
    if (catalogoState.formato && p.formato !== catalogoState.formato)
      return false;
    if (q) {
      const haystack = normalizar(
        [p.nombre, categoriaNombre(p.categoria), p.formato, p.descCorta].join(
          " ",
        ),
      );
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}

function renderCatalogo() {
  const grid = document.getElementById("catalogoGrid");
  const count = document.getElementById("resultadosCount");
  const sinResultados = document.getElementById("sinResultados");
  const verMas = document.getElementById("verMas");
  if (!grid) return;
  const resultados = filtrarProductos();
  count.textContent = `${resultados.length} producto${resultados.length === 1 ? "" : "s"}`;
  sinResultados.hidden = resultados.length > 0;
  grid.hidden = resultados.length === 0;
  const visibles = resultados.slice(0, catalogoState.visibles);
  grid.innerHTML = visibles.map(prodCardHTML).join("");
  initProdCardEvents(grid);
  verMas.hidden = catalogoState.visibles >= resultados.length;
  document.getElementById("limpiarFiltros").hidden = !(
    catalogoState.query ||
    catalogoState.categoria ||
    catalogoState.formato
  );
  initReveals();
  if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
}

function llenarFiltros() {
  const selCategoria = document.getElementById("filtroCategoria");
  CATEGORIAS.forEach((c) => {
    const opt = document.createElement("option");
    opt.value = c.id;
    opt.textContent = c.nombre;
    selCategoria.appendChild(opt);
  });
  const selFormato = document.getElementById("filtroFormato");
  [...new Set(PRODUCTOS.map((p) => p.formato))].forEach((f) => {
    const opt = document.createElement("option");
    opt.value = f;
    opt.textContent = f;
    selFormato.appendChild(opt);
  });
}

function initCatalogo() {
  llenarFiltros();
  renderCatalogo();
  document.getElementById("buscador").addEventListener("input", (e) => {
    catalogoState.query = e.target.value;
    catalogoState.visibles = 16;
    renderCatalogo();
  });
  document.getElementById("filtroCategoria").addEventListener("change", (e) => {
    catalogoState.categoria = e.target.value;
    catalogoState.visibles = 16;
    renderCatalogo();
  });
  document.getElementById("filtroFormato").addEventListener("change", (e) => {
    catalogoState.formato = e.target.value;
    catalogoState.visibles = 16;
    renderCatalogo();
  });
  document.getElementById("verMas").addEventListener("click", () => {
    catalogoState.visibles += 16;
    renderCatalogo();
  });
  const limpiar = () => {
    catalogoState.query = "";
    catalogoState.categoria = "";
    catalogoState.formato = "";
    catalogoState.visibles = 16;
    document.getElementById("buscador").value = "";
    document.getElementById("filtroCategoria").value = "";
    document.getElementById("filtroFormato").value = "";
    renderCatalogo();
  };
  document.getElementById("limpiarFiltros").addEventListener("click", limpiar);
  document
    .getElementById("sinResultadosLimpiar")
    .addEventListener("click", limpiar);
}

function initRailDrag(vp) {
  if (!vp) return;
  vp.addEventListener(
    "wheel",
    (e) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      const max = vp.scrollWidth - vp.clientWidth;
      if (max <= 1) return;
      const atStart = vp.scrollLeft <= 0;
      const atEnd = vp.scrollLeft >= max - 1;
      if ((e.deltaY < 0 && atStart) || (e.deltaY > 0 && atEnd)) return;
      e.preventDefault();
      vp.scrollLeft += e.deltaY;
    },
    { passive: false },
  );
  let dragging = false;
  let moved = false;
  let startX = 0;
  let startScroll = 0;
  let pointerId = null;
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
        /* sin capture el drag igual funciona */
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
        /* ya liberado */
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

function openProductModal(id) {
  const p = getProducto(id);
  if (!p) return;
  const modal = document.getElementById("productModal");
  const backdrop = document.getElementById("modalBackdrop");
  const body = document.getElementById("modalBody");
  const final = precioFinal(p);
  body.innerHTML = `
    <div class="modal-media"><img src="${p.imagen}" width="1200" height="1200" alt="${esc(p.nombre)}"></div>
    <div class="modal-info">
      <span class="card-cat">${esc(categoriaNombre(p.categoria))}</span>
      <h3>${esc(p.nombre)}</h3>
      <div class="modal-tags"><span>${esc(p.formato)}</span></div>
      <p class="modal-desc">${esc(p.descLarga)}</p>
      <p class="modal-precio">${formatPrecio(final)}</p>
      <div class="modal-actions">
        <div class="stepper" data-stepper>
          <button type="button" data-step="-1" aria-label="Restar cantidad">&minus;</button>
          <span data-qty>1</span>
          <button type="button" data-step="1" aria-label="Sumar cantidad">+</button>
        </div>
        <button type="button" class="btn btn-cta" data-add="${p.id}">Agregar al pedido</button>
      </div>
    </div>`;
  initProdCardEvents(body);
  modal.classList.add("open");
  backdrop.classList.add("open");
  modal.removeAttribute("inert");
  document.body.classList.add("no-scroll");
}
function closeProductModal() {
  const modal = document.getElementById("productModal");
  document.getElementById("modalBackdrop").classList.remove("open");
  modal.classList.remove("open");
  modal.setAttribute("inert", "");
  document.body.classList.remove("no-scroll");
}
function initModal() {
  document
    .getElementById("modalClose")
    .addEventListener("click", closeProductModal);
  document
    .getElementById("modalBackdrop")
    .addEventListener("click", closeProductModal);
  document.addEventListener("keydown", (e) => {
    if (
      e.key === "Escape" &&
      document.getElementById("productModal").classList.contains("open")
    )
      closeProductModal();
  });
}

function renderDrawer() {
  const body = document.getElementById("drawerBody");
  const foot = document.getElementById("drawerFoot");
  const items = Cart.get();
  if (!items.length) {
    body.innerHTML =
      '<p class="drawer-empty">Tu pedido está vacío. ¡Elegí algo rico de la carta!</p>';
    foot.hidden = true;
    return;
  }
  body.innerHTML = items
    .map((i) => {
      const p = getProducto(i.id);
      if (!p) return "";
      return `
      <div class="drawer-item" data-id="${p.id}">
        <img src="${p.imagen}" alt="${esc(p.nombre)}" width="64" height="64">
        <div>
          <p class="drawer-item-name">${esc(p.nombre)}</p>
          <p class="drawer-item-precio">${i.qty} x ${formatPrecio(precioFinal(p))}</p>
          <button type="button" class="drawer-item-remove" data-remove="${p.id}">Quitar</button>
        </div>
        <div class="stepper" data-stepper-drawer="${p.id}">
          <button type="button" data-step="-1" aria-label="Restar">&minus;</button>
          <span data-qty>${i.qty}</span>
          <button type="button" data-step="1" aria-label="Sumar">+</button>
        </div>
      </div>`;
    })
    .join("");
  body.querySelectorAll("[data-remove]").forEach((btn) => {
    btn.addEventListener("click", () => Cart.remove(btn.dataset.remove));
  });
  body.querySelectorAll("[data-stepper-drawer]").forEach((stepper) => {
    const id = stepper.dataset.stepperDrawer;
    stepper.querySelectorAll("[data-step]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const item = Cart.get().find((i) => i.id === id);
        if (!item) return;
        Cart.setQty(id, item.qty + parseInt(btn.dataset.step, 10));
      });
    });
  });
  foot.hidden = false;
  document.getElementById("drawerTotal").textContent = formatPrecio(
    Cart.total(),
  );
}
document.addEventListener("cart:updated", renderDrawer);

function openCartDrawer() {
  document.getElementById("cartDrawer").classList.add("open");
  document.getElementById("cartDrawer").removeAttribute("inert");
  document.getElementById("drawerBackdrop").classList.add("open");
  document.body.classList.add("no-scroll", "drawer-open");
}
function closeCartDrawer() {
  document.getElementById("cartDrawer").classList.remove("open");
  document.getElementById("cartDrawer").setAttribute("inert", "");
  document.getElementById("drawerBackdrop").classList.remove("open");
  document.body.classList.remove("no-scroll", "drawer-open");
}
function initDrawer() {
  document
    .getElementById("cartToggle")
    .addEventListener("click", openCartDrawer);
  document
    .getElementById("cartFloat")
    .addEventListener("click", openCartDrawer);
  document
    .getElementById("drawerClose")
    .addEventListener("click", closeCartDrawer);
  document
    .getElementById("drawerBackdrop")
    .addEventListener("click", closeCartDrawer);
  document.addEventListener("keydown", (e) => {
    if (
      e.key === "Escape" &&
      document.getElementById("cartDrawer").classList.contains("open")
    )
      closeCartDrawer();
  });
  document.getElementById("drawerCheckout").addEventListener("click", () => {
    const items = Cart.get();
    if (!items.length) return;
    const lineas = items
      .map((i) => {
        const p = getProducto(i.id);
        return p
          ? `${i.qty} x ${p.nombre} (${formatPrecio(precioFinal(p) * i.qty)})`
          : "";
      })
      .filter(Boolean);
    const mensaje = [
      "Hola! Quiero hacer este pedido en MILANEL:",
      ...lineas,
      `Total: ${formatPrecio(Cart.total())}`,
      "Quedo atento para coordinar entrega y pago.",
    ].join("\n");
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`,
      "_blank",
      "noopener",
    );
  });
}

function initFloats() {
  const wsp = document.getElementById("wspFloat");
  const cart = document.getElementById("cartFloat");
  const sync = () => {
    const scrolled = window.scrollY > 600;
    wsp?.classList.toggle("visible", scrolled);
    cart?.classList.toggle("visible", scrolled || Cart.count() > 0);
  };
  window.addEventListener("scroll", sync, { passive: true });
  document.addEventListener("cart:updated", sync);
  sync();
}

function mostrarToast(texto) {
  let wrap = document.getElementById("toastWrap");
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.setAttribute("role", "status");
  toast.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg><span>${esc(texto)}</span>`;
  wrap.appendChild(toast);
  setTimeout(() => {
    toast.classList.add("hiding");
    setTimeout(() => toast.remove(), 220);
  }, 3200);
}

function initNav() {
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("mainNav");
  const closeBtn = document.getElementById("navClose");
  if (!toggle || !nav) return;
  let bd = document.getElementById("navBackdrop");
  const desktopMq = window.matchMedia("(min-width: 781px)");
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

function initReveals() {
  const items = document.querySelectorAll("[data-animate]");
  if (!items.length) return;
  document.querySelectorAll("[data-animate-stagger]").forEach((parent) => {
    parent.querySelectorAll("[data-animate]").forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i * 0.1, 0.6)}s`;
    });
  });
  items.forEach((el) => {
    if (el.dataset.delay) el.style.transitionDelay = `${el.dataset.delay}s`;
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
  items.forEach((el) => {
    if (!el.classList.contains("in")) io.observe(el);
  });

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

function initProceso() {
  const stage = document.getElementById("procesoStage");
  const pasos = Array.from(
    document.querySelectorAll("#procesoPasos .proceso-paso"),
  );
  const imgs = Array.from(document.querySelectorAll("#procesoVisual img"));
  if (!stage || !pasos.length || !imgs.length) return;

  function setStep(progress) {
    const idx = Math.min(pasos.length - 1, Math.floor(progress * pasos.length));
    pasos.forEach((p, i) => p.classList.toggle("is-on", i === idx));
    imgs.forEach((img, i) => img.classList.toggle("is-active", i === idx));
  }

  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    setStep(0);
    return;
  }

  ScrollTrigger.matchMedia({
    "(min-width: 901px) and (prefers-reduced-motion: no-preference)": () => {
      const st = ScrollTrigger.create({
        trigger: stage,
        start: "top top",
        end: "+=140%",
        scrub: 0.6,
        onUpdate: (self) => setStep(self.progress),
        invalidateOnRefresh: true,
      });
      return () => st.kill();
    },
    "(max-width: 900px) and (prefers-reduced-motion: no-preference)": () => {
      stage.classList.add("is-sticky-mobile");
      const st = ScrollTrigger.create({
        trigger: stage,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.6,
        onUpdate: (self) => setStep(self.progress),
        invalidateOnRefresh: true,
      });
      requestAnimationFrame(() => ScrollTrigger.refresh());
      return () => {
        stage.classList.remove("is-sticky-mobile");
        st.kill();
      };
    },
    "(prefers-reduced-motion: reduce)": () => {
      setStep(0);
    },
  });
}

function initAntiCopia() {
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
}

function initFooterYear() {
  const el = document.getElementById("footerYear");
  if (el) el.textContent = new Date().getFullYear();
}

function initJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: "MILANEL",
    description:
      "Pollería especializada en milanesas de pechuga fresca con rebozado casero.",
    telephone: `+${WHATSAPP_NUMBER}`,
    address: {
      "@type": "PostalAddress",
      addressRegion: "Córdoba",
      addressCountry: "AR",
    },
  };
  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
}

document.addEventListener("DOMContentLoaded", () => {
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
  }
  if (typeof gsap === "undefined") {
    document.querySelectorAll("[data-animate]").forEach((el) => {
      el.style.opacity = 1;
      el.style.transform = "none";
      el.style.filter = "none";
    });
  }

  renderDestacados();
  renderCategorias();
  initCatalogo();
  initWspLinks();
  initNav();
  initFloats();
  initModal();
  initDrawer();
  initProceso();
  initReveals();
  initAntiCopia();
  initFooterYear();
  initJsonLd();
  updateCartBadge();

  window.addEventListener("load", () => {
    if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
  });
});
