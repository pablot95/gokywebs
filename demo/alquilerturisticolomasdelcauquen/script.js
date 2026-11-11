"use strict";
const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;
const WHATSAPP_NUMBER = "5492944605632";
const esc = (s) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

function initGallery() {
  const dialog = document.getElementById("gallery-dialog");
  const links = Array.from(document.querySelectorAll("[data-gallery]"));
  if (!dialog || !links.length) return;
  const photo = document.getElementById("gallery-full");
  const caption = document.getElementById("gallery-caption");
  const counter = document.getElementById("gallery-counter");
  let active = 0;
  let opener = null;
  const render = (index) => {
    active = (index + links.length) % links.length;
    const link = links[active];
    photo.src = link.href;
    photo.alt = link.querySelector("img").alt;
    caption.textContent = link.dataset.caption;
    counter.textContent = `${active + 1} / ${links.length}`;
  };
  links.forEach((link, index) =>
    link.addEventListener("click", (event) => {
      event.preventDefault();
      opener = link;
      render(index);
      dialog.showModal();
      document.body.classList.add("no-scroll");
      dialog.querySelector(".dialog-close").focus();
    }),
  );
  dialog
    .querySelector(".dialog-close")
    .addEventListener("click", () => dialog.close());
  dialog
    .querySelector(".gallery-prev")
    .addEventListener("click", () => render(active - 1));
  dialog
    .querySelector(".gallery-next")
    .addEventListener("click", () => render(active + 1));
  dialog.addEventListener("click", (event) => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (
      event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom
    )
      dialog.close();
  });
  dialog.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      render(active - 1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      render(active + 1);
    }
    trapFocus(event, dialog);
  });
  dialog.addEventListener("close", () => {
    document.body.classList.remove("no-scroll");
    opener?.focus();
  });
}

function trapFocus(event, root) {
  if (event.key !== "Tab") return;
  const focusable = Array.from(
    root.querySelectorAll(
      'a[href],button:not([disabled]),input,textarea,[tabindex="0"]',
    ),
  ).filter((el) => el.getClientRects().length);
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last?.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first?.focus();
  }
}

function enhanceNavAccessibility() {
  const nav = document.getElementById("mainNav");
  const toggle = document.getElementById("menuToggle");
  if (!nav || !toggle) return;
  const desktop = window.matchMedia("(min-width: 769px)");
  const sync = () => {
    const open = nav.classList.contains("open") && !desktop.matches;
    if (open) {
      nav.setAttribute("role", "dialog");
      nav.setAttribute("aria-modal", "true");
    } else {
      nav.removeAttribute("role");
      nav.removeAttribute("aria-modal");
    }
    document.querySelector("main").inert = open;
    document.querySelector(".site-footer").inert = open;
    document.querySelector(".brand").inert = open;
  };
  new window.MutationObserver(sync).observe(nav, {
    attributes: true,
    attributeFilter: ["class"],
  });
  nav.addEventListener("keydown", (event) => trapFocus(event, nav));
  desktop.addEventListener("change", () => {
    if (desktop.matches) {
      nav.classList.remove("open");
      document.querySelector(".nav-backdrop")?.classList.remove("open");
      document.body.classList.remove("no-scroll");
      toggle.setAttribute("aria-expanded", "false");
    }
    sync();
  });
  sync();
}

function initMap() {
  const el = document.getElementById("location-map");
  if (!el || typeof L === "undefined") return;
  const map = L.map(el, {
    scrollWheelZoom: false,
    dragging: !window.matchMedia("(pointer: coarse)").matches,
  }).setView([-41.1335, -71.3103], 11);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
  }).addTo(map);
  L.marker([-41.1335, -71.3103], {
    icon: L.divIcon({
      className: "map-reference-marker",
      html: "<span></span>",
      iconSize: [16, 16],
    }),
  })
    .addTo(map)
    .bindPopup(
      "Referencia: centro de Bariloche. No es la ubicación de la cabaña.",
    );
  window.addEventListener("resize", () => map.invalidateSize());
}

function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;
  const name = document.getElementById("guest-name");
  const message = document.getElementById("guest-message");
  const submit = form.querySelector('button[type="submit"]');
  const original = submit.innerHTML;
  submit.disabled = false;
  const validate = (input) => {
    const valid = input.value.trim().length >= Number(input.minLength);
    const error = document.getElementById(
      input.getAttribute("aria-describedby"),
    );
    input.setAttribute("aria-invalid", String(!valid));
    error.textContent = valid
      ? ""
      : input === name
        ? "Escribí tu nombre (al menos 2 letras)."
        : "Contanos un poco más (al menos 10 caracteres).";
    return valid;
  };
  [name, message].forEach((input) =>
    input.addEventListener("input", () => {
      if (input.getAttribute("aria-invalid") === "true") validate(input);
    }),
  );
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const nameValid = validate(name);
    const messageValid = validate(message);
    if (!nameValid || !messageValid) {
      (nameValid ? message : name).focus();
      return;
    }
    submit.disabled = true;
    submit.textContent = "Enviando…";
    setTimeout(() => {
      showToast(
        "¡Gracias! El envío de mensajes se activa al pasar la web a producción.",
      );
      form.reset();
      [name, message].forEach((input) => input.removeAttribute("aria-invalid"));
      submit.disabled = false;
      submit.innerHTML = original;
    }, 800);
  });
}

function initFaq() {
  document.querySelectorAll("details").forEach((detail) =>
    detail.addEventListener("toggle", () => {
      if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
    }),
  );
}

function validateWhatsappLinks() {
  document.querySelectorAll('a[href*="wa.me/"]').forEach((link) => {
    const url = new URL(link.href);
    if (url.pathname !== `/${WHATSAPP_NUMBER}`)
      url.pathname = `/${WHATSAPP_NUMBER}`;
    link.href = url.href;
  });
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

function initWspFloat() {
  const btn = document.getElementById("wsp-float");
  if (!btn) return;
  window.addEventListener(
    "scroll",
    () => {
      if (window.scrollY > 600) btn.classList.add("visible");
    },
    { passive: true },
  );
}

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

function initNav() {
  const toggle = document.getElementById("menuToggle");
  const nav = document.getElementById("mainNav");
  const closeBtn = document.getElementById("navClose");
  if (!toggle || !nav) return;
  let bd = document.querySelector(".nav-backdrop");
  if (!bd) {
    bd = document.createElement("div");
    bd.className = "nav-backdrop";
    (document.querySelector(".site-header") || document.body).appendChild(bd);
  }
  const desktopMq = window.matchMedia("(min-width: 769px)");
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

function initReveals() {
  const items = document.querySelectorAll("[data-animate]");
  if (!items.length) return;
  if (!("IntersectionObserver" in window) || reduceMotion) {
    items.forEach((el) => el.classList.add("in"));
    return;
  }
  const entrar = (el, n) => {
    const d = Math.min(n * 0.1, 0.6);
    el.style.transitionDelay = `${d}s`;
    el.classList.add("in");
    setTimeout(
      () => {
        el.style.transitionDelay = "";
      },
      (d + 1.2) * 1000,
    );
  };
  const io = new IntersectionObserver(
    (entries) => {
      let n = 0;
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entrar(entry.target, n++);
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
    let n = 0;
    items.forEach((el) => {
      if (el.classList.contains("in")) return;
      const r = el.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight) {
        entrar(el, n++);
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
  requestAnimationFrame(() => requestAnimationFrame(queueSweep));
  window.addEventListener("load", queueSweep);
  window.addEventListener("scroll", queueSweep, { passive: true });
  window.addEventListener("resize", queueSweep, { passive: true });
}

function initHeroMotion() {
  if (reduceMotion || typeof gsap === "undefined") return;
  const hero = document.querySelector(".hero");
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
  const img = hero.querySelector("[data-hero-img]");
  if (img) tl.from(img, { scale: 1.1, duration: 1.8 }, 0);
  tl.from(
    hero.querySelectorAll(".hero-eyebrow"),
    { y: 18, opacity: 0, duration: 0.9 },
    0.1,
  )
    .from(
      hero.querySelectorAll("h1"),
      {
        y: 40,
        opacity: 0,
        filter: "blur(10px)",
        duration: 1.2,
        clearProps: "filter",
      },
      0.2,
    )
    .from(
      hero.querySelectorAll(".hero-lead"),
      { y: 26, opacity: 0, duration: 1 },
      0.45,
    )
    .from(
      hero.querySelectorAll(".hero-ctas .btn"),
      {
        y: 22,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        clearProps: "transform,opacity",
      },
      0.6,
    )
    .from(
      hero.querySelectorAll(".sello, .hero-badge"),
      {
        scale: 0.92,
        opacity: 0,
        duration: 1.1,
        stagger: 0.1,
        clearProps: "transform,opacity",
      },
      0.65,
    );
}

function initModelBarScroll() {
  const bar = document.querySelector(".gw-modelos");
  if (!bar) return;
  let showTimer = 0;
  let frame = 0;
  const update = () => {
    frame = 0;
    if (window.scrollY <= 8) {
      bar.classList.remove("gw-modelos--scrolling");
      return;
    }
    bar.classList.add("gw-modelos--scrolling");
    clearTimeout(showTimer);
    showTimer = setTimeout(
      () => bar.classList.remove("gw-modelos--scrolling"),
      120,
    );
  };
  window.addEventListener(
    "scroll",
    () => {
      if (!frame) frame = requestAnimationFrame(update);
    },
    { passive: true },
  );
}

if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined")
  gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === "undefined")
  document
    .querySelectorAll("[data-animate]")
    .forEach((el) => el.classList.add("in"));
if (typeof ScrollTrigger !== "undefined")
  window.addEventListener("load", () => ScrollTrigger.refresh());
initNav();
enhanceNavAccessibility();
initGallery();
initContactForm();
initMap();
initFaq();
initWspFloat();
initModelBarScroll();
validateWhatsappLinks();
initHeroMotion();
initReveals();
