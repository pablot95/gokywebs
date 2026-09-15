const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;
const WHATSAPP_NUMBER = "5493765191234";
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
  }, 3600);
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

let revealObserver = null;

function primeStagger(parent) {
  Array.from(parent.children).forEach((el, i) => {
    if (!el.hasAttribute("data-animate") || el.dataset.animatePrimed) return;
    el.style.transitionDelay = Math.min(i * 0.09, 0.63) + "s";
    el.dataset.animatePrimed = "1";
  });
}

function initReveals() {
  document.querySelectorAll("[data-animate-stagger]").forEach(primeStagger);
  const items = document.querySelectorAll("[data-animate]");
  if (!items.length) return;
  if (reduceMotion || !("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("in"));
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
  const desktopMq = window.matchMedia("(min-width: 861px)");
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
  const btn = document.getElementById("wspFloat");
  if (!btn) return;
  const sync = () => btn.classList.toggle("visible", window.scrollY > 600);
  window.addEventListener("scroll", sync, { passive: true });
  sync();
}

function initHeroPanal() {
  const panal = document.getElementById("heroPanal");
  if (!panal) return;
  const cells = panal.querySelectorAll(".panal-cell");
  if (reduceMotion) {
    cells.forEach((c) => c.classList.add("is-lit"));
    return;
  }
  cells.forEach((cell, i) => {
    setTimeout(() => cell.classList.add("is-lit"), 700 + i * 190);
  });
}

function initMedallones() {
  const medals = document.querySelectorAll("[data-medal]");
  if (!medals.length) return;
  if (reduceMotion || !("IntersectionObserver" in window)) {
    medals.forEach((m) => m.classList.add("is-lit"));
    return;
  }
  const groups = new Map();
  medals.forEach((medal) => {
    const section = medal.closest("section");
    if (!groups.has(section)) groups.set(section, []);
    groups.get(section).push(medal);
  });
  groups.forEach((list, section) => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          list.forEach((medal, i) =>
            setTimeout(() => medal.classList.add("is-lit"), 200 + i * 160),
          );
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.15 },
    );
    io.observe(section);
  });
}

function initHotmart() {
  document.querySelectorAll(".js-hotmart").forEach((btn) => {
    btn.addEventListener("click", () => {
      const curso = btn.dataset.curso || "el curso";
      showToast(
        `El link de compra de ${curso} en Hotmart se activa al pasar la web a producción.`,
      );
    });
  });
}

function initVideos() {
  document.querySelectorAll(".js-video").forEach((card) => {
    card.addEventListener("click", () => {
      showToast(
        "Los videos de muestra se cargan al pasar la web a producción.",
      );
    });
  });
}

function initFaq() {
  const items = document.querySelectorAll(".faq-item");
  items.forEach((item) => {
    item.addEventListener("toggle", () => {
      if (!item.open) return;
      items.forEach((other) => {
        if (other !== item) other.open = false;
      });
    });
  });
}

function injectJsonLd() {
  const cursos = [
    "Cerrajería",
    "Reparación de cocinas",
    "Plomería",
    "Aire acondicionado",
    "Inteligencia artificial",
    "Marketing",
  ];
  const graph = [
    {
      "@type": "Organization",
      "@id": "https://gokywebs.com/#negocio",
      name: "Destreza Digital y Oficios",
      description:
        "Cursos online de oficios: cerrajería, reparación de cocinas, plomería, aire acondicionado, inteligencia artificial y marketing.",
      url: "https://gokywebs.com/",
      telephone: "+" + WHATSAPP_NUMBER,
    },
    ...cursos.map((nombre) => ({
      "@type": "Course",
      name: `Curso de ${nombre}`,
      description: `Curso online de ${nombre} dictado por Destreza Digital y Oficios.`,
      provider: { "@type": "Organization", name: "Destreza Digital y Oficios" },
    })),
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "¿Necesito saber algo del oficio para arrancar?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No, los cursos arrancan desde cero explicando cada paso.",
          },
        },
        {
          "@type": "Question",
          name: "¿Cómo se compra y cómo accedo al curso?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "La compra se hace por Hotmart y el acceso llega apenas se acredita el pago.",
          },
        },
        {
          "@type": "Question",
          name: "¿Puedo hacer consultas mientras curso?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Sí, las consultas se responden por WhatsApp.",
          },
        },
      ],
    },
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

initReveals();
initNav();
initWspFloat();
initHeroPanal();
initMedallones();
initHotmart();
initVideos();
initFaq();
injectJsonLd();
