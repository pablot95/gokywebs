const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WA_NUMERO = '5491121699628';
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
    .from(hero.querySelectorAll('.hero-marca'), { yPercent: 28, opacity: 0, duration: 1.2, clearProps: 'transform,opacity' }, 0.15)
    .from(hero.querySelectorAll('h1'), { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.3)
    .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1 }, 0.5)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.62);
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  const foto = document.querySelector('.hero--escenario .hero__foto');
  if (foto) gsap.to(foto, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: '.hero--escenario', start: 'top top', end: 'bottom top', scrub: true } });
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

function fechaLarga(valor) {
  if (!valor) return '';
  const d = new Date(`${valor}T12:00:00`);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

function hoyISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function initConsulta() {
  const form = document.getElementById('consultaForm');
  const preview = document.getElementById('consultaPreview');
  const enviar = document.getElementById('consultaEnviar');
  if (!form || !preview || !enviar) return;
  const fecha = form.querySelector('[name="fecha"]');
  const grupoEvento = document.getElementById('grupoEvento');
  const errEvento = document.getElementById('errEvento');
  const errFecha = document.getElementById('errFecha');
  const minimo = hoyISO();
  if (fecha) fecha.min = minimo;
  const saludo = 'Hola Tokyo, quiero consultar por una fecha de booking.';

  const leer = () => {
    const val = k => String((form.querySelector(`[name="${k}"]:checked`) || form.querySelector(`[name="${k}"]:not([type="radio"])`))?.value || '').trim();
    return { evento: val('evento'), fecha: val('fecha'), lugar: val('lugar'), nombre: val('nombre') };
  };
  const filas = d => [
    ['Evento', d.evento, 'Elegí el tipo de evento'],
    ['Fecha', fechaLarga(d.fecha), 'Elegí la fecha'],
    ['Lugar', d.lugar],
    ['Mi nombre', d.nombre]
  ];

  const pintar = () => {
    const d = leer();
    const lista = filas(d);
    preview.innerHTML = `<p class="ticket__saludo">${esc(saludo)}</p>` + lista
      .filter(([, v, pendiente]) => v || pendiente)
      .map(([k, v, pendiente]) => `<p class="ticket__fila"><span class="ticket__k">${esc(k)}:</span><span class="ticket__v${v ? '' : ' pendiente'}">${esc(v || pendiente)}</span></p>`)
      .join('');
    const lineas = [saludo, ...lista.filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`)];
    enviar.href = `https://wa.me/${WA_NUMERO}?text=${encodeURIComponent(lineas.join('\n'))}`;
    if (d.evento) { errEvento.hidden = true; grupoEvento.classList.remove('invalido'); }
    if (d.fecha && d.fecha >= minimo) { errFecha.hidden = true; fecha.removeAttribute('aria-invalid'); }
  };

  form.addEventListener('input', pintar);
  form.addEventListener('change', pintar);
  enviar.addEventListener('click', e => {
    const d = leer();
    const faltaEvento = !d.evento;
    const fechaMala = !d.fecha || d.fecha < minimo;
    if (!faltaEvento && !fechaMala) return;
    e.preventDefault();
    errEvento.hidden = !faltaEvento;
    grupoEvento.classList.toggle('invalido', faltaEvento);
    errFecha.hidden = !fechaMala;
    errFecha.textContent = d.fecha && d.fecha < minimo ? 'Esa fecha ya pasó: elegí una desde hoy.' : 'Elegí la fecha del evento.';
    if (fechaMala) fecha.setAttribute('aria-invalid', 'true'); else fecha.removeAttribute('aria-invalid');
    showToast(faltaEvento && fechaMala ? 'Falta elegir el tipo de evento y la fecha.' : faltaEvento ? 'Falta elegir el tipo de evento.' : 'Falta elegir la fecha del evento.');
    (faltaEvento ? form.querySelector('input[name="evento"]') : fecha)?.focus({ preventScroll: true });
    (faltaEvento ? grupoEvento : fecha)?.scrollIntoView({ block: 'center', behavior: reduceMotion ? 'auto' : 'smooth' });
  });
  pintar();
}

function initVisor() {
  const visor = document.getElementById('visor');
  const items = [...document.querySelectorAll('.galeria__item')];
  if (!visor || !items.length) return;
  const img = visor.querySelector('.visor__img');
  const cap = visor.querySelector('.visor__cap');
  const cont = visor.querySelector('.visor__cont');
  const cerrarBtn = visor.querySelector('.visor__cerrar');
  let actual = 0;
  let previo = null;

  const mostrar = n => {
    actual = (n + items.length) % items.length;
    const it = items[actual];
    img.width = Number(it.dataset.w) || 1254;
    img.height = Number(it.dataset.h) || 1254;
    img.src = it.dataset.full;
    img.alt = it.querySelector('img')?.alt || '';
    cap.textContent = it.dataset.cap || '';
    cont.textContent = `${actual + 1} / ${items.length}`;
  };
  const abrir = n => {
    previo = document.activeElement;
    mostrar(n);
    visor.hidden = false;
    document.body.classList.add('no-scroll');
    requestAnimationFrame(() => visor.classList.add('abierto'));
    cerrarBtn.focus();
  };
  const cerrar = () => {
    visor.classList.remove('abierto');
    visor.hidden = true;
    document.body.classList.remove('no-scroll');
    previo?.focus();
  };

  items.forEach((it, n) => it.addEventListener('click', () => abrir(n)));
  cerrarBtn.addEventListener('click', cerrar);
  visor.querySelector('.visor__nav--prev')?.addEventListener('click', () => mostrar(actual - 1));
  visor.querySelector('.visor__nav--next')?.addEventListener('click', () => mostrar(actual + 1));
  visor.addEventListener('click', e => { if (e.target === visor) cerrar(); });
  document.addEventListener('keydown', e => {
    if (visor.hidden) return;
    if (e.key === 'Escape') { e.preventDefault(); cerrar(); }
    else if (e.key === 'ArrowLeft') mostrar(actual - 1);
    else if (e.key === 'ArrowRight') mostrar(actual + 1);
    else if (e.key === 'Tab') {
      const focos = [...visor.querySelectorAll('button')].filter(b => b.offsetParent !== null);
      if (!focos.length) return;
      const primero = focos[0];
      const ultimo = focos[focos.length - 1];
      if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
      else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
      else if (!visor.contains(document.activeElement)) { e.preventDefault(); primero.focus(); }
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
      try { vp.setPointerCapture?.(pointerId); } catch { void 0; }
    }
    e.preventDefault();
    vp.scrollLeft = startScroll - dx;
  });
  const end = e => {
    if (!dragging || (e && pointerId !== null && e.pointerId !== pointerId)) return;
    dragging = false;
    if (moved) {
      try { vp.releasePointerCapture?.(pointerId); } catch { void 0; }
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
  const vp = document.querySelector('.galeria--rail .galeria__vp');
  if (!vp) return;
  initRailDrag(vp);
  const prev = document.querySelector('.rail-btn--prev');
  const next = document.querySelector('.rail-btn--next');
  if (!prev || !next) return;
  const sync = () => {
    prev.disabled = vp.scrollLeft <= 2;
    next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  const paso = () => Math.max(260, vp.clientWidth * 0.6);
  prev.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  next.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  vp.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync, { passive: true });
  sync();
}

function initStickers() {
  const tablero = document.querySelector('.tablero');
  if (!tablero) return;
  const stickers = [...tablero.querySelectorAll('.sticker')];
  let movido = false;
  let z = 10;
  const bajar = btn => {
    const a = document.createElement('a');
    a.href = btn.dataset.archivo;
    a.download = `tokyo-sticker-${btn.dataset.nombre}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    btn.classList.remove('bajando');
    void btn.offsetWidth;
    btn.classList.add('bajando');
    showToast('Sticker guardado. Ya lo podés mandar por WhatsApp.');
  };
  stickers.forEach(btn => btn.addEventListener('click', e => {
    if (movido) { movido = false; e.preventDefault(); return; }
    bajar(btn);
  }));
  const Arrastre = window.Draggable;
  if (typeof gsap === 'undefined' || !Arrastre) return;
  gsap.registerPlugin(Arrastre);
  const arrastres = Arrastre.create(stickers, {
    type: 'x,y',
    bounds: tablero,
    dragClickables: true,
    minimumMovement: 6,
    zIndexBoost: false,
    onPress() { movido = false; this.target.parentElement.style.zIndex = ++z; },
    onDragStart() { movido = true; }
  });
  const mq = window.matchMedia('(max-width: 640px)');
  mq.addEventListener('change', () => {
    gsap.set(stickers, { x: 0, y: 0 });
    arrastres.forEach(d => d.update());
  });
}

initNav();
initWspFloat();
initModelBarScroll();
initConsulta();
initVisor();
initRail();
initStickers();
initReveals();
initHeroMotion();
initParallax();
