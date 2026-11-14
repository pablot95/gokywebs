const WHATSAPP_NUMBER = '5493644633066';
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let revealsListos = false;
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
function initWspFloat() {
  const btn = document.getElementById('wsp-float');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) btn.classList.add('visible'); 
  }, { passive: true });
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
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});
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
    nav.setAttribute('role', 'dialog'); nav.setAttribute('aria-modal', 'true');
    nav.querySelector('a')?.focus();
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
  desktopMq.addEventListener('change', syncInert);
  syncInert();
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
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.65, stagger: 0.1, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.sello, .hero-badge'), { scale: 0.92, opacity: 0, duration: 0.65, stagger: 0.06, clearProps: 'transform,opacity' }, 0.65);
}

const WORKS = {
  flyers: { title: 'Diseño gráfico', text: 'Flyers y piezas gráficas personalizadas para comunicar productos, novedades y propuestas de tu marca.', service: 'Diseño gráfico' },
  identidad: { title: 'Identidad visual', text: 'Colores, tipografía y piezas que comparten una misma dirección visual. Una referencia del universo que puede tener tu marca.', service: 'Diseño gráfico' },
  catalogos: { title: 'Catálogos interactivos', text: 'Un catálogo digital para presentar tus productos, compartirlos y recibir consultas. Sin comisiones por venta.', service: 'Catálogos interactivos' },
  redes: { title: 'Contenido para redes', text: 'Contenido estratégico y diseño de publicaciones para comunicar con una identidad consistente.', service: 'Gestión de redes' },
  videos: { title: 'Edición de videos', text: 'Edición de piezas audiovisuales para acompañar el contenido de tu marca en redes sociales.', service: 'Gestión de redes' },
  whatsapp: { title: 'Automatización WhatsApp', text: 'Configuración de flujos de atención para WhatsApp Business según las consultas de tu emprendimiento.', service: 'Automatización WhatsApp' },
  web: { title: 'Creación de páginas web', text: 'Un espacio digital para presentar tu actividad, mostrar tus servicios y facilitar el contacto.', service: 'Creación de páginas web' }
};

function matchingCategory(category, filter) {
  return filter === 'all' || category === filter;
}

function quoteHref(service) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hola Sol, quiero pedir un presupuesto para ${service}. Vi la referencia en la web de SOL DRACKO.`)}`;
}

function revealNew(container) {
  if (!revealsListos || !container) return;
  container.querySelectorAll('[data-animate]:not(.in)').forEach(el => {
    if (!el.hidden) el.classList.add('in');
  });
}

function initPortfolio() {
  const bar = document.querySelector('.filters');
  const grid = document.querySelector('.portfolio-grid');
  if (!bar || !grid) return;
  const cards = [...grid.querySelectorAll('.work-card')];
  bar.addEventListener('click', e => {
    const button = e.target.closest('[data-filter]');
    if (!button) return;
    bar.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    cards.forEach(card => { card.hidden = !matchingCategory(card.dataset.category, button.dataset.filter); });
    const count = cards.filter(c => !c.hidden).length;
    document.getElementById('filter-count').textContent = `${count} ${count === 1 ? 'referencia' : 'referencias'}`;
    revealNew(grid);
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  });
}

function trapFocus(event, container) {
  if (event.key !== 'Tab') return;
  const focusable = [...container.querySelectorAll('a[href],button:not([disabled]),input,select,textarea,[tabindex="0"]')].filter(el => el.getClientRects().length);
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (!first) { event.preventDefault(); container.focus(); return; }
  if (event.shiftKey && (document.activeElement === first || document.activeElement === container)) { event.preventDefault(); last.focus(); }
  else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
}

function initWorkModal() {
  const modal = document.getElementById('work-modal');
  if (!modal) return;
  const dialog = modal.querySelector('.work-dialog');
  const closeBtn = modal.querySelector('.modal-close');
  let trigger = null;
  const close = () => {
    modal.hidden = true;
    document.body.classList.remove('no-scroll');
    document.querySelector('main')?.removeAttribute('inert');
    document.querySelector('.site-header')?.removeAttribute('inert');
    document.querySelector('.site-footer')?.removeAttribute('inert');
    trigger?.focus();
  };
  document.querySelectorAll('[data-work]').forEach(button => {
    button.addEventListener('click', () => {
      const work = WORKS[button.dataset.work];
      if (!work) return;
      trigger = button;
      const image = button.querySelector('img');
      document.getElementById('modal-image').src = image.src;
      document.getElementById('modal-image').alt = image.alt;
      document.getElementById('modal-title').textContent = work.title;
      document.getElementById('modal-description').textContent = work.text;
      document.getElementById('modal-cta').href = quoteHref(work.service);
      dialog.setAttribute('aria-label', `${work.title}: referencia visual ilustrativa`);
      modal.hidden = false;
      document.body.classList.add('no-scroll');
      document.querySelector('main')?.setAttribute('inert', '');
      document.querySelector('.site-header')?.setAttribute('inert', '');
      document.querySelector('.site-footer')?.setAttribute('inert', '');
      closeBtn.focus();
    });
  });
  closeBtn.addEventListener('click', close);
  modal.addEventListener('click', e => { if (e.target === modal) close(); });
  document.addEventListener('keydown', e => {
    if (!modal.hidden) {
      if (e.key === 'Escape') close();
      else trapFocus(e, dialog);
    }
  });
}

function validateContact(values) {
  const errors = {};
  if (!values.name.trim()) errors.name = 'Escribí tu nombre.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) errors.email = 'Revisá el formato de tu correo.';
  if (values.message.trim().length < 8) errors.message = 'Contame un poco más sobre tu idea (al menos 8 caracteres).';
  return errors;
}

function initContact() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  const fields = ['name', 'email', 'message'];
  form.addEventListener('submit', e => {
    e.preventDefault();
    const errors = validateContact(Object.fromEntries(fields.map(key => [key, form.elements[key].value])));
    fields.forEach(key => {
      const field = form.elements[key];
      document.getElementById(`${key}-error`).textContent = errors[key] || '';
      field.setAttribute('aria-invalid', String(Boolean(errors[key])));
      field.setAttribute('aria-describedby', `${key}-error`);
    });
    if (Object.keys(errors).length) { form.elements[Object.keys(errors)[0]].focus(); return; }
    const button = form.querySelector('[type="submit"]');
    const original = button.innerHTML;
    button.disabled = true;
    button.textContent = 'Enviando…';
    setTimeout(() => {
      showToast('¡Gracias! El envío de mensajes se activa al pasar la web a producción.');
      form.reset();
      button.disabled = false;
      button.innerHTML = original;
    }, 800);
  });
  document.querySelectorAll('[data-service]').forEach(a => a.addEventListener('click', () => { form.elements.service.value = a.dataset.service; }));
  document.querySelector('.instagram-pending')?.addEventListener('click', () => showToast('El Instagram de SOL DRACKO está en preparación. Por ahora podés conversar con Sol por WhatsApp.'));
}

function initMenuAccessibility() {
  const nav = document.getElementById('mainNav');
  if (!nav) return;
  document.addEventListener('keydown', e => { if (nav.classList.contains('open')) trapFocus(e, nav); });
  window.matchMedia('(min-width: 769px)').addEventListener('change', e => {
    if (!e.matches) return;
    nav.classList.remove('open');
    nav.removeAttribute('role');
    nav.removeAttribute('aria-modal');
    document.querySelector('.nav-backdrop')?.classList.remove('open');
    document.body.classList.remove('no-scroll');
    document.getElementById('menuToggle')?.setAttribute('aria-expanded', 'false');
  });
}

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());
initPortfolio();
initNav();
initMenuAccessibility();
initWorkModal();
initContact();
initWspFloat();
initModelBarScroll();
initHeroMotion();
initReveals();
