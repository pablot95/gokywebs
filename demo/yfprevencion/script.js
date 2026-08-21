const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}
if (typeof gsap === "undefined") {
  document.querySelectorAll("[data-animate]").forEach((el) => {
    el.style.opacity = 1;
    el.style.transform = "none";
    el.style.filter = "none";
  });
}
if (typeof ScrollTrigger !== "undefined") {
  window.addEventListener("load", () => ScrollTrigger.refresh());
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
  const desktopMq = window.matchMedia("(min-width: 861px)");
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
  document.querySelectorAll("[data-animate-stagger]").forEach((parent) => {
    parent.querySelectorAll("[data-animate]").forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i * 0.12, 0.72)}s`;
    });
  });
  items.forEach((el) => {
    if (el.closest("[data-animate-stagger]")) return;
    const d = parseFloat(el.dataset.delay || "0");
    if (d) el.style.transitionDelay = `${d}s`;
  });
  if (!("IntersectionObserver" in window) || reduceMotion) {
    items.forEach((el) => el.classList.add("in"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
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
    items.forEach((el) => {
      if (el.classList.contains("in")) return;
      const r = el.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight) {
        el.classList.add("in");
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
  window.addEventListener("load", queueSweep);
  window.addEventListener("scroll", queueSweep, { passive: true });
  window.addEventListener("resize", queueSweep, { passive: true });
}

function initWspFloat() {
  const btn = document.getElementById("wsp-float");
  if (!btn) return;
  window.addEventListener(
    "scroll",
    () => {
      if (window.scrollY > 600) btn.classList.add("visible");
      else btn.classList.remove("visible");
    },
    { passive: true },
  );
}

function gaugeAngle(progress) {
  return -68 + progress * 136;
}

function activeCapaIndex(progress, total) {
  return Math.min(total - 1, Math.floor(progress * total));
}

function initFirma() {
  const stage = document.getElementById("firmaStage");
  const needle = document.getElementById("gaugeNeedle");
  const capas = document.querySelectorAll(".firma-capa");
  if (!stage || !needle || !capas.length) return;

  const setNeedle = (deg) => {
    needle.style.transform = `rotate(${deg}deg)`;
  };
  const setActive = (idx) =>
    capas.forEach((c, i) => c.classList.toggle("is-active", i === idx));

  if (
    reduceMotion ||
    typeof gsap === "undefined" ||
    typeof ScrollTrigger === "undefined"
  ) {
    setNeedle(gaugeAngle(1));
    setActive(capas.length - 1);
    return;
  }

  setActive(0);
  ScrollTrigger.create({
    trigger: stage,
    start: "top top",
    end: "bottom bottom",
    scrub: 0.6,
    onUpdate: (self) => {
      setNeedle(gaugeAngle(self.progress));
      setActive(activeCapaIndex(self.progress, capas.length));
    },
  });
}

function initFooterYear() {
  const el = document.getElementById("footerYear");
  if (el) el.textContent = String(new Date().getFullYear());
}

function showToast(msg) {
  let wrap = document.querySelector(".toast-wrap");
  if (!wrap) {
    wrap = document.createElement("div");
    wrap.className = "toast-wrap";
    wrap.setAttribute("aria-live", "polite");
    document.body.appendChild(wrap);
  }
  const esc = (s) =>
    String(s ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
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

function initContactForm() {
  const form = document.getElementById("contactoForm");
  if (!form) return;

  const telInput = document.getElementById("telefono");
  if (telInput && typeof IMask !== "undefined") {
    IMask(telInput, {
      mask: [
        { mask: "+{54} 9 (00) 0000-0000" },
        { mask: "+{54} 9 (000) 000-0000" },
        { mask: "+{54} 9 (0000) 00-0000" },
      ],
    });
  }

  function setError(field, message) {
    const errorEl = document.getElementById(field.id + "-error");
    if (message) {
      field.setAttribute("aria-invalid", "true");
      if (errorEl) {
        errorEl.textContent = message;
        errorEl.hidden = false;
      }
    } else {
      field.setAttribute("aria-invalid", "false");
      if (errorEl) {
        errorEl.hidden = true;
        errorEl.textContent = "";
      }
    }
  }

  function validateField(field) {
    const value = field.value.trim();
    if (field.hasAttribute("required") && !value) {
      setError(field, "Este campo es obligatorio.");
      return false;
    }
    if (
      field.type === "email" &&
      value &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    ) {
      setError(field, "Ingresá un email válido.");
      return false;
    }
    if (field.id === "telefono" && value) {
      const digits = value.replace(/\D/g, "");
      if (digits.length < 10) {
        setError(field, "Ingresá un teléfono válido.");
        return false;
      }
    }
    setError(field, "");
    return true;
  }

  form.querySelectorAll("input, select, textarea").forEach((field) => {
    field.addEventListener("blur", () => validateField(field));
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fields = [...form.querySelectorAll("input, select, textarea")];
    let firstInvalid = null;
    let allValid = true;
    fields.forEach((field) => {
      if (!validateField(field)) {
        allValid = false;
        if (!firstInvalid) firstInvalid = field;
      }
    });
    if (!allValid) {
      firstInvalid?.focus();
      firstInvalid?.scrollIntoView({ block: "center", behavior: "smooth" });
      return;
    }
    const submitBtn = form.querySelector(".form-submit");
    const status = document.getElementById("formStatus");
    submitBtn.disabled = true;
    submitBtn.textContent = "Enviando…";
    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.textContent = "Enviar consulta";
      if (status) {
        status.textContent =
          "¡Gracias! El envío de mensajes se activa al pasar la web a producción.";
        status.className = "form-status is-success";
      }
      showToast(
        "¡Gracias! El envío de mensajes se activa al pasar la web a producción.",
      );
      form.reset();
    }, 800);
  });
}

initNav();
initWspFloat();
initFirma();
initFooterYear();
initContactForm();
initReveals();
