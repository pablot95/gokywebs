const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;
const WSP = "5491137633546";

const esc = (s) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const CLASES = [
  {
    id: "iniciacion",
    n: "01",
    nombre: "Boxeo desde cero",
    desc: "Guardia, desplazamiento y los primeros golpes. Sin contacto y sin apuro: es la clase para el que nunca entrenó.",
    meta: ["Grupal", "60 min", "Sin experiencia"],
    incluye: [
      "Guardia, desplazamiento y los primeros golpes",
      "Bolsa liviana para soltar la mano",
      "Entrada en calor y elongación guiadas",
    ],
    msg: "Hola Chaves Boxing, quiero consultar por la clase de Boxeo desde cero.",
  },
  {
    id: "boxeo",
    n: "02",
    nombre: "Boxeo general",
    desc: "La clase de siempre: técnica, rounds de bolsa y manoplas con el profe. Para el que ya tiene la base.",
    meta: ["Grupal", "60 min", "Con base"],
    incluye: [
      "Técnica corregida uno por uno",
      "Rounds de bolsa de tres minutos",
      "Manoplas con el profe al cierre",
    ],
    msg: "Hola Chaves Boxing, quiero consultar por la clase de Boxeo general.",
  },
  {
    id: "funcional",
    n: "03",
    nombre: "Boxeo funcional",
    desc: "Soga, circuito y bolsa a ritmo alto. Es la clase donde más se transpira y la que mejor va si buscás estado físico.",
    meta: ["Grupal", "60 min", "Todos los niveles"],
    incluye: [
      "Soga y circuito de fuerza con peso corporal",
      "Rounds de bolsa a ritmo alto",
      "Trabajo de core al cierre",
    ],
    msg: "Hola Chaves Boxing, quiero consultar por la clase de Boxeo funcional.",
  },
  {
    id: "sparring",
    n: "04",
    nombre: "Sparring y competición",
    desc: "Guanteo controlado con protección completa y preparación para el que quiere subir al ring.",
    meta: ["Grupal", "90 min", "Con base"],
    incluye: [
      "Guanteo controlado con protección completa",
      "Lectura de distancia y defensa",
      "Preparación específica para competir",
    ],
    msg: "Hola Chaves Boxing, quiero consultar por sparring y competición.",
  },
  {
    id: "personal",
    n: "05",
    nombre: "Clase personalizada",
    desc: "Uno a uno con el profe, a tu ritmo y sobre tu objetivo. Sirve para arrancar con más confianza o para corregir algo puntual.",
    meta: ["Individual", "45 min", "Todos los niveles"],
    incluye: [
      "Uno a uno con el profe",
      "Plan armado sobre tu objetivo",
      "Corrección de técnica en detalle",
    ],
    msg: "Hola Chaves Boxing, quiero consultar por la clase personalizada.",
  },
];

const OBJETIVOS = [
  { id: "bajar", txt: "Bajar de peso", frase: "quiero bajar de peso" },
  {
    id: "aprender",
    txt: "Aprender a boxear",
    frase: "quiero aprender a boxear",
  },
  {
    id: "descargar",
    txt: "Descargar la cabeza",
    frase: "quiero descargar la cabeza",
  },
  { id: "competir", txt: "Competir", frase: "quiero competir" },
];

const NIVELES = [
  { id: "nunca", txt: "Nunca", frase: "nunca entrené" },
  { id: "algo", txt: "Algo hice", frase: "algo hice" },
  { id: "vengo", txt: "Vengo entrenando", frase: "vengo entrenando" },
];

const FRECUENCIAS = [
  { id: "baja", txt: "1 o 2 veces", frase: "una o dos veces por semana" },
  { id: "media", txt: "3 veces", frase: "tres veces por semana" },
  { id: "alta", txt: "Casi todos los días", frase: "casi todos los días" },
];

const MATRIZ = {
  bajar: { nunca: "iniciacion", algo: "funcional", vengo: "funcional" },
  aprender: { nunca: "iniciacion", algo: "boxeo", vengo: "boxeo" },
  descargar: { nunca: "funcional", algo: "funcional", vengo: "boxeo" },
  competir: { nunca: "iniciacion", algo: "boxeo", vengo: "sparring" },
};

const NOTAS_FREC = {
  baja: "Con una o dos veces por semana vas a aprender la técnica, pero el estado físico va a tardar más en aparecer. Es un buen arranque igual.",
  media:
    "Tres veces por semana es el ritmo donde el cambio se empieza a notar de verdad, tanto en la técnica como en el estado.",
  alta: "Si venís casi todos los días conviene alternar boxeo y funcional: el hombro necesita días distintos para no sobrecargarse.",
};

const PORQUE = {
  bajar: {
    nunca:
      "buscás bajar de peso y nunca entrenaste — primero la base, después el ritmo",
    algo: "buscás bajar de peso y ya tenés algo de base — la funcional es la que más quema",
    vengo:
      "buscás bajar de peso y venís entrenando — la funcional te da el volumen que necesitás",
  },
  aprender: {
    nunca:
      "querés aprender a boxear y nunca entrenaste — se arranca por la base",
    algo: "querés aprender a boxear y algo hiciste — ya entrás en la clase general",
    vengo:
      "querés aprender a boxear y venís entrenando — la general es donde más se corrige",
  },
  descargar: {
    nunca:
      "venís a descargar y nunca entrenaste — la funcional deja pegarle desde el primer día",
    algo: "venís a descargar y algo hiciste — la funcional es la que más saca de encima",
    vengo:
      "venís a descargar y ya entrenás — la general te da técnica y descarga a la vez",
  },
  competir: {
    nunca:
      "querés competir pero nunca entrenaste — primero la base, el guanteo llega después",
    algo: "querés competir y algo hiciste — el paso previo al guanteo es la clase general",
    vengo: "querés competir y venís entrenando — ya estás para sparring",
  },
};

function recomendar(objetivo, nivel, frec) {
  const id = MATRIZ[objetivo]?.[nivel] || "iniciacion";
  const clase = CLASES.find((c) => c.id === id) || CLASES[0];
  const r = {
    objetivo,
    nivel,
    frec,
    id,
    nombre: clase.nombre,
    meta: [...clase.meta],
    incluye: [...clase.incluye],
  };

  r.porque = `Elegido por: ${PORQUE[objetivo]?.[nivel] || ""}.`;
  r.nota = NOTAS_FREC[frec] || "";

  const prioridad = [];
  if (nivel === "nunca") prioridad.push("personal");
  if (frec === "alta")
    prioridad.push(id === "funcional" ? "boxeo" : "funcional");
  if (objetivo === "competir" && nivel !== "nunca") prioridad.push("sparring");
  if (objetivo === "bajar") prioridad.push("funcional");
  prioridad.push("personal", "boxeo", "funcional", "iniciacion", "sparring");

  const veto = nivel === "nunca" ? ["sparring"] : [];
  r.suma = [...new Set(prioridad)]
    .filter((x) => x !== id && !veto.includes(x))
    .slice(0, 2)
    .map((x) => CLASES.find((c) => c.id === x).nombre);

  const oFrase = OBJETIVOS.find((o) => o.id === objetivo)?.frase || "";
  const nFrase = NIVELES.find((n) => n.id === nivel)?.frase || "";
  const fFrase = FRECUENCIAS.find((f) => f.id === frec)?.frase || "";
  r.msg = `Hola Chaves Boxing, ${oFrase}, ${nFrase} y puedo ${fFrase}. Me recomendaron la clase de ${r.nombre}. ¿Cómo hago para probar?`;

  return r;
}

if (
  typeof globalThis !== "undefined" &&
  globalThis.module &&
  globalThis.module.exports
) {
  globalThis.module.exports = {
    CLASES,
    OBJETIVOS,
    NIVELES,
    FRECUENCIAS,
    MATRIZ,
    recomendar,
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

/* ---------- round 02: armá tu primer round ---------- */

const estadoRound = { objetivo: "aprender", nivel: "nunca", frec: "baja" };

function chipsHtml(lista, tipo, activo) {
  return lista
    .map(
      (op) =>
        `<button type="button" class="chip${op.id === activo ? " on" : ""}" data-tipo="${tipo}" data-valor="${op.id}" aria-pressed="${op.id === activo}">${esc(op.txt)}</button>`,
    )
    .join("");
}

function pintarRound() {
  const r = recomendar(
    estadoRound.objetivo,
    estadoRound.nivel,
    estadoRound.frec,
  );

  const nombre = document.getElementById("claseNombre");
  if (nombre) nombre.textContent = r.nombre;
  const porque = document.getElementById("clasePorque");
  if (porque) porque.textContent = r.porque;

  const meta = document.getElementById("claseMeta");
  if (meta) meta.innerHTML = r.meta.map((m) => `<li>${esc(m)}</li>`).join("");

  const incluye = document.getElementById("claseIncluye");
  if (incluye)
    incluye.innerHTML = r.incluye.map((i) => `<li>${esc(i)}</li>`).join("");

  const nota = document.getElementById("claseNota");
  if (nota) nota.textContent = r.nota;

  const suma = document.getElementById("claseSuma");
  if (suma) suma.innerHTML = r.suma.map((s) => `<li>${esc(s)}</li>`).join("");

  const cta = document.getElementById("tonoCta");
  if (cta) cta.href = `https://wa.me/${WSP}?text=${encodeURIComponent(r.msg)}`;
}

function initRound() {
  const cObj = document.getElementById("chipsObjetivo");
  const cNiv = document.getElementById("chipsNivel");
  const cFre = document.getElementById("chipsFrec");
  if (!cObj || !cNiv || !cFre) return;

  const render = () => {
    cObj.innerHTML = chipsHtml(OBJETIVOS, "objetivo", estadoRound.objetivo);
    cNiv.innerHTML = chipsHtml(NIVELES, "nivel", estadoRound.nivel);
    cFre.innerHTML = chipsHtml(FRECUENCIAS, "frec", estadoRound.frec);
  };
  render();
  pintarRound();

  document.querySelector(".tono-panel")?.addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    const tipo = chip.dataset.tipo;
    if (!["objetivo", "nivel", "frec"].includes(tipo)) return;
    estadoRound[tipo] = chip.dataset.valor;
    render();
    pintarRound();
  });
}

/* ---------- round 03: grilla de clases ---------- */

function initClases() {
  const grid = document.getElementById("clasesGrid");
  if (!grid) return;
  grid.innerHTML = CLASES.map(
    (c) => `
    <article class="clase-card" data-animate="sube" style="transform:translateY(26px);opacity:0">
      <span class="clase-n">${c.n}</span>
      <h3 class="clase-tit">${esc(c.nombre)}</h3>
      <p class="clase-desc">${esc(c.desc)}</p>
      <ul class="clase-meta">${c.meta.map((m) => `<li>${esc(m)}</li>`).join("")}</ul>
      <a class="clase-cta" href="https://wa.me/${WSP}" data-wsp-msg="${esc(c.msg)}" target="_blank" rel="noopener">Consultar por WhatsApp
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
      </a>
    </article>`,
  ).join("");
}

/* ---------- round 04: la clase (sticky chapters) ---------- */

function initLaClase() {
  const stage = document.getElementById("laclaseStage");
  const visual = document.getElementById("laclaseVisual");
  const lista = document.getElementById("laclasePasos");
  if (!stage || !visual || !lista) return;
  const imgs = [...visual.querySelectorAll("img")];
  const pasos = [...lista.children];
  if (!imgs.length || !pasos.length) return;

  let actual = 0;
  const setPaso = (i) => {
    if (i === actual) return;
    actual = i;
    imgs.forEach((im, k) => im.classList.toggle("is-on", k === i));
    pasos.forEach((p, k) => p.classList.toggle("is-on", k === i));
  };

  let queued = false;
  const update = () => {
    queued = false;
    const r = stage.getBoundingClientRect();
    const recorrido = r.height - window.innerHeight;
    if (recorrido <= 0) return;
    const p = Math.min(Math.max(-r.top / recorrido, 0), 0.9999);
    setPaso(Math.floor(p * pasos.length));
  };
  const queue = () => {
    if (!queued) {
      queued = true;
      requestAnimationFrame(update);
    }
  };
  window.addEventListener("scroll", queue, { passive: true });
  window.addEventListener("resize", queue, { passive: true });
  window.addEventListener("load", queue);
  queue();
}

/* ---------- nav ---------- */

function initNav() {
  const toggle = document.getElementById("menuToggle");
  const nav = document.getElementById("mainNav");
  const closeBtn = document.getElementById("navClose");
  if (!toggle || !nav) return;
  const header = document.querySelector(".barra");
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

/* ---------- el impacto: la entrada de cada round ---------- */

function initImpacto() {
  if (
    reduceMotion ||
    typeof gsap === "undefined" ||
    typeof ScrollTrigger === "undefined"
  )
    return;
  document.querySelectorAll(".round-tag").forEach((tag) => {
    gsap.fromTo(
      tag,
      { scale: 0.92, x: -10 },
      {
        scale: 1,
        x: 0,
        duration: 0.42,
        ease: "back.out(2.4)",
        scrollTrigger: { trigger: tag, start: "top 88%", once: true },
      },
    );
  });
  const wm = document.querySelector(".cierre-wm");
  if (wm) {
    gsap.to(wm, {
      yPercent: -14,
      ease: "none",
      scrollTrigger: {
        trigger: ".cierre",
        start: "top bottom",
        end: "bottom top",
        scrub: 0.7,
      },
    });
  }
  const heroFoto = document.querySelector(".hero-media-a img");
  if (heroFoto && window.matchMedia("(min-width: 901px)").matches) {
    gsap.to(heroFoto, {
      yPercent: -4,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: 0.6,
      },
    });
  }
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
        const dur = 850;
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
  const centro = [-34.6037, -58.3816];
  const mapa = L.map(cont, {
    scrollWheelZoom: false,
    attributionControl: true,
  }).setView(centro, 12);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap",
    maxZoom: 19,
  }).addTo(mapa);
  L.circleMarker(centro, {
    radius: 10,
    color: "#F9FAFB",
    weight: 2,
    fillColor: "#E7131D",
    fillOpacity: 1,
  })
    .addTo(mapa)
    .bindPopup("Chaves Boxing · Buenos Aires");
  L.circle(centro, {
    radius: 4200,
    color: "#E7131D",
    weight: 1,
    fillColor: "#E7131D",
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

initClases();
initRound();
initWspLinks();
initReveals();
initNav();
initLaClase();
initLeeScroll();
initImpacto();
initContadores();
initMapa();
initWspFloat();
initFeedbackFloat();

const anio = document.getElementById("anio");
if (anio) anio.textContent = new Date().getFullYear();

if (typeof ScrollTrigger !== "undefined") {
  window.addEventListener("load", () => ScrollTrigger.refresh());
}
