const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

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
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
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

function initHeroEnso() {
  const ring = document.querySelector(".hero-enso-ring");
  if (!ring || reduceMotion) return;
  requestAnimationFrame(() => ring.classList.add("drawn"));
}

function initWspFloat() {
  const btn = document.getElementById("wsp-float");
  if (!btn) return;
  const sync = () => btn.classList.toggle("visible", window.scrollY > 600);
  window.addEventListener("scroll", sync, { passive: true });
  sync();
}

function initCentro() {
  const stage = document.getElementById("centroStage");
  const grupo = document.getElementById("centroPuntos");
  const enso = document.getElementById("centroEnso");
  const nucleo = document.getElementById("centroNucleo");
  const palabra = document.getElementById("centroPalabra");
  const pasos = stage
    ? Array.from(stage.querySelectorAll(".centro-pasos li"))
    : [];
  if (!stage || !grupo || !enso || !pasos.length) return;

  const CANTIDAD = 24;
  const CENTRO = 200;
  const RADIO_ANILLO = 150;
  const GOLDEN = 2.399963229728653;
  const SVG_NS = "http://www.w3.org/2000/svg";

  const puntos = [];
  for (let i = 0; i < CANTIDAD; i++) {
    const anguloDisperso = i * GOLDEN;
    const radioDisperso = 34 + (((i * 37) % 100) / 100) * 152;
    const anguloFinal = (i / CANTIDAD) * Math.PI * 2 - Math.PI / 2;
    const nodo = document.createElementNS(SVG_NS, "circle");
    nodo.setAttribute("class", "centro-punto");
    nodo.setAttribute("r", String(3 + ((i * 13) % 3)));
    grupo.appendChild(nodo);
    puntos.push({
      nodo,
      x0: CENTRO + Math.cos(anguloDisperso) * radioDisperso,
      y0: CENTRO + Math.sin(anguloDisperso) * radioDisperso,
      x1: CENTRO + Math.cos(anguloFinal) * RADIO_ANILLO,
      y1: CENTRO + Math.sin(anguloFinal) * RADIO_ANILLO,
      demora: ((i % 6) / 6) * 0.32,
    });
  }

  const largoEnso = 2 * Math.PI * RADIO_ANILLO;
  enso.style.strokeDasharray = String(largoEnso);
  enso.style.strokeDashoffset = String(largoEnso);

  const suavizar = (t) => 1 - Math.pow(1 - t, 3);

  const setProgress = (progress) => {
    const p = Math.max(0, Math.min(1, progress));

    puntos.forEach((punto) => {
      const rango = 1 - punto.demora;
      const local = suavizar(
        Math.max(0, Math.min(1, (p - punto.demora) / rango)),
      );
      punto.nodo.setAttribute(
        "cx",
        (punto.x0 + (punto.x1 - punto.x0) * local).toFixed(2),
      );
      punto.nodo.setAttribute(
        "cy",
        (punto.y0 + (punto.y1 - punto.y0) * local).toFixed(2),
      );
      punto.nodo.style.opacity = String(0.42 + local * 0.58);
    });

    const trazo = Math.max(0, Math.min(1, (p - 0.12) / 0.8));
    enso.style.strokeDashoffset = String(
      largoEnso - (largoEnso - 120) * suavizar(trazo),
    );

    const brillo = Math.max(0, Math.min(1, (p - 0.82) / 0.18));
    nucleo.style.opacity = String(brillo);
    nucleo.style.transform = `scale(${0.4 + brillo * 0.6})`;

    palabra.classList.toggle("is-on", p >= 0.94);

    const activo = Math.min(
      pasos.length - 1,
      Math.floor(p * pasos.length + 0.0001),
    );
    pasos.forEach((paso, i) => paso.classList.toggle("is-on", i === activo));
  };

  if (
    reduceMotion ||
    typeof gsap === "undefined" ||
    typeof ScrollTrigger === "undefined"
  ) {
    setProgress(1);
    return;
  }

  setProgress(0);

  const mm = gsap.matchMedia();

  mm.add("(min-width: 861px)", () => {
    const st = ScrollTrigger.create({
      trigger: stage,
      start: "top top",
      end: "+=240%",
      pin: true,
      scrub: 0.6,
      onUpdate: (self) => setProgress(self.progress),
    });
    return () => st.kill();
  });

  mm.add("(max-width: 860px)", () => {
    stage.classList.add("is-sticky-mobile");
    requestAnimationFrame(() => ScrollTrigger.refresh());
    const st = ScrollTrigger.create({
      trigger: stage,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.6,
      invalidateOnRefresh: true,
      onUpdate: (self) => setProgress(self.progress),
    });
    return () => {
      stage.classList.remove("is-sticky-mobile");
      st.kill();
    };
  });
}

function initParallax() {
  if (
    reduceMotion ||
    typeof gsap === "undefined" ||
    typeof ScrollTrigger === "undefined"
  )
    return;
  const media = document.querySelector(".editorial-media img");
  if (!media) return;
  gsap.fromTo(
    media,
    { yPercent: -4 },
    {
      yPercent: 4,
      ease: "none",
      scrollTrigger: {
        trigger: media,
        start: "top bottom",
        end: "bottom top",
        scrub: 0.8,
      },
    },
  );
}

function initReveals() {
  const items = document.querySelectorAll("[data-animate]");
  if (!items.length) return;
  document.querySelectorAll("[data-animate-stagger]").forEach((parent) => {
    parent.querySelectorAll("[data-animate]").forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i * 0.1, 0.6)}s`;
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

initHeroEnso();
initWspFloat();
initCentro();
initParallax();
initReveals();

const anio = document.getElementById("anioActual");
if (anio) anio.textContent = new Date().getFullYear();
