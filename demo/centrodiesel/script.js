const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
  if (typeof DrawSVGPlugin !== 'undefined') gsap.registerPlugin(DrawSVGPlugin);
}
if (typeof gsap === 'undefined') {
  document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; el.style.clipPath = 'none'; el.style.filter = 'none'; });
}
if (typeof ScrollTrigger !== 'undefined') {
  window.addEventListener('load', () => ScrollTrigger.refresh());
}

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  const header = document.querySelector('.site-header');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; (header || document.body).appendChild(bd); }
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open'); nav.setAttribute('inert', '');
    toggle.setAttribute('aria-expanded', 'false'); document.body.classList.remove('no-scroll');
  };
  const open = () => {
    nav.classList.add('open'); bd.classList.add('open'); nav.removeAttribute('inert');
    toggle.setAttribute('aria-expanded', 'true'); document.body.classList.add('no-scroll');
    nav.querySelector('a')?.focus();
  };
  toggle.addEventListener('click', () => (nav.classList.contains('open') ? close() : open()));
  closeBtn?.addEventListener('click', () => { close(); toggle.focus(); });
  bd.addEventListener('click', close);
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); } });
  const mq = window.matchMedia('(min-width: 861px)');
  const sync = () => { if (mq.matches) { close(); nav.removeAttribute('inert'); } else if (!nav.classList.contains('open')) nav.setAttribute('inert', ''); };
  mq.addEventListener('change', sync);
  sync();
}

function initWspFloat() {
  const btn = document.getElementById('wsp-float');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) btn.classList.add('visible'); else btn.classList.remove('visible');
  }, { passive: true });
}

function initProgressBar() {
  const bar = document.querySelector('.scroll-progress');
  if (!bar) return;
  let queued = false;
  const update = () => {
    queued = false;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
  };
  window.addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(update); } }, { passive: true });
  update();
}

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

function initHero() {
  if (typeof gsap === 'undefined' || reduceMotion) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  tl.from('.hero-glow', { opacity: 0, scale: 0.7, duration: 1.2 }, 0)
    .from('.h-line-in', { yPercent: 112, duration: 1.05, stagger: 0.14 }, 0.1)
    .from('[data-hero="eyebrow"]', { opacity: 0, y: 18, duration: 0.8 }, 0.35)
    .from('[data-hero="sub"]', { opacity: 0, y: 24, duration: 0.9 }, 0.5)
    .from('[data-hero="ctas"]', { opacity: 0, y: 24, duration: 0.9 }, 0.65)
    .from('.hero-turbo', { opacity: 0, x: 90, rotation: 9, duration: 1.15, ease: 'expo.out' }, 0.3)
    .from('.hero-tag-1', { opacity: 0, y: 20, scale: 0.94, duration: 0.7 }, 0.95)
    .from('.hero-tag-2', { opacity: 0, y: -16, scale: 0.94, duration: 0.7 }, 1.1);

  gsap.to('.hero-turbo', { y: -12, duration: 3.4, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1.6 });

  if (typeof ScrollTrigger !== 'undefined') {
    gsap.to('.hero-scene', {
      y: 70, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.6 }
    });
  }

  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const scene = document.querySelector('.hero-scene');
    const layers = document.querySelectorAll('.hero-scene [data-depth]');
    if (scene && layers.length) {
      const setters = [...layers].map(el => ({
        x: gsap.quickTo(el, 'x', { duration: 0.7, ease: 'power3.out' }),
        y: gsap.quickTo(el, 'y', { duration: 0.7, ease: 'power3.out' }),
        d: parseFloat(el.dataset.depth) || 1
      }));
      document.querySelector('.hero').addEventListener('mousemove', e => {
        const r = scene.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
        const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
        setters.forEach(s => { s.x(dx * 14 * s.d); s.y(dy * 10 * s.d); });
      });
    }
  }
}

function initRadiografia() {
  const stage = document.getElementById('rxStage');
  if (!stage) return;
  const fichas = stage.querySelectorAll('.rx-ficha');
  const hotspots = stage.querySelectorAll('.hs');
  const num = document.getElementById('rxNum');
  const STEPS = fichas.length;
  let current = 0;

  const setStep = idx => {
    idx = Math.max(0, Math.min(STEPS - 1, idx));
    if (idx === current && stage.dataset.init) return;
    stage.dataset.init = '1';
    current = idx;
    fichas.forEach((f, i) => f.classList.toggle('is-on', i === idx));
    hotspots.forEach((h, i) => h.classList.toggle('on', i === idx));
    if (num) num.textContent = String(idx + 1).padStart(2, '0');
  };

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    stage.classList.add('rx-static');
    hotspots.forEach(h => h.classList.add('on'));
    return;
  }

  if (reduceMotion) {
    stage.classList.add('rx-static');
    hotspots.forEach(h => h.classList.add('on'));
    return;
  }

  const lines = stage.querySelectorAll('.truck-line');
  if (typeof DrawSVGPlugin !== 'undefined') {
    gsap.set(lines, { drawSVG: '0%' });
    ScrollTrigger.create({
      trigger: stage, start: 'top 78%', once: true,
      onEnter: () => gsap.to(lines, { drawSVG: '100%', duration: 1.5, stagger: 0.05, ease: 'power2.inOut' })
    });
  }

  setStep(0);

  const mm = gsap.matchMedia();

  mm.add('(min-width: 1081px)', () => {
    const st = ScrollTrigger.create({
      trigger: stage,
      start: 'top top',
      end: '+=260%',
      pin: true,
      scrub: 0.6,
      invalidateOnRefresh: true,
      onUpdate: self => setStep(Math.min(STEPS - 1, Math.floor(self.progress * STEPS)))
    });
    return () => st.kill();
  });

  mm.add('(max-width: 1080px)', () => {
    stage.classList.add('is-sticky-mobile');
    const st = ScrollTrigger.create({
      trigger: stage,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.6,
      invalidateOnRefresh: true,
      onUpdate: self => setStep(Math.min(STEPS - 1, Math.floor(self.progress * STEPS)))
    });
    requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => { stage.classList.remove('is-sticky-mobile'); st.kill(); };
  });
}

function initCounters() {
  const counters = document.querySelectorAll('.count');
  if (!counters.length) return;
  const fmt = n => Math.round(n).toLocaleString('es-AR');
  const run = el => {
    const target = parseInt(el.dataset.count, 10) || 0;
    if (reduceMotion) { el.textContent = fmt(target); return; }
    const t0 = performance.now();
    const dur = 1400;
    const tick = now => {
      const p = Math.min(1, (now - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(target * eased);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if (!('IntersectionObserver' in window)) { counters.forEach(run); return; }
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { run(e.target); io.unobserve(e.target); } });
  }, { threshold: 0.4 });
  counters.forEach(el => io.observe(el));
}

function initQuoteBand() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) return;
  const img = document.querySelector('.quote-band-img');
  if (!img) return;
  gsap.fromTo(img, { yPercent: -8 }, {
    yPercent: 0, ease: 'none',
    scrollTrigger: { trigger: '.quote-band', start: 'top bottom', end: 'bottom top', scrub: 0.6 }
  });
}

function initCierre() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) {
    const glow = document.querySelector('.cierre-glow');
    if (glow) glow.style.opacity = 1;
    return;
  }
  gsap.to('.cierre-glow', {
    opacity: 1, ease: 'none',
    scrollTrigger: { trigger: '.cierre', start: 'top 75%', end: 'center 55%', scrub: 0.8 }
  });
  gsap.from('.cierre-faro', {
    x: -60, rotation: -5, ease: 'none',
    scrollTrigger: { trigger: '.cierre', start: 'top bottom', end: 'center center', scrub: 0.6 }
  });
}

function initFaqRefresh() {
  document.querySelectorAll('.faq-list details').forEach(d => {
    d.addEventListener('toggle', () => {
      if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
    });
  });
}

function initMap() {
  const el = document.getElementById('map');
  if (!el || typeof L === 'undefined') return;
  const coords = [-32.8895, -68.8458];
  const map = L.map(el, { scrollWheelZoom: false, zoomControl: true }).setView(coords, 14);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap &copy; CARTO',
    maxZoom: 19
  }).addTo(map);
  const pin = L.divIcon({ className: 'map-pin', html: '<span></span>', iconSize: [18, 18], iconAnchor: [9, 9] });
  L.marker(coords, { icon: pin }).addTo(map).bindPopup('<strong>Centro Diesel</strong><br>Repuestos Mercedes-Benz');
}

initNav();
initWspFloat();
initProgressBar();
initReveals();
initHero();
initRadiografia();
initCounters();
initQuoteBand();
initCierre();
initFaqRefresh();
initMap();
