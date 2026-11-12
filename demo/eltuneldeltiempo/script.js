const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;
const WHATSAPP_NUMBER = "5491133854626";
const esc = (s) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
const READINGS = {
  radio: {
    title: "La radio, una memoria compartida.",
    paragraphs: [
      "Una voz puede hacernos recordar un lugar, una canción o una conversación. La radio acompaña mientras hacemos otras cosas y, a veces, termina formando parte de nuestros propios recuerdos.",
      "Escuchar también es una manera de prestar atención: al tono de una voz, a una pausa, a un relato que alguien decide compartir. ¿Qué sonido te lleva a otra época?",
    ],
  },
  mapas: {
    title: "Un mapa, muchas maneras de mirar.",
    paragraphs: [
      "Un mapa invita a recorrer con los ojos un territorio. Sus nombres, sus límites y sus espacios en blanco también nos invitan a hacer preguntas: quién lo dibujó, para quién y con qué propósito.",
      "Mirar un mapa antiguo no es solamente buscar un lugar conocido. Puede ser el comienzo de una conversación sobre cómo imaginamos el mundo y cómo cambia nuestra manera de representarlo.",
    ],
  },
  objetos: {
    title: "Las pequeñas huellas del tiempo.",
    paragraphs: [
      "Una carta, una fotografía o una máquina de escribir pueden abrir una conversación. Los objetos cotidianos nos acercan a las formas de vivir, trabajar y comunicarnos de otras épocas.",
      "Si guardás un recuerdo, podés empezar por una pregunta sencilla: ¿qué historia contarías para que otra persona entienda por qué lo conservaste? A veces, esa historia es tan valiosa como el objeto.",
    ],
  },
};
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';
function trapFocus(e) {
  if (e.key !== "Tab") return;
  const els = [...e.currentTarget.querySelectorAll(FOCUSABLE)].filter(
    (el) => el.offsetParent !== null,
  );
  if (!els.length) return;
  const first = els[0],
    last = els[els.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    last.focus();
    e.preventDefault();
  } else if (!e.shiftKey && document.activeElement === last) {
    first.focus();
    e.preventDefault();
  }
}
function initDetails() {
  const modal = document.getElementById("detailModal");
  const content = document.getElementById("modalContent");
  if (!modal || !content) return;
  let trigger = null;
  const open = (button, markup, title) => {
    trigger = button;
    content.innerHTML = markup;
    modal.querySelector('[role="dialog"]').setAttribute("aria-label", title);
    modal.hidden = false;
    document.body.classList.add("no-scroll");
    modal.querySelector(".modal-close").focus();
  };
  const close = () => {
    modal.hidden = true;
    document.body.classList.remove("no-scroll");
    content.innerHTML = "";
    trigger?.focus();
  };
  document.querySelectorAll("[data-reading]").forEach((btn) =>
    btn.addEventListener("click", () => {
      const reading = READINGS[btn.dataset.reading];
      if (!reading) return;
      open(
        btn,
        `<p class="eyebrow">Lectura de muestra</p><h2>${esc(reading.title)}</h2>${reading.paragraphs.map((p) => `<p>${esc(p)}</p>`).join("")}<p class="modal-caption">Texto ilustrativo para esta propuesta de sitio. No corresponde a una emisión publicada del programa.</p><a class="text-link" href="https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hola El Túnel del Tiempo, quiero compartir una historia sobre " + reading.title)}" target="_blank" rel="noopener noreferrer">Compartí tu historia por WhatsApp ↗</a>`,
        reading.title,
      );
    }),
  );
  document.querySelectorAll("[data-gallery]").forEach((btn) =>
    btn.addEventListener("click", () => {
      const img = btn.querySelector("img");
      const title = btn.querySelector(".gallery-caption span").textContent;
      open(
        btn,
        `<img src="${esc(img.getAttribute("src"))}" alt="${esc(img.alt)}" width="1024" height="1024"><p>${esc(title)}</p><p class="modal-caption">Imagen alegórica e ilustrativa.</p>`,
        title,
      );
    }),
  );
  modal.querySelector(".modal-close").addEventListener("click", close);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) close();
  });
  modal.addEventListener("keydown", trapFocus);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.hidden) close();
  });
}
function initDates() {
  const buttons = [...document.querySelectorAll("[data-date]")];
  if (!buttons.length) return;
  buttons.forEach((btn) =>
    btn.addEventListener("click", () => {
      const panel = document.getElementById(`date-${btn.dataset.date}`);
      if (!panel) return;
      buttons.forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
      document.querySelectorAll(".date-panel").forEach((p) => {
        p.hidden = p !== panel;
      });
      if (!reduceMotion && typeof gsap !== "undefined")
        gsap.fromTo(
          panel,
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.45, clearProps: "opacity,transform" },
        );
      if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
    }),
  );
}
function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;
  const fields = [...form.querySelectorAll("input,textarea")];
  const validate = (field) => {
    const valid = Boolean(field.value.trim()) && field.validity.valid;
    field.setAttribute("aria-invalid", String(!valid));
    document.getElementById(`${field.id}-error`).hidden = valid;
    return valid;
  };
  fields.forEach((field) =>
    field.addEventListener("blur", () => validate(field)),
  );
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const invalid = fields.filter((field) => !validate(field));
    if (invalid.length) {
      invalid[0].focus();
      return;
    }
    const button = form.querySelector('[type="submit"]');
    const initial = button.innerHTML;
    button.disabled = true;
    button.textContent = "Enviando…";
    setTimeout(() => {
      showToast(
        "¡Gracias! El envío de mensajes se activa al pasar la web a producción.",
      );
      form.reset();
      fields.forEach((field) => field.removeAttribute("aria-invalid"));
      button.disabled = false;
      button.innerHTML = initial;
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
  desktopMq.addEventListener("change", () => {
    close();
    syncInert();
  });
  nav.addEventListener("keydown", (e) => {
    if (nav.classList.contains("open")) trapFocus(e);
  });
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
initNav();
initDetails();
initDates();
initContactForm();
initReveals();
initHeroMotion();
initWspFloat();
initModelBarScroll();
if (typeof gsap === "undefined")
  document
    .querySelectorAll("[data-animate]")
    .forEach((el) => el.classList.add("in"));
if (typeof ScrollTrigger !== "undefined")
  window.addEventListener("load", () => ScrollTrigger.refresh());
