const WHATSAPP_NUMBER = '5491136466605';
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
function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; (document.querySelector('.site-header') || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 769px)');
  const close = () => {
    nav.removeAttribute('role'); nav.removeAttribute('aria-modal'); nav.removeEventListener('keydown', trapFocus); nav.classList.remove('open'); bd.classList.remove('open');
    if (!desktopMq.matches) nav.setAttribute('inert', '');
    toggle.setAttribute('aria-expanded', 'false'); document.body.classList.remove('no-scroll');
  };
  const open = () => {
    nav.setAttribute('role', 'dialog'); nav.setAttribute('aria-modal', 'true'); nav.addEventListener('keydown', trapFocus); nav.classList.add('open'); bd.classList.add('open'); nav.removeAttribute('inert');
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

function initModelos() {
  const bar = document.querySelector('.gw-modelos');
  if (!bar) return;
  let m = bar.querySelector('[aria-current="page"]')?.dataset.modelo;
  try {
    if (m) window.sessionStorage.setItem('gw-modelo', m);
    else m = window.sessionStorage.getItem('gw-modelo') || '1';
  } catch { m = m || '1'; }
  if (bar.hasAttribute('data-interna')) bar.querySelector(`[data-modelo="${m}"]`)?.setAttribute('aria-current', 'true');
  if (m === '2') document.querySelectorAll('a[href="./"], a[href="index.html"]').forEach(a => {
    if (!a.closest('.gw-modelos')) a.setAttribute('href', 'modelo-2.html');
  });
}

function initWspFloat() {
  const btn = document.getElementById('wsp-float');
  if (!btn) return;
  const target = new URL(btn.href);
  target.pathname = '/' + WHATSAPP_NUMBER;
  btn.href = target.href;
  const show = () => { if (window.scrollY > 600) btn.classList.add('visible'); };
  window.addEventListener('scroll', show, { passive: true });
  show();
}
function trapFocus(e) {
  if (e.key !== 'Tab') return;
  const nodes = [...e.currentTarget.querySelectorAll('a[href],button:not([disabled]),input,select,textarea,[tabindex="0"]')].filter(el => el.offsetParent !== null);
  const first = nodes[0], last = nodes[nodes.length - 1];
  if (!first) return;
  if (e.shiftKey && document.activeElement === first) { last.focus(); e.preventDefault(); }
  else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); }
}
function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({defaults:{ease:'power2.out'}});
  const photo = hero.querySelector('[data-hero-img]');
  if (photo) tl.from(photo,{scale:1.08,duration:1.65,clearProps:'transform'},0);
  tl.from(hero.querySelectorAll('.hero-eyebrow,.hero-brand'),{y:14,opacity:0,duration:.7,stagger:.08,clearProps:'transform,opacity'},.1)
    .from(hero.querySelectorAll('h1'),{clipPath:'inset(0 0 100% 0)',y:20,duration:.95,clearProps:'clipPath,transform'},.2)
    .from(hero.querySelectorAll('.hero-lead'),{y:20,opacity:0,duration:.85,clearProps:'transform,opacity'},.35)
    .from(hero.querySelectorAll('.hero-ctas a'),{y:16,opacity:0,duration:.75,stagger:.1,clearProps:'transform,opacity'},.5)
    .from(hero.querySelectorAll('.hero-badge'),{y:16,opacity:0,duration:.65,clearProps:'transform,opacity'},.6);
}
function initVideos() {
  const modal = document.getElementById('video-modal');
  if (!modal) return;
  const player = document.getElementById('video-player');
  const closeBtn = document.getElementById('video-close');
  let trigger = null;
  const close = () => { modal.hidden = true; player.replaceChildren(); document.body.classList.remove('no-scroll'); modal.removeEventListener('keydown',trapFocus); trigger?.focus(); };
  document.querySelectorAll('[data-video]').forEach(link => link.addEventListener('click', e => {
    e.preventDefault(); trigger = link;
    const id = link.dataset.video;
    if (!/^[A-Za-z0-9_-]{11}$/.test(id)) return;
    document.getElementById('video-title').textContent = link.dataset.title;
    document.getElementById('video-external').href = link.href;
    const iframe = document.createElement('iframe');
    iframe.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0';
    iframe.title = link.dataset.title;
    iframe.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    iframe.setAttribute('allowfullscreen','');
    player.replaceChildren(iframe); modal.hidden = false; document.body.classList.add('no-scroll');
    modal.addEventListener('keydown',trapFocus); closeBtn.focus();
  }));
  closeBtn.addEventListener('click',close);
  modal.addEventListener('click',e => { if (e.target === modal) close(); });
  document.addEventListener('keydown',e => { if (e.key === 'Escape' && !modal.hidden) close(); });
}
function initContact() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  const tel = form.elements.telefono;
  const mask = typeof IMask !== 'undefined' ? IMask(tel,{mask:[{mask:'+{54} 9 (00) 0000-0000'},{mask:'+{54} 9 (000) 000-0000'},{mask:'+{54} 9 (0000) 00-0000'}]}) : null;
  const validate = field => {
    let valid = field.checkValidity() && (!field.required || field.value.trim().length > 0);
    if (field.name === 'telefono') valid = field.value.replace(/\D/g,'').length >= 10;
    if (field.name === 'mensaje') valid = field.value.trim().length >= 10;
    field.setAttribute('aria-invalid',String(!valid));
    const error = document.getElementById(field.id+'-error');
    if (error) error.hidden = valid;
    return valid;
  };
  const fields = [...form.querySelectorAll('input,select,textarea')];
  fields.forEach(field => field.addEventListener('blur',() => validate(field)));
  form.addEventListener('submit',e => {
    e.preventDefault();
    const invalid = fields.filter(field => !validate(field));
    if (invalid.length) { invalid[0].focus(); return; }
    const submit = form.querySelector('[type="submit"]');
    if (submit.disabled) return;
    const original = submit.innerHTML; submit.disabled = true; submit.textContent = 'Enviando…';
    setTimeout(() => { showToast('¡Gracias! El envío de mensajes se activa al pasar la web a producción.'); form.reset(); if (mask) mask.value = ''; submit.disabled = false; submit.innerHTML = original; },800);
  });
}
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load',() => ScrollTrigger.refresh());
initModelos();
initModelBarScroll();
initNav();
initWspFloat();
initHeroMotion();
initVideos();
initContact();
initReveals();
