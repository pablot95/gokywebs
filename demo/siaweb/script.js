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

if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));

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
  const desktopMq = window.matchMedia('(min-width: 769px)');
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

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const img = hero.querySelector('[data-hero-img]');
  if (img) tl.from(img, { scale: 1.1, filter: 'brightness(0.42)', duration: 1.8, clearProps: 'filter' }, 0);
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 36, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 24, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn, .contacto-rapido > li'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.sello, .hero-badge'), { scale: 0.92, opacity: 0, duration: 1.1, stagger: 0.1, clearProps: 'transform,opacity' }, 0.65);
}

function initVisor() {
  const visor = document.getElementById('visor');
  if (!visor) return;
  const img = visor.querySelector('.visor__img');
  const cat = visor.querySelector('.visor__cat');
  const txt = visor.querySelector('.visor__txt');
  const num = visor.querySelector('.visor__num');
  const prev = visor.querySelector('.visor__prev');
  const next = visor.querySelector('.visor__next');
  const cerrarBtn = visor.querySelector('.visor__cerrar');
  let lista = [];
  let idx = 0;
  let origen = null;
  const pintar = () => {
    const b = lista[idx];
    if (!b) return;
    img.src = b.dataset.src;
    img.alt = b.querySelector('img')?.alt || '';
    cat.textContent = b.dataset.cat || '';
    txt.textContent = b.dataset.txt || '';
    num.textContent = `${idx + 1} / ${lista.length}`;
    prev.hidden = next.hidden = lista.length < 2;
  };
  const abrir = b => {
    lista = [...document.querySelectorAll(`[data-visor="${b.dataset.visor}"]`)].filter(x => !x.closest('[hidden]'));
    idx = Math.max(0, lista.indexOf(b));
    origen = b;
    pintar();
    visor.hidden = false;
    document.body.classList.add('no-scroll');
    requestAnimationFrame(() => visor.classList.add('abierto'));
    cerrarBtn.focus();
  };
  const cerrar = () => {
    visor.classList.remove('abierto');
    visor.hidden = true;
    document.body.classList.remove('no-scroll');
    origen?.focus();
  };
  const mover = d => {
    if (lista.length < 2) return;
    idx = (idx + d + lista.length) % lista.length;
    pintar();
  };
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-visor]');
    if (b) { e.preventDefault(); abrir(b); }
  });
  visor.addEventListener('click', e => { if (e.target.closest('[data-cerrar]')) cerrar(); });
  prev.addEventListener('click', () => mover(-1));
  next.addEventListener('click', () => mover(1));
  document.addEventListener('keydown', e => {
    if (visor.hidden) return;
    if (e.key === 'Escape') { e.preventDefault(); cerrar(); }
    else if (e.key === 'ArrowLeft') mover(-1);
    else if (e.key === 'ArrowRight') mover(1);
    else if (e.key === 'Tab') {
      const f = [...visor.querySelectorAll('button')].filter(x => !x.hidden);
      const i = f.indexOf(document.activeElement);
      if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
    }
  });
}

function initGaleria() {
  const gal = document.getElementById('galeria');
  if (!gal) return;
  const chips = [...gal.querySelectorAll('[data-filtro]')];
  const grid = gal.querySelector('.galeria__grid');
  const items = [...grid.children];
  const infos = [...gal.querySelectorAll('[data-info]')];
  const aplicar = f => {
    chips.forEach(c => c.setAttribute('aria-pressed', String(c.dataset.filtro === f)));
    items.forEach(li => { li.hidden = f !== 'todo' && li.dataset.cat !== f; });
    infos.forEach(i => { i.hidden = i.dataset.info !== f; });
    revelarNuevos(grid);
  };
  chips.forEach(c => c.addEventListener('click', () => aplicar(c.dataset.filtro)));
  const pedido = new URLSearchParams(location.search).get('modulo');
  if (pedido && chips.some(c => c.dataset.filtro === pedido)) {
    aplicar(pedido);
    window.addEventListener('load', () => gal.scrollIntoView({ block: 'start' }));
  }
}

function initForm() {
  const form = document.getElementById('formContacto');
  if (!form) return;
  const reglas = {
    nombre: v => v.trim().length >= 2 || 'Contanos tu nombre.',
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || 'Revisá el email: falta algo.',
    telefono: v => !v.trim() || v.replace(/\D/g, '').length >= 8 || 'El teléfono parece incompleto.',
    servicio: v => !!v || 'Elegí qué te interesa.',
    mensaje: v => v.trim().length >= 10 || 'Contanos un poco más (mínimo 10 caracteres).'
  };
  const marcar = (campo, msg) => {
    const err = document.getElementById(`err-${campo.name}`);
    if (msg) { campo.setAttribute('aria-invalid', 'true'); if (err) err.textContent = msg; }
    else { campo.removeAttribute('aria-invalid'); if (err) err.textContent = ''; }
  };
  const validar = campo => {
    const r = reglas[campo.name];
    if (!r) return true;
    const ok = r(campo.value);
    marcar(campo, ok === true ? '' : ok);
    return ok === true;
  };
  form.querySelectorAll('input, select, textarea').forEach(c => {
    c.addEventListener('blur', () => { if (c.value) validar(c); });
    c.addEventListener('input', () => { if (c.getAttribute('aria-invalid')) validar(c); });
  });
  form.addEventListener('submit', e => {
    e.preventDefault();
    const campos = [...form.querySelectorAll('input, select, textarea')];
    const malos = campos.filter(c => !validar(c));
    if (malos.length) { malos[0].focus(); return; }
    const btn = form.querySelector('button[type="submit"]');
    const txt = btn.innerHTML;
    btn.disabled = true;
    btn.textContent = 'Enviando…';
    setTimeout(() => {
      showToast('¡Gracias! El envío de mensajes se activa al pasar la web a producción.');
      form.reset();
      btn.disabled = false;
      btn.innerHTML = txt;
    }, 800);
  });
}

let revealsListos = false;
function revelarNuevos(cont) {
  if (!revealsListos || !cont) return;
  const nuevos = [...cont.querySelectorAll('[data-animate]:not(.in)')];
  if (!nuevos.length) return;
  if (reduceMotion) { nuevos.forEach(el => el.classList.add('in')); return; }
  requestAnimationFrame(() => requestAnimationFrame(() => nuevos.forEach((el, i) => {
    const d = Math.min(i * 0.06, 0.6);
    el.style.transitionDelay = `${d}s`;
    el.classList.add('in');
    setTimeout(() => { el.style.transitionDelay = ''; }, (d + 1.2) * 1000);
  })));
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

initModelos();
initModelBarScroll();
initNav();
initWspFloat();
initHeroMotion();
initVisor();
initGaleria();
initForm();
initReveals();
