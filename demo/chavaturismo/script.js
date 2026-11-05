document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});
const WHATSAPP_NUMBER = '5493812081825';
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

function initGallery() {
  const dialog = document.getElementById('photoDialog');
  const openers = [...document.querySelectorAll('.gallery-open')];
  if (!dialog || !openers.length) return;
  let current = 0;
  let origin = null;
  const image = document.getElementById('viewerImage');
  const render = () => {
    const source = openers[current].querySelector('img');
    image.src = source.src;
    image.alt = source.alt;
    image.width = source.width;
    image.height = source.height;
    document.getElementById('viewerCaption').textContent = openers[current].closest('figure').querySelector('figcaption').textContent.replace(/^\d+/, '').trim();
    document.getElementById('viewerCount').textContent = `${current + 1} / ${openers.length} · Paisajes ilustrativos`;
  };
  const move = step => { current = (current + step + openers.length) % openers.length; render(); };
  openers.forEach((opener, index) => opener.addEventListener('click', () => {
    current = index; origin = opener; render(); dialog.showModal();
    document.body.classList.add('no-scroll');
    document.getElementById('viewerClose').focus();
  }));
  document.getElementById('viewerClose').addEventListener('click', () => dialog.close());
  document.getElementById('viewerPrev').addEventListener('click', () => move(-1));
  document.getElementById('viewerNext').addEventListener('click', () => move(1));
  dialog.addEventListener('click', event => {
    const r = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom)) dialog.close();
  });
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight') { event.preventDefault(); move(1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1); }
    trapFocus(event, dialog);
  });
  dialog.addEventListener('close', () => { document.body.classList.remove('no-scroll'); origin?.focus({ preventScroll: true }); });
}

function trapFocus(event, root) {
  if (event.key !== 'Tab') return;
  const focusable = [...root.querySelectorAll('a[href],button,input,textarea,select')].filter(el => !el.disabled && el.getClientRects().length);
  const first = focusable[0]; const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
  if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
}

function initComments() {
  const form = document.getElementById('commentForm');
  if (!form) return;
  const name = document.getElementById('nombre');
  const comment = document.getElementById('comentario');
  const button = form.querySelector('button[type="submit"]');
  let sending = false;
  const validate = field => {
    const value = field.value.trim();
    const valid = field === name ? value.length >= 2 : value.length >= 10;
    field.setAttribute('aria-invalid', String(!valid));
    document.getElementById(`${field.id}-error`).textContent = valid ? '' : field === name ? 'Escribí tu nombre (al menos 2 caracteres).' : 'Contanos un poco más (al menos 10 caracteres).';
    return valid;
  };
  [name, comment].forEach(field => field.addEventListener('input', () => { if (field.hasAttribute('aria-invalid')) validate(field); }));
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (sending) return;
    const results = [name, comment].map(validate);
    if (results.includes(false)) { [name, comment][results.indexOf(false)].focus(); return; }
    sending = true; button.disabled = true; button.textContent = 'Enviando…';
    setTimeout(() => {
      showToast('¡Gracias! El envío de mensajes se activa al pasar la web a producción.');
      form.reset(); [name, comment].forEach(field => field.removeAttribute('aria-invalid'));
      button.innerHTML = 'Probar comentario <span aria-hidden="true">↗</span>';
      button.disabled = false; sending = false;
    }, 800);
  });
}

function initFaq() {
  document.querySelectorAll('details').forEach(el => el.addEventListener('toggle', () => { if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); }));
}

function initWhatsAppLinks() {
  document.querySelectorAll('a[href*="wa.me/"]').forEach(link => {
    const url = new URL(link.href);
    url.pathname = `/${WHATSAPP_NUMBER}`;
    link.href = url.href;
  });
}

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

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; (document.querySelector('.site-header') || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 769px)');
  const close = () => {
    nav.removeAttribute('role'); nav.removeAttribute('aria-modal'); nav.classList.remove('open'); bd.classList.remove('open');
    if (!desktopMq.matches) nav.setAttribute('inert', '');
    toggle.setAttribute('aria-expanded', 'false'); document.body.classList.remove('no-scroll');
  };
  const open = () => {
    nav.setAttribute('role', 'dialog'); nav.setAttribute('aria-modal', 'true'); nav.classList.add('open'); bd.classList.add('open'); nav.removeAttribute('inert');
    toggle.setAttribute('aria-expanded', 'true'); document.body.classList.add('no-scroll');
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
  desktopMq.addEventListener('change', () => { close(); syncInert(); });
  nav.addEventListener('keydown', event => { if (nav.classList.contains('open')) trapFocus(event, nav); });
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
  tl.from(hero.querySelectorAll('.hero-eyebrow, .hero-brand'), { y: 18, opacity: 0, duration: 0.9, clearProps: 'transform,opacity' }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'transform,opacity,filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1, clearProps: 'transform,opacity' }, 0.45)
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
initNav();
initGallery();
initComments();
initFaq();
initWhatsAppLinks();
initHeroMotion();
initWspFloat();
initModelBarScroll();
initReveals();
