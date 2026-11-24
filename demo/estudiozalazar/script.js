const WHATSAPP_NUMBER = "5491157050552";
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

function argentinaDate(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Argentina/Buenos_Aires",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

function dateAllowed(value, today = argentinaDate()) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || value <= today) return false;
  const day = new Date(`${value}T12:00:00Z`);
  return (
    !Number.isNaN(day.valueOf()) &&
    day.toISOString().slice(0, 10) === value &&
    ![0, 6].includes(day.getUTCDay())
  );
}

function timeAllowed(value) {
  return /^(09|1[0-7]):00$/.test(value);
}

function formatDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return "";
  return new Intl.DateTimeFormat("es-AR", {
    timeZone: "UTC",
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date(`${value}T12:00:00Z`));
}

function bookingLink(selection) {
  const message = [
    "Hola Estudio Zalazar, quisiera coordinar una consulta.",
    `Consulta: ${selection.audience === "empresa" ? "empresa" : "particular"}.`,
    `Motivo: ${selection.service}.`,
    `Preferencia: ${formatDate(selection.date)} a las ${selection.time} hs (Argentina).`,
    "¿Me confirman disponibilidad, duración y honorarios?",
  ].join("\n");
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function initBooking() {
  const form = document.getElementById("booking-form");
  if (!form) return;
  const date = form.querySelector("#date");
  const time = form.querySelector("#time");
  const audience = form.querySelector("#audience");
  const service = form.querySelector("#service");
  const summary = document.getElementById("booking-summary");
  const dialog = document.getElementById("payment-dialog");
  const services = {
    particular: [
      "Asesoramiento jurídico",
      "Escribanía e inmobiliaria",
      "Gestoría y agrimensura",
      "Asesoramiento contable",
    ],
    empresa: [
      "Abono jurídico mensual",
      "Consulta jurídica empresarial",
      "Servicios interdisciplinarios",
    ],
  };
  let trigger = null;
  const nextDay = new Date(`${argentinaDate()}T12:00:00Z`);
  nextDay.setUTCDate(nextDay.getUTCDate() + 1);
  date.min = nextDay.toISOString().slice(0, 10);
  const selection = () => ({
    audience: audience.value,
    service: service.value,
    date: date.value,
    time: time.value,
  });
  const update = () => {
    const valid = dateAllowed(date.value) && timeAllowed(time.value);
    summary.textContent = valid
      ? `${formatDate(date.value)} · ${time.value} hs · ${service.value}`
      : "Elegí día y horario para continuar.";
  };
  const validate = () => {
    const checks = [
      [date, dateAllowed(date.value)],
      [time, timeAllowed(time.value)],
    ];
    for (const [input, valid] of checks) {
      input.setAttribute("aria-invalid", String(!valid));
      document.getElementById(`${input.id}-error`).hidden = valid;
    }
    checks.find(([, valid]) => !valid)?.[0].focus();
    return checks.every(([, valid]) => valid);
  };
  const setServices = () => {
    service.replaceChildren(
      ...services[audience.value].map((label) => new window.Option(label, label)),
    );
    update();
  };
  audience.addEventListener("change", setServices);
  [date, time, service].forEach((input) =>
    input.addEventListener("change", () => {
      if (input !== service) {
        const valid =
          input === date ? dateAllowed(date.value) : timeAllowed(time.value);
        input.setAttribute("aria-invalid", String(!valid));
        document.getElementById(`${input.id}-error`).hidden = valid;
      }
      update();
    }),
  );
  document.querySelectorAll("[data-audience]").forEach((link) =>
    link.addEventListener("click", () => {
      audience.value = link.dataset.audience;
      setServices();
    }),
  );
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!validate()) return;
    trigger = document.activeElement;
    const data = selection();
    document.getElementById("payment-selection").textContent =
      `${data.service} · ${formatDate(data.date)} · ${data.time} hs (Argentina). Honorarios a confirmar.`;
    document.getElementById("payment-whatsapp").href = bookingLink(data);
    dialog.showModal();
    document.body.classList.add("no-scroll");
    dialog.querySelector("button").focus();
  });
  document.getElementById("booking-whatsapp").addEventListener("click", () => {
    if (!validate()) return;
    window.open(bookingLink(selection()), "_blank", "noopener,noreferrer");
    showToast("Confirmá la disponibilidad y los honorarios con el estudio.");
  });
  dialog
    .querySelector(".dialog-close")
    .addEventListener("click", () => dialog.close());
  dialog.addEventListener("close", () => {
    document.body.classList.remove("no-scroll");
    trigger?.focus();
  });
  dialog.addEventListener("click", (event) => {
    const rect = dialog.getBoundingClientRect();
    if (
      event.target === dialog &&
      (event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom)
    )
      dialog.close();
  });
  dialog.addEventListener("keydown", trapFocus);
}

function trapFocus(event) {
  if (event.key !== "Tab") return;
  const elements = [
    ...event.currentTarget.querySelectorAll(
      'a[href],button:not([disabled]),input,select,[tabindex="0"]',
    ),
  ].filter((el) => el.getClientRects().length);
  const first = elements[0];
  const last = elements.at(-1);
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last?.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first?.focus();
  }
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

function initNavigationAccessibility() {
  const nav = document.getElementById("mainNav");
  if (!nav) return;
  nav.addEventListener("keydown", (event) => {
    if (nav.classList.contains("open")) trapFocus(event);
  });
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
  new window.MutationObserver(sync).observe(nav, {
    attributes: true,
    attributeFilter: ["class"],
  });
  window
    .matchMedia("(min-width: 769px)")
    .addEventListener("change", (event) => {
      if (!event.matches) return;
      nav.classList.remove("open");
      document.querySelector(".nav-backdrop")?.classList.remove("open");
      document.body.classList.remove("no-scroll");
      document
        .getElementById("menuToggle")
        .setAttribute("aria-expanded", "false");
    });
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

if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined")
  gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === "undefined")
  document
    .querySelectorAll("[data-animate]")
    .forEach((el) => el.classList.add("in"));
if (typeof ScrollTrigger !== "undefined")
  window.addEventListener("load", () => ScrollTrigger.refresh());
initBooking();
initReveals();
initNav();
initNavigationAccessibility();
initWspFloat();
initModelBarScroll();
initHeroMotion();
