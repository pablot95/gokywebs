const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

if (typeof gsap !== "undefined" && typeof window.Flip !== "undefined") {
  gsap.registerPlugin(window.Flip);
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

const WHATSAPP_NUMBER = "5491122946939";

const SERVICIOS = [
  {
    id: "coaching",
    categoria: "terapeutico",
    nombre: "Coaching",
    desc: "Un espacio de trabajo enfocado en objetivos concretos, para pensar decisiones y sostener el cambio que ya empezaste.",
  },
  {
    id: "psicoanalisis",
    categoria: "terapeutico",
    nombre: "Psicoanálisis",
    desc: "Un proceso de exploración profunda, a tu ritmo, para entender qué se repite y por qué.",
  },
  {
    id: "tcc",
    categoria: "terapeutico",
    nombre: "Terapia cognitivo-conductual",
    desc: "Herramientas concretas para identificar y modificar los pensamientos y conductas que te generan malestar.",
  },
  {
    id: "pareja-familia",
    categoria: "terapeutico",
    nombre: "Terapia de pareja y familia",
    desc: "Un espacio para que la pareja o la familia puedan escucharse sin que cada conversación termine en conflicto.",
  },
  {
    id: "infancia-desarrollo",
    categoria: "terapeutico",
    nombre: "Infancia y desarrollo",
    desc: "Acompañamiento a niños, niñas y adolescentes en las distintas etapas de su desarrollo emocional.",
  },
  {
    id: "arteterapia",
    categoria: "terapeutico",
    nombre: "Arteterapia",
    desc: "Usar la creación artística como vía de expresión, cuando las palabras no alcanzan.",
  },
  {
    id: "mindfulness",
    categoria: "terapeutico",
    nombre: "Mindfulness",
    desc: "Prácticas de atención plena para reducir el estrés y sostener la calma en el día a día.",
  },
  {
    id: "tanatologia",
    categoria: "terapeutico",
    nombre: "Tanatología",
    desc: "Acompañamiento en procesos de duelo y pérdida, con respeto por los tiempos de cada persona.",
  },
  {
    id: "counseling",
    categoria: "terapeutico",
    nombre: "Counseling",
    desc: "Orientación y escucha activa frente a una situación puntual que necesitás pensar con acompañamiento.",
  },
  {
    id: "violencia-genero",
    categoria: "terapeutico",
    nombre: "Violencia de género",
    desc: "Un espacio seguro y confidencial para procesar y salir de una situación de violencia.",
  },
  {
    id: "diagnostico-evaluaciones",
    categoria: "terapeutico",
    nombre: "Diagnóstico y evaluaciones",
    desc: "Evaluaciones psicológicas para clarificar un diagnóstico y orientar el tratamiento adecuado.",
  },
  {
    id: "adicciones",
    categoria: "terapeutico",
    nombre: "Tratamiento de adicciones",
    desc: "Abordaje del consumo problemático, con un plan de tratamiento sostenido en el tiempo.",
  },
  {
    id: "tea-neurodivergencia",
    categoria: "terapeutico",
    nombre: "T.E.A. y neurodivergencia",
    desc: "Acompañamiento a personas con T.E.A. y otras condiciones neurodivergentes, y a sus familias.",
  },
  {
    id: "capacitaciones",
    categoria: "corporativo",
    nombre: "Capacitaciones",
    desc: "Formación para equipos, con contenido adaptado a lo que tu organización necesita trabajar.",
  },
  {
    id: "conferencias",
    categoria: "corporativo",
    nombre: "Conferencias",
    desc: "Charlas sobre salud mental, comunicación y desempeño, para eventos y jornadas corporativas.",
  },
  {
    id: "neuroventas",
    categoria: "corporativo",
    nombre: "Neuroventas",
    desc: "Aplicar principios de neurociencia al proceso comercial, para vender entendiendo cómo decide el cliente.",
  },
  {
    id: "neuromarketing",
    categoria: "corporativo",
    nombre: "Neuromarketing",
    desc: "Estrategias de marketing basadas en cómo funciona realmente la toma de decisiones.",
  },
  {
    id: "asesoramiento-comercial",
    categoria: "corporativo",
    nombre: "Asesoramiento comercial",
    desc: "Acompañamiento estratégico al equipo comercial, desde la mirada de la conducta y la motivación.",
  },
  {
    id: "foda-comercial",
    categoria: "corporativo",
    nombre: "FODA comercial",
    desc: "Un diagnóstico de fortalezas, oportunidades, debilidades y amenazas aplicado a tu área comercial.",
  },
  {
    id: "diagnostico-comercial",
    categoria: "corporativo",
    nombre: "Diagnóstico comercial",
    desc: "Relevamiento del funcionamiento comercial actual, como base para mejorar resultados.",
  },
  {
    id: "diagnostico-personal",
    categoria: "corporativo",
    nombre: "Diagnóstico del personal",
    desc: "Evaluación del clima y el desempeño del equipo, para identificar qué lo está frenando.",
  },
];

const getServicio = (id) => SERVICIOS.find((s) => s.id === id);

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
  const desktopMq = window.matchMedia("(min-width: 821px)");
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
      el.style.transitionDelay = `${Math.min(i * 0.08, 0.6)}s`;
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

function servicioCardHTML(s) {
  const mensaje = `Hola Melissa! Quiero consultar sobre: ${s.nombre}.`;
  return `<article class="servicio-card" id="servicio-${s.id}" data-id="${s.id}">
    <h3>${s.nombre}</h3>
    <p>${s.desc}</p>
    <a href="${waHref(mensaje)}" target="_blank" rel="noopener">Consultar por WhatsApp →</a>
  </article>`;
}

let categoriaActiva = "terapeutico";
let ordenIds = {
  terapeutico: SERVICIOS.filter((s) => s.categoria === "terapeutico").map(
    (s) => s.id,
  ),
  corporativo: SERVICIOS.filter((s) => s.categoria === "corporativo").map(
    (s) => s.id,
  ),
};

function renderServiciosGrid() {
  const grid = document.getElementById("serviciosGrid");
  if (!grid) return;
  const ids = ordenIds[categoriaActiva];
  grid.innerHTML = ids.map((id) => servicioCardHTML(getServicio(id))).join("");
  grid.querySelectorAll(".servicio-card").forEach((card, i) => {
    card.setAttribute("data-animate", "up");
    card.style.transform = "translateY(20px)";
    card.style.opacity = "0";
    card.style.transitionDelay = `${Math.min(i * 0.05, 0.4)}s`;
  });
  initReveals();
}

function initServiciosTabs() {
  const tabTerapeuticos = document.getElementById("tabTerapeuticos");
  const tabCorporativos = document.getElementById("tabCorporativos");
  const banner = document.getElementById("serviciosBanner");
  if (!tabTerapeuticos || !tabCorporativos) return;

  const bannerSrc = {
    terapeutico: {
      src: "images/servicios-terapeuticos-sesion-1600x1300.webp",
      alt: "Sesión de terapia grupal, dos personas conversando en un ambiente cálido",
    },
    corporativo: {
      src: "images/servicios-corporativos-equipo-1600x1300.webp",
      alt: "Equipo de trabajo conversando alrededor de una mesa en una reunión",
    },
  };

  function setTab(categoria) {
    categoriaActiva = categoria;
    tabTerapeuticos.classList.toggle("is-active", categoria === "terapeutico");
    tabTerapeuticos.setAttribute(
      "aria-selected",
      String(categoria === "terapeutico"),
    );
    tabCorporativos.classList.toggle("is-active", categoria === "corporativo");
    tabCorporativos.setAttribute(
      "aria-selected",
      String(categoria === "corporativo"),
    );
    if (banner) {
      banner.src = bannerSrc[categoria].src;
      banner.alt = bannerSrc[categoria].alt;
    }
    renderServiciosGrid();
  }

  tabTerapeuticos.addEventListener("click", () => setTab("terapeutico"));
  tabCorporativos.addEventListener("click", () => setTab("corporativo"));

  renderServiciosGrid();
}

function highlightServicios(ids) {
  const primero = getServicio(ids[0]);
  if (!primero) return;
  const categoria = primero.categoria;

  const grid = document.getElementById("serviciosGrid");
  const tabTerapeuticos = document.getElementById("tabTerapeuticos");
  const tabCorporativos = document.getElementById("tabCorporativos");

  if (categoriaActiva !== categoria) {
    (categoria === "terapeutico" ? tabTerapeuticos : tabCorporativos)?.click();
  }

  const reorder = () => {
    ordenIds[categoria] = [
      ...ids.filter((id) => ordenIds[categoria].includes(id)),
      ...ordenIds[categoria].filter((id) => !ids.includes(id)),
    ];

    if (
      typeof gsap !== "undefined" &&
      typeof window.Flip !== "undefined" &&
      !reduceMotion &&
      grid
    ) {
      const state = window.Flip.getState(grid.children);
      renderServiciosGrid();
      window.Flip.from(state, {
        duration: 0.6,
        ease: "power2.inOut",
        stagger: 0.02,
      });
    } else {
      renderServiciosGrid();
    }

    ids.forEach((id) =>
      document.getElementById(`servicio-${id}`)?.classList.add("is-highlight"),
    );
    setTimeout(() => {
      ids.forEach((id) =>
        document
          .getElementById(`servicio-${id}`)
          ?.classList.remove("is-highlight"),
      );
    }, 2600);

    document
      .getElementById("servicios")
      ?.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start",
      });
  };

  if (categoriaActiva !== categoria) setTimeout(reorder, 60);
  else reorder();
}

function initConsultivo() {
  const card = document.getElementById("consultivoCard");
  if (!card) return;
  const steps = card.querySelectorAll("[data-step]");
  const step1 = card.querySelector('[data-step="1"]');
  const resultStep = card.querySelector('[data-step="3"]');
  const resultChips = document.getElementById("consultivoResultChips");
  const wspBtn = document.getElementById("consultivoWspBtn");
  const restartBtn = document.getElementById("consultivoRestart");

  function showStep(el) {
    steps.forEach((s) => {
      s.hidden = s !== el;
    });
  }

  step1.querySelectorAll("[data-path]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const path = btn.dataset.path;
      const target = card.querySelector(
        `[data-step="2"][data-path-group="${path}"]`,
      );
      if (target) showStep(target);
    });
  });

  card.querySelectorAll("[data-back]").forEach((btn) => {
    btn.addEventListener("click", () => showStep(step1));
  });

  card.querySelectorAll("[data-services]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const ids = btn.dataset.services.split(",");
      const nombres = ids.map((id) => getServicio(id)?.nombre).filter(Boolean);
      resultChips.innerHTML = nombres.map((n) => `<span>${n}</span>`).join("");
      const mensaje = `Hola Melissa! Quiero consultar sobre: ${nombres.join(", ")}.`;
      wspBtn.href = waHref(mensaje);
      showStep(resultStep);
      highlightServicios(ids);
    });
  });

  restartBtn.addEventListener("click", () => showStep(step1));
}

function initFooterYear() {
  const el = document.getElementById("footerYear");
  if (el) el.textContent = String(new Date().getFullYear());
}

initNav();
initWspFloat();
initServiciosTabs();
initConsultivo();
initFooterYear();
