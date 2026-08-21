function initHeaderScroll() {
  const header = document.querySelector(".site-header");
  if (!header) return;
  function update() {
    header.classList.toggle("is-scrolled", window.scrollY > 40);
  }
  update();
  window.addEventListener("scroll", update, { passive: true });
}

function initNav() {
  const nav = document.getElementById("mainNav");
  const toggle = document.getElementById("menuToggle");
  const closeBtn = document.getElementById("navClose");
  if (!nav || !toggle) return;

  const backdrop = document.createElement("div");
  backdrop.className = "nav-backdrop";
  document.body.appendChild(backdrop);

  const FOCUSABLE = "a[href], button:not([disabled])";
  let lastTrigger = null;

  function onKeydown(e) {
    if (e.key === "Escape") {
      closeNav();
      return;
    }
    if (e.key !== "Tab") return;
    const els = [...nav.querySelectorAll(FOCUSABLE)].filter(
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

  function openNav() {
    lastTrigger = document.activeElement;
    nav.removeAttribute("inert");
    nav.classList.add("is-open");
    backdrop.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
    nav.querySelector(FOCUSABLE)?.focus();
    document.addEventListener("keydown", onKeydown);
  }

  function closeNav() {
    nav.classList.remove("is-open");
    backdrop.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    document.removeEventListener("keydown", onKeydown);
    if (!mq.matches) setTimeout(() => nav.setAttribute("inert", ""), 450);
    lastTrigger?.focus();
  }

  toggle.addEventListener("click", () => {
    nav.classList.contains("is-open") ? closeNav() : openNav();
  });
  closeBtn?.addEventListener("click", closeNav);
  backdrop.addEventListener("click", closeNav);
  nav.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      if (nav.classList.contains("is-open")) closeNav();
    }),
  );

  const mq = window.matchMedia("(min-width: 1000px)");
  function syncInert() {
    if (mq.matches) {
      nav.removeAttribute("inert");
      document.body.style.overflow = "";
    } else if (!nav.classList.contains("is-open")) {
      nav.setAttribute("inert", "");
    }
  }
  syncInert();
  mq.addEventListener("change", syncInert);
}

function initReveals() {
  const els = document.querySelectorAll("[data-animate]");
  if (!els.length) return;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) {
    els.forEach((el) => {
      el.style.opacity = "1";
      el.style.transform = "none";
      el.style.filter = "none";
    });
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const delay = parseFloat(el.dataset.delay || "0");
        setTimeout(() => {
          el.style.opacity = "1";
          el.style.transform = "none";
          el.style.filter = "none";
        }, delay * 1000);
        io.unobserve(el);
      });
    },
    { threshold: 0.2, rootMargin: "0px 0px -8% 0px" },
  );
  els.forEach((el) => io.observe(el));
}

function calcScrollProgress(rectTop, rectHeight, viewportHeight) {
  const total = rectHeight - viewportHeight;
  if (total <= 0) return 0;
  return Math.min(1, Math.max(0, -rectTop / total));
}

function initRitmos() {
  const stage = document.getElementById("ritmosStage");
  const fillObra = document.getElementById("ritmosFillObra");
  const fillCuota = document.getElementById("ritmosFillCuota");
  const llaves = document.getElementById("ritmosLlaves");
  if (!stage || !fillObra || !fillCuota) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    fillObra.style.width = "100%";
    fillCuota.style.width = "100%";
    llaves?.classList.add("is-visible");
    return;
  }

  function update() {
    const rect = stage.getBoundingClientRect();
    const progress = calcScrollProgress(
      rect.top,
      rect.height,
      window.innerHeight,
    );
    const pct = (progress * 100).toFixed(1) + "%";
    fillObra.style.width = pct;
    fillCuota.style.width = pct;
    llaves?.classList.toggle("is-visible", progress > 0.92);
  }
  update();
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
}

function initFooterYear() {
  const el = document.getElementById("footerYear");
  if (el) el.textContent = String(new Date().getFullYear());
}

function ensureToastWrap() {
  let wrap = document.querySelector(".toast-wrap");
  if (!wrap) {
    wrap = document.createElement("div");
    wrap.className = "toast-wrap";
    wrap.setAttribute("aria-live", "polite");
    document.body.appendChild(wrap);
  }
  return wrap;
}

function showToast(message) {
  const wrap = ensureToastWrap();
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.setAttribute("role", "status");
  toast.textContent = message;
  wrap.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add("is-visible"));
  setTimeout(() => {
    toast.classList.remove("is-visible");
    setTimeout(() => toast.remove(), 400);
  }, 3200);
}

function initContactForm() {
  const form = document.getElementById("contactoForm");
  if (!form) return;
  const status = document.getElementById("formStatus");
  const submitBtn = form.querySelector(".form-submit");

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
    if (field.type === "tel" && value) {
      const digits = value.replace(/\D/g, "");
      if (digits.length < 8) {
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

    submitBtn.disabled = true;
    submitBtn.textContent = "Enviando…";

    const lineas = [
      "Hola Viviendas Emmanuel! Quiero hacer una consulta.",
      `Nombre: ${form.nombre.value.trim()}`,
      `¿Ya tiene terreno?: ${form.terreno.value}`,
      `Email: ${form.email.value.trim()}`,
      `Teléfono: ${form.telefono.value.trim()}`,
      `Servicio de interés: ${form.servicio.value}`,
      `Mensaje: ${form.mensaje.value.trim()}`,
    ];
    const url =
      "https://wa.me/5493487324003?text=" +
      encodeURIComponent(lineas.join("\n"));

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.textContent = "Enviar consulta";
      if (status) {
        status.textContent =
          "Te llevamos a WhatsApp para confirmar tu consulta.";
        status.className = "form-status is-success";
      }
      showToast("Abriendo WhatsApp…");
      window.open(url, "_blank", "noopener,noreferrer");
      form.reset();
    }, 450);
  });
}

initHeaderScroll();
initNav();
initReveals();
initRitmos();
initFooterYear();
initContactForm();
