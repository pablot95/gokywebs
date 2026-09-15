const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  const bd = document.getElementById('navBackdrop');
  if (!toggle || !nav || !bd) return;
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
  const mq = window.matchMedia('(min-width: 769px)');
  const syncInert = () => {
    if (mq.matches) { close(); nav.removeAttribute('inert'); }
    else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  mq.addEventListener('change', syncInert);
  syncInert();
}

function initWspFloat() {
  const btn = document.getElementById('wsp-float');
  if (!btn) return;
  const sync = () => btn.classList.toggle('visible', window.scrollY > 600);
  window.addEventListener('scroll', sync, { passive: true });
  sync();
}

function initHeroGlow() {
  const hero = document.querySelector('.hero');
  const glow = document.getElementById('heroGlow');
  if (!hero || !glow || reduceMotion) return;
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  hero.addEventListener('pointermove', e => {
    const r = hero.getBoundingClientRect();
    glow.style.left = `${e.clientX - r.left}px`;
    glow.style.top = `${e.clientY - r.top}px`;
    hero.classList.add('glow-on');
  });
  hero.addEventListener('pointerleave', () => hero.classList.remove('glow-on'));
}

function initMovimiento() {
  if (typeof gsap === 'undefined' || reduceMotion) return;
  if (typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);

  gsap.timeline({ defaults: { ease: 'expo.out' } })
    .from('.hero-cut', { y: 80, scale: .94, opacity: 0, duration: 1.2 }, .15)
    .from('.hero-sello', { scale: .8, opacity: 0, duration: .8 }, .55)
    .from('.hero-onda', { yPercent: 60, opacity: 0, duration: 1 }, .35);

  if (typeof ScrollTrigger === 'undefined') return;

  const foto = document.querySelector('.espacio-media img');
  if (foto) {
    gsap.fromTo(foto, { yPercent: -5 }, {
      yPercent: 5, ease: 'none',
      scrollTrigger: { trigger: '.espacio-media', start: 'top bottom', end: 'bottom top', scrub: true },
    });
  }
  gsap.to('.hero-cut', {
    yPercent: -8, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .8 },
  });
}

const ONDA_W = 1000, ONDA_MID = 150;

function ondaY(x, t) {
  const ruido = Math.sin(x * 0.34) * 32 + Math.sin(x * 0.107 + 1.7) * 27 + Math.sin(x * 0.83 + .5) * 17;
  const calma = Math.sin((x / ONDA_W) * Math.PI * 4) * 64;
  const amp = 1 - t * 0.3;
  return ONDA_MID + (ruido * (1 - t) + calma * t) * amp;
}

function ondaD(t) {
  const paso = 12;
  let y = ondaY(0, t);
  let d = `M0 ${y.toFixed(1)}`;
  for (let x = paso; x <= ONDA_W; x += paso) {
    const y1 = ondaY(x, t);
    const cx = x - paso / 2;
    d += ` C${cx} ${y.toFixed(1)} ${cx} ${y1.toFixed(1)} ${x} ${y1.toFixed(1)}`;
    y = y1;
  }
  return d;
}

function initProceso() {
  const stage = document.getElementById('procesoStage');
  const path = document.getElementById('ondaPath');
  const gens = document.getElementById('ondaGens');
  const estado = document.getElementById('ondaEstado');
  const pasos = Array.from(document.querySelectorAll('#procesoPasos .paso'));
  if (!stage || !path) return;

  const ETIQUETAS = ['ruido', 'el patrón', 'en movimiento', 'en calma'];
  let ultimo = -1;

  const pintar = t => {
    path.setAttribute('d', ondaD(t));
    const idx = t >= .74 ? 3 : t >= .49 ? 2 : t >= .24 ? 1 : 0;
    if (idx !== ultimo) {
      ultimo = idx;
      pasos.forEach((p, i) => p.classList.toggle('is-on', i === idx));
      if (estado) estado.textContent = ETIQUETAS[idx];
    }
    if (typeof gsap !== 'undefined') {
      path.setAttribute('stroke', gsap.utils.interpolate('#ff6969', '#ffe27a', Math.min(1, t * 1.2)));
    }
    if (gens) {
      const visible = t > .2 && t < .62 ? 1 : 0;
      gens.setAttribute('opacity', visible);
      gens.querySelectorAll('.gen').forEach(g => {
        const c = g.querySelector('circle');
        const txt = g.querySelector('text');
        const y = ondaY(parseFloat(c.getAttribute('cx')), t);
        c.setAttribute('cy', y.toFixed(1));
        txt.setAttribute('y', (y + 46).toFixed(1));
      });
    }
  };

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) {
    pintar(1);
    pasos.forEach(p => p.classList.add('is-on'));
    return;
  }

  pintar(0);
  const mm = gsap.matchMedia();
  mm.add('(min-width: 1081px)', () => {
    const st = ScrollTrigger.create({
      trigger: stage, start: 'top top', end: '+=240%', pin: true, scrub: .6,
      anticipatePin: 1, invalidateOnRefresh: true,
      onUpdate: self => pintar(self.progress),
    });
    return () => st.kill();
  });
  mm.add('(max-width: 1080px) and (prefers-reduced-motion: no-preference)', () => {
    stage.classList.add('is-sticky-mobile');
    const st = ScrollTrigger.create({
      trigger: stage, start: 'top top', end: 'bottom bottom', scrub: .6, invalidateOnRefresh: true,
      onUpdate: self => pintar(self.progress),
    });
    requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => { st.kill(); stage.classList.remove('is-sticky-mobile'); };
  });
}

function initAcordeones() {
  document.querySelectorAll('details').forEach(d => {
    d.addEventListener('toggle', () => {
      if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
    });
  });
}

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

document.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
  if (typeof gsap === 'undefined') {
    document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; el.style.clipPath = 'none'; });
  }
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  initNav();
  initWspFloat();
  initReveals();
  initHeroGlow();
  initMovimiento();
  initProceso();
  initAcordeones();

  if (typeof ScrollTrigger !== 'undefined') {
    window.addEventListener('load', () => ScrollTrigger.refresh());
  }
});
