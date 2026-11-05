"use strict";
const WHATSAPP_NUMBER = "5492996075277";
const CATEGORIAS = [
  {
    id: "libreria",
    nombre: "Librería",
    sub: ["Cuadernos", "Colores"],
    nota: "Ideas en papel",
  },
  {
    id: "jugueteria",
    nombre: "Juguetería",
    sub: ["Vehículos", "Encastres", "Peluches"],
    nota: "Tiempo de jugar",
  },
  {
    id: "kiosco",
    nombre: "Kiosco",
    sub: ["Golosinas"],
    nota: "Un gusto chiquito",
  },
  {
    id: "pesca",
    nombre: "Pesca",
    sub: ["Reels", "Accesorios"],
    nota: "Un plan afuera",
  },
  { id: "regalos", nombre: "Regalos", sub: ["Tazas"], nota: "Para sorprender" },
];
const PRODUCTOS = [
  {
    id: "md01",
    slug: "cuaderno-lila",
    nombre: "Cuaderno lila",
    categoria: "libreria",
    subcategoria: "Cuadernos",
    precio: 8500,
    descuento: 0,
    stock: 50,
    imagen: "01",
    descripcion:
      "Un cuaderno con espiral para apuntes, dibujos y nuevas ideas. Consultá medidas, tipo de hojas y opciones disponibles.",
    tags: ["papelería", "escuela", "anotador"],
    presentacion: "Cuaderno individual",
  },
  {
    id: "md02",
    slug: "lapices-de-colores",
    nombre: "Lápices de colores",
    categoria: "libreria",
    subcategoria: "Colores",
    precio: 12900,
    descuento: 0,
    stock: 50,
    imagen: "02",
    descripcion:
      "Una paleta de colores para poner manos a la obra. Consultá las presentaciones y la cantidad de lápices de cada caja.",
    tags: ["pintar", "dibujar", "escuela", "arte"],
    presentacion: "Caja de lápices",
  },
  {
    id: "md03",
    slug: "camion-de-bomberos",
    nombre: "Camión de bomberos",
    categoria: "jugueteria",
    subcategoria: "Vehículos",
    precio: 24500,
    descuento: 0,
    stock: 50,
    imagen: "03",
    descripcion:
      "Un camión rojo con escalera para inventar historias de rescate. Consultá tamaño, funciones y edad recomendada antes de elegirlo.",
    tags: ["juguetes", "autos", "regalo"],
    presentacion: "Camión individual",
  },
  {
    id: "md04",
    slug: "caja-de-encastres",
    nombre: "Caja de encastres",
    categoria: "jugueteria",
    subcategoria: "Encastres",
    precio: 18900,
    descuento: 0,
    stock: 50,
    imagen: "04",
    descripcion:
      "Formas y colores para explorar jugando. Consultá material, contenido de la caja y edad recomendada para este modelo.",
    tags: ["juguetes", "formas", "didácticos"],
    presentacion: "Caja con figuras",
  },
  {
    id: "md05",
    slug: "oso-de-peluche",
    nombre: "Oso de peluche",
    categoria: "jugueteria",
    subcategoria: "Peluches",
    precio: 21500,
    descuento: 0,
    stock: 50,
    imagen: "05",
    descripcion:
      "Un oso color miel con moño para regalar un abrazo. Consultá las medidas y las opciones de peluches disponibles.",
    tags: ["juguetes", "regalo", "oso"],
    presentacion: "Peluche individual",
  },
  {
    id: "md06",
    slug: "reel-de-pesca",
    nombre: "Reel de pesca",
    categoria: "pesca",
    subcategoria: "Reels",
    precio: 39500,
    descuento: 0,
    stock: 50,
    imagen: "06",
    descripcion:
      "Una opción para completar tu equipo de pesca. Consultá modelo, capacidad de línea y compatibilidad con tu caña.",
    tags: ["río", "aire libre", "equipo"],
    presentacion: "Reel individual",
  },
  {
    id: "md07",
    slug: "boyas-y-senuelos",
    nombre: "Boyas y señuelos",
    categoria: "pesca",
    subcategoria: "Accesorios",
    precio: 14900,
    descuento: 0,
    stock: 50,
    imagen: "07",
    descripcion:
      "Accesorios de distintos colores y formas para tu próxima salida. Consultá modelos y presentación; la foto muestra una selección ilustrativa.",
    tags: ["río", "anzuelo", "equipo"],
    presentacion: "Selección de referencia",
  },
  {
    id: "md08",
    slug: "taza-lila",
    nombre: "Taza lila",
    categoria: "regalos",
    subcategoria: "Tazas",
    precio: 7900,
    descuento: 0,
    stock: 50,
    imagen: "08",
    descripcion:
      "Un toque de color para el desayuno o la merienda. Consultá capacidad, material y colores disponibles.",
    tags: ["regalo", "desayuno", "hogar"],
    presentacion: "Taza individual",
  },
  {
    id: "md09",
    slug: "caramelos-surtidos",
    nombre: "Caramelos surtidos",
    categoria: "kiosco",
    subcategoria: "Golosinas",
    precio: 2800,
    descuento: 0,
    stock: 50,
    imagen: "09",
    descripcion:
      "Un pequeño gusto para compartir o acompañar un regalo. Consultá sabores, ingredientes y peso de la presentación disponible.",
    tags: ["dulces", "golosinas", "caramelo"],
    presentacion: "Bolsa de referencia",
  },
];
const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;
const modelo = document.body.dataset.modelo === "2" ? "2" : "1";
const catalogUrl = modelo === "2" ? "catalogo-2.html" : "catalogo.html";
const ARROW =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>';
const PLUS =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M5 12h14M12 5v14"/></svg>';

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
  KEY: "mirdor_cart",
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
        filter: "blur(10px)",
        duration: 1.2,
        clearProps: "filter",
      },
      0.2,
    )
    .from(
      hero.querySelectorAll(".hero-desc"),
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
      hero.querySelectorAll(".hero-tag, .hero-search"),
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
  const sync = () => {
    const scrolled = window.scrollY > 600;
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

function initRailDrag(vp) {
  if (!vp) return;
  let dragging = false,
    moved = false,
    startX = 0,
    startScroll = 0,
    pointerId = null;
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
        pointerId = e.pointerId;
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
        pointerId = null;
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

function normalizar(text) {
  return String(text ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}
function validarFiltros(params) {
  const cat = CATEGORIAS.some((c) => c.id === params.get("cat"))
    ? params.get("cat")
    : "";
  const subs = CATEGORIAS.filter((c) => !cat || c.id === cat).flatMap(
    (c) => c.sub,
  );
  return {
    cat,
    sub: subs.includes(params.get("sub")) ? params.get("sub") : "",
    q: String(params.get("q") || "").slice(0, 150),
    precio: ["10000", "20000", "40000"].includes(params.get("precio"))
      ? params.get("precio")
      : "",
    orden: ["precio-asc", "precio-desc", "nombre"].includes(params.get("orden"))
      ? params.get("orden")
      : "destacados",
  };
}
function filtrarProductos(productos, filtros) {
  const words = normalizar(filtros.q).split(/\s+/).filter(Boolean);
  const result = productos.filter((p) => {
    const haystack = normalizar(
      [p.nombre, p.categoria, p.subcategoria, p.descripcion, ...p.tags].join(
        " ",
      ),
    );
    return (
      (!filtros.cat || p.categoria === filtros.cat) &&
      (!filtros.sub || p.subcategoria === filtros.sub) &&
      (!filtros.precio || precioFinal(p) <= Number(filtros.precio)) &&
      words.every((w) => haystack.includes(w))
    );
  });
  if (filtros.orden === "precio-asc")
    result.sort((a, b) => precioFinal(a) - precioFinal(b));
  if (filtros.orden === "precio-desc")
    result.sort((a, b) => precioFinal(b) - precioFinal(a));
  if (filtros.orden === "nombre")
    result.sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
  return result;
}
function paginaProductos(productos, limite = 16) {
  return productos.slice(0, Math.max(16, Math.floor(limite / 16) * 16));
}
function sanearCarrito(raw) {
  if (!Array.isArray(raw)) return [];
  const found = new Map();
  raw.slice(0, 100).forEach((item) => {
    if (!item || typeof item !== "object") return;
    const p = getProducto(item.id);
    if (
      !p ||
      p.stock <= 0 ||
      !Number.isFinite(Number(item.qty)) ||
      Number(item.qty) < 1
    )
      return;
    found.set(p.id, {
      id: p.id,
      qty: Math.min(
        p.stock,
        (found.get(p.id)?.qty || 0) + Math.floor(Number(item.qty)),
      ),
    });
  });
  return [...found.values()];
}
const canonicalGet = Cart.get.bind(Cart);
const canonicalSave = Cart.save.bind(Cart);
let memoryCart = null;
Cart.get = () => sanearCarrito(memoryCart ?? canonicalGet());
Cart.save = (items) => {
  const cleanItems = sanearCarrito(items);
  try {
    canonicalSave(cleanItems);
    memoryCart = null;
  } catch {
    memoryCart = cleanItems;
    document.dispatchEvent(new CustomEvent("cart:updated"));
    showToast("Tu carrito se conserva mientras esta página esté abierta.");
  }
};
function imagePath(p) {
  return `images/${p.imagen}_imagen.webp`;
}
function categoryName(id) {
  return CATEGORIAS.find((c) => c.id === id)?.nombre || "";
}
function productURL(p) {
  return `${catalogUrl}?producto=${encodeURIComponent(p.slug)}`;
}
function refresh() {
  if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
}
function stepper(p, context) {
  return `<div class="stepper" role="group" aria-label="Cantidad de ${esc(p.nombre)}"><button type="button" data-qty-step="-1" aria-label="Quitar una unidad de ${esc(p.nombre)}">−</button><label class="sr-only" for="qty-${context}-${p.id}">Cantidad de ${esc(p.nombre)}</label><input id="qty-${context}-${p.id}" data-qty type="number" min="1" max="${p.stock}" value="1" inputmode="numeric"><button type="button" data-qty-step="1" aria-label="Sumar una unidad de ${esc(p.nombre)}">+</button></div>`;
}
function productCard(p, context = "grid", animate = true) {
  return `<article class="prod-card" data-id="${p.id}"${animate ? ` data-animate="${context === "rail" ? "der" : "subir"}" style="opacity:0;transform:translate${context === "rail" ? "X(48px)" : "Y(32px)"}"` : ""}>
    <a class="prod-main" href="${productURL(p)}" data-product="${p.id}" aria-label="Ver ${esc(p.nombre)}">
    <div class="prod-image"><img src="${imagePath(p)}" alt="${esc(p.nombre)}, imagen de referencia" width="${p.imagen === "01" ? 900 : p.imagen === "02" ? 1600 : 1254}" height="${p.imagen === "01" ? 1600 : p.imagen === "02" ? 900 : 1254}"></div>
    <div class="prod-info"><span class="prod-category">${categoryName(p.categoria)}</span><h3>${esc(p.nombre)}</h3><p class="prod-price">${formatearPrecio(precioFinal(p))}${p.descuento > 0 ? ` <s>${formatearPrecio(p.precio)}</s>` : ""}</p></div><span class="prod-view" aria-hidden="true">Miralo de cerca ${PLUS}</span></a>
    <div class="prod-actions">${stepper(p, context)}<button type="button" class="prod-add" data-add="${p.id}"${p.stock ? "" : " disabled"} aria-label="Agregar ${esc(p.nombre)} al carrito"><span class="add-long">Agregar al carrito</span><span class="add-short">Agregar</span>${PLUS}</button></div>
    <button type="button" class="buy-now" data-buy="${p.id}"${p.stock ? "" : " disabled"}>Comprar ahora ${ARROW}</button></article>`;
}
function initCategorias() {
  const menu = document.querySelector("[data-cats-menu]");
  if (!menu) return;
  const selected = validarFiltros(new URLSearchParams(location.search)).cat;
  menu.innerHTML = CATEGORIAS.map(
    (c) =>
      `<a href="${catalogUrl}?cat=${c.id}"${selected === c.id ? ' aria-current="page"' : ""}><span>${c.nombre}</span><small>${PRODUCTOS.filter((p) => p.categoria === c.id).length}</small></a>`,
  ).join("");
  const index = document.querySelector("[data-category-index]");
  if (index)
    index.innerHTML = CATEGORIAS.map(
      (c, i) =>
        `<a href="${catalogUrl}?cat=${c.id}"><span class="category-num">0${i + 1}</span><span><strong>${c.nombre}</strong><small>${c.nota}</small></span>${ARROW}</a>`,
    ).join("");
  const wrap = document.querySelector(".nav-cats");
  const toggle = document.getElementById("catsToggle");
  const panel = document.getElementById("navCats");
  let timeout;
  const set = (open) => {
    panel.hidden = !open;
    toggle.setAttribute("aria-expanded", String(open));
  };
  toggle.addEventListener("click", () => {
    clearTimeout(timeout);
    set(panel.hidden);
  });
  wrap.addEventListener("mouseenter", () => {
    if (window.matchMedia("(hover:hover) and (min-width:769px)").matches) {
      clearTimeout(timeout);
      set(true);
    }
  });
  wrap.addEventListener("mouseleave", () => {
    if (window.matchMedia("(hover:hover) and (min-width:769px)").matches)
      timeout = setTimeout(() => set(false), 130);
  });
  wrap.addEventListener("focusout", (e) => {
    if (!wrap.contains(e.relatedTarget)) set(false);
  });
  document.addEventListener("click", (e) => {
    if (!wrap.contains(e.target)) set(false);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !panel.hidden) {
      set(false);
      toggle.focus();
    }
  });
}
function initFeatured() {
  const target = document.getElementById("homeProducts");
  if (!target) return;
  const ids = ["md02", "md04", "md05", "md06", "md08", "md09"];
  target.innerHTML = ids
    .map((id) => productCard(getProducto(id), modelo === "1" ? "rail" : "home"))
    .join("");
  const vp = document.getElementById("featuredRail");
  if (modelo !== "1") return;
  initRailDrag(vp);
  const prev = document.querySelector("[data-rail-prev]");
  const next = document.querySelector("[data-rail-next]");
  const sync = () => {
    const inicio =
      parseFloat(window.getComputedStyle(target).paddingInlineStart) || 0;
    prev.disabled = vp.scrollLeft <= inicio + 2;
    next.disabled = vp.scrollLeft >= vp.scrollWidth - vp.clientWidth - 2;
  };
  const move = (direction) =>
    vp.scrollBy({
      left:
        direction *
        (target.firstElementChild.getBoundingClientRect().width + 20),
      behavior: reduceMotion ? "instant" : "smooth",
    });
  prev.addEventListener("click", () => move(-1));
  next.addEventListener("click", () => move(1));
  vp.addEventListener("scroll", sync, { passive: true });
  window.addEventListener("resize", sync);
  sync();
}
function initCatalogo() {
  const form = document.getElementById("filters");
  if (!form) return;
  const grid = document.getElementById("catalogGrid");
  const cat = form.elements.cat,
    sub = form.elements.sub;
  cat.insertAdjacentHTML(
    "beforeend",
    CATEGORIAS.map((c) => `<option value="${c.id}">${c.nombre}</option>`).join(
      "",
    ),
  );
  let filtros = validarFiltros(new URLSearchParams(location.search)),
    limit = 16,
    rendered = 0;
  const syncSub = () => {
    const options = CATEGORIAS.filter(
      (c) => !cat.value || c.id === cat.value,
    ).flatMap((c) => c.sub);
    sub.innerHTML =
      '<option value="">Todos los tipos</option>' +
      options
        .map((s) => `<option value="${esc(s)}">${esc(s)}</option>`)
        .join("");
  };
  cat.value = filtros.cat;
  syncSub();
  Object.entries(filtros).forEach(([key, value]) => {
    form.elements[key].value = value;
  });
  const draw = (append = false, updateURL = true) => {
    const items = filtrarProductos(PRODUCTOS, filtros),
      page = paginaProductos(items, limit);
    if (append)
      grid.insertAdjacentHTML(
        "beforeend",
        page
          .slice(rendered)
          .map((p) => productCard(p))
          .join(""),
      );
    else grid.innerHTML = page.map((p) => productCard(p)).join("");
    rendered = page.length;
    document.getElementById("resultCount").textContent =
      `${items.length} ${items.length === 1 ? "idea para elegir" : "ideas para elegir"}`;
    document.getElementById("emptyResults").hidden = items.length !== 0;
    document.getElementById("loadMore").hidden = rendered >= items.length;
    document.getElementById("paginationNote").textContent = items.length
      ? `Estás viendo ${rendered} de ${items.length} productos.`
      : "";
    document.getElementById("catalog-title").textContent = filtros.cat
      ? categoryName(filtros.cat)
      : "Todo el catálogo";
    document.getElementById("breadcrumbCategory").textContent = filtros.cat
      ? `Catálogo / ${categoryName(filtros.cat)}`
      : "Catálogo";
    if (updateURL) {
      const params = new URLSearchParams();
      Object.entries(filtros).forEach(([key, value]) => {
        if (value && value !== "destacados") params.set(key, value);
      });
      window.history.replaceState(
        null,
        "",
        catalogUrl + (params.size ? "?" + params.toString() : ""),
      );
    }
    document.querySelectorAll("[data-cats-menu] a").forEach((a) => {
      a.removeAttribute("aria-current");
      if (new URL(a.href).searchParams.get("cat") === filtros.cat)
        a.setAttribute("aria-current", "page");
    });
    document.querySelectorAll(".gw-modelos a").forEach((a) => {
      const destination =
        a.dataset.modelo === "2" ? "catalogo-2.html" : "catalogo.html";
      a.href = destination + location.search;
    });
    revelarNuevos(grid);
    refresh();
  };
  const apply = () => {
    filtros = validarFiltros(new URLSearchParams(new window.FormData(form)));
    limit = 16;
    draw();
  };
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    apply();
  });
  form.addEventListener("change", (e) => {
    if (e.target === cat) {
      sub.value = "";
      syncSub();
    }
    apply();
  });
  document.querySelectorAll("[data-clear]").forEach((b) =>
    b.addEventListener("click", () => {
      form.reset();
      syncSub();
      apply();
    }),
  );
  document.getElementById("loadMore").addEventListener("click", () => {
    limit += 16;
    draw(true);
  });
  draw(false, false);
  const params = new URLSearchParams(location.search);
  if (params.has("q") || params.has("buscar"))
    form.elements.q.focus({ preventScroll: true });
}
let activeOverlay = null,
  lastTrigger = null;
const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])';
function trapFocus(e, panel) {
  if (e.key !== "Tab") return;
  const els = [...panel.querySelectorAll(FOCUSABLE)].filter(
    (el) =>
      el.getClientRects().length &&
      window.getComputedStyle(el).visibility !== "hidden",
  );
  const first = els[0],
    last = els[els.length - 1];
  if (!first) {
    e.preventDefault();
    return;
  }
  if (
    e.shiftKey &&
    (document.activeElement === first ||
      !panel.contains(document.activeElement))
  ) {
    e.preventDefault();
    last.focus();
  } else if (
    !e.shiftKey &&
    (document.activeElement === last || !panel.contains(document.activeElement))
  ) {
    e.preventDefault();
    first.focus();
  }
}
function openOverlay(el, trigger) {
  const rootTrigger = activeOverlay?.contains(document.activeElement)
    ? lastTrigger
    : null;
  if (activeOverlay) {
    activeOverlay.hidden = true;
    activeOverlay.classList.remove("open");
  }
  lastTrigger = trigger || rootTrigger || document.activeElement;
  activeOverlay = el;
  el.hidden = false;
  document.body.classList.add("no-scroll");
  requestAnimationFrame(() => el.classList.add("open"));
  (el.querySelector("button") || el.querySelector("[role=dialog]")).focus({
    preventScroll: true,
  });
}
function closeOverlay() {
  if (!activeOverlay) return;
  activeOverlay.hidden = true;
  activeOverlay.classList.remove("open");
  activeOverlay = null;
  document.body.classList.remove("no-scroll");
  lastTrigger?.focus({ preventScroll: true });
}
function initOverlays() {
  document.querySelectorAll(".overlay").forEach((el) =>
    el.addEventListener("click", (e) => {
      if (e.target === el || e.target.closest("[data-close]")) closeOverlay();
    }),
  );
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && activeOverlay) closeOverlay();
    else if (activeOverlay) trapFocus(e, activeOverlay);
  });
  const nav = document.getElementById("mainNav");
  nav.addEventListener("keydown", (e) => {
    if (nav.classList.contains("open")) trapFocus(e, nav);
  });
  const updateRole = () => {
    if (nav.classList.contains("open")) {
      nav.setAttribute("role", "dialog");
      nav.setAttribute("aria-modal", "true");
    } else {
      nav.removeAttribute("role");
      nav.removeAttribute("aria-modal");
    }
  };
  new window.MutationObserver(updateRole).observe(nav, {
    attributes: true,
    attributeFilter: ["class"],
  });
}
function renderCart() {
  const items = Cart.get();
  const target = document.getElementById("cartItems");
  document.getElementById("cartFoot").hidden = !items.length;
  target.innerHTML = items.length
    ? items
        .map((item) => {
          const p = getProducto(item.id);
          return `<article class="cart-row" data-cart-id="${p.id}"><div class="cart-image"><img src="${imagePath(p)}" alt="${esc(p.nombre)}" width="1254" height="1254"></div><div class="cart-row-copy"><h3>${esc(p.nombre)}</h3><p>${formatearPrecio(precioFinal(p))}</p><div class="cart-qty"><button type="button" data-cart-step="-1" aria-label="Quitar una unidad de ${esc(p.nombre)}"${item.qty === 1 ? " disabled" : ""}>−</button><span>${item.qty}</span><button type="button" data-cart-step="1" aria-label="Sumar una unidad de ${esc(p.nombre)}"${item.qty >= p.stock ? " disabled" : ""}>+</button></div></div><button type="button" class="cart-remove" data-remove="${p.id}" aria-label="Quitar ${esc(p.nombre)} del carrito">Quitar</button></article>`;
        })
        .join("")
    : `<div class="cart-empty"><span aria-hidden="true">✳</span><h3>Acá van tus próximas ideas.</h3><p>Todavía no sumaste productos. Hay mucho para descubrir.</p><a class="btn btn-primary" href="${catalogUrl}">Explorá el catálogo ${ARROW}</a></div>`;
  document.getElementById("cartTotal").textContent = formatearPrecio(
    Cart.total(),
  );
  const lines = [
    "Hola Mir-Dor, vi estos productos de muestra en la web:",
    "",
    ...items.map((i) => {
      const p = getProducto(i.id);
      return `${i.qty} x ${p.nombre} (${p.presentacion}) | ${formatearPrecio(precioFinal(p) * i.qty)}`;
    }),
    "",
    `Subtotal ilustrativo: ${formatearPrecio(Cart.total())}`,
    "¿Me confirman opciones reales, precios y envío a mi localidad?",
  ];
  document.getElementById("cartWhatsapp").href =
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
}
function openCartDrawer() {
  renderCart();
  openOverlay(document.getElementById("cartOverlay"));
}
function showProduct(id, trigger) {
  const p = getProducto(id);
  if (!p) return;
  const related = PRODUCTOS.filter(
    (x) => x.id !== p.id && x.categoria === p.categoria,
  ).slice(0, 3);
  const target = document.getElementById("quickContent");
  const wa = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hola Mir-Dor, quiero consultar por ${p.nombre}, que vi en la demo. ¿Qué opciones tienen y cómo coordinamos el envío?`)}`;
  target.innerHTML = `<div class="quick-layout" data-id="${p.id}"><div class="quick-image"><img src="${imagePath(p)}" alt="${esc(p.nombre)}, imagen de referencia" width="1254" height="1254"></div><div class="quick-copy"><p class="eyebrow">${categoryName(p.categoria)} / ${esc(p.subcategoria)}</p><h2>${esc(p.nombre)}</h2><p class="quick-price">${formatearPrecio(precioFinal(p))}</p><p>${esc(p.descripcion)}</p><p class="presentation">${esc(p.presentacion)}</p><p class="small">Foto, precio y disponibilidad ilustrativos de la demo.</p><div class="prod-actions">${stepper(p, "quick")}<button type="button" class="prod-add" data-add="${p.id}">Agregar ${PLUS}</button></div><button type="button" class="btn btn-primary" data-buy="${p.id}">Comprar ahora ${ARROW}</button><a class="text-link" href="${wa}" target="_blank" rel="noopener noreferrer">Consultá por este producto ${ARROW}</a><p class="small">El envío se coordina según tu localidad.</p></div></div>${related.length ? `<div class="related"><h3>También te puede gustar</h3><div>${related.map((r) => `<a href="${productURL(r)}" data-product="${r.id}"><span>${esc(r.nombre)}</span><strong>${formatearPrecio(precioFinal(r))}</strong>${ARROW}</a>`).join("")}</div></div>` : ""}`;
  let schema = document.getElementById("productSchema");
  if (!schema) {
    schema = document.createElement("script");
    schema.id = "productSchema";
    schema.type = "application/ld+json";
    document.head.appendChild(schema);
  }
  schema.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${p.nombre} — muestra de demo`,
    image: new URL(imagePath(p), location.href).href,
    description:
      p.descripcion + " Imagen, precio y disponibilidad ilustrativos.",
    offers: {
      "@type": "Offer",
      priceCurrency: "ARS",
      price: precioFinal(p),
      availability: p.stock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: new URL(productURL(p), location.href).href,
    },
  });
  const previousTrigger =
    activeOverlay === document.getElementById("quickOverlay")
      ? lastTrigger
      : null;
  openOverlay(
    document.getElementById("quickOverlay"),
    previousTrigger || trigger,
  );
}
function readQty(button, p) {
  const input = button.closest("[data-id]")?.querySelector("[data-qty]");
  const qty = Math.max(
    1,
    Math.min(p.stock, Math.floor(Number(input?.value) || 1)),
  );
  if (input) input.value = qty;
  return qty;
}
function initActions() {
  document.addEventListener("click", (e) => {
    const product = e.target.closest("[data-product]");
    if (product) {
      e.preventDefault();
      showProduct(product.dataset.product, product);
      return;
    }
    const step = e.target.closest("[data-qty-step]");
    if (step) {
      const input = step.parentElement.querySelector("[data-qty]");
      input.value = Math.max(
        1,
        Math.min(
          Number(input.max),
          (Number(input.value) || 1) + Number(step.dataset.qtyStep),
        ),
      );
      return;
    }
    const add = e.target.closest("[data-add], [data-buy]");
    if (add) {
      const p = getProducto(add.dataset.add || add.dataset.buy);
      if (!p || !p.stock) return;
      const before = Cart.get().find((i) => i.id === p.id)?.qty || 0;
      Cart.add(p, readQty(add, p));
      const after = Cart.get().find((i) => i.id === p.id)?.qty || 0;
      if (add.hasAttribute("data-buy")) openCartDrawer();
      else
        showToast(
          after > before
            ? `${p.nombre} se sumó a tu carrito.`
            : "Llegaste al límite de unidades de muestra.",
        );
      return;
    }
    const open = e.target.closest("[data-open-cart]");
    if (open) {
      openCartDrawer();
      return;
    }
    const remove = e.target.closest("[data-remove]");
    if (remove) {
      Cart.remove(remove.dataset.remove);
      document.querySelector("#cartOverlay [data-close]").focus();
      return;
    }
    const cartStep = e.target.closest("[data-cart-step]");
    if (cartStep) {
      const id = cartStep.closest("[data-cart-id]").dataset.cartId;
      const qty = Cart.get().find((i) => i.id === id)?.qty || 1;
      const direction = cartStep.dataset.cartStep;
      Cart.setQty(id, qty + Number(direction));
      document
        .querySelector(`[data-cart-id="${id}"] [data-cart-step="${direction}"]`)
        ?.focus();
    }
  });
  document.getElementById("checkout").addEventListener("click", () => {
    if (Cart.count())
      showToast(
        "¡Genial! El pago online se activa al pasar la web a producción.",
      );
  });
  document.addEventListener("cart:updated", renderCart);
  window.addEventListener("storage", (e) => {
    if (e.key === Cart.KEY) {
      memoryCart = null;
      document.dispatchEvent(new CustomEvent("cart:updated"));
    }
  });
}
if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined")
  gsap.registerPlugin(ScrollTrigger);
if (typeof ScrollTrigger !== "undefined")
  window.addEventListener("load", () => ScrollTrigger.refresh());
initCategorias();
initFeatured();
initCatalogo();
initNav();
initOverlays();
initActions();
renderCart();
updateCartBadge();
initReveals();
initFloats();
initModelBarScroll();
initHeroMotion();
if (typeof gsap === "undefined")
  document
    .querySelectorAll("[data-animate]")
    .forEach((el) => el.classList.add("in"));
const linkedProduct = PRODUCTOS.find(
  (p) => p.slug === new URLSearchParams(location.search).get("producto"),
);
if (linkedProduct) showProduct(linkedProduct.id);
