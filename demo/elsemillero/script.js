const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5491165622235';

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

const MESES = [
  { n: 'Enero', t: 'Pleno verano: todo crece y la pileta no para.',
    jardin: ['Corte de césped cada 7 días y bordes prolijos', 'Riego y desmalezado de canteros'],
    pileta: ['Limpieza semanal de hojas y fondo', 'Control del agua para que siga cristalina'],
    casa: ['Pintura de interiores, lejos del sol fuerte'] },
  { n: 'Febrero', t: 'El calor sigue: césped y pileta, cada semana.',
    jardin: ['Corte de césped cada 7 a 10 días', 'Recorte de mantenimiento de ligustrinas'],
    pileta: ['Limpieza semanal y control del agua'],
    casa: ['Pintura de interiores y pequeños arreglos'] },
  { n: 'Marzo', t: 'Llega el otoño: buen momento para parquizar.',
    jardin: ['Parquizado y resiembra de los claros', 'Corte de césped cada 10 a 15 días'],
    pileta: ['Últimas limpiezas de la temporada'],
    casa: ['Pintura de frentes con temperaturas templadas'] },
  { n: 'Abril', t: 'Caen las hojas y el tiempo ayuda a pintar afuera.',
    jardin: ['Limpieza de hojas y canteros', 'Siembra de césped en los claros'],
    pileta: ['Limpieza a fondo antes del invierno'],
    casa: ['Pintura exterior antes del frío'] },
  { n: 'Mayo', t: 'Menos corte, más limpieza.',
    jardin: ['Corte cada 15 a 20 días y limpieza de hojas', 'Extracción de cañaverales y despeje de fondos'],
    pileta: ['Control del agua cada tanto para que no se ponga verde'],
    casa: ['Pintura de interiores y arreglos generales'] },
  { n: 'Junio', t: 'Invierno: es época de poda.',
    jardin: ['Poda de árboles y arbustos', 'Extracción de cañaverales'],
    pileta: ['Control periódico del agua y retiro de hojas'],
    casa: ['Interiores y arreglos generales'] },
  { n: 'Julio', t: 'La quinta descansa: se poda y se ordena.',
    jardin: ['Poda de invierno y limpieza de canteros', 'Despeje de fondos'],
    pileta: ['Control periódico del agua'],
    casa: ['Interiores y arreglos generales'] },
  { n: 'Agosto', t: 'Fin del invierno: el jardín se prepara para la primavera.',
    jardin: ['Última poda y preparación de canteros', 'Desmalezado antes del rebrote'],
    pileta: ['Revisión de bomba, filtro y luces'],
    casa: ['Pintura de interiores y arreglos'] },
  { n: 'Septiembre', t: 'Arranca la primavera: el césped vuelve a crecer.',
    jardin: ['Primeros cortes y desmalezado', 'Parquizado de primavera'],
    pileta: ['Revisión de bomba, filtro y luces antes de la temporada'],
    casa: ['Pintura de frentes y exteriores'] },
  { n: 'Octubre', t: 'Primavera plena: cercos, canteros y la pileta en la mira.',
    jardin: ['Corte de césped cada 10 a 15 días', 'Recorte de ligustrinas y cercos'],
    pileta: ['Puesta a punto: limpieza a fondo y agua lista'],
    casa: ['Pintura exterior y luces de jardín para el verano'] },
  { n: 'Noviembre', t: 'Se viene el verano: pileta a punto y césped cada semana.',
    jardin: ['Corte de césped cada 7 a 10 días y bordes', 'Recorte de cercos y canteros de verano'],
    pileta: ['Puesta a punto y primeras limpiezas semanales', 'Instalación y service de luces de pileta'],
    casa: ['Pintura exterior y luces de jardín'] },
  { n: 'Diciembre', t: 'Todo listo para las fiestas y las vacaciones.',
    jardin: ['Corte semanal y cercos prolijos', 'Riego y desmalezado'],
    pileta: ['Limpieza semanal y control del agua'],
    casa: ['Pintura de interiores y arreglos de último momento'] }
];
const AREAS = { jardin: 'Jardín', pileta: 'Pileta', casa: 'Casa' };
const AREAS_MSG = { jardin: 'jardín', pileta: 'pileta', casa: 'casa' };
const FRECS = { una: 'una sola vez', quince: 'cada 15 días', mes: 'todos los meses', def: 'a definir' };

function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
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

let refrescoPendiente = 0;
function refrescarTriggers() {
  if (typeof ScrollTrigger === 'undefined' || refrescoPendiente) return;
  refrescoPendiente = requestAnimationFrame(() => { refrescoPendiente = 0; ScrollTrigger.refresh(); });
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
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; const header = document.querySelector('.site-header'); (header || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 1101px)');
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

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  const media = document.querySelector('.hero--full .hero-media');
  if (!media) return;
  gsap.to(media, { yPercent: 5, ease: 'none', scrollTrigger: { trigger: '.hero--full', start: 'top top', end: 'bottom top', scrub: true } });
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
    if (!moved) { moved = true; vp.classList.add('dragging'); vp.setPointerCapture?.(pointerId); }
    e.preventDefault();
    vp.scrollLeft = startScroll - dx;
  });
  const end = e => {
    if (!dragging || (e && pointerId !== null && e.pointerId !== pointerId)) return;
    dragging = false;
    if (moved) {
      vp.releasePointerCapture?.(pointerId);
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
  const vp = document.getElementById('railTrabajos');
  if (!vp) return;
  initRailDrag(vp);
  const paso = () => (vp.querySelector('.rail-item')?.getBoundingClientRect().width || 300) + 20;
  const mover = dir => vp.scrollBy({ left: dir * paso(), behavior: reduceMotion ? 'auto' : 'smooth' });
  document.getElementById('railPrev')?.addEventListener('click', () => mover(-1));
  document.getElementById('railNext')?.addEventListener('click', () => mover(1));
}

function initTabs() {
  const list = document.querySelector('.tablist');
  if (!list) return;
  const tabs = [...list.querySelectorAll('[role="tab"]')];
  const activar = (tab, foco) => {
    tabs.forEach(t => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      const panel = document.getElementById(t.getAttribute('aria-controls'));
      if (!panel) return;
      panel.hidden = !on;
      if (on) setTimeout(() => panel.querySelectorAll('[data-animate]:not(.in)').forEach(el => el.classList.add('in')), 60);
    });
    if (foco) tab.focus();
    refrescarTriggers();
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => activar(t));
    t.addEventListener('keydown', e => {
      let j = null;
      if (e.key === 'ArrowRight') j = (i + 1) % tabs.length;
      else if (e.key === 'ArrowLeft') j = (i - 1 + tabs.length) % tabs.length;
      else if (e.key === 'Home') j = 0;
      else if (e.key === 'End') j = tabs.length - 1;
      if (j !== null) { e.preventDefault(); activar(tabs[j], true); }
    });
  });
}

function minus(s) { return s.charAt(0).toLowerCase() + s.slice(1); }
function listaY(arr) { return arr.length < 2 ? arr.join('') : `${arr.slice(0, -1).join(', ')} y ${arr[arr.length - 1]}`; }

function initMesActual() {
  const m = MESES[new Date().getMonth()];
  document.querySelectorAll('[data-mes-nombre]').forEach(el => { el.textContent = m.n; });
  document.querySelectorAll('[data-mes-titular]').forEach(el => { el.textContent = m.t; });
}

function initCalendario() {
  initMesActual();
  const rango = document.getElementById('calMes');
  if (!rango) return;
  const $ = id => document.getElementById(id);
  const nombre = $('calMesNombre'), mesTxt = $('calMesTxt'), num = $('calNum'), titular = $('calTitular');
  const grupos = $('calGrupos'), aviso = $('calAviso'), btn = $('calWsp'), prev = $('calPrevTxt'), loc = $('calLoc');
  const iniciales = [...document.querySelectorAll('.cal-ini span')];
  let mes = new Date().getMonth();

  const render = () => {
    const m = MESES[mes];
    const areas = [...document.querySelectorAll('input[data-cal-area]:checked')].map(i => i.value);
    const frec = document.querySelector('input[name="cal-frec"]:checked')?.value || 'def';
    const lugar = loc ? loc.value.trim().replace(/\s+/g, ' ') : '';
    rango.value = String(mes);
    rango.setAttribute('aria-valuetext', m.n);
    nombre.textContent = m.n;
    mesTxt.textContent = m.n;
    num.textContent = String(mes + 1);
    titular.textContent = m.t;
    iniciales.forEach((s, i) => s.classList.toggle('on', i === mes));
    grupos.innerHTML = areas.map(k => `<div class="sobre-grupo"><h4>${AREAS[k]}</h4><ul class="sobre-lista">${m[k].map(t => `<li>${esc(t)}</li>`).join('')}</ul></div>`).join('');
    aviso.hidden = areas.length > 0;
    const tareas = areas.flatMap(k => m[k].map(minus));
    const msg = areas.length
      ? `Hola El Semillero! Quiero cotizar el mantenimiento de ${m.n.toLowerCase()} para mi casa${lugar ? ` en ${lugar}` : ''}.\nPara: ${listaY(areas.map(k => AREAS_MSG[k]))}.\nMe interesa: ${tareas.join('; ')}.\nFrecuencia: ${FRECS[frec]}.`
      : `Hola El Semillero! Quiero cotizar el mantenimiento de ${m.n.toLowerCase()} para mi casa${lugar ? ` en ${lugar}` : ''}.`;
    btn.href = `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
    btn.classList.toggle('is-off', !areas.length);
    btn.setAttribute('aria-disabled', String(!areas.length));
    prev.textContent = msg;
    refrescarTriggers();
  };

  rango.addEventListener('input', () => { mes = Number(rango.value); render(); });
  $('calPrev')?.addEventListener('click', () => { mes = (mes + 11) % 12; render(); });
  $('calNext')?.addEventListener('click', () => { mes = (mes + 1) % 12; render(); });
  document.querySelectorAll('input[data-cal-area], input[name="cal-frec"]').forEach(i => i.addEventListener('change', render));
  loc?.addEventListener('input', render);
  btn.addEventListener('click', e => {
    if (btn.getAttribute('aria-disabled') === 'true') {
      e.preventDefault();
      showToast('Elegí al menos jardín, pileta o casa para armar el pedido.');
    }
  });
  render();
}

function initDudas() {
  document.querySelectorAll('details.duda').forEach(d => d.addEventListener('toggle', refrescarTriggers));
}

initCalendario();
initTabs();
initRail();
initReveals();
initNav();
initWspFloat();
initModelBarScroll();
initHeroMotion();
initParallax();
initDudas();
