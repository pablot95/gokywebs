const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;
const WHATSAPP_NUMBER = "5493543614888";
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
  const desktopMq = window.matchMedia("(min-width: 821px)");
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

function initMapa() {
  const el = document.getElementById("mapaZona");
  if (!el || typeof L === "undefined") return;
  const coords = [-31.4272, -62.0836];
  const map = L.map(el, { scrollWheelZoom: false }).setView(coords, 13);
  L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    {
      attribution: "&copy; OpenStreetMap &copy; CARTO",
      maxZoom: 18,
    },
  ).addTo(map);
  const icon = L.divIcon({
    className: "",
    html: '<div style="width:22px;height:22px;border-radius:50% 50% 50% 0;background:#720B20;border:2px solid #fff;transform:rotate(-45deg);box-shadow:0 3px 8px rgba(0,0,0,.35)"></div>',
    iconSize: [22, 22],
    iconAnchor: [11, 22],
  });
  L.marker(coords, { icon })
    .addTo(map)
    .bindPopup(
      "<strong>N | A Gestoría Integral</strong><br>San Francisco, Córdoba",
    );
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
      name: "N | A Gestoría Integral",
      description:
        "Gestoría integral automotor e inmobiliaria: transferencias, informes, cédulas, títulos, gestiones municipales y compraventa de propiedades.",
      url: "https://gokywebs.com/",
      telephone: "+" + WHATSAPP_NUMBER,
      priceRange: "$$",
      areaServed: "San Francisco, Córdoba, Argentina",
      geo: {
        "@type": "GeoCoordinates",
        latitude: -31.4272,
        longitude: -62.0836,
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "¿Qué necesito para hacer una transferencia de mi vehículo?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Depende del caso, pero en general el título, la cédula y tu documentación.",
          },
        },
        {
          "@type": "Question",
          name: "¿Pueden gestionar un trámite si perdí la documentación?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Sí, gestionamos la reposición de cédulas, títulos y otra documentación extraviada o vencida.",
          },
        },
        {
          "@type": "Question",
          name: "¿También se ocupan de la parte inmobiliaria?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Sí, acompañamos operaciones de compra y venta de principio a fin.",
          },
        },
        {
          "@type": "Question",
          name: "¿Tengo que ir a la oficina para arrancar?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No necesariamente, muchas gestiones se coordinan por WhatsApp.",
          },
        },
        {
          "@type": "Question",
          name: "¿Cuánto tarda un trámite?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Varía según el trámite y el organismo; se estima al recibir la consulta.",
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
initMapa();
injectJsonLd();
