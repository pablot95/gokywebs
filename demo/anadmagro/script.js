const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const clamp = (v, a, b) => Math.min(Math.max(v, a), b);

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
  document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
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
  setTimeout(() => { toast.classList.add('hiding'); setTimeout(() => toast.remove(), 220); }, 3200);
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; document.body.appendChild(bd); }
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
  const sync = () => {
    if (window.matchMedia('(min-width: 861px)').matches) { nav.removeAttribute('inert'); close(); }
    else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
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

const ALM_RANGOS = ['Julio – Septiembre', 'Octubre – Diciembre', 'Enero – Marzo', 'Abril – Junio'];

function initAlmanaque() {
  const alm = document.getElementById('alm');
  const meses = [...document.querySelectorAll('#almMeses li')];
  const pasos = [...document.querySelectorAll('#almPasos li')];
  const etapa = document.getElementById('almEtapa');
  const rango = document.getElementById('almRango');
  if (!alm || !pasos.length) return;
  const titulos = pasos.map(li => li.querySelector('h3')?.textContent || '');

  if (typeof ScrollTrigger === 'undefined' || reduceMotion) {
    alm.classList.add('no-st');
    pasos.forEach(li => li.classList.add('is-on'));
    meses.forEach(li => li.classList.add('on'));
    return;
  }

  let curPaso = -1, curMes = -1;
  const set = p => {
    const iP = clamp(Math.floor(p * pasos.length), 0, pasos.length - 1);
    if (iP !== curPaso) {
      curPaso = iP;
      pasos.forEach((li, k) => li.classList.toggle('is-on', k === iP));
      if (etapa) etapa.textContent = titulos[iP];
      if (rango) rango.textContent = ALM_RANGOS[iP] || '';
    }
    const llenos = clamp(Math.floor(p * 12) + 1, 1, 12);
    if (llenos !== curMes) {
      curMes = llenos;
      meses.forEach((li, k) => {
        li.classList.toggle('on', k < llenos);
        li.classList.toggle('now', k === llenos - 1);
      });
    }
  };
  set(0);
  ScrollTrigger.create({
    trigger: alm,
    start: 'top top',
    end: 'bottom bottom',
    scrub: true,
    invalidateOnRefresh: true,
    onUpdate: self => set(self.progress)
  });
}

function initSurco() {
  const svg = document.querySelector('.surco-hero');
  if (!svg || typeof gsap === 'undefined' || reduceMotion) return;
  const paths = [...svg.querySelectorAll('path')];
  paths.forEach(p => {
    const len = p.getTotalLength();
    p.style.strokeDasharray = len;
    p.style.strokeDashoffset = len;
  });
  gsap.to(paths, { strokeDashoffset: 0, duration: 1.1, ease: 'power2.out', stagger: 0.14, delay: 0.45 });
}

function initHero() {
  if (typeof gsap === 'undefined' || reduceMotion) return;
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.fromTo('.hero-copy .eyebrow', { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: .7 }, 0);
  tl.fromTo('.hero-copy h1', { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, 0.08);
  tl.fromTo('.hero-lead', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: .8 }, 0.42);
  tl.fromTo('.hero-cta .btn', { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: .7, stagger: .09 }, 0.54);
  tl.fromTo('.hero-data > div', { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: .6, stagger: .08 }, 0.66);
  tl.fromTo('.hero-foto > img', { clipPath: 'inset(0 0 100% 0)', scale: 1.05 }, { clipPath: 'inset(0 0 0% 0)', scale: 1, duration: 1.25 }, 0.16);
  tl.fromTo('.hero-foto figcaption', { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: .6 }, 1.05);
}

function initMarcaParallax() {
  if (typeof ScrollTrigger === 'undefined' || reduceMotion) return;
  const el = document.getElementById('marcaBig');
  if (!el) return;
  gsap.fromTo(el, { xPercent: -8 }, {
    xPercent: 8, ease: 'none',
    scrollTrigger: { trigger: '.marca-band', start: 'top bottom', end: 'bottom top', scrub: .8 }
  });
}

function initFotoParallax() {
  if (typeof ScrollTrigger === 'undefined' || reduceMotion) return;
  document.querySelectorAll('.empezar-foto > img').forEach(img => {
    gsap.fromTo(img, { scale: 1.07 }, {
      scale: 1, ease: 'none',
      scrollTrigger: { trigger: img, start: 'top bottom', end: 'bottom top', scrub: .7 }
    });
  });
}

function initAccordion() {
  const groups = {};
  document.querySelectorAll('details[name]').forEach(d => {
    (groups[d.name] ||= []).push(d);
  });
  const soportaName = 'name' in document.createElement('details');
  if (soportaName) return;
  Object.values(groups).forEach(list => {
    list.forEach(d => d.addEventListener('toggle', () => {
      if (!d.open) return;
      list.forEach(other => { if (other !== d) other.open = false; });
    }));
  });
}

function initMap() {
  const el = document.getElementById('map');
  if (!el || typeof L === 'undefined') return;
  const centro = [-34.8386, -64.3756];
  const map = L.map(el, { scrollWheelZoom: false }).setView(centro, 9);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap &copy; CARTO',
    maxZoom: 19
  }).addTo(map);
  const icon = L.divIcon({ className: 'zona-pin', html: '<span></span>', iconSize: [15, 15], iconAnchor: [7, 7] });
  L.marker(centro, { icon, title: 'Huinca Renancó' }).addTo(map);
  L.circle(centro, { radius: 70000, color: '#38571a', weight: 1, opacity: .55, fillColor: '#76bb40', fillOpacity: .12 }).addTo(map);
}

function initForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  const setError = (input, msg) => {
    input.closest('.field')?.classList.toggle('invalid', Boolean(msg));
    input.setAttribute('aria-invalid', msg ? 'true' : 'false');
    const slot = form.querySelector(`[data-err-for="${input.id}"]`);
    if (slot) slot.textContent = msg || '';
  };
  form.addEventListener('submit', e => {
    e.preventDefault();
    const nombre = form.elements.nombre;
    const tel = form.elements.tel;
    let ok = true;
    if (String(nombre.value).trim().length < 2) { setError(nombre, 'Escribí tu nombre.'); ok = false; } else setError(nombre, '');
    const digits = String(tel.value).replace(/\D/g, '');
    if (digits.length < 8) { setError(tel, 'Dejanos un teléfono de al menos 8 dígitos.'); ok = false; } else setError(tel, '');
    if (!ok) { form.querySelector('.field.invalid input')?.focus(); return; }
    const btn = form.querySelector('button[type="submit"]');
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

function initYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = String(new Date().getFullYear());
}

initNav();
initReveals();
initWspFloat();
initAlmanaque();
initSurco();
initHero();
initMarcaParallax();
initFotoParallax();
initAccordion();
initForm();
initYear();
window.addEventListener('load', initMap);
