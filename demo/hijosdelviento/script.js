const WA = '5492975340945';
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
  if (typeof DrawSVGPlugin !== 'undefined') gsap.registerPlugin(DrawSVGPlugin);
  if (typeof MotionPathPlugin !== 'undefined') gsap.registerPlugin(MotionPathPlugin);
}
if (typeof gsap === 'undefined') {
  document.querySelectorAll('[data-animate], .h-anim').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; el.style.clipPath = 'none'; });
}
if (typeof ScrollTrigger !== 'undefined') {
  window.addEventListener('load', () => ScrollTrigger.refresh());
}

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

function initHero() {
  const els = document.querySelectorAll('.h-anim');
  if (typeof gsap === 'undefined' || reduceMotion) {
    els.forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; el.style.clipPath = 'none'; });
    return;
  }
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  tl.to('.hero .eyebrow.h-anim', { opacity: 1, y: 0, duration: .7 }, .1)
    .to('.hero-brand', { opacity: 1, clipPath: 'inset(0 0 0% 0)', duration: 1.15 }, .18)
    .to('.scene-sol', { opacity: 1, scale: 1, duration: 1.3 }, .3)
    .to('.hero-claim', { opacity: 1, y: 0, duration: .85 }, .48)
    .to('.scene-zapas', { opacity: 1, y: 0, rotate: -7, duration: 1.1, ease: 'back.out(1.25)' }, .54)
    .to('.hero-sub', { opacity: 1, y: 0, duration: .8 }, .62)
    .to('.scene-gorra', { opacity: 1, y: 0, rotate: 9, duration: .9 }, .74)
    .to('.hero-ctas', { opacity: 1, y: 0, duration: .8 }, .76)
    .to('.scene-alti', { opacity: 1, duration: .5 }, .8)
    .to('.hero-stats', { opacity: 1, y: 0, duration: .75 }, .9);
  const heroPath = document.getElementById('heroAltiPath');
  if (heroPath && typeof DrawSVGPlugin !== 'undefined') {
    tl.from(heroPath, { drawSVG: '0%', duration: 1.6, ease: 'power2.inOut' }, .82);
  }
}

function initAltimetria() {
  const path = document.getElementById('altiPath');
  const dot = document.getElementById('altiDot');
  const postas = document.querySelectorAll('.posta');
  if (!path || !dot) return;
  const activar = idx => postas.forEach((p, i) => p.classList.toggle('activa', i === idx));
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) {
    postas.forEach(p => p.classList.add('activa'));
    return;
  }
  const base = { trigger: '#altiWrap', start: 'top 80%', end: 'top 35%', scrub: .35 };
  if (typeof DrawSVGPlugin !== 'undefined') {
    gsap.from(path, { drawSVG: '0%', ease: 'none', scrollTrigger: { ...base } });
  }
  if (typeof MotionPathPlugin !== 'undefined') {
    gsap.set(dot, { opacity: 1 });
    gsap.to(dot, {
      motionPath: { path: '#altiPath', align: '#altiPath', alignOrigin: [.5, .5] },
      ease: 'none',
      scrollTrigger: {
        ...base,
        onUpdate: self => activar(self.progress < .4 ? 0 : self.progress < .78 ? 1 : 2),
      },
    });
  } else {
    ScrollTrigger.create({
      ...base,
      onUpdate: self => activar(self.progress < .4 ? 0 : self.progress < .78 ? 1 : 2),
    });
  }
}

function initPhoneMock() {
  const phone = document.getElementById('phoneMock');
  const ring = document.getElementById('progRing');
  const num = document.getElementById('progNum');
  const items = phone ? phone.querySelectorAll('.phone-list li') : [];
  if (!phone || !ring || !num || !items.length) return;
  const HECHOS = 2;
  const LARGO = 119.4;
  const completar = () => {
    items.forEach((li, i) => { if (i < HECHOS) li.classList.add('hecho'); });
    num.textContent = HECHOS;
    ring.style.strokeDashoffset = LARGO - (LARGO * HECHOS / items.length);
  };
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) {
    completar();
    return;
  }
  ScrollTrigger.create({
    trigger: phone,
    start: 'top 75%',
    once: true,
    onEnter: () => {
      items.forEach((li, i) => {
        if (i >= HECHOS) return;
        setTimeout(() => li.classList.add('hecho'), 260 + i * 380);
      });
      const obj = { v: 0 };
      gsap.to(obj, {
        v: HECHOS, duration: 1.1, delay: .3, ease: 'power2.out', snap: { v: 1 },
        onUpdate: () => { num.textContent = obj.v; },
      });
      gsap.to(ring, {
        strokeDashoffset: LARGO - (LARGO * HECHOS / items.length),
        duration: 1.1, delay: .3, ease: 'power2.out',
      });
    },
  });
}

function initScrollFx() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) return;
  gsap.utils.toArray('.parallax').forEach(wrap => {
    const img = wrap.querySelector('img');
    if (!img) return;
    gsap.fromTo(img, { yPercent: -5 }, {
      yPercent: 5, ease: 'none',
      scrollTrigger: { trigger: wrap, start: 'top bottom', end: 'bottom top', scrub: true }
    });
  });
  document.querySelectorAll('[data-counter]').forEach(el => {
    const end = parseFloat(el.dataset.counter), obj = { v: 0 };
    gsap.to(obj, {
      v: end, duration: 1.4, ease: 'power1.out', snap: { v: 1 },
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      onUpdate: () => el.textContent = obj.v.toLocaleString('es-AR'),
    });
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

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; document.body.appendChild(bd); }
  const mq = window.matchMedia('(max-width: 768px)');
  const syncInert = () => {
    if (mq.matches && !nav.classList.contains('open')) nav.setAttribute('inert', '');
    else if (!mq.matches) nav.removeAttribute('inert');
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
  mq.addEventListener('change', syncInert);
  window.addEventListener('resize', syncInert, { passive: true });
  syncInert();
}

function initWspFloat() {
  const btn = document.getElementById('wsp-float');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) btn.classList.add('visible'); else btn.classList.remove('visible');
  }, { passive: true });
}

function initForm() {
  const form = document.getElementById('contactoForm');
  if (!form) return;
  const tel = document.getElementById('fTel');
  if (tel && typeof IMask !== 'undefined') {
    IMask(tel, { mask: '+54 9 000 000-0000' });
  }
  const marcar = (campo, msg) => {
    const wrap = campo.closest('.campo');
    const err = wrap?.querySelector('.error');
    wrap?.classList.toggle('invalido', !!msg);
    campo.setAttribute('aria-invalid', msg ? 'true' : 'false');
    if (err) err.textContent = msg || '';
    return !msg;
  };
  form.querySelectorAll('input, textarea').forEach(campo => {
    campo.addEventListener('input', () => {
      if (campo.closest('.campo')?.classList.contains('invalido')) marcar(campo, '');
    });
  });
  form.addEventListener('submit', e => {
    e.preventDefault();
    const nombre = document.getElementById('fNombre');
    const mensaje = document.getElementById('fMensaje');
    const btn = document.getElementById('btnEnviar');
    let ok = true;
    ok = marcar(nombre, nombre.value.trim().length < 2 ? 'Escribí tu nombre para saber con quién hablamos.' : '') && ok;
    ok = marcar(tel, tel.value.replace(/\D/g, '').length < 10 ? 'Necesitamos un WhatsApp válido para responderte.' : '') && ok;
    ok = marcar(mensaje, mensaje.value.trim().length < 8 ? 'Contanos brevemente tu objetivo.' : '') && ok;
    if (!ok) {
      form.querySelector('.campo.invalido input, .campo.invalido textarea')?.focus();
      return;
    }
    const original = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Enviando…';
    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = original;
      form.reset();
      showToast('¡Gracias! El envío de mensajes se activa al pasar la web a producción.');
    }, 800);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initWspFloat();
  initForm();
  initHero();
  initAltimetria();
  initPhoneMock();
  initScrollFx();
  initReveals();
});
