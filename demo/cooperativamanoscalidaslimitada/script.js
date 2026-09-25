const WHATSAPP = '5491128810147';
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; el.style.filter = 'none'; el.style.clipPath = 'none'; });
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

const DIAS = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
const FRANJAS = [
  { nombre: 'mañana', horas: '7 a 15' },
  { nombre: 'tarde', horas: '15 a 23' },
  { nombre: 'noche', horas: '23 a 7' }
];
const HORAS_TURNO = 8;
const TURNOS_POR_PERSONA = 5;
const PRESETS = {
  horas: [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0]],
  noches: DIAS.map((_, d) => [d, 2]),
  '24h': DIAS.flatMap((_, d) => [[d, 0], [d, 1], [d, 2]]),
  limpiar: []
};
const NOMBRES_PRESET = { horas: 'Por horas', noches: 'Noches', '24h': 'Las 24 horas' };

function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function capitalizar(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

function waHref(msg) {
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
}

function listaConY(items) {
  if (items.length <= 1) return items.join('');
  return `${items.slice(0, -1).join(', ')} y ${items[items.length - 1]}`;
}

function textoDias(dias) {
  if (dias.length === 7) return 'todos los días';
  const corrido = dias.every((d, i) => i === 0 || d === dias[i - 1] + 1);
  if (corrido && dias.length >= 3) return `de ${DIAS[dias[0]]} a ${DIAS[dias[dias.length - 1]]}`;
  return listaConY(dias.map(d => DIAS[d]));
}

function textoFranjas(mascara, conHoras) {
  if (mascara === 7) return 'las 24 horas';
  const partes = FRANJAS.filter((_, f) => mascara & (1 << f)).map(fr => (conHoras ? `de ${fr.nombre} (${fr.horas})` : `de ${fr.nombre}`));
  return listaConY(partes);
}

function describirCobertura(marcados, conHoras) {
  const mascaras = Array(7).fill(0);
  marcados.forEach(([d, f]) => { mascaras[d] |= 1 << f; });
  const grupos = new Map();
  mascaras.forEach((m, d) => {
    if (!m) return;
    if (!grupos.has(m)) grupos.set(m, []);
    grupos.get(m).push(d);
  });
  return [...grupos.entries()]
    .sort((a, b) => a[1][0] - b[1][0])
    .map(([m, dias]) => `${textoDias(dias)}, ${textoFranjas(m, conHoras)}`);
}

function resumenSemana(marcados) {
  const turnos = marcados.length;
  return {
    turnos,
    horas: turnos * HORAS_TURNO,
    personas: turnos ? Math.ceil(turnos / TURNOS_POR_PERSONA) : 0,
    cobertura: describirCobertura(marcados, false)
  };
}

function mensajeSemana(estado) {
  const quien = estado.quien === 'discapacidad' ? 'una persona con discapacidad' : 'un adulto mayor';
  const donde = estado.donde === 'internacion' ? 'durante una internación en hospital o clínica' : 'en su casa';
  const r = resumenSemana(estado.marcados);
  const lineas = [`Hola, Manos Cálidas. Quiero consultar por cuidado para ${quien}, ${donde}.`];
  if (!r.turnos) {
    lineas.push('Todavía no tengo definidos los horarios. ¿Me ayudan a armarlos?');
    return lineas.join('\n');
  }
  lineas.push('', 'Turnos que necesito:');
  describirCobertura(estado.marcados, true).forEach(p => lineas.push(`- ${capitalizar(p)}`));
  lineas.push('', `Son ${r.turnos} ${r.turnos === 1 ? 'turno' : 'turnos'} de ${HORAS_TURNO} h: ${r.horas} horas por semana.`, '¿Tienen disponibilidad?');
  return lineas.join('\n');
}

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
  const desktopMq = window.matchMedia('(min-width: 961px)');
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

function initWspLinks() {
  document.querySelectorAll('a[data-wsp-msg]').forEach(a => { a.href = waHref(a.dataset.wspMsg); });
}

function initPlanner() {
  const card = document.querySelector('[data-planner]');
  const resumen = document.querySelector('[data-resumen]');
  if (!card || !resumen) return;
  const celdas = [...card.querySelectorAll('.celda input')];
  const salida = k => resumen.querySelector(`[data-r="${k}"]`);
  const boton = document.getElementById('semanaWsp');
  const leer = () => ({
    quien: card.querySelector('input[name="quien"]:checked')?.value || 'mayor',
    donde: card.querySelector('input[name="donde"]:checked')?.value || 'casa',
    marcados: celdas.filter(i => i.checked).map(i => [Number(i.dataset.d), Number(i.dataset.f)])
  });
  const pintar = () => {
    celdas.forEach(i => i.closest('.celda')?.classList.toggle('is-on', i.checked));
    const estado = leer();
    const r = resumenSemana(estado.marcados);
    salida('horas').textContent = r.horas.toLocaleString('es-AR');
    salida('turnos').textContent = r.turnos;
    salida('personas').textContent = r.personas || '—';
    salida('cobertura').textContent = r.turnos ? capitalizar(r.cobertura.join(' · ')) : 'Tocá los casilleros de la planilla para marcar los turnos.';
    if (boton) boton.href = waHref(mensajeSemana(estado));
  };
  const aplicar = nombre => {
    const elegidos = new Set((PRESETS[nombre] || []).map(([d, f]) => `${d}-${f}`));
    celdas.forEach(i => { i.checked = elegidos.has(`${i.dataset.d}-${i.dataset.f}`); });
    pintar();
  };
  card.addEventListener('change', pintar);
  card.querySelectorAll('.atajo').forEach(b => b.addEventListener('click', () => {
    aplicar(b.dataset.preset);
    if (b.dataset.preset === 'limpiar') showToast('Planilla en blanco: marcá los turnos que necesitás.');
  }));
  document.querySelectorAll('a[data-preset]').forEach(a => a.addEventListener('click', () => {
    aplicar(a.dataset.preset);
    showToast(`Cargamos «${NOMBRES_PRESET[a.dataset.preset] || 'tu semana'}» en la planilla. Ajustala a tu semana.`);
  }));
  pintar();
}

function initMomento() {
  const sec = document.querySelector('.temperatura');
  if (!sec) return;
  const escena = sec.querySelector('.temperatura__escena');
  const kNum = sec.querySelector('[data-k]');
  const FRIO = [15, 26, 45];
  const CALIDO = [42, 28, 20];
  const K_FRIO = [122, 165, 255];
  const K_CALIDO = [245, 180, 94];
  const mezcla = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
  const OFF = () => parseFloat(window.getComputedStyle(document.documentElement).getPropertyValue('--gw-modelos-h')) || 0;
  let ultimo = -1;
  const pintar = p => {
    if (Math.abs(p - ultimo) < 0.0005) return;
    ultimo = p;
    const e = p * p * (3 - 2 * p);
    sec.style.setProperty('--p', p.toFixed(4));
    sec.style.setProperty('--e', e.toFixed(4));
    sec.style.setProperty('--temp-bg', `rgb(${mezcla(FRIO, CALIDO, e).join(', ')})`);
    sec.style.setProperty('--k-color', `rgb(${mezcla(K_FRIO, K_CALIDO, e).join(', ')})`);
    if (kNum) kNum.textContent = (Math.round((6500 - 3800 * p) / 100) * 100).toLocaleString('es-AR');
    sec.classList.toggle('is-calido', p >= 0.5);
  };
  if (reduceMotion) {
    sec.classList.add('is-static');
    pintar(1);
    return;
  }
  let frame = 0;
  const calcular = () => {
    frame = 0;
    const r = sec.getBoundingClientRect();
    const recorrido = sec.offsetHeight - (escena ? escena.offsetHeight : window.innerHeight - OFF());
    const p = recorrido > 0 ? Math.min(1, Math.max(0, (OFF() - r.top) / recorrido)) : 1;
    pintar(p);
  };
  const pedir = () => { if (!frame) frame = requestAnimationFrame(calcular); };
  window.addEventListener('scroll', pedir, { passive: true });
  window.addEventListener('resize', pedir, { passive: true });
  window.addEventListener('load', calcular);
  calcular();
}

function initMapa() {
  const el = document.getElementById('mapa');
  if (!el || typeof L === 'undefined') return;
  const sede = [-34.6524632, -58.7853081];
  const mapa = L.map(el, { scrollWheelZoom: false, dragging: !L.Browser.mobile, tap: false }).setView(sede, 15);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap', maxZoom: 19 }).addTo(mapa);
  const icono = L.divIcon({ className: 'pin-wrap', html: '<span class="pin-mapa"></span>', iconSize: [40, 40], iconAnchor: [20, 44] });
  L.marker(sede, { icon: icono, title: 'Sede de Manos Cálidas', alt: 'Sede de Manos Cálidas' })
    .addTo(mapa)
    .bindPopup('<strong>Sede de Manos Cálidas</strong><br>Chacabuco 37, oficina 16, Moreno');
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('[data-parallax]').forEach(fig => {
    const img = fig.querySelector('img');
    if (!img) return;
    gsap.fromTo(img, { yPercent: -4, scale: 1.1 }, {
      yPercent: 4,
      scale: 1.1,
      ease: 'none',
      scrollTrigger: { trigger: fig, start: 'top bottom', end: 'bottom top', scrub: true }
    });
  });
}

function initFaq() {
  document.querySelectorAll('.faq__item').forEach(d => d.addEventListener('toggle', () => {
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  }));
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

initModelBarScroll();
initNav();
initWspLinks();
initWspFloat();
initPlanner();
initMomento();
initMapa();
initParallax();
initFaq();
initReveals();
