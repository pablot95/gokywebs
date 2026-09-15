const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const HAS_GSAP = typeof gsap !== 'undefined';
const HAS_ST = typeof ScrollTrigger !== 'undefined';

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

if (HAS_GSAP && HAS_ST) gsap.registerPlugin(ScrollTrigger);

if (!HAS_GSAP) {
  document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
}

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

function initDevToolsGuard() {
  let overlay = null;
  let open = false;
  window.setInterval(() => {
    const isOpen = window.outerWidth - window.innerWidth > 200 || window.outerHeight - window.innerHeight > 200;
    if (isOpen === open) return;
    open = isOpen;
    if (open) {
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'devtools-overlay';
        overlay.innerHTML = '<p>Contenido protegido.</p>';
        document.body.appendChild(overlay);
      }
      overlay.classList.add('visible');
    } else if (overlay) {
      overlay.classList.remove('visible');
    }
  }, 800);
}

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

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  const header = document.querySelector('.site-header');
  if (!toggle || !nav || !header) return;

  let bd = header.querySelector('.nav-backdrop');
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
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); }
  });

  const syncNav = () => {
    if (window.innerWidth > 768) { close(); nav.removeAttribute('inert'); }
    else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  syncNav();
  window.addEventListener('resize', syncNav);
}

function initWspFloat() {
  const btn = document.getElementById('wsp-float');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) btn.classList.add('visible'); else btn.classList.remove('visible');
  }, { passive: true });
}

const REVEALS = {
  'rise': { y: 0, opacity: 1, duration: .9, ease: 'power3.out' },
  'rise-sm': { y: 0, opacity: 1, duration: .75, ease: 'power3.out' },
  'chip': { y: 0, opacity: 1, duration: .8, ease: 'back.out(1.5)' },
  'pop': { y: 0, scale: 1, opacity: 1, duration: .85, ease: 'back.out(1.3)' },
  'beam': { scaleX: 1, opacity: 1, duration: .95, ease: 'power2.out' }
};

function revealVars(el) {
  const kind = el.dataset.animate;
  if (kind === 'mask') return null;
  return { ...(REVEALS[kind] || REVEALS.rise) };
}

function playMask(el, delay = 0) {
  const img = el.querySelector('img');
  gsap.set(el, { clipPath: 'inset(0% 0% 100% 0%)' });
  gsap.to(el, { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, duration: 1.15, delay, ease: 'power3.inOut' });
  if (img) gsap.fromTo(img, { scale: 1.14 }, { scale: 1, duration: 1.5, delay, ease: 'power2.out' });
}

function initReveals() {
  if (!HAS_GSAP || !HAS_ST) return;
  const done = new WeakSet();

  document.querySelectorAll('[data-animate-stagger]').forEach(group => {
    if (group.closest('.hero')) return;
    const kids = [...group.querySelectorAll('[data-animate]')];
    if (!kids.length) return;
    kids.forEach(k => done.add(k));
    ScrollTrigger.create({
      trigger: group,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        kids.forEach((k, i) => {
          const d = i * 0.13;
          if (k.dataset.animate === 'mask') playMask(k, d);
          else gsap.to(k, { ...revealVars(k), delay: d });
        });
      }
    });
  });

  document.querySelectorAll('[data-animate]').forEach(el => {
    if (done.has(el) || el.closest('.hero')) return;
    ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      once: true,
      onEnter: () => {
        if (el.dataset.animate === 'mask') playMask(el);
        else gsap.to(el, revealVars(el));
      }
    });
  });
}

function initHero() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  if (HAS_GSAP && !REDUCED) {
    const field = hero.querySelector('.hero-field');
    const panel = hero.querySelector('.hero-panel');
    const rows = hero.querySelectorAll('.hp-rows li');
    const badge = hero.querySelector('.hp-badge');
    const mini = hero.querySelector('.hero-mini');
    const scaleMark = hero.querySelector('.hero-scale');
    const seal = hero.querySelector('.hero-seal');
    const chips = hero.querySelectorAll('.hero-chip');
    const q = s => hero.querySelector(s);

    if (field) gsap.set(field, { clipPath: 'inset(0% 0% 100% 0%)' });

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    if (field) tl.to(field, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: 'power3.inOut' }, 0);
    tl.to(q('.eyebrow'), { y: 0, opacity: 1, duration: .7 }, .15)
      .to(q('h1'), { y: 0, opacity: 1, duration: 1 }, .24)
      .to(q('.hero-rule'), { scaleX: 1, opacity: 1, duration: .9 }, .5)
      .to(q('.hero-lead'), { y: 0, opacity: 1, duration: .85 }, .55)
      .to(q('.hero-actions'), { y: 0, opacity: 1, duration: .85 }, .68);
    if (q('.hero-proof')) tl.to(q('.hero-proof'), { y: 0, opacity: 1, duration: .75 }, .8);
    if (panel) tl.from(panel, { y: 46, opacity: 0, duration: 1.05 }, .3);
    if (scaleMark) tl.from(scaleMark, { scale: .78, opacity: 0, duration: .85, ease: 'back.out(1.4)' }, .5);
    if (mini) tl.from(mini, { x: 26, y: 16, opacity: 0, duration: .85 }, .64);
    if (rows.length) tl.to(rows, { y: 0, opacity: 1, duration: .55, stagger: .09 }, .74);
    if (badge) tl.to(badge, { y: 0, scale: 1, opacity: 1, duration: .6, ease: 'back.out(1.6)' }, 1.2);
    if (chips.length) tl.to(chips, { y: 0, opacity: 1, duration: .8, stagger: .11, ease: 'back.out(1.5)' }, 1.02);
    if (seal) tl.from(seal, { scale: .6, opacity: 0, duration: .8, ease: 'back.out(1.6)' }, 1.14);
  } else if (HAS_GSAP) {
    hero.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
  }

  if (REDUCED || !window.matchMedia('(hover: hover)').matches) return;
  const layers = [...hero.querySelectorAll('.layer')];
  if (!layers.length) return;
  let raf = null;
  hero.addEventListener('pointermove', e => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = null;
      const r = hero.getBoundingClientRect();
      const cx = (e.clientX - r.left) / r.width - .5;
      const cy = (e.clientY - r.top) / r.height - .5;
      layers.forEach(l => {
        const d = Number(l.dataset.depth || 12);
        l.style.setProperty('--mx', (cx * d * -1).toFixed(1) + 'px');
        l.style.setProperty('--my', (cy * d * -.6).toFixed(1) + 'px');
      });
    });
  });
  hero.addEventListener('pointerleave', () => {
    layers.forEach(l => { l.style.setProperty('--mx', '0px'); l.style.setProperty('--my', '0px'); });
  });
}

function initMetodo() {
  const stage = document.getElementById('metodoStage');
  if (!stage) return;
  const steps = [...document.querySelectorAll('#metodoSteps li')];

  if (!HAS_GSAP || !HAS_ST) {
    stage.classList.add('is-static');
    steps.forEach(s => s.classList.add('is-on'));
    return;
  }

  const beam = document.getElementById('scaleBeam');
  const panL = document.getElementById('panLeft');
  const panR = document.getElementById('panRight');
  const chipsL = stage.querySelectorAll('.chip-l');
  const chipsR = stage.querySelectorAll('.chip-r');
  const seal = document.getElementById('scaleSeal');
  const levelPath = document.querySelector('#scaleLevel path');
  const pend = document.getElementById('scalePend');

  const setStep = p => {
    const i = p < .3 ? 0 : p < .56 ? 1 : p < .8 ? 2 : 3;
    steps.forEach((s, n) => s.classList.toggle('is-on', n === i));
  };

  const mm = gsap.matchMedia();

  mm.add('(min-width: 1081px) and (prefers-reduced-motion: no-preference)', () => {
    const state = { tilt: 0, pend: 0 };
    const apply = () => {
      gsap.set(beam, { rotation: state.tilt, svgOrigin: '310 118' });
      gsap.set(panL, { rotation: -state.tilt, svgOrigin: '110 118' });
      gsap.set(panR, { rotation: -state.tilt, svgOrigin: '510 118' });
      if (pend) pend.textContent = String(Math.round(state.pend));
    };
    gsap.set(chipsL, { opacity: 0, y: -120 });
    gsap.set(chipsR, { opacity: 0, y: -120 });
    gsap.set(seal, { opacity: 0, scale: .6 });
    gsap.set(levelPath, { opacity: 0 });
    apply();

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: stage,
        start: 'top top',
        end: '+=240%',
        pin: true,
        scrub: .6,
        onUpdate: self => setStep(self.progress)
      }
    });

    tl.to(chipsL, { opacity: 1, y: 0, duration: .55, stagger: .14, ease: 'power2.out' }, 0)
      .to(state, { tilt: -11, pend: 6, duration: 1, onUpdate: apply, ease: 'power2.inOut' }, 0)
      .to(chipsR, { opacity: 1, y: 0, duration: .55, stagger: .14, ease: 'power2.out' }, 1.1)
      .to(state, { tilt: -4.5, duration: .7, onUpdate: apply, ease: 'power1.inOut' }, 1.25)
      .to(state, { tilt: 0, duration: .8, onUpdate: apply, ease: 'power2.inOut' }, 2.05)
      .to(levelPath, { opacity: 1, duration: .35 }, 2.5)
      .to(state, { pend: 0, duration: .6, onUpdate: apply, ease: 'power2.out' }, 2.6)
      .to(seal, { opacity: 1, scale: 1, duration: .5, ease: 'back.out(1.7)' }, 2.7);

    return () => { steps.forEach(s => s.classList.remove('is-on')); };
  });

  mm.add('(prefers-reduced-motion: reduce)', () => {
    stage.classList.add('is-static');
    if (pend) pend.textContent = '0';
    return () => stage.classList.remove('is-static');
  });

  mm.add('(max-width: 1080px) and (prefers-reduced-motion: no-preference)', () => {
    stage.classList.add('is-sticky-mobile');

    const state = { tilt: 0, pend: 0 };
    const apply = () => {
      gsap.set(beam, { rotation: state.tilt, svgOrigin: '310 118' });
      gsap.set(panL, { rotation: -state.tilt, svgOrigin: '110 118' });
      gsap.set(panR, { rotation: -state.tilt, svgOrigin: '510 118' });
      if (pend) pend.textContent = String(Math.round(state.pend));
    };
    gsap.set(chipsL, { opacity: 0, y: -50 });
    gsap.set(chipsR, { opacity: 0, y: -50 });
    gsap.set(seal, { opacity: 0, scale: .6 });
    gsap.set(levelPath, { opacity: 0 });
    apply();

    // Misma coreografia que desktop, sin pin: .scale-wrap se mantiene visible
    // por CSS position:sticky, y este scrub (atado al alto real de los pasos)
    // sincroniza el tilt/las chips con el scroll nativo, sin trabarlo.
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

    tl.to(chipsL, { opacity: 1, y: 0, duration: .55, stagger: .14, ease: 'power2.out' }, 0)
      .to(state, { tilt: -11, pend: 6, duration: 1, onUpdate: apply, ease: 'power2.inOut' }, 0)
      .to(chipsR, { opacity: 1, y: 0, duration: .55, stagger: .14, ease: 'power2.out' }, 1.1)
      .to(state, { tilt: -4.5, duration: .7, onUpdate: apply, ease: 'power1.inOut' }, 1.25)
      .to(state, { tilt: 0, duration: .8, onUpdate: apply, ease: 'power2.inOut' }, 2.05)
      .to(levelPath, { opacity: 1, duration: .35 }, 2.5)
      .to(state, { pend: 0, duration: .6, onUpdate: apply, ease: 'power2.out' }, 2.6)
      .to(seal, { opacity: 1, scale: 1, duration: .5, ease: 'back.out(1.7)' }, 2.7);

    // is-sticky-mobile cambia el alto del stage (pasa a 300svh): sin este refresh
    // el trigger conserva las medidas del layout viejo y el capitulo no avanza.
    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => { stage.classList.remove('is-sticky-mobile'); steps.forEach(s => s.classList.remove('is-on')); };
  });
}

function initTower() {
  const tower = document.getElementById('tower');
  const list = document.getElementById('consList');
  if (!tower || !list) return;

  const floors = new Map();
  tower.querySelectorAll('.tower-floor').forEach(f => floors.set(f.dataset.floor, f));
  const items = [...list.querySelectorAll('li')];
  let hovering = false;

  const activate = li => {
    items.forEach(i => i.classList.toggle('is-active', i === li));
    floors.forEach(f => f.classList.remove('is-lit'));
    if (li) floors.get(li.dataset.floor)?.classList.add('is-lit');
  };

  items.forEach(li => {
    li.addEventListener('pointerenter', () => { hovering = true; activate(li); });
    li.addEventListener('pointerleave', () => { hovering = false; });
  });

  const visible = new Set();
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) visible.add(e.target); else visible.delete(e.target); });
    if (hovering) return;
    const first = items.find(i => visible.has(i));
    if (first) activate(first);
  }, { rootMargin: '-46% 0px -46% 0px' });
  items.forEach(li => io.observe(li));

  if (REDUCED) return;
  const seq = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      obs.disconnect();
      const order = [...floors.values()].reverse();
      order.forEach((f, i) => setTimeout(() => f.classList.add('is-lit'), 95 * i));
      setTimeout(() => order.forEach(f => f.classList.remove('is-lit')), 95 * order.length + 900);
    });
  }, { threshold: .35 });
  seq.observe(tower);
}

function initCounters() {
  const els = [...document.querySelectorAll('[data-count]')];
  if (!els.length) return;
  const fmt = (n, el) => (el.dataset.prefix || '') + Math.round(n).toLocaleString('es-AR') + (el.dataset.suffix || '');

  const run = el => {
    const target = Number(el.dataset.count) || 0;
    if (REDUCED) { el.textContent = fmt(target, el); return; }
    const dur = 1400;
    const t0 = window.performance.now();
    const tick = now => {
      const p = Math.min(1, (now - t0) / dur);
      el.textContent = fmt(target * (1 - Math.pow(1 - p, 3)), el);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => { if (e.isIntersecting) { run(e.target); obs.unobserve(e.target); } });
  }, { threshold: .5 });
  els.forEach(el => io.observe(el));
}

function setError(field, msg) {
  const wrap = field.closest('.field');
  wrap?.classList.toggle('has-error', Boolean(msg));
  field.setAttribute('aria-invalid', msg ? 'true' : 'false');
  return msg;
}

function initForms() {
  const form = document.getElementById('contactForm');
  const errBox = document.getElementById('formError');
  const submit = document.getElementById('formSubmit');

  form?.addEventListener('submit', e => {
    e.preventDefault();
    const nombre = form.nombre;
    const apellido = form.apellido;
    const email = form.email;
    const historia = form.historia;

    const errs = [
      setError(nombre, nombre.value.trim().length < 2 ? 'Escribí tu nombre.' : ''),
      setError(apellido, apellido.value.trim().length < 2 ? 'Escribí tu apellido.' : ''),
      setError(email, /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim()) ? '' : 'Revisá el email.'),
      setError(historia, historia.value.trim().length < 12 ? 'Contanos un poco más de tu negocio.' : '')
    ].filter(Boolean);
    const msg = errs[0] || '';

    if (errBox) errBox.textContent = msg;
    if (msg) { form.querySelector('.has-error input, .has-error textarea')?.focus(); return; }

    submit.disabled = true;
    const original = submit.textContent;
    submit.textContent = 'Enviando…';
    setTimeout(() => {
      submit.disabled = false;
      submit.textContent = original;
      form.reset();
      showToast('¡Gracias! El envío de mensajes se activa al pasar la web a producción.');
    }, 850);
  });

  const news = document.getElementById('newsForm');
  const newsErr = document.getElementById('newsError');
  news?.addEventListener('submit', e => {
    e.preventDefault();
    const email = news.email;
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim());
    email.setAttribute('aria-invalid', ok ? 'false' : 'true');
    if (newsErr) newsErr.textContent = ok ? '' : 'Revisá el email para suscribirte.';
    if (!ok) { email.focus(); return; }
    const btn = news.querySelector('button');
    btn.disabled = true;
    const original = btn.textContent;
    btn.textContent = 'Suscribiendo…';
    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = original;
      news.reset();
      showToast('Suscripción registrada. El envío real se activa al pasar la web a producción.');
    }, 850);
  });
}

function initMagnetic() {
  const btn = document.getElementById('cierreCta');
  if (!btn || REDUCED || !window.matchMedia('(hover: hover)').matches) return;
  btn.addEventListener('pointermove', e => {
    const r = btn.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) * .28;
    const y = (e.clientY - r.top - r.height / 2) * .34;
    btn.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
  });
  btn.addEventListener('pointerleave', () => { btn.style.transform = ''; });
}

function initFaq() {
  document.querySelectorAll('.faq-list details').forEach(d => {
    d.addEventListener('toggle', () => { if (HAS_ST) ScrollTrigger.refresh(); });
  });
}

function initYear() {
  const y = document.getElementById('year');
  if (y) y.textContent = String(new Date().getFullYear());
}

initDevToolsGuard();
initNav();
initWspFloat();
initHero();
initReveals();
initMetodo();
initTower();
initCounters();
initForms();
initMagnetic();
initFaq();
initYear();

if (HAS_ST) window.addEventListener('load', () => ScrollTrigger.refresh());
