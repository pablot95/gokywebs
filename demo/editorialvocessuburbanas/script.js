const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const WSP = '5491125570870';
const waLink = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const PORTADAS_LISTAS = [];

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

const refrescar = () => { if (typeof ScrollTrigger !== 'undefined') requestAnimationFrame(() => ScrollTrigger.refresh()); };

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
  const nuevos = [...cont.querySelectorAll('[data-animate]:not(.in)')].filter(el => el.getClientRects().length);
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
    .from(hero.querySelectorAll('.hero-dato'), { y: 16, opacity: 0, duration: 0.9, clearProps: 'transform,opacity' }, 0.75)
    .from(hero.querySelectorAll('.sello--hero'), { scale: 0.92, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.65);
}

function initPortadas() {
  PORTADAS_LISTAS.forEach(n => {
    const tapa = document.querySelector(`.tapa[data-libro="${n}"]`);
    if (!tapa?.dataset.portada) return;
    tapa.classList.add('tapa--foto');
    tapa.innerHTML = `<img src="${esc(tapa.dataset.portada)}" width="800" height="1200" alt="Tapa del libro Nº ${String(n).padStart(2, '0')}">`;
  });
}

function initGaleria() {
  const gal = document.querySelector('.galeria');
  const btn = document.getElementById('verTodos');
  if (!gal || !btn) return;
  btn.addEventListener('click', () => {
    gal.classList.add('abierta');
    btn.setAttribute('aria-expanded', 'true');
    revelarNuevos(gal.querySelector('.libros'));
    refrescar();
    gal.querySelector('.libro--extra .tapa')?.focus({ preventScroll: true });
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
      try { vp.setPointerCapture?.(pointerId); } catch { /* sin capture el arrastre igual funciona */ }
    }
    e.preventDefault();
    vp.scrollLeft = startScroll - dx;
  });
  const end = e => {
    if (!dragging || (e && pointerId !== null && e.pointerId !== pointerId)) return;
    dragging = false;
    if (moved) {
      try { vp.releasePointerCapture?.(pointerId); } catch { /* ya liberado */ }
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
  if (!document.body.classList.contains('m2')) return;
  const vp = document.querySelector('.galeria__vp');
  const track = vp?.querySelector('.libros');
  const prev = document.querySelector('[data-rail="prev"]');
  const next = document.querySelector('[data-rail="next"]');
  if (!vp || !track) return;
  initRailDrag(vp);
  const paso = () => {
    const card = track.querySelector('.libro');
    const gap = parseFloat(getComputedStyle(track).columnGap) || 24;
    return card ? (card.getBoundingClientRect().width + gap) * 3 : 480;
  };
  const sync = () => {
    if (prev) prev.disabled = vp.scrollLeft <= 2;
    if (next) next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  vp.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync, { passive: true });
  sync();
}

function initVisor() {
  const visor = document.getElementById('visor');
  const tapas = [...document.querySelectorAll('.tapa[data-libro]')];
  if (!visor || !tapas.length) return;
  const panel = visor.querySelector('.visor__panel');
  const caja = document.getElementById('visorTapa');
  const titulo = document.getElementById('visorTitulo');
  const numero = document.getElementById('visorNumero');
  const wsp = document.getElementById('visorWsp');
  const total = tapas.length;
  let actual = 0;
  let origen = null;
  const pintar = i => {
    actual = (i + total) % total;
    const t = tapas[actual];
    const n = String(actual + 1).padStart(2, '0');
    caja.innerHTML = `<div class="${esc(t.className)}" aria-hidden="true">${t.innerHTML}</div>`;
    titulo.textContent = `Libro Nº ${n}`;
    numero.textContent = `${n} de ${total}`;
    wsp.href = waLink(`Hola, Editorial Voces Suburbanas. Quiero consultar por el libro Nº ${n} de la galería.`);
    if (wsp.firstChild?.nodeType === Node.TEXT_NODE) wsp.firstChild.nodeValue = `Consultar por el Nº ${n} `;
  };
  const abrir = (i, el) => {
    origen = el;
    pintar(i);
    visor.hidden = false;
    document.body.classList.add('no-scroll');
    visor.querySelector('.visor__cerrar')?.focus();
  };
  const cerrar = () => {
    visor.hidden = true;
    document.body.classList.remove('no-scroll');
    origen?.focus({ preventScroll: true });
  };
  tapas.forEach((t, i) => t.addEventListener('click', () => abrir(i, t)));
  visor.querySelectorAll('[data-cerrar]').forEach(b => b.addEventListener('click', cerrar));
  document.getElementById('visorPrev')?.addEventListener('click', () => pintar(actual - 1));
  document.getElementById('visorNext')?.addEventListener('click', () => pintar(actual + 1));
  visor.addEventListener('keydown', e => {
    if (e.key === 'Escape') { e.preventDefault(); cerrar(); return; }
    if (e.key === 'ArrowLeft') pintar(actual - 1);
    if (e.key === 'ArrowRight') pintar(actual + 1);
    if (e.key === 'Tab') {
      const foco = [...panel.querySelectorAll('a[href], button:not([disabled])')].filter(el => el.getClientRects().length);
      if (!foco.length) return;
      const primero = foco[0];
      const ultimo = foco[foco.length - 1];
      if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
      else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
    }
  });
}

const GENEROS = {
  'Novela': 'una novela',
  'Cuentos': 'cuentos',
  'Poesía': 'poesía',
  'Ensayo': 'un ensayo',
  'Crónica': 'una crónica',
  'Infantil o juvenil': 'un libro infantil o juvenil',
  'Otro': 'un libro',
};

const unir = arr => arr.length < 2 ? arr.join('') : `${arr.slice(0, -1).join(', ')} y ${arr[arr.length - 1]}`;

function initConsulta() {
  const form = document.getElementById('consulta');
  if (!form) return;
  const nombre = form.querySelector('#c-nombre');
  const genero = form.querySelector('#c-genero');
  const error = form.querySelector('#c-nombre-error');
  const salida = form.querySelector('#c-mensaje');
  const boton = form.querySelector('.consulta__enviar');
  const armar = () => {
    const n = nombre.value.trim();
    const etapa = form.querySelector('input[name="etapa"]:checked')?.value || 'terminado';
    const necesita = [...form.querySelectorAll('input[data-f="necesita"]:checked')].map(i => `la ${i.value}`);
    const pedido = necesita.length ? `Me interesa ${unir(necesita)}.` : 'Quiero saber cómo empezar.';
    return `Hola, Editorial Voces Suburbanas. ${n ? `Soy ${n}. ` : ''}Estoy escribiendo ${GENEROS[genero.value] || 'un libro'} y el texto está ${etapa}. ${pedido}`;
  };
  const pintar = () => { salida.textContent = armar(); };
  form.addEventListener('input', () => {
    if (nombre.value.trim()) { nombre.removeAttribute('aria-invalid'); error.hidden = true; }
    pintar();
  });
  form.addEventListener('change', pintar);
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!nombre.value.trim()) {
      nombre.setAttribute('aria-invalid', 'true');
      error.hidden = false;
      nombre.focus();
      showToast('Falta tu nombre para armar el mensaje.');
      return;
    }
    window.open(waLink(armar()), '_blank', 'noopener');
    boton.disabled = true;
    showToast('Listo: te abrimos WhatsApp con tu consulta.');
    setTimeout(() => { boton.disabled = false; }, 800);
  });
  pintar();
}

function initDudas() {
  document.querySelectorAll('.duda').forEach(d => d.addEventListener('toggle', refrescar));
}

initPortadas();
initGaleria();
initReveals();
initNav();
initModelBarScroll();
initWspFloat();
initHeroMotion();
initRail();
initVisor();
initConsulta();
initDudas();
