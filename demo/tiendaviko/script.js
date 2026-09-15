(function () {
  "use strict";
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasGsap = typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined";
  var hasFlip = hasGsap && typeof Flip !== "undefined";
  if (hasGsap) gsap.registerPlugin(ScrollTrigger);
  if (hasFlip) gsap.registerPlugin(Flip);
  var WA = "5492644153979";
  var STORE_KEY = "viko_pedido_v4";

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[c];
    });
  }
  function money(n) { return "$" + Number(n || 0).toLocaleString("es-AR"); }
  function showToast(msg) {
    var wrap = document.querySelector(".toast-wrap");
    if (!wrap) { wrap = document.createElement("div"); wrap.className = "toast-wrap"; wrap.setAttribute("aria-live", "polite"); document.body.appendChild(wrap); }
    var t = document.createElement("div");
    t.className = "toast"; t.setAttribute("role", "status");
    t.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg><span>' + esc(msg) + "</span>";
    wrap.appendChild(t);
    setTimeout(function () { t.classList.add("hiding"); setTimeout(function () { t.remove(); }, 220); }, 2800);
  }

  /* ============ MOVIMIENTO (con guards) ============ */
  function showStatic() {
    document.querySelectorAll("[data-animate]").forEach(function (el) { el.style.opacity = 1; el.style.transform = "none"; el.style.clipPath = "none"; });
    document.querySelectorAll("[data-animate-stagger]").forEach(function (c) {
      Array.prototype.forEach.call(c.children, function (el) { el.style.opacity = 1; el.style.transform = "none"; });
    });
  }
  if (!hasGsap || reduced) {
    showStatic();
  } else {
    var presets = {
      up:   { y: 0, opacity: 1, duration: .9 },
      clip: { clipPath: "inset(0 0 0% 0)", opacity: 1, duration: 1.1 }
    };
    document.querySelectorAll("[data-animate]").forEach(function (el) {
      var p = presets[el.dataset.animate || "up"] || presets.up;
      gsap.to(el, Object.assign({}, p, { ease: "expo.out", delay: parseFloat(el.dataset.delay || 0),
        scrollTrigger: { trigger: el, start: "top 86%", once: true } }));
    });
    document.querySelectorAll("[data-animate-stagger]").forEach(function (c) {
      gsap.to(c.children, { y: 0, opacity: 1, duration: .9, ease: "expo.out", stagger: .14,
        scrollTrigger: { trigger: c, start: "top 84%", once: true } });
    });

    /* ---- Magnetic buttons ---- */
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      document.querySelectorAll(".magnetic").forEach(function (btn) {
        btn.addEventListener("mousemove", function (e) {
          var r = btn.getBoundingClientRect();
          gsap.to(btn, { x: (e.clientX - r.left - r.width / 2) * .22, y: (e.clientY - r.top - r.height / 2) * .3, duration: .3 });
        });
        btn.addEventListener("mouseleave", function () { gsap.to(btn, { x: 0, y: 0, duration: .5, ease: "elastic.out(1, .5)" }); });
      });
    }

    window.addEventListener("load", function () { ScrollTrigger.refresh(); });
  }

  /* ---- Glow que sigue el cursor ---- */
  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    document.querySelectorAll(".card-glow").forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty("--mx", (e.clientX - r.left) + "px");
        card.style.setProperty("--my", (e.clientY - r.top) + "px");
      });
    });
  }

  /* ---- Vidriera: la rueda vertical mueve el carrusel en horizontal, pero SOLO con el
         mouse encima (el evento vive en el viewport) y liberando el scroll en los bordes,
         así no traba a quien quiere seguir bajando la página. Touch/trackpad siguen nativos. ---- */
  (function () {
    var vp = document.querySelector(".vidriera-viewport");
    if (!vp) return;
    vp.addEventListener("wheel", function (e) {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;              // ya es un gesto horizontal
      var max = vp.scrollWidth - vp.clientWidth;
      if (max <= 1) return;                                            // no hay recorrido horizontal
      var atStart = vp.scrollLeft <= 0, atEnd = vp.scrollLeft >= max - 1;
      if ((e.deltaY < 0 && atStart) || (e.deltaY > 0 && atEnd)) return; // en el borde: dejar bajar la página
      e.preventDefault();
      // deltaMode 1 = líneas (Firefox/Windows suele mandar deltaY chico tipo 3): lo
      // escalamos para que un solo "click" de rueda mueva algo perceptible.
      var delta = e.deltaMode === 1 ? e.deltaY * 34 : e.deltaY;
      vp.scrollLeft += delta;
    }, { passive: false });
  })();

  /* ============ CATÁLOGO ============ */
  var cards = Array.prototype.slice.call(document.querySelectorAll(".prod-card"));
  var chips = Array.prototype.slice.call(document.querySelectorAll(".chip"));
  var search = document.getElementById("catSearch");
  var empty = document.getElementById("catEmpty");
  var grid = document.getElementById("prodGrid");
  var catActual = "todo";

  function normalizar(s) {
    return String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  }
  function aplicarFiltros() {
    var q = normalizar(search ? search.value.trim() : "");
    var state = (hasFlip && !reduced && grid) ? Flip.getState(cards) : null;
    var visibles = 0;
    cards.forEach(function (card) {
      var cat = card.dataset.cat || "";
      var nombre = normalizar(card.dataset.nombre);
      var okCat = catActual === "todo" || cat === catActual;
      var okQ = !q || nombre.indexOf(q) !== -1 || normalizar(cat).indexOf(q) !== -1;
      var ver = okCat && okQ;
      card.style.display = ver ? "" : "none";
      if (ver) visibles++;
    });
    if (empty) empty.hidden = visibles > 0;
    if (state) {
      Flip.from(state, { duration: .5, ease: "power2.inOut", stagger: .015, absolute: true,
        onEnter: function (els) { return gsap.fromTo(els, { opacity: 0, scale: .92 }, { opacity: 1, scale: 1, duration: .35 }); },
        onLeave: function (els) { return gsap.to(els, { opacity: 0, scale: .92, duration: .25 }); } });
    }
    if (hasGsap) ScrollTrigger.refresh();
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

  /* ---- Pedido → WhatsApp ---- */
  var pedido = [];
  try { pedido = JSON.parse(localStorage.getItem(STORE_KEY)) || []; } catch (_) { pedido = []; }
  if (!Array.isArray(pedido)) pedido = [];

  var barEl = document.getElementById("pedidoBar");
  var listaEl = document.getElementById("pedidoLista");
  var countEl = document.getElementById("pedidoCount");
  var totalEl = document.getElementById("pedidoTotal");
  var toggleBtn2 = document.getElementById("pedidoToggle");
  var sendBtn = document.getElementById("pedidoSend");

  function guardar() { try { localStorage.setItem(STORE_KEY, JSON.stringify(pedido)); } catch (_) {} }
  function totalPedido() { return pedido.reduce(function (a, it) { return a + it.precio * it.qty; }, 0); }
  function cantidadPedido() { return pedido.reduce(function (a, it) { return a + it.qty; }, 0); }
  function renderPedido() {
    if (!barEl) return;
    barEl.hidden = pedido.length === 0;
    if (countEl) countEl.textContent = cantidadPedido();
    if (totalEl) totalEl.textContent = money(totalPedido());
    if (!listaEl) return;
    listaEl.innerHTML = pedido.map(function (it, idx) {
      return '<li class="pedido-item"><div class="pedido-item-info">' +
        '<span class="pedido-item-nombre">' + esc(it.nombre) + '</span>' +
        '<span class="pedido-item-meta">Talle ' + esc(it.talle) + ' · ' + money(it.precio) + '</span></div>' +
        '<div class="pedido-item-qty">' +
        '<button type="button" class="pedido-qty-btn" data-act="menos" data-i="' + idx + '" aria-label="Quitar una unidad">−</button>' +
        '<span>' + it.qty + '</span>' +
        '<button type="button" class="pedido-qty-btn" data-act="mas" data-i="' + idx + '" aria-label="Agregar una unidad">+</button>' +
        '<button type="button" class="pedido-item-del" data-act="borrar" data-i="' + idx + '" aria-label="Sacar del pedido">&times;</button>' +
        '</div></li>';
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
      var ex = pedido.filter(function (it) { return it.nombre === nombre && it.talle === talle; })[0];
      if (ex) ex.qty += 1; else pedido.push({ nombre: nombre, precio: precio, talle: talle, qty: 1 });
      renderPedido();
      btn.classList.add("added"); btn.textContent = "¡Sumado!";
      setTimeout(function () { btn.classList.remove("added"); btn.textContent = "Sumar al pedido"; }, 1400);
      showToast(nombre + " (talle " + talle + ") va en tu pedido");
    });
  });
  if (listaEl) {
    listaEl.addEventListener("click", function (e) {
      var b = e.target.closest("[data-act]"); if (!b) return;
      var i = parseInt(b.dataset.i, 10), it = pedido[i]; if (!it) return;
      if (b.dataset.act === "mas") it.qty += 1;
      else if (b.dataset.act === "menos") { it.qty -= 1; if (it.qty <= 0) pedido.splice(i, 1); }
      else if (b.dataset.act === "borrar") pedido.splice(i, 1);
      renderPedido();
      if (pedido.length === 0 && toggleBtn2) toggleBtn2.setAttribute("aria-expanded", "false");
    });
  }
  if (toggleBtn2 && listaEl) {
    toggleBtn2.addEventListener("click", function () {
      var abierto = toggleBtn2.getAttribute("aria-expanded") === "true";
      toggleBtn2.setAttribute("aria-expanded", abierto ? "false" : "true");
      listaEl.hidden = abierto;
    });
  }
  if (sendBtn) {
    sendBtn.addEventListener("click", function () {
      if (!pedido.length) { showToast("Sumá alguna prenda antes de enviar el pedido."); return; }
      var lines = ["Hola Tiendaviko, quiero hacer este pedido:", ""];
      pedido.forEach(function (it) { lines.push(it.qty + "x " + it.nombre + " (talle " + it.talle + ") - " + money(it.precio)); });
      lines.push(""); lines.push("Total aproximado: " + money(totalPedido()));
      window.open("https://wa.me/" + WA + "?text=" + encodeURIComponent(lines.join("\n")), "_blank", "noopener");
    });
  }
  renderPedido();

  /* ---- Nav mobile ---- */
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

  /* ---- Smooth anchor ---- */
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

  /* ---- WhatsApp flotante ---- */
  var wsp = document.getElementById("wsp-float");
  if (wsp) {
    window.addEventListener("scroll", function () {
      if (window.scrollY > 600) wsp.classList.add("visible"); else wsp.classList.remove("visible");
    }, { passive: true });
  }
})();
