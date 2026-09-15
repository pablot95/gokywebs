document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

function showToast(msg) {
  let wrap = document.getElementById('toastWrap');
  if (!wrap) { wrap = document.createElement('div'); wrap.className = 'toast-wrap'; wrap.id = 'toastWrap'; wrap.setAttribute('aria-live', 'polite'); document.body.appendChild(wrap); }
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
  const header = document.querySelector('.site-header');
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; header.appendChild(bd); }
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

function initHero() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.from('.hero-bg img', { scale: 1.09, duration: 1.35, ease: 'power2.out' }, 0)
    .from('.hero-eyebrow', { y: 16, opacity: 0, duration: .6 }, .12)
    .from('.hero-title .hl i', { yPercent: 112, duration: .9, stagger: .08 }, .18)
    .from('.hero-sub', { y: 20, opacity: 0, duration: .7 }, .5)
    .from('.hero-cta .btn', { y: 18, opacity: 0, duration: .6, stagger: .09 }, .6)
    .from('.hero-datos li', { y: 16, opacity: 0, duration: .6, stagger: .08 }, .72)
    .from('.escena-casco', { y: 40, opacity: 0, rotate: -6, duration: 1 }, .36)
    .from('.escena-cota', { x: -18, opacity: 0, duration: .55 }, .92)
    .from('.seam-sello', { opacity: 0, duration: .55 }, 1.02);
}

function initContadores() {
  const nums = document.querySelectorAll('[data-count]');
  if (!nums.length) return;
  if (reduceMotion || typeof gsap === 'undefined') {
    nums.forEach(el => { el.textContent = el.dataset.count; });
    return;
  }
  nums.forEach(el => {
    const destino = parseInt(el.dataset.count, 10) || 0;
    const obj = { v: 0 };
    gsap.to(obj, {
      v: destino, duration: 1.5, ease: 'power2.out', delay: 1,
      onUpdate: () => { el.textContent = Math.round(obj.v); }
    });
  });
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('[data-parallax]').forEach(el => {
    const amt = parseFloat(el.dataset.parallax) || .1;
    gsap.to(el, {
      yPercent: amt * 100, ease: 'none',
      scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: .6, invalidateOnRefresh: true }
    });
  });
  const taladro = document.querySelector('.serv-taladro');
  if (taladro) {
    gsap.to(taladro, {
      y: -30, rotate: 4, ease: 'none',
      scrollTrigger: { trigger: '.servicios', start: 'top bottom', end: 'top center', scrub: .6, invalidateOnRefresh: true }
    });
  }
}

/* ---------- coreografia mayor: la pared que se cierra ---------- */
const PRO_CHIPS = ['Día 1', 'Día 1', 'Día 2', 'Listo'];

function initProceso() {
  const stage = document.getElementById('proStage');
  const pasos = document.getElementById('proPasos');
  const chip = document.getElementById('proChip');
  const montantes = document.getElementById('proMontantes');
  const placaA = document.getElementById('placaA');
  const placaB = document.getElementById('placaB');
  const junta = document.getElementById('proJunta');
  const final = document.getElementById('proFinal');
  if (!stage || !pasos || !montantes) return;

  const items = Array.from(pasos.children);
  const lineas = Array.from(montantes.querySelectorAll('path'));
  const largos = lineas.map(l => l.getTotalLength());
  lineas.forEach((l, i) => {
    l.style.strokeDasharray = largos[i];
    l.style.strokeDashoffset = largos[i];
  });

  const setStep = progress => {
    const i = Math.min(items.length - 1, Math.max(0, Math.floor(progress * items.length)));
    items.forEach((li, n) => li.classList.toggle('is-on', n === i));
    if (chip) chip.textContent = PRO_CHIPS[i];
  };

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) {
    stage.classList.add('is-static');
    items.forEach(li => li.classList.add('is-on'));
    lineas.forEach(l => { l.style.strokeDashoffset = 0; });
    if (final) final.style.opacity = 1;
    return;
  }

  const construir = tl => {
    gsap.set([placaA, placaB], { opacity: 0, transformOrigin: 'center top', scaleY: 0 });
    gsap.set(final, { opacity: 0 });
    gsap.set(junta, { opacity: 0 });

    tl.to(lineas, { strokeDashoffset: 0, duration: .3, ease: 'none', stagger: .022 }, 0)
      .to([placaA, placaB], { opacity: 1, duration: .01 }, .34)
      .to([placaA, placaB], { scaleY: 1, duration: .22, ease: 'power2.inOut', stagger: .05 }, .34)
      .to(junta, { opacity: 1, duration: .06 }, .58)
      .to(junta, { opacity: 0, duration: .12, ease: 'power1.in' }, .72)
      .to(final, { opacity: 1, duration: .16, ease: 'power2.out' }, .82)
      .to({}, { duration: .04 });
  };

  const mm = gsap.matchMedia();

  mm.add('(min-width: 1081px) and (prefers-reduced-motion: no-preference)', () => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: stage, start: 'top top', end: '+=260%',
        pin: true, scrub: .6, invalidateOnRefresh: true,
        onUpdate: self => setStep(self.progress)
      }
    });
    construir(tl);
    setStep(0);
    return () => { gsap.set([placaA, placaB, junta, final], { clearProps: 'all' }); };
  });

  mm.add('(max-width: 1080px) and (prefers-reduced-motion: no-preference)', () => {
    stage.classList.add('is-sticky-mobile');
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: stage, start: 'top top', end: 'bottom bottom',
        scrub: .6, invalidateOnRefresh: true,
        onUpdate: self => setStep(self.progress)
      }
    });
    construir(tl);
    setStep(0);
    requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => {
      stage.classList.remove('is-sticky-mobile');
      gsap.set([placaA, placaB, junta, final], { clearProps: 'all' });
    };
  });
}

function initFaq() {
  document.querySelectorAll('.faq-lista details').forEach(d => {
    d.addEventListener('toggle', () => {
      if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
    });
  });
}

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}
if (typeof gsap === 'undefined') {
  document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; el.style.clipPath = 'none'; });
  document.querySelectorAll('[data-count]').forEach(el => { el.textContent = el.dataset.count; });
}

initNav();
initWspFloat();
initReveals();
initHero();
initContadores();
initParallax();
initProceso();
initFaq();

const anioEl = document.getElementById('anio');
if (anioEl) anioEl.textContent = new Date().getFullYear();

if (typeof ScrollTrigger !== 'undefined') {
  window.addEventListener('load', () => ScrollTrigger.refresh());
  let lastH = document.documentElement.scrollHeight;
  let estables = 0;
  const vigilarAlto = () => {
    const h = document.documentElement.scrollHeight;
    if (h !== lastH) { lastH = h; estables = 0; ScrollTrigger.refresh(); }
    else estables++;
    if (estables < 20) setTimeout(vigilarAlto, 100);
  };
  setTimeout(vigilarAlto, 100);
}
