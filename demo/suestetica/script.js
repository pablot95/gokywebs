const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}
if (typeof gsap === 'undefined') {
  document.documentElement.classList.add('no-gsap');
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

function initWspFloat() {
  const btn = document.getElementById('wsp-float');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) btn.classList.add('visible'); else btn.classList.remove('visible');
  }, { passive: true });
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

function initDimmer() {
  const bar = document.getElementById('dimmerBar');
  if (!bar) return;
  let ticking = false;
  const update = () => {
    ticking = false;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? Math.min(window.scrollY / max, 1) : 0})`;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  update();
}

function initHeroScene() {
  if (typeof gsap === 'undefined' || reduceMotion) return;
  const cut = document.getElementById('heroCut');
  const frame = document.querySelector('.hero-frame');
  const su = document.querySelector('.hero-su');
  const tubes = document.querySelectorAll('.hero-tube');
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  if (su) tl.from(su, { x: 90, opacity: 0, duration: 1.2 }, 0);
  if (frame) tl.from(frame, { scale: .94, opacity: 0, duration: 1, transformOrigin: '50% 60%' }, .15);
  if (cut) tl.from(cut, { y: 70, rotation: -7, opacity: 0, duration: 1.1 }, .3);
  if (tubes.length) tl.from(tubes, { scaleY: 0, transformOrigin: 'top center', duration: .9, stagger: .15 }, .45);

  if (window.matchMedia('(hover: hover)').matches && cut) {
    const scene = document.querySelector('.hero');
    const xCut = gsap.quickTo(cut, 'x', { duration: .6, ease: 'power3.out' });
    const yCut = gsap.quickTo(cut, 'y', { duration: .6, ease: 'power3.out' });
    const xSu = su ? gsap.quickTo(su, 'x', { duration: .9, ease: 'power3.out' }) : null;
    scene?.addEventListener('mousemove', e => {
      if (window.innerWidth <= 860) return;
      const r = scene.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - .5;
      const ny = (e.clientY - r.top) / r.height - .5;
      xCut(nx * 18); yCut(ny * 14);
      if (xSu) xSu(nx * -26);
    });
  }
}

function initSeams() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) return;
  document.querySelectorAll('.neon-seam').forEach(seam => {
    gsap.fromTo(seam, { scaleY: 0 }, {
      scaleY: 1, ease: 'none',
      scrollTrigger: { trigger: seam, start: 'top 92%', end: 'bottom 45%', scrub: .6 }
    });
  });
}

function initBanda() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) return;
  const img = document.getElementById('bandaImg');
  if (!img) return;
  gsap.fromTo(img, { yPercent: -6 }, {
    yPercent: 6, ease: 'none',
    scrollTrigger: { trigger: '.banda', start: 'top bottom', end: 'bottom top', scrub: .5 }
  });
}

function initVisita() {
  const grid = document.getElementById('visitaGrid');
  if (!grid) return;
  const pasos = grid.querySelectorAll('.paso');
  const shots = grid.querySelectorAll('.vis-shot');
  if (!pasos.length) return;
  const setStep = idx => {
    pasos.forEach(p => p.classList.toggle('is-on', +p.dataset.step === idx));
    shots.forEach(s => s.classList.toggle('is-on', +s.dataset.step === idx));
  };
  if (!('IntersectionObserver' in window) || reduceMotion) {
    setStep(0);
    pasos.forEach(p => p.classList.add('is-on'));
    return;
  }
  setStep(0);
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) setStep(+entry.target.dataset.step);
    });
  }, { rootMargin: '-42% 0px -42% 0px', threshold: 0 });
  pasos.forEach(p => io.observe(p));
}

function initCierre() {
  const track = document.getElementById('cierreTrack');
  const sign = document.getElementById('cierreSign');
  const cta = document.getElementById('cierreCta');
  if (!track || !sign) return;
  const letters = sign.querySelectorAll('.sign-letter');
  const allOn = () => { letters.forEach(l => l.classList.add('lit')); cta?.classList.add('on'); };
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  if (reduceMotion) { allOn(); return; }
  ScrollTrigger.create({
    trigger: track,
    start: 'top top',
    end: 'bottom bottom',
    scrub: .4,
    invalidateOnRefresh: true,
    onUpdate: self => {
      const p = self.progress;
      const n = Math.floor(Math.min(p / .68, 1) * letters.length);
      letters.forEach((l, i) => l.classList.toggle('lit', i < n));
      cta?.classList.toggle('on', p > .78);
    }
  });
}

initNav();
initWspFloat();
initReveals();
initDimmer();
initHeroScene();
initSeams();
initBanda();
initVisita();
initCierre();
