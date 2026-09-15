/* Alejandra Santillán — Cake Atelier */

/* ---------- hero flag: animado (default) vs clásico (?estilo=clasico) ---------- */
(function () {
  var p = new URLSearchParams(location.search);
  var clasico = p.get('estilo') === 'clasico' || location.hash === '#clasica';
  document.body.dataset.hero = clasico ? 'clasico' : 'animado';
})();

/* ---------- GSAP / Lenis base ---------- */
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}
if (typeof gsap === 'undefined') {
  document.querySelectorAll('[data-animate]').forEach(function (el) { el.style.opacity = 1; el.style.transform = 'none'; });
}
if (typeof Lenis !== 'undefined' && typeof gsap !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  var lenis = new Lenis();
  window.lenis = lenis;
  gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
  gsap.ticker.lagSmoothing(0);
  if (typeof ScrollTrigger !== 'undefined') lenis.on('scroll', ScrollTrigger.update);
}
if (typeof ScrollTrigger !== 'undefined') {
  window.addEventListener('load', function () { ScrollTrigger.refresh(); });
}

function esc(s) {
  return String(s).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

/* ---------- mobile menu ---------- */
function initMobileMenu() {
  var toggle = document.getElementById('navToggle');
  var menu = document.getElementById('mobileMenu');
  var closeBtn = document.getElementById('mobileMenuClose');
  if (!toggle || !menu) return;
  function open() {
    menu.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    window.lenis && window.lenis.stop();
    var firstLink = menu.querySelector('a');
    firstLink && firstLink.focus();
  }
  function close() {
    menu.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    window.lenis && window.lenis.start();
    toggle.focus();
  }
  toggle.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  menu.addEventListener('click', function (e) { if (e.target === menu) close(); });
  menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', close); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menu.classList.contains('open')) close();
    if (e.key === 'Tab' && menu.classList.contains('open')) {
      var focusables = menu.querySelectorAll('a, button');
      var first = focusables[0], last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
}

/* ---------- WhatsApp flotante ---------- */
function initWspFloat() {
  var btn = document.getElementById('wsp-float');
  if (!btn) return;
  window.addEventListener('scroll', function () {
    if (window.scrollY > 600) btn.classList.add('visible'); else btn.classList.remove('visible');
  }, { passive: true });
}

/* ---------- scroll progress bar ---------- */
function initScrollProgress() {
  var bar = document.getElementById('scrollProgress');
  if (!bar) return;
  function update() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    bar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
  }
  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* ---------- reveal on scroll ---------- */
function initReveal() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('[data-animate]').forEach(function (el) {
    var type = el.dataset.animate;
    var delay = parseFloat(el.dataset.delay || 0);
    var base = { opacity: 0 };
    var to = { opacity: 1, duration: .9, delay: delay, ease: 'cubic-bezier(.16,1,.3,1)' };
    if (type === 'fade-up') { base.y = 46; to.y = 0; }
    else if (type === 'fade-blur') { base.filter = 'blur(10px)'; to.filter = 'blur(0px)'; }
    else if (type === 'scale-in') { base.scale = .92; to.scale = 1; }
    else if (type === 'fade-left') { base.x = -50; to.x = 0; }
    else if (type === 'fade-right') { base.x = 50; to.x = 0; }
    gsap.set(el, base);
    gsap.to(el, Object.assign(to, {
      scrollTrigger: { trigger: el, start: 'top 85%' }
    }));
  });

  document.querySelectorAll('[data-stagger]').forEach(function (group) {
    var items = group.children;
    gsap.set(items, { opacity: 0, y: 44 });
    gsap.to(items, {
      opacity: 1, y: 0, duration: .8, stagger: .14, ease: 'cubic-bezier(.16,1,.3,1)',
      scrollTrigger: { trigger: group, start: 'top 82%' }
    });
  });
}

/* ---------- hero tunnel (garland) ---------- */
function initHeroTunnel() {
  if (document.body.dataset.hero !== 'animado') return;
  var hero = document.getElementById('hero');
  var iframe = document.getElementById('hero-bg');
  var beats = hero ? hero.querySelectorAll('.beat') : [];
  if (!hero || !beats.length) return;

  if (iframe && iframe.dataset.src) iframe.src = iframe.dataset.src;

  var stage = hero.querySelector('.hero-stage');
  var motionOK = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || !motionOK) {
    beats.forEach(function (b) { b.style.visibility = 'visible'; b.style.opacity = 1; });
    return;
  }

  hero.classList.add('hero--tunnel');
  var n = beats.length;
  var step = 1 / n;

  var tl = gsap.timeline({
    scrollTrigger: {
      trigger: hero, start: 'top top', end: 'bottom bottom', scrub: .6,
      onUpdate: function (self) {
        if (iframe) iframe.contentWindow && iframe.contentWindow.postMessage({ type: 'scroll', progress: self.progress }, '*');
      }
    }
  });

  beats.forEach(function (beat, i) {
    var t0 = i * step;
    var last = i === n - 1;
    var floats = beat.querySelectorAll('.beat-float');

    if (i === 0) {
      gsap.set(beat, { autoAlpha: 1 });
      tl.to(beat, { scale: 1.5, duration: step * .6, ease: 'power1.in' }, t0 + step * .3)
        .to(beat, { autoAlpha: 0, duration: step * .3, ease: 'power2.in' }, t0 + step * .75);
    } else {
      gsap.set(beat, { scale: .46, autoAlpha: 0, transformOrigin: '50% 50%' });
      tl.to(beat, { autoAlpha: 1, duration: step * .2 }, t0)
        .to(beat, { scale: 1, duration: step * .4, ease: 'power1.in' }, t0);
      if (!last) {
        tl.to(beat, { scale: 1.55, duration: step * .45, ease: 'power1.in' }, t0 + step)
          .to(beat, { autoAlpha: 0, duration: step * .32 }, t0 + step * 1.05);
      }
    }

    floats.forEach(function (f, fi) {
      var near = f.classList.contains('near');
      var amp = near ? [.3, 1.12, 1.9] : [.5, 1, 1.5];
      var offset = .05 + fi * .04;
      gsap.set(f, { scale: amp[0], autoAlpha: 0, transformOrigin: '50% 50%' });
      tl.to(f, { autoAlpha: 1, scale: amp[1], duration: step * .5, ease: 'power1.in' }, t0 + offset);
      if (!last) tl.to(f, { scale: amp[2], autoAlpha: 0, duration: step * .5, ease: 'power1.in' }, t0 + step * .6 + offset);
    });
  });
}

/* ---------- marquee duplication (seamless loop) ---------- */
function initMarquee() {
  var track = document.getElementById('marqueeTrack');
  if (!track) return;
  track.innerHTML += track.innerHTML;
}

/* ---------- Leaflet map ---------- */
function initMap() {
  var el = document.getElementById('map');
  if (!el || typeof L === 'undefined') return;
  var coords = [-35.4472, -60.9878]; /* Baigorrita, provincia de Buenos Aires (placeholder aproximado) */
  var map = L.map(el, { scrollWheelZoom: false }).setView(coords, 13);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap &copy; CARTO', maxZoom: 19
  }).addTo(map);
  var icon = L.divIcon({
    className: '', iconSize: [26, 26],
    html: '<div style="width:26px;height:26px;border-radius:50%;background:#c05f7d;border:3px solid #fff;box-shadow:0 6px 16px rgba(140,60,90,.4)"></div>'
  });
  L.marker(coords, { icon: icon }).addTo(map).bindPopup('Alejandra Santillán — Cake Atelier<br>Baigorrita, Buenos Aires');
}

/* ---------- toast ---------- */
function showToast(msg) {
  var wrap = document.querySelector('.toast-wrap');
  if (!wrap) { wrap = document.createElement('div'); wrap.className = 'toast-wrap'; wrap.setAttribute('aria-live', 'polite'); document.body.appendChild(wrap); }
  var toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  toast.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg><span>' + esc(msg) + '</span>';
  wrap.appendChild(toast);
  setTimeout(function () { toast.classList.add('hiding'); setTimeout(function () { toast.remove(); }, 220); }, 3200);
}

/* ---------- contact form (demo — sin backend) ---------- */
function initContactForm() {
  var form = document.getElementById('contactForm');
  if (!form) return;

  if (typeof IMask !== 'undefined') {
    var phoneInput = form.querySelector('#telefono');
    if (phoneInput) IMask(phoneInput, { mask: '+54 9 000 000-0000' });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var valid = true;
    form.querySelectorAll('[required]').forEach(function (input) {
      var field = input.closest('.field');
      if (!input.value.trim()) { field.classList.add('error'); valid = false; }
      else { field.classList.remove('error'); }
    });
    if (!valid) return;

    var btn = form.querySelector('.form-submit');
    var original = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Enviando…';
    setTimeout(function () {
      btn.disabled = false;
      btn.textContent = original;
      form.reset();
      form.querySelectorAll('.field').forEach(function (f) { f.classList.remove('error'); });
      showToast('¡Gracias! El envío de mensajes se activa al pasar la web a producción.');
      if (typeof confetti !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        confetti({ particleCount: 70, spread: 65, origin: { y: .7 }, colors: ['#e0a4b5', '#c7a970', '#fff'] });
      }
    }, 800);
  });
}

/* ---------- init ---------- */
document.addEventListener('DOMContentLoaded', function () {
  initMobileMenu();
  initWspFloat();
  initScrollProgress();
  initMarquee();
  initHeroTunnel();
  initReveal();
  initMap();
  initContactForm();
});
