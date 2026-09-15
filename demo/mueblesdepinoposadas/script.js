/* Muebles de pino Posadas — render, filtros, ambientes, mapa y movimiento. Usa data.js. */
/* global PRODUCTOS, CATEGORIAS, WSP, setInterval */
(function () {
  "use strict";
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasST = typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined";
  if (hasST) gsap.registerPlugin(ScrollTrigger);

  const esc = s => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  const norm = s => String(s ?? "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const catLabel = id => (CATEGORIAS.find(c => c.id === id)?.label) || "";
  const waLink = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
  const WSP_SVG = '<svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16 0C7.2 0 0 7.2 0 16c0 2.8.7 5.5 2.1 7.9L0 32l8.3-2.2A16 16 0 1 0 16 0zm0 29.3c-2.4 0-4.7-.6-6.7-1.8l-.5-.3-5 1.3 1.3-4.8-.3-.5A13.2 13.2 0 1 1 16 29.3zm7.3-9.9c-.4-.2-2.4-1.2-2.7-1.3-.4-.1-.6-.2-.9.2s-1 1.3-1.2 1.5c-.2.2-.4.3-.8.1-2.4-1.2-4-2.1-5.5-4.7-.4-.7.4-.7 1.2-2.2.1-.3.1-.5 0-.7l-1.2-2.9c-.3-.7-.6-.6-.9-.6h-.7c-.3 0-.7.1-1 .5-.4.4-1.3 1.3-1.3 3.1s1.3 3.6 1.5 3.9c.2.3 2.6 4 6.4 5.6 2.4 1 3.3 1.1 4.5.9.7-.1 2.4-1 2.7-1.9.3-1 .3-1.7.2-1.9-.1-.2-.4-.3-.8-.4z"/></svg>';

  /* ---------- Render productos ---------- */
  const grid = document.getElementById("prodGrid");
  const chips = document.getElementById("chipsCat");
  const buscar = document.getElementById("buscar");
  const prodCount = document.getElementById("prodCount");
  const st = { cat: "", q: "" };

  if (chips) chips.innerHTML = '<button class="chip on" type="button" data-cat="">Todos</button>' + CATEGORIAS.map(c => `<button class="chip" type="button" data-cat="${c.id}">${esc(c.label)}</button>`).join("");

  function filtrar() {
    const nq = norm(st.q);
    return PRODUCTOS.filter(p => {
      if (st.cat && p.categoria !== st.cat) return false;
      if (nq && !norm([p.nombre, p.desc, catLabel(p.categoria)].join(" ")).includes(nq)) return false;
      return true;
    });
  }
  function cardHTML(p) {
    const badge = p.destacado ? '<span class="prod-badge">Más pedido</span>' : "";
    const msg = `Hola! Me interesa la ${p.nombre}, ¿me pasás precio y medidas?`;
    return `<article class="prod" data-animate style="opacity:0;transform:translateY(28px)">
      <div class="prod-media">${badge}<span class="prod-cat">${esc(catLabel(p.categoria))}</span><img src="${esc(p.img)}" alt="${esc(p.nombre)} de pino" width="600" height="450" loading="lazy" decoding="async"></div>
      <div class="prod-body"><h3>${esc(p.nombre)}</h3><p class="prod-desc">${esc(p.desc)}</p>
        <a class="prod-consultar" href="${esc(waLink(msg))}" target="_blank" rel="noopener noreferrer">${WSP_SVG} Consultar por WhatsApp</a>
      </div></article>`;
  }
  function renderProds(doReveal) {
    if (!grid) return;
    const res = filtrar();
    if (prodCount) prodCount.textContent = res.length + (res.length === 1 ? " producto" : " productos");
    if (!res.length) {
      grid.innerHTML = '<div class="empty"><h3>No encontramos eso 🤔</h3><button class="btn btn-line" type="button" id="clearF">Ver todo el catálogo</button></div>';
      grid.querySelector("#clearF").addEventListener("click", () => { st.cat = ""; st.q = ""; if (buscar) buscar.value = ""; syncChips(); renderProds(true); });
      return;
    }
    grid.innerHTML = res.map(cardHTML).join("");
    const cards = grid.querySelectorAll("[data-animate]");
    if (hasST && !reduced && doReveal !== false) revealEls(cards, true);
    else cards.forEach(c => { c.style.opacity = 1; c.style.transform = "none"; });
    if (hasST) ScrollTrigger.refresh();
  }
  function syncChips() { chips && chips.querySelectorAll(".chip").forEach(c => c.classList.toggle("on", (c.dataset.cat || "") === st.cat)); }
  if (chips) chips.addEventListener("click", e => { const b = e.target.closest(".chip"); if (!b) return; st.cat = b.dataset.cat || ""; syncChips(); renderProds(true); });
  if (buscar) buscar.addEventListener("input", () => { st.q = buscar.value; renderProds(true); });

  /* ---------- Ambientes → filtran el catálogo ---------- */
  document.querySelectorAll(".amb-link").forEach(b => b.addEventListener("click", () => {
    st.cat = b.dataset.cat || ""; if (buscar) buscar.value = ""; st.q = "";
    syncChips(); renderProds(true);
    document.getElementById("productos")?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
  }));

  /* ---------- Ambientes sticky (crossfade) ---------- */
  const ambImgs = document.querySelectorAll(".amb-img");
  const ambSteps = document.querySelectorAll(".amb-step");
  if (ambSteps.length && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(ents => {
      ents.forEach(e => {
        if (!e.isIntersecting) return;
        const amb = e.target.dataset.amb;
        ambImgs.forEach(im => im.classList.toggle("is-active", im.dataset.amb === amb));
        ambSteps.forEach(s => s.classList.toggle("is-active", s === e.target));
      });
    }, { threshold: 0.5, rootMargin: "-15% 0px -35% 0px" });
    ambSteps.forEach(s => io.observe(s));
  }

  /* ---------- Movimiento ---------- */
  function revealEls(els, stagger) {
    els.forEach((el, i) => {
      gsap.to(el, { opacity: 1, y: 0, duration: .8, ease: "power3.out", delay: stagger ? Math.min(i, 10) * 0.05 : 0, scrollTrigger: { trigger: el, start: "top 90%" } });
    });
  }
  function setupHero() {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" }, delay: 0.1 });
    tl.to(".hero .eyebrow", { opacity: 1, y: 0, duration: .7 }, 0)
      .to(".hero-title", { opacity: 1, y: 0, duration: .9 }, .1)
      .to(".hero-sub", { opacity: 1, y: 0, duration: .8 }, .4)
      .to(".hero-cta", { opacity: 1, y: 0, duration: .8 }, .55);
  }

  if (hasST && !reduced) {
    setupHero();
    revealEls(gsap.utils.toArray("[data-animate]").filter(el => !el.closest(".hero") && !el.closest("#prodGrid")));
    const big = document.querySelector(".medida-big span");
    if (big) gsap.fromTo(big, { xPercent: 6 }, { xPercent: -14, ease: "none", scrollTrigger: { trigger: ".medida", start: "top bottom", end: "bottom top", scrub: .6 } });
    renderProds(true);
    window.addEventListener("load", () => ScrollTrigger.refresh());
  } else {
    renderProds(false);
    document.querySelectorAll("[data-animate]").forEach(el => { el.style.opacity = 1; el.style.transform = "none"; });
  }

  /* ---------- Mapa (Garupá) ---------- */
  const mapEl = document.getElementById("map");
  if (mapEl && typeof L !== "undefined") {
    try {
      const map = L.map("map", { scrollWheelZoom: false, attributionControl: true }).setView([-27.4847, -55.8319], 13);
      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", { attribution: "&copy; OpenStreetMap &copy; CARTO", maxZoom: 19 }).addTo(map);
      L.circleMarker([-27.4847, -55.8319], { radius: 11, color: "#4a6b3f", weight: 3, fillColor: "#6f8b60", fillOpacity: .85 }).addTo(map).bindPopup("Muebles de pino Posadas · Garupá, Misiones");
    } catch { mapEl.style.display = "none"; }
  }

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
