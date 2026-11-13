"use strict";
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const WHATSAPP_NUMBER = "5491127696315";
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
    if (!desktopMq.matches) nav.setAttribute("inert", "");
    nav.removeAttribute("role");
    nav.removeAttribute("aria-modal");
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
      { y: 40, opacity: 0, filter: "blur(10px)", duration: 1.2, clearProps: "filter" },
      0.2,
    )
    .from(hero.querySelectorAll(".hero-lead"), { y: 26, opacity: 0, duration: 1 }, 0.45)
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
function initFocusTrap() {
  const nav = document.getElementById("mainNav");
  if (!nav) return;
  nav.addEventListener("keydown", (e) => {
    if (e.key !== "Tab" || !nav.classList.contains("open")) return;
    const items = [...nav.querySelectorAll("a,button")].filter(
      (el) => el.offsetParent !== null,
    );
    const first = items[0],
      last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last?.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first?.focus();
    }
  });
  window.matchMedia("(min-width: 769px)").addEventListener("change", (e) => {
    if (e.matches && nav.classList.contains("open"))
      document.getElementById("navClose")?.click();
  });
}
function initForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;
  const name = document.getElementById("nombre");
  const email = document.getElementById("email");
  const validate = (el) => {
    const valid =
      el === name
        ? el.value.trim().length >= 2
        : el.validity.valid && el.value.trim().length > 0;
    el.setAttribute("aria-invalid", String(!valid));
    document.getElementById(el.id + "Error").textContent = valid
      ? ""
      : el === name
        ? "Escribí tu nombre para continuar."
        : "Revisá el email: por ejemplo, vos@correo.com.";
    return valid;
  };
  [name, email].forEach((el) =>
    el.addEventListener("input", () => {
      if (el.hasAttribute("aria-invalid")) validate(el);
    }),
  );
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const checks = [name, email].map(validate);
    if (checks.includes(false)) {
      [name, email][checks.indexOf(false)].focus();
      return;
    }
    const btn = form.querySelector('button[type="submit"]');
    const label = btn.innerHTML;
    btn.disabled = true;
    btn.textContent = "Enviando…";
    setTimeout(() => {
      showToast("¡Gracias! El envío de mensajes se activa al pasar la web a producción.");
      form.reset();
      [name, email].forEach((el) => el.removeAttribute("aria-invalid"));
      btn.disabled = false;
      btn.innerHTML = label;
    }, 800);
  });
}
if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined")
  gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === "undefined")
  document.querySelectorAll("[data-animate]").forEach((el) => el.classList.add("in"));
if (typeof ScrollTrigger !== "undefined")
  window.addEventListener("load", () => ScrollTrigger.refresh());
document.querySelectorAll("details").forEach((el) =>
  el.addEventListener("toggle", () => {
    if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
  }),
);
document.querySelectorAll('a[href*="wa.me/"]').forEach((el) => {
  if (!el.href.includes(WHATSAPP_NUMBER))
    el.href = el.href.replace(/wa\.me\/\d+/, "wa.me/" + WHATSAPP_NUMBER);
});
initNav();
initFocusTrap();
initForm();
initWspFloat();
initModelBarScroll();
initHeroMotion();
initReveals();
