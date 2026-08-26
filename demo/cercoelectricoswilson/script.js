const WHATSAPP_NUMBER = '5492323331353';
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
}
if (typeof gsap === 'undefined') {
  document.querySelectorAll('[data-animate]').forEach(el => {
    el.style.opacity = 1; el.style.transform = 'none'; el.style.clipPath = 'none'; el.style.filter = 'none';
  });
}
if (typeof ScrollTrigger !== 'undefined') {
  window.addEventListener('load', () => ScrollTrigger.refresh());
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
  setTimeout(() => { toast.classList.add('hiding'); setTimeout(() => toast.remove(), 220); }, 3200);
}

function initWspLinks() {
  document.querySelectorAll('[data-wsp-msg]').forEach(a => {
    a.href = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(a.dataset.wspMsg);
  });
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) {
    bd = document.createElement('div');
    bd.className = 'nav-backdrop';
    const header = document.querySelector('.site-header');
    (header || document.body).appendChild(bd);
  }
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
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); }
  });
  const syncInert = () => {
    if (desktopMq.matches) nav.removeAttribute('inert');
    else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  desktopMq.addEventListener('change', syncInert);
  window.addEventListener('resize', syncInert, { passive: true });
  syncInert();
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

function initCapitulo() {
  const stage = document.querySelector('.stage');
  if (!stage) return;
  const pasos = [...stage.querySelectorAll('.paso')];
  const escena = stage.querySelector('.escena');
  if (!pasos.length || !escena) return;

  const setStep = progreso => {
    const i = Math.max(0, Math.min(pasos.length - 1, Math.floor(progreso * pasos.length)));
    pasos.forEach((el, k) => el.classList.toggle('is-on', k === i));
    stage.classList.toggle('is-live', progreso > 0.9);
  };

  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    stage.classList.add('is-static', 'is-live');
    pasos.forEach(el => el.classList.add('is-on'));
    return;
  }

  stage.classList.add('is-armed');

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: stage,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.55,
      invalidateOnRefresh: true,
      onUpdate: self => setStep(self.progress)
    }
  });

  tl.fromTo(escena.querySelectorAll('.esc-poste'),
      { opacity: 0, scaleY: 0, transformOrigin: '50% 100%' },
      { opacity: 1, scaleY: 1, duration: 0.16, stagger: 0.03, ease: 'power2.out' }, 0)
    .fromTo(escena.querySelectorAll('.esc-aisladores circle'),
      { opacity: 0, scale: 0, transformOrigin: '50% 50%' },
      { opacity: 1, scale: 1, duration: 0.13, stagger: 0.007, ease: 'back.out(2)' }, 0.21)
    .fromTo(escena.querySelectorAll('.esc-hilo'),
      { strokeDashoffset: 480 },
      { strokeDashoffset: 0, duration: 0.19, stagger: 0.018, ease: 'none' }, 0.41)
    .fromTo(escena.querySelector('.esc-energizador'),
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.13, ease: 'power2.out' }, 0.62)
    .fromTo(escena.querySelector('.esc-remate'),
      { opacity: 0, scale: 0.92, transformOrigin: '50% 100%' },
      { opacity: 1, scale: 1, duration: 0.13, ease: 'power2.out' }, 0.8);

  setStep(0);
  requestAnimationFrame(() => ScrollTrigger.refresh());
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  const foto = document.querySelector('.porque-media img');
  if (!foto) return;
  gsap.fromTo(foto,
    { yPercent: -4, scale: 1.1 },
    {
      yPercent: 4, scale: 1.1, ease: 'none',
      scrollTrigger: { trigger: '.porque-media', start: 'top bottom', end: 'bottom top', scrub: 0.6 }
    });
}

function initForm() {
  const form = document.getElementById('formPresupuesto');
  if (!form) return;
  const btn = document.getElementById('btnEnviar');
  const tel = form.querySelector('#f-tel');

  tel?.addEventListener('input', () => {
    const d = tel.value.replace(/\D/g, '').slice(0, 11);
    if (d.length <= 2) tel.value = d;
    else if (d.length <= 6) tel.value = `${d.slice(0, 2)} ${d.slice(2)}`;
    else tel.value = `${d.slice(0, 2)} ${d.slice(2, 6)}-${d.slice(6)}`;
  });

  const marcar = (campo, errorId, valido) => {
    const err = document.getElementById(errorId);
    if (valido) {
      campo.removeAttribute('aria-invalid');
      campo.removeAttribute('aria-describedby');
      if (err) err.hidden = true;
    } else {
      campo.setAttribute('aria-invalid', 'true');
      campo.setAttribute('aria-describedby', errorId);
      if (err) err.hidden = false;
    }
    return valido;
  };

  form.addEventListener('submit', e => {
    e.preventDefault();
    const nombre = form.querySelector('#f-nombre');
    const okNombre = marcar(nombre, 'err-nombre', nombre.value.trim().length >= 2);
    const okTel = marcar(tel, 'err-tel', tel.value.replace(/\D/g, '').length >= 8);
    if (!okNombre || !okTel) {
      form.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }
    const contenido = btn.innerHTML;
    btn.disabled = true;
    btn.textContent = 'Enviando…';
    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = contenido;
      form.reset();
      showToast('¡Gracias! El envío de mensajes se activa al pasar la web a producción.');
    }, 800);
  });
}

function initAnio() {
  const el = document.getElementById('anio');
  if (el) el.textContent = new Date().getFullYear();
}

initWspLinks();
initCapitulo();
initParallax();
initReveals();
initNav();
initWspFloat();
initForm();
initAnio();
