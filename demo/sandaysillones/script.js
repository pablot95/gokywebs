const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5491121637903';
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
  if (!bd) {
    bd = document.createElement('div');
    bd.className = 'nav-backdrop';
    const header = document.querySelector('.site-header');
    (header || document.body).appendChild(bd);
  }
  const desktopMq = window.matchMedia('(min-width: 901px)');
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
  desktopMq.addEventListener('change', () => { if (desktopMq.matches && nav.classList.contains('open')) close(); syncInert(); });
  syncInert();
}

function initWspLinks() {
  document.querySelectorAll('a[data-wsp-msg]').forEach(a => {
    a.href = `https://wa.me/${WSP}?text=${encodeURIComponent(a.dataset.wspMsg)}`;
  });
}

function initWspFloat() {
  const btn = document.getElementById('wsp-float');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) btn.classList.add('visible'); else btn.classList.remove('visible');
  }, { passive: true });
}

function initVisor() {
  const visor = document.getElementById('visor');
  const botones = [...document.querySelectorAll('[data-visor]')];
  if (!visor || !botones.length) return;
  const img = document.getElementById('visor-img');
  const tipo = document.getElementById('visor-tipo');
  const tela = document.getElementById('visor-tela');
  const cuenta = document.getElementById('visor-cuenta');
  const wsp = document.getElementById('visor-wsp');
  const prev = document.getElementById('visor-prev');
  const next = document.getElementById('visor-next');
  const cerrar = document.getElementById('visor-cerrar');
  const datos = botones.map(b => ({
    src: b.querySelector('img')?.getAttribute('src') || '',
    alt: b.querySelector('img')?.getAttribute('alt') || '',
    tipo: b.querySelector('.trabajo__tipo')?.textContent.trim() || '',
    tela: b.querySelector('.trabajo__tela')?.textContent.trim() || ''
  }));
  let idx = 0;
  let volverA = null;
  let ocultar = 0;

  const pintar = () => {
    const d = datos[idx];
    if (!d) return;
    img.src = d.src;
    img.alt = d.alt;
    tipo.textContent = d.tipo;
    tela.textContent = d.tela;
    cuenta.textContent = `${idx + 1} de ${datos.length}`;
    const msg = `Hola Sanday sillones! Vi en la web el trabajo «${d.tipo}, ${d.tela.toLowerCase()}» y quiero uno así.`;
    wsp.href = `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
  };
  const abrir = i => {
    clearTimeout(ocultar);
    idx = i;
    pintar();
    volverA = document.activeElement;
    visor.hidden = false;
    void visor.offsetWidth;
    visor.classList.add('abierto');
    document.body.classList.add('no-scroll');
    cerrar.focus();
  };
  const close = () => {
    visor.classList.remove('abierto');
    document.body.classList.remove('no-scroll');
    ocultar = setTimeout(() => { visor.hidden = true; }, reduceMotion ? 0 : 260);
    if (volverA && typeof volverA.focus === 'function') volverA.focus();
  };
  const mover = paso => { idx = (idx + paso + datos.length) % datos.length; pintar(); };

  botones.forEach(b => b.addEventListener('click', () => abrir(Number(b.dataset.visor) || 0)));
  prev?.addEventListener('click', () => mover(-1));
  next?.addEventListener('click', () => mover(1));
  cerrar?.addEventListener('click', close);
  visor.addEventListener('click', e => { if (e.target === visor) close(); });
  document.addEventListener('keydown', e => {
    if (visor.hidden) return;
    if (e.key === 'Escape') { e.preventDefault(); close(); return; }
    if (e.key === 'ArrowLeft') mover(-1);
    if (e.key === 'ArrowRight') mover(1);
    if (e.key === 'Tab') {
      const f = [...visor.querySelectorAll('a[href], button:not([disabled])')];
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
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
      try { vp.setPointerCapture?.(pointerId); } catch (err) { void err; }
    }
    e.preventDefault();
    vp.scrollLeft = startScroll - dx;
  });
  const end = e => {
    if (!dragging || (e && pointerId !== null && e.pointerId !== pointerId)) return;
    dragging = false;
    if (moved) {
      try { vp.releasePointerCapture?.(pointerId); } catch (err) { void err; }
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
  const vp = document.getElementById('rail-trabajos');
  if (!vp) return;
  initRailDrag(vp);
  const track = vp.querySelector('.hscroll-track');
  const prev = document.getElementById('rail-prev');
  const next = document.getElementById('rail-next');
  if (!track || !prev || !next) return;
  const paso = () => {
    const card = track.firstElementChild;
    const gap = parseFloat(window.getComputedStyle(track).columnGap) || 20;
    return (card ? card.getBoundingClientRect().width : 300) + gap;
  };
  const sync = () => {
    prev.disabled = vp.scrollLeft <= 2;
    next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  prev.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  next.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  vp.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync, { passive: true });
  sync();
}

function initForm() {
  const form = document.getElementById('form-presupuesto');
  if (!form) return;
  const reglas = [
    ['f-nombre', v => v.trim().length >= 2],
    ['f-tel', v => v.replace(/\D/g, '').length >= 8],
    ['f-mueble', v => v !== '']
  ];
  const validar = (id, ok) => {
    const el = document.getElementById(id);
    const err = document.getElementById(`${id}-error`);
    if (!el) return true;
    el.setAttribute('aria-invalid', ok ? 'false' : 'true');
    if (err) err.hidden = ok;
    return ok;
  };
  reglas.forEach(([id, regla]) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('blur', () => { if (el.value) validar(id, regla(el.value)); });
    el.addEventListener('input', () => { if (el.getAttribute('aria-invalid') === 'true') validar(id, regla(el.value)); });
    el.addEventListener('change', () => { if (el.getAttribute('aria-invalid') === 'true') validar(id, regla(el.value)); });
  });
  form.addEventListener('submit', e => {
    e.preventDefault();
    let primero = null;
    reglas.forEach(([id, regla]) => {
      const el = document.getElementById(id);
      if (!el) return;
      if (!validar(id, regla(el.value)) && !primero) primero = el;
    });
    if (primero) {
      primero.focus();
      showToast('Revisá los datos marcados y volvé a intentar.');
      return;
    }
    const btn = form.querySelector('button[type="submit"]');
    const texto = btn ? btn.textContent : '';
    if (btn) { btn.disabled = true; btn.textContent = 'Enviando…'; }
    setTimeout(() => {
      if (btn) { btn.disabled = false; btn.textContent = texto; }
      form.reset();
      reglas.forEach(([id]) => document.getElementById(id)?.removeAttribute('aria-invalid'));
      showToast('¡Gracias! El envío de mensajes se activa al pasar la web a producción.');
    }, 800);
  });
}

function initFaq() {
  document.querySelectorAll('.faq details').forEach(d => {
    d.addEventListener('toggle', () => { if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); });
  });
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

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('.hero__media, .panorama__media').forEach(box => {
    const inner = box.querySelector('img');
    if (!inner) return;
    gsap.fromTo(inner, { yPercent: -2.5 }, {
      yPercent: 2.5,
      ease: 'none',
      scrollTrigger: { trigger: box, start: 'top top', end: 'bottom top', scrub: true }
    });
  });
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

initModelBarScroll();
initNav();
initWspLinks();
initWspFloat();
initVisor();
initRail();
initForm();
initFaq();
initHeroMotion();
initParallax();
initReveals();
