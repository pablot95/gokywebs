const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
  if (k === "f12" || (e.ctrlKey && e.shiftKey && ["i", "j", "c"].includes(k)) || (e.ctrlKey && k === "u")) {
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

function trapFocus(event, container) {
  if (event.key !== "Tab") return;
  const controls = [...container.querySelectorAll("a[href], button, input, select, textarea")].filter(
    (el) => !el.disabled && el.getClientRects().length,
  );
  if (!controls.length) return;
  const first = controls[0];
  const last = controls[controls.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
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
  nav.addEventListener("keydown", (e) => {
    if (nav.classList.contains("open")) trapFocus(e, nav);
  });
  const syncInert = () => {
    if (desktopMq.matches) {
      close();
      nav.removeAttribute("inert");
    } else if (!nav.classList.contains("open")) nav.setAttribute("inert", "");
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
    setTimeout(() => {
      el.style.transitionDelay = "";
    }, (d + 1.2) * 1000);
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
  if (img) tl.from(img, { scale: 1.1, duration: 1.8, clearProps: "transform" }, 0);
  const foco = hero.querySelector(".hero-foco");
  if (foco) {
    const cs = window.getComputedStyle(foco);
    const x = cs.getPropertyValue("--foco-x").trim() || "70%";
    const y = cs.getPropertyValue("--foco-y").trim() || "30%";
    tl.fromTo(
      foco,
      { "--foco-x": "6%", "--foco-y": "-12%", opacity: 0.4 },
      { "--foco-x": x, "--foco-y": y, opacity: 1, duration: 1.7, ease: "power3.inOut", clearProps: "all" },
      0,
    );
  }
  tl.from(hero.querySelectorAll(".hero-eyebrow"), { y: 18, opacity: 0, duration: 0.9, clearProps: "transform,opacity" }, 0.1)
    .from(hero.querySelectorAll(".hero-nombre"), { y: 30, opacity: 0, filter: "blur(10px) brightness(.5)", duration: 1.2, clearProps: "transform,opacity,filter" }, 0.18)
    .from(hero.querySelectorAll("h1"), { y: 24, opacity: 0, duration: 1, clearProps: "transform,opacity" }, 0.35)
    .from(hero.querySelectorAll(".hero-lead"), { y: 22, opacity: 0, duration: 0.9, clearProps: "transform,opacity" }, 0.45)
    .from(hero.querySelectorAll(".hero-ctas .btn"), { y: 20, opacity: 0, duration: 0.8, stagger: 0.12, clearProps: "transform,opacity" }, 0.55)
    .from(hero.querySelectorAll(".escudo-marco"), { y: 36, opacity: 0, duration: 1.3, clearProps: "transform,opacity" }, 0.3)
    .from(hero.querySelectorAll(".hero-placa"), { scale: 0.92, opacity: 0, duration: 1.1, clearProps: "transform,opacity" }, 0.7);
}

function initVisor() {
  const dialog = document.getElementById("visor");
  const links = [...document.querySelectorAll("[data-gallery]")];
  if (!dialog || !links.length || typeof dialog.showModal !== "function") return;
  const foto = document.getElementById("visorImg");
  const texto = document.getElementById("visorTexto");
  const cerrar = dialog.querySelector(".visor-cerrar");
  let actual = 0;
  let origen = null;
  const mostrar = (i) => {
    actual = (i + links.length) % links.length;
    const link = links[actual];
    const img = link.querySelector("img");
    foto.src = link.getAttribute("href");
    foto.width = img?.naturalWidth || Number(img?.getAttribute("width")) || foto.width;
    foto.height = img?.naturalHeight || Number(img?.getAttribute("height")) || foto.height;
    foto.alt = img?.alt || "";
    const titulo = link.querySelector(".g-cap b")?.textContent || "";
    texto.textContent = `${titulo} · ${actual + 1} de ${links.length}`;
  };
  links.forEach((link, i) =>
    link.addEventListener("click", (e) => {
      e.preventDefault();
      origen = link;
      mostrar(i);
      dialog.showModal();
      document.body.classList.add("no-scroll");
      cerrar?.focus();
    }),
  );
  cerrar?.addEventListener("click", () => dialog.close());
  document.getElementById("visorPrev")?.addEventListener("click", () => mostrar(actual - 1));
  document.getElementById("visorNext")?.addEventListener("click", () => mostrar(actual + 1));
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) dialog.close();
  });
  dialog.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") mostrar(actual + 1);
    if (e.key === "ArrowLeft") mostrar(actual - 1);
    trapFocus(e, dialog);
  });
  dialog.addEventListener("close", () => {
    document.body.classList.remove("no-scroll");
    origen?.focus({ preventScroll: true });
  });
}

function copiarTexto(texto) {
  if (navigator.clipboard?.writeText && window.isSecureContext) {
    return navigator.clipboard.writeText(texto);
  }
  return new Promise((resolve, reject) => {
    const area = document.createElement("textarea");
    area.value = texto;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand("copy");
    area.remove();
    if (ok) resolve();
    else reject(new Error("copy"));
  });
}

function initCopiar() {
  const botones = document.querySelectorAll("[data-copiar]");
  if (!botones.length) return;
  const corta = () => document.getElementById("bioCorta")?.textContent.trim() || "";
  const completa = () =>
    [".bio-p1", ".bio-p2", ".bio-p3"]
      .map((sel) => document.querySelector(sel)?.textContent.trim() || "")
      .filter(Boolean)
      .join("\n\n");
  botones.forEach((btn) =>
    btn.addEventListener("click", () => {
      const tipo = btn.dataset.copiar;
      const texto = tipo === "corta" ? corta() : completa();
      copiarTexto(texto)
        .then(() =>
          showToast(
            tipo === "corta"
              ? "Presentación copiada: lista para leer en el escenario."
              : "Biografía copiada: lista para pegar en el afiche o la gacetilla.",
          ),
        )
        .catch(() => showToast("No se pudo copiar desde este navegador. Probá de nuevo."));
    }),
  );
}

function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;
  const nombre = document.getElementById("cNombre");
  const telefono = document.getElementById("cTelefono");
  const tipo = document.getElementById("cTipo");
  const mensaje = document.getElementById("cMensaje");
  const boton = form.querySelector('button[type="submit"]');
  const etiqueta = boton.innerHTML;
  const mask = typeof IMask !== "undefined" ? IMask(telefono, { mask: "+{54} {9} 0000 000000" }) : null;
  const campos = [
    [nombre, "cNombreError", () => nombre.value.trim().length > 1],
    [telefono, "cTelefonoError", () => /^(?:549)?\d{10}$/.test(telefono.value.replace(/\D/g, ""))],
    [tipo, "cTipoError", () => tipo.value !== ""],
    [mensaje, "cMensajeError", () => mensaje.value.trim().length >= 8],
  ];
  campos.forEach(([campo, errorId]) => {
    const limpiar = () => {
      campo.removeAttribute("aria-invalid");
      document.getElementById(errorId).hidden = true;
    };
    campo.addEventListener("input", limpiar);
    campo.addEventListener("change", limpiar);
  });
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (boton.disabled) return;
    let primero = null;
    campos.forEach(([campo, errorId, valido]) => {
      const ok = valido();
      campo.setAttribute("aria-invalid", String(!ok));
      document.getElementById(errorId).hidden = ok;
      if (!ok && !primero) primero = campo;
    });
    if (primero) {
      primero.focus();
      if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
      return;
    }
    boton.disabled = true;
    boton.textContent = "Enviando…";
    setTimeout(() => {
      showToast("¡Gracias! El envío de mensajes se activa al pasar la web a producción.");
      form.reset();
      if (mask) mask.value = "";
      campos.forEach(([campo]) => campo.removeAttribute("aria-invalid"));
      boton.disabled = false;
      boton.innerHTML = etiqueta;
      if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
    }, 800);
  });
}

function initRailDrag(vp) {
  if (!vp) return;
  let dragging = false;
  let moved = false;
  let startX = 0;
  let startScroll = 0;
  let pointerId = null;
  const THRESHOLD = 6;
  vp.addEventListener("pointerdown", (e) => {
    if (e.pointerType === "touch" || e.button !== 0) return;
    dragging = true;
    moved = false;
    pointerId = e.pointerId;
    startX = e.clientX;
    startScroll = vp.scrollLeft;
  });
  vp.addEventListener("pointermove", (e) => {
    if (!dragging || e.pointerId !== pointerId) return;
    const dx = e.clientX - startX;
    if (!moved && Math.abs(dx) < THRESHOLD) return;
    if (!moved) {
      moved = true;
      vp.classList.add("dragging");
      try {
        vp.setPointerCapture?.(pointerId);
      } catch {
        /* sin capture el arrastre igual funciona */
      }
    }
    e.preventDefault();
    vp.scrollLeft = startScroll - dx;
  });
  const end = (e) => {
    if (!dragging || (e && pointerId !== null && e.pointerId !== pointerId)) return;
    dragging = false;
    if (moved) {
      try {
        vp.releasePointerCapture?.(pointerId);
      } catch {
        /* ya liberado */
      }
      vp.classList.remove("dragging");
      const kill = (ev) => {
        ev.stopPropagation();
        ev.preventDefault();
      };
      vp.addEventListener("click", kill, { capture: true, once: true });
      setTimeout(() => vp.removeEventListener("click", kill, { capture: true }), 0);
    }
    pointerId = null;
    moved = false;
  };
  vp.addEventListener("pointerup", end);
  vp.addEventListener("pointercancel", end);
  vp.addEventListener("dragstart", (e) => e.preventDefault());
}

function initRail() {
  const vp = document.querySelector(".rail-vp");
  if (!vp) return;
  initRailDrag(vp);
  const track = vp.querySelector(".rail-track");
  const prev = document.getElementById("railPrev");
  const next = document.getElementById("railNext");
  if (!track || !prev || !next) return;
  const paso = () => (track.querySelector("li")?.getBoundingClientRect().width || 280) + 20;
  const actualizar = () => {
    prev.disabled = vp.scrollLeft <= 2;
    next.disabled = vp.scrollLeft >= vp.scrollWidth - vp.clientWidth - 2;
  };
  prev.addEventListener("click", () => vp.scrollBy({ left: -paso(), behavior: reduceMotion ? "auto" : "smooth" }));
  next.addEventListener("click", () => vp.scrollBy({ left: paso(), behavior: reduceMotion ? "auto" : "smooth" }));
  vp.addEventListener("scroll", actualizar, { passive: true });
  window.addEventListener("resize", actualizar, { passive: true });
  actualizar();
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

if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") gsap.registerPlugin(ScrollTrigger);
initNav();
initVisor();
initCopiar();
initContactForm();
initRail();
initReveals();
initHeroMotion();
initWspFloat();
initModelBarScroll();
if (typeof gsap === "undefined") document.querySelectorAll("[data-animate]").forEach((el) => el.classList.add("in"));
if (typeof ScrollTrigger !== "undefined") window.addEventListener("load", () => ScrollTrigger.refresh());
