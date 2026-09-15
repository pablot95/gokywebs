(function () {
  "use strict";
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasGsap = typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined";
  if (hasGsap) gsap.registerPlugin(ScrollTrigger);
  var WA = "5492644153979";
  var STORE_KEY = "viko_pedido_v2";

  var frame = document.getElementById("hero-bg");
  var scrim = document.querySelector(".tunnel-scrim");
  var tunnel = document.querySelector(".tunnel");
  var beats = Array.prototype.slice.call(document.querySelectorAll(".beat"));

  function postFrame(msg) {
    if (frame && frame.contentWindow) { try { frame.contentWindow.postMessage(msg, "*"); } catch (e) {} }
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[c];
    });
  }
  function money(n) { return "$" + Number(n || 0).toLocaleString("es-AR"); }
  function showToast(msg) {
    var wrap = document.querySelector(".toast-wrap");
    if (!wrap) { wrap = document.createElement("div"); wrap.className = "toast-wrap"; wrap.setAttribute("aria-live", "polite"); document.body.appendChild(wrap); }
    var toast = document.createElement("div");
    toast.className = "toast";
    toast.setAttribute("role", "status");
    toast.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg><span>' + esc(msg) + "</span>";
    wrap.appendChild(toast);
    setTimeout(function () { toast.classList.add("hiding"); setTimeout(function () { toast.remove(); }, 220); }, 2800);
  }

  /* ===== HERO TÚNEL ===== */
  if (hasGsap && !reduced && tunnel && beats.length) {
    tunnel.classList.add("is-tunnel");
    var n = beats.length;
    var step = 1 / n;
    gsap.set(beats, { scale: 0.52, autoAlpha: 0, transformOrigin: "50% 50%" });
    gsap.set(beats[0], { scale: 1, autoAlpha: 1 });

    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: tunnel, start: "top top", end: "bottom bottom", scrub: 0.6,
        onUpdate: function (self) { postFrame({ type: "hero-progress", progress: self.progress }); },
        onToggle: function (self) {
          var active = self.isActive;
          postFrame({ type: "hero-active", active: active });
          if (frame) frame.classList.toggle("hide", !active);
          if (scrim) scrim.classList.toggle("hide", !active);
        }
      }
    });

    for (var i = 0; i < n; i++) {
      var s = i * step;
      if (i === 0) {
        tl.to(beats[0], { scale: 1.5, autoAlpha: 0, ease: "power1.in", duration: step * 0.6 }, s + step * 0.35);
      } else {
        tl.fromTo(beats[i], { scale: 0.52, autoAlpha: 0 },
          { scale: 1, autoAlpha: 1, ease: "power2.out", duration: step * 0.4 }, s - step * 0.15);
        if (i < n - 1) {
          tl.to(beats[i], { scale: 1.5, autoAlpha: 0, ease: "power1.in", duration: step * 0.5 }, s + step * 0.55);
        }
      }
    }
  } else {
    if (frame) frame.classList.add("hide");
    if (scrim) scrim.classList.add("hide");
  }

  /* ===== REVEALS ===== */
  var animated = Array.prototype.slice.call(document.querySelectorAll("[data-animate]"));
  animated.forEach(function (el) {
    var parent = el.parentElement;
    if (!parent) return;
    var sibs = Array.prototype.slice.call(parent.querySelectorAll(":scope > [data-animate]"));
    var idx = sibs.indexOf(el);
    if (idx > 0) el.style.transitionDelay = (idx * 0.09).toFixed(2) + "s";
  });
  if (reduced || !("IntersectionObserver" in window)) {
    animated.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    animated.forEach(function (el) { io.observe(el); });
  }
  if (hasGsap) window.addEventListener("load", function () { ScrollTrigger.refresh(); });

  /* ===== FILTROS + BUSCADOR ===== */
  var cards = Array.prototype.slice.call(document.querySelectorAll(".prod-card"));
  var chips = Array.prototype.slice.call(document.querySelectorAll(".chip"));
  var search = document.getElementById("catSearch");
  var empty = document.getElementById("catEmpty");
  var catActual = "todo";

  function normalizar(s) {
    return String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  }
  function aplicarFiltros() {
    var q = normalizar(search ? search.value.trim() : "");
    var visibles = 0;
    cards.forEach(function (card) {
      var cat = card.dataset.cat || "";
      var nombre = normalizar(card.dataset.nombre);
      var okCat = catActual === "todo" || cat === catActual;
      var okQ = !q || nombre.indexOf(q) !== -1 || normalizar(cat).indexOf(q) !== -1;
      var ver = okCat && okQ;
      card.hidden = !ver;
      if (ver) visibles++;
    });
    if (empty) empty.hidden = visibles > 0;
    if (hasGsap && typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
  }
  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      chips.forEach(function (c) { c.classList.remove("active"); });
      chip.classList.add("active");
      catActual = chip.dataset.cat || "todo";
      aplicarFiltros();
    });
  });
  if (search) search.addEventListener("input", aplicarFiltros);

  /* ===== PEDIDO ===== */
  var pedido = [];
  try { pedido = JSON.parse(localStorage.getItem(STORE_KEY)) || []; } catch (_) { pedido = []; }
  if (!Array.isArray(pedido)) pedido = [];

  var bar = document.getElementById("pedidoBar");
  var listaEl = document.getElementById("pedidoLista");
  var countEl = document.getElementById("pedidoCount");
  var totalEl = document.getElementById("pedidoTotal");
  var toggleBtn = document.getElementById("pedidoToggle");
  var sendBtn = document.getElementById("pedidoSend");

  function guardar() { try { localStorage.setItem(STORE_KEY, JSON.stringify(pedido)); } catch (_) {} }
  function totalPedido() { return pedido.reduce(function (a, it) { return a + it.precio * it.qty; }, 0); }
  function cantidadPedido() { return pedido.reduce(function (a, it) { return a + it.qty; }, 0); }
  function renderPedido() {
    if (!bar) return;
    bar.hidden = pedido.length === 0;
    if (countEl) countEl.textContent = cantidadPedido();
    if (totalEl) totalEl.textContent = money(totalPedido());
    if (!listaEl) return;
    listaEl.innerHTML = pedido.map(function (it, idx) {
      return '<li class="pedido-item">' +
        '<div class="pedido-item-info">' +
          '<span class="pedido-item-nombre">' + esc(it.nombre) + '</span>' +
          '<span class="pedido-item-meta">Talle ' + esc(it.talle) + ' · ' + money(it.precio) + '</span>' +
        '</div>' +
        '<div class="pedido-item-qty">' +
          '<button type="button" class="pedido-qty-btn" data-act="menos" data-i="' + idx + '" aria-label="Quitar una unidad">−</button>' +
          '<span>' + it.qty + '</span>' +
          '<button type="button" class="pedido-qty-btn" data-act="mas" data-i="' + idx + '" aria-label="Agregar una unidad">+</button>' +
          '<button type="button" class="pedido-item-del" data-act="borrar" data-i="' + idx + '" aria-label="Sacar del pedido">&times;</button>' +
        '</div>' +
      '</li>';
    }).join("");
    guardar();
  }

  cards.forEach(function (card) {
    var btn = card.querySelector(".btn-add");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var nombre = card.dataset.nombre || "";
      var precio = parseInt(card.dataset.precio, 10) || 0;
      var sel = card.querySelector(".prod-talle");
      var talle = sel ? sel.value : "Único";
      var existente = pedido.filter(function (it) { return it.nombre === nombre && it.talle === talle; })[0];
      if (existente) existente.qty += 1;
      else pedido.push({ nombre: nombre, precio: precio, talle: talle, qty: 1 });
      renderPedido();
      btn.classList.add("added");
      btn.textContent = "¡Sumado!";
      setTimeout(function () { btn.classList.remove("added"); btn.textContent = "Sumar al pedido"; }, 1400);
      showToast(nombre + " (talle " + talle + ") va en tu pedido");
    });
  });

  if (listaEl) {
    listaEl.addEventListener("click", function (e) {
      var b = e.target.closest("[data-act]");
      if (!b) return;
      var i = parseInt(b.dataset.i, 10);
      var it = pedido[i];
      if (!it) return;
      if (b.dataset.act === "mas") it.qty += 1;
      else if (b.dataset.act === "menos") { it.qty -= 1; if (it.qty <= 0) pedido.splice(i, 1); }
      else if (b.dataset.act === "borrar") pedido.splice(i, 1);
      renderPedido();
      if (pedido.length === 0 && toggleBtn) toggleBtn.setAttribute("aria-expanded", "false");
    });
  }

  if (toggleBtn && listaEl) {
    toggleBtn.addEventListener("click", function () {
      var abierto = toggleBtn.getAttribute("aria-expanded") === "true";
      toggleBtn.setAttribute("aria-expanded", abierto ? "false" : "true");
      listaEl.hidden = abierto;
    });
  }

  if (sendBtn) {
    sendBtn.addEventListener("click", function () {
      if (!pedido.length) { showToast("Sumá alguna prenda antes de enviar el pedido."); return; }
      var lines = ["Hola Tiendaviko, quiero hacer este pedido:", ""];
      pedido.forEach(function (it) {
        lines.push(it.qty + "x " + it.nombre + " (talle " + it.talle + ") - " + money(it.precio));
      });
      lines.push("");
      lines.push("Total aproximado: " + money(totalPedido()));
      var url = "https://wa.me/" + WA + "?text=" + encodeURIComponent(lines.join("\n"));
      window.open(url, "_blank", "noopener");
    });
  }

  renderPedido();

  /* ===== NAV MOBILE ===== */
  var toggle = document.getElementById("nav-toggle");
  var nav = document.getElementById("nav-mobile");
  var closeBtn = document.getElementById("nav-mobile-close");
  var lastFocus = null;

  function openNav() {
    lastFocus = document.activeElement;
    nav.hidden = false;
    requestAnimationFrame(function () { nav.classList.add("open"); });
    toggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
    closeBtn.focus();
    document.addEventListener("keydown", onKey);
  }
  function closeNav() {
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    setTimeout(function () { nav.hidden = true; }, 400);
    document.removeEventListener("keydown", onKey);
    if (lastFocus) lastFocus.focus();
  }
  function onKey(e) {
    if (e.key === "Escape") { closeNav(); return; }
    if (e.key === "Tab") {
      var f = nav.querySelectorAll("a[href],button");
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { last.focus(); e.preventDefault(); }
      else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); }
    }
  }
  if (toggle) toggle.addEventListener("click", openNav);
  if (closeBtn) closeBtn.addEventListener("click", closeNav);

  /* ===== SMOOTH ANCHOR ===== */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      var id = link.getAttribute("href");
      if (id === "#" || id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      if (nav && nav.classList.contains("open")) closeNav();
      target.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    });
  });

  /* ===== WHATSAPP FLOTANTE ===== */
  var wsp = document.getElementById("wsp-float");
  if (wsp) {
    window.addEventListener("scroll", function () {
      if (window.scrollY > 600) wsp.classList.add("visible"); else wsp.classList.remove("visible");
    }, { passive: true });
  }
})();
