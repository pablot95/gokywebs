const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

/* ── Reveals ── */
function initReveals() {
  const items = document.querySelectorAll('[data-animate]');
  if (!items.length) return;
  document.querySelectorAll('[data-animate-stagger]').forEach(parent => {
    parent.querySelectorAll('[data-animate]').forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i * 0.12, 0.72)}s`;
    });
  });
  if (!('IntersectionObserver' in window) || reduceMotion) {
    items.forEach(el => el.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); }
    });
  }, { threshold: 0, rootMargin: '0px 0px -7% 0px' });
  items.forEach(el => io.observe(el));

  let queued = false;
  const sweep = () => {
    queued = false;
    let pending = 0;
    items.forEach(el => {
      if (el.classList.contains('in')) return;
      const r = el.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight) { el.classList.add('in'); io.unobserve(el); }
      else pending++;
    });
    if (!pending) {
      window.removeEventListener('scroll', queueSweep);
      window.removeEventListener('resize', queueSweep);
    }
  };
  const queueSweep = () => { if (!queued) { queued = true; requestAnimationFrame(sweep); } };
  window.addEventListener('load', queueSweep);
  window.addEventListener('scroll', queueSweep, { passive: true });
  window.addEventListener('resize', queueSweep, { passive: true });
}

/* ── Nav ── */
function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; document.body.appendChild(bd); }
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open'); nav.setAttribute('inert', '');
    toggle.setAttribute('aria-expanded', 'false'); document.body.classList.remove('no-scroll');
  };
  const open = () => {
    nav.classList.add('open'); bd.classList.add('open'); nav.removeAttribute('inert');
    toggle.setAttribute('aria-expanded', 'true'); document.body.classList.add('no-scroll');
    nav.querySelector('a')?.focus();
  };
  const desktop = window.matchMedia('(min-width: 769px)');
  const syncInert = () => {
    if (desktop.matches) nav.removeAttribute('inert');
    else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  syncInert();
  desktop.addEventListener('change', syncInert);
  toggle.addEventListener('click', () => (nav.classList.contains('open') ? close() : open()));
  closeBtn?.addEventListener('click', () => { close(); toggle.focus(); });
  bd.addEventListener('click', close);
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); } });
}

function initWspFloat() {
  const btn = document.getElementById('wsp-float');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) btn.classList.add('visible'); else btn.classList.remove('visible');
  }, { passive: true });
}

/* ── La firma se escribe cuando entra en pantalla ── */
function initFirma() {
  const firma = document.querySelector('.firma-img');
  if (!firma) return;
  if (!('IntersectionObserver' in window) || reduceMotion) { firma.classList.add('in'); return; }
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); }
    });
  }, { threshold: 0.4 });
  io.observe(firma);
}

/* ── Firma de movimiento: el camino del caso ── */
function initCamino() {
  const seccion = document.getElementById('camino');
  const grid = document.querySelector('.camino-grid');
  const etapas = Array.from(document.querySelectorAll('.etapa'));
  const hitos = Array.from(document.querySelectorAll('.hito'));
  const linea = document.querySelector('.camino-linea i');
  const numEl = document.querySelector('[data-paso-num]');
  const labelEl = document.querySelector('[data-paso-label]');
  if (!seccion || !grid || !etapas.length || !linea) return;

  const ROMANOS = ['I', 'II', 'III', 'IV', 'V'];
  const NOMBRES = ['Consulta', 'Estrategia', 'Reclamo previo', 'Demanda', 'Resolución'];

  const setPaso = progreso => {
    const i = Math.min(etapas.length - 1, Math.floor(progreso * etapas.length + 0.0001));
    etapas.forEach((e, idx) => e.classList.toggle('is-on', idx === i));
    hitos.forEach((h, idx) => {
      h.classList.toggle('is-on', idx === i);
      h.classList.toggle('is-past', idx < i);
    });
    if (numEl) numEl.textContent = ROMANOS[i] || '';
    if (labelEl) labelEl.textContent = NOMBRES[i] || '';
  };

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) {
    if (typeof gsap !== 'undefined') gsap.set(linea, { scaleX: 1 });
    else linea.style.transform = 'scaleX(1)';
    setPaso(0.99);
    return;
  }

  const mm = gsap.matchMedia();

  const armar = trigger => gsap.timeline({ scrollTrigger: trigger })
    .fromTo(linea, { scaleX: 0 }, { scaleX: 1, ease: 'none', duration: 1 });

  mm.add('(min-width: 1081px) and (prefers-reduced-motion: no-preference)', () => {
    grid.classList.remove('is-sticky-mobile');
    const tl = armar({
      trigger: seccion, start: 'top top', end: '+=220%', pin: true, scrub: .6,
      invalidateOnRefresh: true, onUpdate: self => setPaso(self.progress)
    });
    setPaso(0);
    return () => tl.scrollTrigger?.kill();
  });

  mm.add('(max-width: 1080px) and (prefers-reduced-motion: no-preference)', () => {
    grid.classList.add('is-sticky-mobile');
    /* El scrub arranca cuando la escena YA se pegó arriba, no cuando entra el bloque
       entero: si no, los primeros pasos corren con la escena todavía bajando. Se
       compensa con el alto del intro — usar la escena como trigger no sirve, porque
       es sticky y ScrollTrigger mide mal un trigger que se mueve solo. */
    const intro = document.querySelector('.camino-intro');
    const tl = armar({
      trigger: grid,
      start: () => `top+=${intro ? intro.offsetHeight : 0} top`,
      end: 'bottom bottom', scrub: .6,
      invalidateOnRefresh: true, onUpdate: self => setPaso(self.progress)
    });
    setPaso(0);
    requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => { tl.scrollTrigger?.kill(); grid.classList.remove('is-sticky-mobile'); };
  });

  mm.add('(prefers-reduced-motion: reduce)', () => {
    gsap.set(linea, { scaleX: 1 });
    setPaso(0.99);
  });
}

/* ── Movimiento del cuerpo ── */
function initMovimiento() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) return;

  gsap.from('.hero-copy > *', { y: 24, opacity: 0, duration: 1, stagger: .09, ease: 'power3.out', delay: .1 });
  gsap.fromTo('.hero-photo img', { scale: 1.12 }, { scale: 1, duration: 1.4, ease: 'power3.out', delay: .15 });
  gsap.from('.sello-hero', { scale: .82, opacity: 0, rotate: -8, duration: .8, ease: 'back.out(1.6)', delay: .8 });

  gsap.to('.hero-photo img', {
    yPercent: -5, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .5 }
  });

  const franja = document.querySelectorAll('.franja-inner div');
  if (franja.length) {
    gsap.from(franja, {
      y: 16, opacity: 0, duration: .7, stagger: .1, ease: 'power2.out',
      scrollTrigger: { trigger: '.franja', start: 'top 90%' }
    });
  }

  const trabajoMedia = document.querySelector('.trabajo-media');
  if (trabajoMedia) {
    gsap.to(trabajoMedia, {
      yPercent: -4, ease: 'none',
      scrollTrigger: { trigger: '.trabajo', start: 'top bottom', end: 'bottom top', scrub: .6 }
    });
  }

  const bandaImg = document.querySelector('.banda img');
  if (bandaImg) {
    gsap.fromTo(bandaImg, { scale: 1.1 }, {
      scale: 1, ease: 'none',
      scrollTrigger: { trigger: '.banda', start: 'top bottom', end: 'bottom top', scrub: .7 }
    });
  }
}

/* ── Mapa ── */
function initMapa() {
  const cont = document.getElementById('mapa');
  if (!cont || typeof L === 'undefined') return;
  /* Coordenadas del centro de Río Gallegos: placeholder hasta tener la dirección real. */
  const centro = [-51.6230, -69.2168];
  const mapa = L.map(cont, { scrollWheelZoom: false, attributionControl: true }).setView(centro, 14);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap &copy; CARTO', maxZoom: 19
  }).addTo(mapa);
  L.circleMarker(centro, {
    radius: 10, color: '#1B2A4A', weight: 3, fillColor: '#E8C97A', fillOpacity: 1
  }).addTo(mapa).bindPopup('Estudio jurídico · Río Gallegos');
}

document.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }
  if (typeof gsap === 'undefined') {
    document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
  }

  initNav();
  initWspFloat();
  initReveals();
  initFirma();
  initCamino();
  initMovimiento();

  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  if (typeof ScrollTrigger !== 'undefined') {
    window.addEventListener('load', () => ScrollTrigger.refresh());
    let t;
    window.addEventListener('resize', () => {
      clearTimeout(t);
      t = setTimeout(() => ScrollTrigger.refresh(), 180);
    }, { passive: true });
  }
});

window.addEventListener('load', initMapa);
