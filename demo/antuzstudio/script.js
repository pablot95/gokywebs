/* global SplitText */
const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;
const WHATSAPP_NUMBER = "5491138482416";

if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}
if (typeof gsap === "undefined") {
  document.querySelectorAll("[data-animate]").forEach((el) => {
    el.style.opacity = 1;
    el.style.transform = "none";
  });
  const heroTitleFallback = document.querySelector(".hero-title");
  if (heroTitleFallback) heroTitleFallback.style.opacity = 1;
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

const esc = (s) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

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
    if (desktopMq.matches) nav.removeAttribute("inert");
    else if (!nav.classList.contains("open")) nav.setAttribute("inert", "");
  };
  desktopMq.addEventListener("change", syncInert);
  syncInert();
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

function initHeroTitle() {
  const el = document.querySelector(".hero-title");
  if (!el) return;
  if (reduceMotion || typeof gsap === "undefined") {
    el.style.opacity = 1;
    return;
  }
  if (typeof SplitText === "undefined") {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: "expo.out",
      delay: 0.2,
    });
    return;
  }
  gsap.registerPlugin(SplitText);
  const split = SplitText.create(el, { type: "lines", mask: "lines" });
  gsap.set(el, { opacity: 1 });
  gsap.from(split.lines, {
    yPercent: 110,
    duration: 1.1,
    stagger: 0.1,
    ease: "expo.out",
    delay: 0.15,
  });
}

function initHeroUnderline() {
  const svg = document.querySelector(".hero-underline");
  if (!svg) return;
  if (reduceMotion) {
    svg.classList.add("in");
    return;
  }
  setTimeout(() => svg.classList.add("in"), 700);
}

function initHeroParallax() {
  if (
    typeof gsap === "undefined" ||
    typeof ScrollTrigger === "undefined" ||
    reduceMotion
  )
    return;
  const wordmark = document.querySelector(".hero-wordmark");
  const hero = document.querySelector(".hero");
  if (!wordmark || !hero) return;
  gsap.to(wordmark, {
    yPercent: 18,
    ease: "none",
    scrollTrigger: {
      trigger: hero,
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
  });
}

function initMagnetic() {
  if (typeof gsap === "undefined" || reduceMotion) return;
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  document.querySelectorAll(".magnetic").forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const r = btn.getBoundingClientRect();
      gsap.to(btn, {
        x: (e.clientX - r.left - r.width / 2) * 0.25,
        y: (e.clientY - r.top - r.height / 2) * 0.25,
        duration: 0.3,
      });
    });
    btn.addEventListener("mouseleave", () =>
      gsap.to(btn, { x: 0, y: 0, duration: 0.45, ease: "elastic.out(1, .55)" }),
    );
  });
}

const SERVICIOS_CONSULTIVO = {
  identidad: {
    folio: "N.º 01",
    nombre: "Identidad de marca",
    mensaje: "una identidad de marca",
  },
  editorial: {
    folio: "N.º 02",
    nombre: "Diseño editorial",
    mensaje: "piezas editoriales",
  },
  packaging: {
    folio: "N.º 03",
    nombre: "Packaging",
    mensaje: "etiquetas o envases",
  },
  digital: {
    folio: "N.º 04",
    nombre: "Piezas digitales",
    mensaje: "contenido digital",
  },
};

function justificacionConsultivo(respuesta1, respuesta2, servicioFinal) {
  const s = SERVICIOS_CONSULTIVO[servicioFinal];
  if (respuesta2 === "nueva" && respuesta1 !== "identidad") {
    const original = SERVICIOS_CONSULTIVO[respuesta1];
    return `Antes de ${original.mensaje}, conviene asentar la identidad de marca: así todo el material futuro parte de un mismo sistema, no de piezas sueltas. Con la identidad resuelta, seguimos con ${original.mensaje}.`;
  }
  if (respuesta2 === "nueva") {
    return "Como tu marca todavía no existe, el punto de partida es construir la identidad completa: eso ordena todo lo que venga después.";
  }
  if (respuesta2 === "logo") {
    return `Ya tenés un logo — sumamos el sistema completo alrededor para que se sostenga en ${s.mensaje === "una identidad de marca" ? "cualquier soporte" : s.mensaje}.`;
  }
  return `Renovamos lo que haga falta de tu identidad actual y lo llevamos a ${s.mensaje}, manteniendo lo que ya funciona.`;
}

function initConsultivo() {
  const stage = document.getElementById("consultivoStage");
  if (!stage) return;
  const steps = stage.querySelectorAll(".consultivo-step, .consultivo-result");
  let respuesta1 = null;
  let respuesta2 = null;

  const irAPaso = (n) => {
    steps.forEach((s) => s.classList.remove("is-active"));
    stage.querySelector(`[data-step="${n}"]`).classList.add("is-active");
  };

  const mostrarResultado = () => {
    let servicioFinal = respuesta1;
    if (respuesta2 === "nueva" && respuesta1 !== "identidad")
      servicioFinal = "identidad";
    const s = SERVICIOS_CONSULTIVO[servicioFinal];
    document.getElementById("fichaFolio").textContent = s.folio;
    document.getElementById("fichaServicio").textContent = s.nombre;
    document.getElementById("fichaJustificacion").textContent =
      justificacionConsultivo(respuesta1, respuesta2, servicioFinal);
    const estadoTexto =
      respuesta2 === "nueva"
        ? "Mi marca todavía no existe."
        : respuesta2 === "logo"
          ? "Ya tengo un logo, pero nada más."
          : "Ya tengo identidad y quiero renovarla.";
    const lineas = [
      `Hola Antuz Studio, quiero consultar por ${SERVICIOS_CONSULTIVO[respuesta1].mensaje}.`,
      "",
      estadoTexto,
    ];
    document.getElementById("fichaCta").href =
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lineas.join("\n"))}`;
    irAPaso(3);
  };

  stage.querySelectorAll('[data-step="1"] .chip').forEach((chip) => {
    chip.addEventListener("click", () => {
      respuesta1 = chip.dataset.value;
      stage
        .querySelectorAll('[data-step="1"] .chip')
        .forEach((c) => c.classList.remove("is-selected"));
      chip.classList.add("is-selected");
      irAPaso(2);
    });
  });

  stage.querySelectorAll('[data-step="2"] .chip').forEach((chip) => {
    chip.addEventListener("click", () => {
      respuesta2 = chip.dataset.value;
      stage
        .querySelectorAll('[data-step="2"] .chip')
        .forEach((c) => c.classList.remove("is-selected"));
      chip.classList.add("is-selected");
      mostrarResultado();
    });
  });

  document.getElementById("fichaReset").addEventListener("click", () => {
    respuesta1 = null;
    respuesta2 = null;
    stage
      .querySelectorAll(".chip")
      .forEach((c) => c.classList.remove("is-selected"));
    irAPaso(1);
  });
}

function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;
  const submitBtn = document.getElementById("contactSubmit");
  const campos = [
    {
      input: document.getElementById("nombre"),
      error: document.getElementById("nombre-error"),
      validar: (v) => v.trim().length > 0,
    },
    {
      input: document.getElementById("email"),
      error: document.getElementById("email-error"),
      validar: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
    },
    {
      input: document.getElementById("mensaje"),
      error: document.getElementById("mensaje-error"),
      validar: (v) => v.trim().length > 0,
    },
  ];

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let valido = true;
    let primerError = null;
    campos.forEach(({ input, error, validar }) => {
      const ok = validar(input.value);
      input.setAttribute("aria-invalid", String(!ok));
      error.hidden = ok;
      if (!ok) {
        valido = false;
        primerError = primerError || input;
      }
    });
    if (!valido) {
      primerError?.focus();
      primerError?.scrollIntoView({ block: "center", behavior: "smooth" });
      return;
    }
    submitBtn.disabled = true;
    submitBtn.textContent = "Enviando…";
    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.textContent = "Enviar mensaje";
      showToast(
        "¡Gracias! El envío de mensajes se activa al pasar la web a producción.",
      );
      form.reset();
    }, 800);
  });
}

initReveals();
initNav();
initWspFloat();
initHeroTitle();
initHeroUnderline();
initHeroParallax();
initMagnetic();
initConsultivo();
initContactForm();
