const WHATSAPP_NUMBER = "5491150953964";

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
      scale: 1,
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

const PASOS_GAUGE = [
  {
    angulo: -50,
    fill: 0.24,
    estado: "Diagnosticando",
    dato: "-18°C detectado",
    color: "var(--color-warn)",
  },
  {
    angulo: -15,
    fill: 0.5,
    estado: "Presupuestando",
    dato: "Falla en compresor",
    color: "var(--color-secondary)",
  },
  {
    angulo: 20,
    fill: 0.76,
    estado: "Reparando",
    dato: "Cargando gas refrigerante",
    color: "var(--color-secondary)",
  },
  {
    angulo: 55,
    fill: 1,
    estado: "Listo",
    dato: "4°C estable",
    color: "var(--color-ok)",
  },
];

function initProceso() {
  const pasos = document.querySelectorAll("#procesoPasos .proceso-paso");
  const needle = document.getElementById("gaugeNeedleProceso");
  const fill = document.getElementById("gaugeFillProceso");
  const estadoEl = document.getElementById("procesoEstado");
  const datoEl = document.getElementById("procesoDato");
  if (!pasos.length || !needle || !fill) return;

  const FILL_LENGTH = 264;
  fill.style.strokeDasharray = String(FILL_LENGTH);

  function setPaso(index) {
    const data = PASOS_GAUGE[index];
    if (!data) return;
    needle.style.transform = `rotate(${data.angulo}deg)`;
    fill.style.strokeDashoffset = String(FILL_LENGTH * (1 - data.fill));
    fill.style.stroke = data.color;
    estadoEl.textContent = data.estado;
    datoEl.textContent = data.dato;
    pasos.forEach((p, i) => p.classList.toggle("is-on", i === index));
  }

  setPaso(0);

  if (typeof IntersectionObserver === "undefined" || reduceMotion) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const index = Number(entry.target.dataset.paso);
        setPaso(index);
      });
    },
    { threshold: 0, rootMargin: "-45% 0px -45% 0px" },
  );
  pasos.forEach((p) => observer.observe(p));
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
    "@type": "LocalBusiness",
    name: "Refrigcar",
    description:
      "Servicio técnico de aire acondicionado, heladeras, freezers, heladeras comerciales, cámaras frigoríficas y lavarropas de todas las marcas.",
    telephone: `+${WHATSAPP_NUMBER}`,
    priceRange: "$$",
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

  initNav();
  initWspLinks();
  initReveals();
  initRevealsStagger();
  initProceso();
  initFloatingWsp();
  initAntiCopia();
  initJsonLd();

  window.addEventListener("load", () => {
    if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
  });
});
