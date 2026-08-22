const WHATSAPP_NUMBER = "5493884727848";

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
  if (!nav || !toggle) return;
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
    gsap.set(hijos, { opacity: 0, y: 24 });
    gsap.to(hijos, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "expo.out",
      stagger: 0.12,
      scrollTrigger: { trigger: cont, start: "top 85%", once: true },
    });
  });
}

function initFloatingWsp() {
  const btn = document.getElementById("floatingWsp");
  if (!btn) return;
  btn.classList.add("is-visible");
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

const CAMINO_ETAPAS = 3;

function initCamino() {
  const svg = document.getElementById("caminoSvg");
  const track = document.getElementById("caminoProgreso");
  const trackBg = svg ? svg.querySelector(".camino-track") : null;
  const elementosEtapa = document.querySelectorAll(
    "#caminoSvg [data-etapa-min]",
  );
  const etapas = document.querySelectorAll("#caminoEtapas .camino-etiqueta");
  if (!svg || !track || !trackBg || !elementosEtapa.length) return;

  const total = trackBg.getTotalLength();
  track.style.strokeDasharray = String(total);
  track.style.strokeDashoffset = String(total);

  function setEtapa(index) {
    const frac = index / (CAMINO_ETAPAS - 1);
    track.style.strokeDashoffset = String(total * (1 - frac));
    elementosEtapa.forEach((el) => {
      const umbral = Number(el.dataset.etapaMin);
      el.classList.toggle("is-on", umbral <= index);
    });
    etapas.forEach((e, i) => e.classList.toggle("is-on", i === index));
  }

  setEtapa(0);

  if (reduceMotion) {
    setEtapa(CAMINO_ETAPAS - 1);
    return;
  }
  if (typeof IntersectionObserver === "undefined") {
    setEtapa(CAMINO_ETAPAS - 1);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        for (let i = 1; i < CAMINO_ETAPAS; i++) {
          setTimeout(() => setEtapa(i), i * 900);
        }
        observer.disconnect();
      });
    },
    { threshold: 0.4 },
  );
  observer.observe(svg);
}

function mostrarToast(texto) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = texto;
  toast.classList.add("is-visible");
  setTimeout(() => toast.classList.remove("is-visible"), 3200);
}

function initForm() {
  const form = document.getElementById("formContacto");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let valido = true;
    form.querySelectorAll("[required]").forEach((campo) => {
      const wrapper = campo.closest(".campo");
      const vacio = !campo.value.trim();
      wrapper.classList.toggle("is-invalido", vacio);
      if (vacio) valido = false;
    });
    if (!valido) return;

    const boton = form.querySelector(".form-submit");
    const textoOriginal = boton.textContent;
    boton.disabled = true;
    boton.textContent = "Enviando…";

    setTimeout(() => {
      boton.disabled = false;
      boton.textContent = textoOriginal;
      form.reset();
      form
        .querySelectorAll(".campo")
        .forEach((c) => c.classList.remove("is-invalido"));
      mostrarToast(
        "¡Gracias! El envío de mensajes se activa al pasar la web a producción.",
      );
    }, 800);
  });
}

function initMapa() {
  const el = document.getElementById("mapaEscuela");
  if (!el || typeof L === "undefined") return;
  const map = L.map(el, { scrollWheelZoom: false }).setView(
    [-23.5763, -65.3961],
    15,
  );
  L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    {
      attribution: "© OpenStreetMap, © CARTO",
      maxZoom: 19,
    },
  ).addTo(map);
  L.circleMarker([-23.5763, -65.3961], {
    radius: 9,
    color: "#1D4E89",
    fillColor: "#1D4E89",
    fillOpacity: 0.85,
    weight: 2,
  })
    .addTo(map)
    .bindPopup("Bachillerato Provincial N° 25 — Tilcara");
}

function initJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "School",
    name: 'Bachillerato Provincial N° 25 "German Walter Choquevilca"',
    description:
      "Escuela secundaria pública en Tilcara, Jujuy, con orientación en Informática y en Turismo.",
    telephone: `+${WHATSAPP_NUMBER}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Tilcara",
      addressRegion: "Jujuy",
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
    });
  }

  initNav();
  initWspLinks();
  initReveals();
  initRevealsStagger();
  initCamino();
  initForm();
  initMapa();
  initFloatingWsp();
  initAntiCopia();
  initJsonLd();

  window.addEventListener("load", () => {
    if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
  });
});
