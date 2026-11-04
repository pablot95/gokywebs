"use strict";
const WHATSAPP_NUMBER = "5492477465069";
const EDIT_KEY = "umbrasagrada_demo_edits";
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
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
const CURSOS_BASE = [
  {
    id: "tarot-inicial",
    titulo: "Tarot evolutivo: primeros pasos",
    categoria: "Tarot",
    nivel: "Inicial",
    modalidad: "Online",
    precio: 48000,
    minutos: 30,
    imagen: "01",
    destacado: true,
    descripcion:
      "Aprendé a leer los símbolos del tarot como una herramienta de reflexión y autoconocimiento.",
    resultado:
      "Reconocer los arcanos mayores y construir una primera lectura con preguntas abiertas.",
    requisito:
      "No necesitás experiencia. Para las prácticas se propone un mazo de tarot.",
    modulos: [
      [
        "El lenguaje de las cartas",
        "El tarot como lenguaje simbólico",
        "El mazo y sus partes",
        "Preguntas para explorar",
      ],
      [
        "Un recorrido por los arcanos",
        "Los primeros arquetipos",
        "Transformación y movimiento",
        "Integración de los símbolos",
      ],
      [
        "Tu primera lectura",
        "Preparar el encuentro",
        "Una tirada de tres cartas",
        "Registrar una interpretación",
      ],
    ],
  },
  {
    id: "carta-natal",
    titulo: "Las bases de tu carta natal",
    categoria: "Astrología",
    nivel: "Inicial",
    modalidad: "Online",
    precio: 52000,
    minutos: 40,
    imagen: "03",
    destacado: true,
    descripcion:
      "Conocé signos, planetas y casas para empezar a interpretar el mapa simbólico de una carta natal.",
    resultado:
      "Distinguir los elementos de una carta y relacionar Sol, Luna y Ascendente.",
    requisito:
      "No necesitás conocimientos previos. Podés trabajar con una carta de ejemplo.",
    modulos: [
      [
        "El mapa del cielo",
        "Signos y elementos",
        "Planetas y funciones",
        "Las doce casas",
      ],
      ["Tu tríada personal", "El Sol", "La Luna", "El Ascendente"],
      [
        "Relacionar símbolos",
        "Aspectos principales",
        "Una lectura integrada",
        "Ejercicio con una carta",
      ],
    ],
  },
  {
    id: "reiki-inicial",
    titulo: "Reiki: una práctica de presencia",
    categoria: "Reiki",
    nivel: "Inicial",
    modalidad: "Presencial",
    precio: 58000,
    minutos: 40,
    imagen: "05",
    destacado: true,
    descripcion:
      "Una introducción al Reiki, sus principios y la preparación de una práctica personal consciente.",
    resultado:
      "Conocer los principios del Reiki y explorar una rutina de atención y autocuidado.",
    requisito:
      "No necesitás experiencia. La práctica y la modalidad final se coordinan con Elizabeth.",
    modulos: [
      [
        "Acercarte al Reiki",
        "Orígenes y principios",
        "La presencia en la práctica",
        "Alcances y límites",
      ],
      [
        "Preparar el espacio",
        "Un ambiente de calma",
        "Respiración y atención",
        "Cuidado de la postura",
      ],
      [
        "La práctica personal",
        "Secuencia de autocuidado",
        "Registrar la experiencia",
        "Integrar una rutina",
      ],
    ],
  },
  {
    id: "rituales-intencion",
    titulo: "Rituales con intención",
    categoria: "Rituales",
    nivel: "Inicial",
    modalidad: "Online",
    precio: 36000,
    minutos: 20,
    imagen: "04",
    descripcion:
      "Explorá prácticas simbólicas para acompañar comienzos, cierres y momentos de cambio.",
    resultado:
      "Diseñar un ritual personal con una intención clara y elementos cotidianos.",
    requisito:
      "Cuaderno y un espacio tranquilo. No se requieren materiales especiales.",
    modulos: [
      [
        "El sentido del ritual",
        "Símbolo e intención",
        "Elegir un propósito",
        "Un registro personal",
      ],
      [
        "Elementos y cuidado",
        "Preparar el espacio",
        "Objetos con significado",
        "Uso responsable de materiales",
      ],
      [
        "Crear una práctica",
        "Ritual de inicio",
        "Ritual de cierre",
        "Reflexión e integración",
      ],
    ],
  },
  {
    id: "tarot-tiradas",
    titulo: "Tiradas para mirar más profundo",
    categoria: "Tarot",
    nivel: "Intermedio",
    modalidad: "Online",
    precio: 54000,
    minutos: 30,
    imagen: "06",
    descripcion:
      "Ampliá tu lectura con tiradas que conectan preguntas, símbolos y contextos personales.",
    resultado:
      "Elegir una tirada acorde a la consulta y comunicar una lectura con respeto.",
    requisito: "Conocimientos básicos de arcanos mayores y un mazo de tarot.",
    modulos: [
      [
        "Formular la consulta",
        "Preguntas abiertas",
        "Contexto y consentimiento",
        "Límites de una lectura",
      ],
      [
        "Tiradas y vínculos",
        "Lectura de tres posiciones",
        "Relaciones entre cartas",
        "Explorar una decisión",
      ],
      [
        "De la carta al relato",
        "Construir una interpretación",
        "Comunicar sin sentencias",
        "Práctica integradora",
      ],
    ],
  },
  {
    id: "sahumos-espacios",
    titulo: "Sahumos y cuidado del espacio",
    categoria: "Rituales",
    nivel: "Inicial",
    modalidad: "Presencial",
    precio: 32000,
    minutos: 20,
    imagen: "07",
    descripcion:
      "Conocé el sentido simbólico de los sahumos y distintas formas de preparar un espacio de práctica.",
    resultado:
      "Elegir materiales y organizar una práctica simbólica con atención al entorno.",
    requisito:
      "No necesitás experiencia. Los materiales se confirman al consultar.",
    modulos: [
      [
        "Habitar un espacio",
        "Observar el ambiente",
        "Intención y ritual",
        "Registro de sensaciones",
      ],
      [
        "Materiales y alternativas",
        "Hierbas y aromas",
        "Ventilación y precauciones",
        "Opciones sin humo",
      ],
      [
        "Una práctica propia",
        "Preparación del lugar",
        "Secuencia del encuentro",
        "Cierre y cuidado",
      ],
    ],
  },
  {
    id: "pendulo-simbolico",
    titulo: "Péndulo: exploración simbólica",
    categoria: "Rituales",
    nivel: "Inicial",
    modalidad: "Online",
    precio: 34000,
    minutos: 20,
    imagen: "08",
    descripcion:
      "Un acercamiento al péndulo como recurso simbólico de exploración y atención personal.",
    resultado:
      "Conocer el uso del péndulo, sus límites y una práctica de registro reflexivo.",
    requisito:
      "Un péndulo simple y cuaderno. No se requieren conocimientos previos.",
    modulos: [
      [
        "Conocer la herramienta",
        "Qué es un péndulo",
        "Contextos de uso simbólico",
        "Límites y expectativas",
      ],
      [
        "Observar la práctica",
        "Postura y atención",
        "Formular preguntas",
        "Sesgos e interpretación",
      ],
      [
        "Integrar un registro",
        "Una práctica guiada",
        "Registrar sin sentencias",
        "Reflexión final",
      ],
    ],
  },
  {
    id: "reiki-integracion",
    titulo: "Reiki y espacios de calma",
    categoria: "Reiki",
    nivel: "Intermedio",
    modalidad: "Presencial",
    precio: 62000,
    minutos: 40,
    imagen: "09",
    descripcion:
      "Profundizá la preparación de un encuentro de Reiki, la escucha y el cuidado del espacio.",
    resultado:
      "Organizar una secuencia de práctica con atención al consentimiento y los límites.",
    requisito:
      "Conocimientos introductorios de Reiki. El recorrido previo se conversa con Elizabeth.",
    modulos: [
      [
        "Antes del encuentro",
        "La escucha inicial",
        "Consentimiento y límites",
        "Preparación del espacio",
      ],
      [
        "Durante la práctica",
        "Presencia y atención",
        "Cuidar la comodidad",
        "Observar sin interpretar",
      ],
      [
        "Cierre e integración",
        "Cerrar el encuentro",
        "Registrar la experiencia",
        "Diseñar una práctica sostenida",
      ],
    ],
  },
].map((c) => ({
  ...c,
  slug: c.id,
  descuento: 0,
  duracion: (c.minutos * 9) / 60,
  cantidadClases: 9,
  docenteId: "elizabeth",
  docente: "Elizabeth",
  nuevo: false,
  trailer: null,
  incluye:
    "Propuesta de nueve clases y ejercicios de reflexión. Materiales y acceso a confirmar con Elizabeth.",
  modulos: c.modulos.map((m, i) => ({
    id: `${c.id}-m${i + 1}`,
    titulo: m[0],
    clases: m
      .slice(1)
      .map((t, j) => ({
        id: `${c.id}-m${i + 1}-c${j + 1}`,
        titulo: t,
        duracion: c.minutos,
        tipo: j === 2 ? "Práctica" : "Lectura",
        preview: false,
      })),
  })),
}));
const SERVICIOS_BASE = [
  {
    id: "lectura-tarot",
    titulo: "Lectura de tarot evolutivo",
    precio: 28000,
    descripcion:
      "Una lectura para explorar tu presente, poner en palabras tus preguntas y abrir nuevas perspectivas.",
  },
  {
    id: "consulta-natal",
    titulo: "Lectura de carta natal",
    precio: 38000,
    descripcion:
      "Un encuentro con el mapa simbólico de tu nacimiento para conversar sobre potenciales, desafíos y ciclos.",
  },
  {
    id: "ritual-personal",
    titulo: "Rituales personalizados",
    precio: 25000,
    descripcion:
      "Prácticas simbólicas para acompañar una intención, un nuevo comienzo o el cierre de una etapa.",
  },
  {
    id: "sesion-reiki",
    titulo: "Sesión de Reiki",
    precio: 24000,
    descripcion:
      "Un espacio de pausa y atención personal, con una práctica de Reiki coordinada con Elizabeth.",
  },
];
let CURSOS = CURSOS_BASE.map((c) => ({ ...c }));
let SERVICIOS = SERVICIOS_BASE.map((s) => ({ ...s }));
const getProducto = (id) => CURSOS.find((p) => p.id === id);
function leerLista(raw) {
  try {
    const a = JSON.parse(raw);
    if (!Array.isArray(a)) return [];
    return [
      ...new Set(
        a
          .filter((i) => i && typeof i.id === "string" && getProducto(i.id))
          .map((i) => i.id),
      ),
    ].map((id) => ({ id, qty: 1 }));
  } catch {
    return [];
  }
}
function filtrarCursos(cursos, f = {}) {
  const q = normalizar(f.q).split(/\s+/).filter(Boolean);
  return cursos.filter(
    (c) =>
      q.every((t) =>
        normalizar(
          [
            c.titulo,
            c.categoria,
            c.nivel,
            c.modalidad,
            c.docente,
            c.descripcion,
          ].join(" "),
        ).includes(t),
      ) &&
      (!f.categoria || c.categoria === f.categoria) &&
      (!f.nivel || c.nivel === f.nivel) &&
      (!f.modalidad || c.modalidad === f.modalidad) &&
      (!f.duracion ||
        (f.duracion === "corto" ? c.duracion <= 3 : c.duracion > 3)) &&
      (!f.precio ||
        (f.precio === "hasta" ? c.precio <= 50000 : c.precio > 50000)),
  );
}
function aplicarEdiciones(base, edits) {
  return base.map((p) => {
    const e = edits?.[p.id];
    if (!e || typeof e !== "object") return { ...p };
    return {
      ...p,
      titulo:
        typeof e.titulo === "string" && e.titulo.trim()
          ? e.titulo.trim().slice(0, 85)
          : p.titulo,
      descripcion:
        typeof e.descripcion === "string" && e.descripcion.trim()
          ? e.descripcion.trim().slice(0, 350)
          : p.descripcion,
      precio:
        typeof e.precio === "number" &&
        Number.isFinite(e.precio) &&
        e.precio >= 0 &&
        e.precio <= 9999999
          ? e.precio
          : p.precio,
    };
  });
}
const Cart = {
  KEY: "umbrasagrada_cart",
  get() {
    try {
      return leerLista(localStorage.getItem(this.KEY));
    } catch {
      return [];
    }
  },
  save(items) {
    try {
      localStorage.setItem(this.KEY, JSON.stringify(items));
    } catch {
      if (typeof showToast === "function")
        showToast("Este navegador no permite guardar tu selección.");
    }
    document.dispatchEvent(new CustomEvent("cart:updated"));
  },
  add(producto) {
    const items = this.get();
    if (!producto || items.some((i) => i.id === producto.id)) return false;
    items.push({ id: producto.id, qty: 1 });
    this.save(items);
    return true;
  },
  remove(id) {
    this.save(this.get().filter((i) => i.id !== id));
  },
  clear() {
    this.save([]);
  },
  count() {
    return this.get().length;
  },
  total() {
    return this.get().reduce((s, i) => s + (getProducto(i.id)?.precio || 0), 0);
  },
};
function mensajeInscripcion(items) {
  const cursos = items.map((i) => getProducto(i.id)).filter(Boolean);
  return [
    "Hola Elizabeth, quiero consultar por estas formaciones de Umbra Sagrada:",
    "",
    ...cursos.map(
      (c) =>
        `• ${c.titulo} (${c.modalidad}) — valor ilustrativo ${formatearPrecio(c.precio)}`,
    ),
    "",
    `Total ilustrativo: ${formatearPrecio(cursos.reduce((s, c) => s + c.precio, 0))}.`,
    "Vi la demo. ¿Me confirmás programas, modalidad, precios vigentes y próximas fechas?",
  ].join("\n");
}
const waHref = (text) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
const iconArrow =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M4 12h16m-6-6 6 6-6 6"/></svg>';
const iconPlus =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';
const iconClose =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6"/></svg>';
let reduceMotion = false;
let revealsListos = false;
let activeOverlay = null;
let previousFocus = null;
let demoEdits = {};
const anim =
  'data-animate="subir" style="opacity:0;transform:translateY(32px)"';
function cardHTML(c, index) {
  return `<article class="course-card" ${anim}><button type="button" class="photo-button" data-course="${c.id}" aria-label="Ver programa de ${esc(c.titulo)}"><span class="course-photo"><img src="images/${c.imagen}_imagen.webp" width="${c.imagen === "01" ? 900 : 1254}" height="${c.imagen === "01" ? 1600 : 1254}" alt="${esc({ "01": "Mazo de tarot con detalles dorados", "03": "Rueda zodiacal junto a un cuaderno", "04": "Vela y hierbas para una práctica simbólica", "05": "Espacio preparado para una sesión de Reiki", "06": "Cuaderno de trabajo para registrar lecturas", "07": "Hierbas y recipiente para sahumos", "08": "Péndulo dorado sobre tela oscura", "09": "Rincón de calma para un encuentro" }[c.imagen])}"><span class="course-number">${String(index + 1).padStart(2, "0")}</span></span></button><div class="course-info"><p class="course-kicker">${esc(c.categoria)} · ${esc(c.modalidad)}</p><h3>${esc(c.titulo)}</h3><p class="course-meta"><span>${esc(c.nivel)}</span><span>${c.duracion.toLocaleString("es-AR")} h · ${c.cantidadClases} clases</span><span>Elizabeth</span></p><div class="course-bottom"><span class="price">${formatearPrecio(c.precio)}<small>Valor ilustrativo</small></span><div class="course-actions"><button type="button" class="btn btn-outline" data-course="${c.id}">Ver programa</button><button type="button" class="icon-btn" data-add="${c.id}" aria-label="Agregar ${esc(c.titulo)} a tu inscripción">${iconPlus}</button></div></div></div></article>`;
}
function renderFeatured() {
  const el = document.getElementById("featuredGrid");
  if (!el) return;
  el.innerHTML = CURSOS.filter((c) => c.destacado)
    .map(cardHTML)
    .join("");
  revelarNuevos(el);
}
function readFilters() {
  const el = document.getElementById("courseFilters");
  if (!el) return {};
  return Object.fromEntries(new window.FormData(el));
}
function renderCatalog() {
  const el = document.getElementById("catalogGrid");
  if (!el) return;
  const found = filtrarCursos(CURSOS, readFilters()).sort((a,b)=>a.categoria.localeCompare(b.categoria,'es')||a.titulo.localeCompare(b.titulo,'es'));
  el.innerHTML = found.map(cardHTML).join("");
  document.getElementById("resultCount").textContent =
    `${found.length} ${found.length === 1 ? "formación encontrada" : "formaciones encontradas"}`;
  document.getElementById("emptyCourses").hidden = found.length > 0;
  revelarNuevos(el);
}
function renderServices() {
  const el = document.getElementById("serviceList");
  if (!el) return;
  el.innerHTML = SERVICIOS.map(
    (s, i) =>
      `<article class="service-row" ${anim}><span class="service-index">0${i + 1}</span><div><h3>${esc(s.titulo)}</h3><p>${esc(s.descripcion)}</p><div class="service-bottom"><span class="price">${formatearPrecio(s.precio)}<small>Valor ilustrativo</small></span><a class="text-link" href="${waHref(`Hola Elizabeth, quiero consultar por ${s.titulo}. Vi la demo de Umbra Sagrada. ¿Me confirmás el valor y la disponibilidad?`)}" target="_blank" rel="noopener noreferrer">Consultar sesión ${iconArrow}</a></div></div></article>`,
  ).join("");
  revelarNuevos(el);
}
function openOverlay(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const returnTo = activeOverlay ? previousFocus : document.activeElement;
  if (activeOverlay) closeOverlay(false);
  previousFocus = returnTo;
  activeOverlay = el;
  el.hidden = false;
  document.body.classList.add("no-scroll");
  el.querySelector(".dialog").scrollTop = 0;
  el.querySelector("button,a,input,select,textarea")?.focus();
}
function closeOverlay(restore = true) {
  if (!activeOverlay) return;
  activeOverlay.hidden = true;
  activeOverlay = null;
  document.body.classList.remove("no-scroll");
  if (restore && previousFocus?.isConnected) previousFocus.focus();
}
function openCourse(id) {
  const c = getProducto(id);
  if (!c) return;
  const el = document.getElementById("courseDetail");
  el.innerHTML = `<div class="modal-top"><figure class="modal-image"><img src="images/${c.imagen}_imagen.webp" width="800" height="800" alt="Imagen ilustrativa de ${esc(c.categoria)}"></figure><div class="modal-copy"><p class="eyebrow">${esc(c.categoria)} · Propuesta de demo</p><h2>${esc(c.titulo)}</h2><p>${esc(c.descripcion)}</p><p class="course-meta"><span>${esc(c.modalidad)}</span><span>${esc(c.nivel)}</span><span>${c.duracion.toLocaleString("es-AR")} h · 9 clases</span></p><p class="price">${formatearPrecio(c.precio)}<small>Precio, modalidad y programa ilustrativos, a confirmar.</small></p><button type="button" class="btn" data-buy="${c.id}">Consultar inscripción ${iconArrow}</button></div></div><div class="program"><h3>El recorrido, paso a paso</h3>${c.modulos.map((m, i) => `<details${i === 0 ? " open" : ""}><summary>Módulo ${i + 1} · ${esc(m.titulo)}</summary><ol>${m.clases.map((cl) => `<li>${esc(cl.titulo)} <span class="muted">· ${esc(cl.tipo)} · ${cl.duracion} min</span></li>`).join("")}</ol></details>`).join("")}</div><div class="modal-details"><div><h3>Para qué te prepara</h3><p>${esc(c.resultado)}</p></div><div><h3>Antes de empezar</h3><p>${esc(c.requisito)}</p></div><div><h3>Qué incluye la propuesta</h3><p>${esc(c.incluye)}</p></div><div><h3>Con Elizabeth</h3><p>Creadora de Umbra Sagrada y terapeuta holística. Consultá con ella los detalles de cada formación.</p></div></div><p class="demo-note">Esta es una muestra del programa. La demo no reproduce clases ni confirma una matrícula.</p>`;
  openOverlay("courseOverlay");
}
function renderCart() {
  const el = document.getElementById("cartLines");
  if (!el) return;
  const items = Cart.get();
  document.querySelectorAll("[data-cart-count]").forEach((b) => {
    b.textContent = items.length;
    b.hidden = !items.length;
  });
  el.innerHTML = items.length
    ? items
        .map((i) => {
          const c = getProducto(i.id);
          return `<article class="cart-line"><img src="images/${c.imagen}_imagen.webp" width="64" height="64" alt=""><div><h3>${esc(c.titulo)}</h3><p>${esc(c.modalidad)} · ${formatearPrecio(c.precio)}</p></div><button type="button" class="icon-btn" data-remove="${c.id}" aria-label="Quitar ${esc(c.titulo)}">${iconClose}</button></article>`;
        })
        .join("")
    : '<div class="empty-state"><h3>Tu próximo paso empieza acá.</h3><p>Elegí una formación para consultar su inscripción con Elizabeth.</p><button type="button" class="btn btn-outline" data-close>Explorar cursos</button></div>';
  document.getElementById("cartTotal").textContent = formatearPrecio(
    Cart.total(),
  );
  const link = document.getElementById("checkoutLink");
  link.hidden = !items.length;
  link.href = waHref(mensajeInscripcion(items));
  document.getElementById("cartSummary").hidden = !items.length;
}
function openCartDrawer() {
  renderCart();
  openOverlay("cartOverlay");
}
function readEdits() {
  try {
    const value = JSON.parse(localStorage.getItem(EDIT_KEY));
    return value && typeof value === "object" && !Array.isArray(value)
      ? value
      : {};
  } catch {
    return {};
  }
}
function refreshContent() {
  CURSOS = aplicarEdiciones(CURSOS_BASE, demoEdits);
  SERVICIOS = aplicarEdiciones(SERVICIOS_BASE, demoEdits);
  renderFeatured();
  renderCatalog();
  renderServices();
  renderCart();
}
function fillEditor() {
  const id = document.getElementById("editItem").value;
  const p = [...CURSOS, ...SERVICIOS].find((x) => x.id === id);
  if (!p) return;
  document.getElementById("editTitle").value = p.titulo;
  document.getElementById("editDescription").value = p.descripcion;
  document.getElementById("editPrice").value = p.precio;
  document.getElementById("editorStatus").textContent =
    "Los cambios válidos se guardan automáticamente en este navegador.";
}
function initEditor() {
  const sel = document.getElementById("editItem");
  if (!sel) return;
  sel.innerHTML = `<optgroup label="Cursos">${CURSOS.map((c) => `<option value="${c.id}">${esc(c.titulo)}</option>`).join("")}</optgroup><optgroup label="Servicios">${SERVICIOS.map((c) => `<option value="${c.id}">${esc(c.titulo)}</option>`).join("")}</optgroup>`;
  sel.addEventListener("change", fillEditor);
  document.getElementById("editorFields").addEventListener("input", (e) => {
    if (e.target === sel) return;
    const title = document.getElementById("editTitle");
    const desc = document.getElementById("editDescription");
    const price = document.getElementById("editPrice");
    const status = document.getElementById("editorStatus");
    if (
      !title.value.trim() ||
      !desc.value.trim() ||
      price.value.trim() === "" ||
      !price.checkValidity()
    ) {
      status.textContent = "Completá título, descripción y un precio válido.";
      return;
    }
    demoEdits[sel.value] = {
      titulo: title.value.trim(),
      descripcion: desc.value.trim(),
      precio: Number(price.value),
    };
    try {
      localStorage.setItem(EDIT_KEY, JSON.stringify(demoEdits));
      sel.selectedOptions[0].textContent = title.value.trim();
      refreshContent();
      status.textContent =
        "Vista previa actualizada. Guardado solo en este navegador.";
    } catch {
      status.textContent =
        "No se pudo guardar: el navegador bloquea el almacenamiento.";
    }
  });
  fillEditor();
  document.getElementById("resetDemo").addEventListener("click", () => {
    try {
      localStorage.removeItem(EDIT_KEY);
      demoEdits = {};
      refreshContent();
      fillEditor();
        Array.from(sel.options).forEach(option=>{const item=[...CURSOS,...SERVICIOS].find(x=>x.id===option.value);if(item)option.textContent=item.titulo;});
      showToast("Se restauraron los contenidos de esta demo.");
    } catch {
      showToast("El navegador no permite restaurar la vista previa.");
    }
  });
}
function initInteractions() {
  document.addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    if (b.dataset.course) openCourse(b.dataset.course);
    if (b.dataset.add) {
      const c = getProducto(b.dataset.add);
      showToast(
        Cart.add(c)
          ? "Formación agregada a tu consulta."
          : "Esta formación ya está en tu consulta.",
      );
    }
    if (b.dataset.buy) {
      Cart.add(getProducto(b.dataset.buy));
      openCartDrawer();
    }
    if (b.hasAttribute("data-open-cart")) openCartDrawer();
    if (b.dataset.remove) {
      Cart.remove(b.dataset.remove);
      document
        .getElementById("cartOverlay")
        .querySelector("[data-close]")
        ?.focus();
    }
    if (b.hasAttribute("data-close")) closeOverlay();
    if (b.hasAttribute("data-editor")) {
      fillEditor();
      openOverlay("editorOverlay");
    }
    if (b.dataset.social)
      showToast(
        `El enlace oficial de ${b.dataset.social} está pendiente de confirmar con Elizabeth.`,
      );
    if (b.hasAttribute("data-reset-filters")) {
      document.getElementById("courseFilters").reset();
      renderCatalog();
    }
  });
  document.querySelectorAll(".overlay").forEach((el) =>
    el.addEventListener("click", (e) => {
      if (e.target === el) closeOverlay();
    }),
  );
  document.addEventListener("keydown", (e) => {
    if (!activeOverlay) return;
    if (e.key === "Escape") {
      e.preventDefault();
      closeOverlay();
    }
    if (e.key === "Tab") {
      const focusable = [
        ...activeOverlay.querySelectorAll(
          'a[href],button,input,select,textarea,summary,[tabindex="0"]',
        ),
      ].filter((x) => !x.disabled && x.getClientRects().length);
      const first = focusable[0],
        last = focusable.at(-1);
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    }
  });
  document
    .getElementById("courseFilters")
    ?.addEventListener("input", renderCatalog);
  document
    .getElementById("courseFilters")
    ?.addEventListener("submit", (e) => e.preventDefault());
  document.addEventListener("cart:updated", renderCart);
  window.addEventListener("storage", (e) => {
    if (e.key === Cart.KEY) renderCart();
    if (e.key === EDIT_KEY) {
      demoEdits = readEdits();
      refreshContent();
    }
  });
}
function initNavFocus() {
  const nav = document.getElementById("mainNav");
  if (!nav) return;
  const sync = () => {
    if (nav.classList.contains("open")) {
      nav.setAttribute("role", "dialog");
      nav.setAttribute("aria-modal", "true");
    } else {
      nav.removeAttribute("role");
      nav.removeAttribute("aria-modal");
    }
  };
  new window.MutationObserver(sync).observe(nav, {
    attributes: true,
    attributeFilter: ["class"],
  });
  nav.addEventListener("keydown", (e) => {
    if (e.key !== "Tab" || !nav.classList.contains("open")) return;
    const nodes = [...nav.querySelectorAll("button,a")].filter(
      (x) => x.getClientRects().length,
    );
    if (e.shiftKey && document.activeElement === nodes[0]) {
      e.preventDefault();
      nodes.at(-1).focus();
    } else if (!e.shiftKey && document.activeElement === nodes.at(-1)) {
      e.preventDefault();
      nodes[0].focus();
    }
  });
}
function initFilterDisclosure() {
  const el = document.getElementById("filterPanel");
  if (!el) return;
  const mq = window.matchMedia("(min-width:601px)");
  const sync = () => {
    el.open = mq.matches;
  };
  mq.addEventListener("change", sync);
  sync();
}
if (typeof module !== "undefined" && module.exports)
  module.exports = {
    CURSOS_BASE,
    SERVICIOS_BASE,
    filtrarCursos,
    leerLista,
    aplicarEdiciones,
    Cart,
    formatearPrecio,
    mensajeInscripcion,
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

function initNav() {
  const toggle = document.getElementById("menuToggle");
  const nav = document.getElementById("mainNav");
  const closeBtn = document.getElementById("navClose");
  if (!toggle || !nav) return;
  let bd = document.querySelector(".nav-backdrop");
  if (!bd) {
    bd = document.createElement("div");
    bd.className = "nav-backdrop";
    nav.parentElement.appendChild(bd);
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
    if (desktopMq.matches) {
      close();
      nav.removeAttribute("inert");
    } else if (!nav.classList.contains("open")) nav.setAttribute("inert", "");
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

function initDemoEnvironment() {
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

if (typeof document !== "undefined") {
  reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  demoEdits = readEdits();
  refreshContent();
  initReveals();
  initNav();
  initNavFocus();
  initEditor();
  initInteractions();
  initFilterDisclosure();
  initFloats();
  initModelBarScroll();
  initDemoEnvironment();
  document
    .getElementById("editorFields")
    ?.addEventListener("submit", (e) => e.preventDefault());
  const courseId = new URLSearchParams(location.search).get("curso");
  if (courseId) openCourse(courseId);
  const structured = document.createElement("script");
  structured.type = "application/ld+json";
  structured.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": CURSOS_BASE.map((c) => ({
      "@type": "Course",
      name: c.titulo,
      description:
        c.descripcion +
        " Programa y valor ilustrativos de la demo, a confirmar con Elizabeth.",
      provider: { "@type": "Organization", name: "Umbra Sagrada" },
      offers: {
        "@type": "Offer",
        price: c.precio,
        priceCurrency: "ARS",
        url: location.origin + location.pathname + "?curso=" + c.id,
        description: "Valor ilustrativo, sujeto a confirmación.",
      },
    })),
  });
  document.head.appendChild(structured);
}
