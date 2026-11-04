'use strict';
const WHATSAPP_NUMBER = '5491126630042';
const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let revealsListos = false;
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const ANALYTICS_CONFIG = Object.freeze({ metaPixelId: '', enabled: false });
const NEEDS = Object.freeze({
  analisis: { title: 'Análisis de negocios', description: 'Revisar la información de gestión para reconocer prioridades y preguntas pendientes.', prepare: 'Para conversar: contanos qué indicadores usás y qué información te falta.' },
  rentabilidad: { title: 'Rentabilidad', description: 'Entender la relación entre ingresos, costos y márgenes de tu negocio.', prepare: 'Para conversar: contanos cómo analizás los costos y el resultado de tus ventas.' },
  fondos: { title: 'Flujo de fondos', description: 'Poner en perspectiva los cobros, pagos y compromisos de tu empresa.', prepare: 'Para conversar: contanos cómo organizás los vencimientos y las necesidades de caja.' },
  procesos: { title: 'Optimización de procesos', description: 'Revisar los circuitos de trabajo para detectar demoras y tareas repetidas.', prepare: 'Para conversar: contanos en qué parte del trabajo se producen las mayores demoras.' },
  contabilidad: { title: 'Contabilidad' },
  impuestos: { title: 'Impuestos' }
});
function qualifyInquiry(service, timing) {
  const area = Object.prototype.hasOwnProperty.call(NEEDS, service) ? NEEDS[service].title : '';
  const times = { ahora: 'Lo antes posible', mes: 'Durante el próximo mes', explorando: 'Explorando opciones' };
  const horizon = Object.prototype.hasOwnProperty.call(times, timing) ? times[timing] : '';
  return { area, horizon, ready: Boolean(area && horizon), stage: timing === 'explorando' ? 'Exploración' : horizon ? 'Consulta inicial' : '' };
}
function needMessage(key) {
  const need = Object.prototype.hasOwnProperty.call(NEEDS, key) ? NEEDS[key] : NEEDS.analisis;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hola Labusinessconsulting, quiero consultar por ${need.title.toLowerCase()} para mi empresa.`)}`;
}
function trapNavFocus(e) {
  if (e.key !== 'Tab' || !e.currentTarget.classList.contains('open')) return;
  const els = [...e.currentTarget.querySelectorAll('a[href],button:not([disabled])')].filter(el => el.getClientRects().length);
  const first = els[0], last = els[els.length - 1];
  if (e.shiftKey && document.activeElement === first) { last?.focus(); e.preventDefault(); }
  else if (!e.shiftKey && document.activeElement === last) { first?.focus(); e.preventDefault(); }
}
function initNeeds() {
  const choices = document.querySelectorAll('[data-need]');
  const title = document.getElementById('need-title');
  if (!choices.length || !title) return;
  const update = key => {
    const need = NEEDS[key];
    if (!need?.description) return;
    choices.forEach(btn => btn.setAttribute('aria-pressed', String(btn.dataset.need === key)));
    title.textContent = need.title;
    document.getElementById('need-description').textContent = need.description;
    document.getElementById('need-prepare').textContent = need.prepare;
    document.getElementById('need-whatsapp').href = needMessage(key);
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  };
  choices.forEach(btn => btn.addEventListener('click', () => update(btn.dataset.need)));
  update('analisis');
}
function initContact() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  const phone = form.elements.telefono;
  if (typeof IMask !== 'undefined') IMask(phone, { mask: '+{54} 9 0000000000' });
  const required = [...form.querySelectorAll('[required]')];
  const validate = el => {
    let valid = el.checkValidity() && el.value.trim().length > 0;
    if (el === phone) valid = /^(?:549)?\d{10}$/.test(el.value.replace(/\D/g, ''));
    el.setAttribute('aria-invalid', String(!valid));
    const error = document.getElementById(`${el.id}-error`);
    if (error) { error.hidden = valid; error.textContent = el.type === 'email' ? 'Ingresá un correo válido.' : el === phone ? 'Ingresá el código de área y los diez dígitos de tu número.' : 'Completá este dato para continuar.'; }
    return valid;
  };
  required.forEach(el => el.addEventListener('blur', () => validate(el)));
  const summary = () => {
    const result = qualifyInquiry(form.elements.servicio.value, form.elements.plazo.value);
    document.getElementById('lead-summary').hidden = !result.ready;
    document.getElementById('lead-summary-text').textContent = result.ready ? `${result.area} · ${result.horizon}. Etapa: ${result.stage}.` : '';
  };
  form.elements.servicio.addEventListener('change', summary);
  form.elements.plazo.addEventListener('change', summary);
  form.addEventListener('submit', e => {
    e.preventDefault();
    const invalid = required.filter(el => !validate(el));
    if (invalid.length) { invalid[0].focus(); showToast('Revisá los campos indicados para continuar.'); return; }
    const submit = form.querySelector('[type="submit"]');
    submit.disabled = true;
    const label = submit.innerHTML;
    submit.textContent = 'Enviando…';
    setTimeout(() => {
      showToast('¡Gracias! El envío de mensajes se activa al pasar la web a producción.');
      form.reset(); summary(); submit.disabled = false; submit.innerHTML = label;
      required.forEach(el => { el.setAttribute('aria-invalid', 'false'); document.getElementById(`${el.id}-error`).hidden = true; });
    }, 800);
  });
}
function initAnalytics() {
  if (!ANALYTICS_CONFIG.enabled || !/^\d{5,25}$/.test(ANALYTICS_CONFIG.metaPixelId)) return;
  const choice = document.getElementById('analytics-choice');
  if (!choice) return;
  const enable = () => {
    if (window.fbq) return;
    const queue = function () { queue.callMethod ? queue.callMethod.apply(queue, arguments) : queue.queue.push(arguments); };
    queue.push = queue; queue.loaded = true; queue.version = '2.0'; queue.queue = [];
    window.fbq = queue; window._fbq = queue;
    const script = document.createElement('script'); script.async = true; script.src = 'https://connect.facebook.net/en_US/fbevents.js'; document.head.appendChild(script);
    queue('init', ANALYTICS_CONFIG.metaPixelId); queue('track', 'PageView');
    document.querySelectorAll('a[href^="https://wa.me/"]').forEach(a => a.addEventListener('click', () => queue('track', 'Contact')));
  };
  let consent = '';
  try { consent = localStorage.getItem('la-analytics-consent') || ''; } catch {}
  if (consent === 'yes') enable();
  else if (!consent) choice.hidden = false;
  document.getElementById('analytics-accept')?.addEventListener('click', () => { try { localStorage.setItem('la-analytics-consent','yes'); } catch {} choice.hidden = true; enable(); });
  document.getElementById('analytics-reject')?.addEventListener('click', () => { try { localStorage.setItem('la-analytics-consent','no'); } catch {} choice.hidden = true; });
}

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
function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; (document.querySelector('.site-header') || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 769px)');
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open'); nav.removeAttribute('role'); nav.removeAttribute('aria-modal');
    if (!desktopMq.matches) nav.setAttribute('inert', '');
    toggle.setAttribute('aria-expanded', 'false'); document.body.classList.remove('no-scroll');
  };
  const open = () => {
    nav.classList.add('open'); bd.classList.add('open'); nav.removeAttribute('inert');
    toggle.setAttribute('aria-expanded', 'true'); document.body.classList.add('no-scroll');
    nav.setAttribute('role', 'dialog'); nav.setAttribute('aria-modal', 'true'); nav.querySelector('button, a')?.focus();
  };
  toggle.addEventListener('click', () => (nav.classList.contains('open') ? close() : open()));
  closeBtn?.addEventListener('click', () => { close(); toggle.focus(); });
  bd.addEventListener('click', close);
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); } });
  const syncInert = () => {
    if (desktopMq.matches) nav.removeAttribute('inert');
    else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  desktopMq.addEventListener('change', () => { close(); syncInert(); });
  nav.addEventListener('keydown', trapNavFocus);
  syncInert();
}
function initWspFloat() {
  const btn = document.getElementById('wsp-float');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) btn.classList.add('visible');
  }, { passive: true });
}
function initReveals() {
  revealsListos = true;
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
  if (img) tl.from(img, { scale: 1.1, duration: 1.8 }, 0);
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.sello, .hero-badge'), { scale: 0.92, opacity: 0, duration: 1.1, stagger: 0.1, clearProps: 'transform,opacity' }, 0.65);
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
function initModelos() {
  const bar = document.querySelector('.gw-modelos');
  if (!bar) return;
  let m = bar.querySelector('[aria-current="page"]')?.dataset.modelo;
  try {
    if (m) sessionStorage.setItem('gw-modelo', m);
    else m = sessionStorage.getItem('gw-modelo') || '1';
  } catch (e) { m = m || '1'; }
  if (bar.hasAttribute('data-interna')) bar.querySelector(`[data-modelo="${m}"]`)?.setAttribute('aria-current', 'true');
  if (m === '2') document.querySelectorAll('a[href="./"], a[href="index.html"]').forEach(a => {
    if (!a.closest('.gw-modelos')) a.setAttribute('href', 'modelo-2.html');
  });
}
if (typeof document !== 'undefined') {
initNav(); initWspFloat(); initModelos(); initModelBarScroll(); initNeeds(); initContact(); initAnalytics(); initHeroMotion(); initReveals();
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
if (typeof ScrollTrigger !== 'undefined') { window.addEventListener('load', () => ScrollTrigger.refresh()); document.querySelectorAll('details').forEach(el => el.addEventListener('toggle', () => ScrollTrigger.refresh())); }
}
