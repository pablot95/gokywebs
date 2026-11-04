"use strict";
const WHATSAPP_NUMBER = "5493416686106";
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
const normalizar = (s) =>
  String(s ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
const courseRows = [
  [
    "ucdm-inicio",
    "Un Curso de Milagros: primeros pasos",
    "Un Curso de Milagros",
    "Inicial",
    42000,
    "03",
    15,
    "Una introducción para acercarte a sus ideas y llevar la reflexión a tu día a día.",
    [
      [
        "Una nueva mirada",
        "Qué propone el Curso",
        "El lugar de la percepción",
        "Un registro de tus preguntas",
      ],
      [
        "Practicar la observación",
        "Reconocer una interpretación",
        "Pausar antes de responder",
        "Un ejercicio cotidiano",
      ],
      [
        "Integrar lo aprendido",
        "Releer una experiencia",
        "Escribir una reflexión",
        "Diseñar tu práctica personal",
      ],
    ],
  ],
  [
    "logica-mirada",
    "Lógica Cuántica: otra forma de mirar",
    "Lógica Cuántica",
    "Inicial",
    48000,
    "04",
    20,
    "Explorá esta propuesta de autoconocimiento y observá cómo construís tus interpretaciones.",
    [
      [
        "Abrir preguntas",
        "Introducción a la propuesta",
        "Hechos e interpretaciones",
        "Registrar un punto de vista",
      ],
      [
        "Mirar una situación",
        "Reconocer supuestos",
        "Explorar otras preguntas",
        "Escritura de observación",
      ],
      [
        "Volver a lo cotidiano",
        "Revisar tu registro",
        "Integrar una perspectiva",
        "Una práctica para continuar",
      ],
    ],
  ],
  [
    "pausa-consciente",
    "Una pausa para escucharte",
    "Prácticas personales",
    "Inicial",
    28000,
    "06",
    10,
    "Una propuesta breve para crear un momento de atención y escritura personal.",
    [
      [
        "Hacer espacio",
        "Preparar un momento propio",
        "Observar el presente",
        "Registrar cómo llegás",
      ],
      [
        "Escuchar sin apuro",
        "Una pausa guiada",
        "Palabras para lo que sentís",
        "El cuaderno como compañía",
      ],
      [
        "Sostener la práctica",
        "Encontrar tu ritmo",
        "Una pregunta por día",
        "Tu próximo momento de pausa",
      ],
    ],
  ],
  [
    "ucdm-vinculos",
    "Los vínculos desde el Curso",
    "Un Curso de Milagros",
    "Profundización",
    56000,
    "07",
    25,
    "Un recorrido de reflexión sobre vínculos y percepciones desde Un Curso de Milagros.",
    [
      [
        "El vínculo como pregunta",
        "Ideas de partida",
        "Expectativas e interpretaciones",
        "Registrar sin juzgar",
      ],
      [
        "Revisar la mirada",
        "Una situación cotidiana",
        "Preguntas sobre el encuentro",
        "Una práctica de escritura",
      ],
      [
        "Integrar con calma",
        "Volver a tu registro",
        "Lo que querés seguir explorando",
        "Propuesta de continuidad",
      ],
    ],
  ],
  [
    "logica-preguntas",
    "Preguntas que abren perspectivas",
    "Lógica Cuántica",
    "Profundización",
    52000,
    "08",
    20,
    "Profundizá en la observación personal con preguntas y ejercicios de reflexión.",
    [
      [
        "Del supuesto a la pregunta",
        "Revisar ideas previas",
        "Observar una certeza",
        "Abrir una posibilidad",
      ],
      [
        "Exploración personal",
        "Leer una experiencia",
        "Preguntas que acompañan",
        "Reformular una interpretación",
      ],
      [
        "Integración",
        "Ordenar tus reflexiones",
        "Compartir una pregunta propia",
        "Una guía para continuar",
      ],
    ],
  ],
  [
    "escritura-personal",
    "Escribir para encontrarte",
    "Prácticas personales",
    "Inicial",
    32000,
    "07",
    15,
    "Un espacio de escritura para poner en palabras tus preguntas y experiencias.",
    [
      [
        "El cuaderno abierto",
        "Elegir un momento",
        "Escribir sin corregirte",
        "Encontrar una pregunta",
      ],
      [
        "Palabras propias",
        "Registrar una experiencia",
        "Explorar lo que aparece",
        "Una carta para vos",
      ],
      [
        "Leer tu recorrido",
        "Releer con distancia",
        "Identificar temas que vuelven",
        "Crear una práctica sostenible",
      ],
    ],
  ],
  [
    "presencia-cotidiana",
    "La presencia en lo cotidiano",
    "Prácticas personales",
    "Inicial",
    36000,
    "09",
    15,
    "Ejercicios de atención y reflexión para acompañar pequeños momentos del día.",
    [
      [
        "Observar lo simple",
        "Llegar al momento presente",
        "Una pausa de atención",
        "Registrar tu entorno",
      ],
      [
        "El día como práctica",
        "Escuchar con atención",
        "Caminar y observar",
        "Escribir lo que notás",
      ],
      [
        "Continuar a tu ritmo",
        "Encontrar un gesto cotidiano",
        "Revisar tu experiencia",
        "Una invitación para seguir",
      ],
    ],
  ],
  [
    "integracion-personal",
    "Integrar tu camino personal",
    "Prácticas personales",
    "Profundización",
    45000,
    "06",
    20,
    "Ordená lo que venís explorando y construí una práctica de reflexión propia.",
    [
      [
        "Reconocer el recorrido",
        "De dónde partís",
        "Preguntas que te acompañan",
        "Elegir un eje de trabajo",
      ],
      [
        "Dar forma a la práctica",
        "Reunir tus registros",
        "Reconocer relaciones",
        "Un ejercicio de integración",
      ],
      [
        "Seguir explorando",
        "Definir un próximo paso",
        "Volver a tus preguntas",
        "Crear tu guía personal",
      ],
    ],
  ],
];
const CURSOS = courseRows.map(
  (
    [
      id,
      titulo,
      categoria,
      nivel,
      precio,
      foto,
      minutos,
      descripcion,
      programa,
    ],
    index,
  ) => ({
    id: `course:${id}`,
    slug: id,
    type: "course",
    titulo,
    nombre: titulo,
    categoria,
    nivel,
    modalidad: "Grabado",
    precio,
    descuento: 0,
    duracion: minutos * 9,
    cantidadClases: 9,
    docenteId: "analuz",
    portada: `images/${foto}_imagen.webp`,
    descripcionCorta: descripcion,
    descripcionCompleta: descripcion,
    destacado: index < 2,
    nuevo: false,
    trailer: null,
    etiquetas: [categoria, nivel, "autoconocimiento"],
    resultados: [
      `Explorar los conceptos de «${titulo}».`,
      "Llevar tus preguntas a ejercicios de reflexión personal.",
      "Organizar un registro de tu experiencia.",
    ],
    requisitos:
      nivel === "Inicial"
        ? "Podés acercarte sin experiencia previa. Solo necesitás un cuaderno y un momento para vos."
        : "Pensado para quienes ya se acercaron al tema y quieren continuar explorándolo.",
    incluye: ["Clases grabadas", "Propuestas de escritura y reflexión"],
    modulos: programa.map(([titulo, ...clases], i) => ({
      id: `${id}-m${i + 1}`,
      titulo,
      clases: clases.map((titulo, j) => ({
        id: `${id}-m${i + 1}-c${j + 1}`,
        titulo,
        duracion: minutos,
        tipo: j === 2 ? "lectura" : "video",
        preview: i === 0 && j === 0,
        recurso: null,
      })),
    })),
  }),
);
const ORACULO = {
  id: "product:oraculo",
  slug: "oraculo-analuz",
  type: "product",
  titulo: "Oráculo ANALUZ",
  nombre: "Oráculo ANALUZ",
  precio: 38000,
  descuento: 0,
  portada: "images/05_imagen.webp",
  modalidad: "Oráculo físico",
  descripcionCorta:
    "Una invitación a abrir preguntas y acompañar tus momentos de reflexión.",
};
const PRODUCTOS = [...CURSOS, ORACULO];
const BANNERS = [];
const getProducto = (id) => PRODUCTOS.find((p) => p.id === id);
function filtrarCursos(
  items,
  {
    busqueda = "",
    categoria = "",
    nivel = "",
    modalidad = "",
    duracion = "",
    precio = "",
  } = {},
) {
  const terms = normalizar(busqueda).split(/\s+/).filter(Boolean);
  return items.filter(
    (p) =>
      terms.every((t) =>
        normalizar(
          [
            p.titulo,
            p.categoria,
            p.nivel,
            p.modalidad,
            "ANALUZ",
            p.descripcionCorta,
            ...p.etiquetas,
          ].join(" "),
        ).includes(t),
      ) &&
      (!categoria || p.categoria === categoria) &&
      (!nivel || p.nivel === nivel) &&
      (!modalidad || p.modalidad === modalidad) &&
      (!duracion ||
        (duracion === "corto" ? p.duracion <= 135 : p.duracion > 135)) &&
      (!precio ||
        (precio === "hasta40"
          ? precioFinal(p) <= 40000
          : precioFinal(p) > 40000)),
  );
}
function limpiarCarrito(raw) {
  try {
    const value = JSON.parse(raw || "[]");
    if (!Array.isArray(value)) return [];
    const ids = new Set();
    return value
      .filter(
        (i) =>
          i &&
          typeof i.id === "string" &&
          getProducto(i.id) &&
          !ids.has(i.id) &&
          ids.add(i.id),
      )
      .map((i) => ({ id: i.id, qty: 1 }));
  } catch {
    return [];
  }
}
const Cart = {
  KEY: "analuz_cart",
  get() {
    try {
      return limpiarCarrito(localStorage.getItem(this.KEY));
    } catch {
      return [];
    }
  },
  save(items) {
    try {
      localStorage.setItem(this.KEY, JSON.stringify(items));
    } catch {
      showToast(
        "No pudimos guardar la selección en este navegador. Habilitá el almacenamiento y volvé a intentar.",
      );
      return false;
    }
    document.dispatchEvent(new CustomEvent("cart:updated"));
    return true;
  },
  add(producto) {
    if (!producto) return false;
    const items = this.get();
    if (items.some((i) => i.id === producto.id)) return false;
    items.push({ id: producto.id, qty: 1 });
    return this.save(items) ? true : null;
  },
  remove(id) {
    return this.save(this.get().filter((i) => i.id !== id));
  },
  clear() {
    return this.save([]);
  },
  count() {
    return this.get().length;
  },
  total() {
    return this.get().reduce((s, i) => {
      const p = getProducto(i.id);
      return p ? s + precioFinal(p) : s;
    }, 0);
  },
};
if (typeof module !== "undefined" && module.exports)
  module.exports = {
    CURSOS,
    PRODUCTOS,
    BANNERS,
    Cart,
    filtrarCursos,
    limpiarCarrito,
    normalizar,
    precioFinal,
    formatearPrecio,
  };
function whatsapp(tema) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hola ANALUZ, quiero consultar por ${tema}.`)}`;
}
function initCourseSchema() {
  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": CURSOS.map((p) => ({
      "@type": "Course",
      name: `${p.titulo} — programa demostrativo`,
      description: `${p.descripcionCorta} Programa, duración y precio ilustrativos para esta demo.`,
      provider: { "@id": "https://gokywebs.com/demo/analuz/#organization" },
      inLanguage: "es-AR",
      offers: { "@type": "Offer", price: p.precio, priceCurrency: "ARS", category: "Paid", description: "Precio de ejemplo. Inscripción no disponible en la demo." },
    })),
  });
  document.head.appendChild(script);
}
function cardHTML(p, featured = false) {
  return `<article class="card ${featured ? "featured-card" : "course-card"}" data-animate="subir" style="opacity:0;transform:translateY(32px)"><div class="card-image"><img src="${p.portada}" width="1254" height="1254" alt="${esc(p.titulo)}: imagen ilustrativa"></div><div class="card-content"><p class="course-category">${esc(p.categoria)}</p><h3 class="course-title">${esc(p.titulo)}</h3><p class="course-meta">ANALUZ · ${p.modalidad}<br>${(p.duracion / 60) % 1 === 0 ? p.duracion / 60 + " h" : Math.floor(p.duracion / 60) + " h " + (p.duracion % 60) + " min"} · ${p.cantidadClases} clases · ${p.nivel}</p><p class="price">${formatearPrecio(precioFinal(p))} <span class="note">ARS · demo</span></p><div class="course-bottom"><button type="button" class="card-action" data-course="${p.id}" aria-label="Ver programa de ${esc(p.titulo)}">Ver programa <span aria-hidden="true">↗</span></button><button type="button" class="icon-btn" data-add="${p.id}" aria-label="Agregar ${esc(p.titulo)} a la inscripción">${cartIcon()}</button></div></div></article>`;
}
function cartIcon() {
  return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>';
}
let activeOverlay = null,
  returnFocus = null;
function focusables(el) {
  return [
    ...el.querySelectorAll(
      'a[href],button,input,select,textarea,[tabindex="0"],summary',
    ),
  ].filter(
    (e) => !e.disabled && e.getClientRects().length && !e.closest("[inert]"),
  );
}
function openOverlay(id) {
  const overlay = document.getElementById(id);
  if (!overlay) return;
  const origin = activeOverlay ? returnFocus : document.activeElement;
  if (activeOverlay) closeOverlay(false);
  returnFocus = origin;
  activeOverlay = overlay;
  overlay.hidden = false;
  document.body.classList.add("no-scroll");
  document
    .querySelectorAll(
      "body > header,body > main,body > footer,body > .gw-modelos,body > .floats",
    )
    .forEach((e) => (e.inert = true));
  focusables(overlay)[0]?.focus();
}
function closeOverlay(restore = true) {
  if (!activeOverlay) return;
  activeOverlay.hidden = true;
  activeOverlay = null;
  document.body.classList.remove("no-scroll");
  document.querySelectorAll("body > [inert]").forEach((e) => (e.inert = false));
  if (restore) returnFocus?.focus();
}
function initOverlays() {
  document
    .querySelectorAll("[data-close]")
    .forEach((b) => b.addEventListener("click", () => closeOverlay()));
  document.querySelectorAll(".overlay").forEach((el) =>
    el.addEventListener("click", (e) => {
      if (e.target === el) closeOverlay();
    }),
  );
  document.addEventListener("keydown", (e) => {
    const nav = document.getElementById("mainNav");
    const scope =
      activeOverlay || (nav?.classList.contains("open") ? nav : null);
    if (!scope) return;
    if (e.key === "Escape" && activeOverlay) closeOverlay();
    if (e.key === "Tab") {
      const list = focusables(scope),
        first = list[0],
        last = list.at(-1);
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    }
  });
}
function courseModal(id) {
  const p = getProducto(id);
  if (!p || p.type !== "course") return;
  document.getElementById("modal-content").innerHTML =
    `<div class="modal-lead"><figure class="modal-photo"><img src="${p.portada}" width="1254" height="1254" alt="Imagen ilustrativa de ${esc(p.titulo)}"></figure><div><p class="course-category">${esc(p.categoria)} · ${p.modalidad}</p><h2>${esc(p.titulo)}</h2><p>${esc(p.descripcionCompleta)}</p><p class="course-meta">${p.nivel} · ${p.cantidadClases} clases · ${p.duracion} minutos</p><p class="price">${formatearPrecio(p.precio)} <small class="note">ARS · precio demo</small></p><button class="btn" type="button" data-buy="${p.id}">Empezar el curso</button></div></div><div class="modal-body"><p class="note">Programa, duración, precio y materiales ilustrativos. Confirmá la propuesta vigente con ANALUZ. Esta demo no reproduce clases ni habilita acceso.</p><h3>Qué vas a explorar</h3><ul>${p.resultados.map((x) => `<li>${esc(x)}</li>`).join("")}</ul><h3>El programa, paso a paso</h3>${p.modulos.map((m, i) => `<details${i === 0 ? " open" : ""}><summary>${String(i + 1).padStart(2, "0")} · ${esc(m.titulo)}</summary><ul class="lesson-list">${m.clases.map((c) => `<li><span>${esc(c.titulo)}${c.preview ? " <small>· Vista previa prevista</small>" : ""}</span><small>${c.tipo === "video" ? "Video" : "Lectura"} · ${c.duracion} min</small></li>`).join("")}</ul></details>`).join("")}<h3>Para quién es</h3><p>${esc(p.requisitos)} Es una propuesta de exploración personal; no es una formación profesional habilitante.</p><h3>Qué incluye la propuesta de ejemplo</h3><ul>${p.incluye.map((x) => `<li>${x}</li>`).join("")}</ul><h3>Te acompaña ANALUZ</h3><p>Terapeuta holística y facilitadora de Un Curso de Milagros y Lógica Cuántica.</p><a class="text-link" href="${whatsapp(p.titulo)}" target="_blank" rel="noopener noreferrer">Consultar sobre este curso ↗</a></div>`;
  openOverlay("course-modal");
}
function openCartDrawer() {
  renderCart();
  openOverlay("cart-drawer");
}
function renderCart() {
  const items = Cart.get();
  const cont = document.getElementById("cart-items");
  if (!cont) return;
  cont.innerHTML = items.length
    ? items
        .map((i) => {
          const p = getProducto(i.id);
          return `<article class="cart-item"><img src="${p.portada}" width="76" height="76" alt="${esc(p.titulo)}"><div><h3>${esc(p.titulo)}</h3><p>${p.modalidad} · ${formatearPrecio(p.precio)}</p></div><button type="button" class="icon-btn" data-remove="${p.id}" aria-label="Quitar ${esc(p.titulo)}">×</button></article>`;
        })
        .join("")
    : '<div class="empty-state"><h3>Tu próximo paso empieza acá.</h3><p>Elegí un curso o el Oráculo para explorar la inscripción.</p><button type="button" class="btn" data-browse>Explorar cursos</button></div>';
  document.getElementById("cart-total").textContent = formatearPrecio(
    Cart.total(),
  );
  document.getElementById("cart-summary").hidden = !items.length;
}
function initCatalog() {
  const featured = document.getElementById("featured-grid");
  if (featured)
    featured.innerHTML = CURSOS.filter((p) => p.destacado)
      .map((p) => cardHTML(p, true))
      .join("");
  const grid = document.getElementById("course-grid");
  if (!grid) return;
  const form = document.getElementById("course-filters");
  let limit = 12;
  const read = () => Object.fromEntries(new FormData(form));
  const render = () => {
    const list = filtrarCursos(CURSOS, read());
    grid.innerHTML = list
      .slice(0, limit)
      .map((p) => cardHTML(p))
      .join("");
    document.getElementById("result-count").textContent =
      `${list.length} ${list.length === 1 ? "curso" : "cursos"} para explorar`;
    document.getElementById("empty-courses").hidden = !!list.length;
    document.getElementById("more-courses").hidden = limit >= list.length;
    revelarNuevos(grid);
  };
  form.addEventListener("input", () => {
    limit = 12;
    render();
  });
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    render();
  });
  document.querySelectorAll("[data-clear-filters]").forEach((b) =>
    b.addEventListener("click", () => {
      form.reset();
      limit = 12;
      render();
      document.getElementById("course-search").focus();
    }),
  );
  document.getElementById("more-courses").addEventListener("click", () => {
    limit += 12;
    render();
  });
  const toggle = document.getElementById("filter-toggle"),
    filters = document.getElementById("filter-options");
  toggle.addEventListener("click", () => {
    const open = filters.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  render();
}
function initActions() {
  document
    .getElementById("header-cart")
    .addEventListener("click", openCartDrawer);
  document.getElementById("checkout-demo").addEventListener("click", () => {
    if (Cart.count())
      showToast(
        "El pago y la creación automática de tu cuenta se activan al llevar la plataforma a producción.",
      );
  });
  document.addEventListener("click", (e) => {
    const button = e.target.closest(
      "[data-course],[data-add],[data-buy],[data-remove],[data-browse]",
    );
    if (!button) return;
    if (button.dataset.course) courseModal(button.dataset.course);
    if (button.dataset.add || button.dataset.buy) {
      const id = button.dataset.add || button.dataset.buy;
      const added = Cart.add(getProducto(id));
      if (added === null) return;
      showToast(
        added
          ? "Sumado a tu selección. Podés seguir explorando."
          : "Esta propuesta ya está en tu selección.",
      );
      if (button.dataset.buy) openCartDrawer();
    }
    if (button.dataset.remove) {
      Cart.remove(button.dataset.remove);
      const next =
        document.querySelector("[data-remove]") ||
        document.querySelector("[data-browse]");
      next?.focus();
    }
    if (button.hasAttribute("data-browse")) {
      closeOverlay();
      document
        .getElementById("cursos")
        .scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
    }
  });
  document.addEventListener("cart:updated", () => {
    updateCartBadge();
    renderCart();
  });
  window.addEventListener("storage", (e) => {
    if (e.key === Cart.KEY) {
      updateCartBadge();
      renderCart();
    }
  });
  updateCartBadge();
}
const reduceMotion =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let revealsListos = false;

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
if (typeof document !== "undefined") {
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
    nav.removeAttribute("role");
    nav.removeAttribute("aria-modal");
    nav.classList.remove("open");
    bd.classList.remove("open");
    if (!desktopMq.matches) nav.setAttribute("inert", "");
    toggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("no-scroll");
  };
  const open = () => {
    nav.setAttribute("role", "dialog");
    nav.setAttribute("aria-modal", "true");
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
if (typeof document !== "undefined")
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
if (typeof document !== "undefined") {
  initCatalog();
  initCourseSchema();
  initReveals();
  initNav();
  initOverlays();
  initActions();
  initFloats();
  initModelBarScroll();
  const courseSlug = new URLSearchParams(location.search).get("curso");
  const linked = CURSOS.find((p) => p.slug === courseSlug);
  if (linked) courseModal(linked.id);
}
