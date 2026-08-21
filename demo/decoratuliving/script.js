const WHATSAPP_NUMBER = '5491132685618';
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}
if (typeof gsap === 'undefined') {
  document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
}
if (typeof ScrollTrigger !== 'undefined') {
  window.addEventListener('load', () => ScrollTrigger.refresh());
}

function initWspLinks() {
  document.querySelectorAll('[data-wsp-msg]').forEach(a => {
    a.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(a.dataset.wspMsg)}`;
  });
}

function initHeaderScroll() {
  const header = document.getElementById('siteHeader');
  if (!header) return;
  const sync = () => header.classList.toggle('is-scrolled', window.scrollY > 40);
  window.addEventListener('scroll', sync, { passive: true });
  sync();
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; document.body.appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 769px)');
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open');
    if (!desktopMq.matches) nav.setAttribute('inert', '');
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
  const syncInert = () => {
    if (desktopMq.matches) nav.removeAttribute('inert');
    else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  desktopMq.addEventListener('change', syncInert);
  syncInert();
}

function initAntiCopy() {
  document.addEventListener('contextmenu', e => e.preventDefault());
  document.addEventListener('dragstart', e => e.preventDefault());
  document.addEventListener('keydown', e => {
    const k = e.key.toLowerCase();
    if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
      e.preventDefault();
    }
  });
}

function initReveals() {
  const items = document.querySelectorAll('[data-animate]');
  if (!items.length) return;
  document.querySelectorAll('[data-animate-stagger]').forEach(parent => {
    parent.querySelectorAll('[data-animate]').forEach((el, i) => {
      if (!el.dataset.delay) el.style.transitionDelay = `${Math.min(i * 0.12, 0.72)}s`;
    });
  });
  items.forEach(el => {
    if (el.dataset.delay) el.style.transitionDelay = `${el.dataset.delay}s`;
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

function initFloats() {
  const wsp = document.getElementById('wsp-float');
  if (!wsp) return;
  const sync = () => wsp.classList.toggle('visible', window.scrollY > 600);
  window.addEventListener('scroll', sync, { passive: true });
  sync();
}

function initMagnetic() {
  if (typeof gsap === 'undefined' || reduceMotion) return;
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      gsap.to(btn, { x: (e.clientX - r.left - r.width / 2) * .22, y: (e.clientY - r.top - r.height / 2) * .35, duration: .3 });
    });
    btn.addEventListener('mouseleave', () => gsap.to(btn, { x: 0, y: 0, duration: .45, ease: 'elastic.out(1, .55)' }));
  });
}

function initArmado() {
  const stage = document.getElementById('armadoStage');
  const pasos = Array.from(document.querySelectorAll('#armadoPasos .paso'));
  const puffs = Array.from(document.querySelectorAll('#armadoVisual .ap'));
  if (!stage || !pasos.length || !puffs.length) return;

  function setStep(progress) {
    const idx = Math.min(pasos.length - 1, Math.floor(progress * pasos.length));
    pasos.forEach((p, i) => p.classList.toggle('is-on', i === idx));
  }

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    setStep(0);
    return;
  }

  const scatter = [
    { x: -140, y: -90, scale: .4, rotate: -30 },
    { x: 160, y: -120, scale: .3, rotate: 24 },
    { x: -180, y: 60, scale: .5, rotate: 16 },
    { x: 190, y: 90, scale: .35, rotate: -22 },
    { x: 20, y: -170, scale: .45, rotate: 30 },
  ];

  function buildTimeline() {
    const tl = gsap.timeline();
    let scatterIndex = 0;
    puffs.forEach((el, i) => {
      if (el.classList.contains('ap-mesa')) {
        tl.from(el, { opacity: 0, scale: .5, duration: 1, ease: 'power2.out' }, 0.5);
      } else {
        const s = scatter[scatterIndex % scatter.length];
        scatterIndex++;
        tl.from(el, { x: s.x, y: s.y, scale: s.scale, rotate: s.rotate, opacity: 0, duration: 1, ease: 'power2.out' }, i * .1);
      }
    });
    return tl;
  }

  ScrollTrigger.matchMedia({
    '(min-width: 1081px) and (prefers-reduced-motion: no-preference)': () => {
      const tl = buildTimeline();
      const st = ScrollTrigger.create({
        trigger: stage, start: 'top top', end: '+=200%', pin: true, scrub: .6,
        anticipatePin: 1, animation: tl, onUpdate: self => setStep(self.progress),
        invalidateOnRefresh: true,
      });
      return () => st.kill();
    },
    '(max-width: 1080px) and (prefers-reduced-motion: no-preference)': () => {
      stage.classList.add('is-sticky-mobile');
      const tl = buildTimeline();
      const st = ScrollTrigger.create({
        trigger: stage, start: 'top top', end: 'bottom bottom', scrub: .6,
        animation: tl, onUpdate: self => setStep(self.progress),
        invalidateOnRefresh: true,
      });
      requestAnimationFrame(() => ScrollTrigger.refresh());
      return () => { stage.classList.remove('is-sticky-mobile'); st.kill(); };
    },
    '(prefers-reduced-motion: reduce)': () => {
      setStep(0);
    },
  });
}

function initFooterYear() {
  const el = document.getElementById('footerYear');
  if (el) el.textContent = new Date().getFullYear();
}

initWspLinks();
initHeaderScroll();
initNav();
initAntiCopy();
initArmado();
initReveals();
initFloats();
initMagnetic();
initFooterYear();
