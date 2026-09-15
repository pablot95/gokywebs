const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5491161120651';

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
  document.querySelectorAll('[data-animate]').forEach(el => {
    el.style.opacity = 1; el.style.transform = 'none'; el.style.clipPath = 'none';
  });
}
if (typeof ScrollTrigger !== 'undefined') {
  window.addEventListener('load', () => ScrollTrigger.refresh());
}

const VIAJES = [
  {
    flap: 'EZEIZA', titulo: 'Ezeiza',
    foto: 'images/traslado-aeropuerto-ejecutivo.webp', w: 1920, h: 686,
    alt: 'Chofer de RemisDMA esperando con el auto frente a la terminal del aeropuerto de Ezeiza',
    incluye: [
      'Te espero en Arribos con un cartel a tu nombre',
      'Miro la hora real de llegada del vuelo antes de salir',
      'Te ayudo con el equipaje hasta el baúl',
    ],
    wsp: 'un traslado a Ezeiza',
  },
  {
    flap: 'AEROPARQUE', titulo: 'Aeroparque',
    foto: 'images/traslado-ejecutivo-hotel.webp', w: 941, h: 1672,
    alt: 'Traslado ejecutivo con equipaje en la puerta de un hotel camino a Aeroparque',
    incluye: [
      'Salidas de madrugada coordinadas la noche anterior',
      'Puerta a puerta, desde tu casa, la oficina o el hotel',
      'También la vuelta, si ya sabés cuándo regresás',
    ],
    wsp: 'un traslado a Aeroparque',
  },
  {
    flap: 'CORPORATIVO', titulo: 'Corporativo',
    foto: 'images/interior-traslado-ejecutivo.webp', w: 1254, h: 1254,
    alt: 'Pasajero trabajando con su notebook en el asiento trasero del auto ejecutivo',
    incluye: [
      'Asiento trasero libre para trabajar o hacer llamadas',
      'Espera en la puerta entre una reunión y la siguiente',
      'Ideal para recibir clientes del exterior',
    ],
    wsp: 'un traslado corporativo',
  },
  {
    flap: 'CASAMIENTOS', titulo: 'Casamientos',
    foto: 'images/traslado-casamiento.webp', w: 1122, h: 1402,
    alt: 'Los novios subiendo al auto ejecutivo decorado con flores blancas',
    incluye: [
      'El auto a disposición las horas que necesites',
      'Recorrido y horarios coordinados con el salón',
      'Auto lavado y detallado especialmente para las fotos',
    ],
    wsp: 'el auto para un casamiento',
  },
  {
    flap: 'INTERIOR', titulo: 'Interior',
    foto: 'images/viaje-larga-distancia.webp', w: 1619, h: 971,
    alt: 'El auto ejecutivo en ruta al atardecer durante un viaje de larga distancia',
    incluye: [
      'Viajes al interior con el auto solo para vos',
      'Paramos las veces que haga falta en el camino',
      'Coordinamos solo ida, o ida y vuelta',
    ],
    wsp: 'un viaje de larga distancia',
  },
];

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; document.body.appendChild(bd); }
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open'); nav.setAttribute('inert', '');
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

function initWspFloat() {
  const btn = document.getElementById('wsp-float');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) btn.classList.add('visible'); else btn.classList.remove('visible');
  }, { passive: true });
}

function initProgress() {
  const bar = document.getElementById('progressBar');
  if (!bar) return;
  const update = () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = `scaleX(${h > 0 ? Math.min(window.scrollY / h, 1) : 0})`;
  };
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update, { passive: true });
  update();
}

function initTablero() {
  const rows = Array.from(document.querySelectorAll('#boardRows .row'));
  const panel = document.getElementById('boardPanel');
  const flapWrap = document.getElementById('flapDestino');
  const flapTexto = document.getElementById('flapTexto');
  const foto = document.getElementById('panelFoto');
  const figura = foto ? foto.closest('.panel-photo') : null;
  const incluye = document.getElementById('panelIncluye');
  const cta = document.getElementById('panelCta');
  if (!rows.length || !panel || !flapWrap) return;

  const CELDAS = 11;
  const GLIFOS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let timers = [];
  let actual = 0;

  const pintarFlaps = (texto, animar) => {
    timers.forEach(id => window.clearInterval(id));
    timers = [];
    flapWrap.replaceChildren();
    const chars = texto.padEnd(CELDAS, ' ').slice(0, CELDAS).split('');
    chars.forEach((ch, i) => {
      const celda = document.createElement('span');
      celda.className = 'flap';
      flapWrap.appendChild(celda);
      const final = ch === ' ' ? '' : ch;
      if (!animar || reduceMotion) { celda.textContent = final; return; }
      celda.textContent = '';
      celda.classList.add('is-flipping');
      let n = 0;
      const total = Math.round(4 + i * 1.5);
      const t = window.setInterval(() => {
        n++;
        if (n >= total) {
          celda.textContent = final;
          celda.classList.remove('is-flipping');
          window.clearInterval(t);
        } else {
          celda.textContent = GLIFOS[Math.floor(Math.random() * GLIFOS.length)];
        }
      }, 42);
      timers.push(t);
    });
  };

  const seleccionar = (i, opciones) => {
    const { foco = false, animar = true } = opciones || {};
    actual = i;
    const v = VIAJES[i];
    if (!v) return;
    rows.forEach((r, k) => {
      const on = k === i;
      r.setAttribute('aria-selected', on ? 'true' : 'false');
      r.tabIndex = on ? 0 : -1;
    });
    panel.setAttribute('aria-labelledby', rows[i].id);
    pintarFlaps(v.flap, animar);
    if (flapTexto) flapTexto.textContent = v.titulo;
    if (figura && foto) {
      figura.classList.add('is-swapping');
      window.setTimeout(() => {
        foto.src = v.foto;
        foto.alt = v.alt;
        foto.width = v.w;
        foto.height = v.h;
        const listo = () => figura.classList.remove('is-swapping');
        if (foto.complete) listo(); else foto.addEventListener('load', listo, { once: true });
      }, 170);
    }
    if (incluye) {
      incluye.replaceChildren();
      v.incluye.forEach(texto => {
        const li = document.createElement('li');
        li.textContent = texto;
        incluye.appendChild(li);
      });
    }
    if (cta) cta.href = `https://wa.me/${WSP}?text=${encodeURIComponent(`Hola RemisDMA, quiero reservar ${v.wsp}.`)}`;
    if (foco) rows[i].focus();
  };

  rows.forEach((r, i) => {
    r.addEventListener('click', () => seleccionar(i, { animar: true }));
    r.addEventListener('keydown', e => {
      const pasos = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
      if (e.key in pasos) {
        e.preventDefault();
        seleccionar((i + pasos[e.key] + rows.length) % rows.length, { foco: true, animar: true });
      } else if (e.key === 'Home') { e.preventDefault(); seleccionar(0, { foco: true, animar: true }); }
      else if (e.key === 'End') { e.preventDefault(); seleccionar(rows.length - 1, { foco: true, animar: true }); }
    });
  });

  seleccionar(0, { animar: false });

  let arrancado = false;
  const arrancar = () => {
    if (arrancado) return;
    arrancado = true;
    if (!reduceMotion) pintarFlaps(VIAJES[actual].flap, true);
  };
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entradas => {
      entradas.forEach(e => { if (e.isIntersecting) { arrancar(); io.disconnect(); } });
    }, { threshold: 0 });
    io.observe(panel);
  }
  const chequear = () => {
    if (arrancado) { window.removeEventListener('scroll', chequear); return; }
    const r = panel.getBoundingClientRect();
    if (r.bottom > 0 && r.top < window.innerHeight) { arrancar(); window.removeEventListener('scroll', chequear); }
  };
  window.addEventListener('load', chequear);
  window.addEventListener('scroll', chequear, { passive: true });
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
      try { vp.setPointerCapture?.(pointerId); } catch { /* sin capture el drag igual funciona */ }
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
      window.setTimeout(() => vp.removeEventListener('click', kill, { capture: true }), 0);
    }
    pointerId = null; moved = false;
  };
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
  vp.addEventListener('dragstart', e => e.preventDefault());
}

function initRail() {
  const vp = document.getElementById('autoRail');
  if (!vp) return;
  vp.addEventListener('wheel', e => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
    const max = vp.scrollWidth - vp.clientWidth;
    if (max <= 1) return;
    const atStart = vp.scrollLeft <= 0, atEnd = vp.scrollLeft >= max - 1;
    if ((e.deltaY < 0 && atStart) || (e.deltaY > 0 && atEnd)) return;
    e.preventDefault();
    vp.scrollLeft += e.deltaY;
  }, { passive: false });
  initRailDrag(vp);
}

function initRuta() {
  const rect = document.getElementById('rutaRect');
  const pasos = Array.from(document.querySelectorAll('.paso'));
  if (!pasos.length) return;
  if (!rect || reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    rect?.setAttribute('width', '1200');
    pasos.forEach(p => p.classList.add('is-on'));
    return;
  }
  gsap.fromTo(rect,
    { attr: { width: 0 } },
    {
      attr: { width: 1200 }, ease: 'none',
      scrollTrigger: {
        trigger: '.pasos-grid', start: 'top 85%', end: 'bottom 65%', scrub: 0.5, invalidateOnRefresh: true,
        onUpdate: self => {
          const n = Math.ceil(self.progress * pasos.length);
          pasos.forEach((p, i) => p.classList.toggle('is-on', i < n));
        },
      },
    });
}

function initMapa() {
  const nodo = document.getElementById('mapa');
  if (!nodo || typeof L === 'undefined') return;
  const centro = [-34.6037, -58.3816];
  const mapa = L.map(nodo, { scrollWheelZoom: false }).setView(centro, 11);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap &copy; CARTO',
    maxZoom: 19,
  }).addTo(mapa);
  L.marker(centro, {
    icon: L.divIcon({ className: '', html: '<span class="mapa-pin"></span>', iconSize: [22, 22], iconAnchor: [11, 11] }),
    keyboard: false,
  }).addTo(mapa);
}

function initYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}

initNav();
initReveals();
initWspFloat();
initProgress();
initTablero();
initRail();
initRuta();
initMapa();
initYear();
