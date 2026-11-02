const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5492942401297';

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

const SALIDAS = [
  { senal: 'circulo', nivel: 'Nivel inicial', t: 'Paseo de iniciación', dur: '2 a 3 horas', ter: 'Ripio firme y huellas anchas, con poco desnivel.', agua: '1,5 litros de agua' },
  { senal: 'cuadrado', nivel: 'Nivel intermedio', t: 'Media jornada', dur: '4 a 5 horas', ter: 'Subidas sostenidas y sendas con piedra suelta.', agua: '2 litros de agua y algo para comer' },
  { senal: 'rombo', nivel: 'Nivel avanzado', t: 'Día completo', dur: '6 a 8 horas', ter: 'Cuestas largas y bajadas técnicas, con parada para comer.', agua: '3 litros de agua y comida para el día' },
  { senal: 'doble', nivel: 'Nivel experto', t: 'Ruta técnica a medida', dur: 'A coordinar', ter: 'Sendas técnicas o el recorrido que tengas en mente.', agua: '3 litros de agua y comida para el día' }
];
const EXPERIENCIA = ['nunca anduve en montaña', 'salgo cada tanto', 'ando seguido', 'busco recorridos técnicos'];
const TIEMPO = ['unas horas', 'medio día', 'el día entero'];
const TOPE_POR_TIEMPO = [0, 1, 3];
const TALLES = [[155, 'XS'], [167, 'S'], [178, 'M'], [188, 'L'], [Infinity, 'XL']];

function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function waLink(msg) {
  return `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
}

function icono(id) {
  return `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><use href="#i-${id}"/></svg>`;
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
  const desktopMq = window.matchMedia('(min-width: 1025px)');
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
    .from(hero.querySelectorAll('h1'), { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.sello, .hero-badge'), { scale: 0.92, opacity: 0, duration: 1.1, stagger: 0.1, clearProps: 'transform,opacity' }, 0.65);
}

function talleSegun(cm) {
  return TALLES.find(([max]) => cm < max)?.[1] || 'XL';
}

function initGuia() {
  const form = document.getElementById('guiaForm');
  if (!form) return;
  const cuerpo = document.querySelector('.cartel-cuerpo');
  const cSenal = document.getElementById('cSenal');
  const cNivel = document.getElementById('cNivel');
  const cDur = document.getElementById('cDur');
  const cTit = document.getElementById('cTit');
  const cTer = document.getElementById('cTer');
  const cPers = document.getElementById('cPers');
  const cBici = document.getElementById('cBici');
  const cLlevar = document.getElementById('cLlevar');
  const cNota = document.getElementById('cNota');
  const cCta = document.getElementById('cCta');
  const pers = document.getElementById('gPers');
  const alturaWrap = document.getElementById('gAlturaWrap');
  const altura = document.getElementById('gAltura');
  const ayuda = document.getElementById('gAlturaAyuda');
  const menos = form.querySelector('[data-paso="-1"]');
  const mas = form.querySelector('[data-paso="1"]');
  const valor = name => form.querySelector(`input[name="${name}"]:checked`)?.value;
  let personas = 1;
  let primera = true;

  const pintar = () => {
    const exp = Number(valor('g-exp') || 0);
    const tiempo = Number(valor('g-tiempo') || 0);
    const bici = valor('g-bici') || 'propia';
    const idx = Math.min(exp, TOPE_POR_TIEMPO[tiempo] ?? 0);
    const s = SALIDAS[idx] || SALIDAS[0];
    const alquila = bici === 'alquiler';
    alturaWrap.hidden = !alquila;

    let talle = '';
    let cm = 0;
    if (alquila) {
      cm = Math.round(Number(altura.value));
      const ok = cm >= 130 && cm <= 210;
      altura.setAttribute('aria-invalid', ok ? 'false' : 'true');
      ayuda.classList.toggle('es-error', !ok);
      ayuda.textContent = ok ? `Talle sugerido: ${talleSegun(cm)}. Es orientativo y lo confirmamos por WhatsApp.` : 'Ingresá tu altura en centímetros, entre 130 y 210.';
      talle = ok ? talleSegun(cm) : '';
    }

    cSenal.className = `senal senal--${s.senal}`;
    cNivel.textContent = s.nivel;
    cDur.textContent = s.dur;
    cTit.textContent = s.t;
    cTer.textContent = s.ter;
    cPers.textContent = `${personas} ${personas === 1 ? 'persona' : 'personas'}`;
    cBici.textContent = alquila ? (talle ? `Alquiler, talle ${talle}` : 'Alquiler, talle a confirmar') : 'Propia';

    const llevar = [
      ['drop', s.agua],
      ['wind', 'Campera rompeviento: en el norte neuquino el viento cambia rápido'],
      ['sun', 'Protector solar y anteojos'],
      alquila ? ['bike', 'Casco: si no tenés, consultalo al reservar'] : ['bike', 'Tu bici y tu casco: los revisamos antes de salir']
    ];
    cLlevar.innerHTML = llevar.map(([i, t]) => `<li>${icono(i)}<span>${esc(t)}</span></li>`).join('');
    cNota.textContent = idx < exp
      ? `Con más tiempo, tu nivel da para la salida «${SALIDAS[exp].t}».`
      : 'Orientativo: el recorrido final lo definimos con vos según el clima y la temporada.';

    const lineaBici = alquila
      ? `Bici: necesito alquilar ${personas === 1 ? 'una' : personas} (${talle ? `talle ${talle}, mido ${cm} cm` : 'talle a confirmar'})`
      : 'Bici: llevo la mía';
    cCta.href = waLink([
      'Hola Norteadventur! Quiero consultar por una salida.',
      `Salida: ${s.t} (${s.nivel.toLowerCase()})`,
      `Experiencia: ${EXPERIENCIA[exp]}`,
      `Tiempo: ${TIEMPO[tiempo]}`,
      `Personas: ${personas}`,
      lineaBici,
      '¿Qué días tienen disponibles?'
    ].join('\n'));

    if (!primera && cuerpo && !reduceMotion) {
      cuerpo.classList.remove('cambio');
      void cuerpo.offsetWidth;
      cuerpo.classList.add('cambio');
    }
    primera = false;
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  };

  const pintarPersonas = () => {
    pers.textContent = String(personas);
    menos.disabled = personas <= 1;
    mas.disabled = personas >= 12;
  };
  [menos, mas].forEach(b => b?.addEventListener('click', () => {
    personas = Math.min(12, Math.max(1, personas + Number(b.dataset.paso)));
    pintarPersonas();
    pintar();
  }));

  form.addEventListener('change', pintar);
  altura?.addEventListener('input', pintar);
  cCta.addEventListener('click', () => showToast('Abrimos WhatsApp con tu salida lista para mandar.'));
  pintarPersonas();
  pintar();
}

function initDudas() {
  document.querySelectorAll('.duda').forEach(d => d.addEventListener('toggle', () => {
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  }));
}

initWspFloat();
initModelBarScroll();
initNav();
initGuia();
initDudas();
initReveals();
initHeroMotion();
