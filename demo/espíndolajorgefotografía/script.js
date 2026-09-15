document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasGsap = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';

if (hasGsap) gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') {
  document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; el.style.clipPath = 'none'; el.style.filter = 'none'; });
}
if (typeof ScrollTrigger !== 'undefined') {
  window.addEventListener('load', () => ScrollTrigger.refresh());
}

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

function showToast(msg) {
  let wrap = document.querySelector('.toast-wrap');
  if (!wrap) { wrap = document.createElement('div'); wrap.className = 'toast-wrap'; wrap.setAttribute('aria-live', 'polite'); document.body.appendChild(wrap); }
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  toast.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg><span>${esc(msg)}</span>`;
  wrap.appendChild(toast);
  setTimeout(() => { toast.classList.add('hiding'); setTimeout(() => toast.remove(), 220); }, 3600);
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  const bd = document.querySelector('.nav-backdrop');
  const close = () => {
    nav.classList.remove('open'); bd?.classList.remove('open'); nav.setAttribute('inert', '');
    toggle.setAttribute('aria-expanded', 'false'); document.body.classList.remove('no-scroll');
  };
  const open = () => {
    nav.classList.add('open'); bd?.classList.add('open'); nav.removeAttribute('inert');
    toggle.setAttribute('aria-expanded', 'true'); document.body.classList.add('no-scroll');
    nav.querySelector('a')?.focus();
  };
  toggle.addEventListener('click', () => (nav.classList.contains('open') ? close() : open()));
  closeBtn?.addEventListener('click', () => { close(); toggle.focus(); });
  bd?.addEventListener('click', close);
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); } });
  const mq = window.matchMedia('(min-width: 769px)');
  const sync = () => { if (mq.matches) { nav.removeAttribute('inert'); close(); } else if (!nav.classList.contains('open')) { nav.setAttribute('inert', ''); } };
  mq.addEventListener('change', sync);
  sync();
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

function initHero() {
  if (!hasGsap || reduceMotion) return;
  const lines = document.querySelectorAll('.hero-title .line > span');
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.from('.hero-eyebrow', { opacity: 0, y: 14, duration: 0.7 }, 0.05)
    .from(lines, { yPercent: 115, duration: 1.15, stagger: 0.1 }, 0.1)
    .from('.hero-lead', { opacity: 0, y: 20, duration: 0.9 }, 0.6)
    .from('.hero-cta .btn', { opacity: 0, y: 16, duration: 0.7, stagger: 0.09 }, 0.78)
    .from('.hero-exif', { opacity: 0, duration: 0.9 }, 0.95)
    .from('.hs-1', { opacity: 0, clipPath: 'inset(0 0 100% 0)', duration: 1.2, ease: 'expo.out' }, 0.25)
    .from('.hs-2', { opacity: 0, clipPath: 'inset(100% 0 0 0)', duration: 1.2, ease: 'expo.out' }, 0.45)
    .from('.hs-3', { opacity: 0, clipPath: 'inset(0 100% 0 0)', duration: 1.2, ease: 'expo.out' }, 0.65)
    .from('.hs img', { scale: 1.14, duration: 1.8, stagger: 0.1, ease: 'power2.out' }, 0.25);
}

function initChapter() {
  const chapter = document.getElementById('mirar');
  const vf = document.getElementById('viewfinder');
  if (!chapter || !vf) return;
  const shots = Array.from(chapter.querySelectorAll('.vf-shot-img'));
  const steps = Array.from(chapter.querySelectorAll('.step'));
  const exifEl = document.getElementById('vfExif');
  const shotEl = document.getElementById('vfShot');
  if (shots.length < 2 || !hasGsap || reduceMotion) return;

  chapter.classList.add('is-chapter');
  const TOTAL = steps.length;
  let current = -1;
  let snapTimer = null;

  const setStep = p => {
    const i = Math.min(TOTAL - 1, Math.max(0, Math.floor(p * TOTAL)));
    if (i === current) return;
    current = i;
    steps.forEach((s, k) => s.classList.toggle('is-on', k === i));
    if (exifEl) exifEl.textContent = steps[i]?.dataset.exif || '';
    if (shotEl) shotEl.textContent = String(i + 1).padStart(2, '0');
    vf.classList.add('snap');
    clearTimeout(snapTimer);
    snapTimer = setTimeout(() => vf.classList.remove('snap'), 220);
  };

  const buildTimeline = trigger => {
    gsap.set(shots.slice(1), { clipPath: 'inset(0 0 100% 0)' });
    gsap.set(shots[0], { clipPath: 'inset(0 0 0% 0)' });
    const tl = gsap.timeline({ scrollTrigger: trigger });
    shots.forEach((img, i) => {
      if (i > 0) tl.to(img, { clipPath: 'inset(0 0 0% 0)', duration: 0.6, ease: 'power2.inOut' }, i);
      tl.fromTo(img, { scale: 1.08 }, { scale: 1, duration: 1.4, ease: 'none' }, Math.max(0, i - 0.1));
    });
    tl.to({}, { duration: 0.25 }, TOTAL - 0.25);
    return tl;
  };

  const mm = gsap.matchMedia();

  mm.add('(min-width: 1081px)', () => {
    const tl = buildTimeline({
      trigger: chapter, start: 'top top', end: '+=280%', pin: true, scrub: 0.6,
      invalidateOnRefresh: true, onUpdate: self => setStep(self.progress)
    });
    current = -1; setStep(0);
    return () => { tl.scrollTrigger?.kill(); tl.kill(); };
  });

  mm.add('(max-width: 1080px)', () => {
    chapter.classList.add('is-sticky-mobile');
    requestAnimationFrame(() => ScrollTrigger.refresh());
    const tl = buildTimeline({
      trigger: chapter, start: 'top top', end: 'bottom bottom', scrub: 0.6,
      invalidateOnRefresh: true, onUpdate: self => setStep(self.progress)
    });
    current = -1; setStep(0);
    return () => {
      chapter.classList.remove('is-sticky-mobile');
      tl.scrollTrigger?.kill(); tl.kill();
      requestAnimationFrame(() => ScrollTrigger.refresh());
    };
  });
}

function initGallery() {
  const gal = document.getElementById('gal');
  if (!gal) return;
  const items = Array.from(gal.querySelectorAll('.gal-item'));
  const chips = Array.from(document.querySelectorAll('.chip'));
  const empty = document.getElementById('galEmpty');

  const applyFilter = cat => {
    const before = new Map(items.map(el => [el, el.getBoundingClientRect()]));
    gal.classList.toggle('is-filtered', cat !== 'todo');
    items.forEach(el => el.classList.toggle('is-hidden', cat !== 'todo' && el.dataset.cat !== cat));
    const visibles = items.filter(el => !el.classList.contains('is-hidden'));
    if (empty) empty.hidden = visibles.length > 0;

    if (!hasGsap || reduceMotion) return;
    visibles.forEach(el => {
      const f = before.get(el);
      const l = el.getBoundingClientRect();
      if (!f || f.width === 0) {
        gsap.fromTo(el, { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' });
        return;
      }
      const dx = f.left - l.left, dy = f.top - l.top;
      const sx = l.width ? f.width / l.width : 1;
      const sy = l.height ? f.height / l.height : 1;
      if (!dx && !dy && Math.abs(sx - 1) < 0.01 && Math.abs(sy - 1) < 0.01) return;
      gsap.fromTo(el,
        { x: dx, y: dy, scaleX: sx, scaleY: sy, transformOrigin: 'top left' },
        { x: 0, y: 0, scaleX: 1, scaleY: 1, duration: 0.65, ease: 'power3.out', clearProps: 'transform' });
    });
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  };

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => { c.classList.remove('is-active'); c.setAttribute('aria-pressed', 'false'); });
      chip.classList.add('is-active'); chip.setAttribute('aria-pressed', 'true');
      applyFilter(chip.dataset.filter);
    });
  });

  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lbImg');
  const lbCaption = document.getElementById('lbCaption');
  const lbExif = document.getElementById('lbExif');
  const lbClose = document.getElementById('lbClose');
  const lbPrev = document.getElementById('lbPrev');
  const lbNext = document.getElementById('lbNext');
  if (!lb) return;

  let pool = [];
  let idx = 0;
  let lastFocus = null;

  const paint = () => {
    const el = pool[idx];
    if (!el) return;
    const img = el.querySelector('img');
    lbImg.src = el.dataset.full || img?.src || '';
    lbImg.alt = img?.alt || '';
    lbCaption.textContent = el.dataset.caption || '';
    lbExif.textContent = `${el.dataset.exif || ''} · ${idx + 1} de ${pool.length}`;
  };

  const openLb = el => {
    pool = items.filter(i => !i.classList.contains('is-hidden'));
    idx = Math.max(0, pool.indexOf(el));
    lastFocus = el;
    lb.hidden = false;
    paint();
    requestAnimationFrame(() => lb.classList.add('open'));
    document.body.classList.add('no-scroll');
    lbClose.focus();
  };

  const closeLb = () => {
    lb.classList.remove('open');
    document.body.classList.remove('no-scroll');
    setTimeout(() => { lb.hidden = true; }, 260);
    lastFocus?.focus();
  };

  const move = dir => { idx = (idx + dir + pool.length) % pool.length; paint(); };

  items.forEach(el => el.addEventListener('click', () => openLb(el)));
  lbClose.addEventListener('click', closeLb);
  lbPrev.addEventListener('click', () => move(-1));
  lbNext.addEventListener('click', () => move(1));
  lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });

  document.addEventListener('keydown', e => {
    if (lb.hidden) return;
    if (e.key === 'Escape') { closeLb(); return; }
    if (e.key === 'ArrowLeft') { move(-1); return; }
    if (e.key === 'ArrowRight') { move(1); return; }
    if (e.key === 'Tab') {
      const focusables = [lbClose, lbPrev, lbNext];
      const i = focusables.indexOf(document.activeElement);
      e.preventDefault();
      const next = e.shiftKey ? (i <= 0 ? focusables.length - 1 : i - 1) : (i === focusables.length - 1 ? 0 : i + 1);
      focusables[next].focus();
    }
  });
}

function initRail() {
  const rail = document.getElementById('rail');
  const hint = document.querySelector('.rail-hint');
  if (!rail || !hint) return;
  rail.addEventListener('scroll', () => {
    hint.style.opacity = rail.scrollLeft > 30 ? '0' : '1';
  }, { passive: true });
}

function initForm() {
  const form = document.getElementById('formContacto');
  if (!form) return;
  const rules = [
    { id: 'f-nombre', err: 'e-nombre', test: v => v.trim().length >= 3, msg: 'Escribime tu nombre.' },
    { id: 'f-tel', err: 'e-tel', test: v => v.replace(/\D/g, '').length >= 8, msg: 'Dejame un teléfono para contestarte.' }
  ];
  const tel = document.getElementById('f-tel');
  tel?.addEventListener('input', () => {
    const d = tel.value.replace(/\D/g, '').slice(0, 10);
    if (d.length <= 3) tel.value = d;
    else if (d.length <= 6) tel.value = `${d.slice(0, 3)} ${d.slice(3)}`;
    else tel.value = `${d.slice(0, 3)} ${d.slice(3, 6)}-${d.slice(6)}`;
  });
  form.addEventListener('submit', e => {
    e.preventDefault();
    let ok = true;
    rules.forEach(r => {
      const input = document.getElementById(r.id);
      const errEl = document.getElementById(r.err);
      const valid = r.test(input?.value || '');
      input?.closest('.field')?.classList.toggle('invalid', !valid);
      input?.setAttribute('aria-invalid', valid ? 'false' : 'true');
      if (errEl) errEl.textContent = valid ? '' : r.msg;
      if (!valid && ok) { input?.focus(); ok = false; }
    });
    if (!ok) return;
    const btn = form.querySelector('button[type="submit"]');
    const label = btn.textContent;
    btn.disabled = true; btn.textContent = 'Enviando…';
    setTimeout(() => {
      btn.disabled = false; btn.textContent = label;
      form.reset();
      form.querySelectorAll('.field').forEach(f => f.classList.remove('invalid'));
      form.querySelectorAll('.err').forEach(f => (f.textContent = ''));
      showToast('¡Gracias! El envío de mensajes se activa al pasar la web a producción.');
    }, 800);
  });
}

function initMapa() {
  const el = document.getElementById('mapa');
  if (!el || typeof L === 'undefined') return;
  const map = L.map(el, { scrollWheelZoom: false }).setView([-31.4201, -64.1888], 13);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap &copy; CARTO', maxZoom: 19
  }).addTo(map);
  L.circleMarker([-31.4201, -64.1888], {
    radius: 10, color: '#C89A5B', weight: 2, fillColor: '#F2F0ED', fillOpacity: 0.9
  }).addTo(map).bindPopup('Jorge Espíndola Fotografía · Córdoba');
}

function init() {
  document.getElementById('year').textContent = new Date().getFullYear();
  initNav();
  initReveals();
  initWspFloat();
  initHero();
  initChapter();
  initGallery();
  initRail();
  initForm();
  initMapa();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
