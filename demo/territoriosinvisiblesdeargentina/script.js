const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

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

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; const header = document.querySelector('.site-header'); (header || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 981px)');
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
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); } });
  const syncInert = () => {
    if (desktopMq.matches) nav.removeAttribute('inert');
    else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  desktopMq.addEventListener('change', syncInert);
  syncInert();
}

function initWspFloat() {
  const btn = document.getElementById('wsp-float');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) btn.classList.add('visible'); else btn.classList.remove('visible');
  }, { passive: true });
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
  if (img) tl.from(img, { scale: 1.08, filter: 'sepia(.8) saturate(.45) brightness(1.12)', duration: 1.8, clearProps: 'filter' }, 0);
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 16, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 32, opacity: 0, filter: 'blur(8px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 22, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn, .chips-ancla a'), { y: 18, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.lamina__pie, .hero__sello'), { y: 12, opacity: 0, duration: 0.9, clearProps: 'transform,opacity' }, 0.8);
}

function initLectura() {
  const el = document.querySelector('[data-lectura]');
  if (!el) return;
  const palabras = el.textContent.trim().split(/\s+/);
  el.innerHTML = palabras.map(w => `<span class="lw">${esc(w)}</span>`).join(' ');
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') { el.classList.add('leida'); return; }
  const cs = window.getComputedStyle(document.documentElement);
  const desde = cs.getPropertyValue('--color-text-muted').trim();
  const hasta = cs.getPropertyValue('--color-text').trim();
  gsap.fromTo(el.querySelectorAll('.lw'), { color: desde }, {
    color: hasta, ease: 'none', stagger: 0.12,
    scrollTrigger: { trigger: el, start: 'top 82%', end: 'bottom 46%', scrub: true },
  });
}

function initQR() {
  document.querySelectorAll('[data-qr]').forEach(caja => {
    const url = new URL(caja.dataset.qr, window.location.href).href;
    const destino = caja.querySelector('.qr__img');
    if (!destino) return;
    if (typeof window.qrcode === 'undefined') {
      destino.hidden = true;
      return;
    }
    const qr = window.qrcode(0, 'M');
    qr.addData(url);
    qr.make();
    destino.innerHTML = qr.createSvgTag({ cellSize: 4, margin: 0, scalable: true, alt: 'Código QR que abre la página del territorio Catamarca' });
  });
}

function initForm() {
  const form = document.getElementById('form-colabora');
  if (!form) return;
  const tel = form.querySelector('#f-telefono');
  let mascara = null;
  if (tel && typeof IMask !== 'undefined') {
    mascara = IMask(tel, { mask: [
      { mask: '+{54} 9 (00) 0000-0000' },
      { mask: '+{54} 9 (000) 000-0000' },
      { mask: '+{54} 9 (0000) 00-0000' },
    ] });
  }
  const reglas = {
    'f-nombre': v => v.trim().length >= 2 || 'Contanos tu nombre.',
    'f-email': v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || 'Revisá el email: falta algo.',
    'f-telefono': () => !mascara || !mascara.unmaskedValue || mascara.unmaskedValue.length >= 12 || 'Completá el teléfono con la característica.',
    'f-tipo': v => v !== '' || 'Elegí un tipo de colaboración.',
    'f-mensaje': v => v.trim().length >= 10 || 'Contanos un poco más de la propuesta.',
  };
  const validar = id => {
    const campo = form.querySelector(`#${id}`);
    const error = form.querySelector(`#${id}-error`);
    const r = reglas[id](campo.value);
    const ok = r === true;
    campo.setAttribute('aria-invalid', String(!ok));
    if (error) error.textContent = ok ? '' : r;
    return ok;
  };
  Object.keys(reglas).forEach(id => {
    const campo = form.querySelector(`#${id}`);
    campo?.addEventListener('blur', () => { if (campo.value) validar(id); });
    campo?.addEventListener('input', () => { if (campo.getAttribute('aria-invalid') === 'true') validar(id); });
  });
  form.addEventListener('submit', e => {
    e.preventDefault();
    const ids = Object.keys(reglas);
    const resultados = ids.map(validar);
    if (resultados.includes(false)) {
      form.querySelector(`#${ids[resultados.indexOf(false)]}`)?.focus();
      return;
    }
    const btn = form.querySelector('button[type="submit"]');
    const texto = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Enviando…';
    setTimeout(() => {
      showToast('¡Gracias! El envío de mensajes se activa al pasar la web a producción.');
      form.reset();
      mascara?.updateValue();
      ids.forEach(id => form.querySelector(`#${id}`)?.removeAttribute('aria-invalid'));
      btn.disabled = false;
      btn.textContent = texto;
    }, 800);
  });
}

initModelos();
initModelBarScroll();
initNav();
initWspFloat();
initReveals();
initHeroMotion();
initLectura();
initQR();
initForm();
