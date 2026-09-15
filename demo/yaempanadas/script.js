/* Ya EMPANADAS — landing de un solo curso en PDF. Usa data.js. */
/* global CURSO, MODULOS, RECETAS, WSP, setInterval */
(function () {
  "use strict";
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasST = typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined";
  if (hasST) gsap.registerPlugin(ScrollTrigger);

  const esc = s => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  const formatearPrecio = n => "$" + Math.round(n).toLocaleString("es-AR");

  /* ---------- Precio y CTA de compra (oferta única, cierre por WhatsApp) ---------- */
  const precio = formatearPrecio(CURSO.precio);
  document.querySelectorAll("#heroPrecio, #compraPrecio").forEach(el => { el.textContent = precio; });

  const mensajeCompra = [
    "Hola Ya Empanadas! Quiero comprar el curso:",
    `• ${CURSO.nombre} — ${precio}`,
    `${CURSO.paginas} páginas en ${CURSO.formato}`,
    "",
    "Mi email para recibirlo es: ",
  ].join("\n");
  const linkCompra = `https://wa.me/${WSP}?text=${encodeURIComponent(mensajeCompra)}`;
  document.querySelectorAll("#btnComprar, #btnComprarCierre").forEach(a => { a.href = linkCompra; });

  /* ---------- Las 12 recetas ---------- */
  const recetasList = document.getElementById("recetasList");
  if (recetasList) recetasList.innerHTML = RECETAS.map(r => `<li>${esc(r)}</li>`).join("");

  /* ---------- FIRMA: el PDF que se hojea ----------
     Cada módulo es una página del PDF. Al scrollear, la página de arriba se pasa
     y descubre la siguiente, mientras el índice de la izquierda marca dónde estás. */
  const book = document.getElementById("pdfBook");
  const indexEl = document.getElementById("pdfIndex");
  const pagEl = document.getElementById("pdfPag");
  const barEl = document.getElementById("pdfBar");
  const track = document.getElementById("pdfTrack");
  const N = MODULOS.length;

  if (book) {
    book.innerHTML = MODULOS.map((m, i) => `
      <article class="pdf-page" data-i="${i}" style="z-index:${N - i}">
        <header class="pdf-page-head">
          <span class="pdf-page-n">Módulo ${esc(m.n)}</span>
          <h3>${esc(m.titulo)}</h3>
        </header>
        <div class="pdf-page-body">
          <img src="${esc(m.img)}" alt="${esc(m.alt)}" width="440" height="330" loading="lazy" decoding="async">
          <div class="pdf-page-text">
            <p>${esc(m.resumen)}</p>
            <ul>${m.puntos.map(p => `<li>${esc(p)}</li>`).join("")}</ul>
          </div>
        </div>
        <footer class="pdf-page-foot"><span>${esc(CURSO.nombre)}</span><span>pág. ${m.desde}–${m.desde + m.paginas - 1}</span></footer>
      </article>`).join("");
  }
  if (indexEl) {
    indexEl.innerHTML = MODULOS.map((m, i) => `<li data-i="${i}"><b>${esc(m.n)}</b><span>${esc(m.titulo)}</span><em>${m.paginas} pág.</em></li>`).join("");
  }

  const pages = book ? [...book.querySelectorAll(".pdf-page")] : [];
  const items = indexEl ? [...indexEl.querySelectorAll("li")] : [];

  function pintarPDF(p) {
    const avance = p * N;
    pages.forEach((page, i) => {
      const local = Math.min(1, Math.max(0, avance - i));
      const eased = local * local * (3 - 2 * local);
      page.style.transform = `translate3d(${(-eased * 62).toFixed(2)}%, ${(-eased * 6).toFixed(2)}%, 0) rotate(${(-eased * 9).toFixed(2)}deg)`;
      page.style.opacity = (1 - eased * 0.92).toFixed(3);
    });
    const activo = Math.min(N - 1, Math.floor(avance));
    items.forEach((li, i) => li.classList.toggle("on", i === activo));
    if (pagEl) pagEl.textContent = Math.max(1, Math.round(p * CURSO.paginas));
    if (barEl) barEl.style.transform = `scaleX(${Math.max(0.02, p).toFixed(3)})`;
  }

  function pdfEstatico() {
    if (book) book.classList.add("is-static");
    pages.forEach(page => { page.style.transform = ""; page.style.opacity = ""; });
    items.forEach(li => li.classList.add("on"));
    if (pagEl) pagEl.textContent = CURSO.paginas;
    if (barEl) barEl.style.transform = "scaleX(1)";
  }

  /* ---------- Movimiento ---------- */
  function revealEls(els, stagger) {
    els.forEach((el, i) => {
      gsap.to(el, { opacity: 1, y: 0, duration: .75, ease: "power3.out", delay: stagger ? Math.min(i, 10) * 0.05 : 0, scrollTrigger: { trigger: el, start: "top 90%" } });
    });
  }
  function setupHero() {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" }, delay: 0.1 });
    tl.to(".hero .eyebrow", { opacity: 1, y: 0, duration: .7 }, 0)
      .to(".hero-title .line", { opacity: 1, y: 0, duration: .9, stagger: .12 }, .1)
      .to(".hero-sub", { opacity: 1, y: 0, duration: .8 }, .5)
      .to(".hero-cta", { opacity: 1, y: 0, duration: .8 }, .65)
      .to(".hero-nota", { opacity: 1, y: 0, duration: .8 }, .78);
  }

  const chico = window.matchMedia("(max-width: 900px)").matches;

  if (hasST && !reduced) {
    setupHero();
    revealEls(gsap.utils.toArray("[data-animate]").filter(el => !el.closest(".hero")));
    if (chico || !track) {
      pdfEstatico();
    } else {
      pintarPDF(0);
      ScrollTrigger.create({ trigger: track, start: "top top", end: "bottom bottom", scrub: .5, onUpdate: self => pintarPDF(self.progress) });
    }
    window.addEventListener("load", () => ScrollTrigger.refresh());
  } else {
    document.querySelectorAll("[data-animate]").forEach(el => { el.style.opacity = 1; el.style.transform = "none"; });
    pdfEstatico();
  }

  /* Failsafe: si algo falla y las páginas quedaron invisibles, mostrarlas. */
  setTimeout(() => {
    if (!pages.length) return;
    const visibles = pages.some(p => parseFloat(window.getComputedStyle(p).opacity) > 0.1);
    if (!visibles) pdfEstatico();
  }, 2500);

  /* ---------- Nav mobile ---------- */
  const toggle = document.getElementById("navToggle");
  const mnav = document.getElementById("mobileNav");
  if (toggle && mnav) {
    let bd = document.querySelector(".nav-backdrop");
    if (!bd) { bd = document.createElement("div"); bd.className = "nav-backdrop"; document.body.appendChild(bd); }
    const openNav = () => { mnav.classList.add("open"); bd.classList.add("open"); mnav.removeAttribute("inert"); toggle.setAttribute("aria-expanded", "true"); document.body.classList.add("no-scroll"); };
    const closeNav = () => { mnav.classList.remove("open"); bd.classList.remove("open"); mnav.setAttribute("inert", ""); toggle.setAttribute("aria-expanded", "false"); document.body.classList.remove("no-scroll"); };
    toggle.addEventListener("click", () => (mnav.classList.contains("open") ? closeNav() : openNav()));
    bd.addEventListener("click", closeNav);
    mnav.querySelectorAll("a").forEach(a => a.addEventListener("click", closeNav));
    document.addEventListener("keydown", e => { if (e.key === "Escape" && mnav.classList.contains("open")) closeNav(); });
  }

  /* ---------- WhatsApp float ---------- */
  const wsp = document.getElementById("wsp-float");
  if (wsp) window.addEventListener("scroll", () => { wsp.classList.toggle("visible", window.scrollY > 600); }, { passive: true });

  const y = document.getElementById("year"); if (y) y.textContent = new Date().getFullYear();

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
      if (open) { if (!overlay) { overlay = document.createElement("div"); overlay.className = "devtools-overlay"; overlay.innerHTML = "<p>Contenido protegido.</p>"; document.body.appendChild(overlay); } overlay.classList.add("visible"); }
      else if (overlay) overlay.classList.remove("visible");
    }, 800);
  })();
})();
