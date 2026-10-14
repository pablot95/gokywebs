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
  const desktopMq = window.matchMedia('(min-width: 861px)');
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
  if (img) tl.from(img, { scale: 1.1, duration: 1.8 }, 0);
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.hero-badge'), { scale: 0.92, opacity: 0, duration: 1.1, stagger: 0.1, clearProps: 'transform,opacity' }, 0.75);
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  const foto = document.querySelector('.hero__foto');
  const img = foto?.querySelector('img');
  if (!foto || !img) return;
  gsap.to(img, {
    yPercent: -8, ease: 'none',
    scrollTrigger: { trigger: foto, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
  });
}

function initEstado() {
  const textos = document.querySelectorAll('[data-estado]');
  const filas = document.querySelectorAll('[data-dias]');
  if (!textos.length && !filas.length) return;
  const HORARIO = { 0: null, 1: [540, 1200], 2: [540, 1200], 3: [540, 1200], 4: [540, 1200], 5: [540, 1200], 6: [540, 1080] };
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
      const [a, b = a] = f.dataset.dias.split('-').map(Number);
      f.classList.toggle('es-hoy', t.dia >= a && t.dia <= b);
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
    copia.removeAttribute('aria-hidden');
    copia.setAttribute('role', 'img');
    copia.setAttribute('aria-label', item.dataset.flyerNombre || 'Flyer');
    slot.replaceChildren(copia);
    const link = item.querySelector('[data-flyer-cta]');
    if (link && cta) cta.setAttribute('href', link.getAttribute('href'));
    origen = desde.matches('button, a') ? desde : item.querySelector('button[data-flyer-abrir]');
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
  visor.addEventListener('close', limpiar);
}

function initRailDrag() {
  document.querySelectorAll('[data-rail]').forEach(vp => {
    let pointerId = null;
    let startX = 0;
    let startLeft = 0;
    let moved = false;
    let bloquearClick = false;
    vp.addEventListener('pointerdown', e => {
      if (e.pointerType !== 'mouse' || e.button !== 0 || vp.scrollWidth <= vp.clientWidth) return;
      pointerId = e.pointerId; startX = e.clientX; startLeft = vp.scrollLeft; moved = false;
    });
    vp.addEventListener('pointermove', e => {
      if (pointerId !== e.pointerId) return;
      const dx = e.clientX - startX;
      if (!moved && Math.abs(dx) < 6) return;
      if (!moved) {
        moved = true;
        vp.classList.add('dragging');
        try { vp.setPointerCapture?.(pointerId); } catch { /* sin captura igual arrastra */ }
      }
      vp.scrollLeft = startLeft - dx;
    });
    const fin = () => {
      if (pointerId === null) return;
      try { vp.releasePointerCapture?.(pointerId); } catch { /* ya liberado */ }
      if (moved) {
        bloquearClick = true;
        setTimeout(() => { bloquearClick = false; }, 0);
      }
      pointerId = null;
      vp.classList.remove('dragging');
    };
    vp.addEventListener('pointerup', fin);
    vp.addEventListener('pointercancel', fin);
    vp.addEventListener('click', e => { if (bloquearClick) { e.preventDefault(); e.stopPropagation(); } }, true);
  });
}

function initMapa() {
  const el = document.getElementById('mapa');
  if (!el || typeof L === 'undefined') return;
  const centro = [-34.6037, -58.3816];
  const mapa = L.map(el, { scrollWheelZoom: false, dragging: !L.Browser.mobile, zoomControl: true }).setView(centro, 13);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap', maxZoom: 19 }).addTo(mapa);
  L.circle(centro, { radius: 1400, color: '#8E3A84', weight: 1, fillColor: '#8E3A84', fillOpacity: 0.12 }).addTo(mapa);
  L.circleMarker(centro, { radius: 7, color: '#FFFFFF', weight: 2, fillColor: '#8E3A84', fillOpacity: 1 }).addTo(mapa);
}

function initLeeScroll() {
  const els = document.querySelectorAll('[data-lee]');
  if (!els.length) return;
  els.forEach(el => {
    const palabras = el.textContent.trim().split(/\s+/);
    if (palabras.length < 2) return;
    el.textContent = '';
    palabras.forEach((palabra, i) => {
      const s = document.createElement('span');
      s.className = 'lee-w';
      s.textContent = palabra;
      el.appendChild(s);
      if (i < palabras.length - 1) el.appendChild(document.createTextNode(' '));
    });
  });
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) {
    document.querySelectorAll('.lee-w').forEach(w => w.classList.add('on'));
    return;
  }
  els.forEach(el => {
    const ws = el.querySelectorAll('.lee-w');
    if (!ws.length) return;
    ScrollTrigger.create({
      trigger: el, start: 'top 82%', end: 'bottom 55%', scrub: 0.4, invalidateOnRefresh: true,
      onUpdate: self => {
        const hasta = self.progress * ws.length;
        ws.forEach((w, i) => w.classList.toggle('on', i < hasta));
      },
    });
  });
}

function initFaq() {
  document.querySelectorAll('.faq details').forEach(d => d.addEventListener('toggle', () => {
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  }));
}

initEstado();
initReveals();
initNav();
initWspFloat();
initModelBarScroll();
initHeroMotion();
initParallax();
initVisor();
initRailDrag();
initMapa();
initLeeScroll();
initFaq();
