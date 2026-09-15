const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;
const WHATSAPP_NUMBER = "5492994223819";
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

function initRouteLine() {
  const path = document.getElementById("routePath1");
  if (
    !path ||
    typeof gsap === "undefined" ||
    typeof ScrollTrigger === "undefined"
  )
    return;
  if (typeof window.DrawSVGPlugin === "undefined") return;
  gsap.registerPlugin(window.DrawSVGPlugin);
  if (reduceMotion) return;
  gsap.fromTo(
    path,
    { drawSVG: "0%" },
    {
      drawSVG: "100%",
      ease: "none",
      scrollTrigger: {
        trigger: path,
        start: "top 90%",
        end: "bottom 60%",
        scrub: 0.5,
      },
    },
  );
}

function initGauge() {
  const svg = document.getElementById("gaugeSvg");
  const ticksGroup = document.getElementById("gaugeTicks");
  const needle = document.getElementById("gaugeNeedle");
  if (!svg || !ticksGroup || !needle) return;

  const cx = 150;
  const cy = 150;
  const rInner = 106;
  const rOuter = 124;
  const angles = [-150, -100, -50, 0, 50, 100, 150];
  const frag = document.createDocumentFragment();
  angles.forEach((deg) => {
    const rad = (deg * Math.PI) / 180;
    const x1 = cx + rInner * Math.sin(rad);
    const y1 = cy - rInner * Math.cos(rad);
    const x2 = cx + rOuter * Math.sin(rad);
    const y2 = cy - rOuter * Math.cos(rad);
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", x1.toFixed(1));
    line.setAttribute("y1", y1.toFixed(1));
    line.setAttribute("x2", x2.toFixed(1));
    line.setAttribute("y2", y2.toFixed(1));
    frag.appendChild(line);
  });
  ticksGroup.appendChild(frag);

  const REST_ANGLE = -150;
  const TARGET_ANGLE = 82;

  if (reduceMotion) {
    needle.style.transform = `rotate(${TARGET_ANGLE}deg)`;
    animateDashLights(true);
    animateCounters(true);
    return;
  }

  needle.style.transform = `rotate(${REST_ANGLE}deg)`;

  const run = () => {
    if (typeof gsap !== "undefined") {
      gsap.to(needle, {
        rotation: TARGET_ANGLE,
        duration: 1.5,
        ease: "power3.out",
        transformOrigin: "150px 150px",
      });
    } else {
      needle.style.transition = "transform 1.4s cubic-bezier(0.16,1,0.3,1)";
      needle.style.transform = `rotate(${TARGET_ANGLE}deg)`;
    }
    animateDashLights(false);
    animateCounters(false);
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
    io.observe(svg);
  } else {
    run();
  }
}

function animateDashLights(instant) {
  const lights = document.querySelectorAll(".dash-light");
  lights.forEach((light, i) => {
    if (instant) {
      light.classList.add("is-on");
      return;
    }
    setTimeout(() => light.classList.add("is-on"), 300 + i * 220);
  });
}

function animateCounters(instant) {
  const counters = document.querySelectorAll("[data-counter]");
  counters.forEach((el) => {
    const end = parseInt(el.dataset.counter, 10);
    if (instant || typeof gsap === "undefined") {
      el.textContent = end.toLocaleString("es-AR");
      return;
    }
    const obj = { v: 0 };
    gsap.to(obj, {
      v: end,
      duration: 1.8,
      ease: "power1.out",
      snap: { v: 1 },
      onUpdate: () => {
        el.textContent = obj.v.toLocaleString("es-AR");
      },
    });
  });
}

function initMapa() {
  const el = document.getElementById("mapaZona");
  if (!el || typeof L === "undefined") return;
  const coords = [-38.9516, -68.0591];
  const map = L.map(el, { scrollWheelZoom: false }).setView(coords, 9);
  L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    {
      attribution: "&copy; OpenStreetMap &copy; CARTO",
      maxZoom: 18,
    },
  ).addTo(map);
  const icon = L.divIcon({
    className: "",
    html: '<div style="width:22px;height:22px;border-radius:50% 50% 50% 0;background:#E63946;border:2px solid #fff;transform:rotate(-45deg);box-shadow:0 3px 8px rgba(0,0,0,.35)"></div>',
    iconSize: [22, 22],
    iconAnchor: [11, 22],
  });
  L.marker(coords, { icon })
    .addTo(map)
    .bindPopup("<strong>El Rojo 4x4</strong><br>Cordillera neuquina");
  el.addEventListener(
    "click",
    () => {
      map.scrollWheelZoom.enable();
      showToast("Zoom con scroll activado en el mapa");
    },
    { once: true },
  );
}

function injectJsonLd() {
  const graph = [
    {
      "@type": "LocalBusiness",
      "@id": "https://gokywebs.com/#negocio",
      name: "El Rojo 4x4",
      description:
        "Excursiones 4x4 en montañas nevadas de la cordillera neuquina, guiadas o completas con alojamiento y comidas.",
      url: "https://gokywebs.com/",
      telephone: "+" + WHATSAPP_NUMBER,
      priceRange: "$$",
      areaServed: "Neuquén, Argentina",
      geo: {
        "@type": "GeoCoordinates",
        latitude: -38.9516,
        longitude: -68.0591,
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "¿La excursión se adapta a mi grupo?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Sí, cada salida se arma según el grupo, la edad de los chicos si hay, el tiempo disponible y lo que quieran ver.",
          },
        },
        {
          "@type": "Question",
          name: "¿Hace falta experiencia en montaña?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No, las excursiones están pensadas para cualquier persona. El manejo y la guía corren por cuenta de Jorge.",
          },
        },
        {
          "@type": "Question",
          name: "¿Qué diferencia hay entre la excursión guiada y la completa?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "La guiada es de ida y vuelta en el día. La completa suma alojamiento, desayuno, almuerzo en la montaña y cena.",
          },
        },
        {
          "@type": "Question",
          name: "¿Qué tengo que llevar?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Ropa de abrigo, calzado cerrado y ganas de andar en la nieve.",
          },
        },
        {
          "@type": "Question",
          name: "¿En qué época del año se puede hacer?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "La ruta se ajusta según la temporada; se coordina la fecha por WhatsApp.",
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
initFaq();
initRouteLine();
initGauge();
initMapa();
injectJsonLd();
