const WHATSAPP_NUMBER = "5493624814710";

const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

function initWspLinks() {
  document.querySelectorAll("[data-wsp-msg]").forEach((a) => {
    const msg = a.dataset.wspMsg;
    if (!msg) return;
    a.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  });
}

function initNav() {
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("mainNav");
  const closeBtn = document.getElementById("navClose");
  if (!toggle || !nav) return;
  let bd = document.querySelector(".nav-backdrop");
  if (!bd) {
    bd = document.createElement("div");
    bd.className = "nav-backdrop";
    document.body.appendChild(bd);
  }
  const desktopMq = window.matchMedia("(min-width: 641px)");
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
      el.style.transitionDelay = `${Math.min(i * 0.12, 0.72)}s`;
    });
  });
  items.forEach((el) => {
    if (el.dataset.delay) el.style.transitionDelay = `${el.dataset.delay}s`;
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

function initRipple() {
  const layer = document.getElementById("rippleLayer");
  if (!layer || reduceMotion) return;
  const media = layer.parentElement;
  let last = 0;
  const spawn = (x, y) => {
    const now = Date.now();
    if (now - last < 380) return;
    last = now;
    const ring = document.createElement("span");
    ring.className = "ripple-ring";
    ring.style.left = `${x}px`;
    ring.style.top = `${y}px`;
    layer.appendChild(ring);
    ring.addEventListener("animationend", () => ring.remove());
  };
  media.addEventListener("pointermove", (e) => {
    const r = media.getBoundingClientRect();
    spawn(e.clientX - r.left, e.clientY - r.top);
  });
  media.addEventListener("pointerdown", (e) => {
    const r = media.getBoundingClientRect();
    last = 0;
    spawn(e.clientX - r.left, e.clientY - r.top);
  });
}

const RECOMENDACIONES = {
  ceibo: {
    titulo: "Cabaña Ceibo",
    img: "images/cabana-ceibo-exterior-1600x1300.webp",
    msg: "Hola! Quiero reservar la Cabaña Ceibo.",
  },
  timbo: {
    titulo: "Cabaña Timbó",
    img: "images/cabana-timbo-exterior-1600x1300.webp",
    msg: "Hola! Quiero reservar la Cabaña Timbó.",
  },
};

const TEXTOS_RESULTADO = {
  ceibo: {
    descansar:
      "La opción justa para desconectar de a dos, con deck propio frente al verde.",
    pesca:
      "Chica y cómoda, a un paso del agua para salir a pescar cuando quieras.",
    familia: "Ideal si van a ser pocos — todo el lugar para ustedes.",
  },
  timbo: {
    descansar: "Espacio de sobra para bajar un cambio sin sentirse encimados.",
    pesca:
      "Con lugar para guardar los equipos y una galería para limpiar la pesca del día.",
    familia: "Dos ambientes y galería techada — pensada para venir varios.",
  },
};

function initConsultivo() {
  const wrap = document.getElementById("quizWrap");
  const result = document.getElementById("quizResult");
  if (!wrap || !result) return;
  const steps = [...wrap.querySelectorAll(".quiz-step")];
  const respuestas = {};
  let paso = 0;

  function mostrarPaso(i) {
    steps.forEach((s, idx) => s.classList.toggle("is-active", idx === i));
    result.classList.remove("is-active");
  }

  function calcular() {
    const cabana = respuestas.cuantos === "2" ? "ceibo" : "timbo";
    const rec = RECOMENDACIONES[cabana];
    const texto =
      TEXTOS_RESULTADO[cabana][respuestas.perfil] ||
      TEXTOS_RESULTADO[cabana].descansar;
    document.getElementById("quizResultImg").src = rec.img;
    document.getElementById("quizResultTitulo").textContent = rec.titulo;
    document.getElementById("quizResultTexto").textContent = texto;
    const cta = document.getElementById("quizResultCta");
    cta.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(rec.msg)}`;
    steps.forEach((s) => s.classList.remove("is-active"));
    result.classList.add("is-active");
  }

  wrap.querySelectorAll(".chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      const { question, value } = chip.dataset;
      respuestas[question] = value;
      wrap
        .querySelectorAll(`[data-question="${question}"]`)
        .forEach((c) => c.classList.toggle("is-picked", c === chip));
      if (paso < steps.length - 1) {
        paso++;
        mostrarPaso(paso);
      } else {
        calcular();
      }
    });
  });

  document.getElementById("quizRestart")?.addEventListener("click", (e) => {
    e.preventDefault();
    paso = 0;
    delete respuestas.cuantos;
    delete respuestas.perfil;
    wrap
      .querySelectorAll(".chip.is-picked")
      .forEach((c) => c.classList.remove("is-picked"));
    mostrarPaso(0);
  });
}

function initFloatingWsp() {
  const btn = document.getElementById("wspFloat");
  if (!btn) return;
  window.addEventListener(
    "scroll",
    () => {
      btn.classList.toggle("visible", window.scrollY > 600);
    },
    { passive: true },
  );
}

function initMagnetic() {
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  if (typeof gsap === "undefined") return;
  document.querySelectorAll(".magnetic").forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const r = btn.getBoundingClientRect();
      gsap.to(btn, {
        x: (e.clientX - r.left - r.width / 2) * 0.22,
        y: (e.clientY - r.top - r.height / 2) * 0.22,
        duration: 0.3,
      });
    });
    btn.addEventListener("mouseleave", () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.45, ease: "elastic.out(1, .55)" });
    });
  });
}

function initParallax() {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined")
    return;
  if (reduceMotion) return;
  const img = document.querySelector(".entorno-media img");
  if (!img) return;
  gsap.fromTo(
    img,
    { yPercent: -8 },
    {
      yPercent: 8,
      ease: "none",
      scrollTrigger: {
        trigger: img.closest(".entorno"),
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    },
  );
}

function initHeroEntrance() {
  const img = document.querySelector(".hero-media img");
  if (!img || typeof gsap === "undefined" || reduceMotion) return;
  gsap.fromTo(
    img,
    { scale: 1.08 },
    { scale: 1, duration: 1.6, ease: "expo.out" },
  );
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

function initJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: "Recanto del Paraná",
    description:
      "Complejo de cabañas para alquiler temporario junto al río Paraná.",
    telephone: `+${WHATSAPP_NUMBER}`,
    address: {
      "@type": "PostalAddress",
      addressCountry: "AR",
    },
  };
  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
}

document.addEventListener("DOMContentLoaded", () => {
  const anioEl = document.getElementById("anioActual");
  if (anioEl) anioEl.textContent = new Date().getFullYear();

  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
  }
  if (typeof gsap === "undefined") {
    document.querySelectorAll("[data-animate]").forEach((el) => {
      el.style.opacity = 1;
      el.style.transform = "none";
      el.style.filter = "none";
    });
    document.querySelectorAll(".hero-media img").forEach((el) => {
      el.style.transform = "none";
    });
  }

  initNav();
  initWspLinks();
  initReveals();
  initRipple();
  initConsultivo();
  initFloatingWsp();
  initMagnetic();
  initParallax();
  initHeroEntrance();
  initAntiCopia();
  initJsonLd();

  window.addEventListener("load", () => {
    if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
  });
});
