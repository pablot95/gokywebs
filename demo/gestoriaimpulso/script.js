const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

function refrescarScroll() {
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
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

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) {
    bd = document.createElement('div');
    bd.className = 'nav-backdrop';
    (document.querySelector('.site-header') || document.body).appendChild(bd);
  }
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

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const img = hero.querySelector('[data-hero-img]');
  if (img) tl.from(img, { scale: 1.08, duration: 1.8 }, 0);
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 32, opacity: 0, filter: 'blur(8px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 24, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 20, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.sello, .hero-badge'), { scale: 0.94, opacity: 0, duration: 1.1, stagger: 0.12, clearProps: 'transform,opacity' }, 0.7);
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  const media = document.querySelector('.hero__media');
  const img = media?.querySelector('img');
  if (!media || !img) return;
  gsap.to(img, {
    yPercent: 5, ease: 'none',
    scrollTrigger: { trigger: media, start: 'top top', end: 'bottom top', scrub: 0.6 },
  });
}

function initEstado() {
  const textos = document.querySelectorAll('[data-estado]');
  const filas = document.querySelectorAll('[data-dias]');
  if (!textos.length && !filas.length) return;
  const HORARIO = { 0: null, 1: [600, 1080], 2: [600, 1080], 3: [600, 1080], 4: [600, 1080], 5: [600, 1080], 6: null };
  const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  const hora = m => `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`;
  const ahora = () => {
    const partes = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Argentina/Buenos_Aires', weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23',
    }).formatToParts(new Date());
    const valor = t => partes.find(p => p.type === t)?.value || '';
    const dia = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(valor('weekday'));
    return { dia, min: (Number(valor('hour')) % 24) * 60 + Number(valor('minute')) };
  };
  const calcular = ({ dia, min }) => {
    const h = HORARIO[dia];
    if (h && min >= h[0] && min < h[1]) return { abierto: true, texto: `Abierto ahora · hasta las ${hora(h[1])}` };
    if (h && min < h[0]) return { abierto: false, texto: `Cerrado · abre hoy a las ${hora(h[0])}` };
    for (let i = 1; i <= 7; i++) {
      const d = (dia + i) % 7;
      if (HORARIO[d]) return { abierto: false, texto: `Cerrado · abre ${i === 1 ? 'mañana' : `el ${DIAS[d]}`} a las ${hora(HORARIO[d][0])}` };
    }
    return null;
  };
  const pintar = () => {
    const t = ahora();
    if (t.dia < 0) return;
    const r = calcular(t);
    if (r) textos.forEach(el => {
      el.textContent = r.texto;
      el.classList.toggle('is-abierto', r.abierto);
      el.classList.toggle('is-cerrado', !r.abierto);
    });
    filas.forEach(f => {
      const dias = f.dataset.dias.split(',').map(Number);
      f.classList.toggle('es-hoy', dias.includes(t.dia));
    });
  };
  pintar();
  window.setInterval(pintar, 60000);
}

function initVisor() {
  const visor = document.getElementById('visor');
  const items = document.querySelectorAll('[data-flyer-item]');
  if (!visor || !items.length || typeof visor.showModal !== 'function') return;
  const slot = visor.querySelector('.visor__flyer');
  const cta = visor.querySelector('.visor__cta');
  const cerrar = visor.querySelector('.visor__cerrar');
  let origen = null;
  const abrir = (item, desde) => {
    const flyer = item.querySelector('.flyer');
    if (!flyer || !slot) return;
    const copia = flyer.cloneNode(true);
    if (copia.tagName !== 'IMG') {
      copia.removeAttribute('aria-hidden');
      copia.setAttribute('role', 'img');
      copia.setAttribute('aria-label', item.dataset.flyerNombre || 'Flyer');
    }
    slot.replaceChildren(copia);
    const link = item.querySelector('[data-flyer-cta]');
    if (link && cta) cta.setAttribute('href', link.getAttribute('href'));
    origen = desde;
    visor.showModal();
    document.body.classList.add('no-scroll');
    cerrar?.focus();
  };
  items.forEach(item => {
    item.querySelectorAll('[data-flyer-abrir]').forEach(el => el.addEventListener('click', () => abrir(item, el)));
  });
  const limpiar = () => {
    document.body.classList.remove('no-scroll');
    origen?.focus();
    origen = null;
  };
  const cerrarVisor = () => {
    if (visor.open) visor.close();
    limpiar();
  };
  cerrar?.addEventListener('click', cerrarVisor);
  visor.addEventListener('click', e => { if (e.target === visor) cerrarVisor(); });
  visor.addEventListener('cancel', e => { e.preventDefault(); cerrarVisor(); });
  visor.addEventListener('close', () => { if (document.body.classList.contains('no-scroll')) limpiar(); });
}

function initTabs() {
  const tabs = document.querySelector('[data-tabs]');
  if (!tabs) return;
  const botones = [...tabs.querySelectorAll('[role="tab"]')];
  if (!botones.length) return;
  const activar = (btn, enfocar) => {
    botones.forEach(b => {
      const activo = b === btn;
      b.setAttribute('aria-selected', String(activo));
      b.tabIndex = activo ? 0 : -1;
      const panel = document.getElementById(b.getAttribute('aria-controls'));
      if (!panel) return;
      panel.hidden = !activo;
      panel.classList.remove('entrando');
      if (activo && !reduceMotion) {
        void panel.offsetWidth;
        panel.classList.add('entrando');
      }
    });
    if (enfocar) btn.focus();
    refrescarScroll();
  };
  botones.forEach((btn, i) => {
    btn.addEventListener('click', () => activar(btn, false));
    btn.addEventListener('keydown', e => {
      let j = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') j = (i + 1) % botones.length;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') j = (i - 1 + botones.length) % botones.length;
      if (e.key === 'Home') j = 0;
      if (e.key === 'End') j = botones.length - 1;
      if (j === null) return;
      e.preventDefault();
      activar(botones[j], true);
    });
  });
}

function initMapa() {
  const el = document.getElementById('mapa');
  if (!el || typeof L === 'undefined') return;
  const ZONAS = [
    { nombre: 'Flores', pos: [-34.6287, -58.4636] },
    { nombre: 'Paternal', pos: [-34.5985, -58.4688] },
    { nombre: 'Palermo', pos: [-34.5812, -58.4255] },
  ];
  try {
    const mapa = L.map(el, { scrollWheelZoom: false, dragging: !L.Browser.mobile, zoomControl: true }).setView([-34.6025, -58.4500], 13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap', maxZoom: 19 }).addTo(mapa);
    ZONAS.forEach(z => {
      L.circle(z.pos, { radius: 700, color: '#1E3A5F', weight: 1, fillColor: '#2A9D8F', fillOpacity: 0.16 }).addTo(mapa);
      L.circleMarker(z.pos, { radius: 7, color: '#FFFFFF', weight: 2, fillColor: '#1E3A5F', fillOpacity: 1 })
        .bindTooltip(z.nombre, { permanent: true, direction: 'top', offset: [0, -8], className: 'zona-tip' })
        .addTo(mapa);
    });
    const ajustar = () => {
      const p = el.clientWidth < 520 ? 22 : 48;
      mapa.fitBounds(L.latLngBounds(ZONAS.map(z => z.pos)), { padding: [p, p], maxZoom: 14 });
    };
    ajustar();
    let ancho = el.clientWidth;
    window.addEventListener('resize', () => {
      if (el.clientWidth === ancho) return;
      ancho = el.clientWidth;
      mapa.invalidateSize();
      ajustar();
    }, { passive: true });
  } catch {
    el.classList.add('mapa--sin');
  }
}

function initFaq() {
  document.querySelectorAll('.faq details').forEach(d => d.addEventListener('toggle', refrescarScroll));
}

initEstado();
initReveals();
initNav();
initWspFloat();
initModelBarScroll();
initHeroMotion();
initParallax();
initVisor();
initTabs();
initMapa();
initFaq();
