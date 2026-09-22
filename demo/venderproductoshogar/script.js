const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

/* ============ FIXTURES ============ */
const PRODUCTOS = [
  // ---- HOGAR / TEXTILES ----
  {
    id: "manta-algodon-trenzada",
    nombre: "Manta de algodón trenzada",
    categoria: "hogar",
    subcategoria: "textiles",
    precio: 34000,
    descuento: 0,
    stock: 8,
    nuevo: false,
    destacado: true,
    imagen: "hogar-living-9x16.webp",
    foco: "30% 75%",
    descripcion:
      "Manta tejida en algodón grueso, con flecos, ideal para el sillón o los pies de la cama.",
    tags: ["manta", "algodon", "living", "invierno"],
  },
  {
    id: "toallas-algodon-x2",
    nombre: "Juego de toallas de algodón x2",
    categoria: "hogar",
    subcategoria: "textiles",
    precio: 28500,
    descuento: 0,
    stock: 14,
    nuevo: false,
    destacado: false,
    imagen: "hogar-textiles-1x1.webp",
    foco: "30% 70%",
    descripcion:
      "Dos toallas de algodón rizado, una lisa y una con vivo, en tonos verdes y crudos.",
    tags: ["toallas", "bano", "algodon"],
  },
  {
    id: "almohadon-bordado-hojas",
    nombre: "Almohadón bordado hojas",
    categoria: "hogar",
    subcategoria: "textiles",
    precio: 19900,
    descuento: 15,
    stock: 6,
    nuevo: true,
    destacado: false,
    imagen: "hogar-textiles-1x1.webp",
    foco: "68% 45%",
    descripcion:
      "Funda de almohadón en lino crudo con bordado de hojas, cierre invisible.",
    tags: ["almohadon", "bordado", "lino"],
  },
  {
    id: "almohadon-liso-lino",
    nombre: "Almohadón liso de lino",
    categoria: "hogar",
    subcategoria: "textiles",
    precio: 14500,
    descuento: 0,
    stock: 20,
    nuevo: false,
    destacado: true,
    imagen: "hogar-textiles-1x1.webp",
    foco: "20% 25%",
    descripcion: "Almohadón liso en lino verde salvia, relleno incluido.",
    tags: ["almohadon", "lino", "verde"],
  },
  {
    id: "funda-textura-natural",
    nombre: "Funda de almohadón texturada",
    categoria: "hogar",
    subcategoria: "textiles",
    precio: 12900,
    descuento: 0,
    stock: 3,
    nuevo: false,
    destacado: false,
    imagen: "hogar-textiles-1x1.webp",
    foco: "75% 80%",
    descripcion: "Funda con textura de espiga en algodón grueso, tono crudo.",
    tags: ["almohadon", "textura"],
  },
  {
    id: "carpeta-mesa-lino",
    nombre: "Carpeta de mesa de lino",
    categoria: "hogar",
    subcategoria: "textiles",
    precio: 16800,
    descuento: 0,
    stock: 11,
    nuevo: false,
    destacado: false,
    imagen: "hogar-textiles-1x1.webp",
    foco: "50% 10%",
    descripcion:
      "Carpeta individual de lino grueso, borde con dobladillo a mano.",
    tags: ["mesa", "lino", "carpeta"],
  },

  // ---- HOGAR / COCINA Y MESA ----
  {
    id: "set-platos-ceramica-x6",
    nombre: "Set de platos de cerámica x6",
    categoria: "hogar",
    subcategoria: "cocina",
    precio: 52000,
    descuento: 0,
    stock: 5,
    nuevo: false,
    destacado: true,
    imagen: "hogar-cocina-1x1.webp",
    foco: "38% 68%",
    descripcion: "Seis platos de cerámica esmaltada, tono arena, apilables.",
    tags: ["platos", "ceramica", "vajilla"],
  },
  {
    id: "tazas-ceramica-artesanal-x2",
    nombre: "Tazas de cerámica artesanal x2",
    categoria: "hogar",
    subcategoria: "cocina",
    precio: 18500,
    descuento: 0,
    stock: 16,
    nuevo: true,
    destacado: false,
    imagen: "hogar-cocina-1x1.webp",
    foco: "12% 55%",
    descripcion:
      "Dos tazas de cerámica torneada a mano, con leve moteado en el esmalte.",
    tags: ["tazas", "ceramica", "cafe"],
  },
  {
    id: "frasco-hermetico-madera",
    nombre: "Frasco hermético con tapa de madera",
    categoria: "hogar",
    subcategoria: "cocina",
    precio: 9800,
    descuento: 0,
    stock: 22,
    nuevo: false,
    destacado: false,
    imagen: "hogar-cocina-1x1.webp",
    foco: "65% 40%",
    descripcion:
      "Frasco de vidrio con tapa de madera de acacia, cierre hermético.",
    tags: ["frasco", "vidrio", "almacenamiento"],
  },
  {
    id: "bandeja-madera-acacia",
    nombre: "Bandeja de madera de acacia",
    categoria: "hogar",
    subcategoria: "cocina",
    precio: 22400,
    descuento: 10,
    stock: 9,
    nuevo: false,
    destacado: false,
    imagen: "hogar-cocina-1x1.webp",
    foco: "85% 60%",
    descripcion: "Bandeja tallada en una sola pieza de madera de acacia.",
    tags: ["bandeja", "madera"],
  },
  {
    id: "servilletas-lino-x4",
    nombre: "Servilletas de lino x4",
    categoria: "hogar",
    subcategoria: "cocina",
    precio: 11200,
    descuento: 0,
    stock: 18,
    nuevo: false,
    destacado: false,
    imagen: "hogar-cocina-1x1.webp",
    foco: "20% 90%",
    descripcion:
      "Cuatro servilletas de lino grueso, borde con puntada rústica.",
    tags: ["servilletas", "lino", "mesa"],
  },

  // ---- HOGAR / DECORACIÓN ----
  {
    id: "cesto-tejido-grande",
    nombre: "Cesto tejido grande",
    categoria: "hogar",
    subcategoria: "decoracion",
    precio: 26500,
    descuento: 0,
    stock: 7,
    nuevo: false,
    destacado: false,
    imagen: "hogar-consola-16x9.webp",
    foco: "22% 75%",
    descripcion:
      "Cesto de fibra natural tejida a mano, con asas, para mantas o juguetes.",
    tags: ["cesto", "organizador", "fibra"],
  },
  {
    id: "cesto-tejido-mediano",
    nombre: "Cesto tejido mediano",
    categoria: "hogar",
    subcategoria: "decoracion",
    precio: 19900,
    descuento: 0,
    stock: 10,
    nuevo: false,
    destacado: false,
    imagen: "hogar-consola-16x9.webp",
    foco: "38% 78%",
    descripcion:
      "Versión mediana del cesto de fibra natural, ideal para revistas o hilos.",
    tags: ["cesto", "organizador"],
  },
  {
    id: "vela-aromatica-ceramica",
    nombre: "Vela aromática en cerámica",
    categoria: "hogar",
    subcategoria: "decoracion",
    precio: 8400,
    descuento: 0,
    stock: 2,
    nuevo: false,
    destacado: false,
    imagen: "hogar-consola-16x9.webp",
    foco: "58% 45%",
    descripcion:
      "Vela de soja en recipiente de cerámica reutilizable, aroma a madera y cedro.",
    tags: ["vela", "aroma", "ceramica"],
  },
  {
    id: "florero-ceramica-esmaltada",
    nombre: "Florero de cerámica esmaltada",
    categoria: "hogar",
    subcategoria: "decoracion",
    precio: 17600,
    descuento: 0,
    stock: 12,
    nuevo: true,
    destacado: true,
    imagen: "hogar-consola-16x9.webp",
    foco: "14% 30%",
    descripcion: "Florero de cerámica esmaltada color hueso, base ancha.",
    tags: ["florero", "ceramica", "deco"],
  },
  {
    id: "espejo-redondo-madera",
    nombre: "Espejo redondo de madera",
    categoria: "hogar",
    subcategoria: "decoracion",
    precio: 38900,
    descuento: 12,
    stock: 4,
    nuevo: false,
    destacado: false,
    imagen: "hogar-consola-16x9.webp",
    foco: "44% 20%",
    descripcion: "Espejo circular con marco de madera clara, 45cm de diámetro.",
    tags: ["espejo", "madera", "deco"],
  },

  // ---- NIÑOS / BEBÉS 0-12 MESES ----
  {
    id: "body-algodon-manga-corta",
    nombre: "Body de algodón manga corta",
    categoria: "ninos",
    subcategoria: "bebes",
    talle: "0-3M",
    precio: 7900,
    descuento: 0,
    stock: 25,
    nuevo: false,
    destacado: true,
    imagen: "ninos-flatlay-1x1.webp",
    foco: "30% 30%",
    descripcion:
      "Body de algodón orgánico con abertura de fácil cambiado, manga corta.",
    tags: ["body", "bebe", "algodon"],
  },
  {
    id: "ranita-gasa-algodon",
    nombre: "Ranita de gasa de algodón",
    categoria: "ninos",
    subcategoria: "bebes",
    talle: "0-3M",
    precio: 8900,
    descuento: 0,
    stock: 3,
    nuevo: false,
    destacado: false,
    imagen: "ninos-flatlay-1x1.webp",
    foco: "60% 65%",
    descripcion:
      "Ranita en gasa de algodón doble capa, con broches interpierna.",
    tags: ["ranita", "bebe", "gasa"],
  },
  {
    id: "conjunto-body-pantalon",
    nombre: "Conjunto body + pantalón",
    categoria: "ninos",
    subcategoria: "bebes",
    talle: "3-6M",
    precio: 12400,
    descuento: 0,
    stock: 14,
    nuevo: false,
    destacado: false,
    imagen: "ninos-flatlay-1x1.webp",
    foco: "45% 15%",
    descripcion:
      "Conjunto de body de algodón y pantalón con puño, para el día a día.",
    tags: ["conjunto", "bebe"],
  },
  {
    id: "saco-punto-bebe",
    nombre: "Saco de punto",
    categoria: "ninos",
    subcategoria: "bebes",
    talle: "3-6M",
    precio: 15800,
    descuento: 0,
    stock: 9,
    nuevo: true,
    destacado: false,
    imagen: "ninos-percha-1x1.webp",
    foco: "78% 40%",
    descripcion: "Saco tejido en punto trenzado, abotonado, en tono crudo.",
    tags: ["saco", "punto", "bebe"],
  },
  {
    id: "vestido-gasa-floreado-bebe",
    nombre: "Vestido de gasa floreado",
    categoria: "ninos",
    subcategoria: "bebes",
    talle: "6-12M",
    precio: 13900,
    descuento: 18,
    stock: 6,
    nuevo: false,
    destacado: true,
    imagen: "ninos-percha-1x1.webp",
    foco: "25% 35%",
    descripcion:
      "Vestido de gasa de algodón con estampa floral y cuello con volado.",
    tags: ["vestido", "bebe", "floreado"],
  },
  {
    id: "body-manga-larga",
    nombre: "Body manga larga",
    categoria: "ninos",
    subcategoria: "bebes",
    talle: "6-12M",
    precio: 8500,
    descuento: 0,
    stock: 20,
    nuevo: false,
    destacado: false,
    imagen: "ninos-flatlay-1x1.webp",
    foco: "15% 60%",
    descripcion:
      "Body de algodón manga larga, cuello cruzado para pasar fácil.",
    tags: ["body", "bebe"],
  },
  {
    id: "enterito-corderoy",
    nombre: "Enterito de corderoy",
    categoria: "ninos",
    subcategoria: "bebes",
    talle: "6-12M",
    precio: 17200,
    descuento: 0,
    stock: 8,
    nuevo: false,
    destacado: false,
    imagen: "ninos-percha-1x1.webp",
    foco: "85% 70%",
    descripcion:
      "Enterito con peto de corderoy, tiradores con botones de madera.",
    tags: ["enterito", "corderoy", "bebe"],
  },

  // ---- NIÑOS / 1-2 AÑOS ----
  {
    id: "conjunto-remera-short-lino",
    nombre: "Conjunto remera + short de lino",
    categoria: "ninos",
    subcategoria: "chicos",
    talle: "1-2A",
    precio: 11500,
    descuento: 0,
    stock: 13,
    nuevo: false,
    destacado: false,
    imagen: "ninos-flatlay-1x1.webp",
    foco: "55% 45%",
    descripcion:
      "Remera de algodón lisa y short de lino con cordón, para el verano.",
    tags: ["conjunto", "nino", "lino"],
  },
  {
    id: "vestido-cardigan-floreado",
    nombre: "Vestido floreado con cardigan",
    categoria: "ninos",
    subcategoria: "chicos",
    talle: "1-2A",
    precio: 18900,
    descuento: 0,
    stock: 7,
    nuevo: true,
    destacado: true,
    imagen: "ninos-percha-1x1.webp",
    foco: "20% 20%",
    descripcion:
      "Vestido floreado de algodón con cardigan tejido en rosa viejo a juego.",
    tags: ["vestido", "nina", "cardigan"],
  },
  {
    id: "jardinero-corderoy",
    nombre: "Jardinero de corderoy",
    categoria: "ninos",
    subcategoria: "chicos",
    talle: "1-2A",
    precio: 16400,
    descuento: 0,
    stock: 10,
    nuevo: false,
    destacado: false,
    imagen: "ninos-percha-1x1.webp",
    foco: "60% 75%",
    descripcion:
      "Jardinero de corderoy verde, bolsillo delantero, tiradores ajustables.",
    tags: ["jardinero", "corderoy", "nino"],
  },
  {
    id: "sweater-punto-trenzado",
    nombre: "Sweater de punto trenzado",
    categoria: "ninos",
    subcategoria: "chicos",
    talle: "1-2A",
    precio: 14900,
    descuento: 20,
    stock: 5,
    nuevo: false,
    destacado: false,
    imagen: "ninos-percha-1x1.webp",
    foco: "35% 55%",
    descripcion: "Sweater de punto grueso con trenzas, cuello redondo.",
    tags: ["sweater", "punto", "nino"],
  },
  {
    id: "camisa-gasa-algodon",
    nombre: "Camisa de gasa de algodón",
    categoria: "ninos",
    subcategoria: "chicos",
    talle: "1-2A",
    precio: 9800,
    descuento: 0,
    stock: 15,
    nuevo: false,
    destacado: false,
    imagen: "ninos-flatlay-1x1.webp",
    foco: "40% 80%",
    descripcion: "Camisa de gasa de algodón con botones de nácar, manga corta.",
    tags: ["camisa", "gasa", "nino"],
  },

  // ---- NIÑOS / ACCESORIOS ----
  {
    id: "sombrero-bucket-lino",
    nombre: "Sombrero bucket de lino",
    categoria: "ninos",
    subcategoria: "accesorios",
    talle: "",
    precio: 9400,
    descuento: 0,
    stock: 11,
    nuevo: false,
    destacado: true,
    imagen: "ninos-flatlay-1x1.webp",
    foco: "78% 18%",
    descripcion: "Sombrero tipo bucket en lino, ala con costura reforzada.",
    tags: ["sombrero", "accesorio"],
  },
  {
    id: "sandalias-cuero-bebe",
    nombre: "Sandalias de cuero",
    categoria: "ninos",
    subcategoria: "accesorios",
    talle: "",
    precio: 16900,
    descuento: 0,
    stock: 6,
    nuevo: false,
    destacado: false,
    imagen: "ninos-flatlay-1x1.webp",
    foco: "80% 82%",
    descripcion: "Sandalias de cuero genuino con hebilla, suela flexible.",
    tags: ["sandalias", "calzado", "cuero"],
  },
  {
    id: "gorro-punto-bebe",
    nombre: "Gorro de punto",
    categoria: "ninos",
    subcategoria: "accesorios",
    talle: "",
    precio: 6200,
    descuento: 0,
    stock: 17,
    nuevo: false,
    destacado: false,
    imagen: "ninos-percha-1x1.webp",
    foco: "10% 8%",
    descripcion: "Gorro tejido en punto liso, con pompón.",
    tags: ["gorro", "punto", "accesorio"],
  },
  {
    id: "babero-gasa-x2",
    nombre: "Babero de gasa x2",
    categoria: "ninos",
    subcategoria: "accesorios",
    talle: "",
    precio: 5400,
    descuento: 0,
    stock: 24,
    nuevo: false,
    destacado: false,
    imagen: "ninos-flatlay-1x1.webp",
    foco: "50% 50%",
    descripcion:
      "Dos baberos de gasa de algodón de seis capas, con broche ajustable.",
    tags: ["babero", "accesorio", "bebe"],
  },
];

const SUBCAT_LABELS = {
  textiles: "Textiles",
  cocina: "Cocina y mesa",
  decoracion: "Decoración",
  bebes: "Bebés",
  chicos: "1-2 años",
  accesorios: "Accesorios",
};
const subcatLabel = (s) => SUBCAT_LABELS[s] || s;
const catLabel = (p) =>
  `${p.categoria === "hogar" ? "Hogar" : "Niños"} · ${subcatLabel(p.subcategoria)}`;

/* ============ HELPERS ============ */
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
const normalizar = (s) =>
  String(s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

/* ============ CART CANÓNICO ============ */
const Cart = {
  KEY: "nido_cart",
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

/* ============ TOAST ============ */
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

/* ============ ANTI-COPIA ============ */
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

/* ============ BARRA DE MODELOS ============ */
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

/* ============ NAV MOBILE ============ */
function initNav() {
  const toggle = document.getElementById("menuToggle");
  const nav = document.getElementById("mainNav");
  const closeBtn = document.getElementById("navClose");
  if (!toggle || !nav) return;
  let bd = document.getElementById("navBackdrop");
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

/* ============ REVEALS ============ */
function initReveals() {
  const items = document.querySelectorAll("[data-animate]");
  if (!items.length) return;
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

/* ============ HERO ROTATOR ============ */
function initHeroRotator() {
  const rotator = document.querySelector(".hero-rotator");
  if (!rotator) return;
  const spans = rotator.querySelectorAll("span");
  if (spans.length < 2 || reduceMotion) return;
  let i = 0;
  window.setInterval(() => {
    spans[i].classList.remove("is-active");
    i = (i + 1) % spans.length;
    spans[i].classList.add("is-active");
  }, 4200);
}

/* ============ FLOTANTES + BADGE ============ */
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
  cart?.addEventListener("click", openCartDrawer);
  sync();
}

/* ============ ELEGÍ TU MUNDO (momento propio) ============ */
function syncAllFilterUI() {
  document
    .querySelectorAll("#chipsCategoria .chip")
    .forEach((c) =>
      c.setAttribute(
        "aria-pressed",
        String(c.dataset.cat === (filtroState.categoria[0] || "")),
      ),
    );
  document.querySelectorAll('input[data-f="categoria"]').forEach((cb) => {
    cb.checked = filtroState.categoria.includes(cb.value);
  });
  const activo =
    filtroState.categoria.length === 1 ? filtroState.categoria[0] : "";
  const grid = document.getElementById("mundosGrid");
  if (grid) grid.dataset.activo = activo;
  document
    .querySelectorAll(".mundos__panel")
    .forEach((p) =>
      p.setAttribute("aria-pressed", String(p.dataset.mundo === activo)),
    );
  const estado = document.getElementById("mundosEstado");
  if (estado) {
    if (activo === "hogar")
      estado.textContent = `Mostrando Hogar · ${PRODUCTOS.filter((p) => p.categoria === "hogar").length} productos`;
    else if (activo === "ninos")
      estado.textContent = `Mostrando Niños · ${PRODUCTOS.filter((p) => p.categoria === "ninos").length} productos`;
    else estado.textContent = "Elegí un mundo para ver su catálogo";
  }
  const talleGrupo = document.getElementById("filtroTalleGrupo");
  if (talleGrupo)
    talleGrupo.hidden =
      filtroState.categoria.length === 1 &&
      filtroState.categoria[0] === "hogar";
}

function initMundos() {
  const grid = document.getElementById("mundosGrid");
  if (!grid) return;
  const nHogar = PRODUCTOS.filter((p) => p.categoria === "hogar").length;
  const nNinos = PRODUCTOS.filter((p) => p.categoria === "ninos").length;
  const ch = document.getElementById("countHogar");
  if (ch) ch.textContent = `${nHogar} productos`;
  const cn = document.getElementById("countNinos");
  if (cn) cn.textContent = `${nNinos} productos`;
  grid.querySelectorAll(".mundos__panel").forEach((panel) => {
    panel.addEventListener("click", () => {
      const mundo = panel.dataset.mundo;
      const yaActivo = grid.dataset.activo === mundo;
      filtroState.categoria = yaActivo ? [] : [mundo];
      filtroState.mostrar = 16;
      syncAllFilterUI();
      renderCatalogo();
      document
        .getElementById("tienda")
        ?.scrollIntoView({
          behavior: reduceMotion ? "auto" : "smooth",
          block: "start",
        });
    });
  });
}

/* ============ CARD DE PRODUCTO (reusada en catálogo, rail y relacionados) ============ */
function prodCardHTML(p) {
  const precioF = precioFinal(p);
  const badges = [];
  if (p.nuevo)
    badges.push('<span class="prod-badge prod-badge--nuevo">Nuevo</span>');
  if (p.stock <= 3)
    badges.push(
      '<span class="prod-badge prod-badge--stock">Últimas unidades</span>',
    );
  if (p.descuento > 0)
    badges.push(
      `<span class="prod-badge prod-badge--off">-${p.descuento}%</span>`,
    );
  return `
  <article class="prod-card" data-id="${p.id}">
    <div class="prod-media">
      ${badges.length ? `<div class="prod-badges">${badges.join("")}</div>` : ""}
      <button type="button" class="prod-quick" data-quickview="${p.id}" aria-label="Vista rápida de ${esc(p.nombre)}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z"/><circle cx="12" cy="12" r="3"/></svg>
      </button>
      <img src="images/${p.imagen}" alt="${esc(p.nombre)}" style="object-position:${p.foco || "50% 50%"}" loading="lazy" width="600" height="600">
    </div>
    <div class="prod-body">
      <p class="prod-cat">${esc(catLabel(p))}</p>
      <p class="prod-nombre">${esc(p.nombre)}</p>
      <div class="prod-precio-row">
        <span class="prod-precio">${formatearPrecio(precioF)}</span>
        ${p.descuento > 0 ? `<span class="prod-precio-orig">${formatearPrecio(p.precio)}</span>` : ""}
      </div>
      <div class="prod-actions">
        <button type="button" class="prod-add" data-add="${p.id}">Agregar al carrito</button>
      </div>
    </div>
  </article>`;
}

/* click delegado: agregar al carrito y abrir vista rápida desde cualquier grilla */
document.addEventListener("click", (e) => {
  const addBtn = e.target.closest("[data-add]");
  if (addBtn) {
    const p = getProducto(addBtn.dataset.add);
    if (p) {
      Cart.add(p, 1);
      showToast(`${p.nombre} agregado al carrito`);
    }
  }
  const qvBtn = e.target.closest("[data-quickview]");
  if (qvBtn) openQuickview(qvBtn.dataset.quickview);
});

/* ============ RAIL DE DESTACADOS ============ */
function renderRail() {
  const track = document.getElementById("railDestacadosTrack");
  if (!track) return;
  const destacados = PRODUCTOS.filter((p) => p.destacado);
  track.innerHTML = destacados
    .map((p) => `<div class="rail-card">${prodCardHTML(p)}</div>`)
    .join("");
}

let railTicking = false;
function initRailDrag() {
  const vp = document.getElementById("railDestacados");
  const prev = document.getElementById("railPrev");
  const next = document.getElementById("railNext");
  if (!vp) return;
  const track = vp.querySelector(".rail-track");
  let startX = 0,
    startScroll = 0,
    moved = false,
    pointerId = null,
    dragging = false;

  vp.addEventListener("pointerdown", (e) => {
    dragging = true;
    moved = false;
    startX = e.clientX;
    startScroll = vp.scrollLeft;
    pointerId = e.pointerId;
  });
  vp.addEventListener("pointermove", (e) => {
    if (!dragging) return;
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
    if (moved) vp.scrollLeft = startScroll - dx;
  });
  const end = () => {
    if (!dragging) return;
    dragging = false;
    if (moved) {
      try {
        vp.releasePointerCapture?.(pointerId);
      } catch {
        /* ya liberado */
      }
      setTimeout(() => vp.classList.remove("dragging"), 50);
    }
  };
  vp.addEventListener("pointerup", end);
  vp.addEventListener("pointercancel", end);
  vp.addEventListener("pointerleave", end);
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

  const updateArrows = () => {
    if (!prev || !next || !track) return;
    const inicio =
      parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
    prev.disabled = vp.scrollLeft <= inicio + 2;
    next.disabled = vp.scrollLeft >= vp.scrollWidth - vp.clientWidth - 2;
  };
  prev?.addEventListener("click", () =>
    vp.scrollBy({ left: -320, behavior: reduceMotion ? "auto" : "smooth" }),
  );
  next?.addEventListener("click", () =>
    vp.scrollBy({ left: 320, behavior: reduceMotion ? "auto" : "smooth" }),
  );
  vp.addEventListener(
    "scroll",
    () => {
      if (!railTicking) {
        railTicking = true;
        requestAnimationFrame(() => {
          updateArrows();
          railTicking = false;
        });
      }
    },
    { passive: true },
  );
  updateArrows();
}

/* ============ ARMÁ TU SET DE BIENVENIDA (componente funcional) ============ */
const EDAD_LABEL = {
  "0-3M": "un recién nacido",
  "3-6M": "un bebé de 3 a 6 meses",
  "6-12M": "un bebé de 6 a 12 meses",
  "1-2A": "un peque de 1 a 2 años",
};
let armadorState = { edad: "0-3M", set: "esencial" };

function calcularSet(edad, tier) {
  const ninosEdad = PRODUCTOS.filter(
    (p) =>
      p.categoria === "ninos" &&
      p.talle === edad &&
      p.subcategoria !== "accesorios",
  );
  const items = [];
  const prenda1 = ninosEdad[0];
  if (prenda1) items.push(prenda1);
  const textil = PRODUCTOS.find((p) => p.id === "manta-algodon-trenzada");
  if (textil) items.push(textil);
  if (tier === "completo" || tier === "grande") {
    const prenda2 = ninosEdad.find((p) => p.id !== prenda1?.id);
    if (prenda2) items.push(prenda2);
  }
  if (tier === "grande") {
    const accesorio = PRODUCTOS.find(
      (p) => p.categoria === "ninos" && p.subcategoria === "accesorios",
    );
    if (accesorio) items.push(accesorio);
    const decor = PRODUCTOS.find(
      (p) => p.categoria === "hogar" && p.subcategoria === "decoracion",
    );
    if (decor) items.push(decor);
  }
  return items;
}

function renderArmador() {
  const items = calcularSet(armadorState.edad, armadorState.set);
  const titulo = document.getElementById("armadorTitulo");
  const lista = document.getElementById("armadorLista");
  const total = document.getElementById("armadorTotal");
  const btn = document.getElementById("armadorAgregar");
  if (!lista) return;
  if (titulo)
    titulo.textContent = `Tu set para ${EDAD_LABEL[armadorState.edad]}`;
  if (!items.length) {
    lista.innerHTML =
      '<p class="armador-vacio">No encontramos productos para esa combinación todavía.</p>';
    if (total) total.textContent = "$0";
    if (btn) btn.disabled = true;
    return;
  }
  lista.innerHTML = items
    .map(
      (p) => `
    <div class="set-item">
      <img src="images/${p.imagen}" alt="${esc(p.nombre)}" style="object-position:${p.foco || "50% 50%"}" loading="lazy">
      <div class="set-item-info">
        <p class="set-item-nombre">${esc(p.nombre)}</p>
        <p class="set-item-precio">${formatearPrecio(precioFinal(p))}</p>
      </div>
    </div>`,
    )
    .join("");
  const subtotal = items.reduce((s, p) => s + precioFinal(p), 0);
  if (total) total.textContent = formatearPrecio(subtotal);
  if (btn) {
    btn.disabled = false;
    btn.dataset.ids = items.map((p) => p.id).join(",");
  }
}

function initArmador() {
  const chipsEdad = document.getElementById("chipsEdad");
  const chipsSet = document.getElementById("chipsPresupuesto");
  if (!chipsEdad || !chipsSet) return;
  chipsEdad.querySelectorAll(".chip").forEach((chip) =>
    chip.addEventListener("click", () => {
      chipsEdad
        .querySelectorAll(".chip")
        .forEach((c) => c.setAttribute("aria-pressed", "false"));
      chip.setAttribute("aria-pressed", "true");
      armadorState.edad = chip.dataset.edad;
      renderArmador();
    }),
  );
  chipsSet.querySelectorAll(".chip").forEach((chip) =>
    chip.addEventListener("click", () => {
      chipsSet
        .querySelectorAll(".chip")
        .forEach((c) => c.setAttribute("aria-pressed", "false"));
      chip.setAttribute("aria-pressed", "true");
      armadorState.set = chip.dataset.set;
      renderArmador();
    }),
  );
  document.getElementById("armadorAgregar")?.addEventListener("click", (e) => {
    const ids = (e.currentTarget.dataset.ids || "").split(",").filter(Boolean);
    if (!ids.length) return;
    ids.forEach((id) => {
      const p = getProducto(id);
      if (p) Cart.add(p, 1);
    });
    showToast(`Set agregado al carrito (${ids.length} productos)`);
    openCartDrawer();
  });
  renderArmador();
}

/* ============ CATÁLOGO + FILTROS ============ */
let filtroState = {
  categoria: [],
  subcategoria: [],
  talle: [],
  precioMin: null,
  precioMax: null,
  orden: "relevancia",
  busqueda: "",
  mostrar: 16,
};

function productosFiltrados() {
  let list = PRODUCTOS.slice();
  if (filtroState.categoria.length)
    list = list.filter((p) => filtroState.categoria.includes(p.categoria));
  if (filtroState.subcategoria.length)
    list = list.filter((p) =>
      filtroState.subcategoria.includes(p.subcategoria),
    );
  if (filtroState.talle.length)
    list = list.filter((p) => filtroState.talle.includes(p.talle));
  if (filtroState.precioMin != null)
    list = list.filter((p) => {
      const pf = precioFinal(p);
      return pf >= filtroState.precioMin && pf <= filtroState.precioMax;
    });
  if (filtroState.busqueda) {
    const q = normalizar(filtroState.busqueda);
    list = list.filter((p) =>
      normalizar(
        `${p.nombre} ${catLabel(p)} ${p.descripcion} ${(p.tags || []).join(" ")}`,
      ).includes(q),
    );
  }
  if (filtroState.orden === "menor")
    list.sort((a, b) => precioFinal(a) - precioFinal(b));
  else if (filtroState.orden === "mayor")
    list.sort((a, b) => precioFinal(b) - precioFinal(a));
  else if (filtroState.orden === "nuevo")
    list.sort((a, b) => (b.nuevo ? 1 : 0) - (a.nuevo ? 1 : 0));
  return list;
}

function renderCatalogo() {
  const grid = document.getElementById("catalogoGrid");
  if (!grid) return;
  const todos = productosFiltrados();
  const visibles = todos.slice(0, filtroState.mostrar);
  const count = document.getElementById("catalogoCount");
  if (count) count.textContent = String(todos.length);
  if (!visibles.length) {
    grid.innerHTML = `<div class="catalogo-vacio"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg><p>No encontramos productos con esos filtros.</p></div>`;
  } else {
    grid.innerHTML = visibles.map(prodCardHTML).join("");
  }
  const more = document.getElementById("catalogoMore");
  if (more) more.hidden = visibles.length >= todos.length;
}

function initFiltroSubcategoriaUI() {
  const el = document.getElementById("filtroSubcategoria");
  if (!el) return;
  const opts = [
    ["textiles", "Textiles (Hogar)"],
    ["cocina", "Cocina y mesa (Hogar)"],
    ["decoracion", "Decoración (Hogar)"],
    ["bebes", "Bebés (Niños)"],
    ["chicos", "1-2 años (Niños)"],
    ["accesorios", "Accesorios (Niños)"],
  ];
  el.innerHTML = opts
    .map(
      ([v, l]) =>
        `<label class="filtro-opt"><input type="checkbox" data-f="subcategoria" value="${v}"> ${l}</label>`,
    )
    .join("");
}

function initCatalogo() {
  initFiltroSubcategoriaUI();

  document.querySelectorAll("#chipsCategoria .chip").forEach((chip) =>
    chip.addEventListener("click", () => {
      const cat = chip.dataset.cat;
      filtroState.categoria = cat ? [cat] : [];
      filtroState.mostrar = 16;
      syncAllFilterUI();
      renderCatalogo();
    }),
  );

  document.getElementById("filtrosPanel")?.addEventListener("change", (e) => {
    const input = e.target.closest("input[data-f]");
    if (!input) return;
    const grupo = input.dataset.f;
    filtroState[grupo] = [
      ...document.querySelectorAll(`input[data-f="${grupo}"]:checked`),
    ].map((i) => i.value);
    filtroState.mostrar = 16;
    if (grupo === "categoria") syncAllFilterUI();
    renderCatalogo();
  });

  document.getElementById("filtroPrecio")?.addEventListener("change", (e) => {
    const v = e.target.value;
    if (!v) {
      filtroState.precioMin = null;
      filtroState.precioMax = null;
    } else {
      const [min, max] = v.split("-").map(Number);
      filtroState.precioMin = min;
      filtroState.precioMax = max;
    }
    filtroState.mostrar = 16;
    renderCatalogo();
  });

  document.getElementById("filtroOrden")?.addEventListener("change", (e) => {
    filtroState.orden = e.target.value;
    renderCatalogo();
  });

  document.getElementById("catalogoClear")?.addEventListener("click", () => {
    filtroState = {
      categoria: [],
      subcategoria: [],
      talle: [],
      precioMin: null,
      precioMax: null,
      orden: "relevancia",
      busqueda: "",
      mostrar: 16,
    };
    document
      .querySelectorAll("#filtrosPanel input[type=checkbox]")
      .forEach((i) => {
        i.checked = false;
      });
    const precioSel = document.getElementById("filtroPrecio");
    if (precioSel) precioSel.value = "";
    const ordenSel = document.getElementById("filtroOrden");
    if (ordenSel) ordenSel.value = "relevancia";
    const searchInput = document.getElementById("headerSearchInput");
    if (searchInput) searchInput.value = "";
    syncAllFilterUI();
    renderCatalogo();
  });

  document.getElementById("catalogoMore")?.addEventListener("click", () => {
    filtroState.mostrar += 16;
    renderCatalogo();
  });

  document
    .getElementById("headerSearchForm")
    ?.addEventListener("submit", (e) => {
      e.preventDefault();
      filtroState.busqueda = document.getElementById("headerSearchInput").value;
      filtroState.mostrar = 16;
      renderCatalogo();
      document
        .getElementById("tienda")
        ?.scrollIntoView({
          behavior: reduceMotion ? "auto" : "smooth",
          block: "start",
        });
    });

  document.querySelectorAll("[data-cat-shortcut]").forEach((btn) =>
    btn.addEventListener("click", () => {
      filtroState.categoria = [btn.dataset.catShortcut];
      filtroState.mostrar = 16;
      syncAllFilterUI();
      renderCatalogo();
      document
        .getElementById("tienda")
        ?.scrollIntoView({
          behavior: reduceMotion ? "auto" : "smooth",
          block: "start",
        });
    }),
  );

  const panel = document.getElementById("filtrosPanel");
  document.getElementById("filtrosToggle")?.addEventListener("click", () => {
    panel?.classList.add("open");
    document.body.classList.add("no-scroll");
  });
  document
    .getElementById("filtrosPanelClose")
    ?.addEventListener("click", () => {
      panel?.classList.remove("open");
      document.body.classList.remove("no-scroll");
    });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && panel?.classList.contains("open")) {
      panel.classList.remove("open");
      document.body.classList.remove("no-scroll");
    }
  });

  syncAllFilterUI();
  renderCatalogo();
}

/* ============ VISTA RÁPIDA ============ */
let qvQty = 1;
function openQuickview(id) {
  const p = getProducto(id);
  const backdrop = document.getElementById("quickviewBackdrop");
  if (!p || !backdrop) return;
  const img = document.getElementById("qvImg");
  img.src = `images/${p.imagen}`;
  img.alt = p.nombre;
  img.style.objectPosition = p.foco || "50% 50%";
  document.getElementById("qvCat").textContent = catLabel(p);
  document.getElementById("qvNombre").textContent = p.nombre;
  document.getElementById("qvDesc").textContent = p.descripcion;
  document.getElementById("qvPrecio").textContent = formatearPrecio(
    precioFinal(p),
  );
  const orig = document.getElementById("qvPrecioOrig");
  if (p.descuento > 0) {
    orig.hidden = false;
    orig.textContent = formatearPrecio(p.precio);
  } else {
    orig.hidden = true;
  }
  qvQty = 1;
  document.getElementById("qvQty").textContent = qvQty;
  document.getElementById("qvAgregar").dataset.id = p.id;
  const rel = PRODUCTOS.filter(
    (x) => x.subcategoria === p.subcategoria && x.id !== p.id,
  ).slice(0, 3);
  document.getElementById("qvRelacionados").innerHTML = rel
    .map(
      (r) => `
    <button type="button" class="quickview-rel-card" data-quickview="${r.id}" style="text-align:left;border:none;background:none;padding:0;cursor:pointer">
      <img src="images/${r.imagen}" alt="${esc(r.nombre)}" style="object-position:${r.foco || "50% 50%"}" loading="lazy">
      <span>${esc(r.nombre)}</span>
    </button>`,
    )
    .join("");
  backdrop.hidden = false;
  window.lenis?.stop();
  document.body.classList.add("no-scroll");
}
function closeQuickview() {
  const backdrop = document.getElementById("quickviewBackdrop");
  if (!backdrop) return;
  backdrop.hidden = true;
  window.lenis?.start();
  document.body.classList.remove("no-scroll");
}
function initQuickview() {
  const backdrop = document.getElementById("quickviewBackdrop");
  if (!backdrop) return;
  document
    .getElementById("quickviewClose")
    ?.addEventListener("click", closeQuickview);
  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) closeQuickview();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !backdrop.hidden) closeQuickview();
  });
  document.getElementById("qvStepper")?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-step]");
    if (!btn) return;
    const p = getProducto(document.getElementById("qvAgregar").dataset.id);
    qvQty = Math.max(
      1,
      Math.min(qvQty + Number(btn.dataset.step), p?.stock ?? 99),
    );
    document.getElementById("qvQty").textContent = qvQty;
  });
  document.getElementById("qvAgregar")?.addEventListener("click", (e) => {
    const p = getProducto(e.currentTarget.dataset.id);
    if (!p) return;
    Cart.add(p, qvQty);
    showToast(`${p.nombre} agregado al carrito`);
    closeQuickview();
  });
}

/* ============ CARRITO (drawer) ============ */
function renderCart() {
  const body = document.getElementById("cartBody");
  if (!body) return;
  const items = Cart.get();
  if (!items.length) {
    body.innerHTML = `<div class="cart-empty"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5"/><circle cx="17.5" cy="20" r="1.5"/></svg><p>Tu carrito está vacío</p></div>`;
  } else {
    body.innerHTML = items
      .map((i) => {
        const p = getProducto(i.id);
        if (!p) return "";
        return `<div class="cart-item" data-id="${p.id}">
        <img src="images/${p.imagen}" alt="${esc(p.nombre)}" style="object-position:${p.foco || "50% 50%"}" loading="lazy">
        <div class="cart-item-info">
          <p class="cart-item-nombre">${esc(p.nombre)}</p>
          <p class="cart-item-precio">${formatearPrecio(precioFinal(p))}</p>
          <div class="cart-item-row">
            <div class="stepper">
              <button type="button" data-cartstep="-1" data-id="${p.id}" aria-label="Restar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M5 12h14"/></svg></button>
              <span>${i.qty}</span>
              <button type="button" data-cartstep="1" data-id="${p.id}" aria-label="Sumar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M12 5v14M5 12h14"/></svg></button>
            </div>
            <button type="button" class="cart-item-remove" data-cartremove="${p.id}">Quitar</button>
          </div>
        </div>
      </div>`;
      })
      .join("");
  }
  const total = document.getElementById("cartTotal");
  if (total) total.textContent = formatearPrecio(Cart.total());
}
document.addEventListener("cart:updated", renderCart);

function openCartDrawer() {
  document.getElementById("cartDrawer")?.classList.add("open");
  document.getElementById("cartBackdrop")?.classList.add("open");
  document.body.classList.add("no-scroll");
  window.lenis?.stop();
}
function closeCartDrawer() {
  document.getElementById("cartDrawer")?.classList.remove("open");
  document.getElementById("cartBackdrop")?.classList.remove("open");
  document.body.classList.remove("no-scroll");
  window.lenis?.start();
}
function initCartDrawer() {
  const drawer = document.getElementById("cartDrawer");
  if (!drawer) return;
  document
    .getElementById("cart-toggle")
    ?.addEventListener("click", openCartDrawer);
  document
    .getElementById("cartClose")
    ?.addEventListener("click", closeCartDrawer);
  document
    .getElementById("cartBackdrop")
    ?.addEventListener("click", closeCartDrawer);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && drawer.classList.contains("open"))
      closeCartDrawer();
  });
  document.getElementById("cartBody")?.addEventListener("click", (e) => {
    const step = e.target.closest("[data-cartstep]");
    if (step) {
      const it = Cart.get().find((i) => i.id === step.dataset.id);
      if (it)
        Cart.setQty(step.dataset.id, it.qty + Number(step.dataset.cartstep));
    }
    const rm = e.target.closest("[data-cartremove]");
    if (rm) Cart.remove(rm.dataset.cartremove);
  });
  document.getElementById("cartCheckout")?.addEventListener("click", () => {
    if (!Cart.count()) {
      showToast("Tu carrito está vacío");
      return;
    }
    showToast(
      "¡Genial! El pago online se activa al pasar la web a producción.",
    );
  });
}

/* ============ NEWSLETTER ============ */
function initNewsletter() {
  document.getElementById("newsletterForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const btn = e.target.querySelector("button");
    const original = btn.textContent;
    btn.disabled = true;
    btn.textContent = "Enviando…";
    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = original;
      showToast(
        "¡Gracias! El envío de mensajes se activa al pasar la web a producción.",
      );
      e.target.reset();
    }, 800);
  });
}

/* ============ INIT ============ */
document.addEventListener("DOMContentLoaded", () => {
  initModelBarScroll();
  initNav();
  initHeroRotator();
  initMundos();
  renderRail();
  initRailDrag();
  initArmador();
  initCatalogo();
  initQuickview();
  initCartDrawer();
  renderCart();
  updateCartBadge();
  initFloats();
  initNewsletter();
  initReveals();
});
