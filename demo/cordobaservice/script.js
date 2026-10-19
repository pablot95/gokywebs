const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
let revealsListos = false;

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

const FOTOS = [
  { src: 'images/hero-aire.webp', w: 1672, h: 941, cap: 'Unidad exterior de aire acondicionado', alt: 'Técnico revisando las conexiones de la unidad exterior de un aire acondicionado' },
  { src: 'images/aire-split.webp', w: 1254, h: 1254, cap: 'Limpieza de filtros de un mini split', alt: 'Técnico limpiando el filtro de un aire acondicionado mini split en el taller' },
  { src: 'images/aire-industrial.webp', w: 1254, h: 1254, cap: 'Aires industriales', alt: 'Unidades condensadoras de aire acondicionado industrial en una terraza' },
  { src: 'images/heladera-familiar.webp', w: 1254, h: 1254, cap: 'Heladera familiar', alt: 'Técnico revisando el compresor en la parte trasera de una heladera familiar' },
  { src: 'images/heladera-comercial.webp', w: 1254, h: 1254, cap: 'Heladeras comerciales', alt: 'Técnico revisando una heladera comercial de acero inoxidable en una cocina' },
  { src: 'images/tecnico-lavarropas.webp', w: 941, h: 1672, cap: 'Lavarropas automático', alt: 'Técnico arrodillado revisando el tambor de un lavarropas automático' },
  { src: 'images/lavavajillas.webp', w: 1254, h: 1254, cap: 'Lavavajillas', alt: 'Técnico revisando la bandeja de un lavavajillas abierto' },
  { src: 'images/secarropas.webp', w: 1254, h: 1254, cap: 'Secadores de ropa', alt: 'Técnico reparando el motor de un secador de ropa sobre la mesa del taller' },
  { src: 'images/electricidad.webp', w: 1254, h: 1254, cap: 'Tablero eléctrico', alt: 'Técnico con guantes trabajando en las térmicas de un tablero eléctrico' }
];

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
  const desktopMq = window.matchMedia('(min-width: 1024px)');
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
    .from(hero.querySelectorAll('.hero-badge, .sello'), { scale: 0.92, opacity: 0, duration: 1.1, stagger: 0.1, clearProps: 'transform,opacity' }, 0.65);
}

function initParallax() {
  if (reduceMotion || typeof ScrollTrigger === 'undefined') return;
  const img = document.querySelector('.hero [data-hero-img]');
  const foto = img?.closest('.hero__foto');
  if (!img || !foto) return;
  ScrollTrigger.create({
    trigger: foto,
    start: 'top 80%',
    end: 'bottom top',
    onUpdate: self => { img.style.translate = `0 ${(-8 + self.progress * 8).toFixed(2)}%`; }
  });
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

function initVisor() {
  const visor = document.getElementById('visor');
  const triggers = document.querySelectorAll('[data-visor]');
  if (!visor || !triggers.length) return;
  const img = document.getElementById('visorImg');
  const cap = document.getElementById('visorCap');
  const num = document.getElementById('visorNum');
  const prev = document.getElementById('visorPrev');
  const next = document.getElementById('visorNext');
  const cerrar = document.getElementById('visorCerrar');
  let actual = 0;
  let origen = null;

  const mostrar = i => {
    actual = (i + FOTOS.length) % FOTOS.length;
    const f = FOTOS[actual];
    img.src = f.src;
    img.width = f.w;
    img.height = f.h;
    img.alt = f.alt;
    cap.textContent = f.cap;
    num.textContent = `${actual + 1} / ${FOTOS.length}`;
  };
  const abrir = (i, btn) => {
    origen = btn;
    mostrar(i);
    if (typeof visor.showModal === 'function') visor.showModal(); else visor.setAttribute('open', '');
    document.body.classList.add('no-scroll');
    cerrar.focus();
  };
  triggers.forEach(btn => btn.addEventListener('click', () => abrir(Number(btn.dataset.visor) || 0, btn)));
  prev.addEventListener('click', () => mostrar(actual - 1));
  next.addEventListener('click', () => mostrar(actual + 1));
  cerrar.addEventListener('click', () => visor.close());
  visor.addEventListener('click', e => { if (e.target === visor) visor.close(); });
  visor.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') mostrar(actual - 1);
    if (e.key === 'ArrowRight') mostrar(actual + 1);
  });
  visor.addEventListener('close', () => {
    document.body.classList.remove('no-scroll');
    origen?.focus();
  });
  let x0 = null;
  img.addEventListener('pointerdown', e => { x0 = e.clientX; });
  img.addEventListener('pointerup', e => {
    if (x0 === null) return;
    const dx = e.clientX - x0;
    x0 = null;
    if (Math.abs(dx) > 50) mostrar(actual + (dx < 0 ? 1 : -1));
  });
}

function initVideos() {
  const reels = [...document.querySelectorAll('.reel[data-video]')];
  if (!reels.length) return;
  const estado = new Map();
  const dur = s => {
    if (!isFinite(s) || s <= 0) return 'Video';
    return `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`;
  };
  const probar = li => {
    const label = li.querySelector('[data-video-estado]');
    const v = document.createElement('video');
    v.preload = 'metadata';
    v.muted = true;
    v.addEventListener('loadedmetadata', () => {
      estado.set(li, true);
      li.classList.add('is-listo');
      if (label) label.textContent = dur(v.duration);
    }, { once: true });
    v.addEventListener('error', () => {
      estado.set(li, false);
      li.classList.add('is-pendiente');
    }, { once: true });
    v.src = li.dataset.video;
  };
  if (document.readyState === 'complete') reels.forEach(probar);
  else window.addEventListener('load', () => reels.forEach(probar), { once: true });

  reels.forEach(li => {
    const btn = li.querySelector('.reel__btn');
    btn?.addEventListener('click', () => {
      if (estado.get(li) !== true) {
        showToast('Este video se suma muy pronto. Mientras, mirá los trabajos en Instagram.');
        return;
      }
      if (li.querySelector('video')) return;
      const v = document.createElement('video');
      v.src = li.dataset.video;
      v.controls = true;
      v.playsInline = true;
      v.autoplay = true;
      v.setAttribute('aria-label', li.querySelector('.reel__titulo')?.textContent || 'Video');
      li.appendChild(v);
      v.play().catch(() => {});
    });
  });
}

function initMapa() {
  const el = document.getElementById('mapa');
  if (!el || typeof L === 'undefined') return;
  const centro = [-31.4167, -64.1833];
  const mapa = L.map(el, { center: centro, zoom: 13, scrollWheelZoom: false, dragging: !L.Browser.mobile, tap: false });
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap', maxZoom: 19 }).addTo(mapa);
  const icono = L.divIcon({ className: 'mapa-marker', html: '<span class="mapa-pin"></span>', iconSize: [38, 38], iconAnchor: [19, 44] });
  L.marker(centro, { icon: icono, keyboard: false, title: 'Córdoba service · dirección a confirmar' }).addTo(mapa);
  window.addEventListener('load', () => mapa.invalidateSize());
  if ('ResizeObserver' in window) new ResizeObserver(() => mapa.invalidateSize()).observe(el);
}

function initForm() {
  const form = document.getElementById('formContacto');
  if (!form) return;
  const campos = [
    { el: form.querySelector('#fNombre'), ok: v => v.trim().length >= 2 },
    { el: form.querySelector('#fTel'), ok: v => v.replace(/\D/g, '').length >= 8 },
    { el: form.querySelector('#fEquipo'), ok: v => v !== '' }
  ].filter(c => c.el);
  const marcar = (c, valido) => {
    c.el.setAttribute('aria-invalid', valido ? 'false' : 'true');
    const err = document.getElementById(`${c.el.id}-error`);
    if (err) err.hidden = valido;
  };
  campos.forEach(c => {
    const ev = c.el.tagName === 'SELECT' ? 'change' : 'input';
    c.el.addEventListener(ev, () => { if (c.el.getAttribute('aria-invalid') === 'true') marcar(c, c.ok(c.el.value)); });
    c.el.addEventListener('blur', () => { if (c.el.value) marcar(c, c.ok(c.el.value)); });
  });
  form.addEventListener('submit', e => {
    e.preventDefault();
    let primero = null;
    campos.forEach(c => {
      const valido = c.ok(c.el.value);
      marcar(c, valido);
      if (!valido && !primero) primero = c.el;
    });
    if (primero) { primero.focus(); return; }
    const btn = form.querySelector('button[type="submit"]');
    const texto = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Enviando…';
    setTimeout(() => {
      showToast('¡Gracias! El envío de mensajes se activa al pasar la web a producción.');
      form.reset();
      campos.forEach(c => c.el.removeAttribute('aria-invalid'));
      btn.disabled = false;
      btn.textContent = texto;
    }, 800);
  });
}

function initFaq() {
  document.querySelectorAll('.faq details').forEach(d => d.addEventListener('toggle', () => {
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  }));
}

[initHeroMotion, initReveals, initNav, initWspFloat, initModelBarScroll, initParallax, initVisor, initVideos, initMapa, initForm, initFaq].forEach(fn => {
  try { fn(); } catch (e) { console.error(e); }
});
