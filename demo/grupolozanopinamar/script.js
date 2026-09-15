const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}
if (typeof gsap !== 'undefined' && typeof DrawSVGPlugin !== 'undefined') {
  gsap.registerPlugin(DrawSVGPlugin);
}
if (typeof gsap === 'undefined') {
  document.querySelectorAll('[data-animate], [data-hero]').forEach(el => {
    el.style.opacity = 1; el.style.transform = 'none'; el.style.clipPath = 'none'; el.style.filter = 'none';
  });
}
if (typeof ScrollTrigger !== 'undefined') {
  window.addEventListener('load', () => ScrollTrigger.refresh());
}

const hasDraw = typeof gsap !== 'undefined' && typeof DrawSVGPlugin !== 'undefined';
const drawFrom = () => hasDraw ? { drawSVG: '0%' } : { opacity: 0 };
const drawTo = () => hasDraw ? { drawSVG: '100%' } : { opacity: 1 };

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

function showToast(msg) {
  let wrap = document.querySelector('.toast-wrap');
  if (!wrap) { wrap = document.createElement('div'); wrap.className = 'toast-wrap'; wrap.setAttribute('aria-live', 'polite'); document.body.appendChild(wrap); }
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  toast.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg><span>${esc(msg)}</span>`;
  wrap.appendChild(toast);
  setTimeout(() => { toast.classList.add('hiding'); setTimeout(() => toast.remove(), 220); }, 3200);
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; document.querySelector('.site-header').appendChild(bd); }
  const mqDesktop = window.matchMedia('(min-width: 901px)');
  const syncInert = () => {
    if (mqDesktop.matches) nav.removeAttribute('inert');
    else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false'); document.body.classList.remove('no-scroll');
    syncInert();
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
  mqDesktop.addEventListener('change', syncInert);
  syncInert();
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
  let ticking = false;
  const update = () => {
    ticking = false;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
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
  const els = document.querySelectorAll('[data-hero]');
  if (!els.length) return;
  const showAll = () => els.forEach(el => {
    el.style.opacity = 1; el.style.transform = 'none'; el.style.clipPath = 'none'; el.style.filter = 'none';
  });
  if (typeof gsap === 'undefined' || reduceMotion) { showAll(); return; }
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  tl.to('.hero .eyebrow', { y: 0, opacity: 1, duration: .7 }, 0)
    .to('.hero h1', { filter: 'blur(0px)', opacity: 1, duration: 1.05 }, .08)
    .to('.hero-sub', { y: 0, opacity: 1, duration: .8 }, .3)
    .to('.hero-ctas', { y: 0, opacity: 1, duration: .8 }, .45)
    .to('.hero-tags', { y: 0, opacity: 1, duration: .7 }, .58)
    .to('.hero-eleva', { clipPath: 'inset(0 0 0% 0)', opacity: 1, duration: 1.1, ease: 'power3.inOut' }, .42)
    .to('.hero-cutout', { y: 0, rotate: 0, scale: 1, opacity: 1, duration: 1, ease: 'back.out(1.4)' }, .8);
  const cotaParts = document.querySelectorAll('.hero-cota .cota-line');
  const cotaText = document.querySelector('.hero-cota text');
  if (cotaParts.length) {
    tl.fromTo(cotaParts, drawFrom(), { ...drawTo(), duration: .7, stagger: .08 }, .95);
    if (cotaText) tl.fromTo(cotaText, { opacity: 0 }, { opacity: 1, duration: .5 }, 1.35);
  }
}

function setStepFactory(steps) {
  let current = -1;
  return progress => {
    let idx = 0;
    if (progress >= .78) idx = 3;
    else if (progress >= .48) idx = 2;
    else if (progress >= .17) idx = 1;
    if (idx === current) return;
    current = idx;
    steps.forEach((s, i) => s.classList.toggle('is-on', i === idx));
  };
}

function buildProcesoTimeline(setStep, triggerConfig) {
  const stage = document.querySelector('.proceso-stage');
  const photo = stage.querySelector('.stage-photo');
  const badge = stage.querySelector('.stage-badge');
  const studs = stage.querySelectorAll('.pl-stud');
  const slab = stage.querySelectorAll('#pl-slab line');
  const plates = stage.querySelectorAll('.pl-plate');
  const braces = stage.querySelectorAll('.pl-brace');
  const roof = stage.querySelectorAll('#pl-roof line');
  const panels = stage.querySelectorAll('.pl-panel');
  const openings = stage.querySelectorAll('#pl-openings *');
  const cotas = stage.querySelectorAll('#pl-cotas line');
  const cotaTexts = stage.querySelectorAll('#pl-cotas text');
  const svg = stage.querySelector('.pl-svg');

  gsap.set(slab, drawFrom());
  gsap.set([plates, braces, roof, openings, cotas], drawFrom());
  gsap.set(studs, { scaleY: 0 });
  gsap.set([panels, cotaTexts], { opacity: 0 });
  gsap.set(photo, { clipPath: 'inset(100% 0 0 0)' });
  gsap.set(badge, { opacity: 0, scale: .8, y: 10 });
  gsap.set(svg, { opacity: 1 });

  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: { ...triggerConfig, scrub: .6, invalidateOnRefresh: true, onUpdate: self => setStep(self.progress) }
  });

  tl.to(slab, { ...drawTo(), duration: .5, stagger: .05 }, 0)
    .to(studs, { scaleY: 1, duration: .3, stagger: .07, ease: 'power1.out' }, .75)
    .to(plates, { ...drawTo(), duration: .35, stagger: .1 }, 1.35)
    .to(braces, { ...drawTo(), duration: .3, stagger: .1 }, 1.6)
    .to(roof, { ...drawTo(), duration: .4, stagger: .06 }, 1.85)
    .to(panels, { opacity: 1, duration: .25, stagger: .07 }, 2.35)
    .to(openings, { ...drawTo(), duration: .35, stagger: .08 }, 2.75)
    .to(cotas, { ...drawTo(), duration: .3, stagger: .05 }, 3.1)
    .to(cotaTexts, { opacity: 1, duration: .25 }, 3.3)
    .to(photo, { clipPath: 'inset(0% 0 0 0)', duration: .9, ease: 'power2.inOut' }, 3.75)
    .to(svg, { opacity: .15, duration: .5 }, 3.95)
    .to(badge, { opacity: 1, scale: 1, y: 0, duration: .4, ease: 'back.out(1.6)' }, 4.35);
  return tl;
}

function initProceso() {
  const pin = document.getElementById('procesoPin');
  if (!pin || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  const steps = pin.querySelectorAll('.proceso-step');
  const setStep = setStepFactory([...steps]);
  const mm = gsap.matchMedia();

  mm.add('(min-width: 1081px) and (prefers-reduced-motion: no-preference)', () => {
    setStep(0);
    buildProcesoTimeline(setStep, {
      trigger: pin, start: 'top top', end: '+=240%', pin: true, anticipatePin: 1
    });
  });

  mm.add('(max-width: 1080px) and (prefers-reduced-motion: no-preference)', () => {
    pin.classList.add('is-sticky-mobile');
    setStep(0);
    buildProcesoTimeline(setStep, {
      trigger: pin, start: 'top top', end: 'bottom bottom'
    });
    requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => pin.classList.remove('is-sticky-mobile');
  });
}

function initCounters() {
  const els = document.querySelectorAll('[data-counter]');
  if (!els.length || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) return;
  els.forEach(el => {
    const end = parseFloat(el.dataset.counter), obj = { v: 0 };
    gsap.to(obj, {
      v: end, duration: 1.6, ease: 'power1.out', snap: { v: 1 },
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      onUpdate: () => el.textContent = obj.v.toLocaleString('es-AR')
    });
  });
}

function initRail() {
  const vp = document.querySelector('.hscroll');
  if (!vp) return;
  vp.addEventListener('wheel', e => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
    const max = vp.scrollWidth - vp.clientWidth;
    if (max <= 1) return;
    const atStart = vp.scrollLeft <= 0, atEnd = vp.scrollLeft >= max - 1;
    if ((e.deltaY < 0 && atStart) || (e.deltaY > 0 && atEnd)) return;
    e.preventDefault();
    vp.scrollLeft += e.deltaY;
  }, { passive: false });

  let dragging = false, moved = false, startX = 0, startScroll = 0, pointerId = null;
  const THRESHOLD = 6;
  vp.addEventListener('pointerdown', e => {
    if (e.pointerType === 'touch' || e.button !== 0) return;
    dragging = true; moved = false; pointerId = e.pointerId;
    startX = e.clientX; startScroll = vp.scrollLeft;
  });
  vp.addEventListener('pointermove', e => {
    if (!dragging || e.pointerId !== pointerId) return;
    const dx = e.clientX - startX;
    if (!moved && Math.abs(dx) < THRESHOLD) return;
    if (!moved) { moved = true; vp.classList.add('dragging'); vp.setPointerCapture?.(pointerId); }
    e.preventDefault();
    vp.scrollLeft = startScroll - dx;
  });
  const end = e => {
    if (!dragging || (e && pointerId !== null && e.pointerId !== pointerId)) return;
    dragging = false;
    if (moved) {
      vp.releasePointerCapture?.(pointerId);
      vp.classList.remove('dragging');
      const kill = ev => { ev.stopPropagation(); ev.preventDefault(); };
      vp.addEventListener('click', kill, { capture: true, once: true });
      setTimeout(() => vp.removeEventListener('click', kill, { capture: true }), 0);
    }
    pointerId = null; moved = false;
  };
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
  vp.addEventListener('dragstart', e => e.preventDefault());
}

function initCierreLineas() {
  const lines = document.querySelectorAll('.cz-line');
  if (!lines.length || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) return;
  gsap.fromTo(lines, drawFrom(), {
    ...drawTo(), duration: 1.4, stagger: .12, ease: 'power2.out',
    scrollTrigger: { trigger: '.cierre', start: 'top 70%', once: true }
  });
}

function initMagnetic() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches || typeof gsap === 'undefined' || reduceMotion) return;
  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      gsap.to(btn, { x: (e.clientX - r.left - r.width / 2) * .22, y: (e.clientY - r.top - r.height / 2) * .22, duration: .3 });
    });
    btn.addEventListener('mouseleave', () => gsap.to(btn, { x: 0, y: 0, duration: .45, ease: 'elastic.out(1, .55)' }));
  });
}

function initFaqRefresh() {
  document.querySelectorAll('.faq-item').forEach(d => {
    d.addEventListener('toggle', () => {
      if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
    });
  });
}

function initMapa() {
  const el = document.getElementById('mapa');
  if (!el || typeof L === 'undefined') return;
  const map = L.map(el, { scrollWheelZoom: false, zoomControl: true }).setView([-37.108, -56.856], 12);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap &copy; CARTO', maxZoom: 18
  }).addTo(map);
  L.circleMarker([-37.108, -56.856], {
    radius: 10, color: '#0A66A3', weight: 3, fillColor: '#12A5E8', fillOpacity: .85
  }).addTo(map).bindPopup('Grupo Lozano · Pinamar');
}

function initForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const nombre = form.querySelector('#f-nombre');
    const tel = form.querySelector('#f-tel');
    let ok = true;
    [nombre, tel].forEach(input => {
      if (!input.value.trim()) { input.classList.add('field-error'); ok = false; }
      else input.classList.remove('field-error');
    });
    if (!ok) { showToast('Completá tu nombre y tu WhatsApp así te podemos responder.'); return; }
    const btn = form.querySelector('button[type="submit"]');
    const original = btn.innerHTML;
    btn.disabled = true;
    btn.textContent = 'Enviando…';
    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = original;
      form.reset();
      showToast('¡Gracias! El envío de mensajes se activa al pasar la web a producción.');
    }, 800);
  });
  form.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', () => input.classList.remove('field-error'));
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initWspFloat();
  initProgressBar();
  initReveals();
  initHero();
  initProceso();
  initCounters();
  initRail();
  initCierreLineas();
  initMagnetic();
  initFaqRefresh();
  initMapa();
  initForm();
});
