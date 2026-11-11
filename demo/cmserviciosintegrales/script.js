const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

let refreshTimer = 0;
function refrescarScroll() {
  if (typeof ScrollTrigger === 'undefined') return;
  clearTimeout(refreshTimer);
  refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 480);
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

function initWspFloat() {
  const btn = document.getElementById('wsp-float');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) btn.classList.add('visible'); else btn.classList.remove('visible');
  }, { passive: true });
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; (document.querySelector('.site-header') || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 1080px)');
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
    if (desktopMq.matches) { nav.removeAttribute('inert'); if (nav.classList.contains('open')) close(); }
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
    .from(hero.querySelectorAll('.hero-panel > .regla, .hero-ficha-texto > .regla'), { scaleX: 0, duration: 1, clearProps: 'transform' }, 0.4)
    .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn, .pick-label, .pick, .hero-tel'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.hero-chips li'), { y: 14, opacity: 0, duration: 0.8, stagger: 0.08, clearProps: 'transform,opacity' }, 0.8)
    .from(hero.querySelectorAll('.sello'), { scale: 0.92, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.75);
}

function pasarBrillo(el) {
  if (!el || reduceMotion) return;
  el.classList.remove('is-brillo');
  void el.offsetWidth;
  el.classList.add('is-brillo');
}

function initBrilloHero() {
  const fig = document.querySelector('.hero .brillo');
  if (!fig || reduceMotion) return;
  setTimeout(() => pasarBrillo(fig), 1100);
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('[data-parallax]').forEach(el => {
    gsap.fromTo(el, { yPercent: -3 }, {
      yPercent: 3,
      ease: 'none',
      scrollTrigger: { trigger: el.closest('section'), start: 'top top', end: 'bottom top', scrub: true }
    });
  });
}

function initVisor() {
  const visor = document.querySelector('.visor');
  if (!visor) return;
  const btns = [...visor.querySelectorAll('.amb-btn')];
  const fotos = [...visor.querySelectorAll('.visor-foto')];
  const cap = visor.querySelector('[data-visor-cap]');
  let actual = 0;
  const activar = i => {
    if (i === actual || !fotos[i]) return;
    actual = i;
    btns.forEach((b, k) => {
      const on = k === i;
      b.setAttribute('aria-expanded', String(on));
      b.closest('.amb-item')?.classList.toggle('is-activo', on);
    });
    fotos.forEach((f, k) => {
      const on = k === i;
      f.classList.toggle('is-activa', on);
      if (on) f.removeAttribute('aria-hidden'); else f.setAttribute('aria-hidden', 'true');
    });
    if (cap) cap.textContent = btns[i].querySelector('.amb-tit')?.textContent || '';
    pasarBrillo(fotos[i]);
    refrescarScroll();
  };
  btns.forEach((b, i) => {
    b.addEventListener('click', () => activar(i));
    if (finePointer) b.addEventListener('mouseenter', () => activar(i));
  });
}

function initRailDrag(vp) {
  if (!vp) return;
  let dragging = false, moved = false, startX = 0, startScroll = 0, pointerId = null;
  const THRESHOLD = 6;
  vp.addEventListener('pointerdown', e => {
    if (e.pointerType === 'touch' || e.button !== 0) return;
    dragging = true; moved = false; pointerId = e.pointerId;
    startX = e.clientX; startScroll = vp.scrollLeft;
  });
  vp.addEventListener('pointermove', e => {
    if (!dragging || e.pointerId !== pointerId) return;
    const dx = e.clientX - startX;
    if (!moved && Math.abs(dx) < THRESHOLD) return;
    if (!moved) {
      moved = true;
      vp.classList.add('dragging');
      try { vp.setPointerCapture?.(pointerId); } catch { vp.dataset.captura = 'no'; }
    }
    e.preventDefault();
    vp.scrollLeft = startScroll - dx;
  });
  const end = e => {
    if (!dragging || (e && pointerId !== null && e.pointerId !== pointerId)) return;
    dragging = false;
    if (moved) {
      try { vp.releasePointerCapture?.(pointerId); } catch { vp.dataset.captura = 'no'; }
      vp.classList.remove('dragging');
      const kill = ev => { ev.stopPropagation(); ev.preventDefault(); };
      vp.addEventListener('click', kill, { capture: true, once: true });
      setTimeout(() => vp.removeEventListener('click', kill, { capture: true }), 0);
    }
    pointerId = null; moved = false;
  };
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
  vp.addEventListener('dragstart', e => e.preventDefault());
}

function initRail() {
  const vp = document.querySelector('.hscroll');
  if (!vp) return;
  initRailDrag(vp);
  const track = vp.querySelector('.hscroll-track');
  const prev = document.querySelector('[data-rail="prev"]');
  const next = document.querySelector('[data-rail="next"]');
  if (!track || !prev || !next) return;
  const paso = () => {
    const first = track.firstElementChild;
    const gap = parseFloat(window.getComputedStyle(track).columnGap) || 20;
    return (first ? first.getBoundingClientRect().width : 300) + gap;
  };
  const mover = dir => vp.scrollBy({ left: dir * paso(), behavior: reduceMotion ? 'auto' : 'smooth' });
  prev.addEventListener('click', () => mover(-1));
  next.addEventListener('click', () => mover(1));
  const sync = () => {
    prev.disabled = vp.scrollLeft <= 2;
    next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  vp.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync, { passive: true });
  sync();
}

function initFaq() {
  document.querySelectorAll('.faq-item').forEach(d => d.addEventListener('toggle', refrescarScroll));
}

function initForm() {
  const form = document.getElementById('form-presupuesto');
  if (!form) return;
  const nombre = form.querySelector('#f-nombre');
  const tel = form.querySelector('#f-tel');
  let mask = null;
  if (tel && typeof IMask !== 'undefined') mask = IMask(tel, { mask: '+{54} 9 000 000-0000', lazy: true });
  const telOk = () => {
    if (mask) return mask.masked.isComplete;
    return tel.value.replace(/\D/g, '').length >= 10;
  };
  const reglas = [
    { el: nombre, ok: () => nombre.value.trim().length >= 2 },
    { el: tel, ok: telOk }
  ];
  const marcar = (el, malo) => {
    el.setAttribute('aria-invalid', String(malo));
    const err = document.getElementById(el.getAttribute('aria-describedby') || '');
    if (err) err.hidden = !malo;
  };
  reglas.forEach(r => r.el?.addEventListener('input', () => { if (r.el.getAttribute('aria-invalid') === 'true' && r.ok()) marcar(r.el, false); }));
  form.addEventListener('submit', e => {
    e.preventDefault();
    let primero = null;
    reglas.forEach(r => {
      if (!r.el) return;
      const malo = !r.ok();
      marcar(r.el, malo);
      if (malo && !primero) primero = r.el;
    });
    if (primero) {
      primero.focus();
      showToast('Nos falta un dato: revisá lo marcado en rojo.');
      return;
    }
    const btn = form.querySelector('button[type="submit"]');
    const txt = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Enviando…';
    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = txt;
      form.reset();
      mask?.updateValue();
      reglas.forEach(r => r.el && marcar(r.el, false));
      showToast('¡Gracias! El envío de mensajes se activa al pasar la web a producción.');
    }, 800);
  });
}

initHeroMotion();
initReveals();
initNav();
initWspFloat();
initModelBarScroll();
initVisor();
initRail();
initFaq();
initForm();
initParallax();
initBrilloHero();
