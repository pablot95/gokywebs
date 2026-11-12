const WHATSAPP_NUMBER = '5491178242382';
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
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) btn.classList.add('visible'); 
  }, { passive: true });
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
    nav.removeAttribute('role'); nav.removeAttribute('aria-modal'); nav.removeEventListener('keydown', trapFocus);
    nav.classList.remove('open'); bd.classList.remove('open');
    if (!desktopMq.matches) nav.setAttribute('inert', '');
    toggle.setAttribute('aria-expanded', 'false'); document.body.classList.remove('no-scroll');
  };
  const open = () => {
    nav.setAttribute('role', 'dialog'); nav.setAttribute('aria-modal', 'true'); nav.addEventListener('keydown', trapFocus);
    nav.classList.add('open'); bd.classList.add('open'); nav.removeAttribute('inert');
    toggle.setAttribute('aria-expanded', 'true'); document.body.classList.add('no-scroll');
    nav.querySelector('a')?.focus();
  };
  toggle.addEventListener('click', () => (nav.classList.contains('open') ? close() : open()));
  closeBtn?.addEventListener('click', () => { close(); toggle.focus(); });
  bd.addEventListener('click', close);
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); } });
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
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.sello, .hero-badge'), { scale: 0.92, opacity: 0, duration: 1.1, stagger: 0.1, clearProps: 'transform,opacity' }, 0.65);
}
function initGallery() {
  const dialog = document.getElementById('galleryDialog');
  const buttons = [...document.querySelectorAll('[data-gallery]')];
  if (!dialog || !buttons.length) return;
  const photos = buttons.map(button => ({
    src: button.querySelector('img').getAttribute('src'),
    alt: button.querySelector('img').alt,
    title: button.closest('figure').querySelector('figcaption span').textContent
  }));
  let active = 0;
  let trigger = null;
  const render = () => {
    const photo = photos[active];
    const img = document.createElement('img');
    img.src = photo.src;
    img.alt = photo.alt;
    dialog.querySelector('.dialog-photo').replaceChildren(img);
    document.getElementById('photoCaption').textContent = `${photo.title} · ${active + 1} / ${photos.length}`;
    dialog.querySelector('.dialog-cta').href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hola Carpintería IAN, quiero consultar por ${photo.title.toLowerCase()}, que vi en la galería de la web.`)}`;
  };
  buttons.forEach(button => button.addEventListener('click', () => {
    active = Number(button.dataset.gallery);
    trigger = button;
    render();
    dialog.showModal();
    document.body.classList.add('no-scroll');
    dialog.querySelector('.dialog-close').focus();
  }));
  dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.querySelector('[data-prev]').addEventListener('click', () => { active = (active - 1 + photos.length) % photos.length; render(); });
  dialog.querySelector('[data-next]').addEventListener('click', () => { active = (active + 1) % photos.length; render(); });
  dialog.addEventListener('click', event => {
    const r = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom)) dialog.close();
  });
  dialog.addEventListener('close', () => { document.body.classList.remove('no-scroll'); trigger?.focus(); });
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight') { active = (active + 1) % photos.length; render(); }
    if (event.key === 'ArrowLeft') { active = (active - 1 + photos.length) % photos.length; render(); }
    trapFocus(event);
  });
}

function trapFocus(event) {
  if (event.key !== 'Tab') return;
  const elements = [...event.currentTarget.querySelectorAll('a[href],button:not([disabled]),input,textarea')].filter(el => el.getClientRects().length);
  const first = elements[0];
  const last = elements[elements.length - 1];
  if (event.shiftKey && document.activeElement === first) { last?.focus(); event.preventDefault(); }
  else if (!event.shiftKey && document.activeElement === last) { first?.focus(); event.preventDefault(); }
}

function initForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  const phone = form.elements.telefono;
  if (typeof IMask !== 'undefined') IMask(phone, { mask: '+{54} 9 0000000000' });
  const fields = [form.elements.nombre, phone, form.elements.idea];
  const validate = field => {
    const digits = field.value.replace(/\D/g, '');
    const phoneValid = digits.startsWith('549') ? digits.length === 13 : digits.length === 10;
    const valid = field === phone ? phoneValid : field.value.trim().length >= 2;
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
    button.disabled = true;
    button.textContent = 'Enviando…';
    setTimeout(() => {
      showToast('¡Gracias! El envío de mensajes se activa al pasar la web a producción.');
      form.reset();
      fields.forEach(field => { field.removeAttribute('aria-invalid'); document.getElementById(`${field.id}-error`).hidden = true; });
      button.disabled = false;
      button.innerHTML = 'Consultar mi proyecto <span aria-hidden="true">↗</span>';
    }, 800);
  });
}

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());
document.querySelectorAll('details').forEach(detail => detail.addEventListener('toggle', () => { if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); }));
initNav();
initWspFloat();
initModelBarScroll();
initGallery();
initForm();
initHeroMotion();
initReveals();
