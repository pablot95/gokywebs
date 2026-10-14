const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const WA_NUMERO = '5491159241497';

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

const refrescarTriggers = () => { if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); };

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

function initNavActivo() {
  const links = [...document.querySelectorAll('.main-nav a[href^="#"]')];
  if (!links.length || !('IntersectionObserver' in window)) return;
  const secciones = links.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = `#${entry.target.id}`;
      links.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  secciones.forEach(s => io.observe(s));
}

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const img = hero.querySelector('[data-hero-img]');
  if (img) tl.from(img, { scale: 1.1, duration: 1.8, clearProps: 'transform' }, 0);
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.sello, .chip'), { scale: 0.92, opacity: 0, duration: 1.1, stagger: 0.08, clearProps: 'transform,opacity' }, 0.65);
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('[data-parallax]').forEach(img => {
    const cont = img.closest('.hero') || img.parentElement;
    gsap.fromTo(img, { yPercent: -3 }, { yPercent: 3, ease: 'none', scrollTrigger: { trigger: cont, start: 'top top', end: 'bottom top', scrub: true } });
  });
}

function initTrabajos() {
  const grid = document.getElementById('trabajosGrid');
  if (!grid) return;
  const items = [...grid.querySelectorAll('.trabajo')];
  const filtros = [...document.querySelectorAll('.filtro')];
  const estado = document.getElementById('trabajosEstado');
  const nombres = { tinglados: 'tinglados', techos: 'techos', pergolas: 'pérgolas', rejas: 'rejas' };

  filtros.forEach(boton => boton.addEventListener('click', () => {
    const cat = boton.dataset.filtro;
    filtros.forEach(b => b.setAttribute('aria-pressed', String(b === boton)));
    let visibles = 0;
    items.forEach(item => {
      const on = cat === 'todos' || item.dataset.cat === cat;
      item.hidden = !on;
      if (!on) return;
      visibles++;
      item.classList.add('in');
      const btn = item.querySelector('.trabajo__btn');
      if (btn && !reduceMotion) { btn.classList.remove('recien'); void btn.offsetWidth; btn.classList.add('recien'); }
    });
    grid.classList.toggle('is-filtrado', cat !== 'todos');
    if (estado) estado.textContent = cat === 'todos' ? `Mostrando los ${visibles} trabajos` : `Mostrando ${visibles} trabajos de ${nombres[cat] || cat}`;
    refrescarTriggers();
  }));

  const visor = document.getElementById('visor');
  if (!visor) return;
  const vImg = document.getElementById('visorImg');
  const vCat = document.getElementById('visorCat');
  const vTitulo = document.getElementById('visorTitulo');
  const vDesc = document.getElementById('visorDesc');
  const vCuenta = document.getElementById('visorCuenta');
  const vWa = document.getElementById('visorWa');
  const prev = document.getElementById('visorPrev');
  const next = document.getElementById('visorNext');
  let lista = [];
  let actual = 0;
  let ultimoFoco = null;

  const pintar = () => {
    const btn = lista[actual];
    if (!btn) return;
    const img = btn.querySelector('img');
    vImg.src = img?.getAttribute('src') || '';
    vImg.alt = img?.alt || '';
    vImg.style.objectPosition = img?.style.objectPosition || '';
    if (!reduceMotion) { vImg.classList.remove('recien'); void vImg.offsetWidth; vImg.classList.add('recien'); }
    vCat.textContent = btn.dataset.catLabel || '';
    vTitulo.textContent = btn.dataset.titulo || '';
    vDesc.textContent = btn.dataset.desc || '';
    vCuenta.textContent = `${actual + 1} de ${lista.length}`;
    const msg = `Hola MR Construcciones, vi en la web el trabajo «${btn.dataset.titulo || ''}» y quiero algo parecido. ¿Me pasan presupuesto?`;
    vWa.href = `https://wa.me/${WA_NUMERO}?text=${encodeURIComponent(msg)}`;
    const varios = lista.length > 1;
    prev.hidden = !varios;
    next.hidden = !varios;
  };
  const mover = paso => { actual = (actual + paso + lista.length) % lista.length; pintar(); };
  const focables = () => [...visor.querySelectorAll('button:not([hidden]), a[href]')].filter(el => el.offsetParent !== null);

  const abrir = btn => {
    lista = items.filter(it => !it.hidden).map(it => it.querySelector('.trabajo__btn')).filter(Boolean);
    actual = Math.max(0, lista.indexOf(btn));
    ultimoFoco = btn;
    pintar();
    visor.hidden = false;
    document.body.classList.add('no-scroll');
    visor.querySelector('.visor__cerrar')?.focus();
  };
  const cerrar = () => {
    if (visor.hidden) return;
    visor.hidden = true;
    document.body.classList.remove('no-scroll');
    ultimoFoco?.focus();
  };

  grid.querySelectorAll('.trabajo__btn').forEach(btn => btn.addEventListener('click', () => abrir(btn)));
  visor.querySelectorAll('[data-cerrar]').forEach(el => el.addEventListener('click', cerrar));
  prev?.addEventListener('click', () => mover(-1));
  next?.addEventListener('click', () => mover(1));
  document.addEventListener('keydown', e => {
    if (visor.hidden) return;
    if (e.key === 'Escape') { e.preventDefault(); cerrar(); }
    else if (e.key === 'ArrowLeft' && lista.length > 1) mover(-1);
    else if (e.key === 'ArrowRight' && lista.length > 1) mover(1);
    else if (e.key === 'Tab') {
      const f = focables();
      if (!f.length) return;
      const primero = f[0];
      const ultimo = f[f.length - 1];
      if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
      else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
    }
  });
}

function initServFilas() {
  const filas = [...document.querySelectorAll('.serv-fila')];
  const imgs = [...document.querySelectorAll('.serv-visual__marco img')];
  if (!filas.length || !imgs.length) return;
  const cap = document.getElementById('servCap');
  let activa = 0;
  const activar = i => {
    if (i < 0 || i === activa) return;
    activa = i;
    filas.forEach((f, k) => f.classList.toggle('is-on', k === i));
    imgs.forEach((im, k) => im.classList.toggle('is-on', k === i));
    if (cap) cap.textContent = filas[i].dataset.nombre || '';
  };
  filas.forEach((f, i) => {
    f.addEventListener('mouseenter', () => activar(i));
    f.addEventListener('focusin', () => activar(i));
  });
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) activar(filas.indexOf(entry.target)); });
    }, { rootMargin: '-45% 0px -45% 0px' });
    filas.forEach(f => io.observe(f));
  }
}

function initFaq() {
  document.querySelectorAll('.faq__item').forEach(d => d.addEventListener('toggle', refrescarTriggers));
}

function initForm() {
  const form = document.getElementById('formContacto');
  if (!form) return;
  const reglas = {
    fNombre: v => v.trim().length >= 2 || 'Contanos tu nombre.',
    fTel: v => (v.replace(/\D/g, '').length >= 10 && v.replace(/\D/g, '').length <= 13) || 'Dejanos un WhatsApp con código de área, por ejemplo 11 2345-6789.',
    fTipo: v => !!v || 'Elegí qué querés construir.',
    fMsg: v => v.trim().length >= 10 || 'Contanos un poco más: medidas, lugar o idea.',
  };
  const validar = id => {
    const campo = document.getElementById(id);
    const error = document.getElementById(`${id}Error`);
    if (!campo || !reglas[id]) return true;
    const r = reglas[id](campo.value);
    const ok = r === true;
    campo.setAttribute('aria-invalid', ok ? 'false' : 'true');
    if (error) error.textContent = ok ? '' : r;
    return ok;
  };
  Object.keys(reglas).forEach(id => {
    const campo = document.getElementById(id);
    campo?.addEventListener('blur', () => { if (campo.value) validar(id); });
    campo?.addEventListener('input', () => { if (campo.getAttribute('aria-invalid') === 'true') validar(id); });
  });
  form.addEventListener('submit', e => {
    e.preventDefault();
    const malos = Object.keys(reglas).filter(id => !validar(id));
    if (malos.length) { document.getElementById(malos[0])?.focus(); return; }
    const boton = form.querySelector('button[type="submit"]');
    const texto = boton.textContent;
    boton.disabled = true;
    boton.textContent = 'Enviando…';
    setTimeout(() => {
      showToast('¡Gracias! El envío de mensajes se activa al pasar la web a producción.');
      form.reset();
      Object.keys(reglas).forEach(id => document.getElementById(id)?.setAttribute('aria-invalid', 'false'));
      boton.disabled = false;
      boton.textContent = texto;
    }, 800);
  });
}

initWspFloat();
initNav();
initModelBarScroll();
initNavActivo();
initTrabajos();
initServFilas();
initFaq();
initForm();
initHeroMotion();
initParallax();
initReveals();
