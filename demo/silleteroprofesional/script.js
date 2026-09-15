document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WA = '5491161326631';
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}
if (typeof gsap === 'undefined') {
  document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; el.style.clipPath = 'none'; el.style.filter = 'none'; });
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

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  const header = document.querySelector('.site-header');
  let bd = header.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; header.appendChild(bd); }
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open'); nav.setAttribute('inert', '');
    toggle.setAttribute('aria-expanded', 'false'); document.body.classList.remove('no-scroll');
  };
  const open = () => {
    nav.classList.add('open'); bd.classList.add('open'); nav.removeAttribute('inert');
    toggle.setAttribute('aria-expanded', 'true'); document.body.classList.add('no-scroll');
    nav.querySelector('a')?.focus();
  };
  const sync = () => {
    if (window.innerWidth > 768) { nav.removeAttribute('inert'); nav.classList.remove('open'); bd.classList.remove('open'); document.body.classList.remove('no-scroll'); toggle.setAttribute('aria-expanded', 'false'); }
    else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  toggle.addEventListener('click', () => (nav.classList.contains('open') ? close() : open()));
  closeBtn?.addEventListener('click', () => { close(); toggle.focus(); });
  bd.addEventListener('click', close);
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); } });
  window.addEventListener('resize', sync, { passive: true });
  sync();
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

function initHero() {
  if (typeof gsap === 'undefined' || reduceMotion) return;
  gsap.set('.hero-rope', { scaleY: 0, transformOrigin: '50% 0%' });
  gsap.set('.hero-figure', { rotation: -7, opacity: 0 });
  gsap.set(['.hero-anchor', '.hero-stamp'], { opacity: 0 });

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.from('.hero-eyebrow', { y: 14, opacity: 0, duration: .7 })
    .from('.hero-title .line > span', { yPercent: 112, duration: 1.05, stagger: .09, ease: 'expo.out' }, '-=.42')
    .from('.hero-sub', { y: 18, opacity: 0, duration: .85 }, '-=.6')
    .from('.hero-cta > *', { y: 16, opacity: 0, duration: .7, stagger: .09 }, '-=.58')
    .from('.hero-wall', { opacity: 0, scale: .95, transformOrigin: '50% 100%', duration: 1.2 }, .15)
    .to('.hero-rope', { scaleY: 1, duration: .95, ease: 'power2.inOut' }, .35)
    .to('.hero-anchor', { opacity: 1, duration: .5 }, .5)
    .to('.hero-figure', { opacity: 1, duration: .55 }, .72)
    .to('.hero-figure', { rotation: 0, duration: 2.6, ease: 'elastic.out(1, 0.45)' }, .78)
    .to('.hero-stamp', { opacity: 1, y: 0, duration: .7 }, 1.25)
    .from('.hero-stamp', { y: 14 }, 1.25);

  gsap.to('.hero-figure', { rotation: 1, duration: 5.2, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 3.4 });
}

function initCapitulo() {
  const stage = document.getElementById('capStage');
  const grupo = document.getElementById('capAndamio');
  const pasos = Array.from(document.querySelectorAll('#capPasos li'));
  if (!stage || !grupo || !pasos.length) return;

  const NS = 'http://www.w3.org/2000/svg';
  const postsX = [7, 28.75, 50.5, 72.25, 94];
  const beamsY = [8, 22, 36, 50, 64, 78, 92];
  const add = (d, cls) => {
    const el = document.createElementNS(NS, 'path');
    el.setAttribute('d', d);
    el.setAttribute('class', cls);
    el.setAttribute('vector-effect', 'non-scaling-stroke');
    grupo.appendChild(el);
  };
  postsX.forEach(x => add(`M${x} 7 V97`, 'post'));
  beamsY.forEach(y => add(`M7 ${y} H94`, 'beam'));
  for (let i = 0; i < postsX.length - 1; i++) {
    for (let j = 0; j < beamsY.length - 1; j++) {
      if ((i + j) % 2) continue;
      add(`M${postsX[i]} ${beamsY[j]} L${postsX[i + 1]} ${beamsY[j + 1]}`, 'brace');
    }
  }
  postsX.forEach(x => add(`M${x - 3.4} 97 H${x + 3.4}`, 'plate'));

  const clipRect = document.getElementById('capClipRect');
  const cuerda = document.getElementById('capCuerda');
  const largo = cuerda.getTotalLength();
  cuerda.style.strokeDasharray = largo;
  cuerda.style.strokeDashoffset = largo;

  const HUD = [
    { estructura: 'Todavía nada', vereda: 'Libre', arranque: 'Sin fecha', tono: ['', '', ''] },
    { estructura: 'Montada piso por piso', vereda: 'Ocupada de punta a punta', arranque: 'Días de armado', tono: ['is-warn', 'is-warn', 'is-warn'] },
    { estructura: 'Ninguna', vereda: 'Vallado solo del sector', arranque: 'La misma mañana', tono: ['is-ok', 'is-ok', 'is-ok'] },
    { estructura: 'Ninguna', vereda: 'Libre y barrida', arranque: 'Frente terminado', tono: ['is-ok', 'is-ok', 'is-ok'] },
  ];
  const celdas = {
    estructura: document.querySelector('[data-hud="estructura"]'),
    vereda: document.querySelector('[data-hud="vereda"]'),
    arranque: document.querySelector('[data-hud="arranque"]'),
  };
  const claves = ['estructura', 'vereda', 'arranque'];
  let stepActual = -1;

  const setStep = progress => {
    const i = progress < .24 ? 0 : progress < .49 ? 1 : progress < .74 ? 2 : 3;
    if (i === stepActual) return;
    stepActual = i;
    pasos.forEach((li, n) => li.classList.toggle('is-on', n === i));
    claves.forEach((clave, n) => {
      const cel = celdas[clave];
      if (!cel) return;
      const valor = HUD[i][clave];
      if (cel.textContent === valor) return;
      cel.classList.add('swap');
      setTimeout(() => {
        cel.textContent = valor;
        cel.className = HUD[i].tono[n];
        cel.classList.remove('swap');
      }, 170);
    });
  };
  setStep(0);

  const construirTl = triggerCfg => {
    document.getElementById('capPasos')?.classList.add('is-live');
    const tl = gsap.timeline({ scrollTrigger: Object.assign({ scrub: .6, invalidateOnRefresh: true, onUpdate: self => setStep(self.progress) }, triggerCfg) });
    tl.to({}, { duration: 1 })
      .to(clipRect, { attr: { y: 0, height: 100 }, duration: 1, ease: 'none' }, 1)
      .to(clipRect, { attr: { y: 100, height: 0 }, duration: .95, ease: 'none' }, 2)
      .to('#capSilleta', { opacity: 1, duration: .4 }, 2.3)
      .to(cuerda, { strokeDashoffset: 0, duration: .75, ease: 'none' }, 2.35)
      .to('#capSpot', { opacity: 1, duration: .7 }, 2.7)
      .to('.cap-scrim', { opacity: 0, duration: .7 }, 2.7)
      .fromTo('#capRing', { attr: { r: 3 }, opacity: 0 }, { attr: { r: 13 }, opacity: 1, duration: .55, ease: 'back.out(1.6)' }, 2.95)
      .to({}, { duration: 1 });
    return tl;
  };

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    gsapAusente();
    return;
  }

  const mm = gsap.matchMedia();
  mm.add('(min-width: 1081px) and (prefers-reduced-motion: no-preference)', () => {
    construirTl({ trigger: stage, start: 'top top', end: '+=260%', pin: true, anticipatePin: 1 });
  });
  mm.add('(max-width: 1080px) and (prefers-reduced-motion: no-preference)', () => {
    stage.classList.add('is-sticky-mobile');
    requestAnimationFrame(() => ScrollTrigger.refresh());
    construirTl({ trigger: stage, start: 'top top', end: 'bottom bottom' });
    return () => { stage.classList.remove('is-sticky-mobile'); ScrollTrigger.refresh(); };
  });
  mm.add('(prefers-reduced-motion: reduce)', () => {
    gsapAusente();
  });

  function gsapAusente() {
    clipRect.setAttribute('y', '100');
    clipRect.setAttribute('height', '0');
    cuerda.style.strokeDashoffset = 0;
    const silleta = document.getElementById('capSilleta');
    const spot = document.getElementById('capSpot');
    const scrim = document.querySelector('.cap-scrim');
    if (silleta) silleta.style.opacity = 1;
    if (spot) spot.style.opacity = 1;
    if (scrim) scrim.style.opacity = 0;
    pasos.forEach(li => li.classList.add('is-on'));
    stepActual = 2;
    claves.forEach((clave, n) => {
      const cel = celdas[clave];
      if (!cel) return;
      cel.textContent = HUD[2][clave];
      cel.className = HUD[2].tono[n];
    });
  }
}

function initPano() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) return;
  const img = document.getElementById('panoImg');
  if (!img) return;
  gsap.fromTo(img,
    { objectPosition: '0% 50%' },
    { objectPosition: '100% 50%', ease: 'none', scrollTrigger: { trigger: '.pano', start: 'top bottom', end: 'bottom top', scrub: .6 } }
  );
}

function initObras() {
  const grid = document.getElementById('obrasGrid');
  const lb = document.getElementById('lightbox');
  if (!grid || !lb) return;
  const botones = Array.from(grid.querySelectorAll('.obra'));
  const img = document.getElementById('lbImg');
  const cap = document.getElementById('lbCap');
  const btnClose = document.getElementById('lbClose');
  const btnPrev = document.getElementById('lbPrev');
  const btnNext = document.getElementById('lbNext');
  let indice = 0;
  let ultimoFoco = null;

  const pintar = i => {
    indice = (i + botones.length) % botones.length;
    const src = botones[indice].querySelector('img');
    const texto = botones[indice].querySelector('.obra-cap');
    if (!src) return;
    img.src = src.getAttribute('src');
    img.alt = src.getAttribute('alt') || '';
    cap.textContent = texto ? texto.textContent.trim() : '';
  };
  const abrir = i => {
    ultimoFoco = document.activeElement;
    pintar(i);
    lb.hidden = false;
    document.body.classList.add('no-scroll');
    requestAnimationFrame(() => lb.classList.add('open'));
    btnClose.focus();
  };
  const cerrar = () => {
    lb.classList.remove('open');
    document.body.classList.remove('no-scroll');
    setTimeout(() => { lb.hidden = true; }, 280);
    ultimoFoco?.focus();
  };

  botones.forEach((b, i) => b.addEventListener('click', () => abrir(i)));
  btnClose.addEventListener('click', cerrar);
  btnPrev.addEventListener('click', () => pintar(indice - 1));
  btnNext.addEventListener('click', () => pintar(indice + 1));
  lb.addEventListener('click', e => { if (e.target === lb) cerrar(); });
  document.addEventListener('keydown', e => {
    if (lb.hidden) return;
    if (e.key === 'Escape') { cerrar(); return; }
    if (e.key === 'ArrowLeft') { pintar(indice - 1); return; }
    if (e.key === 'ArrowRight') { pintar(indice + 1); return; }
    if (e.key !== 'Tab') return;
    const focales = [btnClose, btnPrev, btnNext];
    const pos = focales.indexOf(document.activeElement);
    e.preventDefault();
    const siguiente = e.shiftKey ? (pos <= 0 ? focales.length - 1 : pos - 1) : (pos === focales.length - 1 ? 0 : pos + 1);
    focales[siguiente].focus();
  });
}

const FACTOR_ESTADO = {
  'Bueno, solo pintura': 1,
  'Con revoque flojo o descascarado': 1.45,
  'Con fisuras a sellar': 1.25,
  'Con humedad o filtraciones': 1.6,
  'No sabría decir': 1.25,
};

function estimarDias(plantas, estado, cantidadTrabajos) {
  const p = Math.min(20, Math.max(1, Number(plantas) || 1));
  const n = Math.max(1, Number(cantidadTrabajos) || 1);
  let dias = p * 1.1 + 1.5;
  dias *= FACTOR_ESTADO[estado] ?? 1.2;
  dias += (n - 1) * 1.2;
  const min = Math.max(2, Math.round(dias * .85));
  const max = Math.max(min + 1, Math.round(dias * 1.2) + 1);
  return { min, max, texto: `${min} a ${max} días de trabajo` };
}

function armarMensaje(datos) {
  const lineas = [
    `Hola, soy ${datos.nombre} y quiero un presupuesto para mi frente.`,
    `Trabajo: ${datos.trabajos.join(', ')}.`,
    `Plantas: ${datos.plantas}.`,
    `Estado del frente: ${datos.estado}.`,
    `Estimación que me dio la web: ${datos.estimacion}.`,
    `Mi teléfono: ${datos.telefono}.`,
  ];
  if (datos.detalle) lineas.push(`Detalle: ${datos.detalle}`);
  return `https://wa.me/${WA}?text=${encodeURIComponent(lineas.join('\n'))}`;
}

function formatearTelefono(valor) {
  const d = String(valor ?? '').replace(/\D/g, '').slice(0, 11);
  if (d.length > 2 && d.length <= 6) return `${d.slice(0, 2)} ${d.slice(2)}`;
  if (d.length > 6 && d.length <= 10) return `${d.slice(0, 2)} ${d.slice(2, 6)}-${d.slice(6)}`;
  if (d.length > 10) return `${d.slice(0, 3)} ${d.slice(3, 7)}-${d.slice(7)}`;
  return d;
}

function initForm() {
  const form = document.getElementById('presupuestoForm');
  if (!form) return;
  const menos = document.getElementById('plantasMenos');
  const mas = document.getElementById('plantasMas');
  const salida = document.getElementById('plantasOut');
  const estado = document.getElementById('estado');
  const estimacion = document.getElementById('estimacionTexto');
  const nombre = document.getElementById('nombre');
  const telefono = document.getElementById('telefono');
  const detalle = document.getElementById('detalle');
  const chips = Array.from(form.querySelectorAll('input[name="trabajo[]"]'));
  let plantas = 4;

  const elegidos = () => chips.filter(c => c.checked).map(c => c.value);
  const calcular = () => {
    estimacion.textContent = estimarDias(plantas, estado.value, elegidos().length).texto;
  };
  const pintarPlantas = () => {
    salida.textContent = plantas;
    menos.disabled = plantas <= 1;
    mas.disabled = plantas >= 20;
    calcular();
  };
  menos.addEventListener('click', () => { if (plantas > 1) { plantas--; pintarPlantas(); } });
  mas.addEventListener('click', () => { if (plantas < 20) { plantas++; pintarPlantas(); } });
  estado.addEventListener('change', calcular);
  chips.forEach(c => c.addEventListener('change', () => { calcular(); marcar('trabajo', elegidos().length > 0); }));
  pintarPlantas();

  telefono.addEventListener('input', () => { telefono.value = formatearTelefono(telefono.value); });

  function marcar(campo, ok) {
    const err = document.getElementById(`err-${campo}`);
    if (err) err.hidden = ok;
    const input = document.getElementById(campo);
    if (input) input.setAttribute('aria-invalid', ok ? 'false' : 'true');
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    const trabajos = elegidos();
    const okTrabajo = trabajos.length > 0;
    const okNombre = nombre.value.trim().length >= 2;
    const okTel = telefono.value.replace(/\D/g, '').length >= 8;
    marcar('trabajo', okTrabajo);
    marcar('nombre', okNombre);
    marcar('telefono', okTel);
    if (!okTrabajo || !okNombre || !okTel) {
      const primero = !okTrabajo ? chips[0] : !okNombre ? nombre : telefono;
      primero.focus();
      showToast('Faltan datos para armar el mensaje.');
      return;
    }
    const url = armarMensaje({
      nombre: nombre.value.trim(),
      trabajos,
      plantas,
      estado: estado.value,
      estimacion: estimacion.textContent,
      telefono: telefono.value.trim(),
      detalle: detalle.value.trim(),
    });
    window.open(url, '_blank', 'noopener');
    showToast('Te abrimos WhatsApp con el mensaje armado.');
  });
}

function initMapa() {
  const nodo = document.getElementById('mapa');
  if (!nodo || typeof L === 'undefined') return;
  const mapa = L.map(nodo, { scrollWheelZoom: false, zoomControl: false, attributionControl: true }).setView([-34.6037, -58.3816], 10);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap &copy; CARTO',
    maxZoom: 18,
  }).addTo(mapa);
  L.circle([-34.6037, -58.3816], {
    radius: 26000, color: '#2563EB', weight: 1.5, fillColor: '#2563EB', fillOpacity: .14,
  }).addTo(mapa);
  L.circleMarker([-34.6037, -58.3816], {
    radius: 6, color: '#D38301', weight: 2, fillColor: '#D38301', fillOpacity: 1,
  }).addTo(mapa).bindPopup('Trabajamos en CABA y Gran Buenos Aires');
}

function initDetalles() {
  if (typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('.faq-list details').forEach(d => {
    d.addEventListener('toggle', () => ScrollTrigger.refresh());
  });
}

const anio = document.getElementById('anio');
if (anio) anio.textContent = new Date().getFullYear();

initNav();
initReveals();
initWspFloat();
initHero();
initCapitulo();
initPano();
initObras();
initForm();
initMapa();
initDetalles();
