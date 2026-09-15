(function () {
  "use strict";
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasGsap = typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined";
  if (hasGsap) gsap.registerPlugin(ScrollTrigger);

  var frame = document.getElementById("hero-bg");
  var scrim = document.querySelector(".tunnel-scrim");
  var tunnel = document.querySelector(".tunnel");
  var beats = Array.prototype.slice.call(document.querySelectorAll(".beat"));

  function postFrame(msg) {
    if (frame && frame.contentWindow) { try { frame.contentWindow.postMessage(msg, "*"); } catch (e) {} }
  }
  function showAllAnimated() {
    document.querySelectorAll("[data-animate]").forEach(function (el) { el.style.opacity = 1; el.style.transform = "none"; });
  }

  // ===== HERO TÚNEL =====
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

    // Parallax leve de las imágenes flotantes
    document.querySelectorAll(".beat-float").forEach(function (img) {
      gsap.to(img, { yPercent: -18, ease: "none",
        scrollTrigger: { trigger: tunnel, start: "top top", end: "bottom bottom", scrub: 0.8 } });
    });
  } else {
    // Fallback: sin túnel. Fondo apagado, beats en flujo normal, todo visible.
    if (frame) frame.classList.add("hide");
    if (scrim) scrim.classList.add("hide");
  }

  // ===== REVEALS DEL CUERPO =====
  if (!hasGsap || reduced) {
    showAllAnimated();
  } else {
    document.querySelectorAll("[data-animate]").forEach(function (el) {
      gsap.to(el, { y: 0, opacity: 1, duration: .95, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%" } });
    });
    gsap.to(".lectura-card", { y: 0, opacity: 1, duration: .9, ease: "power3.out", stagger: .14,
      scrollTrigger: { trigger: ".lecturas-grid", start: "top 82%" } });
    window.addEventListener("load", function () { ScrollTrigger.refresh(); });
  }

  // ===== NAV MOBILE =====
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
    if (e.key === "Escape") closeNav();
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

  // ===== SMOOTH ANCHOR SCROLL =====
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

  // ===== WHATSAPP FLOAT =====
  var wsp = document.getElementById("wsp-float");
  if (wsp) {
    window.addEventListener("scroll", function () {
      if (window.scrollY > 600) wsp.classList.add("visible"); else wsp.classList.remove("visible");
    }, { passive: true });
  }
})();
