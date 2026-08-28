document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasGsap = typeof gsap !== 'undefined';
const hasST = typeof ScrollTrigger !== 'undefined';

if (hasGsap && hasST) {
  gsap.registerPlugin(ScrollTrigger);
}

if (!hasGsap) {
  document.querySelectorAll('[data-animate], [data-hero]').forEach(el => {
    el.style.opacity = 1;
    el.style.transform = 'none';
    el.style.clipPath = 'none';
  });
}

if (hasST) {
  window.addEventListener('load', () => ScrollTrigger.refresh());
}

const esc = s => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

function showToast(msg) {
  let wrap = document.querySelector('.toast-wrap');
  if (!wrap) {
    wrap = document.createElement('div');
    wrap.className = 'toast-wrap';
    wrap.setAttribute('aria-live', 'polite');
    document.body.appendChild(wrap);
  }
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  toast.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg><span>${esc(msg)}</span>`;
  wrap.appendChild(toast);
  setTimeout(() => { toast.classList.add('hiding'); setTimeout(() => toast.remove(), 220); }, 3600);
}

function setHeaderVar() {
  const header = document.querySelector('.masthead');
  if (!header) return;
  document.documentElement.style.setProperty('--header-h', `${Math.round(header.offsetHeight)}px`);
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  const header = document.querySelector('.masthead');
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) {
    bd = document.createElement('div');
    bd.className = 'nav-backdrop';
    (header || document.body).appendChild(bd);
  }
  const desktopMq = window.matchMedia('(min-width: 769px)');
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open');
    if (!desktopMq.matches) nav.setAttribute('inert', '');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
  };
  const open = () => {
    nav.classList.add('open'); bd.classList.add('open'); nav.removeAttribute('inert');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('no-scroll');
    nav.querySelector('a')?.focus();
  };
  toggle.addEventListener('click', () => (nav.classList.contains('open') ? close() : open()));
  closeBtn?.addEventListener('click', () => { close(); toggle.focus(); });
  bd.addEventListener('click', close);
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); }
  });
  const syncInert = () => {
    if (desktopMq.matches) nav.removeAttribute('inert');
    else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  desktopMq.addEventListener('change', syncInert);
  syncInert();
}

function initWspFloat() {
  const btn = document.getElementById('wsp-float');
  if (!btn) return;
  const sync = () => {
    if (window.scrollY > 600) btn.classList.add('visible');
    else btn.classList.remove('visible');
  };
  window.addEventListener('scroll', sync, { passive: true });
  sync();
}

function initHero() {
  const items = document.querySelectorAll('[data-hero]');
  if (!items.length) return;
  if (!hasGsap || reduceMotion) {
    items.forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
    return;
  }
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.from('.hero-sea', { clipPath: 'inset(100% 0 0 0)', duration: 1.15, ease: 'expo.out' }, 0)
    .from('.hero-sea img', { scale: 1.14, duration: 1.5, ease: 'power2.out' }, 0)
    .to('[data-hero="1"]', { opacity: 1, y: 0, duration: .7 }, .12)
    .fromTo('[data-hero="2"]',
      { filter: 'blur(12px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.05 }, .2)
    .to('[data-hero="3"]', { opacity: 1, y: 0, duration: .8 }, .42)
    .to('[data-hero="4"]', { opacity: 1, y: 0, duration: .75 }, .56)
    .to('[data-hero="5"]', { opacity: 1, y: 0, duration: .7 }, .7)
    .to('[data-hero="6"]', { opacity: 1, y: 0, duration: .7 }, .8);

  if (hasST) {
    gsap.to('.hero-sea img', {
      objectPosition: '50% 62%',
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .5, invalidateOnRefresh: true }
    });
  }
}

function initManifiesto() {
  const words = document.querySelectorAll('.manifiesto-quote .w');
  if (!words.length) return;
  if (!hasGsap || !hasST || reduceMotion) {
    words.forEach(w => { w.style.opacity = 1; });
    return;
  }
  gsap.to(words, {
    opacity: 1,
    ease: 'none',
    stagger: .35,
    scrollTrigger: {
      trigger: '.manifiesto-quote',
      start: 'top 82%',
      end: 'bottom 58%',
      scrub: .5,
      invalidateOnRefresh: true
    }
  });
}

function prepCarta() {
  document.querySelectorAll('.carta .bati, .carta .ruta').forEach(p => {
    const len = p.getTotalLength();
    p.style.strokeDasharray = len;
    p.style.strokeDashoffset = len;
  });
}

function cartaEstatica() {
  document.querySelectorAll('.carta .bati, .carta .ruta').forEach(p => { p.style.strokeDashoffset = 0; });
  document.querySelectorAll('.carta .corr, .carta .canal-borde, .carta .carta-label, .carta .carta-brujula, .carta .carta-marea, .carta .carta-apoyo, .carta .boya, .carta .nadador')
    .forEach(el => { el.style.opacity = 1; });
  const ruta = document.getElementById('ruta');
  const nad = document.getElementById('nadador');
  if (ruta && nad) {
    const p = ruta.getPointAtLength(ruta.getTotalLength());
    nad.setAttribute('transform', `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`);
  }
  document.getElementById('pasos')?.classList.add('is-static');
}

function buildCartaTl(tl) {
  const ruta = document.getElementById('ruta');
  const nad = document.getElementById('nadador');
  const len = ruta ? ruta.getTotalLength() : 0;
  const moveNad = t => {
    if (!ruta || !nad) return;
    const p = ruta.getPointAtLength(t * len);
    nad.setAttribute('transform', `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`);
  };
  moveNad(0);

  tl.to('.carta .bati', { strokeDashoffset: 0, duration: .85, stagger: .1, ease: 'none' }, 0)
    .to('.carta-costa .carta-label', { opacity: 1, duration: .3 }, .45)
    .to('.carta-marea', { opacity: 1, duration: .35 }, .55)
    .fromTo('.marea-flecha', { yPercent: 30 }, { yPercent: 0, duration: .5, ease: 'power2.out' }, .55)

    .fromTo('.carta .corr', { x: -22 }, { x: 0, opacity: 1, duration: .55, stagger: .1, ease: 'power2.out' }, 1)
    .to('.carta-label-corr', { opacity: 1, duration: .3 }, 1.25)
    .to('.carta .canal-borde', { opacity: 1, duration: .45, stagger: .1, ease: 'none' }, 1.5)
    .to('.carta-canal .carta-label', { opacity: 1, duration: .3 }, 1.7)

    .to('.carta-brujula', { opacity: 1, duration: .4 }, 2.05)
    .fromTo('.bruj-aguja-wrap', { rotation: 132, transformOrigin: '50% 50%' },
      { rotation: 0, duration: 1, ease: 'power3.out' }, 2.05)

    .to('.carta-apoyo', { opacity: 1, duration: .45 }, 3.05)
    .fromTo('.carta .boya', { opacity: 0, scale: .35, transformOrigin: '50% 50%' },
      { opacity: 1, scale: 1, duration: .55, stagger: .13, ease: 'back.out(2.2)' }, 3.15)

    .to('.carta .ruta', { strokeDashoffset: 0, duration: 1, ease: 'none' }, 4)
    .to('.nadador', { opacity: 1, duration: .3 }, 4.02)
    .to({ t: 0 }, {
      t: 1, duration: 1, ease: 'none',
      onUpdate() { moveNad(this.targets()[0].t); }
    }, 4)
    .to('.carta-label-fin', { opacity: 1, duration: .3 }, 4.72);

  return tl;
}

function initCarta() {
  const stage = document.getElementById('stage');
  const pasos = document.getElementById('pasos');
  if (!stage || !pasos) return;
  const items = [...pasos.querySelectorAll('.paso')];

  if (!hasGsap || !hasST) { cartaEstatica(); items.forEach(p => p.classList.add('is-on')); return; }

  prepCarta();

  const hudNow = document.getElementById('hudNow');
  const hudFill = document.getElementById('hudFill');
  const hudLabel = document.getElementById('hudLabel');
  const setStep = progress => {
    const i = Math.max(0, Math.min(items.length - 1, Math.floor(progress * items.length)));
    items.forEach((p, k) => p.classList.toggle('is-on', k === i));
    if (hudNow) hudNow.textContent = String(i + 1).padStart(2, '0');
    if (hudFill) hudFill.style.transform = `scaleX(${Math.max(0, Math.min(1, progress)).toFixed(3)})`;
    if (hudLabel) hudLabel.textContent = items[i]?.querySelector('h3')?.textContent || '';
  };

  const mm = gsap.matchMedia();

  mm.add('(prefers-reduced-motion: reduce)', () => {
    cartaEstatica();
    items.forEach(p => p.classList.add('is-on'));
  });

  mm.add('(min-width: 1081px) and (prefers-reduced-motion: no-preference)', () => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: stage,
        start: 'top top',
        end: '+=260%',
        pin: true,
        scrub: .6,
        invalidateOnRefresh: true,
        onUpdate: self => setStep(self.progress)
      }
    });
    buildCartaTl(tl);
    setStep(0);
  });

  mm.add('(max-width: 1080px) and (prefers-reduced-motion: no-preference)', () => {
    stage.classList.add('is-sticky-mobile');
    requestAnimationFrame(() => ScrollTrigger.refresh());
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: stage,
        start: 'top top',
        end: 'bottom bottom',
        scrub: .6,
        invalidateOnRefresh: true,
        onUpdate: self => setStep(self.progress)
      }
    });
    buildCartaTl(tl);
    setStep(0);
    return () => stage.classList.remove('is-sticky-mobile');
  });
}

function initRail() {
  const vp = document.getElementById('railVp');
  const track = document.getElementById('railTrack');
  const prev = document.getElementById('railPrev');
  const next = document.getElementById('railNext');
  if (!vp || !track) return;

  const stepSize = () => {
    const card = track.querySelector('.tcard');
    const gap = parseFloat(window.getComputedStyle(track).columnGap) || 16;
    return card ? card.getBoundingClientRect().width + gap : vp.clientWidth * .8;
  };
  const sync = () => {
    const inicio = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
    if (prev) prev.disabled = vp.scrollLeft <= inicio + 2;
    if (next) next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  const behavior = reduceMotion ? 'auto' : 'smooth';
  prev?.addEventListener('click', () => vp.scrollBy({ left: -stepSize(), behavior }));
  next?.addEventListener('click', () => vp.scrollBy({ left: stepSize(), behavior }));
  vp.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync, { passive: true });
  window.addEventListener('load', sync);
  sync();

  let down = false, moved = false, justDragged = false, startX = 0, startScroll = 0, pointerId = null;

  vp.addEventListener('pointerdown', e => {
    if (e.pointerType === 'touch') return;
    down = true; moved = false;
    startX = e.clientX; startScroll = vp.scrollLeft; pointerId = e.pointerId;
  });
  vp.addEventListener('pointermove', e => {
    if (!down) return;
    const dx = e.clientX - startX;
    if (!moved && Math.abs(dx) < 6) return;
    if (!moved) {
      moved = true;
      vp.classList.add('dragging');
      try { vp.setPointerCapture?.(pointerId); } catch { /* sin capture el drag igual funciona */ }
    }
    vp.scrollLeft = startScroll - dx;
  });
  const end = () => {
    if (!down) return;
    down = false;
    if (moved) {
      justDragged = true;
      try { vp.releasePointerCapture?.(pointerId); } catch { /* ya liberado */ }
      setTimeout(() => { justDragged = false; }, 60);
    }
    vp.classList.remove('dragging');
    moved = false;
  };
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
  vp.addEventListener('pointerleave', end);
  vp.addEventListener('click', e => {
    if (justDragged) { e.preventDefault(); e.stopPropagation(); }
  }, true);
}

function initParallax() {
  if (!hasGsap || !hasST || reduceMotion) return;
  document.querySelectorAll('[data-parallax]').forEach(el => {
    const f = parseFloat(el.dataset.parallax) || 0;
    gsap.fromTo(el, { y: -f * 130 }, {
      y: f * 130,
      ease: 'none',
      scrollTrigger: {
        trigger: el.closest('.postal') || el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: .6,
        invalidateOnRefresh: true
      }
    });
  });
}

function initFaq() {
  document.querySelectorAll('.faq details').forEach(d => {
    d.addEventListener('toggle', () => { if (hasST) ScrollTrigger.refresh(); });
  });
}

function initForm() {
  const form = document.getElementById('contactoForm');
  if (!form) return;
  const btn = document.getElementById('formSubmit');
  const campos = [
    { input: form.querySelector('#f-nombre'), err: form.querySelector('#e-nombre'), test: v => v.trim().length >= 2, msg: 'Contanos cómo te llamás.' },
    { input: form.querySelector('#f-email'), err: form.querySelector('#e-email'), test: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()), msg: 'Revisá el email, no parece válido.' },
    { input: form.querySelector('#f-mensaje'), err: form.querySelector('#e-mensaje'), test: v => v.trim().length >= 8, msg: 'Contanos un poco más para poder ayudarte.' }
  ];

  const validar = c => {
    const ok = c.test(c.input.value);
    c.input.setAttribute('aria-invalid', ok ? 'false' : 'true');
    c.err.textContent = ok ? '' : c.msg;
    return ok;
  };

  campos.forEach(c => {
    c.input.addEventListener('blur', () => validar(c));
    c.input.addEventListener('input', () => {
      if (c.input.getAttribute('aria-invalid') === 'true') validar(c);
    });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const todoOk = campos.map(validar).every(Boolean);
    if (!todoOk) {
      campos.find(c => c.input.getAttribute('aria-invalid') === 'true')?.input.focus();
      return;
    }
    const label = btn.querySelector('.btn-t');
    const original = label.textContent;
    btn.disabled = true;
    label.textContent = 'Enviando…';
    setTimeout(() => {
      btn.disabled = false;
      label.textContent = original;
      form.reset();
      campos.forEach(c => { c.input.setAttribute('aria-invalid', 'false'); c.err.textContent = ''; });
      showToast('¡Gracias! El envío de mensajes se activa al pasar la web a producción.');
    }, 800);
  });
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

document.documentElement.classList.add('js-ready');
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

setHeaderVar();
window.addEventListener('resize', setHeaderVar, { passive: true });
window.addEventListener('load', setHeaderVar);

initNav();
initHero();
initManifiesto();
initCarta();
initRail();
initParallax();
initFaq();
initForm();
initReveals();
initWspFloat();
