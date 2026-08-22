const WHATSAPP_NUMBER = "5491164139692";

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
if (typeof ScrollTrigger !== "undefined") {
  window.addEventListener("load", () => ScrollTrigger.refresh());
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

const CATEGORIAS = {
  cuero: "Cuero",
  tejidos: "Tejidos",
  hogar: "Hogar y Aromas",
  accesorios: "Accesorios",
  natura: "Natura",
  tupperware: "Tupperware",
};

const PRODUCTOS = [
  { id: "billetera-cuero", categoria: "cuero", nombre: "Billetera de cuero cosida a mano", precio: 32000, descuento: 0, img: "cuero-billetera-artesanal-1200x1200.webp", desc: "Cuero genuino, costura a mano vista, 3 tarjeteros y bolsillo para billetes.", perfil: ["regalo", "uso-personal", "artesanal"], destacada: true },
  { id: "portadocumentos-cuero", categoria: "cuero", nombre: "Portadocumentos de cuero", precio: 28000, descuento: 0, img: "cuero-billetera-artesanal-1200x1200.webp", desc: "Tapa rígida forrada en cuero, con broche, para documentación del auto o la moto.", perfil: ["uso-personal", "artesanal"], destacada: false },
  { id: "cinturon-cuero", categoria: "cuero", nombre: "Cinturón de cuero artesanal", precio: 24000, descuento: 15, img: "cuero-billetera-artesanal-1200x1200.webp", desc: "Hebilla metálica y cuero curtido vegetal, se adapta cortando el largo sobrante.", perfil: ["regalo", "uso-personal", "artesanal"], destacada: true },
  { id: "monedero-cuero", categoria: "cuero", nombre: "Monedero de cuero con broche", precio: 19000, descuento: 0, img: "cuero-billetera-artesanal-1200x1200.webp", desc: "Chico y compacto, con separador interno para monedas y billetes.", perfil: ["regalo", "artesanal"], destacada: false },

  { id: "bufanda-lana", categoria: "tejidos", nombre: "Bufanda de lana tejida a mano", precio: 22000, descuento: 0, img: "tejido-lana-artesanal-1200x1200.webp", desc: "Punto trenzado grueso, lana cálida para el invierno, tejida en telar.", perfil: ["regalo", "uso-personal", "artesanal"], destacada: true },
  { id: "poncho-tejido", categoria: "tejidos", nombre: "Poncho tejido artesanal", precio: 38000, descuento: 0, img: "tejido-lana-artesanal-1200x1200.webp", desc: "Una talla, tejido en dos agujas con lana mixta, ideal para las noches frías.", perfil: ["regalo", "uso-personal", "artesanal"], destacada: true },
  { id: "gorro-lana", categoria: "tejidos", nombre: "Gorro de lana con puntada trenzada", precio: 15000, descuento: 0, img: "tejido-lana-artesanal-1200x1200.webp", desc: "Tejido a mano, forro suave, talle único adaptable.", perfil: ["regalo", "artesanal"], destacada: false },
  { id: "guantes-tejidos", categoria: "tejidos", nombre: "Guantes tejidos a juego", precio: 12000, descuento: 10, img: "tejido-lana-artesanal-1200x1200.webp", desc: "A juego con la bufanda y el gorro, mismo punto trenzado.", perfil: ["regalo", "artesanal"], destacada: false },

  { id: "sahumerios-x20", categoria: "hogar", nombre: "Sahumerios artesanales x20", precio: 6500, descuento: 0, img: "sahumerio-portaincienso-1200x1200.webp", desc: "Caja de 20 varillas, aromas a elección: sándalo, lavanda o palo santo.", perfil: ["regalo", "cosmetica-hogar"], destacada: true },
  { id: "portasahumerio-ceramica", categoria: "hogar", nombre: "Portasahumerios de cerámica", precio: 8000, descuento: 0, img: "sahumerio-portaincienso-1200x1200.webp", desc: "Base de cerámica esmaltada con recolector de ceniza.", perfil: ["regalo", "cosmetica-hogar"], destacada: false },
  { id: "flor-porcelana-fria", categoria: "hogar", nombre: "Flor de porcelana fría", precio: 9500, descuento: 0, img: "porcelana-fria-figuras-1200x1200.webp", desc: "Pieza única modelada y pintada a mano, no se marchita.", perfil: ["regalo", "artesanal"], destacada: true },
  { id: "imanes-porcelana-fria", categoria: "hogar", nombre: "Set de imanes de porcelana fría", precio: 7000, descuento: 0, img: "porcelana-fria-figuras-1200x1200.webp", desc: "Set de 4 imanes con figuras variadas, hechos a mano.", perfil: ["regalo", "artesanal"], destacada: false },
  { id: "centro-mesa-porcelana", categoria: "hogar", nombre: "Centro de mesa de porcelana fría", precio: 14000, descuento: 0, img: "porcelana-fria-figuras-1200x1200.webp", desc: "Arreglo de flores de porcelana fría sobre base de madera.", perfil: ["regalo", "artesanal", "cosmetica-hogar"], destacada: false },

  { id: "pulsera-cuarzo", categoria: "accesorios", nombre: "Pulsera de cuarzo ahumado", precio: 9000, descuento: 0, img: "accesorio-pulsera-cuarzo-1200x1200.webp", desc: "Piedras naturales de cuarzo ahumado enhebradas a mano.", perfil: ["regalo", "uso-personal", "accesorio"], destacada: true },
  { id: "aros-tejidos", categoria: "accesorios", nombre: "Aros artesanales tejidos", precio: 7500, descuento: 0, img: "accesorio-pulsera-cuarzo-1200x1200.webp", desc: "Micro-tejido circular con mostacillas, livianos.", perfil: ["regalo", "accesorio"], destacada: false },
  { id: "collar-piedra-natural", categoria: "accesorios", nombre: "Collar con dije de piedra natural", precio: 11000, descuento: 20, img: "accesorio-pulsera-cuarzo-1200x1200.webp", desc: "Cadena fina con dije de piedra natural, largo ajustable.", perfil: ["regalo", "uso-personal", "accesorio"], destacada: true },
  { id: "prendedor-artesanal", categoria: "accesorios", nombre: "Prendedor artesanal", precio: 6000, descuento: 0, img: "accesorio-pulsera-cuarzo-1200x1200.webp", desc: "Base metálica con mostacillas tejidas, broche de seguridad.", perfil: ["regalo", "accesorio"], destacada: false },

  { id: "natura-crema-aveia-mel", categoria: "natura", nombre: "Crema corporal Natura Tododia — Aveia & Mel", precio: 14000, descuento: 0, img: "natura-crema-tarro-1200x1200.webp", desc: "Hidratación diaria con avena y miel. Producto original Natura.", perfil: ["regalo", "cosmetica-hogar"], destacada: true },
  { id: "natura-crema-manos-castanha", categoria: "natura", nombre: "Crema de manos Natura Tododia — Castanha", precio: 8500, descuento: 0, img: "natura-crema-tarro-1200x1200.webp", desc: "Textura liviana, absorción rápida, aroma a castaña. Producto original Natura.", perfil: ["regalo", "cosmetica-hogar"], destacada: false },
  { id: "natura-jabon-buriti", categoria: "natura", nombre: "Jabón en barra Natura Tododia — Buriti", precio: 6000, descuento: 0, img: "natura-crema-tarro-1200x1200.webp", desc: "Jabón hidratante en barra, aroma a buriti. Producto original Natura.", perfil: ["cosmetica-hogar"], destacada: false },
  { id: "natura-crema-aloe", categoria: "natura", nombre: "Crema corporal Natura Tododia — Aloe Vera", precio: 14000, descuento: 10, img: "natura-crema-tarro-1200x1200.webp", desc: "Frescor y suavidad con aloe vera. Producto original Natura.", perfil: ["regalo", "cosmetica-hogar"], destacada: true },

  { id: "tupperware-set-hermeticos", categoria: "tupperware", nombre: "Set de contenedores herméticos x3", precio: 32000, descuento: 0, img: "tupperware-contenedores-1200x1200.webp", desc: "Tres tamaños, tapa hermética, aptos freezer y microondas. Producto original Tupperware.", perfil: ["uso-personal", "cosmetica-hogar"], destacada: true },
  { id: "tupperware-redondo-mediano", categoria: "tupperware", nombre: "Tupper redondo mediano", precio: 14000, descuento: 0, img: "tupperware-contenedores-1200x1200.webp", desc: "1.2 litros, ideal para viandas. Producto original Tupperware.", perfil: ["uso-personal", "cosmetica-hogar"], destacada: false },
  { id: "tupperware-botella-termica", categoria: "tupperware", nombre: "Botella térmica Tupperware", precio: 22000, descuento: 0, img: "tupperware-contenedores-1200x1200.webp", desc: "Mantiene la temperatura varias horas, pico deportivo. Producto original Tupperware.", perfil: ["uso-personal", "regalo"], destacada: false },
];

const RAIL_IDS = PRODUCTOS.filter((p) => p.destacada).map((p) => p.id).slice(0, 8);

const getProducto = (id) => PRODUCTOS.find((p) => p.id === id);

function formatearPrecio(valor) {
  return valor.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  });
}

function precioFinal(producto) {
  if (!producto.descuento) return producto.precio;
  return Math.round(producto.precio * (1 - producto.descuento / 100));
}

function normalizar(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

function esc(str) {
  return String(str).replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
  );
}

function waHref(mensaje) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`;
}

function initWspLinks() {
  document.querySelectorAll("[data-wsp-msg]").forEach((a) => {
    const msg = a.dataset.wspMsg;
    if (!msg || a.tagName !== "A") return;
    a.href = waHref(msg);
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

function initReveals() {
  const items = document.querySelectorAll("[data-animate]");
  if (!items.length) return;
  document.querySelectorAll("[data-animate-stagger]").forEach((parent) => {
    parent.querySelectorAll("[data-animate]").forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i * 0.1, 0.7)}s`;
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

function railCardHTML(p) {
  return `<a class="rail-card" href="#" data-open-modal="${p.id}">
    <div class="rail-card-media"><img src="images/${p.img}" width="1200" height="1200" alt="${esc(p.nombre)}" loading="lazy"></div>
    <div class="rail-card-body">
      <span class="chip">${esc(CATEGORIAS[p.categoria])}</span>
      <h3>${esc(p.nombre)}</h3>
      <p class="rail-card-price">${formatearPrecio(precioFinal(p))}</p>
    </div>
  </a>`;
}

function initRail() {
  const track = document.getElementById("railTrack");
  if (!track) return;
  track.innerHTML = RAIL_IDS.map((id) => railCardHTML(getProducto(id))).join("");
  const vp = document.getElementById("railViewport");
  const prev = document.getElementById("railPrev");
  const next = document.getElementById("railNext");
  const step = () => Math.min(vp.clientWidth * 0.8, 340);
  const syncArrows = () => {
    if (!prev || !next) return;
    const padStart = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
    prev.disabled = vp.scrollLeft <= padStart + 2;
    next.disabled = vp.scrollLeft >= vp.scrollWidth - vp.clientWidth - 2;
  };
  prev?.addEventListener("click", () => vp.scrollBy({ left: -step(), behavior: "smooth" }));
  next?.addEventListener("click", () => vp.scrollBy({ left: step(), behavior: "smooth" }));
  vp.addEventListener("scroll", syncArrows, { passive: true });
  window.addEventListener("resize", syncArrows, { passive: true });
  syncArrows();

  let pointerId = null;
  let startX = 0;
  let startScroll = 0;
  let moved = false;
  vp.addEventListener("pointerdown", (e) => {
    pointerId = e.pointerId;
    startX = e.clientX;
    startScroll = vp.scrollLeft;
    moved = false;
    vp.classList.add("dragging");
    try {
      vp.setPointerCapture(pointerId);
    } catch (_err) {}
  });
  vp.addEventListener("pointermove", (e) => {
    if (pointerId === null) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 6) moved = true;
    vp.scrollLeft = startScroll - dx;
  });
  const endDrag = (_e) => {
    if (pointerId === null) return;
    try {
      vp.releasePointerCapture(pointerId);
    } catch (_err) {}
    vp.classList.remove("dragging");
    if (moved) {
      const kill = (ev) => ev.stopPropagation();
      vp.addEventListener("click", kill, { capture: true, once: true });
      setTimeout(() => vp.removeEventListener("click", kill, { capture: true }), 0);
    }
    pointerId = null;
    moved = false;
  };
  vp.addEventListener("pointerup", endDrag);
  vp.addEventListener("pointercancel", endDrag);
  vp.addEventListener("dragstart", (e) => e.preventDefault());
}

function categoriaCardHTML(slug) {
  const IMG = {
    cuero: "cuero-billetera-artesanal-1200x1200.webp",
    tejidos: "tejido-lana-artesanal-1200x1200.webp",
    hogar: "porcelana-fria-figuras-1200x1200.webp",
    accesorios: "accesorio-pulsera-cuarzo-1200x1200.webp",
    natura: "natura-crema-tarro-1200x1200.webp",
    tupperware: "tupperware-contenedores-1200x1200.webp",
  };
  const count = PRODUCTOS.filter((p) => p.categoria === slug).length;
  return `<a class="cat-card" href="#tienda" data-cat-link="${slug}">
    <div class="cat-media"><img src="images/${IMG[slug]}" width="1200" height="1200" alt="${esc(CATEGORIAS[slug])}" loading="lazy"></div>
    <div class="cat-body">
      <h3>${esc(CATEGORIAS[slug])}</h3>
      <span class="cat-count">${count} producto${count === 1 ? "" : "s"}</span>
    </div>
  </a>`;
}

function initCategorias() {
  const grid = document.getElementById("categoriasGrid");
  if (!grid) return;
  grid.innerHTML = Object.keys(CATEGORIAS).map(categoriaCardHTML).join("");
}

function productoCardHTML(p) {
  const final = precioFinal(p);
  return `<article class="prod-card" data-cat="${p.categoria}" data-nombre="${esc(normalizar(p.nombre))}">
    <div class="prod-media" data-open-modal="${p.id}">
      <img src="images/${p.img}" width="1200" height="1200" alt="${esc(p.nombre)}" loading="lazy">
      ${p.descuento ? `<span class="badge badge-off">-${p.descuento}%</span>` : ""}
      <span class="chip chip-cat">${esc(CATEGORIAS[p.categoria])}</span>
    </div>
    <div class="prod-body">
      <h3>${esc(p.nombre)}</h3>
      <p class="prod-precio">
        ${p.descuento ? `<s class="prod-precio-orig">${formatearPrecio(p.precio)}</s>` : ""}
        <span class="prod-precio-final">${formatearPrecio(final)}</span>
      </p>
      <div class="prod-actions">
        <div class="stepper" data-stepper="${p.id}">
          <button type="button" class="stepper-btn" data-step="-1" aria-label="Restar cantidad">−</button>
          <span class="stepper-val" data-qty-view="${p.id}">1</span>
          <button type="button" class="stepper-btn" data-step="1" aria-label="Sumar cantidad">+</button>
        </div>
        <button type="button" class="btn btn-cta prod-add" data-add="${p.id}">Agregar</button>
      </div>
    </div>
  </article>`;
}

let categoriaActiva = "todos";
let paginaCatalogo = 16;
const PAGINA_SIZE = 16;

function productosFiltrados() {
  const term = normalizar(document.getElementById("buscador")?.value.trim() || "");
  return PRODUCTOS.filter((p) => {
    const catOk = categoriaActiva === "todos" || p.categoria === categoriaActiva;
    const termOk = !term || normalizar(p.nombre).includes(term) || normalizar(CATEGORIAS[p.categoria]).includes(term);
    return catOk && termOk;
  });
}

function renderCatalogo() {
  const grid = document.getElementById("catalogoGrid");
  const contador = document.getElementById("catalogoContador");
  const verMas = document.getElementById("verMasBtn");
  const vacio = document.getElementById("catalogoVacio");
  if (!grid) return;
  const filtrados = productosFiltrados();
  const visibles = filtrados.slice(0, paginaCatalogo);
  grid.innerHTML = visibles.map(productoCardHTML).join("");
  vacio.hidden = filtrados.length > 0;
  grid.hidden = filtrados.length === 0;
  if (contador) {
    contador.textContent = filtrados.length
      ? `${filtrados.length} producto${filtrados.length === 1 ? "" : "s"} encontrado${filtrados.length === 1 ? "" : "s"}`
      : "";
  }
  if (verMas) verMas.hidden = paginaCatalogo >= filtrados.length;
  syncQtyViews();
  if (typeof ScrollTrigger !== "undefined") {
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }
}

function initCatalogo() {
  const grid = document.getElementById("catalogoGrid");
  if (!grid) return;
  const chips = document.querySelectorAll("[data-filtro-cat]");
  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      categoriaActiva = chip.dataset.filtroCat;
      paginaCatalogo = PAGINA_SIZE;
      chips.forEach((c) => c.classList.toggle("is-active", c === chip));
      renderCatalogo();
    });
  });
  document.querySelectorAll("[data-cat-link]").forEach((a) => {
    a.addEventListener("click", () => {
      const slug = a.dataset.catLink;
      categoriaActiva = slug;
      paginaCatalogo = PAGINA_SIZE;
      chips.forEach((c) => c.classList.toggle("is-active", c.dataset.filtroCat === slug));
    });
  });
  const buscador = document.getElementById("buscador");
  buscador?.addEventListener("input", () => {
    paginaCatalogo = PAGINA_SIZE;
    renderCatalogo();
  });
  document.getElementById("limpiarFiltros")?.addEventListener("click", () => {
    categoriaActiva = "todos";
    paginaCatalogo = PAGINA_SIZE;
    if (buscador) buscador.value = "";
    chips.forEach((c) => c.classList.toggle("is-active", c.dataset.filtroCat === "todos"));
    renderCatalogo();
  });
  document.getElementById("verMasBtn")?.addEventListener("click", () => {
    paginaCatalogo += PAGINA_SIZE;
    renderCatalogo();
  });
  renderCatalogo();
}

const CART_KEY = "detodounpocosol_cart";

function leerCarrito() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch (_e) {
    return [];
  }
}
function guardarCarrito(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}
function agregarAlCarrito(id, qty) {
  const items = leerCarrito();
  const linea = items.find((l) => l.id === id);
  if (linea) linea.qty += qty;
  else items.push({ id, qty });
  guardarCarrito(items);
  actualizarBadgeCarrito();
  return items;
}
function quitarDelCarrito(id) {
  guardarCarrito(leerCarrito().filter((l) => l.id !== id));
  actualizarBadgeCarrito();
}
function cambiarCantidadCarrito(id, qty) {
  const items = leerCarrito();
  const linea = items.find((l) => l.id === id);
  if (!linea) return;
  linea.qty = Math.max(1, qty);
  guardarCarrito(items);
  actualizarBadgeCarrito();
}
function totalCarrito() {
  return leerCarrito().reduce((acc, l) => {
    const p = getProducto(l.id);
    return p ? acc + precioFinal(p) * l.qty : acc;
  }, 0);
}
function cantidadCarrito() {
  return leerCarrito().reduce((acc, l) => acc + l.qty, 0);
}
function actualizarBadgeCarrito() {
  const n = cantidadCarrito();
  document.querySelectorAll("[data-cart-count]").forEach((el) => {
    el.textContent = n;
    el.classList.toggle("is-visible", n > 0);
    el.classList.remove("bump");
    void el.offsetWidth;
    el.classList.add("bump");
  });
  document.querySelectorAll("[data-cart-total]").forEach((el) => {
    el.textContent = formatearPrecio(totalCarrito());
  });
  const floatCart = document.getElementById("floatingCart");
  if (floatCart) floatCart.classList.toggle("visible", n > 0 || window.scrollY > 600);
}

function renderDrawer() {
  const cont = document.getElementById("drawerItems");
  const vacio = document.getElementById("drawerVacio");
  const footer = document.getElementById("drawerFooter");
  if (!cont) return;
  const items = leerCarrito();
  if (!items.length) {
    cont.innerHTML = "";
    vacio.hidden = false;
    footer.hidden = true;
    return;
  }
  vacio.hidden = true;
  footer.hidden = false;
  cont.innerHTML = items
    .map((l) => {
      const p = getProducto(l.id);
      if (!p) return "";
      return `<div class="drawer-item" data-drawer-item="${p.id}">
        <img src="images/${p.img}" width="120" height="120" alt="${esc(p.nombre)}">
        <div class="drawer-item-body">
          <h4>${esc(p.nombre)}</h4>
          <p>${formatearPrecio(precioFinal(p))}</p>
          <div class="stepper stepper-sm" data-stepper-drawer="${p.id}">
            <button type="button" class="stepper-btn" data-step-drawer="-1" aria-label="Restar">−</button>
            <span class="stepper-val">${l.qty}</span>
            <button type="button" class="stepper-btn" data-step-drawer="1" aria-label="Sumar">+</button>
          </div>
        </div>
        <button type="button" class="drawer-item-remove" data-remove="${p.id}" aria-label="Quitar ${esc(p.nombre)}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/></svg>
        </button>
      </div>`;
    })
    .join("");
}

function initCarrito() {
  const drawer = document.getElementById("cartDrawer");
  const backdrop = document.getElementById("cartBackdrop");
  if (!drawer) return;
  const abrir = () => {
    renderDrawer();
    drawer.hidden = false;
    requestAnimationFrame(() => drawer.classList.add("open"));
    backdrop.hidden = false;
    requestAnimationFrame(() => backdrop.classList.add("open"));
    document.body.classList.add("no-scroll");
    drawer.querySelector(".drawer-close")?.focus();
  };
  const cerrar = () => {
    drawer.classList.remove("open");
    backdrop.classList.remove("open");
    document.body.classList.remove("no-scroll");
    setTimeout(() => {
      drawer.hidden = true;
      backdrop.hidden = true;
    }, 350);
  };
  document.querySelectorAll("[data-open-cart]").forEach((btn) => btn.addEventListener("click", abrir));
  drawer.querySelector(".drawer-close")?.addEventListener("click", cerrar);
  backdrop.addEventListener("click", cerrar);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && drawer.classList.contains("open")) cerrar();
  });

  document.body.addEventListener("click", (e) => {
    const add = e.target.closest("[data-add]");
    if (add) {
      const id = add.dataset.add;
      const qtyEl = document.querySelector(`[data-qty-view="${id}"]`);
      const qty = qtyEl ? parseInt(qtyEl.textContent, 10) || 1 : 1;
      agregarAlCarrito(id, qty);
      mostrarToast(`¡Agregado! ${getProducto(id)?.nombre ?? ""}`);
      add.classList.remove("pulse");
      void add.offsetWidth;
      add.classList.add("pulse");
      return;
    }
    const step = e.target.closest("[data-step]");
    if (step) {
      const wrap = step.closest("[data-stepper]");
      const id = wrap.dataset.stepper;
      const view = document.querySelector(`[data-qty-view="${id}"]`);
      const current = parseInt(view.textContent, 10) || 1;
      view.textContent = Math.max(1, current + parseInt(step.dataset.step, 10));
      return;
    }
    const stepDrawer = e.target.closest("[data-step-drawer]");
    if (stepDrawer) {
      const wrap = stepDrawer.closest("[data-stepper-drawer]");
      const id = wrap.dataset.stepperDrawer;
      const items = leerCarrito();
      const linea = items.find((l) => l.id === id);
      if (linea) cambiarCantidadCarrito(id, linea.qty + parseInt(stepDrawer.dataset.stepDrawer, 10));
      renderDrawer();
      return;
    }
    const remove = e.target.closest("[data-remove]");
    if (remove) {
      quitarDelCarrito(remove.dataset.remove);
      renderDrawer();
      return;
    }
  });

  document.getElementById("finalizarBtn")?.addEventListener("click", (e) => {
    e.preventDefault();
    const btn = e.currentTarget;
    const items = leerCarrito();
    if (!items.length) return;
    btn.disabled = true;
    const original = btn.textContent;
    btn.textContent = "Enviando…";
    setTimeout(() => {
      const lineas = items
        .map((l) => {
          const p = getProducto(l.id);
          if (!p) return "";
          return `${l.qty} x ${p.nombre} (${formatearPrecio(precioFinal(p) * l.qty)})`;
        })
        .filter(Boolean)
        .join("\n");
      const mensaje = `Hola De todo un poco Sol! Quiero encargar:\n${lineas}\n\nTotal: ${formatearPrecio(totalCarrito())}`;
      window.open(waHref(mensaje), "_blank", "noopener");
      mostrarToast("¡Genial! El pago online se activa al pasar la web a producción.");
      btn.disabled = false;
      btn.textContent = original;
    }, 700);
  });

  actualizarBadgeCarrito();
  window.addEventListener(
    "scroll",
    () => {
      const floatCart = document.getElementById("floatingCart");
      if (floatCart) floatCart.classList.toggle("visible", cantidadCarrito() > 0 || window.scrollY > 600);
      const wsp = document.getElementById("wspFloat");
      if (wsp) wsp.classList.toggle("visible", window.scrollY > 600);
    },
    { passive: true },
  );
}

function syncQtyViews() {}

function initModal() {
  const modal = document.getElementById("prodModal");
  if (!modal) return;
  const cerrar = () => {
    modal.classList.remove("open");
    document.body.classList.remove("no-scroll");
    setTimeout(() => {
      modal.hidden = true;
    }, 300);
  };
  const abrir = (id) => {
    const p = getProducto(id);
    if (!p) return;
    modal.querySelector("[data-modal-img]").src = `images/${p.img}`;
    modal.querySelector("[data-modal-img]").alt = p.nombre;
    modal.querySelector("[data-modal-cat]").textContent = CATEGORIAS[p.categoria];
    modal.querySelector("[data-modal-nombre]").textContent = p.nombre;
    modal.querySelector("[data-modal-desc]").textContent = p.desc;
    modal.querySelector("[data-modal-precio]").textContent = formatearPrecio(precioFinal(p));
    const orig = modal.querySelector("[data-modal-precio-orig]");
    if (p.descuento) {
      orig.textContent = formatearPrecio(p.precio);
      orig.hidden = false;
    } else orig.hidden = true;
    const addBtn = modal.querySelector("[data-modal-add]");
    addBtn.dataset.add = id;
    const buyBtn = modal.querySelector("[data-modal-buy]");
    buyBtn.dataset.id = id;
    modal.querySelector("[data-modal-qty]").textContent = "1";
    modal.querySelector("[data-modal-stepper]").dataset.stepper = id;
    modal.setAttribute("aria-label", `Vista rápida: ${p.nombre}`);
    modal.hidden = false;
    requestAnimationFrame(() => modal.classList.add("open"));
    document.body.classList.add("no-scroll");
    modal.querySelector(".modal-close")?.focus();
  };
  document.body.addEventListener("click", (e) => {
    const trigger = e.target.closest("[data-open-modal]");
    if (trigger) {
      e.preventDefault();
      abrir(trigger.dataset.openModal);
    }
  });
  modal.querySelector(".modal-close")?.addEventListener("click", cerrar);
  modal.querySelector(".modal-backdrop")?.addEventListener("click", cerrar);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("open")) cerrar();
  });
  modal.querySelectorAll("[data-modal-step]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const view = modal.querySelector("[data-modal-qty]");
      const current = parseInt(view.textContent, 10) || 1;
      view.textContent = Math.max(1, current + parseInt(btn.dataset.modalStep, 10));
    });
  });
  modal.querySelector("[data-modal-add]")?.addEventListener("click", (e) => {
    const id = e.currentTarget.dataset.add;
    const qty = parseInt(modal.querySelector("[data-modal-qty]").textContent, 10) || 1;
    agregarAlCarrito(id, qty);
    mostrarToast(`¡Agregado! ${getProducto(id)?.nombre ?? ""}`);
  });
  modal.querySelector("[data-modal-buy]")?.addEventListener("click", (e) => {
    const id = e.currentTarget.dataset.id;
    const qty = parseInt(modal.querySelector("[data-modal-qty]").textContent, 10) || 1;
    agregarAlCarrito(id, qty);
    cerrar();
    document.getElementById("floatingCart")?.querySelector("[data-open-cart]")?.click();
  });
}

function mostrarToast(texto) {
  const wrap = document.getElementById("toastWrap");
  if (!wrap) return;
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.setAttribute("role", "status");
  toast.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg><span>${esc(texto)}</span>`;
  wrap.appendChild(toast);
  setTimeout(() => {
    toast.classList.add("hiding");
    setTimeout(() => toast.remove(), 250);
  }, 3200);
}

const CONSULTIVO_PREGUNTAS = [
  {
    key: "para",
    texto: "¿Para quién es?",
    opciones: [
      { valor: "regalo", label: "Para regalar" },
      { valor: "uso-personal", label: "Para mí" },
    ],
  },
  {
    key: "tipo",
    texto: "¿Qué buscás?",
    opciones: [
      { valor: "artesanal", label: "Algo hecho a mano" },
      { valor: "cosmetica-hogar", label: "Cosmética y hogar" },
      { valor: "accesorio", label: "Un accesorio" },
    ],
  },
];

function calcularSeleccion(respuestas) {
  const puntajes = PRODUCTOS.map((p) => {
    let score = 0;
    Object.values(respuestas).forEach((r) => {
      if (p.perfil.includes(r)) score += 1;
    });
    return { p, score };
  });
  puntajes.sort((a, b) => b.score - a.score);
  const top = [];
  const vistos = new Set();
  for (const { p } of puntajes) {
    if (top.length >= 3) break;
    if (vistos.has(p.categoria) && top.length < 2) continue;
    top.push(p);
    vistos.add(p.categoria);
  }
  while (top.length < 3) {
    const extra = puntajes.find(({ p }) => !top.includes(p));
    if (!extra) break;
    top.push(extra.p);
  }
  return top;
}

function initConsultivo() {
  const wrap = document.getElementById("consultivoWrap");
  if (!wrap) return;
  const pasos = [...wrap.querySelectorAll(".consultivo-paso")];
  const resultado = document.getElementById("consultivoResultado");
  const respuestas = {};
  let paso = 0;

  function mostrarPaso(i) {
    pasos.forEach((s, idx) => s.classList.toggle("is-active", idx === i));
    resultado.classList.remove("is-active");
  }

  function finalizar() {
    const elegidos = calcularSeleccion(respuestas);
    const cont = document.getElementById("consultivoProductos");
    cont.innerHTML = elegidos
      .map(
        (p) => `<div class="consultivo-card">
        <img src="images/${p.img}" width="1200" height="1200" alt="${esc(p.nombre)}">
        <div class="consultivo-card-body">
          <span class="chip">${esc(CATEGORIAS[p.categoria])}</span>
          <h3>${esc(p.nombre)}</h3>
          <p>${formatearPrecio(precioFinal(p))}</p>
          <button type="button" class="btn btn-ghost consultivo-add" data-add="${p.id}">Agregar al carrito</button>
        </div>
      </div>`,
      )
      .join("");
    pasos.forEach((s) => s.classList.remove("is-active"));
    resultado.classList.add("is-active");
  }

  wrap.addEventListener("click", (e) => {
    const chip = e.target.closest("[data-consultivo-valor]");
    if (!chip) return;
    const pregunta = CONSULTIVO_PREGUNTAS[paso];
    respuestas[pregunta.key] = chip.dataset.consultivoValor;
    chip
      .closest(".consultivo-chips")
      .querySelectorAll(".chip-btn")
      .forEach((c) => c.classList.toggle("is-picked", c === chip));
    if (paso < CONSULTIVO_PREGUNTAS.length - 1) {
      paso++;
      setTimeout(() => mostrarPaso(paso), 250);
    } else {
      setTimeout(finalizar, 250);
    }
  });

  document.getElementById("consultivoRestart")?.addEventListener("click", (e) => {
    e.preventDefault();
    paso = 0;
    delete respuestas.para;
    delete respuestas.tipo;
    wrap.querySelectorAll(".chip-btn.is-picked").forEach((c) => c.classList.remove("is-picked"));
    mostrarPaso(0);
  });
}

function initMagnetic() {
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  if (typeof gsap === "undefined") return;
  document.querySelectorAll(".magnetic").forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const r = btn.getBoundingClientRect();
      gsap.to(btn, {
        x: (e.clientX - r.left - r.width / 2) * 0.2,
        y: (e.clientY - r.top - r.height / 2) * 0.2,
        duration: 0.3,
      });
    });
    btn.addEventListener("mouseleave", () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.45, ease: "elastic.out(1, .55)" });
    });
  });
}

function initHeroEntrance() {
  if (typeof gsap === "undefined" || reduceMotion) return;
  gsap.fromTo(
    ".hero-protagonista img",
    { scale: 1.1 },
    { scale: 1, duration: 1.4, ease: "expo.out" },
  );
}

function initJsonLd() {
  const productos = PRODUCTOS.map((p) => ({
    "@type": "Product",
    name: p.nombre,
    image: `images/${p.img}`,
    offers: {
      "@type": "Offer",
      price: precioFinal(p),
      priceCurrency: "ARS",
      availability: "https://schema.org/InStock",
    },
  }));
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Store",
        name: "De todo un poco Sol",
        description: "Emprendimiento de artículos varios: artesanías en cuero, tejidos, sahumerios, porcelana fría, accesorios, y reventa de Natura y Tupperware.",
        telephone: `+${WHATSAPP_NUMBER}`,
      },
      ...productos,
    ],
  };
  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
}

document.addEventListener("DOMContentLoaded", () => {
  const anioEl = document.getElementById("anioActual");
  if (anioEl) anioEl.textContent = new Date().getFullYear();

  initCategorias();
  initRail();
  initCatalogo();

  initNav();
  initWspLinks();
  initReveals();
  initCarrito();
  initModal();
  initConsultivo();
  initMagnetic();
  initHeroEntrance();
  initJsonLd();

  window.addEventListener("load", () => {
    if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
  });
});
