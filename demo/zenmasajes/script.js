const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}
if (typeof gsap === 'undefined') {
  document.querySelectorAll('[data-animate]').forEach(el => {
    el.style.opacity = 1; el.style.transform = 'none'; el.style.clipPath = 'none';
  });
}
if (typeof ScrollTrigger !== 'undefined') {
  window.addEventListener('load', () => ScrollTrigger.refresh());
}

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
  toggle.addEventListener('click', () => (nav.classList.contains('open') ? close() : open()));
  closeBtn?.addEventListener('click', () => { close(); toggle.focus(); });
  bd.addEventListener('click', close);
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); } });
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

function initWspFloat() {
  const btn = document.getElementById('wsp-float');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) btn.classList.add('visible'); else btn.classList.remove('visible');
  }, { passive: true });
}

function initProgress() {
  const bar = document.getElementById('progressBar');
  if (!bar) return;
  const update = () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = `scaleX(${h > 0 ? Math.min(window.scrollY / h, 1) : 0})`;
  };
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update, { passive: true });
  update();
}

function initHeroRings() {
  const rings = document.querySelectorAll('.rings .ring');
  if (!rings.length) return;
  if (reduceMotion) { rings.forEach(r => r.classList.add('in-view')); return; }
  requestAnimationFrame(() => {
    setTimeout(() => rings.forEach(r => r.classList.add('in-view')), 260);
  });
}

function initServHover() {
  if (window.matchMedia('(hover: none)').matches) return;
  document.querySelectorAll('.serv').forEach(el => {
    el.addEventListener('mousemove', e => {
      el.style.setProperty('--mx', `${e.clientX - el.getBoundingClientRect().left}px`);
    }, { passive: true });
  });
}

function initRespirar() {
  const stage = document.getElementById('respStage');
  const core = document.getElementById('respCore');
  const phaseEl = document.getElementById('respPhase');
  const secEl = document.getElementById('respSec');
  const steps = Array.from(document.querySelectorAll('#respSteps li'));
  const rings = document.querySelectorAll('.rring');
  if (!stage || !core || !phaseEl || !secEl || !steps.length) return;

  const PHASES = [{ nombre: 'Inhalá', dur: 4 }, { nombre: 'Sostené', dur: 4 }, { nombre: 'Exhalá', dur: 6 }];
  const TOTAL = PHASES.reduce((s, f) => s + f.dur, 0);

  const setState = progress => {
    const t = Math.max(0, Math.min(progress, 1)) * TOTAL;
    let i = 0, acumulado = 0;
    while (i < PHASES.length - 1 && t >= acumulado + PHASES[i].dur) { acumulado += PHASES[i].dur; i++; }
    const dentro = Math.min(t - acumulado, PHASES[i].dur);
    phaseEl.textContent = PHASES[i].nombre;
    secEl.textContent = `${Math.min(Math.floor(dentro) + 1, PHASES[i].dur)}"`;
    steps.forEach((s, k) => s.classList.toggle('is-on', k === i));
  };

  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    stage.classList.add('is-static');
    phaseEl.textContent = 'Inhalá 4 · Sostené 4 · Exhalá 6';
    secEl.textContent = '';
    steps.forEach(s => s.classList.add('is-on'));
    return;
  }

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: stage,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.7,
      invalidateOnRefresh: true,
      onUpdate: self => setState(self.progress),
    },
  });
  tl.to(core, { scale: 1, duration: 4, ease: 'sine.inOut' }, 0)
    .to(rings, { scale: 1.16, opacity: 0.62, duration: 4, ease: 'sine.inOut', stagger: 0.1 }, 0)
    .to(core, { scale: 1, duration: 4 }, 4)
    .to(core, { scale: 0.58, duration: 6, ease: 'sine.inOut' }, 8)
    .to(rings, { scale: 1, opacity: 0.24, duration: 6, ease: 'sine.inOut', stagger: 0.1 }, 8);

  setState(0);
}

function initBanda() {
  const img = document.querySelector('.sala-banda img');
  if (!img || reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.fromTo(img,
    { objectPosition: '50% 26%' },
    {
      objectPosition: '50% 74%', ease: 'none',
      scrollTrigger: { trigger: '.sala-banda', start: 'top bottom', end: 'bottom top', scrub: 0.6, invalidateOnRefresh: true },
    });
}

function initMapa() {
  const nodo = document.getElementById('mapa');
  if (!nodo || typeof L === 'undefined') return;
  const centro = [-34.6037, -58.3816];
  const mapa = L.map(nodo, { scrollWheelZoom: false, attributionControl: true }).setView(centro, 13);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap &copy; CARTO',
    maxZoom: 19,
  }).addTo(mapa);
  L.marker(centro, {
    icon: L.divIcon({ className: '', html: '<span class="mapa-pin"></span>', iconSize: [22, 22], iconAnchor: [11, 11] }),
    keyboard: false,
  }).addTo(mapa);
}

function initYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}

initNav();
initReveals();
initWspFloat();
initProgress();
initHeroRings();
initServHover();
initRespirar();
initBanda();
initMapa();
initYear();
