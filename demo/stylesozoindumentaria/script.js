const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

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

const WHATSAPP_NUMBER = "5491166545773";
const esc = (s) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
const formatearPrecio = (n) => "$" + Math.round(n).toLocaleString("es-AR");

const CATEGORIAS = {
  remeras: "Remeras",
  buzos: "Buzos",
  camperas: "Camperas",
  pantalones: "Pantalones",
  accesorios: "Accesorios",
};

const PRODUCTOS = [
  {
    id: "remera-negra-basica",
    categoria: "remeras",
    nombre: "Remera básica negra",
    precio: 22000,
    img: "remera-negra-basica-1000x1000.webp",
    desc: "Remera de algodón peinado, corte clásico, ideal para combinar con todo.",
  },
  {
    id: "remera-oversize-negra",
    categoria: "remeras",
    nombre: "Remera oversize negra",
    precio: 24000,
    img: "remera-negra-basica-1000x1000.webp",
    desc: "Calce oversize, mangas caídas, algodón de buen gramaje.",
  },
  {
    id: "remera-manga-larga-negra",
    categoria: "remeras",
    nombre: "Remera manga larga negra",
    precio: 26000,
    img: "remera-negra-basica-1000x1000.webp",
    desc: "Manga larga, cuello redondo, algodón grueso para entretiempo.",
  },
  {
    id: "remera-estampada-blanca",
    categoria: "remeras",
    nombre: "Remera estampada blanca",
    precio: 25000,
    img: "remera-grafica-blanca-1000x1000.webp",
    desc: "Remera oversize blanca con estampa propia, calce relajado.",
  },
  {
    id: "remera-cuello-redondo-blanca",
    categoria: "remeras",
    nombre: "Remera cuello redondo blanca",
    precio: 21000,
    img: "remera-grafica-blanca-1000x1000.webp",
    desc: "Básica blanca de algodón, cuello redondo, calce regular.",
  },
  {
    id: "buzo-canguro-gris",
    categoria: "buzos",
    nombre: "Buzo canguro gris",
    precio: 42000,
    img: "buzo-canguro-gris-1000x1000.webp",
    desc: "Buzo con capucha y bolsillo canguro, frisa interior.",
  },
  {
    id: "buzo-oversize-gris",
    categoria: "buzos",
    nombre: "Buzo oversize gris melange",
    precio: 45000,
    img: "buzo-canguro-gris-1000x1000.webp",
    desc: "Calce oversize, puños y cintura elastizados, frisa gruesa.",
  },
  {
    id: "buzo-cropped-gris",
    categoria: "buzos",
    nombre: "Buzo cropped gris",
    precio: 38000,
    img: "buzo-canguro-gris-1000x1000.webp",
    desc: "Largo cropped, capucha, ideal para combinar con jean tiro alto.",
  },
  {
    id: "campera-cuero-negra",
    categoria: "camperas",
    nombre: "Campera de cuero negra",
    precio: 78000,
    img: "campera-cuero-negra-1000x1000.webp",
    desc: "Campera de cuero ecológico, cierre frontal, forro interior.",
  },
  {
    id: "campera-biker-negra",
    categoria: "camperas",
    nombre: "Campera biker negra",
    precio: 82000,
    img: "campera-cuero-negra-1000x1000.webp",
    desc: "Estilo biker, detalles en cierres, entalle moderno.",
  },
  {
    id: "jean-recto-azul",
    categoria: "pantalones",
    nombre: "Jean recto azul",
    precio: 35000,
    img: "jean-detalle-1000x1000.webp",
    desc: "Jean de tiro medio, corte recto, denim rígido.",
  },
  {
    id: "jean-oversize-azul",
    categoria: "pantalones",
    nombre: "Jean oversize azul",
    precio: 37000,
    img: "jean-detalle-1000x1000.webp",
    desc: "Calce oversize, tiro alto, denim con lavado medio.",
  },
  {
    id: "tote-bag-negro",
    categoria: "accesorios",
    nombre: "Tote bag negro",
    precio: 16000,
    img: "tote-bag-negro-1000x1000.webp",
    desc: "Bolso tote de lona reforzada, asas largas, bolsillo interior.",
  },
  {
    id: "tote-bag-mini-negro",
    categoria: "accesorios",
    nombre: "Tote bag mini negro",
    precio: 13000,
    img: "tote-bag-negro-1000x1000.webp",
    desc: "Versión mini del tote, ideal para lo esencial del día a día.",
  },
];

const RAIL_IDS = [
  "remera-negra-basica",
  "buzo-canguro-gris",
  "campera-cuero-negra",
  "jean-recto-azul",
  "tote-bag-negro",
  "remera-estampada-blanca",
];

const getProducto = (id) => PRODUCTOS.find((p) => p.id === id);

function waHref(mensaje) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`;
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
  nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", close));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("open")) {
      close();
      toggle.focus();
    }
  });
}

function initReveals() {
  const items = document.querySelectorAll("[data-animate]");
  if (!items.length) return;
  document.querySelectorAll("[data-animate-stagger]").forEach((parent) => {
    parent.querySelectorAll("[data-animate]").forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i * 0.06, 0.5)}s`;
    });
  });
  items.forEach((el) => {
    if (el.closest("[data-animate-stagger]")) return;
    const d = parseFloat(el.dataset.delay || "0");
    if (d) el.style.transitionDelay = `${d}s`;
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

function initWspFloat() {
  const btn = document.getElementById("wsp-float");
  if (!btn) return;
  window.addEventListener(
    "scroll",
    () => {
      if (window.scrollY > 600) btn.classList.add("visible");
      else btn.classList.remove("visible");
    },
    { passive: true },
  );
}

function railCardHTML(p) {
  return `<a class="rail-card" href="#" data-open-modal="${p.id}">
    <div class="rail-card-media"><img src="images/${p.img}" width="1000" height="1000" alt="${esc(p.nombre)}" loading="lazy"></div>
    <div class="rail-card-body">
      <h3>${esc(p.nombre)}</h3>
      <p class="rail-card-price">${formatearPrecio(p.precio)}</p>
    </div>
  </a>`;
}

function initRail() {
  const track = document.getElementById("railTrack");
  const vp = document.getElementById("railViewport");
  if (!track || !vp) return;
  track.innerHTML = RAIL_IDS.map((id) => railCardHTML(getProducto(id))).join(
    "",
  );

  vp.addEventListener(
    "wheel",
    (e) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      const max = vp.scrollWidth - vp.clientWidth;
      if (max <= 1) return;
      const atStart = vp.scrollLeft <= 0,
        atEnd = vp.scrollLeft >= max - 1;
      if ((e.deltaY < 0 && atStart) || (e.deltaY > 0 && atEnd)) return;
      e.preventDefault();
      vp.scrollLeft += e.deltaY;
    },
    { passive: false },
  );

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
        /* sin capture el drag igual funciona */
      }
    }
    e.preventDefault();
    vp.scrollLeft = startScroll - dx;
  });
  const endDrag = (e) => {
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
  vp.addEventListener("pointerup", endDrag);
  vp.addEventListener("pointercancel", endDrag);
  vp.addEventListener("dragstart", (e) => e.preventDefault());
}

function productoCardHTML(p) {
  return `<article class="producto-card" data-cat="${p.categoria}">
    <div class="producto-media" data-open-modal="${p.id}">
      <img src="images/${p.img}" width="1000" height="1000" alt="${esc(p.nombre)}" loading="lazy">
      <span class="producto-quick">Vista rápida</span>
    </div>
    <div class="producto-body">
      <p class="producto-cat">${CATEGORIAS[p.categoria]}</p>
      <h3>${esc(p.nombre)}</h3>
      <p class="producto-precio">${formatearPrecio(p.precio)}</p>
      <a class="producto-wsp" href="${waHref(`Hola Style Sozo! Quiero consultar por: ${p.nombre} (${formatearPrecio(p.precio)}).`)}" target="_blank" rel="noopener">
        <svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>
        Consultar
      </a>
    </div>
  </article>`;
}

let categoriaActiva = "todos";

function renderCatalogoGrid() {
  const grid = document.getElementById("catalogoGrid");
  if (!grid) return;
  const productos =
    categoriaActiva === "todos"
      ? PRODUCTOS
      : PRODUCTOS.filter((p) => p.categoria === categoriaActiva);
  grid.innerHTML = productos.map(productoCardHTML).join("");
  grid.querySelectorAll(".producto-card").forEach((card, i) => {
    card.setAttribute("data-animate", "up");
    card.style.transform = "translateY(20px)";
    card.style.opacity = "0";
    card.style.transitionDelay = `${Math.min(i * 0.05, 0.4)}s`;
  });
  initReveals();
}

function initCatalogo() {
  const filtros = document.getElementById("catalogoFiltros");
  if (!filtros) return;
  filtros.querySelectorAll(".filtro-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      categoriaActiva = btn.dataset.cat;
      filtros
        .querySelectorAll(".filtro-btn")
        .forEach((b) => b.classList.toggle("is-active", b === btn));
      renderCatalogoGrid();
    });
  });
  renderCatalogoGrid();
}

function initModal() {
  const backdrop = document.getElementById("modalBackdrop");
  const closeBtn = document.getElementById("modalClose");
  if (!backdrop) return;
  const img = document.getElementById("modalImg");
  const cat = document.getElementById("modalCat");
  const title = document.getElementById("modalTitle");
  const precio = document.getElementById("modalPrecio");
  const desc = document.getElementById("modalDesc");
  const wspBtn = document.getElementById("modalWspBtn");
  let lastTrigger = null;

  function openModal(id) {
    const p = getProducto(id);
    if (!p) return;
    lastTrigger = document.activeElement;
    img.src = `images/${p.img}`;
    img.alt = p.nombre;
    cat.textContent = CATEGORIAS[p.categoria];
    title.textContent = p.nombre;
    precio.textContent = formatearPrecio(p.precio);
    desc.textContent = p.desc;
    wspBtn.href = waHref(
      `Hola Style Sozo! Quiero consultar por: ${p.nombre} (${formatearPrecio(p.precio)}).`,
    );
    backdrop.classList.add("open");
    backdrop.removeAttribute("inert");
    document.body.classList.add("no-scroll");
    closeBtn.focus();
    document.addEventListener("keydown", onKeydown);
  }

  function closeModal() {
    backdrop.classList.remove("open");
    backdrop.setAttribute("inert", "");
    document.body.classList.remove("no-scroll");
    document.removeEventListener("keydown", onKeydown);
    lastTrigger?.focus();
  }

  function onKeydown(e) {
    if (e.key === "Escape") {
      closeModal();
      return;
    }
    if (e.key !== "Tab") return;
    const focusable = backdrop.querySelectorAll(
      "a[href], button:not([disabled])",
    );
    if (!focusable.length) return;
    const first = focusable[0],
      last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      last.focus();
      e.preventDefault();
    } else if (!e.shiftKey && document.activeElement === last) {
      first.focus();
      e.preventDefault();
    }
  }

  document.addEventListener("click", (e) => {
    const trigger = e.target.closest("[data-open-modal]");
    if (trigger) {
      e.preventDefault();
      openModal(trigger.dataset.openModal);
    }
  });
  closeBtn.addEventListener("click", closeModal);
  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) closeModal();
  });
  backdrop.setAttribute("inert", "");
}

function initFirma() {
  const stage = document.getElementById("firmaStage");
  const black = document.getElementById("firmaBlack");
  if (!stage || !black) return;

  if (
    reduceMotion ||
    typeof gsap === "undefined" ||
    typeof ScrollTrigger === "undefined"
  ) {
    black.style.clipPath = "inset(0 0% 0 0)";
    return;
  }

  ScrollTrigger.create({
    trigger: stage,
    start: "top top",
    end: "bottom bottom",
    scrub: 0.5,
    onUpdate: (self) => {
      const hidden = 100 - self.progress * 100;
      black.style.clipPath = `inset(0 ${hidden}% 0 0)`;
    },
  });
}

function initFooterYear() {
  const el = document.getElementById("footerYear");
  if (el) el.textContent = String(new Date().getFullYear());
}

initNav();
initWspFloat();
initRail();
initCatalogo();
initModal();
initFirma();
initFooterYear();
