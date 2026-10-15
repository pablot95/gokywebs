const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5492614686941';
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const wspUrl = texto => `https://wa.me/${WSP}?text=${encodeURIComponent(texto)}`;

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

function refrescar() {
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
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

function revelarNuevos(cont) {
  if (!revealsListos || !cont) return;
  const nuevos = [...cont.querySelectorAll('[data-animate]:not(.in)')].filter(el => !el.hidden);
  if (!nuevos.length) return;
  if (reduceMotion) { nuevos.forEach(el => el.classList.add('in')); return; }
  requestAnimationFrame(() => requestAnimationFrame(() => nuevos.forEach((el, i) => {
    const d = Math.min(i * 0.06, 0.6);
    el.style.transitionDelay = `${d}s`;
    el.classList.add('in');
    setTimeout(() => { el.style.transitionDelay = ''; }, (d + 1.2) * 1000);
  })));
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
  const hero = document.querySelector('.hero--full');
  const img = hero?.querySelector('[data-hero-img]');
  if (!img) return;
  gsap.to(img, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
}

function initFrase() {
  const el = document.getElementById('fraseScroll');
  if (!el) return;
  const palabras = el.textContent.trim().split(/\s+/);
  el.innerHTML = palabras.map(p => `<span class="w">${esc(p)}</span>`).join(' ');
  const ws = [...el.querySelectorAll('.w')];
  if (reduceMotion) { ws.forEach(w => w.classList.add('on')); return; }
  let frame = 0;
  const update = () => {
    frame = 0;
    const r = el.getBoundingClientRect();
    const vh = window.innerHeight;
    const p = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (r.height + vh * 0.35)));
    const n = Math.round(p * ws.length);
    ws.forEach((w, i) => w.classList.toggle('on', i < n));
  };
  window.addEventListener('scroll', () => { if (!frame) frame = requestAnimationFrame(update); }, { passive: true });
  window.addEventListener('resize', update, { passive: true });
  update();
}

function initGaleria() {
  const lista = document.getElementById('obras');
  if (!lista) return;
  const items = [...lista.querySelectorAll('.obra')];
  const filtros = [...document.querySelectorAll('.filtro')];
  filtros.forEach(btn => btn.addEventListener('click', () => {
    const f = btn.dataset.filtro;
    filtros.forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
    lista.classList.toggle('is-filtrada', f !== 'todos');
    items.forEach(li => { li.hidden = f !== 'todos' && !(li.dataset.tags || '').split(' ').includes(f); });
    revelarNuevos(lista);
    refrescar();
  }));

  const visor = document.getElementById('visor');
  if (!visor) return;
  const img = document.getElementById('visorImg');
  const tag = document.getElementById('visorTag');
  const titulo = document.getElementById('visorTitulo');
  const cuenta = document.getElementById('visorCuenta');
  const wsp = document.getElementById('visorWsp');
  const cerrar = document.getElementById('visorCerrar');
  const prev = document.getElementById('visorPrev');
  const next = document.getElementById('visorNext');
  let visibles = [];
  let actual = 0;
  let ultimoFoco = null;

  const pintar = () => {
    const li = visibles[actual];
    const im = li?.querySelector('img');
    if (!im) return;
    img.src = im.getAttribute('src');
    img.alt = im.alt;
    img.setAttribute('width', im.getAttribute('width'));
    img.setAttribute('height', im.getAttribute('height'));
    const t = li.querySelector('.obra__titulo')?.textContent || '';
    tag.textContent = li.querySelector('.obra__tag')?.textContent || '';
    titulo.textContent = t;
    cuenta.textContent = `${actual + 1} / ${visibles.length}`;
    wsp.href = wspUrl(`Hola M&M Construcciones, vi en la web el trabajo «${t}» y quiero algo así.`);
    const varias = visibles.length > 1;
    prev.hidden = !varias;
    next.hidden = !varias;
  };
  const abrir = li => {
    visibles = items.filter(x => !x.hidden);
    actual = Math.max(0, visibles.indexOf(li));
    ultimoFoco = li.querySelector('.obra__btn');
    pintar();
    visor.hidden = false;
    document.body.classList.add('no-scroll');
    requestAnimationFrame(() => visor.classList.add('open'));
    cerrar.focus();
  };
  const cerrarVisor = () => {
    visor.classList.remove('open');
    visor.hidden = true;
    document.body.classList.remove('no-scroll');
    ultimoFoco?.focus();
  };
  const mover = d => {
    if (!visibles.length) return;
    actual = (actual + d + visibles.length) % visibles.length;
    pintar();
  };
  items.forEach(li => li.querySelector('.obra__btn')?.addEventListener('click', () => abrir(li)));
  cerrar.addEventListener('click', cerrarVisor);
  prev.addEventListener('click', () => mover(-1));
  next.addEventListener('click', () => mover(1));
  visor.addEventListener('click', e => { if (e.target === visor) cerrarVisor(); });
  document.addEventListener('keydown', e => {
    if (visor.hidden) return;
    if (e.key === 'Escape') { cerrarVisor(); return; }
    if (e.key === 'ArrowLeft') mover(-1);
    if (e.key === 'ArrowRight') mover(1);
    if (e.key === 'Tab') {
      const foco = [...visor.querySelectorAll('button, a[href]')].filter(el => !el.hidden && el.getClientRects().length);
      if (!foco.length) return;
      const primero = foco[0];
      const ultimo = foco[foco.length - 1];
      if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
      else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
    }
  });
}

function initPresupuesto() {
  const form = document.getElementById('presuForm');
  if (!form) return;
  const preview = document.getElementById('presuPreview');
  const nombre = document.getElementById('pNombre');
  const zona = document.getElementById('pZona');
  const detalle = document.getElementById('pDetalle');
  const errTrabajo = document.getElementById('errTrabajo');
  const errNombre = document.getElementById('errNombre');
  const errDetalle = document.getElementById('errDetalle');
  const trabajos = () => [...form.querySelectorAll('input[data-f="trabajo"]:checked')].map(i => i.value);
  const obra = () => form.querySelector('input[name="obra"]:checked')?.value || '';
  const faltaNombre = () => !nombre.value.trim();
  const faltaDetalle = () => detalle.value.trim().length < 6;

  const mensaje = () => {
    const t = trabajos();
    const lineas = ['Hola M&M Construcciones, quiero pedir un presupuesto.'];
    lineas.push(`• Trabajo: ${t.length ? t.join(', ') : '(elegí al menos uno)'}`);
    lineas.push(`• Obra: ${obra()}`);
    if (zona.value.trim()) lineas.push(`• Zona: ${zona.value.trim()}`);
    lineas.push(`• Detalle: ${detalle.value.trim() || '(contanos el trabajo)'}`);
    if (nombre.value.trim()) lineas.push(`Soy ${nombre.value.trim()}.`);
    return lineas.join('\n');
  };
  const marcar = (campo, err, mal) => {
    campo.setAttribute('aria-invalid', String(mal));
    err.hidden = !mal;
  };
  const actualizar = () => {
    preview.textContent = mensaje();
    if (!errTrabajo.hidden && trabajos().length) errTrabajo.hidden = true;
    if (!errNombre.hidden && !faltaNombre()) marcar(nombre, errNombre, false);
    if (!errDetalle.hidden && !faltaDetalle()) marcar(detalle, errDetalle, false);
  };
  form.addEventListener('input', actualizar);
  form.addEventListener('change', actualizar);
  actualizar();

  form.addEventListener('submit', e => {
    e.preventDefault();
    const sinTrabajo = !trabajos().length;
    const sinNombre = faltaNombre();
    const sinDetalle = faltaDetalle();
    errTrabajo.hidden = !sinTrabajo;
    marcar(nombre, errNombre, sinNombre);
    marcar(detalle, errDetalle, sinDetalle);
    if (sinTrabajo || sinNombre || sinDetalle) {
      const primero = sinTrabajo ? form.querySelector('input[data-f="trabajo"]') : sinNombre ? nombre : detalle;
      primero?.focus();
      showToast('Revisá lo marcado y el pedido queda listo.');
      refrescar();
      return;
    }
    const url = wspUrl(mensaje());
    const ventana = window.open(url, '_blank');
    if (ventana) ventana.opener = null;
    else window.location.href = url;
    showToast('Abrimos WhatsApp con tu pedido listo para enviar.');
  });
}

function initFaq() {
  document.querySelectorAll('.faq__item').forEach(d => d.addEventListener('toggle', refrescar));
}

initFrase();
initGaleria();
initReveals();
initHeroMotion();
initParallax();
initNav();
initWspFloat();
initModelBarScroll();
initPresupuesto();
initFaq();
