document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5493534148365';

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

let revealIO = null;
function initReveals() {
  const items = document.querySelectorAll('[data-animate]');
  if (!items.length) return;
  if (!reduceMotion) {
    document.querySelectorAll('[data-animate-stagger]').forEach(parent => {
      parent.querySelectorAll('[data-animate]').forEach((el, i) => {
        el.style.transitionDelay = `${Math.min(i * 0.1, 0.7)}s`;
      });
    });
  }
  if (!('IntersectionObserver' in window) || reduceMotion) {
    items.forEach(el => el.classList.add('in'));
    return;
  }
  revealIO = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('in'); revealIO.unobserve(entry.target); }
    });
  }, { threshold: 0, rootMargin: '0px 0px -7% 0px' });
  items.forEach(el => revealIO.observe(el));

  let queued = false;
  const sweep = () => {
    queued = false;
    let pending = 0;
    items.forEach(el => {
      if (el.classList.contains('in')) return;
      const r = el.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight) { el.classList.add('in'); revealIO.unobserve(el); }
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
  const close = () => {
    nav.classList.remove('open');
    nav.setAttribute('inert', '');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
    document.documentElement.classList.remove('no-scroll');
  };
  const open = () => {
    nav.classList.add('open');
    nav.removeAttribute('inert');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('no-scroll');
    document.documentElement.classList.add('no-scroll');
    nav.querySelector('a')?.focus();
  };
  toggle.addEventListener('click', () => (nav.classList.contains('open') ? close() : open()));
  closeBtn?.addEventListener('click', () => { close(); toggle.focus(); });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  document.addEventListener('keydown', e => {
    if (!nav.classList.contains('open')) return;
    if (e.key === 'Escape') { close(); toggle.focus(); return; }
    if (e.key === 'Tab') {
      const f = nav.querySelectorAll('a[href],button:not([disabled])');
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
}

function initWspFloat() {
  const btn = document.getElementById('wsp-float');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) btn.classList.add('visible'); else btn.classList.remove('visible');
  }, { passive: true });
}

const DESTINOS_LABEL = ['Costa', 'Playa', 'Pueblo', 'Cascada', 'Lago', 'Salar'];

function construirNodos() {
  const base = document.getElementById('rutaPath');
  const g = document.getElementById('rutaNodos');
  if (!base || !g || typeof base.getTotalLength !== 'function') return [];
  const total = base.getTotalLength();
  if (!total) return [];
  const n = DESTINOS_LABEL.length;
  const frag = [];
  for (let i = 0; i < n; i++) {
    const p = base.getPointAtLength(total * (i / (n - 1)));
    frag.push(`<circle class="ruta-nodo" data-nodo="${i}" cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="7"/>`);
    frag.push(`<text class="ruta-label" data-label="${i}" x="${p.x.toFixed(1)}" y="${(p.y - 18).toFixed(1)}" text-anchor="middle">${DESTINOS_LABEL[i]}</text>`);
  }
  g.innerHTML = frag.join('');
  return [...g.querySelectorAll('.ruta-nodo')];
}

function initItinerario() {
  const stage = document.getElementById('itinerario');
  const base = document.getElementById('rutaPath');
  const trazo = document.getElementById('rutaTrazo');
  const fotos = [...document.querySelectorAll('.ruta-foto')];
  const fichas = [...document.querySelectorAll('#destinos li')];
  const nodos = construirNodos();
  const labels = [...document.querySelectorAll('.ruta-label')];
  const n = fichas.length;
  if (!stage || !n) return;

  const marcar = idx => {
    fotos.forEach((f, i) => f.classList.toggle('is-on', i === idx));
    fichas.forEach((li, i) => li.classList.toggle('is-on', i === idx));
    nodos.forEach((c, i) => c.classList.toggle('is-on', i <= idx));
    labels.forEach((t, i) => t.classList.toggle('is-on', i === idx));
  };
  marcar(0);

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || !trazo || typeof base?.getTotalLength !== 'function') {
    return;
  }

  const largo = base.getTotalLength();
  const preparar = () => {
    gsap.set(trazo, { strokeDasharray: largo, strokeDashoffset: largo });
  };
  const pintar = pr => marcar(Math.max(0, Math.min(n - 1, Math.floor(pr * n))));

  const mm = gsap.matchMedia();

  mm.add('(min-width: 1081px) and (prefers-reduced-motion: no-preference)', () => {
    preparar();
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: stage, start: 'top top', end: '+=230%', pin: true, scrub: 0.6,
        invalidateOnRefresh: true, onUpdate: self => pintar(self.progress)
      }
    });
    tl.to(trazo, { strokeDashoffset: 0, ease: 'none', duration: 1 }, 0);
    return () => { tl.scrollTrigger?.kill(); tl.kill(); gsap.set(trazo, { clearProps: 'all' }); };
  });

  mm.add('(max-width: 1080px) and (prefers-reduced-motion: no-preference)', () => {
    stage.classList.add('is-sticky-mobile');
    preparar();
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: stage, start: 'top top', end: 'bottom bottom', scrub: 0.6,
        invalidateOnRefresh: true, onUpdate: self => pintar(self.progress)
      }
    });
    tl.to(trazo, { strokeDashoffset: 0, ease: 'none', duration: 1 }, 0);
    requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => {
      stage.classList.remove('is-sticky-mobile');
      tl.scrollTrigger?.kill(); tl.kill();
      gsap.set(trazo, { clearProps: 'all' });
      requestAnimationFrame(() => ScrollTrigger.refresh());
    };
  });

  mm.add('(prefers-reduced-motion: reduce)', () => {
    gsap.set(trazo, { strokeDasharray: 'none', strokeDashoffset: 0 });
    marcar(0);
    nodos.forEach(c => c.classList.add('is-on'));
    return () => {};
  });
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  if (!window.matchMedia('(min-width: 761px)').matches) return;
  gsap.utils.toArray('.gal-item').forEach((el, i) => {
    gsap.fromTo(el, { y: 0 }, {
      y: i % 2 ? -26 : -54, ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1 }
    });
  });
  const word = document.querySelector('.cierre-word span');
  if (word) {
    gsap.to(word, { xPercent: -5, ease: 'none', scrollTrigger: { trigger: '.cierre', start: 'top bottom', end: 'bottom top', scrub: 1 } });
  }
}

function initHero() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.from('.hero-bg', { scale: 1.08, duration: 1.6, ease: 'power2.out' }, 0)
    .from('.hero-eyebrow', { y: 18, opacity: 0, duration: .7 }, .25)
    .from('.hero h1', { y: 34, opacity: 0, duration: 1 }, .35)
    .from('.hero-lead', { y: 22, opacity: 0, duration: .8 }, .55)
    .from('.hero-cta > *', { y: 20, opacity: 0, duration: .7, stagger: .1 }, .7)
    .from('.hero-meta', { opacity: 0, duration: .8 }, .9);
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.to('.hero-bg', { yPercent: 12, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .8 } });
  }
}

function initForm() {
  const form = document.getElementById('formContacto');
  if (!form) return;
  const tel = document.getElementById('tel');
  tel?.addEventListener('input', () => {
    const d = tel.value.replace(/\D/g, '').slice(0, 10);
    tel.value = d.length > 6 ? `${d.slice(0, 3)} ${d.slice(3, 6)}-${d.slice(6)}` : d.length > 3 ? `${d.slice(0, 3)} ${d.slice(3)}` : d;
  });
  const marcar = (campo, msg) => {
    const el = document.getElementById(campo);
    const err = document.querySelector(`[data-error="${campo}"]`);
    if (err) err.textContent = msg || '';
    if (el) el.setAttribute('aria-invalid', msg ? 'true' : 'false');
    return !msg;
  };
  form.addEventListener('submit', e => {
    e.preventDefault();
    const nombre = document.getElementById('nombre');
    const okNombre = marcar('nombre', nombre.value.trim().length < 2 ? 'Escribí tu nombre para saber cómo llamarte.' : '');
    const digitos = (tel?.value || '').replace(/\D/g, '');
    const okTel = marcar('tel', digitos.length < 8 ? 'Dejame un WhatsApp con característica para poder responderte.' : '');
    if (!okNombre || !okTel) {
      (!okNombre ? nombre : tel)?.focus();
      return;
    }
    const btn = document.getElementById('btnEnviar');
    const txt = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Enviando…';
    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = txt;
      form.reset();
      marcar('nombre', ''); marcar('tel', '');
      showToast('¡Gracias! El envío de mensajes se activa al pasar la web a producción.');
    }, 800);
  });
}

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}
if (typeof gsap === 'undefined') {
  document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
  document.querySelectorAll('[data-shutter]').forEach(el => { el.style.clipPath = 'none'; });
}
if (typeof ScrollTrigger !== 'undefined') {
  window.addEventListener('load', () => ScrollTrigger.refresh());
}

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initReveals();
  initWspFloat();
  initItinerario();
  initParallax();
  initHero();
  initForm();
});
