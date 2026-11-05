"use strict";
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const WHATSAPP_NUMBER = "5492215228202";
const esc = (s) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined")
  gsap.registerPlugin(ScrollTrigger);
if (typeof ScrollTrigger !== "undefined")
  window.addEventListener("load", () => ScrollTrigger.refresh());

function initHeroMotion() {
  if (reduceMotion || typeof gsap === "undefined") return;
  const hero = document.querySelector(".hero");
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
  const img = hero.querySelector("[data-hero-img]");
  if (img) tl.from(img, { scale: 1.06, duration: 1.6, clearProps: "transform" }, 0);
  tl.from(
    hero.querySelectorAll(".hero-identity"),
    { y: 12, opacity: 0, duration: 0.75, clearProps: "transform,opacity" },
    0.05,
  )
    .from(
      hero.querySelectorAll(".hero-eyebrow"),
      { y: 16, opacity: 0, duration: 0.8, clearProps: "transform,opacity" },
      0.12,
    )
    .from(
      hero.querySelectorAll("h1"),
      { y: 32, opacity: 0, duration: 1, clearProps: "transform,opacity" },
      0.2,
    )
    .from(
      hero.querySelectorAll(".hero-lead"),
      { y: 24, opacity: 0, duration: 0.9, clearProps: "transform,opacity" },
      0.35,
    )
    .from(
      hero.querySelectorAll(".hero-ctas .btn"),
      { y: 18, opacity: 0, duration: 0.75, stagger: 0.1, clearProps: "transform,opacity" },
      0.45,
    )
    .from(
      hero.querySelectorAll(".hero-note"),
      { y: 12, opacity: 0, duration: 0.7, clearProps: "transform,opacity" },
      0.6,
    );
}

function initAccessibleNav() {
  const nav = document.getElementById("mainNav");
  const toggle = document.getElementById("menuToggle");
  if (!nav || !toggle) return;
  const sync = () => {
    const open = nav.classList.contains("open");
    if (open) {
      nav.setAttribute("role", "dialog");
      nav.setAttribute("aria-modal", "true");
    } else {
      nav.removeAttribute("role");
      nav.removeAttribute("aria-modal");
    }
  };
  new window.MutationObserver(sync).observe(nav, { attributes: true, attributeFilter: ["class"] });
  nav.addEventListener("keydown", (e) => {
    if (e.key !== "Tab" || !nav.classList.contains("open")) return;
    const all = [...nav.querySelectorAll("a[href],button")].filter(
      (el) => el.offsetParent !== null,
    );
    const first = all[0];
    const last = all[all.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last?.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first?.focus();
    }
  });
  window.matchMedia("(min-width: 769px)").addEventListener("change", (e) => {
    if (!e.matches) return;
    nav.classList.remove("open");
    document.querySelector(".nav-backdrop")?.classList.remove("open");
    document.body.classList.remove("no-scroll");
    toggle.setAttribute("aria-expanded", "false");
  });
}

function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;
  const fields = [...form.querySelectorAll("[required]")];
  const validate = (field) => {
    const ok = field.value.trim().length > 0 && field.validity.valid;
    field.setAttribute("aria-invalid", String(!ok));
    const error = document.getElementById(field.getAttribute("aria-describedby"));
    if (error) error.hidden = ok;
    return ok;
  };
  fields.forEach((field) => field.addEventListener("blur", () => validate(field)));
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const invalid = fields.filter((field) => !validate(field));
    if (invalid.length) {
      invalid[0].focus();
      return;
    }
    const btn = form.querySelector('[type="submit"]');
    if (btn.disabled) return;
    const original = btn.innerHTML;
    btn.disabled = true;
    btn.textContent = "Enviando…";
    setTimeout(() => {
      showToast("¡Gracias! El envío de mensajes se activa al pasar la web a producción.");
      form.reset();
      fields.forEach((field) => field.removeAttribute("aria-invalid"));
      btn.innerHTML = original;
      btn.disabled = false;
    }, 800);
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

function initWspFloat() {
  const btn = document.getElementById("wsp-float");
  if (!btn) return;
  const target = new URL(btn.href);
  target.pathname = WHATSAPP_NUMBER;
  btn.href = target.href;
  window.addEventListener(
    "scroll",
    () => {
      if (window.scrollY > 600) btn.classList.add("visible");
    },
    { passive: true },
  );
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
  toggle.addEventListener("click", () => (nav.classList.contains("open") ? close() : open()));
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
    showTimer = setTimeout(() => bar.classList.remove("gw-modelos--scrolling"), 120);
  };
  window.addEventListener(
    "scroll",
    () => {
      if (!frame) frame = requestAnimationFrame(update);
    },
    { passive: true },
  );
}

initNav();
initAccessibleNav();
initContactForm();
initWspFloat();
initModelBarScroll();
initHeroMotion();
initReveals();
if (typeof gsap === "undefined")
  document.querySelectorAll("[data-animate]").forEach((el) => el.classList.add("in"));
