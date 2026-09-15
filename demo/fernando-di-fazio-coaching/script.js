const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;
const WHATSAPP_NUMBER = "5491169053310";

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

const RADAR_EJES = [
  "Comunicación",
  "Delegación",
  "Decisiones",
  "Equipos",
  "Conflictos",
  "Estrategia",
];
const RADAR_VALORES = [0.82, 0.58, 0.74, 0.9, 0.52, 0.68];

function radarPunto(cx, cy, radio, indice, total, escala) {
  const ang = (Math.PI * 2 * indice) / total - Math.PI / 2;
  return [
    cx + radio * escala * Math.cos(ang),
    cy + radio * escala * Math.sin(ang),
  ];
}

function initRadar() {
  const svg = document.getElementById("radarSvg");
  if (!svg) return;
  const cx = 160;
  const cy = 160;
  const radio = 105;
  const total = RADAR_EJES.length;
  const NS = "http://www.w3.org/2000/svg";

  const web = document.getElementById("radarWeb");
  [0.25, 0.5, 0.75, 1].forEach((escala) => {
    const pts = RADAR_EJES.map((_, i) =>
      radarPunto(cx, cy, radio, i, total, escala)
        .map((n) => n.toFixed(1))
        .join(","),
    );
    const poly = document.createElementNS(NS, "polygon");
    poly.setAttribute("class", "radar-web");
    poly.setAttribute("points", pts.join(" "));
    web.appendChild(poly);
  });

  const axes = document.getElementById("radarAxes");
  const labels = document.getElementById("radarLabels");
  RADAR_EJES.forEach((nombre, i) => {
    const [x, y] = radarPunto(cx, cy, radio, i, total, 1);
    const line = document.createElementNS(NS, "line");
    line.setAttribute("class", "radar-axis");
    line.setAttribute("x1", cx);
    line.setAttribute("y1", cy);
    line.setAttribute("x2", x.toFixed(1));
    line.setAttribute("y2", y.toFixed(1));
    axes.appendChild(line);

    const [lx, ly] = radarPunto(cx, cy, radio + 28, i, total, 1);
    const text = document.createElementNS(NS, "text");
    text.setAttribute("class", "radar-label");
    text.setAttribute("x", lx.toFixed(1));
    text.setAttribute("y", ly.toFixed(1));
    text.setAttribute(
      "text-anchor",
      lx > cx + 6 ? "start" : lx < cx - 6 ? "end" : "middle",
    );
    text.setAttribute("dominant-baseline", "middle");
    text.textContent = nombre;
    labels.appendChild(text);
  });

  const shape = document.getElementById("radarShape");
  const dots = document.getElementById("radarDots");
  const puntosFinales = RADAR_VALORES.map((v, i) =>
    radarPunto(cx, cy, radio, i, total, v),
  );
  const puntosCentro = RADAR_EJES.map(() => [cx, cy]);
  const aPoints = (arr) =>
    arr.map((p) => p.map((n) => n.toFixed(1)).join(",")).join(" ");

  puntosFinales.forEach(() => {
    const c = document.createElementNS(NS, "circle");
    c.setAttribute("class", "radar-dot");
    c.setAttribute("r", "4");
    c.setAttribute("cx", cx);
    c.setAttribute("cy", cy);
    dots.appendChild(c);
  });
  const dotEls = Array.from(dots.children);

  const pintar = (t) => {
    const interp = puntosFinales.map((p, i) => [
      puntosCentro[i][0] + (p[0] - puntosCentro[i][0]) * t,
      puntosCentro[i][1] + (p[1] - puntosCentro[i][1]) * t,
    ]);
    shape.setAttribute("points", aPoints(interp));
    interp.forEach((p, i) => {
      dotEls[i].setAttribute("cx", p[0].toFixed(1));
      dotEls[i].setAttribute("cy", p[1].toFixed(1));
    });
  };

  const ejes = document.querySelectorAll("[data-eje]");
  const encenderEjes = (instant) => {
    ejes.forEach((eje, i) => {
      if (instant) {
        eje.classList.add("is-on");
        return;
      }
      setTimeout(() => eje.classList.add("is-on"), 300 + i * 180);
    });
  };

  if (reduceMotion) {
    pintar(1);
    encenderEjes(true);
    return;
  }
  pintar(0);

  const run = () => {
    encenderEjes(false);
    if (typeof gsap !== "undefined") {
      const obj = { t: 0 };
      gsap.to(obj, {
        t: 1,
        duration: 1.5,
        ease: "power3.out",
        onUpdate: () => pintar(obj.t),
      });
    } else {
      pintar(1);
    }
  };

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            run();
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.35 },
    );
    io.observe(svg);
  } else {
    run();
  }
}

function initSesiones() {
  const wrap = document.getElementById("sesiones");
  if (!wrap) return;
  const sesiones = wrap.querySelectorAll("[data-sesion]");
  const run = () => {
    sesiones.forEach((s, i) => {
      if (reduceMotion) {
        s.classList.add("is-on");
        return;
      }
      setTimeout(() => s.classList.add("is-on"), 200 + i * 130);
    });
  };
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            run();
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 },
    );
    io.observe(wrap);
  } else {
    run();
  }
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
  const graph = [
    {
      "@type": "ProfessionalService",
      "@id": "https://gokywebs.com/#negocio",
      name: "Fernando Di Fazio — Coach Profesional",
      description:
        "Coaching laboral y liderazgo: cursos online en campus virtual, procesos de coaching ejecutivo en 10 sesiones con test de liderazgo y gestión, y capacitaciones incompany.",
      url: "https://gokywebs.com/",
      telephone: "+" + WHATSAPP_NUMBER,
      areaServed: ["Argentina", "México"],
    },
    {
      "@type": "Person",
      name: "Fernando Di Fazio",
      jobTitle: "Coach laboral y experto en liderazgo",
      worksFor: {
        "@type": "Organization",
        name: "Fernando Di Fazio — Coach Profesional",
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "¿Las sesiones son presenciales u online?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Ambas modalidades están disponibles; el proceso uno a uno puede hacerse completamente online.",
          },
        },
        {
          "@type": "Question",
          name: "¿Qué es el coaching ontológico?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Un enfoque que trabaja sobre cómo se observan las situaciones, no solo sobre las acciones.",
          },
        },
        {
          "@type": "Question",
          name: "¿El test de liderazgo tiene costo aparte?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No, viene incluido en el proceso de coaching ejecutivo de 10 sesiones.",
          },
        },
        {
          "@type": "Question",
          name: "¿Trabajás con empresas de México?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Sí, hay presencia en Argentina y en México.",
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
initRadar();
initSesiones();
initFaq();
injectJsonLd();
