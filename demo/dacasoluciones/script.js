const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5491131179960';
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

const refrescar = () => { if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); };
const wspHref = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;

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
  const desktopMq = window.matchMedia('(min-width: 1025px)');
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
  document.addEventListener('keydown', e => {
    if (!nav.classList.contains('open')) return;
    if (e.key === 'Escape') { close(); toggle.focus(); return; }
    if (e.key === 'Tab') {
      const f = [...nav.querySelectorAll('a, button')];
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
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
  const px = document.querySelector('.fletes__foto .px');
  const seccion = document.querySelector('.fletes');
  if (!px || !seccion) return;
  gsap.fromTo(px, { yPercent: -3 }, { yPercent: 3, ease: 'none', scrollTrigger: { trigger: seccion, start: 'top bottom', end: 'bottom top', scrub: true } });
}

function initFaq() {
  document.querySelectorAll('.faq__item').forEach(d => d.addEventListener('toggle', refrescar));
}

function initRapido() {
  const box = document.getElementById('rapido');
  const btn = document.getElementById('rapidoBtn');
  if (!box || !btn) return;
  const base = 'Hola DACA Soluciones! Vi la web y quiero pedir un presupuesto sin cargo.';
  const actualizar = () => {
    const elegidos = [...box.querySelectorAll('input[data-rapido]:checked')].map(i => i.value);
    const msg = elegidos.length ? `Hola DACA Soluciones! Quiero pedir un presupuesto sin cargo para: ${elegidos.join(', ')}.` : base;
    btn.href = wspHref(msg);
    btn.dataset.wspMsg = msg;
  };
  box.addEventListener('change', actualizar);
  actualizar();
}

function initPedido() {
  const form = document.getElementById('pedido');
  if (!form) return;
  const resumen = document.getElementById('pedidoResumen');
  const chips = [...form.querySelectorAll('input[data-servicio]')];
  const nombre = form.querySelector('#p-nombre');
  const zona = form.querySelector('#p-zona');
  const trabajo = form.querySelector('#p-trabajo');
  const cuando = form.querySelector('#p-cuando');
  const errServ = form.querySelector('#err-servicios');
  const leer = () => ({
    servicios: chips.filter(c => c.checked).map(c => c.value),
    nombre: nombre.value.trim(),
    zona: zona.value.trim(),
    trabajo: trabajo.value.trim(),
    cuando: cuando.value
  });
  const pintar = () => {
    const d = leer();
    const partes = [d.servicios.length ? d.servicios.join(' + ') : 'Elegí los servicios'];
    partes.push(d.zona || 'tu barrio');
    partes.push(d.cuando.toLowerCase());
    resumen.textContent = partes.join(' · ');
  };
  const reglas = [
    [nombre, v => v.length >= 2],
    [zona, v => v.length >= 2],
    [trabajo, v => v.length >= 8]
  ];
  const marcar = (input, ok) => {
    const err = document.getElementById(input.getAttribute('aria-describedby'));
    input.setAttribute('aria-invalid', ok ? 'false' : 'true');
    if (err) err.hidden = ok;
  };
  reglas.forEach(([input, ok]) => {
    input.addEventListener('input', () => { if (input.getAttribute('aria-invalid') === 'true') marcar(input, ok(input.value.trim())); pintar(); });
    input.addEventListener('blur', () => { if (input.value.trim()) marcar(input, ok(input.value.trim())); });
  });
  form.addEventListener('change', () => {
    if (chips.some(c => c.checked)) errServ.hidden = true;
    pintar();
  });
  form.addEventListener('submit', e => {
    e.preventDefault();
    const d = leer();
    let primero = null;
    if (!d.servicios.length) { errServ.hidden = false; primero = chips[0]; }
    reglas.forEach(([input, ok]) => {
      const bien = ok(input.value.trim());
      marcar(input, bien);
      if (!bien && !primero) primero = input;
    });
    if (primero) {
      primero.focus();
      showToast('Revisá los datos marcados y lo armamos.');
      return;
    }
    const msg = [
      'Hola DACA Soluciones! Quiero pedir un presupuesto sin cargo.',
      `Servicios: ${d.servicios.join(', ')}`,
      `Nombre: ${d.nombre}`,
      `Zona: ${d.zona}`,
      `Para: ${d.cuando}`,
      `Trabajo: ${d.trabajo}`
    ].join('\n');
    window.open(wspHref(msg), '_blank', 'noopener');
    showToast('¡Listo! Te abrimos WhatsApp con tu pedido armado.');
    form.reset();
    reglas.forEach(([input]) => input.removeAttribute('aria-invalid'));
    pintar();
  });
  pintar();
}

initModelBarScroll();
initWspFloat();
initNav();
initRapido();
initPedido();
initFaq();
initReveals();
initHeroMotion();
initParallax();
