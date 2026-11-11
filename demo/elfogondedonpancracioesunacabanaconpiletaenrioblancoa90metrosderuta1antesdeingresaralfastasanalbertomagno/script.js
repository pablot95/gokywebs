"use strict";

const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;
const esc = (s) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

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
    nav.removeAttribute("role");
    nav.removeAttribute("aria-modal");
    if (!desktopMq.matches) nav.setAttribute("inert", "");
    toggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("no-scroll");
  };
  const open = () => {
    nav.classList.add("open");
    bd.classList.add("open");
    nav.removeAttribute("inert");
    nav.setAttribute("role", "dialog");
    nav.setAttribute("aria-modal", "true");
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
    if (desktopMq.matches) {
      close();
      nav.removeAttribute("inert");
    } else if (!nav.classList.contains("open")) nav.setAttribute("inert", "");
  };
  desktopMq.addEventListener("change", syncInert);
  syncInert();
  nav.addEventListener("keydown", (e) => {
    if (e.key !== "Tab" || !nav.classList.contains("open")) return;
    const controls = [...nav.querySelectorAll("a[href], button")];
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });
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

function initWspFloat() {
  const btn = document.getElementById("wsp-float");
  if (!btn) return;
  const show = () => {
    if (window.scrollY > 600) {
      btn.classList.add("visible");
      window.removeEventListener("scroll", show);
    }
  };
  window.addEventListener("scroll", show, { passive: true });
  show();
}

function initGallery() {
  const dialog = document.getElementById("lightbox");
  const links = [...document.querySelectorAll("[data-gallery]")];
  if (!dialog || !links.length || typeof dialog.showModal !== "function")
    return;
  const image = document.getElementById("lightbox-image");
  const caption = document.getElementById("lightbox-caption");
  const count = document.getElementById("lightbox-count");
  let index = 0;
  let trigger = null;
  const display = (next) => {
    index = (next + links.length) % links.length;
    const thumbnail = links[index].querySelector("img");
    image.src = links[index].href;
    image.alt = thumbnail.alt;
    caption.textContent = thumbnail.alt;
    count.textContent = `${index + 1} / ${links.length}`;
  };
  links.forEach((link, position) =>
    link.addEventListener("click", (event) => {
      event.preventDefault();
      trigger = link;
      display(position);
      dialog.showModal();
      document.body.classList.add("no-scroll");
    }),
  );
  dialog
    .querySelector(".lightbox-close")
    .addEventListener("click", () => dialog.close());
  document
    .getElementById("lightbox-prev")
    .addEventListener("click", () => display(index - 1));
  document
    .getElementById("lightbox-next")
    .addEventListener("click", () => display(index + 1));
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener("keydown", (event) => {
    if (event.key === "Tab") {
      const first = dialog.querySelector(".lightbox-close");
      const last = document.getElementById("lightbox-next");
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      display(index - 1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      display(index + 1);
    }
  });
  dialog.addEventListener("close", () => {
    document.body.classList.remove("no-scroll");
    trigger?.focus({ preventScroll: true });
  });
}

function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;
  const controls = [...form.querySelectorAll("input, textarea")];
  const button = form.querySelector('button[type="submit"]');
  const buttonContent = button.innerHTML;
  button.disabled = false;
  const validate = (control) => {
    const valid = control.value.trim().length > 0 && control.validity.valid;
    control.setAttribute("aria-invalid", String(!valid));
    document.getElementById(`${control.id}-error`).hidden = valid;
    return valid;
  };
  controls.forEach((control) =>
    control.addEventListener("blur", () => {
      if (control.value || control.hasAttribute("aria-invalid"))
        validate(control);
    }),
  );
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (button.disabled) return;
    const invalid = controls.filter((control) => !validate(control));
    if (invalid.length) {
      invalid[0].focus();
      return;
    }
    button.disabled = true;
    button.textContent = "Enviando…";
    window.setTimeout(() => {
      showToast(
        "¡Gracias! El envío de mensajes se activa al pasar la web a producción.",
      );
      form.reset();
      controls.forEach((control) => control.removeAttribute("aria-invalid"));
      button.disabled = false;
      button.innerHTML = buttonContent;
    }, 800);
  });
}

function initMap() {
  const element = document.getElementById("map");
  if (!element || typeof L === "undefined") return;
  const center = [-24.2284256, -65.2365573];
  element.querySelector(".map-fallback")?.remove();
  const map = L.map(element, {
    scrollWheelZoom: false,
    dragging: !window.matchMedia("(pointer: coarse)").matches,
  }).setView(center, 13);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>',
    maxZoom: 19,
  }).addTo(map);
  L.circle(center, {
    radius: 600,
    color: "#3d7771",
    weight: 1,
    fillOpacity: 0.1,
  })
    .addTo(map)
    .bindPopup("Río Blanco, Jujuy · Zona de referencia");
  new window.ResizeObserver(() => map.invalidateSize()).observe(element);
}

function initSocialLinks() {
  document.querySelectorAll("[data-social]").forEach((button) =>
    button.addEventListener("click", () => {
      showToast(
        `${button.dataset.social} estará disponible próximamente. El nombre de usuario de esta demo es una propuesta.`,
      );
    }),
  );
}

if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined")
  gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === "undefined")
  document
    .querySelectorAll("[data-animate]")
    .forEach((el) => el.classList.add("in"));
if (typeof ScrollTrigger !== "undefined") {
  window.addEventListener("load", () => ScrollTrigger.refresh());
  document
    .querySelectorAll("details")
    .forEach((detail) =>
      detail.addEventListener("toggle", () => ScrollTrigger.refresh()),
    );
}

initNav();
initGallery();
initContactForm();
initSocialLinks();
initHeroMotion();
initWspFloat();
initModelBarScroll();
initMap();
initReveals();
