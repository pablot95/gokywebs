const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;
const WHATSAPP_NUMBER = "5491170613762";
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

function initChecklist() {
  const list = document.getElementById("checklist");
  if (!list) return;
  const items = list.querySelectorAll(".check-item");
  const run = () => {
    items.forEach((item, i) => {
      if (reduceMotion) {
        item.classList.add("is-done");
        return;
      }
      setTimeout(() => item.classList.add("is-done"), 300 + i * 340);
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
      { threshold: 0.3 },
    );
    io.observe(list);
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

function initContactForm() {
  const form = document.getElementById("contactoForm");
  if (!form) return;
  const btn = document.getElementById("btnEnviar");
  const requiredFields = [
    {
      input: document.getElementById("inpNombre"),
      field: document.getElementById("fieldNombre"),
    },
    {
      input: document.getElementById("inpEmail"),
      field: document.getElementById("fieldEmail"),
    },
    {
      input: document.getElementById("inpMensaje"),
      field: document.getElementById("fieldMensaje"),
    },
  ];
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let valid = true;
    requiredFields.forEach(({ input, field }) => {
      const empty = !input.value.trim();
      const badEmail =
        input.type === "email" &&
        input.value.trim() &&
        !emailRe.test(input.value.trim());
      const bad = empty || badEmail;
      field.classList.toggle("has-error", bad);
      if (bad) valid = false;
    });
    if (!valid) return;

    btn.disabled = true;
    const original = btn.textContent;
    btn.textContent = "Enviando…";
    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = original;
      form.reset();
      showToast(
        "¡Gracias! El envío de mensajes se activa al pasar la web a producción.",
      );
    }, 800);
  });
}

function initMapa() {
  const el = document.getElementById("mapaZona");
  if (!el || typeof L === "undefined") return;
  const coords = [-34.6037, -58.3816];
  const map = L.map(el, { scrollWheelZoom: false }).setView(coords, 11);
  L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    {
      attribution: "&copy; OpenStreetMap &copy; CARTO",
      maxZoom: 18,
    },
  ).addTo(map);
  const icon = L.divIcon({
    className: "",
    html: '<div style="width:22px;height:22px;border-radius:50% 50% 50% 0;background:#1E3A8A;border:2px solid #fff;transform:rotate(-45deg);box-shadow:0 3px 8px rgba(0,0,0,.35)"></div>',
    iconSize: [22, 22],
    iconAnchor: [11, 22],
  });
  L.marker(coords, { icon })
    .addTo(map)
    .bindPopup(
      "<strong>Fernando Colman e Hijos</strong><br>Buenos Aires y alrededores",
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
      name: "Fernando Colman e Hijos",
      description:
        "Limpieza profesional para bancos, colegios, hospitales, oficinas, casas particulares y obra en construcción. Limpieza general, abrillantado y pulido de pisos.",
      url: "https://gokywebs.com/",
      telephone: "+" + WHATSAPP_NUMBER,
      areaServed: "Buenos Aires, Argentina",
      geo: {
        "@type": "GeoCoordinates",
        latitude: -34.6037,
        longitude: -58.3816,
      },
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
initChecklist();
initFaq();
initContactForm();
initMapa();
injectJsonLd();
