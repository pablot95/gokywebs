const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;
const WHATSAPP_NUMBER = "5492944908454";
function esc(value) {
  return String(value).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
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
function initHeroMotion() {
  if (reduceMotion || typeof gsap === "undefined") return;
  const hero = document.querySelector(".hero");
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
  tl.from(
    hero.querySelector("[data-hero-img]"),
    { scale: 1.08, duration: 1.6, clearProps: "transform" },
    0,
  )
    .from(
      hero.querySelectorAll(".hero-eyebrow,.hero-name"),
      {
        y: 18,
        opacity: 0,
        duration: 0.8,
        stagger: 0.08,
        clearProps: "transform,opacity",
      },
      0.1,
    )
    .from(
      hero.querySelector("h1"),
      { y: 30, opacity: 0, duration: 1.1, clearProps: "transform,opacity" },
      0.2,
    )
    .from(
      hero.querySelector(".hero-lead"),
      { y: 24, opacity: 0, duration: 0.9, clearProps: "transform,opacity" },
      0.35,
    )
    .from(
      hero.querySelectorAll(".hero-ctas > *"),
      {
        y: 20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        clearProps: "transform,opacity",
      },
      0.5,
    )
    .from(
      hero.querySelectorAll(".hero-note,.hero-badge,.photo-caption"),
      {
        y: 12,
        opacity: 0,
        duration: 0.75,
        stagger: 0.07,
        clearProps: "transform,opacity",
      },
      0.6,
    );
}
function initNavAccessibility() {
  const nav = document.getElementById("mainNav");
  const header = document.querySelector(".site-header");
  if (!nav || !header) return;
  const sync = () => {
    const open = nav.classList.contains("open");
    header.classList.toggle("nav-is-open", open);
    if (open) {
      nav.setAttribute("role", "dialog");
      nav.setAttribute("aria-modal", "true");
    } else {
      nav.removeAttribute("role");
      nav.removeAttribute("aria-modal");
    }
  };
  new window.MutationObserver(sync).observe(nav, {
    attributes: true,
    attributeFilter: ["class"],
  });
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Tab" || !nav.classList.contains("open")) return;
    const focusable = [...nav.querySelectorAll("a,button")].filter(
      (el) => el.getClientRects().length,
    );
    const first = focusable[0],
      last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    }
    if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
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
  const phone = document.getElementById("telefono");
  if (typeof window.IMask === "function")
    window.IMask(phone, { mask: "+{54} 9 0000000000" });
  const fields = ["nombre", "telefono", "consulta"];
  const error = (id, message) => {
    const input = document.getElementById(id);
    input.setAttribute("aria-invalid", String(Boolean(message)));
    document.getElementById(id + "Error").textContent = message;
  };
  fields.forEach((id) =>
    document.getElementById(id).addEventListener("input", () => error(id, "")),
  );
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const problems = {
      nombre:
        form.elements.nombre.value.trim().length < 2
          ? "Escribí tu nombre."
          : "",
      telefono:
        phone.value.replace(/\D/g, "").length < 10
          ? "Revisá el número de WhatsApp."
          : "",
      consulta:
        form.elements.consulta.value.trim().length < 8
          ? "Contá tu consulta en unas palabras."
          : "",
    };
    fields.forEach((id) => error(id, problems[id]));
    const first = fields.find((id) => problems[id]);
    if (first) {
      document.getElementById(first)?.focus();
      return;
    }
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = "Enviando…";
    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = "Dejá tu consulta ↗";
      form.reset();
      showToast(
        "¡Gracias! El envío de mensajes se activa al pasar la web a producción.",
      );
    }, 800);
  });
}
if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined")
  gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === "undefined")
  document
    .querySelectorAll("[data-animate]")
    .forEach((el) => el.classList.add("in"));
if (typeof ScrollTrigger !== "undefined")
  window.addEventListener("load", () => ScrollTrigger.refresh());
document.querySelectorAll("details").forEach((el) =>
  el.addEventListener("toggle", () => {
    if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
  }),
);
document.querySelectorAll('a[href^="https://wa.me/"]').forEach((a) => {
  if (!a.href.includes(WHATSAPP_NUMBER))
    a.href = "https://wa.me/" + WHATSAPP_NUMBER;
});
initNav();
initNavAccessibility();
initModelBarScroll();
initWspFloat();
initForm();
initHeroMotion();
initReveals();
