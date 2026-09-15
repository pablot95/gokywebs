const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;
const WHATSAPP_NUMBER = "5493444578971";
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

const CATEGORIAS = [
  {
    id: "cultivos",
    nombre: "Cultivos y siembra",
    clase: "cat-cultivos",
    img: "images/ebook-agrario-trigo-tablet_1x1.webp",
  },
  {
    id: "suelos",
    nombre: "Suelos y fertilidad",
    clase: "cat-suelos",
    img: "images/recursos-digitales-agrarios_1x1.webp",
  },
  {
    id: "ganaderia",
    nombre: "Ganadería",
    clase: "cat-ganaderia",
    img: "images/docente-comprando-ebook-agrario_4x5.webp",
  },
  {
    id: "agroecologia",
    nombre: "Agroecología y sustentabilidad",
    clase: "cat-agroecologia",
    img: "images/coleccion-tres-ebooks-agrarios_5x3.webp",
  },
  {
    id: "clima",
    nombre: "Climatología y recursos hídricos",
    clase: "cat-clima",
    img: "images/espacio-estudio-ebooks-agrarios_2.8x1.webp",
  },
  {
    id: "aula",
    nombre: "Recursos para el aula",
    clase: "cat-aula",
    graphic: true,
  },
];

const PRODUCTOS = [
  {
    id: 1,
    slug: "cereales-invierno",
    nombre: "Cereales de Invierno: Trigo, Cebada y Avena",
    categoria: "cultivos",
    nivel: "Ciclo Orientado",
    precio: 6800,
    descuento: 0,
    nuevo: false,
    stock: 999,
    descripcion:
      "Ciclo completo de los tres cereales de invierno: siembra, macollaje, espigazón y cosecha, con fichas comparativas listas para proyectar.",
    tags: ["trigo", "cebada", "avena", "cereales", "invierno"],
  },
  {
    id: 2,
    slug: "oleaginosas-aula",
    nombre: "Oleaginosas: Soja y Girasol en el Aula",
    categoria: "cultivos",
    nivel: "Ciclo Orientado",
    precio: 6800,
    descuento: 15,
    nuevo: false,
    stock: 999,
    descripcion:
      "Comparativo de soja y girasol pensado para el aula: requerimientos de suelo, plagas frecuentes y actividades de reconocimiento de estados fenológicos.",
    tags: ["soja", "girasol", "oleaginosas"],
  },
  {
    id: 3,
    slug: "horticultura-escolar",
    nombre: "Horticultura Escolar: De la Siembra a la Cosecha",
    categoria: "cultivos",
    nivel: "Ciclo Básico",
    precio: 5200,
    descuento: 0,
    nuevo: true,
    stock: 999,
    descripcion:
      "Guía para armar y sostener una huerta escolar durante el ciclo lectivo, con calendario de siembra y planillas de seguimiento por grupo.",
    tags: ["huerta", "hortalizas", "siembra"],
  },
  {
    id: 4,
    slug: "rotacion-cultivos",
    nombre: "Rotación de Cultivos: Fichas para Imprimir",
    categoria: "cultivos",
    nivel: "Ciclo Básico",
    precio: 4800,
    descuento: 0,
    nuevo: false,
    stock: 999,
    descripcion:
      "Fichas para imprimir sobre secuencias de rotación y su efecto en la fertilidad del suelo, con ejemplos de la región pampeana y del NEA.",
    tags: ["rotacion", "fichas", "suelo"],
  },
  {
    id: 5,
    slug: "suelos-clasificacion",
    nombre: "Suelos: Guía de Clasificación y Manejo",
    categoria: "suelos",
    nivel: "Ciclo Orientado",
    precio: 7200,
    descuento: 20,
    nuevo: false,
    stock: 999,
    descripcion:
      "Clasificación de suelos agrarios y criterios de manejo según textura, drenaje y aptitud, con guía de campo para la salida a terreno.",
    tags: ["suelos", "clasificacion", "manejo"],
  },
  {
    id: 6,
    slug: "fertilizacion-precision",
    nombre: "Fertilización de Precisión, Paso a Paso",
    categoria: "suelos",
    nivel: "Capacitación Docente",
    precio: 8900,
    descuento: 0,
    nuevo: false,
    stock: 999,
    descripcion:
      "Introducción a la fertilización variable para actualización docente: mapas de rendimiento, dosis por ambiente y su traducción a clase.",
    tags: ["fertilizacion", "precision", "nutrientes"],
  },
  {
    id: 7,
    slug: "muestreo-suelo",
    nombre: "Muestreo de Suelo: Protocolo de Campo",
    categoria: "suelos",
    nivel: "Ciclo Básico",
    precio: 5200,
    descuento: 0,
    nuevo: false,
    stock: 999,
    descripcion:
      "Protocolo paso a paso para el muestreo de suelo en la salida a campo, con planilla de registro lista para completar entre estudiantes.",
    tags: ["muestreo", "protocolo", "campo"],
  },
  {
    id: 8,
    slug: "manejo-pasturas",
    nombre: "Manejo de Pasturas para Bovinos",
    categoria: "ganaderia",
    nivel: "Ciclo Orientado",
    precio: 6500,
    descuento: 0,
    nuevo: false,
    stock: 999,
    descripcion:
      "Especies forrajeras más usadas en la región, carga animal y planificación del pastoreo, con casos para resolver en grupo.",
    tags: ["pasturas", "bovinos", "forraje"],
  },
  {
    id: 9,
    slug: "sanidad-animal",
    nombre: "Sanidad Animal: Protocolos Básicos",
    categoria: "ganaderia",
    nivel: "Ciclo Básico",
    precio: 5900,
    descuento: 10,
    nuevo: false,
    stock: 999,
    descripcion:
      "Protocolos básicos de sanidad animal para introducir en el aula: calendario preventivo, signos de alerta y registro sanitario del rodeo.",
    tags: ["sanidad", "veterinaria", "protocolos"],
  },
  {
    id: 10,
    slug: "produccion-avicola",
    nombre: "Producción Avícola en Pequeña Escala",
    categoria: "ganaderia",
    nivel: "Ciclo Básico",
    precio: 5200,
    descuento: 0,
    nuevo: true,
    stock: 999,
    descripcion:
      "Manejo de un gallinero escolar o de pequeña escala: instalaciones, alimentación y planilla de postura para llevar entre los estudiantes.",
    tags: ["aves", "avicultura", "granja"],
  },
  {
    id: 11,
    slug: "genetica-rodeo",
    nombre: "Genética y Mejoramiento del Rodeo",
    categoria: "ganaderia",
    nivel: "Capacitación Docente",
    precio: 8900,
    descuento: 0,
    nuevo: false,
    stock: 999,
    descripcion:
      "Conceptos de genética aplicada al mejoramiento del rodeo para actualización docente, con glosario y ejercicios de selección.",
    tags: ["genetica", "rodeo", "mejoramiento"],
  },
  {
    id: 12,
    slug: "agroecologia-principios",
    nombre: "Agroecología: Principios y Prácticas",
    categoria: "agroecologia",
    nivel: "Ciclo Orientado",
    precio: 6800,
    descuento: 0,
    nuevo: false,
    stock: 999,
    descripcion:
      "Principios de la agroecología aplicados a la escala del predio escolar, con prácticas para comparar contra el manejo convencional.",
    tags: ["agroecologia", "sustentabilidad"],
  },
  {
    id: 13,
    slug: "control-biologico-plagas",
    nombre: "Control Biológico de Plagas",
    categoria: "agroecologia",
    nivel: "Ciclo Orientado",
    precio: 6200,
    descuento: 25,
    nuevo: false,
    stock: 999,
    descripcion:
      "Alternativas de control biológico frente a las plagas más comunes de la región, con fichas de reconocimiento de enemigos naturales.",
    tags: ["plagas", "control biologico"],
  },
  {
    id: 14,
    slug: "compostaje-circular",
    nombre: "Compostaje: Economía Circular del Predio",
    categoria: "agroecologia",
    nivel: "Ciclo Básico",
    precio: 4800,
    descuento: 0,
    nuevo: false,
    stock: 999,
    descripcion:
      "Armado de una compostera escolar y su vínculo con la economía circular del predio, con bitácora de seguimiento por semana.",
    tags: ["compostaje", "reciclaje", "economia circular"],
  },
  {
    id: 15,
    slug: "agua-riego",
    nombre: "Agua y Riego: Recursos del Predio",
    categoria: "clima",
    nivel: "Ciclo Orientado",
    precio: 6500,
    descuento: 0,
    nuevo: false,
    stock: 999,
    descripcion:
      "Fuentes de agua del predio y métodos de riego más usados en la región, con ejercicios de cálculo de necesidad hídrica por cultivo.",
    tags: ["agua", "riego", "recursos hidricos"],
  },
  {
    id: 16,
    slug: "climatologia-agraria",
    nombre: "Climatología Agraria para el Aula",
    categoria: "clima",
    nivel: "Ciclo Básico",
    precio: 5200,
    descuento: 0,
    nuevo: false,
    stock: 999,
    descripcion:
      "Nociones de climatología aplicadas a la actividad agraria: heladas, lluvias y su lectura en la planificación del cultivo.",
    tags: ["clima", "climatologia"],
  },
  {
    id: 17,
    slug: "cambio-climatico-produccion",
    nombre: "Cambio Climático y Producción Agropecuaria",
    categoria: "clima",
    nivel: "Capacitación Docente",
    precio: 7800,
    descuento: 15,
    nuevo: true,
    stock: 999,
    descripcion:
      "Impacto del cambio climático sobre la producción agropecuaria regional, para actualización docente con bibliografía comentada.",
    tags: ["cambio climatico", "sustentabilidad"],
  },
  {
    id: 18,
    slug: "planificacion-anual-agrotecnica",
    nombre: "Planificación Anual para Escuelas Agrotécnicas",
    categoria: "aula",
    nivel: "Capacitación Docente",
    precio: 6900,
    descuento: 0,
    nuevo: false,
    stock: 999,
    descripcion:
      "Planificación anual editable por espacio curricular agrario, con objetivos, contenidos mínimos y cronograma sugerido.",
    tags: ["planificacion", "docentes", "programa"],
  },
  {
    id: 19,
    slug: "banco-evaluaciones",
    nombre: "Banco de Evaluaciones Agrarias",
    categoria: "aula",
    nivel: "Capacitación Docente",
    precio: 5900,
    descuento: 0,
    nuevo: true,
    stock: 999,
    descripcion:
      "Banco de evaluaciones agrarias por tema y nivel, listas para armar un examen sin partir de una hoja en blanco.",
    tags: ["evaluaciones", "examenes"],
  },
  {
    id: 20,
    slug: "guia-salidas-campo",
    nombre: "Guía de Salidas a Campo: Antes, Durante y Después",
    categoria: "aula",
    nivel: "Ciclo Básico",
    precio: 4500,
    descuento: 0,
    nuevo: false,
    stock: 999,
    descripcion:
      "Organización de una salida a campo en tres etapas, con consignas de observación y una guía de cierre para trabajar de vuelta en el aula.",
    tags: ["salidas de campo", "actividades"],
  },
];

const RAIL_IDS = [3, 5, 13, 9, 17, 1, 19, 12];

const getProducto = (id) => PRODUCTOS.find((p) => p.id === id);
const getCategoria = (id) => CATEGORIAS.find((c) => c.id === id);
const precioFinal = (p) =>
  p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;

const Cart = {
  KEY: "cuadernoagrario_cart",
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

function cardHTML(p) {
  const cat = getCategoria(p.categoria);
  const final = precioFinal(p);
  return `
  <article class="card-producto" data-id="${p.id}" data-animate="scale" style="transform:scale(.94) translateY(22px);opacity:0">
    <div class="card-cover ${cat.clase}">
      <a href="#producto=${p.slug}" class="card-hit js-open-qv" data-id="${p.id}" aria-label="Ver ${esc(p.nombre)}"></a>
      <div class="card-cover-top">
        <span class="card-cat">${esc(cat.nombre)}</span>
      </div>
      <div class="card-corner" aria-hidden="true"></div>
      <p class="card-cover-title">${esc(p.nombre)}</p>
      <div class="card-badges">
        ${p.descuento > 0 ? `<span class="badge badge-dto">-${p.descuento}%</span>` : ""}
        ${p.nuevo ? `<span class="badge badge-nuevo">Nuevo</span>` : ""}
      </div>
    </div>
    <div class="card-body">
      <span class="card-nivel">${esc(p.nivel)}</span>
      <h3 class="card-nombre">${esc(p.nombre)}</h3>
      <div class="card-precio-row">
        <span class="card-precio">${formatearPrecio(final)}</span>
        ${p.descuento > 0 ? `<span class="card-precio-orig">${formatearPrecio(p.precio)}</span>` : ""}
      </div>
      <div class="card-actions">
        <div class="qty-stepper" data-qty="1">
          <button type="button" class="js-qty-minus" aria-label="Restar cantidad">−</button>
          <span>1</span>
          <button type="button" class="js-qty-plus" aria-label="Sumar cantidad">+</button>
        </div>
        <button type="button" class="btn-add js-add" data-id="${p.id}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/></svg>
          Agregar
        </button>
      </div>
      <button type="button" class="card-comprar-full btn btn-ghost btn-sm js-comprar" data-id="${p.id}">Comprar ahora</button>
    </div>
  </article>`;
}

function renderRail() {
  const track = document.getElementById("railTrack");
  if (!track) return;
  track.innerHTML = RAIL_IDS.map((id) => getProducto(id))
    .filter(Boolean)
    .map((p) => `<div class="rail-card">${cardHTML(p)}</div>`)
    .join("");
  observeNew(track);
  bindCardEvents(track);
  updateRailArrows();
}

function renderCategorias() {
  const grid = document.getElementById("catGrid");
  if (!grid) return;
  grid.innerHTML = CATEGORIAS.map((c, i) => {
    const count = PRODUCTOS.filter((p) => p.categoria === c.id).length;
    const delay = Math.min(i * 0.07, 0.5);
    if (c.graphic) {
      return `
      <a href="#catalogo" class="cat-card is-graphic ${c.clase} js-cat-link" data-cat="${c.id}" data-animate="scale" style="transform:scale(.94);opacity:0;transition-delay:${delay}s">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M22 10 12 5 2 10l10 5 10-5Z" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 12v5c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5v-5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <span class="cat-card-label">${esc(c.nombre)}<span class="cat-card-count">${count} ebooks</span></span>
      </a>`;
    }
    return `
    <a href="#catalogo" class="cat-card js-cat-link" data-cat="${c.id}" data-animate="scale" style="transform:scale(.94);opacity:0;transition-delay:${delay}s">
      <img src="${c.img}" alt="" loading="lazy" width="600" height="600">
      <span class="cat-card-label">${esc(c.nombre)}<span class="cat-card-count">${count} ebooks</span></span>
    </a>`;
  }).join("");
  observeNew(grid);
  grid.querySelectorAll(".js-cat-link").forEach((a) =>
    a.addEventListener("click", (e) => {
      e.preventDefault();
      const catId = a.dataset.cat;
      document
        .getElementById("catalogo")
        .scrollIntoView({ behavior: "smooth" });
      setTimeout(() => setActiveCategoria(catId), 260);
    }),
  );
}

function renderMarquee() {
  const track = document.getElementById("marqueeTrack");
  if (!track) return;
  const items = CATEGORIAS.map((c) => `<span>${esc(c.nombre)}</span>`).join("");
  track.innerHTML = items + items;
}

const catalogState = {
  search: "",
  categoria: "",
  nivel: "",
  precio: "",
  soloDescuento: false,
  visibles: 16,
};

function filtrarProductos() {
  const q = normalizar(catalogState.search);
  return PRODUCTOS.filter((p) => {
    if (catalogState.categoria && p.categoria !== catalogState.categoria)
      return false;
    if (catalogState.nivel && p.nivel !== catalogState.nivel) return false;
    if (catalogState.soloDescuento && !(p.descuento > 0)) return false;
    if (catalogState.precio) {
      const [min, max] = catalogState.precio.split("-").map(Number);
      const f = precioFinal(p);
      if (f < min || f > max) return false;
    }
    if (q) {
      const cat = getCategoria(p.categoria);
      const hay = normalizar(
        [p.nombre, cat.nombre, p.nivel, p.descripcion, ...(p.tags || [])].join(
          " ",
        ),
      );
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

function renderChips() {
  const wrap = document.getElementById("chipsCategoria");
  if (!wrap) return;
  wrap.innerHTML =
    `<button type="button" class="chip is-active" data-cat="">Todas</button>` +
    CATEGORIAS.map(
      (c) =>
        `<button type="button" class="chip" data-cat="${c.id}">${esc(c.nombre)}</button>`,
    ).join("");
  wrap
    .querySelectorAll(".chip")
    .forEach((chip) =>
      chip.addEventListener("click", () =>
        setActiveCategoria(chip.dataset.cat),
      ),
    );
}

function setActiveCategoria(catId) {
  catalogState.categoria = catId;
  catalogState.visibles = 16;
  document
    .querySelectorAll("#chipsCategoria .chip")
    .forEach((c) => c.classList.toggle("is-active", c.dataset.cat === catId));
  renderCatalogo();
}

function renderCatalogo() {
  const grid = document.getElementById("catalogoGrid");
  const empty = document.getElementById("catalogoEmpty");
  const btnVerMas = document.getElementById("btnVerMas");
  const resultsCount = document.getElementById("resultsCount");
  if (!grid) return;
  const filtrados = filtrarProductos();
  const visibles = filtrados.slice(0, catalogState.visibles);

  grid.querySelectorAll(".card-producto").forEach((c) => c.remove());

  if (!filtrados.length) {
    empty.classList.add("show");
  } else {
    empty.classList.remove("show");
    const html = visibles.map((p) => cardHTML(p)).join("");
    empty.insertAdjacentHTML("beforebegin", html);
    observeNew(grid);
    bindCardEvents(grid);
  }

  resultsCount.textContent = filtrados.length
    ? `${filtrados.length} ${filtrados.length === 1 ? "ebook encontrado" : "ebooks encontrados"}`
    : "";

  btnVerMas.classList.toggle(
    "hidden",
    catalogState.visibles >= filtrados.length,
  );
  if (typeof ScrollTrigger !== "undefined")
    requestAnimationFrame(() => ScrollTrigger.refresh());
}

function bindCardEvents(scope) {
  scope.querySelectorAll(".card-producto").forEach((card) => {
    const id = Number(card.dataset.id);
    const stepper = card.querySelector(".qty-stepper");
    const qtyLabel = stepper.querySelector("span");
    const setQty = (n) => {
      stepper.dataset.qty = Math.max(1, Math.min(99, n));
      qtyLabel.textContent = stepper.dataset.qty;
    };
    card
      .querySelector(".js-qty-minus")
      .addEventListener("click", () => setQty(Number(stepper.dataset.qty) - 1));
    card
      .querySelector(".js-qty-plus")
      .addEventListener("click", () => setQty(Number(stepper.dataset.qty) + 1));
    card.querySelector(".js-add").addEventListener("click", () => {
      const p = getProducto(id);
      Cart.add(p, Number(stepper.dataset.qty));
      showToast(`"${p.nombre}" agregado al carrito`);
      setQty(1);
    });
    const comprar = card.querySelector(".js-comprar");
    if (comprar)
      comprar.addEventListener("click", () => {
        const p = getProducto(id);
        Cart.add(p, Number(stepper.dataset.qty));
        setQty(1);
        openDrawer();
      });
    card.querySelector(".js-open-qv").addEventListener("click", (e) => {
      e.preventDefault();
      openQuickView(id);
    });
  });
}

function openQuickView(id) {
  const p = getProducto(id);
  if (!p) return;
  const cat = getCategoria(p.categoria);
  const final = precioFinal(p);
  const relacionados = PRODUCTOS.filter(
    (x) => x.categoria === p.categoria && x.id !== p.id,
  ).slice(0, 3);
  const content = document.getElementById("qvContent");
  content.innerHTML = `
    <div class="modal-cover ${cat.clase}">
      <div class="page-top"><span class="card-cat">${esc(cat.nombre)}</span></div>
      <p class="modal-cover-title">${esc(p.nombre)}</p>
    </div>
    <div class="modal-info">
      <span class="card-cat">${esc(cat.nombre)}</span>
      <h2>${esc(p.nombre)}</h2>
      <p class="modal-nivel">${esc(p.nivel)} · Formato PDF</p>
      <div class="modal-precio-row">
        <span class="modal-precio">${formatearPrecio(final)}</span>
        ${p.descuento > 0 ? `<span class="card-precio-orig">${formatearPrecio(p.precio)}</span><span class="badge badge-dto">-${p.descuento}%</span>` : ""}
      </div>
      <p class="modal-desc">${esc(p.descripcion)}</p>
      <div class="modal-tags">${(p.tags || []).map((t) => `<span>${esc(t)}</span>`).join("")}</div>
      <div class="modal-actions">
        <div class="qty-stepper" data-qty="1">
          <button type="button" class="js-qv-minus" aria-label="Restar cantidad">−</button>
          <span>1</span>
          <button type="button" class="js-qv-plus" aria-label="Sumar cantidad">+</button>
        </div>
        <button type="button" class="btn btn-cta js-qv-add">Agregar al carrito</button>
        <button type="button" class="btn btn-ghost js-qv-comprar">Comprar ahora</button>
      </div>
      ${
        relacionados.length
          ? `
      <div class="modal-relacionados">
        <h3>También te puede interesar</h3>
        <div class="modal-rel-grid">
          ${relacionados
            .map(
              (r) => `
            <div class="modal-rel-item js-rel" data-id="${r.id}">
              <div class="modal-rel-cover ${getCategoria(r.categoria).clase}">${esc(r.nombre)}</div>
            </div>`,
            )
            .join("")}
        </div>
      </div>`
          : ""
      }
    </div>`;

  const stepper = content.querySelector(".qty-stepper");
  const qtyLabel = stepper.querySelector("span");
  const setQty = (n) => {
    stepper.dataset.qty = Math.max(1, Math.min(99, n));
    qtyLabel.textContent = stepper.dataset.qty;
  };
  content
    .querySelector(".js-qv-minus")
    .addEventListener("click", () => setQty(Number(stepper.dataset.qty) - 1));
  content
    .querySelector(".js-qv-plus")
    .addEventListener("click", () => setQty(Number(stepper.dataset.qty) + 1));
  content.querySelector(".js-qv-add").addEventListener("click", () => {
    Cart.add(p, Number(stepper.dataset.qty));
    showToast(`"${p.nombre}" agregado al carrito`);
    setQty(1);
  });
  content.querySelector(".js-qv-comprar").addEventListener("click", () => {
    Cart.add(p, Number(stepper.dataset.qty));
    closeQuickView();
    openDrawer();
  });
  content
    .querySelectorAll(".js-rel")
    .forEach((el) =>
      el.addEventListener("click", () => openQuickView(Number(el.dataset.id))),
    );

  document.getElementById("qvBackdrop").classList.add("open");
  document.getElementById("qvModal").removeAttribute("inert");
  document.body.classList.add("modal-open", "no-scroll");
  window.lenis?.stop?.();
  document.getElementById("qvClose").focus();
}

function closeQuickView() {
  document.getElementById("qvBackdrop").classList.remove("open");
  document.getElementById("qvModal").setAttribute("inert", "");
  document.body.classList.remove("modal-open", "no-scroll");
  window.lenis?.start?.();
}

function renderDrawer() {
  const items = Cart.get();
  const body = document.getElementById("drawerBody");
  const empty = document.getElementById("drawerEmpty");
  body.querySelectorAll(".drawer-item").forEach((el) => el.remove());
  empty.classList.toggle("show", items.length === 0);
  items.forEach((item) => {
    const p = getProducto(item.id);
    if (!p) return;
    const cat = getCategoria(p.categoria);
    const el = document.createElement("div");
    el.className = "drawer-item";
    el.innerHTML = `
      <div class="drawer-item-cover ${cat.clase}">${esc(p.nombre)}</div>
      <div class="drawer-item-info">
        <h4>${esc(p.nombre)}</h4>
        <div class="drawer-item-price">${formatearPrecio(precioFinal(p))} c/u</div>
        <div class="drawer-item-row">
          <div class="qty-stepper" data-id="${p.id}">
            <button type="button" class="js-d-minus" aria-label="Restar cantidad">−</button>
            <span>${item.qty}</span>
            <button type="button" class="js-d-plus" aria-label="Sumar cantidad">+</button>
          </div>
          <button type="button" class="drawer-item-remove js-d-remove" data-id="${p.id}">Quitar</button>
        </div>
      </div>`;
    body.appendChild(el);
    el.querySelector(".js-d-minus").addEventListener("click", () =>
      Cart.setQty(p.id, item.qty - 1),
    );
    el.querySelector(".js-d-plus").addEventListener("click", () =>
      Cart.setQty(p.id, item.qty + 1),
    );
    el.querySelector(".js-d-remove").addEventListener("click", () =>
      Cart.remove(p.id),
    );
  });
  document.getElementById("drawerTotal").textContent = formatearPrecio(
    Cart.total(),
  );
}

function openDrawer() {
  document.getElementById("drawerBackdrop").classList.add("open");
  document.getElementById("drawer").classList.add("open");
  document.getElementById("drawer").removeAttribute("inert");
  document.body.classList.add("drawer-open", "no-scroll");
  window.lenis?.stop?.();
  document.getElementById("drawerClose").focus();
}
function closeDrawer() {
  document.getElementById("drawerBackdrop").classList.remove("open");
  document.getElementById("drawer").classList.remove("open");
  document.getElementById("drawer").setAttribute("inert", "");
  document.body.classList.remove("drawer-open", "no-scroll");
  window.lenis?.start?.();
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

let revealsReady = false;
let revealObserver = null;

function primeStagger(parent) {
  Array.from(parent.children).forEach((el, i) => {
    if (!el.hasAttribute("data-animate") || el.dataset.animatePrimed) return;
    el.style.transitionDelay = Math.min(i * 0.09, 0.63) + "s";
    el.dataset.animatePrimed = "1";
  });
}

function observeNew(parent) {
  if (!parent) return;
  primeStagger(parent);
  Array.from(parent.children).forEach((el) => {
    if (!el.hasAttribute("data-animate") || el.classList.contains("in")) return;
    if (reduceMotion || !revealsReady || !revealObserver) {
      el.classList.add("in");
      return;
    }
    revealObserver.observe(el);
  });
}

function initReveals() {
  document.querySelectorAll("[data-animate-stagger]").forEach(primeStagger);
  const items = document.querySelectorAll("[data-animate]");
  if (!items.length) return;
  if (reduceMotion || !("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("in"));
    revealsReady = true;
    return;
  }
  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0, rootMargin: "0px 0px -7% 0px" },
  );
  items.forEach((el) => revealObserver.observe(el));
  revealsReady = true;

  let queued = false;
  const sweep = () => {
    queued = false;
    let pending = 0;
    document.querySelectorAll("[data-animate]:not(.in)").forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight) {
        el.classList.add("in");
        revealObserver.unobserve(el);
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

function initNav() {
  const toggle = document.getElementById("menuToggle");
  const nav = document.getElementById("mainNav");
  const closeBtn = document.getElementById("navClose");
  if (!toggle || !nav) return;
  const bd = document.getElementById("navBackdrop");
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
  cart?.addEventListener("click", openDrawer);
  sync();
}

function initRail() {
  const vp = document.getElementById("railViewport");
  if (!vp) return;
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
  vp.addEventListener("scroll", updateRailArrows, { passive: true });
  window.addEventListener("resize", updateRailArrows, { passive: true });

  document
    .getElementById("railPrev")
    ?.addEventListener("click", () =>
      vp.scrollBy({ left: -300, behavior: "smooth" }),
    );
  document
    .getElementById("railNext")
    ?.addEventListener("click", () =>
      vp.scrollBy({ left: 300, behavior: "smooth" }),
    );
}

function updateRailArrows() {
  const vp = document.getElementById("railViewport");
  const track = document.getElementById("railTrack");
  const prev = document.getElementById("railPrev");
  const next = document.getElementById("railNext");
  if (!vp || !track || !prev || !next) return;
  const inicio =
    parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
  prev.disabled = vp.scrollLeft <= inicio + 2;
  next.disabled = vp.scrollLeft >= vp.scrollWidth - vp.clientWidth - 2;
}

function initChapter() {
  const chapter = document.querySelector(".chapter");
  const book = document.getElementById("chapterBook");
  if (!chapter || !book) return;
  if (
    reduceMotion ||
    typeof gsap === "undefined" ||
    typeof ScrollTrigger === "undefined"
  ) {
    chapter.classList.add("is-static");
    book.classList.add("is-open");
    return;
  }
  const inner = chapter.querySelector(".chapter-inner");
  const steps = chapter.querySelectorAll(".chapter-step");
  const setStep = (progress) => {
    const idx = Math.min(steps.length - 1, Math.floor(progress * steps.length));
    steps.forEach((s, i) => s.classList.toggle("is-on", i === idx));
  };
  gsap
    .timeline({
      scrollTrigger: {
        trigger: inner,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.6,
        invalidateOnRefresh: true,
        onUpdate: (self) => setStep(self.progress),
      },
    })
    .to("#page1", { rotateY: -170, duration: 1, ease: "none" }, 0)
    .to("#page2", { rotateY: -170, duration: 1, ease: "none" }, 1)
    .to("#page3", { rotateY: -170, duration: 1, ease: "none" }, 2);
}

function initFilters() {
  const search = document.getElementById("searchInput");
  search.addEventListener("input", () => {
    catalogState.search = search.value;
    catalogState.visibles = 16;
    renderCatalogo();
  });

  document.getElementById("filtroNivel").addEventListener("change", (e) => {
    catalogState.nivel = e.target.value;
    catalogState.visibles = 16;
    renderCatalogo();
  });
  document.getElementById("filtroPrecio").addEventListener("change", (e) => {
    catalogState.precio = e.target.value;
    catalogState.visibles = 16;
    renderCatalogo();
  });

  const dto = document.getElementById("filtroDescuento");
  dto.addEventListener("click", () => {
    catalogState.soloDescuento = !catalogState.soloDescuento;
    dto.classList.toggle("is-active", catalogState.soloDescuento);
    dto.setAttribute("aria-pressed", String(catalogState.soloDescuento));
    catalogState.visibles = 16;
    renderCatalogo();
  });

  const clearAll = () => {
    catalogState.search = "";
    catalogState.categoria = "";
    catalogState.nivel = "";
    catalogState.precio = "";
    catalogState.soloDescuento = false;
    catalogState.visibles = 16;
    search.value = "";
    document.getElementById("filtroNivel").value = "";
    document.getElementById("filtroPrecio").value = "";
    dto.classList.remove("is-active");
    dto.setAttribute("aria-pressed", "false");
    document
      .querySelectorAll("#chipsCategoria .chip")
      .forEach((c) => c.classList.toggle("is-active", c.dataset.cat === ""));
    renderCatalogo();
  };
  document.getElementById("filtrosClear").addEventListener("click", clearAll);
  document
    .getElementById("btnLimpiarDesdeVacio")
    .addEventListener("click", clearAll);

  document.getElementById("btnVerMas").addEventListener("click", () => {
    catalogState.visibles += 16;
    renderCatalogo();
  });
}

function initDrawerAndModal() {
  document.getElementById("cartBtn").addEventListener("click", openDrawer);
  document.getElementById("drawerClose").addEventListener("click", closeDrawer);
  document
    .getElementById("drawerBackdrop")
    .addEventListener("click", closeDrawer);
  document
    .getElementById("drawerEmptyCta")
    .addEventListener("click", closeDrawer);
  document.getElementById("btnFinalizar").addEventListener("click", () => {
    if (!Cart.count()) return;
    showToast(
      "¡Genial! El pago online se activa al pasar la web a producción.",
    );
  });

  document.getElementById("qvClose").addEventListener("click", closeQuickView);
  document.getElementById("qvBackdrop").addEventListener("click", (e) => {
    if (e.target === e.currentTarget) closeQuickView();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (document.getElementById("qvBackdrop").classList.contains("open"))
      closeQuickView();
    else if (document.getElementById("drawer").classList.contains("open"))
      closeDrawer();
  });

  document.addEventListener("cart:updated", () => {
    updateCartBadge();
    renderDrawer();
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

function injectJsonLd() {
  const graph = [
    {
      "@type": "LocalBusiness",
      "@id": "https://gokywebs.com/#negocio",
      name: "Cuaderno Agrario",
      description:
        "Ebooks agrarios en PDF para docentes de escuelas agrotécnicas.",
      url: "https://gokywebs.com/",
      telephone: "+" + WHATSAPP_NUMBER,
      priceRange: "$$",
      areaServed: "AR",
    },
    ...PRODUCTOS.map((p) => ({
      "@type": "Product",
      "@id": `#${p.slug}`,
      name: p.nombre,
      description: p.descripcion,
      category: getCategoria(p.categoria).nombre,
      offers: {
        "@type": "Offer",
        priceCurrency: "ARS",
        price: precioFinal(p),
        availability: "https://schema.org/InStock",
      },
    })),
  ];
  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": graph,
  });
  document.head.appendChild(script);
}

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
}

renderChips();
renderCategorias();
renderRail();
renderMarquee();
renderCatalogo();
renderDrawer();
initReveals();
initNav();
initFloats();
initRail();
initChapter();
initFilters();
initDrawerAndModal();
initAntiCopia();
updateCartBadge();
injectJsonLd();
