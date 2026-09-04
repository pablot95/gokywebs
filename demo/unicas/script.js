const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;
const WSP = "5493489532243";

const esc = (s) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const TONOS = {
  1: { hex: "#1A1614", n: "Negro" },
  2: { hex: "#2B1F19", n: "Castaño muy oscuro" },
  3: { hex: "#3F2C1D", n: "Castaño oscuro" },
  4: { hex: "#563B23", n: "Castaño" },
  5: { hex: "#74532C", n: "Castaño claro" },
  6: { hex: "#956E36", n: "Rubio oscuro" },
  7: { hex: "#B79542", n: "Rubio medio" },
  8: { hex: "#D9BD43", n: "Rubio dorado" },
  9: { hex: "#E9D68E", n: "Rubio claro" },
  10: { hex: "#F4EBD2", n: "Rubio platinado" },
};

const tintaDe = (n) => (n <= 6 ? "tinta-clara" : "tinta-oscura");

const BASES = [
  { alt: 3, txt: "Castaño oscuro" },
  { alt: 5, txt: "Castaño claro" },
  { alt: 7, txt: "Rubio medio" },
  { alt: 9, txt: "Rubio claro" },
];

const DESTINOS = [
  { alt: 7, txt: "Iluminar de a poco" },
  { alt: 8, txt: "Rubio dorado" },
  { alt: 9, txt: "Rubio ceniza" },
  { alt: 10, txt: "Platinado" },
];

const PELOS = [
  { id: "virgen", txt: "Sin color previo" },
  { id: "tintura", txt: "Con tintura" },
  { id: "decolorado", txt: "Ya decolorado" },
];

const NOTAS_PELO = {
  virgen:
    "Al no tener color previo el aclarado sube parejo y el matiz te dura más.",
  tintura:
    "Como venís de tintura, el color depositado se saca primero: es un paso aparte, antes de aclarar.",
  decolorado:
    "Sobre pelo ya decolorado vamos con test previo y reconstrucción en cada paso, para no sumarle daño.",
};

const SERVICIOS = [
  {
    n: "01",
    tit: "Color y rubios",
    img: "rubio-perfil-beige-1600x1300.webp",
    w: 1600,
    h: 1300,
    alt: "Mujer de perfil con el cabello rubio en degradé",
    items: [
      "Balayage y babylights",
      "Mechas y reflejos",
      "Decoloración y matización",
      "Color de raíz a puntas",
    ],
    msg: "Hola Únicas, quiero consultar por color y rubios.",
  },
  {
    n: "02",
    tit: "Peluquería",
    img: "lavado-masaje-1200x1200.webp",
    w: 1200,
    h: 1200,
    alt: "Lavado de cabello con masaje en la bacha del salón",
    items: [
      "Corte y brushing",
      "Lavado con masaje",
      "Peinados para eventos",
      "Recogidos y ondas",
    ],
    msg: "Hola Únicas, quiero consultar por corte y peinado.",
  },
  {
    n: "03",
    tit: "Tratamientos sin formol",
    img: "tratamiento-serum-1600x1300.webp",
    w: 1600,
    h: 1300,
    alt: "Aplicación de sérum capilar con gotero",
    items: [
      "Alisado sin formol",
      "Reconstrucción de fibra",
      "Nutrición profunda",
      "Sérum y cierre de cutícula",
    ],
    msg: "Hola Únicas, quiero consultar por los tratamientos sin formol.",
  },
  {
    n: "04",
    tit: "Manicura completa",
    img: "manicura-1200x1200.webp",
    w: 1200,
    h: 1200,
    alt: "Manicura aplicando esmalte sobre la mano de una clienta",
    items: [
      "Esmaltado tradicional",
      "Semipermanente",
      "Kapping y esculpidas",
      "Retiro y reparación",
    ],
    msg: "Hola Únicas, quiero consultar por manicura.",
  },
  {
    n: "05",
    tit: "Belleza de pies",
    img: "pies-1200x1200.webp",
    w: 1200,
    h: 1200,
    alt: "Sesión de pedicura en el salón",
    items: [
      "Pedicura completa",
      "Trabajo de talones",
      "Callosidades y durezas",
      "Esmaltado y semipermanente",
    ],
    msg: "Hola Únicas, quiero consultar por belleza de pies.",
  },
  {
    n: "06",
    tit: "Depilación",
    img: "depilacion-1200x1200.webp",
    w: 1200,
    h: 1200,
    alt: "Depilación con cera tibia en la pierna",
    items: [
      "Piernas y axilas",
      "Cavado y bikini",
      "Rostro y cejas",
      "Brazos y espalda",
    ],
    msg: "Hola Únicas, quiero consultar por depilación.",
  },
];

function calcularRubio(base, destino, pelo) {
  const salto = destino - base;
  const r = { base, destino, salto, pelo };

  if (salto <= 0) {
    r.serv = "Matización y nutrición";
    r.sesiones = 1;
    r.horas = "1 h 30 a 2 h";
    r.incluye = [
      "Lavado y diagnóstico del largo",
      "Matiz para corregir el reflejo",
      "Nutrición profunda y brushing",
    ];
  } else if (salto === 1) {
    r.serv = "Balayage suave";
    r.sesiones = 1;
    r.horas = "2 h 30 a 3 h";
    r.incluye = [
      "Barrido a mano alzada en medios y puntas",
      "Matiz al tono elegido",
      "Nutrición profunda y brushing",
    ];
  } else if (salto === 2) {
    r.serv = "Balayage con matización";
    r.sesiones = 1;
    r.horas = "3 h a 3 h 30";
    r.incluye = [
      "Barrido a mano alzada en dos alturas de aclarado",
      "Matiz frío o cálido según lo que elijas",
      "Nutrición profunda y brushing",
    ];
  } else if (salto === 3) {
    r.serv = "Babylights con baño de color";
    r.sesiones = 1;
    r.horas = "3 h 30 a 4 h";
    r.incluye = [
      "Mechas finas trabajadas desde la raíz",
      "Baño de color para unificar el largo",
      "Reconstrucción y brushing",
    ];
  } else if (destino === 7) {
    r.serv = "Iluminación progresiva en dos pasadas";
    r.sesiones = 2;
    r.horas = "3 h por sesión";
    r.incluye = [
      "Mechas anchas en la primera pasada, finas en la segunda",
      "Baño de color entre pasadas para no dejar fondo naranja",
      "Matiz final y nutrición profunda",
    ];
  } else if (salto <= 5) {
    r.serv = "Decoloración global con matización";
    r.sesiones = 2;
    r.horas = "3 h 30 a 4 h por sesión";
    r.incluye = [
      "Prueba de mecha antes de tocar el largo",
      "Aclarado por etapas para no castigar la fibra",
      "Matiz final y reconstrucción incluida",
    ];
  } else {
    r.serv = "Decoloración progresiva en tres etapas";
    r.sesiones = 3;
    r.horas = "3 h 30 a 4 h por sesión";
    r.incluye = [
      "Prueba de mecha antes de tocar el largo",
      "Aclarado repartido en etapas con descanso entre sesiones",
      "Matiz final y reconstrucción incluida",
    ];
  }

  if (salto > 0 && pelo === "tintura") {
    r.incluye.unshift("Decapado suave para sacar el color depositado");
    if (salto >= 3) r.sesiones += 1;
  }
  if (pelo === "decolorado") {
    r.incluye.unshift("Test de porosidad sobre el largo ya decolorado");
  }

  let notaBase;
  if (salto <= 0) {
    notaBase =
      "Ya estás en esa altura o más clara: lo tuyo no es aclarar, es refrescar el tono y devolverle cuerpo al pelo.";
  } else if (salto <= 2) {
    notaBase = `Son ${salto === 1 ? "una altura" : "dos alturas"} de diferencia: entra en una sola visita y te queda un crecimiento suave, sin línea marcada.`;
  } else if (salto === 3) {
    notaBase =
      "Tres alturas se pueden en una visita si el pelo está sano. Lo confirmamos con una prueba de mecha antes de arrancar.";
  } else {
    notaBase = `Son ${salto} alturas de diferencia: no se hacen en un día sin romper el pelo. Lo dividimos en ${r.sesiones} sesiones separadas y llegás al tono con el pelo entero.`;
  }
  r.nota = [notaBase, NOTAS_PELO[pelo]].filter(Boolean).join(" ");

  r.porque =
    salto <= 0
      ? `Elegido por: salís de altura ${base} y apuntás a ${destino}, así que no hay aclarado de por medio.`
      : `Elegido por: salís de altura ${base} y querés llegar a ${destino} — ${salto === 1 ? "una altura" : salto + " alturas"} de diferencia.`;

  r.suma = [
    "Corte y brushing",
    salto >= 3 || pelo !== "virgen"
      ? "Reconstrucción sin formol"
      : "Alisado sin formol",
    "Manicura en el mismo turno",
  ];

  const peloTxt = (PELOS.find((p) => p.id === pelo)?.txt || "").toLowerCase();
  r.msg = `Hola Únicas, salgo de altura ${base} (${TONOS[base]?.n || ""}) y quiero llegar a ${destino} (${TONOS[destino]?.n || ""}). Mi pelo hoy: ${peloTxt}. Me interesa: ${r.serv}. ¿Cuándo tienen turno?`;

  return r;
}

if (
  typeof globalThis !== "undefined" &&
  globalThis.module &&
  globalThis.module.exports
) {
  globalThis.module.exports = {
    TONOS,
    BASES,
    DESTINOS,
    PELOS,
    SERVICIOS,
    calcularRubio,
    tintaDe,
  };
}

/* ---------- helpers de UI ---------- */

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
  toast.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg><span>${esc(msg)}</span>`;
  wrap.appendChild(toast);
  setTimeout(() => {
    toast.classList.add("hiding");
    setTimeout(() => toast.remove(), 220);
  }, 3200);
}

function initWspLinks() {
  document.querySelectorAll("[data-wsp-msg]").forEach((a) => {
    a.href = `https://wa.me/${WSP}?text=${encodeURIComponent(a.dataset.wspMsg)}`;
  });
}

/* ---------- la escala de altura de tono ---------- */

function chipTono(n) {
  const t = TONOS[n];
  if (!t) return "";
  return `<li class="tono-chip ${tintaDe(n)}" style="background:${t.hex}" title="Altura ${n} · ${esc(t.n)}">${n}</li>`;
}

function initEscalas() {
  const orden = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const html = orden.map(chipTono).join("");
  const hero = document.getElementById("escalaHero");
  const cruce = document.getElementById("escalaCruce");
  const pie = document.getElementById("escalaPie");
  if (hero) hero.innerHTML = html;
  if (cruce) cruce.innerHTML = html;
  if (pie)
    pie.innerHTML = orden
      .map((n) => `<li style="background:${TONOS[n].hex}"></li>`)
      .join("");

  const chips = document.querySelectorAll(".tono-chip");
  if (!chips.length) return;
  if (!("IntersectionObserver" in window) || reduceMotion) {
    chips.forEach((c) => c.classList.add("esc-on"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const lista = entry.target;
        [...lista.children].forEach((chip, i) => {
          setTimeout(() => chip.classList.add("esc-on"), i * 55);
        });
        io.unobserve(lista);
      });
    },
    { threshold: 0, rootMargin: "0px 0px -5% 0px" },
  );
  [hero, cruce].forEach((l) => l && io.observe(l));
  setTimeout(() => chips.forEach((c) => c.classList.add("esc-on")), 4000);
}

/* ---------- bloque interactivo: encontrá tu rubio ---------- */

const estadoTono = { base: 5, destino: 8, pelo: "virgen" };

function chipsHtml(lista, tipo, activo) {
  return lista
    .map((op) => {
      if (tipo === "pelo") {
        return `<button type="button" class="chip chip-plano${op.id === activo ? " on-plano" : ""}" data-tipo="pelo" data-valor="${op.id}" aria-pressed="${op.id === activo}"><span class="chip-txt">${esc(op.txt)}</span></button>`;
      }
      const t = TONOS[op.alt];
      return `<button type="button" class="chip${op.alt === activo ? " on" : ""}" data-tipo="${tipo}" data-valor="${op.alt}" aria-pressed="${op.alt === activo}">
      <span class="chip-sw ${tintaDe(op.alt)}" style="background:${t.hex}" aria-hidden="true">${op.alt}</span>
      <span class="chip-txt">${esc(op.txt)}<span class="chip-alt">Altura ${op.alt}</span></span>
    </button>`;
    })
    .join("");
}

function pintarTono() {
  const r = calcularRubio(estadoTono.base, estadoTono.destino, estadoTono.pelo);

  const swBase = document.getElementById("swBase");
  const swDest = document.getElementById("swDest");
  if (swBase) {
    swBase.style.background = TONOS[r.base].hex;
    swBase.className = `tono-swatch ${tintaDe(r.base)}`;
    document.getElementById("swBaseN").textContent = r.base;
  }
  if (swDest) {
    swDest.style.background = TONOS[r.destino].hex;
    swDest.className = `tono-swatch tono-swatch-g ${tintaDe(r.destino)}`;
    document.getElementById("swDestN").textContent = r.destino;
  }

  const saltoTxt = document.getElementById("saltoTxt");
  if (saltoTxt)
    saltoTxt.textContent =
      r.salto < 0
        ? "Ya sos más clara"
        : r.salto === 0
          ? "Mismo tono"
          : r.salto === 1
            ? "1 altura"
            : r.salto + " alturas";

  const nombre = document.getElementById("servNombre");
  if (nombre) nombre.textContent = r.serv;
  const porque = document.getElementById("servPorque");
  if (porque) porque.textContent = r.porque;

  const meta = document.getElementById("servMeta");
  if (meta) {
    meta.innerHTML = [
      `${r.sesiones} ${r.sesiones === 1 ? "sesión" : "sesiones"}`,
      r.horas,
      "Nutrición incluida",
    ]
      .map((m) => `<li>${esc(m)}</li>`)
      .join("");
  }

  const incluye = document.getElementById("servIncluye");
  if (incluye)
    incluye.innerHTML = r.incluye.map((i) => `<li>${esc(i)}</li>`).join("");

  const nota = document.getElementById("servNota");
  if (nota) nota.textContent = r.nota;

  const suma = document.getElementById("servSuma");
  if (suma) suma.innerHTML = r.suma.map((s) => `<li>${esc(s)}</li>`).join("");

  const cta = document.getElementById("tonoCta");
  if (cta) {
    cta.href = `https://wa.me/${WSP}?text=${encodeURIComponent(r.msg)}`;
    cta.textContent = "Pedir este turno";
  }
}

function initTono() {
  const cBase = document.getElementById("chipsBase");
  const cDest = document.getElementById("chipsDestino");
  const cPelo = document.getElementById("chipsPelo");
  if (!cBase || !cDest || !cPelo) return;

  const render = () => {
    cBase.innerHTML = chipsHtml(BASES, "base", estadoTono.base);
    cDest.innerHTML = chipsHtml(DESTINOS, "destino", estadoTono.destino);
    cPelo.innerHTML = chipsHtml(PELOS, "pelo", estadoTono.pelo);
  };
  render();
  pintarTono();

  document.querySelector(".tono-panel")?.addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    const tipo = chip.dataset.tipo;
    const valor = chip.dataset.valor;
    if (tipo === "pelo") estadoTono.pelo = valor;
    else if (tipo === "base") estadoTono.base = Number(valor);
    else if (tipo === "destino") estadoTono.destino = Number(valor);
    else return;
    render();
    pintarTono();
  });
}

/* ---------- rail de servicios ---------- */

function initServicios() {
  const rail = document.getElementById("railServicios");
  if (!rail) return;
  rail.setAttribute("data-animate-stagger", "");
  rail.innerHTML = SERVICIOS.map(
    (s) => `
    <article class="rail-card" data-animate="sube" style="transform:translateY(26px);opacity:0">
      <div class="rail-media"><img src="images/${s.img}" width="${s.w}" height="${s.h}" alt="${esc(s.alt)}" decoding="async"></div>
      <div class="rail-body">
        <span class="rail-num">${s.n}</span>
        <h3 class="rail-tit">${esc(s.tit)}</h3>
        <ul class="rail-items">${s.items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>
        <a class="rail-cta" href="https://wa.me/${WSP}" data-wsp-msg="${esc(s.msg)}" target="_blank" rel="noopener">Consultar por WhatsApp
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
        </a>
      </div>
    </article>`,
  ).join("");
}

function initRail() {
  const rail = document.getElementById("railServicios");
  const prev = document.getElementById("railPrev");
  const next = document.getElementById("railNext");
  if (!rail) return;

  const inicio = () =>
    parseFloat(window.getComputedStyle(rail).paddingInlineStart) || 0;
  const sync = () => {
    if (!prev || !next) return;
    prev.disabled = rail.scrollLeft <= inicio() + 2;
    next.disabled = rail.scrollLeft >= rail.scrollWidth - rail.clientWidth - 2;
  };
  const paso = () =>
    (rail.querySelector(".rail-card")?.getBoundingClientRect().width || 280) +
    16;
  prev?.addEventListener("click", () =>
    rail.scrollBy({
      left: -paso(),
      behavior: reduceMotion ? "auto" : "smooth",
    }),
  );
  next?.addEventListener("click", () =>
    rail.scrollBy({ left: paso(), behavior: reduceMotion ? "auto" : "smooth" }),
  );
  rail.addEventListener("scroll", sync, { passive: true });
  window.addEventListener("resize", sync, { passive: true });
  sync();

  let down = false,
    moved = false,
    startX = 0,
    startScroll = 0,
    pointerId = null;
  rail.addEventListener("pointerdown", (e) => {
    if (e.pointerType === "touch") return;
    down = true;
    moved = false;
    startX = e.clientX;
    startScroll = rail.scrollLeft;
    pointerId = e.pointerId;
  });
  rail.addEventListener("pointermove", (e) => {
    if (!down) return;
    const dx = e.clientX - startX;
    if (!moved && Math.abs(dx) < 6) return;
    if (!moved) {
      moved = true;
      rail.classList.add("is-drag");
      try {
        rail.setPointerCapture?.(pointerId);
      } catch {
        /* sin capture el drag igual funciona */
      }
    }
    rail.scrollLeft = startScroll - dx;
  });
  const end = () => {
    if (!down) return;
    down = false;
    if (moved) {
      try {
        rail.releasePointerCapture?.(pointerId);
      } catch {
        /* ya liberado */
      }
      rail.classList.remove("is-drag");
      setTimeout(() => {
        moved = false;
      }, 0);
    }
    pointerId = null;
  };
  rail.addEventListener("pointerup", end);
  rail.addEventListener("pointercancel", end);
  rail.addEventListener("pointerleave", end);
  rail.addEventListener(
    "click",
    (e) => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
    true,
  );
}

/* ---------- nav ---------- */

function initNav() {
  const toggle = document.getElementById("menuToggle");
  const nav = document.getElementById("mainNav");
  const closeBtn = document.getElementById("navClose");
  if (!toggle || !nav) return;
  const header = document.querySelector(".masthead");
  let bd = document.querySelector(".nav-backdrop");
  if (!bd) {
    bd = document.createElement("div");
    bd.className = "nav-backdrop";
    (header || document.body).appendChild(bd);
  }
  const desktopMq = window.matchMedia("(min-width: 901px)");
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

/* ---------- reveals ---------- */

function initReveals() {
  const items = document.querySelectorAll("[data-animate]");
  if (!items.length) return;
  document.querySelectorAll("[data-animate-stagger]").forEach((parent) => {
    parent.querySelectorAll("[data-animate]").forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i * 0.12, 0.72)}s`;
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

/* ---------- texto que se lee con el scroll ---------- */

function initLeeScroll() {
  const els = document.querySelectorAll("[data-lee]");
  if (!els.length) return;
  els.forEach((el) => {
    const palabras = el.textContent.trim().split(/\s+/);
    if (palabras.length < 2) return;
    el.textContent = "";
    palabras.forEach((palabra, i) => {
      const s = document.createElement("span");
      s.className = "lee-w";
      s.textContent = palabra;
      el.appendChild(s);
      if (i < palabras.length - 1) el.appendChild(document.createTextNode(" "));
    });
  });
  if (
    typeof gsap === "undefined" ||
    typeof ScrollTrigger === "undefined" ||
    reduceMotion
  ) {
    document.querySelectorAll(".lee-w").forEach((w) => w.classList.add("on"));
    return;
  }
  els.forEach((el) => {
    const ws = el.querySelectorAll(".lee-w");
    if (!ws.length) return;
    ScrollTrigger.create({
      trigger: el,
      start: "top 82%",
      end: "bottom 55%",
      scrub: 0.4,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const hasta = self.progress * ws.length;
        ws.forEach((w, i) => w.classList.toggle("on", i < hasta));
      },
    });
  });
}

/* ---------- parallax suave del hero y del wordmark ---------- */

function initParallax() {
  if (
    reduceMotion ||
    typeof gsap === "undefined" ||
    typeof ScrollTrigger === "undefined"
  )
    return;
  if (!window.matchMedia("(min-width: 901px)").matches) return;
  const wm = document.querySelector(".hero-wm");
  if (wm)
    gsap.to(wm, {
      yPercent: 34,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: 0.6,
      },
    });
  const foto = document.querySelector(".hero-media > img");
  if (foto)
    gsap.to(foto, {
      yPercent: -5,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: 0.6,
      },
    });
  const fwm = document.querySelector(".formol-wm");
  if (fwm)
    gsap.fromTo(
      fwm,
      { xPercent: -54 },
      {
        xPercent: -46,
        ease: "none",
        scrollTrigger: {
          trigger: ".formol",
          start: "top bottom",
          end: "bottom top",
          scrub: 0.8,
        },
      },
    );
}

/* ---------- contadores ---------- */

function initContadores() {
  const nums = document.querySelectorAll("[data-cuenta]");
  if (!nums.length) return;
  if (!("IntersectionObserver" in window) || reduceMotion) return;
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const fin = Number(el.dataset.cuenta) || 0;
        const dur = 900;
        const t0 = window.performance.now();
        const paso = (t) => {
          const p = Math.min((t - t0) / dur, 1);
          el.textContent = String(Math.round(fin * (1 - Math.pow(1 - p, 3))));
          if (p < 1) requestAnimationFrame(paso);
        };
        requestAnimationFrame(paso);
        io.unobserve(el);
      });
    },
    { threshold: 0.4 },
  );
  nums.forEach((n) => io.observe(n));
}

/* ---------- mapa ---------- */

function initMapa() {
  const cont = document.getElementById("mapa");
  if (!cont || typeof L === "undefined") return;
  const centro = [-34.3486, -58.7936];
  const mapa = L.map(cont, {
    scrollWheelZoom: false,
    attributionControl: true,
  }).setView(centro, 13);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap",
    maxZoom: 19,
  }).addTo(mapa);
  L.circleMarker(centro, {
    radius: 10,
    color: "#1C1B17",
    weight: 2,
    fillColor: "#D9BD43",
    fillOpacity: 1,
  })
    .addTo(mapa)
    .bindPopup("Únicas · Escobar");
  L.circle(centro, {
    radius: 2600,
    color: "#D9BD43",
    weight: 1,
    fillColor: "#D9BD43",
    fillOpacity: 0.08,
  }).addTo(mapa);
}

/* ---------- flotantes ---------- */

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

const GKY_SLUG_ACENTOS = {
  á: "a",
  é: "e",
  í: "i",
  ó: "o",
  ú: "u",
  ñ: "n",
  ü: "u",
};
function gkySlugify(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/[áéíóúñü]/g, (c) => GKY_SLUG_ACENTOS[c] || c)
    .replace(/[^a-z0-9]/g, "");
}

function initFeedbackFloat() {
  const GKY_FEEDBACK_WHATSAPP = "5491125068578";
  const btn = document.getElementById("feedback-float");
  const backdrop = document.getElementById("feedback-modal-backdrop");
  const closeBtn = document.getElementById("feedback-modal-close");
  const coloresEl = document.getElementById("feedback-colores");
  const contenidoEl = document.getElementById("feedback-contenido");
  const otrosEl = document.getElementById("feedback-otros");
  const submitBtn = document.getElementById("feedback-submit");
  if (!btn || !backdrop) return;

  const open = () => {
    backdrop.hidden = false;
    window.lenis?.stop();
    document.body.classList.add("no-scroll");
    coloresEl?.focus();
  };
  const close = () => {
    backdrop.hidden = true;
    window.lenis?.start();
    document.body.classList.remove("no-scroll");
    btn.focus();
  };
  btn.addEventListener("click", open);
  closeBtn.addEventListener("click", close);
  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) close();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !backdrop.hidden) close();
  });

  submitBtn.addEventListener("click", () => {
    const colores = coloresEl.value.trim();
    const contenido = contenidoEl.value.trim();
    const otros = otrosEl.value.trim();
    if (!colores && !contenido && !otros) {
      coloresEl.focus();
      return;
    }

    const slugUrl =
      (location.pathname.match(/\/demo\/([^/]+)/) || [])[1] || document.title;
    const slug = gkySlugify(slugUrl);
    const negocio = (
      document.title.split(/\s[—|]\s|\s-\s/)[0] ||
      document.title ||
      ""
    ).trim();
    const lineas = [
      `Devolución de la demo${negocio ? " — " + negocio : ""}`,
      colores ? `Colores: ${colores}` : null,
      contenido ? `Contenido: ${contenido}` : null,
      otros ? `Otros: ${otros}` : null,
      location.href,
    ].filter(Boolean);

    window.open(
      `https://wa.me/${GKY_FEEDBACK_WHATSAPP}?text=${encodeURIComponent(lineas.join("\n"))}`,
      "_blank",
      "noopener",
    );
    window
      .__gkySendResena?.({
        slug,
        negocio,
        colores,
        contenido,
        otros,
        url: location.href,
      })
      ?.catch((err) =>
        console.warn("No se pudo guardar la devolución en Firestore:", err),
      );

    if (typeof showToast === "function")
      showToast("¡Gracias por tu devolución!");
    else window.alert("¡Gracias por tu devolución!");
    close();
    coloresEl.value = "";
    contenidoEl.value = "";
    otrosEl.value = "";
  });
}

/* ---------- arranque ---------- */

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

if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}
if (typeof gsap === "undefined") {
  document.querySelectorAll("[data-animate]").forEach((el) => {
    el.style.opacity = 1;
    el.style.transform = "none";
    el.style.clipPath = "none";
  });
}

initEscalas();
initTono();
initServicios();
initWspLinks();
initReveals();
initRail();
initNav();
initLeeScroll();
initParallax();
initContadores();
initMapa();
initWspFloat();
initFeedbackFloat();

const anio = document.getElementById("anio");
if (anio) anio.textContent = new Date().getFullYear();

if (typeof ScrollTrigger !== "undefined") {
  window.addEventListener("load", () => ScrollTrigger.refresh());
}
