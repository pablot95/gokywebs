const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WA_NUMERO = '5493513032378';
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

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

function initHeader() {
  const header = document.querySelector('.site-header--m1');
  if (!header) return;
  const sync = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
  window.addEventListener('scroll', sync, { passive: true });
  sync();
}

let revealsListos = false;
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

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const imgs = hero.querySelectorAll('[data-hero-img]');
  if (imgs.length) tl.from(imgs, { scale: 1.1, duration: 1.8, stagger: 0.12 }, 0);
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.hero-datos li'), { y: 14, opacity: 0, duration: 0.8, stagger: 0.08, clearProps: 'transform,opacity' }, 0.75)
    .from(hero.querySelectorAll('.hero-badge, .sello360--hero'), { scale: 0.92, opacity: 0, duration: 1.1, stagger: 0.1, clearProps: 'transform,opacity' }, 0.65);
}

function initAnillos() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('.sello360__ticks').forEach(el => {
    gsap.fromTo(el, { rotation: -30 }, {
      rotation: 90, ease: 'none',
      scrollTrigger: { trigger: el.closest('section') || el, start: 'top bottom', end: 'bottom top', scrub: 0.8 }
    });
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

const giro = (actual, destino) => actual + ((((destino - actual) % 360) + 540) % 360 - 180);

function initRueda() {
  const rueda = document.querySelector('.rueda');
  if (!rueda) return;
  const nodos = [...rueda.querySelectorAll('.nodo')];
  const fotos = [...rueda.querySelectorAll('.rueda-foto')];
  const paneles = [...document.querySelectorAll('.rueda-detalle')];
  if (!nodos.length) return;
  let idx = 0;
  let ang = 0;
  const ir = (i, foco) => {
    i = (i + nodos.length) % nodos.length;
    const n = nodos[i];
    nodos.forEach((b, k) => { const on = k === i; b.setAttribute('aria-selected', on ? 'true' : 'false'); b.tabIndex = on ? 0 : -1; });
    fotos.forEach(f => f.classList.toggle('is-on', f.dataset.oficio === n.dataset.oficio));
    paneles.forEach(p => { p.hidden = p.id !== n.getAttribute('aria-controls'); });
    ang = giro(ang, Number(n.dataset.grado));
    rueda.style.setProperty('--ang', `${ang}deg`);
    idx = i;
    if (foco) n.focus();
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  };
  nodos.forEach((b, k) => b.addEventListener('click', () => ir(k)));
  rueda.querySelector('[role="tablist"]')?.addEventListener('keydown', e => {
    const mapa = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    if (e.key in mapa) { e.preventDefault(); ir(idx + mapa[e.key], true); }
    else if (e.key === 'Home') { e.preventDefault(); ir(0, true); }
    else if (e.key === 'End') { e.preventDefault(); ir(nodos.length - 1, true); }
  });
  document.querySelectorAll('.rueda-flechas .flecha').forEach(b => b.addEventListener('click', () => ir(idx + Number(b.dataset.dir))));
}

function initPedido() {
  const form = document.getElementById('pedidoForm');
  const ticket = document.getElementById('ticket');
  if (!form || !ticket) return;
  const $ = id => document.getElementById(id);
  const enviar = $('ticketEnviar');
  const campoOficio = $('campoOficio');
  const error = $('oficioError');
  const foto = $('ticketFoto');
  const aguja = ticket.querySelector('.mini-anillo');
  const elegido = name => form.querySelector(`input[name="${name}"]:checked`)?.value || '';
  let ang = 0;

  const armar = () => {
    const of = form.querySelector('input[name="oficio"]:checked');
    const detalle = $('pDetalle').value.trim();
    const zona = $('pZona').value.trim();
    const nombre = $('pNombre').value.trim();
    const inmueble = elegido('inmueble');
    const rol = elegido('rol');
    const modalidad = elegido('modalidad');
    ticket.classList.toggle('is-vacio', !of);
    if (of) {
      const grado = Number(of.dataset.grado);
      $('ticketOficio').textContent = of.dataset.nombre;
      $('ticketGrado').textContent = `${String(grado).padStart(3, '0')}°`;
      if (foto.getAttribute('src') !== of.dataset.foto) foto.src = of.dataset.foto;
      foto.hidden = false;
      ang = giro(ang, grado);
      aguja?.style.setProperty('--ang', `${ang}deg`);
      campoOficio.classList.remove('is-invalid');
      error.hidden = true;
    } else {
      $('ticketOficio').textContent = 'Elegí qué hay que arreglar';
      $('ticketGrado').textContent = '—';
    }
    $('tInmueble').textContent = [inmueble, zona].filter(Boolean).join(' · ') || '—';
    $('tRol').textContent = rol || '—';
    $('tModalidad').textContent = modalidad || '—';
    $('tDetalle').textContent = detalle || '—';
    const lineas = ['¡Hola Evolución 360°! Quiero pedir un arreglo.'];
    if (of) lineas.push(`• Oficio: ${of.dataset.nombre}`);
    if (detalle) lineas.push(`• Qué pasa: ${detalle}`);
    if (inmueble || zona) lineas.push(`• Inmueble: ${[inmueble, zona && (inmueble ? `en ${zona}` : zona)].filter(Boolean).join(' ')}`);
    if (rol) lineas.push(`• Soy: ${rol}`);
    if (modalidad) lineas.push(`• Modalidad: ${modalidad}`);
    if (nombre) lineas.push(`• Mi nombre: ${nombre}`);
    enviar.href = `https://wa.me/${WA_NUMERO}?text=${encodeURIComponent(lineas.join('\n'))}`;
  };

  form.addEventListener('change', armar);
  form.addEventListener('input', armar);
  enviar.addEventListener('click', e => {
    if (!form.querySelector('input[name="oficio"]:checked')) {
      e.preventDefault();
      campoOficio.classList.add('is-invalid');
      error.hidden = false;
      showToast('Elegí qué hay que arreglar y la orden se arma sola.');
      campoOficio.scrollIntoView({ block: 'center', behavior: reduceMotion ? 'auto' : 'smooth' });
      form.querySelector('input[name="oficio"]')?.focus({ preventScroll: true });
      return;
    }
    armar();
    showToast('Abrimos WhatsApp con tu orden de trabajo.');
  });

  document.querySelectorAll('a[data-oficio]').forEach(a => a.addEventListener('click', () => {
    const radio = form.querySelector(`input[name="oficio"][value="${a.dataset.oficio}"]`);
    if (radio) { radio.checked = true; armar(); }
  }));
  armar();
}

function initFaq() {
  document.querySelectorAll('.faq-item').forEach(d => d.addEventListener('toggle', () => {
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  }));
}

initReveals();
initNav();
initHeader();
initWspFloat();
initModelBarScroll();
initHeroMotion();
initAnillos();
initRueda();
initPedido();
initFaq();
