document.documentElement.classList.add('js');

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasGSAP = typeof gsap !== 'undefined';
const hasST = typeof ScrollTrigger !== 'undefined';

if (hasGSAP && hasST) gsap.registerPlugin(ScrollTrigger);
if (!hasGSAP) {
  document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
}
if (hasST) window.addEventListener('load', () => ScrollTrigger.refresh());

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

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
  const sync = () => { if (window.innerWidth > 768) { nav.removeAttribute('inert'); } else if (!nav.classList.contains('open')) { nav.setAttribute('inert', ''); } };
  sync();
  window.addEventListener('resize', sync, { passive: true });
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
  let ticking = false;
  const update = () => {
    ticking = false;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = `${max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0}%`;
  };
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  window.addEventListener('resize', update, { passive: true });
  update();
}

function initHero() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const bolt = hero.querySelector('.hero-bolt path');
  if (bolt && bolt.getTotalLength) {
    const len = bolt.getTotalLength();
    bolt.style.strokeDasharray = len;
    bolt.style.strokeDashoffset = reduceMotion ? 0 : len;
  }
  if (!hasGSAP || reduceMotion) {
    hero.querySelectorAll('.hero-title .line-in,.hero-kicker,.hero-sub,.hero-cta .btn,.hero-marks li,.hero-figure,.hero-seal').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
    return;
  }
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.fromTo('.hero-bg img', { scale: 1.09, opacity: .35 }, { scale: 1, opacity: 1, duration: 1.35, ease: 'power2.out' }, 0)
    .fromTo('.hero-kicker', { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: .7 }, .25)
    .fromTo('.hero-title .line-in', { yPercent: 112 }, { yPercent: 0, duration: 1.05, stagger: .1, ease: 'expo.out' }, .32)
    .fromTo('.hero-sub', { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: .8 }, .7)
    .fromTo('.hero-cta .btn', { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: .7, stagger: .1 }, .82)
    .fromTo('.hero-marks li', { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: .6, stagger: .08 }, .98)
    .fromTo('.hero-figure', { y: 64, opacity: 0, rotate: -2.5 }, { y: 0, opacity: 1, rotate: 0, duration: 1.2, ease: 'expo.out' }, .18)
    .fromTo('.hero-glow', { scale: .55, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.4, ease: 'power2.out' }, .3)
    .fromTo('.hero-seal', { scale: .82, opacity: 0 }, { scale: 1, opacity: 1, duration: .7, ease: 'back.out(1.6)' }, 1.05);
  if (bolt) tl.to(bolt, { strokeDashoffset: 0, duration: 1.6, ease: 'power1.inOut' }, .4);

  if (hasST) {
    gsap.to('.hero-bg img', { yPercent: 8, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: .5 } });
    gsap.to('.hero-bolt', { yPercent: -14, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: .8 } });
  }
}

function initRail() {
  const rail = document.getElementById('serviciosRail');
  if (!rail) return;
  let down = false, moved = false, startX = 0, startLeft = 0;
  rail.addEventListener('pointerdown', e => {
    if (e.button !== 0) return;
    down = true; moved = false; startX = e.clientX; startLeft = rail.scrollLeft;
    rail.classList.add('dragging');
  });
  rail.addEventListener('pointermove', e => {
    if (!down) return;
    const dx = e.clientX - startX;
    if (!moved && Math.abs(dx) > 6) { moved = true; rail.setPointerCapture(e.pointerId); }
    if (moved) { rail.scrollLeft = startLeft - dx; e.preventDefault(); }
  });
  const end = () => {
    if (!down) return;
    down = false;
    rail.classList.remove('dragging');
    if (moved) setTimeout(() => { moved = false; }, 0);
  };
  rail.addEventListener('pointerup', end);
  rail.addEventListener('pointercancel', end);
  rail.addEventListener('pointerleave', end);
  rail.addEventListener('click', e => { if (moved) { e.preventDefault(); e.stopPropagation(); } }, true);

  rail.addEventListener('wheel', e => {
    if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
    const max = rail.scrollWidth - rail.clientWidth;
    if (max <= 2) return;
    const atStart = rail.scrollLeft <= 0 && e.deltaY < 0;
    const atEnd = rail.scrollLeft >= max - 1 && e.deltaY > 0;
    if (atStart || atEnd) return;
    e.preventDefault();
    rail.scrollLeft += e.deltaY;
  }, { passive: false });

  if (window.matchMedia('(hover: hover)').matches) {
    rail.querySelectorAll('.svc').forEach(card => {
      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${e.clientX - r.left}px`);
        card.style.setProperty('--my', `${e.clientY - r.top}px`);
      });
    });
  }
}

function initDiagram() {
  const stage = document.getElementById('proceso');
  if (!stage) return;
  const frame = stage.querySelector('.diagram-frame');
  const pasos = [...stage.querySelectorAll('.paso')];
  const groups = [...stage.querySelectorAll('.dg-step')];
  const breakers = [...stage.querySelectorAll('.brk')];
  const roVolt = document.getElementById('roVolt');
  const roState = document.getElementById('roState');
  const grid = stage.querySelector('.stage-grid');
  const ESTADOS = ['Midiendo la línea', 'Tablero protegido', 'Circuitos separados', 'Instalación operativa'];

  breakers.forEach((b, i) => { b.style.transitionDelay = `${i * 0.09}s`; b.querySelector('.lever').style.transitionDelay = `${i * 0.09}s`; });

  const shapesOf = g => [...g.querySelectorAll('.wire,.earth,.node,.node-c')];
  const fadesOf = g => [...g.querySelectorAll('.glyph,.dg-label')];

  const showAll = () => {
    groups.forEach(g => {
      shapesOf(g).forEach(el => { el.style.strokeDasharray = 'none'; el.style.strokeDashoffset = 0; });
      fadesOf(g).forEach(el => { el.style.opacity = 1; });
    });
    breakers.forEach(b => b.classList.add('on'));
    pasos.forEach(p => p.classList.add('is-on'));
    if (roVolt) roVolt.textContent = '220';
    if (roState) roState.textContent = ESTADOS[3];
    frame?.classList.add('energized');
  };

  if (!hasGSAP || !hasST || reduceMotion) { showAll(); return; }

  groups.forEach(g => {
    shapesOf(g).forEach(el => {
      const len = el.getTotalLength ? el.getTotalLength() : 0;
      if (!len) return;
      el.style.strokeDasharray = len;
      el.style.strokeDashoffset = len;
    });
  });

  let activo = -1;
  const setStep = idx => {
    if (idx === activo) return;
    activo = idx;
    pasos.forEach((p, i) => p.classList.toggle('is-on', i === idx));
    breakers.forEach(b => b.classList.toggle('on', idx >= 1));
    if (roState) roState.textContent = ESTADOS[Math.max(0, idx)];
  };

  const buildTl = () => {
    const tl = gsap.timeline({ defaults: { ease: 'none' } });
    groups.forEach((g, i) => {
      tl.to(shapesOf(g), { strokeDashoffset: 0, duration: .74, stagger: .07 }, i)
        .to(fadesOf(g), { opacity: 1, duration: .3, stagger: .06 }, i + .4);
    });
    tl.to({}, { duration: .25 }, 3.85);
    return tl;
  };

  const onUpdate = self => {
    const p = self.progress;
    const D = 4.1;
    let idx = 0;
    for (let i = 3; i >= 0; i--) { if (p >= (i - .18) / D) { idx = i; break; } }
    setStep(idx);
    if (roVolt) {
      const v = Math.min(1, p / .2);
      roVolt.textContent = v < .08 ? '— —' : String(Math.round(v * 220));
    }
    frame?.classList.toggle('energized', p > .93);
  };

  const mm = gsap.matchMedia();

  mm.add('(min-width: 1081px)', () => {
    const tl = buildTl();
    const st = ScrollTrigger.create({
      animation: tl,
      trigger: '.pasos',
      start: 'top 62%',
      end: 'bottom 88%',
      scrub: .6,
      invalidateOnRefresh: true,
      onUpdate
    });
    return () => st.kill();
  });

  mm.add('(max-width: 1080px)', () => {
    stage.classList.add('is-sticky-mobile');
    const tl = buildTl();
    const st = ScrollTrigger.create({
      animation: tl,
      trigger: grid,
      start: 'top top',
      endTrigger: stage,
      end: 'bottom bottom',
      scrub: .6,
      invalidateOnRefresh: true,
      onUpdate
    });
    requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => { st.kill(); stage.classList.remove('is-sticky-mobile'); };
  });

  setStep(0);
}

function initCounters() {
  const nums = document.querySelectorAll('.count');
  if (!nums.length) return;
  if (!('IntersectionObserver' in window) || reduceMotion) {
    nums.forEach(n => { n.textContent = n.dataset.count; });
    return;
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      io.unobserve(el);
      const target = parseInt(el.dataset.count, 10) || 0;
      const dur = 1100;
      const t0 = window.performance.now();
      const tick = now => {
        const p = Math.min(1, (now - t0) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased).toLocaleString('es-AR');
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }, { threshold: .4 });
  nums.forEach(n => io.observe(n));
}

function initSplitParallax() {
  if (!hasGSAP || !hasST || reduceMotion) return;
  if (!window.matchMedia('(min-width: 1081px)').matches) return;
  const media = document.querySelector('.split-media');
  const copy = document.querySelector('.split-copy');
  if (!media || !copy) return;
  gsap.fromTo(media, { y: 46 }, {
    y: -46, ease: 'none',
    scrollTrigger: { trigger: '.split', start: 'top bottom', end: 'bottom top', scrub: .7, invalidateOnRefresh: true }
  });
  gsap.fromTo(copy, { y: 16 }, {
    y: -16, ease: 'none',
    scrollTrigger: { trigger: '.split', start: 'top bottom', end: 'bottom top', scrub: 1.1, invalidateOnRefresh: true }
  });
}

function initForm() {
  const form = document.getElementById('formContacto');
  if (!form) return;
  const btn = document.getElementById('formSubmit');
  const campos = [
    { input: form.querySelector('#f-nombre'), err: form.querySelector('#err-nombre'), test: v => v.trim().length >= 2, msg: 'Escribí tu nombre.' },
    { input: form.querySelector('#f-tel'), err: form.querySelector('#err-tel'), test: v => v.replace(/\D/g, '').length >= 8, msg: 'Necesitamos un WhatsApp para responderte.' },
    { input: form.querySelector('#f-msg'), err: form.querySelector('#err-msg'), test: v => v.trim().length >= 8, msg: 'Contanos brevemente qué necesitás.' }
  ];
  const tel = form.querySelector('#f-tel');
  tel?.addEventListener('input', () => {
    const d = tel.value.replace(/\D/g, '').slice(0, 10);
    tel.value = d.length > 6 ? `${d.slice(0, 2)} ${d.slice(2, 6)}-${d.slice(6)}` : d.length > 2 ? `${d.slice(0, 2)} ${d.slice(2)}` : d;
  });
  campos.forEach(c => {
    c.input?.addEventListener('input', () => {
      if (c.input.closest('.field').classList.contains('invalid') && c.test(c.input.value)) {
        c.input.closest('.field').classList.remove('invalid');
        c.input.removeAttribute('aria-invalid');
        c.err.textContent = '';
      }
    });
  });
  form.addEventListener('submit', e => {
    e.preventDefault();
    let ok = true, primero = null;
    campos.forEach(c => {
      const valido = c.test(c.input.value);
      c.input.closest('.field').classList.toggle('invalid', !valido);
      c.err.textContent = valido ? '' : c.msg;
      if (valido) c.input.removeAttribute('aria-invalid'); else c.input.setAttribute('aria-invalid', 'true');
      if (!valido && !primero) primero = c.input;
      if (!valido) ok = false;
    });
    if (!ok) { primero?.focus(); return; }
    btn.disabled = true;
    const original = btn.textContent;
    btn.textContent = 'Enviando…';
    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = original;
      form.reset();
      showToast('¡Gracias! El envío de mensajes se activa al pasar la web a producción.');
    }, 850);
  });
}

document.getElementById('anio')?.replaceChildren(String(new Date().getFullYear()));

initNav();
initReveals();
initWspFloat();
initProgress();
initHero();
initRail();
initDiagram();
initCounters();
initSplitParallax();
initForm();
