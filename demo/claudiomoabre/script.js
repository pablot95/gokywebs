/* Claudio Moabre — landing one-page. Usa data.js. */
/* global SHOWS, CARTAS_INICIO, CARTAS_FINAL, WSP, setInterval */
(function () {
  "use strict";
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasST = typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined";
  if (hasST) gsap.registerPlugin(ScrollTrigger);
  if (typeof gsap === "undefined") {
    document.querySelectorAll("[data-animate]").forEach(el => { el.style.opacity = 1; el.style.transform = "none"; });
  }

  const esc = s => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

  /* ---------- Repertorio: las 6 tarjetas ---------- */
  const grid = document.getElementById("repGrid");
  const lista = document.getElementById("repList");
  if (grid) {
    grid.innerHTML = SHOWS.map((s, i) => `
      <article class="show-card" data-i="${i}">
        <div class="show-media"><img src="${esc(s.img)}" alt="${esc(s.alt)}" width="1600" height="1300" loading="lazy" decoding="async"></div>
        <div class="show-body">
          <span class="show-n">Show ${esc(s.n)}</span>
          <h3>${esc(s.titulo)}</h3>
          <p class="show-bajada">${esc(s.bajada)}</p>
          <p class="show-texto">${esc(s.texto)}</p>
          <ul class="show-tags">${s.tags.map(t => `<li>${esc(t)}</li>`).join("")}</ul>
          <a class="show-cta" href="https://wa.me/${WSP}?text=${encodeURIComponent("Hola Claudio, quiero consultar por: " + s.titulo)}" target="_blank" rel="noopener noreferrer">Consultar este show</a>
        </div>
      </article>`).join("");
  }
  if (lista) {
    lista.innerHTML = SHOWS.map((s, i) => `<li data-i="${i}"><b>${esc(s.n)}</b><span>${esc(s.titulo)}</span></li>`).join("");
  }

  /* ---------- FIRMA: el seguidor ----------
     La sección arranca a oscuras. Con el scroll, un haz de luz recorre el escenario
     y va encontrando los shows de a uno: el que toca se enciende y queda encendido. */
  const track = document.getElementById("repTrack");
  const luz = document.getElementById("luz");
  const repN = document.getElementById("repN");
  const cards = grid ? [...grid.querySelectorAll(".show-card")] : [];
  const items = lista ? [...lista.querySelectorAll("li")] : [];
  const N = cards.length;

  function alumbrar(p) {
    const avance = p * N;
    const activo = Math.min(N - 1, Math.floor(avance));
    const local = avance - activo;
    cards.forEach((c, i) => c.classList.toggle("on", i === activo));
    items.forEach((li, i) => li.classList.toggle("on", i === activo));
    if (repN) repN.textContent = String(activo + 1).padStart(2, "0");
    if (luz) {
      luz.style.setProperty("--lx", (58 + Math.sin(avance * 1.7) * 9).toFixed(1) + "%");
      luz.style.setProperty("--ly", (30 + local * 34).toFixed(1) + "%");
    }
  }

  function luzEncendida() {
    if (track) track.classList.add("is-static");
    cards.forEach(c => c.classList.add("on"));
    items.forEach(li => li.classList.add("on"));
    if (repN) repN.textContent = "06";
  }

  const chico = window.matchMedia("(max-width: 900px)").matches;

  /* ---------- El truco: pensá una carta ---------- */
  const cartasEl = document.getElementById("cartas");
  const msgEl = document.getElementById("trucoMsg");
  const goBtn = document.getElementById("trucoGo");
  const resetBtn = document.getElementById("trucoReset");

  function pintarCartas(lista, clase) {
    if (!cartasEl) return;
    cartasEl.className = "cartas " + (clase || "");
    cartasEl.innerHTML = lista.map((c, i) => {
      const rojo = c.p === "♥" || c.p === "♦";
      return `<span class="carta${rojo ? " roja" : ""}" style="--i:${i}"><b>${esc(c.v)}</b><i>${esc(c.p)}</i><b class="inv">${esc(c.v)}</b></span>`;
    }).join("");
  }

  if (cartasEl) pintarCartas(CARTAS_INICIO);

  if (goBtn) {
    goBtn.addEventListener("click", () => {
      goBtn.disabled = true;
      if (msgEl) msgEl.textContent = "Mezclando…";
      if (cartasEl) cartasEl.classList.add("mezclando");
      const espera = reduced ? 60 : 900;
      setTimeout(() => {
        pintarCartas(CARTAS_FINAL, "resultado");
        if (msgEl) msgEl.textContent = "Tu carta ya no está en el mazo. La saqué yo.";
        if (resetBtn) resetBtn.hidden = false;
        goBtn.hidden = true;
      }, espera);
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      pintarCartas(CARTAS_INICIO);
      if (msgEl) msgEl.textContent = "Elegí una carta mentalmente.";
      resetBtn.hidden = true;
      goBtn.hidden = false;
      goBtn.disabled = false;
      goBtn.focus();
    });
  }

  /* ---------- Movimiento ---------- */
  function revelar(els, stagger) {
    els.forEach((el, i) => {
      gsap.to(el, {
        opacity: 1, y: 0, filter: "blur(0px)", duration: .85, ease: "power3.out",
        delay: stagger ? Math.min(i, 8) * 0.06 : 0,
        scrollTrigger: { trigger: el, start: "top 88%" },
      });
    });
  }

  function heroEntrada() {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" }, delay: .1 });
    tl.to(".hero .eyebrow", { opacity: 1, y: 0, duration: .7 }, 0)
      .to(".hero-title .l", { opacity: 1, y: 0, duration: .95, stagger: .11 }, .08)
      .to(".hero-sub", { opacity: 1, y: 0, duration: .8 }, .55)
      .to(".hero-cta", { opacity: 1, y: 0, duration: .8 }, .7);
  }

  function parallaxHero() {
    const escena = document.getElementById("heroScene");
    if (!escena || reduced || !window.matchMedia("(pointer:fine)").matches) return;
    const capas = [...escena.querySelectorAll(".layer")];
    escena.addEventListener("pointermove", e => {
      const r = escena.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width / 2) / r.width;
      const dy = (e.clientY - r.top - r.height / 2) / r.height;
      capas.forEach(l => {
        const d = parseFloat(l.dataset.depth || 1) * 8;
        l.style.translate = `${(dx * d).toFixed(1)}px ${(dy * d).toFixed(1)}px`;
      });
    });
    escena.addEventListener("pointerleave", () => capas.forEach(l => { l.style.translate = ""; }));
  }

  if (hasST && !reduced) {
    heroEntrada();
    parallaxHero();
    revelar(gsap.utils.toArray("[data-animate]").filter(el => !el.closest(".hero")));
    revelar(gsap.utils.toArray(".paso"), true);
    if (chico || !track) {
      luzEncendida();
    } else {
      alumbrar(0);
      ScrollTrigger.create({ trigger: track, start: "top top", end: "bottom bottom", scrub: .55, onUpdate: self => alumbrar(self.progress) });
    }
    window.addEventListener("load", () => ScrollTrigger.refresh());
  } else {
    document.querySelectorAll("[data-animate]").forEach(el => { el.style.opacity = 1; el.style.transform = "none"; el.style.filter = "none"; });
    luzEncendida();
  }

  setTimeout(() => {
    if (!cards.length) return;
    const alguna = cards.some(c => c.classList.contains("on"));
    if (!alguna) luzEncendida();
  }, 2500);

  /* ---------- Nav mobile ---------- */
  const toggle = document.getElementById("navToggle");
  const mnav = document.getElementById("mobileNav");
  if (toggle && mnav) {
    let bd = document.querySelector(".nav-backdrop");
    if (!bd) { bd = document.createElement("div"); bd.className = "nav-backdrop"; document.body.appendChild(bd); }
    const abrir = () => { mnav.classList.add("open"); bd.classList.add("open"); mnav.removeAttribute("inert"); toggle.setAttribute("aria-expanded", "true"); toggle.setAttribute("aria-label", "Cerrar menú"); document.body.classList.add("no-scroll"); };
    const cerrar = () => { mnav.classList.remove("open"); bd.classList.remove("open"); mnav.setAttribute("inert", ""); toggle.setAttribute("aria-expanded", "false"); toggle.setAttribute("aria-label", "Abrir menú"); document.body.classList.remove("no-scroll"); };
    toggle.addEventListener("click", () => (mnav.classList.contains("open") ? cerrar() : abrir()));
    bd.addEventListener("click", cerrar);
    mnav.querySelectorAll("a").forEach(a => a.addEventListener("click", cerrar));
    document.addEventListener("keydown", e => { if (e.key === "Escape" && mnav.classList.contains("open")) { cerrar(); toggle.focus(); } });
  }

  /* ---------- WhatsApp flotante ---------- */
  const wsp = document.getElementById("wsp-float");
  if (wsp) window.addEventListener("scroll", () => { wsp.classList.toggle("visible", window.scrollY > 600); }, { passive: true });

  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  /* ---------- Anti-copia ---------- */
  document.addEventListener("contextmenu", e => e.preventDefault());
  document.addEventListener("dragstart", e => e.preventDefault());
  document.addEventListener("keydown", e => {
    const k = e.key.toLowerCase();
    if (k === "f12" || (e.ctrlKey && e.shiftKey && ["i", "j", "c"].includes(k)) || (e.ctrlKey && k === "u")) e.preventDefault();
  });
  (function initDevToolsGuard() {
    let overlay = null, open = false;
    setInterval(() => {
      const isOpen = window.outerWidth - window.innerWidth > 200 || window.outerHeight - window.innerHeight > 200;
      if (isOpen === open) return;
      open = isOpen;
      if (open) {
        if (!overlay) { overlay = document.createElement("div"); overlay.className = "devtools-overlay"; overlay.innerHTML = "<p>Contenido protegido.</p>"; document.body.appendChild(overlay); }
        overlay.classList.add("visible");
      } else if (overlay) overlay.classList.remove("visible");
    }, 800);
  })();
})();
