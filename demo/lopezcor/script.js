const heroReady = () => document.body.classList.add('hero-ready');
requestAnimationFrame(() => requestAnimationFrame(heroReady));
window.addEventListener('load', heroReady);

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasGsap = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';

if (hasGsap) gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') {
  document.querySelectorAll('[data-animate]').forEach(el => {
    el.style.opacity = 1; el.style.transform = 'none'; el.style.clipPath = 'none';
  });
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

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

function showToast(msg) {
  let wrap = document.querySelector('.toast-wrap');
  if (!wrap) { wrap = document.createElement('div'); wrap.className = 'toast-wrap'; wrap.setAttribute('aria-live', 'polite'); document.body.appendChild(wrap); }
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  toast.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg><span>${esc(msg)}</span>`;
  wrap.appendChild(toast);
  setTimeout(() => { toast.classList.add('hiding'); setTimeout(() => toast.remove(), 220); }, 3600);
}

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
  const mq = window.matchMedia('(min-width: 769px)');
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

function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;
  let queued = false;
  const update = () => {
    queued = false;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? Math.min(window.scrollY / max, 1) : 0})`;
  };
  window.addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(update); } }, { passive: true });
  window.addEventListener('resize', update, { passive: true });
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

function initHeroMotion() {
  const path = document.querySelector('.hero-route-path');
  if (path && !reduceMotion) {
    const len = path.getTotalLength();
    path.style.strokeDasharray = `${len}`;
    path.style.strokeDashoffset = `${len}`;
    path.style.transition = 'stroke-dashoffset 2.6s cubic-bezier(.16,1,.3,1) .3s';
    requestAnimationFrame(() => { path.style.strokeDashoffset = '0'; });
  }
  if (!hasGsap || reduceMotion) return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  gsap.to('.hero-grid-bg', { y: 70, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.6 } });
  gsap.to('.hero-truck-wrap', { y: -46, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.6 } });
  gsap.to('.hero-panel', { y: 26, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.6 } });
}

const RIG_ESTADOS = ['En muelle', 'Precintado', 'Enfriando', 'En ruta', 'Entregado'];

function rigStatic() {
  const frost = document.getElementById('rigFrost');
  const seal = document.getElementById('rigSeal');
  if (frost) frost.setAttribute('opacity', '0.28');
  if (seal) seal.setAttribute('opacity', '1');
  const temp = document.getElementById('hudTemp');
  const km = document.getElementById('hudKm');
  const estado = document.getElementById('hudEstado');
  if (temp) temp.textContent = '−18 °C';
  if (km) km.textContent = '712 km';
  if (estado) estado.textContent = 'En ruta';
  document.getElementById('viajePasos')?.classList.add('is-static');
  document.getElementById('viajeDots')?.setAttribute('hidden', '');
}

function initViaje() {
  const stage = document.getElementById('viajeStage');
  const pasos = document.getElementById('viajePasos');
  if (!stage || !pasos) return;
  if (!hasGsap || reduceMotion) { rigStatic(); return; }

  const items = Array.from(pasos.children);
  const dots = Array.from(document.getElementById('viajeDots')?.children || []);
  const elTemp = document.getElementById('hudTemp');
  const elKm = document.getElementById('hudKm');
  const elEstado = document.getElementById('hudEstado');
  let current = -1;

  const fmtTemp = t => (t > 0 ? '+' : t < 0 ? '−' : '') + Math.abs(Math.round(t)) + ' °C';
  const fmtKm = k => Math.round(k).toLocaleString('es-AR') + ' km';

  const setStep = p => {
    const i = p < 0.22 ? 0 : p < 0.36 ? 1 : p < 0.54 ? 2 : p < 0.82 ? 3 : 4;
    if (i !== current) {
      current = i;
      items.forEach((el, n) => el.classList.toggle('is-on', n === i));
      dots.forEach((el, n) => el.classList.toggle('is-on', n === i));
      if (elEstado) elEstado.textContent = RIG_ESTADOS[i];
    }
    let temp = 22;
    if (p >= 0.36 && p < 0.54) temp = 22 - ((p - 0.36) / 0.18) * 40;
    else if (p >= 0.54) temp = -18;
    if (elTemp) elTemp.textContent = fmtTemp(temp);
    let km = 0;
    if (p >= 0.54 && p < 0.82) km = ((p - 0.54) / 0.28) * 712;
    else if (p >= 0.82) km = 712;
    if (elKm) elKm.textContent = fmtKm(km);
  };

  const setup = () => {
    gsap.set('#pallets .pallet', { x: -96, opacity: 0 });
    gsap.set('#doorTop', { rotation: -74, svgOrigin: '62 66' });
    gsap.set('#doorBottom', { rotation: 74, svgOrigin: '62 252' });
    gsap.set('#rigFrost', { opacity: 0 });
    gsap.set('#rigSeal', { opacity: 0, scale: 0.7, transformOrigin: '50% 50%' });
    gsap.set('#rigSpeed', { opacity: 0, x: 20 });
    gsap.set('#rigPod', { opacity: 0, y: 14, scale: 0.92, transformOrigin: '50% 50%' });
    gsap.set('#roadDashes', { x: 0 });
    gsap.set('.wheel', { rotation: 0, transformOrigin: '50% 50%' });
    gsap.set('#fan', { rotation: 0, transformOrigin: '50% 50%' });
    gsap.set('#rigBody', { x: 0 });
  };

  const buildTl = () => {
    const tl = gsap.timeline({ defaults: { ease: 'none' } });
    tl.to('#pallets .pallet', { x: 0, opacity: 1, duration: 0.7, stagger: 0.3, ease: 'power2.out' }, 0)
      .to('#doorTop', { rotation: 0, svgOrigin: '62 66', duration: 1, ease: 'power2.inOut' }, 2.3)
      .to('#doorBottom', { rotation: 0, svgOrigin: '62 252', duration: 1, ease: 'power2.inOut' }, 2.3)
      .to('#rigSeal', { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(2)' }, 3.1)
      .to('#fan', { rotation: 1440, duration: 6.2, ease: 'power1.in' }, 3.5)
      .to('#rigFrost', { opacity: 0.3, duration: 1.5 }, 3.7)
      .to('#rigBody', { x: 14, duration: 0.5, ease: 'power2.out' }, 5.3)
      .to('#roadDashes', { x: -240, duration: 2.8 }, 5.4)
      .to('.wheel', { rotation: 1400, duration: 2.8 }, 5.4)
      .to('#rigSpeed', { opacity: 1, x: 0, duration: 0.5 }, 5.6)
      .to('#rigSpeed', { opacity: 0, duration: 0.4 }, 7.9)
      .to('#rigBody', { x: 0, duration: 0.5, ease: 'power2.out' }, 8.1)
      .to('#doorTop', { rotation: -64, svgOrigin: '62 66', duration: 0.8, ease: 'power2.inOut' }, 8.3)
      .to('#doorBottom', { rotation: 64, svgOrigin: '62 252', duration: 0.8, ease: 'power2.inOut' }, 8.3)
      .to('#rigSeal', { opacity: 0, duration: 0.3 }, 8.3)
      .to('#pallets .pallet', { x: -96, opacity: 0, duration: 0.5, stagger: -0.12, ease: 'power2.in' }, 8.6)
      .to('#rigFrost', { opacity: 0.12, duration: 0.8 }, 8.8)
      .to('#rigPod', { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'back.out(1.6)' }, 9.1)
      .to({}, { duration: 0.6 });
    return tl;
  };

  const mm = gsap.matchMedia();

  mm.add('(min-width: 1081px) and (prefers-reduced-motion: no-preference)', () => {
    setup();
    const tl = buildTl();
    const st = ScrollTrigger.create({
      animation: tl, trigger: stage, start: 'top top', end: '+=260%',
      pin: true, scrub: 0.6, invalidateOnRefresh: true,
      onUpdate: self => setStep(self.progress)
    });
    setStep(0);
    return () => { st.kill(); tl.kill(); };
  });

  mm.add('(max-width: 1080px) and (prefers-reduced-motion: no-preference)', () => {
    stage.classList.add('is-sticky-mobile');
    setup();
    const tl = buildTl();
    const st = ScrollTrigger.create({
      animation: tl, trigger: stage, start: 'top top', end: 'bottom bottom',
      scrub: 0.6, invalidateOnRefresh: true,
      onUpdate: self => setStep(self.progress)
    });
    setStep(0);
    requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => { st.kill(); tl.kill(); stage.classList.remove('is-sticky-mobile'); };
  });

  mm.add('(prefers-reduced-motion: reduce)', () => {
    rigStatic();
    return () => {};
  });
}

function initTermografo() {
  const line = document.getElementById('termoLine');
  if (!line) return;
  const len = line.getTotalLength();
  line.style.strokeDasharray = `${len}`;
  if (!hasGsap || reduceMotion) { line.style.strokeDashoffset = '0'; return; }
  line.style.strokeDashoffset = `${len}`;
  gsap.to(line, {
    strokeDashoffset: 0, ease: 'none',
    scrollTrigger: { trigger: '.termografo', start: 'top 85%', end: 'bottom 62%', scrub: 0.5 }
  });
}

function initMapa() {
  const svg = document.getElementById('mapaSvg');
  const filas = Array.from(document.querySelectorAll('#corrList li'));
  if (!svg) return;
  const corr = Array.from(svg.querySelectorAll('.mapa-corr path'));
  const nodos = Array.from(svg.querySelectorAll('.mapa-nodos g'));

  corr.forEach(p => {
    const len = p.getTotalLength();
    p.style.strokeDasharray = `${len}`;
    p.style.strokeDashoffset = hasGsap && !reduceMotion ? `${len}` : '0';
  });

  if (hasGsap && !reduceMotion) {
    gsap.to(corr, {
      strokeDashoffset: 0, duration: 1, stagger: 0.16, ease: 'power2.out',
      scrollTrigger: { trigger: '.cobertura-mapa', start: 'top 78%' }
    });
    gsap.from(nodos, {
      opacity: 0, scale: 0.5, transformOrigin: '50% 50%', duration: 0.6, stagger: 0.16, ease: 'back.out(1.8)',
      scrollTrigger: { trigger: '.cobertura-mapa', start: 'top 78%' }, delay: 0.25
    });
  }

  const activar = (key, on) => {
    corr.forEach(p => { if (p.dataset.corr === key) p.classList.toggle('is-active', on); });
    nodos.forEach(g => { if (g.dataset.node === key) g.classList.toggle('is-active', on); });
    filas.forEach(li => { if (li.dataset.node === key) li.classList.toggle('is-active', on); });
  };
  filas.forEach(li => {
    li.addEventListener('mouseenter', () => activar(li.dataset.node, true));
    li.addEventListener('mouseleave', () => activar(li.dataset.node, false));
  });
  nodos.forEach(g => {
    g.addEventListener('mouseenter', () => activar(g.dataset.node, true));
    g.addEventListener('mouseleave', () => activar(g.dataset.node, false));
  });
}

function initTrayectoria() {
  const img = document.getElementById('trayImg');
  if (!img || !hasGsap || reduceMotion) return;
  gsap.fromTo(img,
    { yPercent: -5, scale: 1.14 },
    { yPercent: 5, scale: 1.14, ease: 'none', scrollTrigger: { trigger: '.tray-frame', start: 'top bottom', end: 'bottom top', scrub: 0.6 } }
  );
}

function initFaq() {
  document.querySelectorAll('.faq details').forEach(d => {
    d.addEventListener('toggle', () => {
      if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
    });
  });
}

function initForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  const btn = document.getElementById('formSubmit');
  const label = btn ? btn.innerHTML : '';
  form.addEventListener('submit', e => {
    e.preventDefault();
    let ok = true;
    [['f-nombre', 2], ['f-tel', 6]].forEach(([id, min]) => {
      const input = document.getElementById(id);
      if (!input) return;
      const field = input.closest('.field');
      const valido = input.value.trim().length >= min;
      field?.classList.toggle('has-error', !valido);
      input.setAttribute('aria-invalid', valido ? 'false' : 'true');
      if (!valido && ok) { input.focus(); ok = false; }
    });
    if (!ok) return;
    if (btn) { btn.disabled = true; btn.innerHTML = 'Enviando…'; }
    setTimeout(() => {
      if (btn) { btn.disabled = false; btn.innerHTML = label; }
      form.reset();
      showToast('¡Gracias! El envío de mensajes se activa al pasar la web a producción.');
    }, 850);
  });
  form.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', () => {
      input.closest('.field')?.classList.remove('has-error');
      input.setAttribute('aria-invalid', 'false');
    });
  });
}

function initYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}

initNav();
initWspFloat();
initScrollProgress();
initReveals();
initHeroMotion();
initViaje();
initTermografo();
initMapa();
initTrayectoria();
initFaq();
initForm();
initYear();
