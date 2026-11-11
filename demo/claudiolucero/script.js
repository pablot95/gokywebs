const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;
const WHATSAPP_NUMBER = "5492324617117";
const esc = (s) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

function initGallery() {
  const dialog = document.getElementById("galleryDialog");
  const links = [...document.querySelectorAll("[data-gallery]")];
  if (!dialog || !links.length) return;
  const photo = document.getElementById("galleryFull");
  const caption = document.getElementById("galleryCaption");
  let current = 0;
  let trigger = null;
  const show = (index) => {
    current = (index + links.length) % links.length;
    const link = links[current];
    photo.src = link.href;
    photo.alt = link.querySelector("img").alt;
    caption.textContent = `${link.closest("figure").querySelector("figcaption").textContent} · ${current + 1} / ${links.length}`;
  };
  links.forEach((link, index) =>
    link.addEventListener("click", (event) => {
      event.preventDefault();
      trigger = link;
      show(index);
      dialog.showModal();
      document.body.classList.add("no-scroll");
      dialog.querySelector(".dialog-close").focus();
    }),
  );
  dialog
    .querySelector(".dialog-close")
    .addEventListener("click", () => dialog.close());
  document
    .getElementById("galleryPrev")
    .addEventListener("click", () => show(current - 1));
  document
    .getElementById("galleryNext")
    .addEventListener("click", () => show(current + 1));
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") show(current + 1);
    if (event.key === "ArrowLeft") show(current - 1);
    trapFocus(event, dialog);
  });
  dialog.addEventListener("close", () => {
    document.body.classList.remove("no-scroll");
    trigger?.focus({ preventScroll: true });
  });
}

function trapFocus(event, container) {
  if (event.key !== "Tab") return;
  const controls = [
    ...container.querySelectorAll("a[href], button, input, textarea"),
  ].filter((el) => !el.disabled && el.getClientRects().length);
  const first = controls[0];
  const last = controls[controls.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last?.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first?.focus();
  }
}

function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;
  const name = document.getElementById("contactName");
  const phone = document.getElementById("contactPhone");
  const message = document.getElementById("contactMessage");
  const button = form.querySelector('button[type="submit"]');
  const buttonLabel = button.innerHTML;
  const mask =
    typeof IMask !== "undefined"
      ? IMask(phone, { mask: "+{54} {9} 0000 000000" })
      : null;
  const errors = [
    [name, "nameError"],
    [phone, "phoneError"],
    [message, "messageError"],
  ];
  errors.forEach(([field, errorId]) =>
    field.addEventListener("input", () => {
      field.removeAttribute("aria-invalid");
      document.getElementById(errorId).hidden = true;
    }),
  );
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (button.disabled) return;
    const digits = phone.value.replace(/\D/g, "");
    const valid = [
      name.value.trim().length > 0,
      /^(?:549)?\d{10}$/.test(digits),
      message.value.trim().length >= 8,
    ];
    errors.forEach(([field, errorId], index) => {
      field.setAttribute("aria-invalid", String(!valid[index]));
      document.getElementById(errorId).hidden = valid[index];
    });
    if (valid.includes(false)) {
      errors[valid.indexOf(false)][0].focus();
      return;
    }
    button.disabled = true;
    button.textContent = "Enviando…";
    setTimeout(() => {
      showToast(
        "¡Gracias! El envío de mensajes se activa al pasar la web a producción.",
      );
      form.reset();
      if (mask) mask.value = "";
      errors.forEach(([field]) => field.removeAttribute("aria-invalid"));
      button.disabled = false;
      button.innerHTML = buttonLabel;
      if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
    }, 800);
  });
}

function initHeroMotion() {
  if (reduceMotion || typeof gsap === "undefined") return;
  const hero = document.querySelector(".hero");
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
  tl.from(
    hero.querySelector("[data-hero-img]"),
    { scale: 1.1, duration: 1.8 },
    0,
  )
    .from(
      hero.querySelector(".hero-eyebrow"),
      { y: 18, opacity: 0, duration: 0.9, clearProps: "all" },
      0.1,
    )
    .from(
      hero.querySelector("h1"),
      { y: 32, opacity: 0, duration: 1.1, clearProps: "all" },
      0.2,
    )
    .from(
      hero.querySelector(".hero-lead"),
      { y: 24, opacity: 0, duration: 0.9, clearProps: "all" },
      0.35,
    )
    .from(
      hero.querySelectorAll(".hero-ctas a"),
      { y: 22, opacity: 0, duration: 0.8, stagger: 0.1, clearProps: "all" },
      0.45,
    )
    .from(
      hero.querySelector(".hero-badge"),
      { y: 16, opacity: 0, duration: 0.8, clearProps: "all" },
      0.55,
    );
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
    toggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("no-scroll");
    nav.removeAttribute("role");
    nav.removeAttribute("aria-modal");
  };
  const open = () => {
    nav.classList.add("open");
    bd.classList.add("open");
    nav.removeAttribute("inert");
    toggle.setAttribute("aria-expanded", "true");
    document.body.classList.add("no-scroll");
    nav.setAttribute("role", "dialog");
    nav.setAttribute("aria-modal", "true");
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
  nav.addEventListener("keydown", (event) => {
    if (nav.classList.contains("open")) trapFocus(event, nav);
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

function initWspFloat() {
  const btn = document.getElementById("wsp-float");
  if (!btn) return;
  btn.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hola Claudio, quiero consultar por una fecha.")}`;
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
initGallery();
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
