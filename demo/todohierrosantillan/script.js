/* ===================================================================
   TodoHierro Santillán — script.js
   =================================================================== */
"use strict";

const NUMERO_WSP = "5491130333134";
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
const wspLink = (msg) =>
  `https://wa.me/${NUMERO_WSP}?text=${encodeURIComponent(msg)}`;

/* ===================================================================
   Datos — servicios y trabajos
   =================================================================== */
const SERVICIOS = [
  {
    id: "construccion",
    nombre: "Construcción y refacciones",
    desc: "Ampliaciones, refacciones integrales y obra nueva, de punta a punta.",
    detalle:
      "Desde una refacción puntual hasta una ampliación completa: albañilería, instalaciones y terminaciones, todo coordinado por la misma persona que hace el trabajo.",
    icono:
      '<path d="M3 21h18"/><path d="M5 21V9l7-5 7 5v12"/><path d="M9 21v-6h6v6"/>',
    imagen: null,
  },
  {
    id: "durlock",
    nombre: "Durlock",
    desc: "Tabiques, cielorrasos y placas — con presupuesto por metro cuadrado.",
    detalle:
      "Tabiques divisorios, cielorrasos y revestimientos en placa de yeso, con o sin aislación acústica. Cotizalo abajo con tus medidas.",
    icono:
      '<rect x="3" y="4" width="18" height="16" rx="1"/><path d="M3 10h18M9 10v10M15 10v10"/>',
    imagen: "escritorio-oficina-1x1.webp",
  },
  {
    id: "herreria",
    nombre: "Herrería a medida",
    desc: "Barandas, portones, estructuras y trabajos en hierro a medida.",
    detalle:
      "Barandas de escalera, portones, rejas y estructuras metálicas, soldadas y terminadas a medida del espacio real, no de un catálogo.",
    icono:
      '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
    imagen: "escalera-baranda-1x1.webp",
  },
  {
    id: "muebles",
    nombre: "Muebles industriales",
    desc: "Racks, bibliotecas y muebles en hierro y madera, a medida.",
    detalle:
      "Muebles de estilo industrial en hierro y madera — racks de TV, bibliotecas, escritorios — diseñados para el espacio exacto que tenés.",
    icono:
      '<path d="M3 9h18"/><rect x="3" y="4" width="18" height="16" rx="1"/><path d="M8 4v16M16 4v16"/>',
    imagen: "living-rack-tv-16x9.webp",
  },
  {
    id: "mantenimiento",
    nombre: "Mantenimiento general",
    desc: "Arreglos y mantenimiento periódico para el hogar o el local.",
    detalle:
      "Reparaciones puntuales y mantenimiento programado: nada queda esperando cuando ya está la confianza armada.",
    icono:
      '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
    imagen: null,
  },
];

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
   Anti-copia
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
   Reveals — snippet §7
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

/* ===================================================================
   Flotante: WhatsApp
   =================================================================== */
function initFloat() {
  const wsp = document.getElementById("wsp-float");
  const sync = () => wsp?.classList.toggle("visible", window.scrollY > 500);
  window.addEventListener("scroll", sync, { passive: true });
  sync();
}

/* ===================================================================
   Servicios: tarjetas (F)
   =================================================================== */
function initServiciosTarjetas() {
  const grid = document.getElementById("serviciosGrid");
  if (!grid) return;
  grid.innerHTML = SERVICIOS.map(
    (s) => `
    <div class="servicio-card" data-animate style="transform:translateY(18px);opacity:0">
      <div class="servicio-card__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true">${s.icono}</svg></div>
      <h3>${esc(s.nombre)}</h3>
      <p>${esc(s.desc)}</p>
    </div>`,
  ).join("");
}

/* ===================================================================
   Servicios: pestañas (H)
   =================================================================== */
function initServiciosTabs() {
  const tabsWrap = document.getElementById("serviciosTabs");
  const panelsWrap = document.getElementById("serviciosPanels");
  if (!tabsWrap || !panelsWrap) return;

  tabsWrap.innerHTML = SERVICIOS.map(
    (s, i) => `
    <button type="button" class="servicios-tab${i === 0 ? " is-active" : ""}" data-tab="${s.id}" role="tab" aria-selected="${i === 0}">${esc(s.nombre)}</button>`,
  ).join("");

  panelsWrap.innerHTML = SERVICIOS.map((s, i) => {
    const conCotizador = s.id === "durlock";
    const media = s.imagen
      ? `<img src="images/${s.imagen}" alt="${esc(s.nombre)}" loading="lazy" width="800" height="640">`
      : `<div class="servicio-panel__placa"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true">${s.icono}</svg></div>`;
    return `
    <div class="servicio-panel${i === 0 ? " is-active" : ""}" data-panel="${s.id}" role="tabpanel">
      <div class="servicio-panel__copy">
        <p class="eyebrow">${esc(s.nombre)}</p>
        <h3 style="font-family:var(--font-display);font-size:1.5rem;margin-top:.3em">${esc(s.desc)}</h3>
        <p>${esc(s.detalle)}</p>
        ${
          conCotizador
            ? ""
            : `
        <div class="servicio-panel__precio">
          <span>Presupuesto</span>
          <strong>A medida</strong>
        </div>`
        }
        <div class="servicio-panel__actions">
          <a class="btn btn-cta" href="${wspLink(`Hola! Quiero pedir presupuesto para ${s.nombre.toLowerCase()}.`)}" target="_blank" rel="noopener" data-wsp-msg>Pedir presupuesto</a>
          ${conCotizador ? '<a class="btn btn-outline" href="#cotizador-h" data-scroll-cotizador>Cotizar durlock</a>' : ""}
        </div>
      </div>
      <div class="servicio-panel__media">${media}</div>
    </div>`;
  }).join("");

  tabsWrap.querySelectorAll("[data-tab]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.tab;
      tabsWrap.querySelectorAll("[data-tab]").forEach((b) => {
        b.classList.toggle("is-active", b === btn);
        b.setAttribute("aria-selected", String(b === btn));
      });
      panelsWrap
        .querySelectorAll("[data-panel]")
        .forEach((p) =>
          p.classList.toggle("is-active", p.dataset.panel === id),
        );
    });
  });
  panelsWrap.querySelectorAll("[data-scroll-cotizador]").forEach((a) => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      document
        .getElementById("cotizador-h")
        ?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
    });
  });
}

/* ===================================================================
   La galería de trabajos ES el momento propio (initMundos, más abajo):
   con solo 6 fotos reales, una grilla aparte repetiría las mismas
   imágenes una tercera vez — se resolvió como una sola pieza teatral.
   =================================================================== */

/* ===================================================================
   Cotizador de durlock — componente funcional
   =================================================================== */
function calcularDurlock(m2, terminacion) {
  if (!m2 || m2 <= 0) return null;
  const PRECIO_SIMPLE = 9800; // $/m2, estimado
  const PRECIO_AISLADO = 13600; // $/m2, estimado
  const precioM2 = terminacion === "aislado" ? PRECIO_AISLADO : PRECIO_SIMPLE;
  const placas = Math.ceil(m2 / 2.88); // placa estándar 1.20 x 2.40 m
  const total = Math.round(m2 * precioM2);
  return { placas, total };
}

function initCotizador(formId, resultId, errorId, placasId, totalId) {
  const form = document.getElementById(formId);
  if (!form) return;
  const m2Input = form.querySelector("[data-cot-m2]");
  const termSelect = form.querySelector("[data-cot-terminacion]");
  const result = document.getElementById(resultId);
  const error = document.getElementById(errorId);
  const placasEl = document.getElementById(placasId);
  const totalEl = document.getElementById(totalId);
  const wspBtn = form.querySelector("[data-cot-wsp]");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const m2 = parseFloat(m2Input.value);
    const r = calcularDurlock(m2, termSelect.value);
    if (!r) {
      if (result) result.hidden = true;
      if (error) error.hidden = false;
      return;
    }
    if (error) error.hidden = true;
    if (placasEl) placasEl.textContent = `${r.placas} placas aprox.`;
    if (totalEl) totalEl.textContent = `${formatearPrecio(r.total)} estimado`;
    if (result) result.hidden = false;
    if (wspBtn) {
      const term =
        termSelect.value === "aislado" ? "con aislación acústica" : "simple";
      wspBtn.href = wspLink(
        `Hola! Cotizé durlock para ${m2}m² (terminación ${term}), me dio un estimado de ${formatearPrecio(r.total)}. Quiero confirmarlo.`,
      );
    }
  });
}

/* ===================================================================
   Momento propio: «En obra ↔ Entregado»
   =================================================================== */
function initMundos(rootId) {
  const root = document.getElementById(rootId);
  if (!root) return;
  const wrap = root.querySelector(".mundos-wrap");
  const scene = root.querySelector(".mundos-scene");
  const copy = root.querySelector(".mundo-copy");
  if (!wrap || !scene) return;

  const estados = [
    {
      tag: "En obra",
      titulo: "Cada trabajo empieza acá",
      texto:
        "Medición, materiales y manos a la obra — sin subcontratar, el mismo que presupuesta es el que hace el trabajo.",
    },
    {
      tag: "Entregado",
      titulo: "Y termina así",
      texto:
        "A medida del espacio real, con la terminación que se ve todos los días.",
    },
  ];
  const pintarEstado = (idx) => {
    const e = estados[idx];
    if (copy)
      copy.innerHTML = `<span class="mundo-copy__tag">${esc(e.tag)}</span><h3>${esc(e.titulo)}</h3><p>${esc(e.texto)}</p>`;
  };
  pintarEstado(0);

  let ticking = false;
  let lastIdx = 0;
  const update = () => {
    ticking = false;
    const rect = wrap.getBoundingClientRect();
    const sceneH = scene.offsetHeight;
    const recorrido = wrap.offsetHeight - sceneH;
    let p = recorrido > 0 ? -rect.top / recorrido : 0;
    p = Math.max(0, Math.min(1, p));
    const w = 108 - p * 116; // 108 -> -8, la línea cruza de derecha a izquierda
    scene.style.setProperty("--w", w.toFixed(2));
    const idx = p < 0.5 ? 0 : 1;
    if (idx !== lastIdx) {
      lastIdx = idx;
      pintarEstado(idx);
    }
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
   Mapa Leaflet + Carto — zona de referencia (placeholder)
   =================================================================== */
function initMapa(id) {
  const el = document.getElementById(id);
  if (!el || typeof window.L === "undefined") return;
  const centro = [-34.6037, -58.3816]; // CABA, placeholder de zona
  const mapa = window.L.map(id, {
    zoomControl: true,
    scrollWheelZoom: false,
  }).setView(centro, 10);
  window.L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    {
      attribution: "&copy; OpenStreetMap &copy; CARTO",
      maxZoom: 19,
    },
  ).addTo(mapa);
  window.L.circleMarker(centro, {
    radius: 9,
    color: "#FF0000",
    fillColor: "#FF0000",
    fillOpacity: 0.85,
    weight: 2,
  })
    .addTo(mapa)
    .bindPopup("Zona de cobertura: CABA y GBA");
}

/* ===================================================================
   Form de contacto — canónico
   =================================================================== */
function initFormContacto() {
  const form = document.getElementById("contactoForm");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const nombre = form.querySelector('[name="nombre"]');
    const mensaje = form.querySelector('[name="mensaje"]');
    if (!nombre.value.trim() || !mensaje.value.trim()) {
      showToast("Completá tu nombre y contanos qué necesitás.");
      return;
    }
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    const original = btn.textContent;
    btn.textContent = "Enviando…";
    setTimeout(() => {
      showToast(
        "¡Gracias! El envío de mensajes se activa al pasar la web a producción.",
      );
      form.reset();
      btn.disabled = false;
      btn.textContent = original;
    }, 800);
  });
}

/* ===================================================================
   WhatsApp links con mensaje pre-armado (data-wsp-msg con href estático)
   =================================================================== */
function initWspLinks() {
  document.querySelectorAll("[data-wsp-msg]").forEach((a) => {
    if (a.getAttribute("href")?.startsWith("https://wa.me/")) return; // ya armado (paneles dinámicos)
    const msg = a.dataset.wspMsg || "Hola! Quiero más información.";
    a.href = wspLink(msg);
  });
}

/* ===================================================================
   Guard sin JS/animate
   =================================================================== */
document.querySelectorAll("[data-animate]").forEach((el) => {
  if (reduceMotion) {
    el.style.opacity = 1;
    el.style.transform = "none";
  }
});

/* ===================================================================
   Init
   =================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  initServiciosTarjetas();
  initServiciosTabs();
  initCotizador(
    "cotizadorFormF",
    "cotizadorResultF",
    "cotizadorErrorF",
    "cotPlacasF",
    "cotTotalF",
  );
  initCotizador(
    "cotizadorFormH",
    "cotizadorResultH",
    "cotizadorErrorH",
    "cotPlacasH",
    "cotTotalH",
  );
  initMundos("mundosF");
  initMundos("mundosH");
  initReveals();
  initNav();
  initFloat();
  initFormContacto();
  initWspLinks();
  initMapa("contactoMapaF");
  initMapa("contactoMapaH");
});
