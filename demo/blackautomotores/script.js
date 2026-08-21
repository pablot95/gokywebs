const WHATSAPP_NUMBER = "5493873115008";

const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

const SILUETA_AUTO =
  '<svg viewBox="0 0 200 100" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round" aria-hidden="true">' +
  '<path d="M10,72 L10,55 Q10,49 16,47 L46,47 Q57,29 76,27 L124,27 Q143,29 154,47 L184,47 Q190,49 190,55 L190,72 Z"/>' +
  '<circle cx="46" cy="72" r="13"/><circle cx="154" cy="72" r="13"/>' +
  '<line x1="10" y1="72" x2="30" y2="72"/><line x1="170" y1="72" x2="190" y2="72"/>' +
  "</svg>";

const TIPOS = [
  { id: "sedan", nombre: "Sedán" },
  { id: "hatchback", nombre: "Hatchback" },
  { id: "suv", nombre: "SUV" },
  { id: "pickup", nombre: "Pickup" },
];

const VEHICULOS = [
  {
    id: 1,
    marca: "Ford",
    modelo: "F-100",
    año: 1985,
    tipo: "pickup",
    color: "Amarillo",
    transmision: "Manual",
    combustible: "Nafta",
    km: 180000,
    precio: 8500000,
    destacado: true,
    imagen: "images/vehiculo-pickup-clasica-1600x1300.webp",
    descripcion:
      "Pickup clásica restaurada, motor a nafta en buen estado general. Ideal para quienes buscan un vehículo con carácter propio.",
    caracteristicas: [
      "Caja manual",
      "Doble tracción",
      "Interior original",
      "Chapa y pintura recientes",
    ],
  },
  {
    id: 2,
    marca: "Peugeot",
    modelo: "405",
    año: 1998,
    tipo: "sedan",
    color: "Blanco",
    transmision: "Manual",
    combustible: "Nafta",
    km: 210000,
    precio: 3200000,
    destacado: true,
    imagen: "images/familia-sedan-vehiculo-1600x1300.webp",
    descripcion:
      "Sedán familiar de mantenimiento constante, ideal como primer auto o rodado de uso diario.",
    caracteristicas: [
      "Aire acondicionado",
      "Dirección asistida",
      "Cierre centralizado",
      "Service al día",
    ],
  },
  {
    id: 3,
    marca: "Volkswagen",
    modelo: "Gol Trend 1.6",
    año: 2015,
    tipo: "hatchback",
    color: "Gris",
    transmision: "Manual",
    combustible: "Nafta",
    km: 98000,
    precio: 9800000,
    destacado: true,
    imagen: null,
    descripcion:
      "Hatchback confiable y económico, muy buscado por su bajo consumo y repuestos accesibles.",
    caracteristicas: [
      "Aire acondicionado",
      "Airbags",
      "Vidrios eléctricos",
      "Único dueño",
    ],
  },
  {
    id: 4,
    marca: "Chevrolet",
    modelo: "Onix Joy",
    año: 2019,
    tipo: "hatchback",
    color: "Blanco",
    transmision: "Manual",
    combustible: "Nafta",
    km: 62000,
    precio: 14500000,
    destacado: true,
    imagen: null,
    descripcion:
      "Pocos kilómetros, ideal para ciudad. Buen equipamiento de serie y bajo consumo.",
    caracteristicas: [
      "Central multimedia",
      "Airbags dobles",
      "Llantas de aleación",
      "Service oficial",
    ],
  },
  {
    id: 5,
    marca: "Toyota",
    modelo: "Corolla XEI",
    año: 2017,
    tipo: "sedan",
    color: "Gris oscuro",
    transmision: "Automática",
    combustible: "Nafta",
    km: 85000,
    precio: 16900000,
    destacado: true,
    imagen: null,
    descripcion:
      "Sedán mediano con caja automática, motor reconocido por su durabilidad.",
    caracteristicas: [
      "Caja automática",
      "Tapizado de cuero",
      "Control crucero",
      "Cámara de retroceso",
    ],
  },
  {
    id: 6,
    marca: "Ford",
    modelo: "EcoSport Freestyle",
    año: 2016,
    tipo: "suv",
    color: "Rojo",
    transmision: "Manual",
    combustible: "Nafta",
    km: 92000,
    precio: 13200000,
    destacado: false,
    imagen: null,
    descripcion:
      "SUV compacta, cómoda para viajes largos y uso urbano por igual.",
    caracteristicas: [
      "Aire acondicionado",
      "Barras de techo",
      "Sensores de estacionamiento",
      "Neumáticos nuevos",
    ],
  },
  {
    id: 7,
    marca: "Renault",
    modelo: "Sandero Privilege",
    año: 2018,
    tipo: "hatchback",
    color: "Azul",
    transmision: "Manual",
    combustible: "Nafta",
    km: 70000,
    precio: 10900000,
    destacado: false,
    imagen: null,
    descripcion: "Hatchback espacioso por dentro, ideal para familia chica.",
    caracteristicas: [
      "Central multimedia",
      "Aire acondicionado",
      "Cierre centralizado",
      "Segundo juego de llaves",
    ],
  },
  {
    id: 8,
    marca: "Fiat",
    modelo: "Cronos Drive",
    año: 2020,
    tipo: "sedan",
    color: "Blanco",
    transmision: "Manual",
    combustible: "Nafta",
    km: 45000,
    precio: 15800000,
    destacado: true,
    imagen: null,
    descripcion:
      "Sedán moderno con pocos kilómetros, prácticamente como nuevo.",
    caracteristicas: [
      "Central multimedia táctil",
      "Airbags dobles",
      "Llantas de aleación",
      "Garantía de fábrica vigente",
    ],
  },
  {
    id: 9,
    marca: "Peugeot",
    modelo: "208 Allure",
    año: 2019,
    tipo: "hatchback",
    color: "Negro",
    transmision: "Manual",
    combustible: "Nafta",
    km: 58000,
    precio: 12700000,
    destacado: false,
    imagen: null,
    descripcion: "Diseño europeo, manejo ágil y buen equipamiento de confort.",
    caracteristicas: [
      "Volante multifunción",
      "Aire acondicionado",
      "Faros LED",
      "Único dueño",
    ],
  },
  {
    id: 10,
    marca: "Chevrolet",
    modelo: "S10 LT",
    año: 2014,
    tipo: "pickup",
    color: "Gris",
    transmision: "Manual",
    combustible: "Diésel",
    km: 145000,
    precio: 17500000,
    destacado: false,
    imagen: null,
    descripcion:
      "Pickup de trabajo, motor diésel de bajo consumo y probada resistencia.",
    caracteristicas: [
      "Doble cabina",
      "Aire acondicionado",
      "Barra antivuelco",
      "Caja de carga con lona",
    ],
  },
  {
    id: 11,
    marca: "Toyota",
    modelo: "Hilux SRV",
    año: 2018,
    tipo: "pickup",
    color: "Blanco",
    transmision: "Automática",
    combustible: "Diésel",
    km: 88000,
    precio: 28900000,
    destacado: true,
    imagen: null,
    descripcion:
      "Una de las pickups más buscadas del mercado, mantenimiento al día.",
    caracteristicas: [
      "4x4",
      "Caja automática",
      "Cuero",
      "Control de estabilidad",
    ],
  },
  {
    id: 12,
    marca: "Honda",
    modelo: "HR-V EX",
    año: 2017,
    tipo: "suv",
    color: "Plata",
    transmision: "Automática",
    combustible: "Nafta",
    km: 76000,
    precio: 19400000,
    destacado: false,
    imagen: null,
    descripcion:
      "SUV con caja automática, ideal para quien busca comodidad en ruta.",
    caracteristicas: [
      "Caja automática",
      "Techo solar",
      "Cámara 360°",
      "Climatizador bizona",
    ],
  },
  {
    id: 13,
    marca: "Citroën",
    modelo: "C4 Lounge",
    año: 2015,
    tipo: "sedan",
    color: "Gris",
    transmision: "Manual",
    combustible: "Nafta",
    km: 118000,
    precio: 11300000,
    destacado: false,
    imagen: null,
    descripcion: "Sedán amplio, buen espacio de baúl para viajes largos.",
    caracteristicas: [
      "Aire acondicionado",
      "Computadora de a bordo",
      "Cierre centralizado",
      "Neumáticos nuevos",
    ],
  },
  {
    id: 14,
    marca: "Renault",
    modelo: "Duster Privilege",
    año: 2019,
    tipo: "suv",
    color: "Marrón",
    transmision: "Manual",
    combustible: "Nafta",
    km: 64000,
    precio: 18600000,
    destacado: false,
    imagen: null,
    descripcion:
      "SUV robusta con buena altura libre al piso, ideal para rutas de montaña.",
    caracteristicas: [
      "4x2",
      "Central multimedia",
      "Sensores de estacionamiento",
      "Barras de techo",
    ],
  },
  {
    id: 15,
    marca: "Volkswagen",
    modelo: "Amarok Highline",
    año: 2016,
    tipo: "pickup",
    color: "Negro",
    transmision: "Automática",
    combustible: "Diésel",
    km: 102000,
    precio: 24700000,
    destacado: false,
    imagen: null,
    descripcion:
      "Pickup premium con caja automática y terminaciones de alta gama.",
    caracteristicas: ["4Motion", "Caja automática", "Cuero", 'Llantas 18"'],
  },
];

function formatPrecio(valor) {
  return valor.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  });
}

function formatKm(valor) {
  return `${valor.toLocaleString("es-AR")} km`;
}

function tipoNombre(id) {
  const t = TIPOS.find((x) => x.id === id);
  return t ? t.nombre : id;
}

function mediaHTML(v) {
  if (v.imagen)
    return `<img src="${v.imagen}" alt="${v.marca} ${v.modelo}" width="600" height="450" loading="lazy">`;
  return `<div class="card-silueta">${SILUETA_AUTO}</div>`;
}

function cardHTML(v) {
  return `
    <article class="card" data-id="${v.id}">
      <div class="card-media">
        ${mediaHTML(v)}
        <span class="card-badge">${v.año}</span>
        <button type="button" class="card-quick" data-quick="${v.id}" aria-label="Ver detalle de ${v.marca} ${v.modelo}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z"/><circle cx="12" cy="12" r="3"/></svg>
        </button>
      </div>
      <div class="card-body">
        <span class="card-marca">${v.marca}</span>
        <h3 class="card-title">${v.modelo}</h3>
        <div class="card-specs">
          <span>${formatKm(v.km)}</span>
          <span>${v.transmision}</span>
          <span>${v.combustible}</span>
        </div>
        <div class="card-precio">${formatPrecio(v.precio)}</div>
        <a class="card-wsp" data-wsp-msg="Hola! Quiero consultar por el ${v.marca} ${v.modelo} ${v.año}." href="https://wa.me/${WHATSAPP_NUMBER}" target="_blank" rel="noopener noreferrer">Consultar por WhatsApp</a>
      </div>
    </article>`;
}

function renderList(container, lista) {
  container.innerHTML = lista.map(cardHTML).join("");
}

function initDestacados() {
  const track = document.getElementById("railDestacadosTrack");
  renderList(
    track,
    VEHICULOS.filter((v) => v.destacado),
  );
}

function initTipos() {
  const track = document.getElementById("tiposTrack");
  track.innerHTML = TIPOS.map(
    (t) =>
      `<button type="button" class="tipo-chip" data-tipo="${t.id}">${SILUETA_AUTO_MINI}<span>${t.nombre}</span></button>`,
  ).join("");
  track.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-tipo]");
    if (!btn) return;
    const select = document.getElementById("filtroTipo");
    const yaActivo = select.value === btn.dataset.tipo;
    select.value = yaActivo ? "" : btn.dataset.tipo;
    track
      .querySelectorAll(".tipo-chip")
      .forEach((c) => c.classList.toggle("is-activo", c === btn && !yaActivo));
    select.dispatchEvent(new window.Event("change"));
    document.getElementById("catalogo").scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
  });
}
const SILUETA_AUTO_MINI =
  '<svg viewBox="0 0 200 100" fill="none" stroke="currentColor" stroke-width="10" stroke-linejoin="round" aria-hidden="true">' +
  '<path d="M10,72 L10,55 Q10,49 16,47 L46,47 Q57,29 76,27 L124,27 Q143,29 154,47 L184,47 Q190,49 190,55 L190,72 Z"/>' +
  '<circle cx="46" cy="72" r="13"/><circle cx="154" cy="72" r="13"/>' +
  "</svg>";

const estadoCatalogo = {
  busqueda: "",
  tipo: "",
  marca: "",
  orden: "relevancia",
};

function initFiltros() {
  const selectTipo = document.getElementById("filtroTipo");
  TIPOS.forEach((t) => {
    const opt = document.createElement("option");
    opt.value = t.id;
    opt.textContent = t.nombre;
    selectTipo.appendChild(opt);
  });
  const marcas = [...new Set(VEHICULOS.map((v) => v.marca))].sort((a, b) =>
    a.localeCompare(b, "es"),
  );
  const selectMarca = document.getElementById("filtroMarca");
  marcas.forEach((m) => {
    const opt = document.createElement("option");
    opt.value = m;
    opt.textContent = m;
    selectMarca.appendChild(opt);
  });

  document.getElementById("buscador").addEventListener("input", (e) => {
    estadoCatalogo.busqueda = e.target.value.trim().toLowerCase();
    renderCatalogo();
  });
  selectTipo.addEventListener("change", (e) => {
    estadoCatalogo.tipo = e.target.value;
    document
      .querySelectorAll(".tipo-chip")
      .forEach((c) =>
        c.classList.toggle("is-activo", c.dataset.tipo === e.target.value),
      );
    renderCatalogo();
  });
  selectMarca.addEventListener("change", (e) => {
    estadoCatalogo.marca = e.target.value;
    renderCatalogo();
  });
  document.getElementById("filtroOrden").addEventListener("change", (e) => {
    estadoCatalogo.orden = e.target.value;
    renderCatalogo();
  });
}

function vehiculosFiltrados() {
  let lista = VEHICULOS.filter((v) => {
    if (estadoCatalogo.tipo && v.tipo !== estadoCatalogo.tipo) return false;
    if (estadoCatalogo.marca && v.marca !== estadoCatalogo.marca) return false;
    if (estadoCatalogo.busqueda) {
      const texto = `${v.marca} ${v.modelo}`.toLowerCase();
      if (!texto.includes(estadoCatalogo.busqueda)) return false;
    }
    return true;
  });
  if (estadoCatalogo.orden === "precio-asc")
    lista = lista.slice().sort((a, b) => a.precio - b.precio);
  else if (estadoCatalogo.orden === "precio-desc")
    lista = lista.slice().sort((a, b) => b.precio - a.precio);
  else if (estadoCatalogo.orden === "año-desc")
    lista = lista.slice().sort((a, b) => b.año - a.año);
  else
    lista = lista
      .slice()
      .sort((a, b) => (b.destacado === true) - (a.destacado === true));
  return lista;
}

function renderCatalogo() {
  const grid = document.getElementById("catalogoGrid");
  const vacio = document.getElementById("catalogoVacio");
  const resultados = document.getElementById("catalogoResultados");
  const lista = vehiculosFiltrados();
  grid.hidden = lista.length === 0;
  vacio.hidden = lista.length !== 0;
  resultados.textContent = lista.length
    ? `${lista.length} vehículo${lista.length === 1 ? "" : "s"} encontrado${lista.length === 1 ? "" : "s"}`
    : "";
  renderList(grid, lista);
}

function abrirModal(id) {
  const v = VEHICULOS.find((x) => x.id === id);
  if (!v) return;
  const scroll = document.getElementById("modalScroll");
  const mediaInner = v.imagen
    ? `<img src="${v.imagen}" alt="${v.marca} ${v.modelo}" width="600" height="600">`
    : SILUETA_AUTO;
  scroll.innerHTML = `
    <div class="modal-media">${mediaInner}</div>
    <div class="modal-info">
      <span class="card-marca">${v.marca} · ${tipoNombre(v.tipo)}</span>
      <h2 id="modalTitulo">${v.modelo} ${v.año}</h2>
      <div class="modal-precio">${formatPrecio(v.precio)}</div>
      <p class="modal-desc">${v.descripcion}</p>
      <ul class="modal-specs">
        <li>${formatKm(v.km)}</li>
        <li>${v.transmision}</li>
        <li>${v.combustible}</li>
        <li>Color ${v.color}</li>
        ${v.caracteristicas.map((c) => `<li>${c}</li>`).join("")}
      </ul>
      <a class="btn btn-cta modal-agregar" data-wsp-msg="Hola! Quiero consultar por el ${v.marca} ${v.modelo} ${v.año}." href="https://wa.me/${WHATSAPP_NUMBER}" target="_blank" rel="noopener noreferrer">Consultar por WhatsApp</a>
    </div>`;
  initWspLinks();
  const modal = document.getElementById("modalVehiculo");
  modal.setAttribute("aria-labelledby", "modalTitulo");
  modal.removeAttribute("inert");
  document.getElementById("modalOverlay").hidden = false;
  requestAnimationFrame(() => {
    document.getElementById("modalOverlay").classList.add("is-open");
    modal.classList.add("is-open");
  });
  document.body.style.overflow = "hidden";
  document.getElementById("modalClose").focus();
}

function cerrarModal() {
  document.getElementById("modalOverlay").classList.remove("is-open");
  const modal = document.getElementById("modalVehiculo");
  modal.classList.remove("is-open");
  modal.setAttribute("inert", "");
  setTimeout(() => {
    document.getElementById("modalOverlay").hidden = true;
  }, 300);
  document.body.style.overflow = "";
}

function initModal() {
  document.getElementById("modalClose").addEventListener("click", cerrarModal);
  document
    .getElementById("modalOverlay")
    .addEventListener("click", cerrarModal);
  document.addEventListener("keydown", (e) => {
    if (
      e.key === "Escape" &&
      document.getElementById("modalVehiculo").classList.contains("is-open")
    )
      cerrarModal();
  });
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-quick]");
    if (btn) abrirModal(Number(btn.dataset.quick));
  });
}

function initNav() {
  const nav = document.getElementById("mainNav");
  const toggle = document.getElementById("navToggle");
  const close = document.getElementById("navClose");
  const scrim = document.getElementById("navScrim");
  const desktopMq = window.matchMedia("(min-width: 641px)");

  function abrir() {
    nav.classList.add("is-open");
    nav.removeAttribute("inert");
    scrim.hidden = false;
    toggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }
  function cerrar() {
    nav.classList.remove("is-open");
    if (!desktopMq.matches) nav.setAttribute("inert", "");
    else nav.removeAttribute("inert");
    scrim.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  toggle.addEventListener("click", abrir);
  close.addEventListener("click", cerrar);
  scrim.addEventListener("click", cerrar);
  nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", cerrar));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") cerrar();
  });
  desktopMq.addEventListener("change", () => cerrar());
  cerrar();
}

function initWspLinks() {
  document.querySelectorAll("[data-wsp-msg]").forEach((a) => {
    const msg = a.dataset.wspMsg;
    if (!msg) return;
    a.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  });
}

function initRailDrag(vp) {
  if (!vp) return;
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
      vp.setPointerCapture?.(pointerId);
    }
    e.preventDefault();
    vp.scrollLeft = startScroll - dx;
  });
  const end = (e) => {
    if (!dragging || (e && pointerId !== null && e.pointerId !== pointerId))
      return;
    dragging = false;
    if (moved) {
      vp.releasePointerCapture?.(pointerId);
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

function initRailWheel(vp) {
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
}

const RUTA_PASOS = 4;

function initRuta() {
  const svg = document.getElementById("rutaSvg");
  const track = document.getElementById("rutaProgreso");
  const trackBg = svg.querySelector(".ruta-track");
  const auto = document.getElementById("rutaAuto");
  const pasos = document.querySelectorAll("#rutaPasos .ruta-paso");
  if (!svg || !track || !auto || !pasos.length) return;

  const total = trackBg.getTotalLength();
  track.style.strokeDasharray = String(total);
  track.style.strokeDashoffset = String(total);

  const puntos = [];
  for (let i = 0; i < RUTA_PASOS; i++) {
    const frac = i / (RUTA_PASOS - 1);
    puntos.push(trackBg.getPointAtLength(total * frac));
  }

  function setPaso(index) {
    const p = puntos[index];
    if (!p) return;
    auto.style.transform = `translate(${p.x}px, ${p.y}px)`;
    const frac = index / (RUTA_PASOS - 1);
    track.style.strokeDashoffset = String(total * (1 - frac));
    pasos.forEach((el, i) => el.classList.toggle("is-on", i === index));
  }

  setPaso(0);

  if (typeof IntersectionObserver === "undefined" || reduceMotion) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        setPaso(Number(entry.target.dataset.paso));
      });
    },
    { threshold: 0, rootMargin: "-45% 0px -45% 0px" },
  );
  pasos.forEach((p) => observer.observe(p));
}

function initReveals() {
  const els = document.querySelectorAll("[data-animate]");
  if (typeof gsap === "undefined" || reduceMotion) {
    els.forEach((el) => {
      el.style.opacity = 1;
      el.style.transform = "none";
    });
    return;
  }
  els.forEach((el) => {
    gsap.to(el, {
      y: 0,
      x: 0,
      opacity: 1,
      duration: 0.9,
      ease: "expo.out",
      delay: parseFloat(el.dataset.delay || 0),
      scrollTrigger: { trigger: el, start: "top 88%", once: true },
    });
  });
}

function initRevealsStagger() {
  const contenedores = document.querySelectorAll("[data-animate-stagger]");
  if (typeof gsap === "undefined" || reduceMotion) {
    contenedores.forEach((cont) => {
      [...cont.children].forEach((child) => {
        child.style.opacity = 1;
        child.style.transform = "none";
      });
    });
    return;
  }
  contenedores.forEach((cont) => {
    const hijos = [...cont.children];
    gsap.set(hijos, { opacity: 0, y: 26 });
    gsap.to(hijos, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "expo.out",
      stagger: 0.14,
      scrollTrigger: { trigger: cont, start: "top 85%", once: true },
    });
  });
}

function initFloatingWsp() {
  const btn = document.getElementById("floatingWsp");
  if (!btn) return;
  function check() {
    if (window.scrollY > 600) btn.classList.add("is-visible");
    else btn.classList.remove("is-visible");
  }
  check();
  window.addEventListener("scroll", check, { passive: true });
}

function initAntiCopia() {
  document.addEventListener("contextmenu", (e) => e.preventDefault());
  document.addEventListener("dragstart", (e) => e.preventDefault());
  document.addEventListener("keydown", (e) => {
    if (e.key === "F12") e.preventDefault();
    if (e.ctrlKey && ["u", "s", "c"].includes(e.key.toLowerCase()))
      e.preventDefault();
  });
}

function initJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    name: "Black Automotores",
    description:
      "Agencia de autos usados en Salta Capital con catálogo de vehículos revisados.",
    telephone: `+${WHATSAPP_NUMBER}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Salta",
      addressRegion: "Salta",
      addressCountry: "AR",
    },
  };
  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [...document.querySelectorAll(".faq-lista details")].map(
      (d) => ({
        "@type": "Question",
        name: d.querySelector("summary").textContent.trim(),
        acceptedAnswer: {
          "@type": "Answer",
          text: d.querySelector("p").textContent.trim(),
        },
      }),
    ),
  };
  [data, faqData].forEach((d) => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(d);
    document.head.appendChild(script);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("anioActual").textContent = new Date().getFullYear();

  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
  }
  if (typeof gsap === "undefined") {
    document.querySelectorAll("[data-animate]").forEach((el) => {
      el.style.opacity = 1;
      el.style.transform = "none";
    });
  }

  initDestacados();
  initTipos();
  initFiltros();
  renderCatalogo();
  initModal();
  initNav();
  initWspLinks();
  initRailDrag(document.getElementById("railDestacados"));
  initRailWheel(document.getElementById("railDestacados"));
  initRuta();
  initReveals();
  initRevealsStagger();
  initFloatingWsp();
  initAntiCopia();
  initJsonLd();

  window.addEventListener("load", () => {
    if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
  });
});
