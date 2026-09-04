const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5492995856249';
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}
if (typeof gsap === 'undefined') {
  document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; el.style.clipPath = 'none'; });
}
if (typeof ScrollTrigger !== 'undefined') {
  window.addEventListener('load', () => ScrollTrigger.refresh());
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

function initReveals() {
  const items = document.querySelectorAll('[data-animate]');
  if (!items.length) return;
  document.querySelectorAll('[data-animate-stagger]').forEach(parent => {
    parent.querySelectorAll('[data-animate]').forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i * 0.12, 0.72)}s`;
    });
  });
  if (!('IntersectionObserver' in window) || reduceMotion) {
    items.forEach(el => el.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); }
    });
  }, { threshold: 0, rootMargin: '0px 0px -7% 0px' });
  items.forEach(el => io.observe(el));

  let queued = false;
  const sweep = () => {
    queued = false;
    let pending = 0;
    items.forEach(el => {
      if (el.classList.contains('in')) return;
      const r = el.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight) { el.classList.add('in'); io.unobserve(el); }
      else pending++;
    });
    if (!pending) {
      window.removeEventListener('scroll', queueSweep);
      window.removeEventListener('resize', queueSweep);
    }
  };
  const queueSweep = () => { if (!queued) { queued = true; requestAnimationFrame(sweep); } };
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
    const header = document.querySelector('.site-header');
    (header || document.body).appendChild(bd);
  }
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

function initWspFloat() {
  const btn = document.getElementById('wsp-float');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) btn.classList.add('visible'); else btn.classList.remove('visible');
  }, { passive: true });
}

function initHero() {
  const media = document.querySelector('.hero-media img');
  if (!media || typeof gsap === 'undefined') return;
  if (!reduceMotion) {
    gsap.fromTo(media, { scale: 1.1 }, { scale: 1, duration: 1.5, ease: 'power3.out' });
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.to(media, {
        yPercent: 6, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .6 },
      });
    }
  }
}

function initCounters() {
  const nums = document.querySelectorAll('[data-count]');
  if (!nums.length) return;
  const paint = (el, v) => { el.textContent = String(Math.round(v)); };
  if (reduceMotion || !('IntersectionObserver' in window)) {
    nums.forEach(el => paint(el, Number(el.dataset.count) || 0));
    return;
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      io.unobserve(el);
      const target = Number(el.dataset.count) || 0;
      const t0 = window.performance.now();
      const dur = 1100;
      const step = now => {
        const p = Math.min(1, (now - t0) / dur);
        paint(el, target * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }, { threshold: .4 });
  nums.forEach(el => io.observe(el));
}

function initServicios() {
  const stage = document.getElementById('serviciosStage');
  if (!stage) return;
  const pasos = [...stage.querySelectorAll('.paso')];
  const shots = [...stage.querySelectorAll('.sv-shot')];
  const tagEl = document.getElementById('serviciosTag');
  if (!pasos.length || !shots.length) return;

  let actual = -1;
  const setStep = i => {
    const n = Math.max(0, Math.min(pasos.length - 1, i));
    if (n === actual) return;
    actual = n;
    pasos.forEach((p, k) => p.classList.toggle('is-on', k === n));
    shots.forEach((s, k) => s.classList.toggle('is-on', k === n));
    if (tagEl) tagEl.textContent = pasos[n]?.dataset.tag || '';
  };
  setStep(0);

  const porCercania = () => {
    const mid = window.innerHeight * 0.5;
    let best = 0, bd = Infinity;
    pasos.forEach((p, i) => {
      const r = p.getBoundingClientRect();
      const d = Math.abs((r.top + r.bottom) / 2 - mid);
      if (d < bd) { bd = d; best = i; }
    });
    setStep(best);
  };
  let raf = false;
  const onScroll = () => {
    if (raf) return;
    raf = true;
    requestAnimationFrame(() => {
      raf = false;
      if (!stage.classList.contains('is-sticky-mobile')) porCercania();
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  onScroll();

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) return;
  const mm = gsap.matchMedia();
  mm.add('(max-width: 1080px)', () => {
    stage.classList.add('is-sticky-mobile');
    const st = ScrollTrigger.create({
      trigger: stage, start: 'top top', end: 'bottom bottom', scrub: .5, invalidateOnRefresh: true,
      onUpdate: self => setStep(Math.floor(self.progress * pasos.length * 0.999)),
    });
    requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => {
      st.kill();
      stage.classList.remove('is-sticky-mobile');
      requestAnimationFrame(() => { ScrollTrigger.refresh(); onScroll(); });
    };
  });
}

const TAB_DESTINOS = [
  { id: 'planta', label: 'Planta o industria' },
  { id: 'comercio', label: 'Comercio o edificio' },
  { id: 'obra', label: 'Casa u obra nueva' },
];

const TAB_NECESIDADES = {
  planta: [
    { id: 'tablero', label: 'Tablero nuevo' },
    { id: 'clima', label: 'Calderas y climatización' },
    { id: 'ampliacion', label: 'Ampliar la instalación' },
  ],
  comercio: [
    { id: 'tablero', label: 'Tablero y medición' },
    { id: 'portero', label: 'Portero o videoportero' },
    { id: 'clima', label: 'Aire acondicionado' },
  ],
  obra: [
    { id: 'desdecero', label: 'Electricidad desde cero' },
    { id: 'platea', label: 'Platea y construcción' },
    { id: 'riego', label: 'Riego por aspersión' },
  ],
};

const TAB_RESULTADOS = {
  'planta|tablero': {
    titulo: 'Armado de tablero eléctrico industrial',
    motivo: 'Elegido por: planta o industria + tablero nuevo.',
    puntos: [
      'Protecciones y seccionamiento según el consumo real medido',
      'Montaje, conexionado y puesta en marcha en tu planta',
      'Bornera y frente rotulados circuito por circuito',
    ],
  },
  'planta|clima': {
    titulo: 'Climatización de calderas y equipos de planta',
    motivo: 'Elegido por: planta o industria + calderas y climatización.',
    puntos: [
      'Instalación y service de calderas',
      'Equipos de aire con su alimentación eléctrica propia',
      'Comando y protección resueltos desde el tablero',
    ],
  },
  'planta|ampliacion': {
    titulo: 'Ampliación y puesta a punto de la instalación',
    motivo: 'Elegido por: planta o industria + ampliar lo que ya está.',
    puntos: [
      'Relevamiento de qué hay instalado y cuánto aguanta',
      'Cañería, cableado y bocas nuevas sin frenar la producción',
      'Rotulado del tablero existente, que casi nunca lo tiene',
    ],
  },
  'comercio|tablero': {
    titulo: 'Tablero seccional y medición para tu comercio',
    motivo: 'Elegido por: comercio o edificio + tablero y medición.',
    puntos: [
      'Tablero con lugar libre para lo que venga después',
      'Circuitos separados por sector del local',
      'Rotulado para que cualquiera encuentre la llave a la primera',
    ],
  },
  'comercio|portero': {
    titulo: 'Portero o videoportero HIKVISION y Comax',
    motivo: 'Elegido por: comercio o edificio + control de acceso.',
    puntos: [
      'Venta del equipo y colocación en un solo pedido',
      'Cableado nuevo, o el existente si está en condiciones',
      'Configuración y prueba con el encargado antes de irnos',
    ],
  },
  'comercio|clima': {
    titulo: 'Aire acondicionado para el local',
    motivo: 'Elegido por: comercio o edificio + climatización.',
    puntos: [
      'Cálculo del equipo según metros y exposición al sol',
      'Instalación completa: soportes, cañería y carga',
      'Circuito propio y protección en el tablero',
    ],
  },
  'obra|desdecero': {
    titulo: 'Instalación eléctrica de obra, de cero a final',
    motivo: 'Elegido por: casa u obra nueva + electricidad desde cero.',
    puntos: [
      'Cañería y cajas antes del revoque, con los recorridos marcados',
      'Cableado, tablero y bocas',
      'Colocación de llaves, tomas y artefactos',
    ],
  },
  'obra|platea': {
    titulo: 'Platea de hormigón y construcción de la vivienda',
    motivo: 'Elegido por: casa u obra nueva + construcción.',
    puntos: [
      'Platea con su armadura, encofrado y colado',
      'Construcción hasta la terminación',
      'La instalación eléctrica sale de la misma empresa',
    ],
  },
  'obra|riego': {
    titulo: 'Riego por aspersión automatizado',
    motivo: 'Elegido por: casa u obra nueva + riego automático.',
    puntos: [
      'Trazado de sectores y ubicación de aspersores',
      'Programador y electroválvulas instalados',
      'Alimentación eléctrica protegida desde el tablero',
    ],
  },
};

function initTablero() {
  const contDest = document.getElementById('tabDestinos');
  const contNec = document.getElementById('tabNecesidades');
  const salida = document.getElementById('tabSalida');
  const elMotivo = document.getElementById('tabMotivo');
  const elTitulo = document.getElementById('tabTitulo');
  const elLista = document.getElementById('tabLista');
  const cta = document.getElementById('tabCta');
  if (!contDest || !contNec || !salida || !cta) return;

  let destino = 'planta';
  let necesidad = 'tablero';

  const chip = (item, activo) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'llave';
    b.dataset.opt = item.id;
    b.setAttribute('aria-pressed', activo ? 'true' : 'false');
    b.textContent = item.label;
    return b;
  };

  const pintarDestinos = () => {
    contDest.textContent = '';
    TAB_DESTINOS.forEach(d => {
      const b = chip(d, d.id === destino);
      b.addEventListener('click', () => {
        if (destino === d.id) return;
        destino = d.id;
        const lista = TAB_NECESIDADES[destino] || [];
        if (!lista.some(n => n.id === necesidad)) necesidad = lista[0]?.id || '';
        pintarDestinos();
        pintarNecesidades();
        pintarSalida();
      });
      contDest.appendChild(b);
    });
  };

  const pintarNecesidades = () => {
    contNec.textContent = '';
    (TAB_NECESIDADES[destino] || []).forEach(n => {
      const b = chip(n, n.id === necesidad);
      b.addEventListener('click', () => {
        if (necesidad === n.id) return;
        necesidad = n.id;
        pintarNecesidades();
        pintarSalida();
      });
      contNec.appendChild(b);
    });
  };

  const pintarSalida = () => {
    const r = TAB_RESULTADOS[`${destino}|${necesidad}`];
    if (!r) return;
    const aplicar = () => {
      elMotivo.textContent = r.motivo;
      elTitulo.textContent = r.titulo;
      elLista.textContent = '';
      r.puntos.forEach(p => {
        const li = document.createElement('li');
        li.textContent = p;
        elLista.appendChild(li);
      });
      const dest = TAB_DESTINOS.find(d => d.id === destino)?.label || '';
      const msg = `Hola SEI, entré a la web. El trabajo es en ${dest.toLowerCase()} y necesito: ${r.titulo}. ¿Me pasan un presupuesto?`;
      cta.href = `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
    };
    if (reduceMotion) { aplicar(); return; }
    salida.classList.add('is-swap');
    setTimeout(() => { aplicar(); salida.classList.remove('is-swap'); }, 210);
  };

  pintarDestinos();
  pintarNecesidades();
  pintarSalida();
}

function initRail() {
  const vp = document.getElementById('railVp');
  const track = document.getElementById('railTrack');
  const prev = document.getElementById('railPrev');
  const next = document.getElementById('railNext');
  if (!vp || !track) return;

  const paso = () => {
    const card = track.querySelector('.etapa');
    if (!card) return vp.clientWidth * .8;
    const gap = parseFloat(window.getComputedStyle(track).columnGap) || 16;
    return card.getBoundingClientRect().width + gap;
  };
  const sync = () => {
    const inicio = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
    if (prev) prev.disabled = vp.scrollLeft <= inicio + 2;
    if (next) next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  vp.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync, { passive: true });
  sync();

  let down = false, moved = false, startX = 0, startScroll = 0, pointerId = null;
  const start = e => {
    if (e.pointerType === 'touch') return;
    down = true; moved = false;
    startX = e.clientX; startScroll = vp.scrollLeft; pointerId = e.pointerId;
  };
  const move = e => {
    if (!down) return;
    const dx = e.clientX - startX;
    if (!moved && Math.abs(dx) < 6) return;
    if (!moved) {
      moved = true;
      vp.classList.add('dragging');
      try { vp.setPointerCapture?.(pointerId); } catch { /* sin capture el drag igual funciona */ }
    }
    vp.scrollLeft = startScroll - dx;
  };
  const end = () => {
    if (!down) return;
    down = false;
    if (moved) {
      try { vp.releasePointerCapture?.(pointerId); } catch { /* ya liberado */ }
      setTimeout(() => vp.classList.remove('dragging'), 0);
    }
    pointerId = null;
    sync();
  };
  vp.addEventListener('pointerdown', start);
  vp.addEventListener('pointermove', move);
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
  vp.addEventListener('pointerleave', end);
  vp.addEventListener('click', e => { if (moved) { e.preventDefault(); e.stopPropagation(); } }, true);
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
      trigger: el, start: 'top 82%', end: 'bottom 55%', scrub: .4, invalidateOnRefresh: true,
      onUpdate: self => {
        const hasta = self.progress * ws.length;
        ws.forEach((w, i) => w.classList.toggle('on', i < hasta));
      },
    });
  });
}

function initForm() {
  const form = document.getElementById('contactoForm');
  if (!form) return;
  const btn = document.getElementById('formSubmit');
  const campos = [
    { input: 'f-nombre', error: 'e-nombre', msg: 'Decinos cómo te llamás.', test: v => v.trim().length >= 2 },
    { input: 'f-tel', error: 'e-tel', msg: 'Dejanos un teléfono con al menos 8 números.', test: v => (v.replace(/\D/g, '').length >= 8) },
    { input: 'f-mensaje', error: 'e-mensaje', msg: 'Contanos aunque sea en una línea qué necesitás.', test: v => v.trim().length >= 8 },
  ];

  const validar = c => {
    const input = document.getElementById(c.input);
    const error = document.getElementById(c.error);
    if (!input) return true;
    const ok = c.test(input.value);
    input.closest('.field')?.classList.toggle('has-error', !ok);
    input.setAttribute('aria-invalid', ok ? 'false' : 'true');
    if (error) error.textContent = ok ? '' : c.msg;
    return ok;
  };

  campos.forEach(c => {
    document.getElementById(c.input)?.addEventListener('blur', () => validar(c));
    document.getElementById(c.input)?.addEventListener('input', () => {
      const f = document.getElementById(c.input)?.closest('.field');
      if (f?.classList.contains('has-error')) validar(c);
    });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const todosOk = campos.map(validar).every(Boolean);
    if (!todosOk) {
      form.querySelector('.field.has-error input, .field.has-error textarea')?.focus();
      return;
    }
    const original = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Enviando…';
    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = original;
      form.reset();
      showToast('¡Gracias! El envío de mensajes se activa al pasar la web a producción.');
    }, 800);
  });
}

function initMapa() {
  const cont = document.getElementById('mapa');
  if (!cont || typeof L === 'undefined') return;
  const mapa = L.map(cont, { scrollWheelZoom: false, attributionControl: true }).setView([-38.9516, -68.0591], 12);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; OpenStreetMap',
  }).addTo(mapa);
  L.circleMarker([-38.9516, -68.0591], {
    radius: 9, color: '#16A34A', weight: 2, fillColor: '#16A34A', fillOpacity: .35,
  }).addTo(mapa).bindPopup('SEI — Neuquén y Alto Valle');
}

const GKY_SLUG_ACENTOS = { 'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u', 'ñ': 'n', 'ü': 'u' };
function gkySlugify(s) {
  return String(s || '').toLowerCase()
    .replace(/[áéíóúñü]/g, c => GKY_SLUG_ACENTOS[c] || c)
    .replace(/[^a-z0-9]/g, '');
}

function initFeedbackFloat() {
  const GKY_FEEDBACK_WHATSAPP = '5491125068578';
  const btn = document.getElementById('feedback-float');
  const backdrop = document.getElementById('feedback-modal-backdrop');
  const closeBtn = document.getElementById('feedback-modal-close');
  const starsWrap = document.getElementById('feedback-stars');
  const coloresEl = document.getElementById('feedback-colores');
  const contenidoEl = document.getElementById('feedback-contenido');
  const otrosEl = document.getElementById('feedback-otros');
  const submitBtn = document.getElementById('feedback-submit');
  if (!btn || !backdrop) return;

  const stars = [...starsWrap.querySelectorAll('.feedback-star')];
  let rating = 0;
  const paintStars = (n) => stars.forEach((s, i) => {
    s.classList.toggle('active', i < n);
    s.setAttribute('aria-pressed', i < n ? 'true' : 'false');
  });
  stars.forEach((s, i) => {
    s.addEventListener('click', () => { rating = i + 1; paintStars(rating); });
    s.addEventListener('mouseenter', () => paintStars(i + 1));
  });
  starsWrap.addEventListener('mouseleave', () => paintStars(rating));

  const open = () => {
    backdrop.hidden = false;
    window.lenis?.stop();
    document.body.classList.add('no-scroll');
    (stars[0] || coloresEl)?.focus();
  };
  const close = () => {
    backdrop.hidden = true;
    window.lenis?.start();
    document.body.classList.remove('no-scroll');
    btn.focus();
  };
  btn.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  backdrop.addEventListener('click', (e) => { if (e.target === backdrop) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !backdrop.hidden) close(); });

  submitBtn.addEventListener('click', () => {
    const colores = coloresEl.value.trim();
    const contenido = contenidoEl.value.trim();
    const otros = otrosEl.value.trim();
    if (!rating && !colores && !contenido && !otros) { coloresEl.focus(); return; }

    const slugUrl = (location.pathname.match(/\/demo\/([^/]+)/) || [])[1] || document.title;
    const slug = gkySlugify(slugUrl);
    const negocio = (document.title.split(/\s[—|]\s|\s-\s/)[0] || document.title || '').trim();
    const estrellas = rating ? '★'.repeat(rating) + '☆'.repeat(5 - rating) + ` (${rating}/5)` : 'Sin calificar';
    const lineas = [
      `Devolución de la demo${negocio ? ' — ' + negocio : ''}`,
      `Calificación: ${estrellas}`,
      colores ? `Colores: ${colores}` : null,
      contenido ? `Contenido: ${contenido}` : null,
      otros ? `Otros: ${otros}` : null,
      location.href,
    ].filter(Boolean);

    window.open(`https://wa.me/${GKY_FEEDBACK_WHATSAPP}?text=${encodeURIComponent(lineas.join('\n'))}`, '_blank', 'noopener');
    window.__gkySendResena?.({ slug, negocio, rating: rating || null, colores, contenido, otros, url: location.href })
      ?.catch(err => console.warn('No se pudo guardar la devolución en Firestore:', err));

    if (typeof showToast === 'function') showToast('¡Gracias por tu devolución!'); else window.alert('¡Gracias por tu devolución!');
    close();
    rating = 0; paintStars(0); coloresEl.value = ''; contenidoEl.value = ''; otrosEl.value = '';
  });

  if (reduceMotion) return;
  let hideTimer = null;
  window.addEventListener('scroll', () => {
    btn.classList.add('is-hidden');
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => btn.classList.remove('is-hidden'), 550);
  }, { passive: true });
}

function initAnio() {
  const el = document.getElementById('anio');
  if (el) el.textContent = String(new Date().getFullYear());
}

initTablero();
initServicios();
initRail();
initReveals();
initNav();
initWspFloat();
initHero();
initCounters();
initLeeScroll();
initForm();
initFeedbackFloat();
initAnio();
window.addEventListener('load', initMapa);
