const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WHATSAPP_NUMBER = '5493624740670';
const esc = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

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

function initWspFloat() {
  const btn = document.getElementById('wsp-float');
  if (!btn) return;
  const contact = new URL(btn.href);
  contact.pathname = `/${WHATSAPP_NUMBER}`;
  btn.href = contact.href;
  const show = () => { if (window.scrollY > 600) btn.classList.add('visible'); };
  window.addEventListener('scroll', show, { passive: true });
  show();
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; const header = document.querySelector('.site-header'); (header || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 769px)');
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open');
    if (!desktopMq.matches) nav.setAttribute('inert', '');
    nav.removeAttribute('role'); nav.removeAttribute('aria-modal');
    toggle.setAttribute('aria-expanded', 'false'); document.body.classList.remove('no-scroll');
  };
  const open = () => {
    nav.classList.add('open'); bd.classList.add('open'); nav.removeAttribute('inert');
    nav.setAttribute('role', 'dialog'); nav.setAttribute('aria-modal', 'true');
    toggle.setAttribute('aria-expanded', 'true'); document.body.classList.add('no-scroll');
    nav.querySelector('a')?.focus();
  };
  toggle.addEventListener('click', () => (nav.classList.contains('open') ? close() : open()));
  closeBtn?.addEventListener('click', () => { close(); toggle.focus(); });
  bd.addEventListener('click', () => { close(); toggle.focus(); });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    close();
    if (!desktopMq.matches) {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) { target.setAttribute('tabindex', '-1'); target.focus({ preventScroll: true }); }
    }
  }));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); }
    if (e.key !== 'Tab' || !nav.classList.contains('open')) return;
    const elements = [...nav.querySelectorAll('a[href],button')].filter(el => el.getClientRects().length);
    const first = elements[0]; const last = elements.at(-1);
    if (e.shiftKey && document.activeElement === first) { last?.focus(); e.preventDefault(); }
    else if (!e.shiftKey && document.activeElement === last) { first?.focus(); e.preventDefault(); }
  });
  const syncInert = () => {
    if (desktopMq.matches) { close(); nav.removeAttribute('inert'); }
    else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  desktopMq.addEventListener('change', syncInert);
  syncInert();
}

function initReveals() {
  const items = document.querySelectorAll('[data-animate]');
  if (!items.length) return;
  if (!('IntersectionObserver' in window) || reduceMotion) {
    items.forEach(el => el.classList.add('in'));
    return;
  }
  const entrar = (el, n) => {
    const d = Math.min(n * 0.1, 0.6);
    el.style.transitionDelay = `${d}s`;
    el.classList.add('in');
    setTimeout(() => { el.style.transitionDelay = ''; }, (d + 1.2) * 1000);
  };
  const io = new IntersectionObserver(entries => {
    let n = 0;
    entries.forEach(entry => {
      if (entry.isIntersecting) { entrar(entry.target, n++); io.unobserve(entry.target); }
    });
  }, { threshold: 0, rootMargin: '0px 0px -7% 0px' });
  items.forEach(el => io.observe(el));
  let queued = false;
  const sweep = () => {
    queued = false;
    let pending = 0;
    let n = 0;
    items.forEach(el => {
      if (el.classList.contains('in')) return;
      const r = el.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight) { entrar(el, n++); io.unobserve(el); }
      else pending++;
    });
    if (!pending) {
      window.removeEventListener('scroll', queueSweep);
      window.removeEventListener('resize', queueSweep);
    }
  };
  const queueSweep = () => { if (!queued) { queued = true; requestAnimationFrame(sweep); } };
  requestAnimationFrame(() => requestAnimationFrame(queueSweep));
  window.addEventListener('load', queueSweep);
  window.addEventListener('scroll', queueSweep, { passive: true });
  window.addEventListener('resize', queueSweep, { passive: true });
}

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const img = hero.querySelector('[data-hero-img]');
  if (img) tl.from(img, { scale: 1.1, duration: 1.8, clearProps: 'transform' }, 0);
  tl.from(hero.querySelectorAll('.hero-eyebrow, .hero-brand'), { y: 18, opacity: 0, duration: .9, clearProps: 'transform,opacity', stagger: .08 }, .1)
    .from(hero.querySelectorAll('h1'), { x: -24, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, .2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1, clearProps: 'transform,opacity' }, .35)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: .8, stagger: .1, clearProps: 'transform,opacity' }, .45)
    .from(hero.querySelectorAll('.hero-badge'), { scale: .96, opacity: 0, duration: .8, clearProps: 'transform,opacity' }, .6);
}

function initMap() {
  const element = document.getElementById('agency-map');
  if (!element || typeof L === 'undefined') return;
  element.querySelector('.map-fallback')?.remove();
  const map = L.map(element, { scrollWheelZoom: false, dragging: !L.Browser.mobile, tap: false }).setView([-27.25, -59.2], 7);
  const layer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>', maxZoom: 19
  }).addTo(map);
  layer.on('tileerror', () => { element.setAttribute('aria-label', 'Mapa regional de Chaco. Si no carga, pedí la dirección por WhatsApp.'); });
  if ('ResizeObserver' in window) new window.ResizeObserver(() => map.invalidateSize()).observe(element);
}

function initForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  const fields = [...form.querySelectorAll('input,textarea')];
  const validate = field => {
    const valid = field.value.trim().length > 0 && field.checkValidity();
    field.setAttribute('aria-invalid', String(!valid));
    document.getElementById(`${field.id}-error`).hidden = valid;
    return valid;
  };
  fields.forEach(field => field.addEventListener('blur', () => validate(field)));
  form.addEventListener('submit', event => {
    event.preventDefault();
    const invalid = fields.filter(field => !validate(field));
    if (invalid.length) { invalid[0].focus(); return; }
    const button = form.querySelector('[type="submit"]');
    if (button.disabled) return;
    button.disabled = true;
    const content = button.innerHTML;
    button.textContent = 'Enviando…';
    setTimeout(() => {
      showToast('¡Gracias! El envío de mensajes se activa al pasar la web a producción.');
      form.reset(); fields.forEach(field => field.removeAttribute('aria-invalid'));
      button.disabled = false; button.innerHTML = content;
    }, 800);
  });
}

function initModelBarScroll() {
  const bar = document.querySelector('.gw-modelos');
  if (!bar) return;
  let showTimer = 0;
  let frame = 0;
  const update = () => {
    frame = 0;
    if (window.scrollY <= 8) {
      bar.classList.remove('gw-modelos--scrolling');
      return;
    }
    bar.classList.add('gw-modelos--scrolling');
    clearTimeout(showTimer);
    showTimer = setTimeout(() => bar.classList.remove('gw-modelos--scrolling'), 120);
  };
  window.addEventListener('scroll', () => {
    if (!frame) frame = requestAnimationFrame(update);
  }, { passive: true });
}

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());
initNav();
initMap();
initForm();
initWspFloat();
initModelBarScroll();
initHeroMotion();
initReveals();
