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
  const close = () => {
    nav.classList.remove("open");
    bd.classList.remove("open");
    nav.setAttribute("inert", "");
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
}

function initWspFloat() {
  const btn = document.getElementById("wsp-float");
  if (!btn) return;
  const sync = () => btn.classList.toggle("visible", window.scrollY > 600);
  window.addEventListener("scroll", sync, { passive: true });
  sync();
}

function initCobertura() {
  const stage = document.getElementById("coberturaStage");
  const rail = document.getElementById("coberturaRail");
  const steps = rail ? Array.from(rail.querySelectorAll(".step")) : [];
  const railFill = document.getElementById("railFill");
  const detail = document.getElementById("stepDetail");
  if (!stage || !rail || !steps.length) return;

  const DESCRIPCIONES = [
    "Accedés a la cartilla completa, de clínica médica a especialidades puntuales.",
    "Estudios y tratamientos de alta complejidad, cubiertos por tu plan.",
    "En los casos que correspondan, con habitación privada.",
    "La tenés en el celular apenas se confirma el alta, sin cargo.",
    "Te acompaño yo, por WhatsApp, en cada trámite.",
  ];

  const setProgress = (progress) => {
    const clamped = Math.max(0, Math.min(1, progress));
    if (railFill) railFill.style.setProperty("--fill", clamped * 100 + "%");
    const litCount = Math.min(
      steps.length,
      Math.floor(clamped * steps.length + 0.0001),
    );
    const activeIndex = litCount === 0 ? 0 : litCount - 1;
    steps.forEach((step, i) => step.classList.toggle("is-on", i < litCount));
    if (detail) detail.textContent = DESCRIPCIONES[activeIndex];
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
      end: "+=220%",
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

initNav();
initWspFloat();
initCobertura();
initReveals();

const anio = document.getElementById("anioActual");
if (anio) anio.textContent = new Date().getFullYear();
