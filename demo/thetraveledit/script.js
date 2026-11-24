const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;
let revealsListos = false;
const WHATSAPP_NUMBER = "5491156320350";
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
  revealsListos = true;
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
function revelarNuevos(cont) {
  if (!revealsListos || !cont) return;
  const nuevos = [...cont.querySelectorAll("[data-animate]:not(.in)")];
  if (!nuevos.length) return;
  if (reduceMotion) {
    nuevos.forEach((el) => el.classList.add("in"));
    return;
  }
  requestAnimationFrame(() =>
    requestAnimationFrame(() =>
      nuevos.forEach((el, i) => {
        const d = Math.min(i * 0.06, 0.6);
        el.style.transitionDelay = `${d}s`;
        el.classList.add("in");
        setTimeout(
          () => {
            el.style.transitionDelay = "";
          },
          (d + 1.2) * 1000,
        );
      }),
    ),
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
    if (window.scrollY > 600) btn.classList.add("visible");
  };
  window.addEventListener("scroll", show, { passive: true });
  show();
}

function initJourneyTabs() {
  const list = document.querySelector(".journey-tabs");
  if (!list) return;
  const tabs = [...list.querySelectorAll("[data-journey]")];
  const panels = [...document.querySelectorAll(".journey-panel")];
  list.setAttribute("role", "tablist");
  tabs.forEach((tab) => {
    tab.setAttribute("role", "tab");
    tab.setAttribute("aria-controls", `panel-${tab.dataset.journey}`);
  });
  panels.forEach((panel) => {
    panel.setAttribute("role", "tabpanel");
    panel.setAttribute("tabindex", "0");
    panel.setAttribute("aria-labelledby", panel.id.replace("panel-", "tab-"));
  });
  const activate = (tab, focus = false) => {
    tabs.forEach((item) => {
      const selected = item === tab;
      item.setAttribute("aria-selected", String(selected));
      item.tabIndex = selected ? 0 : -1;
    });
    panels.forEach((panel) => {
      panel.hidden = panel.id !== `panel-${tab.dataset.journey}`;
      if (!panel.hidden) revelarNuevos(panel);
    });
    if (focus) tab.focus();
    if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
  };
  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => activate(tab));
    tab.addEventListener("keydown", (event) => {
      let next;
      if (["ArrowRight", "ArrowDown"].includes(event.key))
        next = (index + 1) % tabs.length;
      else if (["ArrowLeft", "ArrowUp"].includes(event.key))
        next = (index - 1 + tabs.length) % tabs.length;
      else if (event.key === "Home") next = 0;
      else if (event.key === "End") next = tabs.length - 1;
      else return;
      event.preventDefault();
      activate(tabs[next], true);
    });
  });
  activate(tabs[0]);
}

function initForm() {
  const form = document.getElementById("travel-form");
  if (!form) return;
  const fields = ["nombre", "email", "idea"];
  const errors = {
    nombre: "Contanos tu nombre.",
    email: "Revisá que el email esté completo.",
    idea: "Escribí unas palabras sobre el viaje que imaginás.",
  };
  const validate = (name) => {
    const input = form.elements.namedItem(name);
    const valid = Boolean(input.value.trim()) && input.validity.valid;
    input.setAttribute("aria-invalid", String(!valid));
    document.getElementById(`error-${name}`).textContent = valid
      ? ""
      : errors[name];
    return valid;
  };
  fields.forEach((name) =>
    form.elements.namedItem(name).addEventListener("input", () => {
      if (form.elements.namedItem(name).getAttribute("aria-invalid") === "true")
        validate(name);
    }),
  );
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const button = form.querySelector('[type="submit"]');
    if (button.disabled) return;
    const valid = fields.map(validate).every(Boolean);
    if (!valid) {
      form.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }
    const label = button.textContent;
    button.textContent = "Enviando…";
    button.disabled = true;
    const status = form.querySelector(".form-status");
    status.textContent = "Procesando la demostración…";
    setTimeout(() => {
      const message =
        "¡Gracias! El envío de mensajes se activa al pasar la web a producción.";
      showToast(message);
      status.textContent = message;
      form.reset();
      fields.forEach((name) =>
        form.elements.namedItem(name).removeAttribute("aria-invalid"),
      );
      button.disabled = false;
      button.textContent = label;
    }, 800);
  });
}

function initNavAccessibility() {
  const nav = document.getElementById("mainNav");
  const toggle = document.getElementById("menuToggle");
  if (!nav || !toggle) return;
  const sync = () => {
    if (nav.classList.contains("open")) {
      nav.setAttribute("role", "dialog");
      nav.setAttribute("aria-modal", "true");
    } else {
      nav.removeAttribute("role");
      nav.removeAttribute("aria-modal");
    }
  };
  document.addEventListener("click", sync);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") sync();
    if (event.key !== "Tab" || !nav.classList.contains("open")) return;
    const focusable = [...nav.querySelectorAll("button,a[href]")];
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
  window
    .matchMedia("(min-width: 769px)")
    .addEventListener("change", (event) => {
      if (event.matches && nav.classList.contains("open")) {
        document.getElementById("navClose")?.click();
        sync();
      }
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
document.querySelectorAll(".faq-list details").forEach((detail) =>
  detail.addEventListener("toggle", () => {
    if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
  }),
);
document.querySelectorAll('a[href*="wa.me/"]').forEach((link) => {
  if (!link.href.includes(`wa.me/${WHATSAPP_NUMBER}?`))
    link.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hola The Travel Edit, quiero consultar por un viaje a medida.")}`;
});
initJourneyTabs();
initReveals();
initNav();
initNavAccessibility();
initWspFloat();
initHeroMotion();
initModelBarScroll();
initForm();
