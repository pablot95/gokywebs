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
    el.style.filter = "none";
  });
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

function initNav() {
  const toggle = document.getElementById("menuToggle");
  const nav = document.getElementById("mainNavMobile");
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

function segmentProgress(globalProgress, index, total) {
  const start = index / total;
  const end = (index + 1) / total;
  if (globalProgress <= start) return 0;
  if (globalProgress >= end) return 1;
  return (globalProgress - start) / (end - start);
}

function initFirma() {
  const stage = document.getElementById("firmaStage");
  const svg = document.querySelector(".firma-svg");
  if (!stage || !svg) return;

  const lineas = [1, 2, 3, 4, 5].map((n) =>
    document.getElementById(`linea${n}`),
  );
  const puntos = [1, 2, 3, 4, 5].map((n) =>
    document.getElementById(`punto${n}`),
  );
  const labels = [1, 2, 3, 4, 5].map((n) =>
    document.getElementById(`label${n}`),
  );
  const muelleCirculo = document.getElementById("muelleCirculo");
  const muelleTexto = document.getElementById("muelleTexto");
  if (lineas.some((l) => !l)) return;

  const longitudes = lineas.map((l) => l.getTotalLength());
  lineas.forEach((l, i) => {
    l.style.strokeDasharray = String(longitudes[i]);
    l.style.strokeDashoffset = String(longitudes[i]);
  });

  function render(progress) {
    lineas.forEach((linea, i) => {
      const p = segmentProgress(progress, i, lineas.length);
      linea.style.strokeDashoffset = String(longitudes[i] * (1 - p));
      const activo = p >= 1;
      puntos[i].classList.toggle("is-active", activo);
      labels[i].classList.toggle("is-active", activo);
    });
    const final = progress >= 0.96;
    muelleCirculo.setAttribute("r", final ? "16" : "10");
    muelleTexto.classList.toggle("is-visible", final);
  }

  if (
    reduceMotion ||
    typeof gsap === "undefined" ||
    typeof ScrollTrigger === "undefined"
  ) {
    render(1);
    return;
  }

  render(0);
  ScrollTrigger.create({
    trigger: stage,
    start: "top top",
    end: "bottom bottom",
    scrub: 0.5,
    onUpdate: (self) => render(self.progress),
  });
}

function initFooterYear() {
  const el = document.getElementById("footerYear");
  if (el) el.textContent = String(new Date().getFullYear());
}

initNav();
initWspFloat();
initFirma();
initFooterYear();
initReveals();
