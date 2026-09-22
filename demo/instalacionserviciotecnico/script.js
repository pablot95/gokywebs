/* ===================================================================
   Instalación Servicio Técnico — script.js
   =================================================================== */
"use strict";

const NUMERO_WSP = "5491140847110";
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
const clamp01 = (n) => Math.max(0, Math.min(1, n));
const wspLink = (msg) =>
  `https://wa.me/${NUMERO_WSP}?text=${encodeURIComponent(msg)}`;

/* ===================================================================
   Datos — servicios (compartidos entre los dos modelos)
   =================================================================== */
const SERVICIOS = [
  {
    id: "instalacion",
    nombre: "Instalación",
    desc: "Equipos split, multisplit y cassette, con carga de gas y prueba incluida.",
    detalle:
      "Instalamos tu equipo nuevo a la altura y el lugar que mejor rinda, con la carga de gas y la prueba de funcionamiento incluidas — no te lo dejamos \"a probar\".",
    icono:
      '<rect x="3" y="6" width="18" height="7" rx="1.5"/><path d="M7 13v2M12 13v3M17 13v2"/><path d="M3 9h18"/>',
    imagen: "técnico_revisando_unidad_de_aire_acondicionado.webp",
  },
  {
    id: "reparacion",
    nombre: "Reparación y service",
    desc: "Diagnóstico y arreglo si tu equipo no enfría, pierde gas o hace ruido.",
    detalle:
      "Revisamos el equipo en el lugar y te decimos qué tiene antes de tocar nada. Si hay que reemplazar una pieza, te lo confirmamos antes de hacerlo.",
    icono:
      '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
    imagen: "técnico_ajustando_aire_acondicionado.webp",
  },
  {
    id: "mantenimiento",
    nombre: "Mantenimiento preventivo",
    desc: "Limpieza de filtros y control de gas para que rinda toda la temporada.",
    detalle:
      "Limpieza de filtros y serpentina, control de presión de gas y revisión general — lo recomendable es una vez por temporada, antes de que arranque el calor o el frío fuerte.",
    icono:
      '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
    imagen: "mantenimiento_de_aire_acondicionado.webp",
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
   Anti-copia — obligatorio en todo demo
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
   Barra de modelos — snippet §11, se oculta al scrollear
   =================================================================== */
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
    showTimer = setTimeout(() => bar.classList.remove("gw-modelos--scrolling"), 120);
  };
  addEventListener(
    "scroll",
    () => {
      if (!frame) frame = requestAnimationFrame(update);
    },
    { passive: true },
  );
}

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
   Servicios: tarjetas (Modelo 1)
   =================================================================== */
function initServiciosGrid() {
  const grid = document.getElementById("serviciosGrid");
  if (!grid) return;
  grid.innerHTML = SERVICIOS.map(
    (s) => `
    <div class="servicio-card" data-animate style="transform:translateY(18px);opacity:0">
      <div class="servicio-card__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">${s.icono}</svg></div>
      <h3>${esc(s.nombre)}</h3>
      <p>${esc(s.desc)}</p>
    </div>`,
  ).join("");
}

/* ===================================================================
   Servicios: pestañas (Modelo 2)
   =================================================================== */
function initServiciosTabs() {
  const tabsWrap = document.getElementById("serviciosTabs");
  const panelsWrap = document.getElementById("serviciosPanels");
  if (!tabsWrap || !panelsWrap) return;

  tabsWrap.innerHTML = SERVICIOS.map(
    (s, i) => `
    <button type="button" class="servicios-tab${i === 0 ? " is-active" : ""}" data-tab="${s.id}" role="tab" aria-selected="${i === 0}">${esc(s.nombre)}</button>`,
  ).join("");

  panelsWrap.innerHTML = SERVICIOS.map(
    (s, i) => `
    <div class="servicio-panel${i === 0 ? " is-active" : ""}" data-panel="${s.id}" role="tabpanel">
      <div class="servicio-panel__copy">
        <p class="eyebrow">${esc(s.nombre)}</p>
        <h3 style="font-family:var(--font-display);font-weight:800;font-size:1.5rem;margin-top:.3em">${esc(s.desc)}</h3>
        <p>${esc(s.detalle)}</p>
        <div class="servicio-panel__actions">
          <a class="btn btn-cta" href="${wspLink(`Hola! Quiero pedir presupuesto para ${s.nombre.toLowerCase()} de aire acondicionado.`)}" target="_blank" rel="noopener" data-wsp-msg>Pedir presupuesto</a>
        </div>
      </div>
      <div class="servicio-panel__media"><img src="images/${s.imagen}" alt="${esc(s.nombre)} de aire acondicionado" loading="lazy" width="800" height="640"></div>
    </div>`,
  ).join("");

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
}

/* ===================================================================
   Calculadora de frigorías — componente funcional
   =================================================================== */
const FACTOR_FRIGORIAS = { dormitorio: 600, living: 700, oficina: 650 };
const EQUIPOS_ESTANDAR = [2250, 3000, 4500, 5000, 6000, 9000];
const AMBIENTE_LABEL = {
  dormitorio: "dormitorio",
  living: "living-comedor",
  oficina: "oficina o local",
};

function calcularFrigorias(m2, ambiente, sol) {
  if (!m2 || m2 <= 0) return null;
  const factor = FACTOR_FRIGORIAS[ambiente] || FACTOR_FRIGORIAS.dormitorio;
  const necesarias = m2 * factor * (sol ? 1.15 : 1);
  const recomendado =
    EQUIPOS_ESTANDAR.find((f) => f >= necesarias) ??
    EQUIPOS_ESTANDAR[EQUIPOS_ESTANDAR.length - 1];
  const excede = necesarias > EQUIPOS_ESTANDAR[EQUIPOS_ESTANDAR.length - 1];
  return { necesarias: Math.round(necesarias), recomendado, excede };
}

function initCotizador() {
  const form = document.getElementById("cotizadorForm");
  if (!form) return;
  const m2Input = form.querySelector("[data-cot-m2]");
  const ambienteSelect = form.querySelector("[data-cot-ambiente]");
  const solInput = form.querySelector("[data-cot-sol]");
  const result = document.getElementById("cotizadorResult");
  const error = document.getElementById("cotizadorError");
  const recomendadoEl = document.getElementById("cotRecomendado");
  const necesariasEl = document.getElementById("cotNecesarias");
  const wspBtn = form.querySelector("[data-cot-wsp]");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const m2 = parseFloat(m2Input.value);
    const r = calcularFrigorias(m2, ambienteSelect.value, solInput.checked);
    if (!r) {
      if (result) result.hidden = true;
      if (error) error.hidden = false;
      return;
    }
    if (error) error.hidden = true;
    if (recomendadoEl)
      recomendadoEl.textContent = `~${r.recomendado.toLocaleString("es-AR")} frigorías${r.excede ? " o más" : ""}`;
    if (necesariasEl)
      necesariasEl.textContent = `${r.necesarias.toLocaleString("es-AR")} frigorías estimadas`;
    if (result) result.hidden = false;
    if (wspBtn) {
      const ambienteTxt = AMBIENTE_LABEL[ambienteSelect.value] || "ambiente";
      const solTxt = solInput.checked ? ", con mucho sol o calor" : "";
      wspBtn.href = wspLink(
        `Hola! Usé la calculadora de frigorías: ${ambienteTxt} de ${m2}m²${solTxt}, me recomendó ~${r.recomendado} frigorías. Quiero confirmarlo con un técnico.`,
      );
    }
  });
}

/* ===================================================================
   Momento propio: «Así trabajamos» — capítulos que cambian en el lugar
   =================================================================== */
const MOMENTO = [
  {
    tag: "Paso 1 · Relevamos",
    titulo: "Revisamos el equipo por dentro y por afuera",
    texto:
      "Chequeamos la unidad interior y la exterior, presión de gas incluida, antes de mover una herramienta.",
    foto: "técnico_revisando_unidad_de_aire_acondicionado.webp",
    alt: "Técnico revisando la unidad exterior de un aire acondicionado con manómetros",
  },
  {
    tag: "Paso 2 · Instalamos o reparamos",
    titulo: "Manos a la obra, con las herramientas puestas",
    texto:
      "Instalación a la altura que corresponde o reparación en el lugar, según lo que necesite tu equipo.",
    foto: "técnico_ajustando_aire_acondicionado.webp",
    alt: "Técnico instalando una unidad de aire acondicionado sobre una escalera",
  },
  {
    tag: "Paso 3 · Te mostramos",
    titulo: "Te explicamos qué hicimos, sin letra chica",
    texto:
      "Antes de irnos te mostramos cómo quedó el equipo y contestamos lo que preguntes.",
    foto: "técnico_explicando_el_aire_acondicionado.webp",
    alt: "Técnico explicándole a una clienta el funcionamiento del aire acondicionado instalado",
  },
  {
    tag: "Paso 4 · Entregamos",
    titulo: "Con garantía por escrito",
    texto:
      "El trabajo queda firmado y con garantía — no es una promesa verbal.",
    foto: "técnico_sonriente_junto_al_aire_acondicionado.webp",
    alt: "Técnico sonriente con el pulgar arriba junto al aire acondicionado ya instalado",
  },
];

function pintarMomento(root) {
  const media = root.querySelector(".momento-media");
  const textos = root.querySelector(".momento-textos");
  const marcas = root.querySelector(".momento-marcas");
  if (!media || !textos) return;
  media.innerHTML = MOMENTO.map(
    (m, i) => `
    <div class="momento-foto${i === 0 ? " is-on" : ""}">
      <img src="images/${m.foto}" alt="${esc(m.alt)}" width="1254" height="1254"${i === 0 ? "" : ' loading="lazy"'}>
    </div>`,
  ).join("");
  media.insertAdjacentHTML(
    "beforeend",
    `<div class="momento-media__chip" data-momento-chip>Paso 1 de ${MOMENTO.length}</div>`,
  );
  textos.innerHTML = MOMENTO.map(
    (m, i) => `
    <div class="momento-texto${i === 0 ? " is-on" : ""}">
      <span class="momento-texto__tag">${esc(m.tag)}</span>
      <h3>${esc(m.titulo)}</h3>
      <p>${esc(m.texto)}</p>
    </div>`,
  ).join("");
  if (marcas) {
    marcas.innerHTML = MOMENTO.map(
      (_, i) =>
        `<button type="button" class="momento-marca${i === 0 ? " is-on" : ""}" aria-label="Ir al paso ${i + 1}"></button>`,
    ).join("");
  }
}

function initMomento(rootId) {
  const root = document.getElementById(rootId);
  if (!root) return;
  pintarMomento(root);
  const wrap = root.querySelector(".momento-wrap");
  const escena = root.querySelector(".momento-escena");
  const fotos = [...root.querySelectorAll(".momento-foto")];
  const textos = [...root.querySelectorAll(".momento-texto")];
  const marcas = [...root.querySelectorAll(".momento-marca")];
  const chip = root.querySelector("[data-momento-chip]");
  if (!wrap || !escena || !textos.length) return;
  const N = Math.min(textos.length, 4);

  let activo = 0;
  const activar = (i) => {
    if (i === activo && fotos[i]?.classList.contains("is-on")) return;
    activo = i;
    fotos.forEach((f, idx) => f.classList.toggle("is-on", idx === i));
    textos.forEach((t, idx) => t.classList.toggle("is-on", idx === i));
    marcas.forEach((m, idx) => m.classList.toggle("is-on", idx === i));
    if (chip) chip.textContent = `Paso ${i + 1} de ${N}`;
  };

  let ticking = false;
  const update = () => {
    ticking = false;
    const total = wrap.offsetHeight - escena.offsetHeight;
    const p =
      total > 0 ? clamp01(-wrap.getBoundingClientRect().top / total) : 0;
    const i = Math.min(N - 1, Math.floor(p * N * 0.9999));
    activar(i);
    if (!reduceMotion) {
      const local = clamp01(p * N - i);
      fotos.forEach((f) => {
        const img = f.querySelector("img");
        if (img) img.style.transform = `scale(${1.07 - local * 0.07})`;
      });
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

  marcas.forEach((m, idx) => {
    m.addEventListener("click", () => {
      const total = wrap.offsetHeight - escena.offsetHeight;
      const destino =
        wrap.getBoundingClientRect().top +
        window.scrollY +
        total * ((idx + 0.5) / N);
      window.scrollTo({
        top: destino,
        behavior: reduceMotion ? "auto" : "smooth",
      });
    });
  });

  queue();
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
   Máscara de teléfono AR (IMask, si está disponible)
   =================================================================== */
function initTelMask() {
  if (typeof IMask === "undefined") return;
  document.querySelectorAll('input[type="tel"]').forEach((el) => {
    IMask(el, { mask: "(00) 0000-0000" });
  });
}

/* ===================================================================
   WhatsApp links con mensaje pre-armado (href estático)
   =================================================================== */
function initWspLinks() {
  document.querySelectorAll("[data-wsp-msg]").forEach((a) => {
    if (a.getAttribute("href")?.includes("?text=")) return; // ya armado (paneles dinámicos)
    const msg = a.dataset.wspMsg || "Hola! Quiero más información.";
    a.href = wspLink(msg);
  });
}

/* ===================================================================
   Guard sin JS/reduced-motion
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
  initServiciosGrid();
  initServiciosTabs();
  initCotizador();
  initMomento("momentoTrabajos");
  initReveals();
  initNav();
  initModelBarScroll();
  initFloat();
  initFormContacto();
  initTelMask();
  initWspLinks();
});
