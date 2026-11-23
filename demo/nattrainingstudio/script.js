const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const $ = (sel, root = document) => root.querySelector(sel);
const pad2 = n => String(n).padStart(2, '0');

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = (e.key || '').toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

let refrescoPend = 0;
function refrescar() {
  if (typeof ScrollTrigger === 'undefined') return;
  clearTimeout(refrescoPend);
  refrescoPend = setTimeout(() => ScrollTrigger.refresh(), 120);
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

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; const header = document.querySelector('.site-header'); (header || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 1100px)');
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

function initIndice() {
  const lista = document.querySelector('[data-indice]');
  if (!lista) return;
  const fotos = document.querySelectorAll('[data-indice-foto] img');
  const items = lista.querySelectorAll('.indice__item');
  items.forEach((item, i) => {
    const btn = item.querySelector('.indice__btn');
    btn?.addEventListener('click', () => {
      items.forEach((o, j) => {
        const abierto = j === i;
        o.classList.toggle('abierto', abierto);
        o.querySelector('.indice__btn')?.setAttribute('aria-expanded', String(abierto));
      });
      fotos.forEach((f, j) => f.classList.toggle('activa', j === i));
      refrescar();
    });
  });
}

function initFaq() {
  document.querySelectorAll('.faq details').forEach(d => d.addEventListener('toggle', refrescar));
}

/* ---------- Panel de rutinas ---------- */
const IC = {
  mas: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  menos: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14"/></svg>',
  arriba: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 15 6-6 6 6"/></svg>',
  abajo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>',
  borrar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12M9 7V4h6v3"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5L20 7"/></svg>',
  subir: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/><path d="M7 9l5-5 5 5"/><path d="M12 4v12"/></svg>',
  alerta: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16h.01"/></svg>',
};

const GRUPOS = ['Piernas', 'Glúteos e isquios', 'Espalda', 'Pecho', 'Hombros', 'Brazos', 'Abdomen'];
const DESCANSOS = [30, 45, 60, 75, 90, 120, 150, 180];
const fmtD = d => (d < 60 ? `${d} s` : d % 60 ? `${Math.floor(d / 60)}:${pad2(d % 60)} min` : `${d / 60} min`);
const fmtCorto = d => (d < 60 ? `${d} s` : `${Math.floor(d / 60)}:${pad2(d % 60)}`);
const ETAPAS_8 = ['Adaptación y aprendizaje técnico', 'Adaptación y aprendizaje técnico', 'Consolidación de la técnica', 'Consolidación de la técnica', 'Desarrollo e intensificación', 'Desarrollo e intensificación', 'Estímulo y progresión', 'Evaluación y ajuste'];
const GUIA = [
  ['Desayuno', 'Avena con yogur, fruta y frutos secos.'],
  ['Almuerzo', 'Arroz, pollo y verduras salteadas.'],
  ['Antes de entrenar', 'Una banana y un puñado de frutos secos.'],
  ['Merienda', 'Tostadas integrales con huevo y una fruta.'],
  ['Cena', 'Carne magra o pescado, batata y ensalada.'],
  ['Hidratación', 'Entre 2,5 y 3 litros de agua por día.'],
];

const BIB_BASE = [
  { id: 'sentadilla-libre', n: 'Sentadilla libre', g: 'Piernas', img: 'ej-sentadilla-libre.webp', tec: 'Bajar controlado hasta la paralela, con las rodillas en la línea de la punta del pie.' },
  { id: 'sentadilla-goblet', n: 'Sentadilla goblet', g: 'Piernas', img: 'ej-sentadilla-goblet.webp', tec: 'Mancuerna pegada al pecho y torso erguido en todo el recorrido.' },
  { id: 'prensa', n: 'Prensa 45°', g: 'Piernas', img: 'ej-prensa.webp', tec: 'Sin despegar la cadera del respaldo; no bloquear las rodillas arriba.' },
  { id: 'estocada', n: 'Estocada con mancuernas', g: 'Piernas', img: 'ej-estocada.webp', tec: 'Paso largo, rodilla de atrás cerca del piso y torso estable.' },
  { id: 'talones', n: 'Elevación de talones de pie', g: 'Piernas', img: 'ej-elevacion-talones.webp', tec: 'Pausa de un segundo arriba y bajada completa.' },
  { id: 'peso-muerto-rumano', n: 'Peso muerto rumano', g: 'Glúteos e isquios', img: 'ej-peso-muerto-rumano.webp', tec: 'Cadera atrás con la espalda neutra; bajar hasta sentir los isquios.' },
  { id: 'curl-femoral', n: 'Curl femoral', g: 'Glúteos e isquios', img: 'ej-curl-femoral.webp', tec: 'Subida firme y bajada en tres segundos.' },
  { id: 'puente-gluteos', n: 'Puente de glúteos con banda', g: 'Glúteos e isquios', img: 'ej-puente-gluteos.webp', tec: 'Empujar con los talones y apretar glúteos arriba, sin arquear la zona lumbar.' },
  { id: 'jalon', n: 'Jalón al pecho, agarre amplio', g: 'Espalda', img: 'ej-jalon-al-pecho.webp', tec: 'Iniciar con depresión escapular; evitar balanceos.' },
  { id: 'remo-sentado', n: 'Remo sentado, agarre neutro', g: 'Espalda', img: 'ej-remo-sentado.webp', tec: 'Retracción escapular controlada, sin inclinar el torso.' },
  { id: 'pullover-polea', n: 'Pullover en polea alta', g: 'Espalda', img: '', tec: 'Enfocar el movimiento en dorsales; codos ligeramente flexionados.' },
  { id: 'remo-unilateral', n: 'Remo unilateral con mancuerna', g: 'Espalda', img: 'ej-remo-unilateral.webp', tec: 'Llevar el codo hacia la cadera, sin rotar el torso.' },
  { id: 'face-pull', n: 'Face pull con banda', g: 'Hombros', img: 'ej-face-pull-banda.webp', tec: 'Tirar hacia la cara separando las manos, con los codos altos.' },
  { id: 'elevacion-lateral', n: 'Elevación lateral con mancuernas', g: 'Hombros', img: 'ej-elevacion-lateral.webp', tec: 'Última serie descendente; sin impulso.' },
  { id: 'press-militar', n: 'Press militar con mancuernas', g: 'Hombros', img: 'ej-press-militar.webp', tec: 'Core firme y recorrido completo, sin arquear la espalda.' },
  { id: 'press-banca', n: 'Press de banca con barra', g: 'Pecho', img: 'ej-press-banca.webp', tec: 'Escápulas juntas y apoyadas; la barra baja a la línea del pecho.' },
  { id: 'press-inclinado', n: 'Press inclinado con mancuernas', g: 'Pecho', img: 'ej-press-inclinado.webp', tec: 'Banco a 30°; bajar controlado hasta sentir el estiramiento.' },
  { id: 'curl-barra', n: 'Curl de bíceps con barra', g: 'Brazos', img: 'ej-curl-barra.webp', tec: 'Última serie rest-pause, solo con técnica estable.' },
  { id: 'curl-martillo', n: 'Curl martillo', g: 'Brazos', img: 'ej-curl-martillo.webp', tec: 'Codos pegados al cuerpo y agarre neutro.' },
  { id: 'triceps-polea', n: 'Extensión de tríceps en polea', g: 'Brazos', img: 'ej-triceps-polea.webp', tec: 'Codos fijos al costado y extensión completa abajo.' },
  { id: 'crunch-polea', n: 'Crunch en polea', g: 'Abdomen', img: '', tec: 'Flexionar el tronco; no tirar con los brazos.' },
  { id: 'plancha', n: 'Plancha', g: 'Abdomen', img: 'ej-plancha.webp', tec: 'Cuerpo en línea recta, glúteos y abdomen firmes.' },
];
const tecDe = id => BIB_BASE.find(x => x.id === id)?.tec ?? '';
const mk = (e, s, r, d, t) => ({ e, s, r, d, t: t ?? tecDe(e) });

function alumnosEjemplo() {
  return [
    {
      id: 'ramiro', n: 'Ramiro C.', plan: 'Men’s Physique', sem: 8, act: 3, guia: true,
      dias: [
        { t: 'Tren inferior', f: 'Cuádriceps, glúteos y gemelos. Desarrollo del cuádriceps y equilibrio del tren inferior.', p: 'Entrada en calor de 10 minutos con movilidad de cadera y tobillo.', items: [mk('sentadilla-libre', 4, '10–12', 120), mk('prensa', 4, '12–15', 90), mk('estocada', 3, '10 por pierna', 90), mk('sentadilla-goblet', 3, '15', 60), mk('talones', 4, '15–20', 45)] },
        { t: 'Espalda y hombros', f: 'Amplitud dorsal, deltoides laterales, bíceps y abdomen. Construcción de la silueta en V.', p: 'Priorizar amplitud dorsal y control escapular. En rest-pause: una pausa breve y una extensión corta de la serie, sin perder la ejecución.', items: [mk('jalon', 4, '12–15', 90), mk('remo-sentado', 4, '12–15', 90), mk('pullover-polea', 4, '12–15', 75), mk('elevacion-lateral', 4, '12–15', 60), mk('curl-barra', 4, '12–15', 75), mk('crunch-polea', 4, '15', 60)] },
        { t: 'Cadena posterior', f: 'Isquiosurales, glúteos y gemelos. Desarrollo de la musculatura posterior de las piernas.', p: '', items: [mk('peso-muerto-rumano', 4, '8–10', 120), mk('curl-femoral', 4, '12', 90), mk('puente-gluteos', 3, '15', 60), mk('talones', 4, '15–20', 45)] },
        { t: 'Pecho y hombros', f: 'Desarrollo integral del pectoral, deltoides y tríceps. Mejora del volumen y la proporción del tren superior.', p: '', items: [mk('press-banca', 4, '8–10', 120), mk('press-inclinado', 4, '10–12', 90), mk('press-militar', 3, '10', 90), mk('elevacion-lateral', 4, '12–15', 60), mk('triceps-polea', 3, '12', 60)] },
        { t: 'Espalda y especialización', f: 'Espalda media, relieve dorsal, deltoides posteriores, hombros, brazos y abdomen.', p: '', items: [mk('remo-unilateral', 4, '10–12', 90), mk('face-pull', 3, '15', 60), mk('curl-martillo', 3, '12', 60), mk('plancha', 3, '40 s', 45)] },
      ],
    },
    {
      id: 'sofia', n: 'Sofía M.', plan: 'Fuerza y glúteos', sem: 6, act: 2, guia: true,
      dias: [
        { t: 'Glúteos y cuádriceps', f: 'Base de fuerza en el tren inferior.', p: '', items: [mk('sentadilla-goblet', 4, '12', 75), mk('puente-gluteos', 4, '15', 60), mk('estocada', 3, '10 por pierna', 75)] },
        { t: 'Tren superior', f: 'Espalda y hombros, con foco en la postura.', p: '', items: [mk('remo-unilateral', 3, '12', 75), mk('face-pull', 3, '15', 60), mk('press-militar', 3, '10', 75)] },
        { t: 'Isquios y core', f: 'Cadena posterior y estabilidad del tronco.', p: '', items: [mk('peso-muerto-rumano', 4, '10', 90), mk('curl-femoral', 3, '12', 75), mk('plancha', 3, '30 s', 45)] },
      ],
    },
    { id: 'valentina', n: 'Valentina P.', plan: 'Primer plan', sem: 8, act: 1, guia: false, ses: 3, dias: [] },
  ];
}

const PANEL_KEY = 'nat_panel_v1';
const clonar = o => JSON.parse(JSON.stringify(o));
let panel = null;
let sel = { alumno: 'ramiro', dia: 1 };
let hechos = {};
let abiertos = {};
let celuTab = 'rutina';
let fotoPara = '';
let avisoEspacio = false;

function cargarPanel() {
  try {
    const p = JSON.parse(localStorage.getItem(PANEL_KEY));
    if (p && Array.isArray(p.alumnos) && p.alumnos.length && p.fotos && Array.isArray(p.extra)) return p;
  } catch (e) { /* sin datos guardados */ }
  return { alumnos: alumnosEjemplo(), extra: [], fotos: {} };
}
function guardarPanel() {
  try { localStorage.setItem(PANEL_KEY, JSON.stringify(panel)); }
  catch (e) {
    if (!avisoEspacio) { avisoEspacio = true; showToast('El navegador no tiene más lugar para fotos: se ven ahora, pero no quedan guardadas.'); }
  }
}
const biblioteca = () => BIB_BASE.concat(panel.extra);
const ej = id => biblioteca().find(x => x.id === id) || { id, n: 'Ejercicio', g: '', img: '', tec: '' };
const imgDe = ex => panel.fotos[ex.id] || (ex.img ? `images/${ex.img}` : '');
const alumno = () => panel.alumnos.find(a => a.id === sel.alumno) || panel.alumnos[0];
const diaAct = () => alumno().dias[sel.dia];
const pila = al => al.n.split(' ')[0];
const norm = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

function initPanel() {
  const app = document.getElementById('app');
  if (!app) return;
  panel = cargarPanel();
  const q = new URLSearchParams(location.search).get('alumno');
  if (q && panel.alumnos.some(a => a.id === q)) { sel.alumno = q; app.dataset.vista = 'alumno'; }
  if (!alumno().dias[sel.dia]) sel.dia = 0;

  const selAl = $('#appAlumno');
  const editor = $('#appDia');
  const dias = $('#appDias');
  const celu = $('#celuPantalla');

  const renderAlumnos = () => {
    selAl.innerHTML = panel.alumnos.map(a => `<option value="${esc(a.id)}"${a.id === sel.alumno ? ' selected' : ''}>${esc(a.n)} · ${esc(a.plan)}</option>`).join('');
  };
  const renderPlan = () => {
    const al = alumno();
    const barras = Array.from({ length: al.sem }, (_, i) => `<i class="${i < al.act ? 'on' : ''}"></i>`).join('');
    $('#appPlan').innerHTML = `<span><b>${esc(al.plan)}</b></span><span>${al.dias.length || al.ses || 0} sesiones por semana</span><span>${al.sem} semanas</span><span class="semana-bar" aria-hidden="true">${barras}</span><span>Semana ${al.act} de ${al.sem}</span>`;
    $('#appCompartirTxt').textContent = `Compartir con ${pila(al)}`;
    $('#celuTitulo').textContent = `Así lo ve ${pila(al)} en el celu`;
  };
  const renderDias = () => {
    const al = alumno();
    dias.innerHTML = al.dias.map((d, i) => `<button type="button" class="dia-tab" data-dia="${i}" aria-pressed="${i === sel.dia}"><b>Día ${pad2(i + 1)}</b><span>${esc(d.t || 'Sin título')}</span></button>`).join('');
    dias.hidden = !al.dias.length;
  };
  const filaHTML = (it, i, n) => {
    const ex = ej(it.e);
    const src = imgDe(ex);
    const foto = src
      ? `<button type="button" class="fila__foto" data-acc="foto" aria-label="Cambiar la foto de ${esc(ex.n)}"><img src="${esc(src)}" alt="" width="480" height="480"></button>`
      : `<button type="button" class="fila__foto sin" data-acc="foto" aria-label="Subir la foto o el GIF de ${esc(ex.n)}">${IC.subir}<span>Sumar foto</span></button>`;
    const opts = DESCANSOS.map(d => `<option value="${d}"${d === Number(it.d) ? ' selected' : ''}>${fmtCorto(d)}</option>`).join('');
    return `<li class="fila" data-i="${i}">${foto}
      <div class="fila__info"><p class="fila__nombre">${esc(ex.n)}</p><input class="fila__tec" type="text" data-campo="t" value="${esc(it.t)}" placeholder="Sumá una indicación técnica" aria-label="Indicación técnica de ${esc(ex.n)}"></div>
      <div class="fila__num">
        <div class="paso"><span>Series</span><div class="paso__ctrl"><button type="button" data-acc="menos" aria-label="Una serie menos">${IC.menos}</button><output>${it.s}</output><button type="button" data-acc="mas" aria-label="Una serie más">${IC.mas}</button></div></div>
        <label class="mini">Reps<input type="text" data-campo="r" value="${esc(it.r)}" autocomplete="off"></label>
        <label class="mini">Descanso<select data-campo="d">${opts}</select></label>
      </div>
      <div class="fila__acc"><button type="button" class="icono-btn" data-acc="arriba" aria-label="Subir ${esc(ex.n)}"${i === 0 ? ' disabled' : ''}>${IC.arriba}</button><button type="button" class="icono-btn" data-acc="abajo" aria-label="Bajar ${esc(ex.n)}"${i === n - 1 ? ' disabled' : ''}>${IC.abajo}</button><button type="button" class="icono-btn" data-acc="quitar" aria-label="Quitar ${esc(ex.n)}">${IC.borrar}</button></div>
    </li>`;
  };
  const renderEditor = nueva => {
    const al = alumno();
    if (!al.dias.length) {
      const otros = panel.alumnos.filter(a => a.id !== al.id && a.dias.length);
      editor.innerHTML = `<div class="vacio"><p class="folio">Sin rutina todavía</p><p>${esc(pila(al))} todavía no tiene rutina. Copiá una que ya armaste y ajustala, o empezá de cero con ${al.ses || 3} días.</p><div class="vacio__btns">${otros[0] ? `<button type="button" class="app-btn app-btn--fuerte" data-vacio="copiar" data-de="${esc(otros[0].id)}">Copiar la de ${esc(pila(otros[0]))}</button>` : ''}<button type="button" class="app-btn" data-vacio="cero">Empezar de cero</button></div></div>`;
      return;
    }
    const d = diaAct();
    const sinFoto = d.items.filter(it => !imgDe(ej(it.e))).length;
    editor.innerHTML = `<div class="app__dia-cab"><p class="folio">Día ${pad2(sel.dia + 1)}</p><span class="app__cuenta">${d.items.length} ${d.items.length === 1 ? 'ejercicio' : 'ejercicios'}</span><input class="titulo-dia" type="text" data-dia-campo="t" value="${esc(d.t)}" aria-label="Título del día" placeholder="Ej.: Espalda y hombros"><p class="app__dia-foco">${esc(d.f || 'Sumá el enfoque de la sesión desde el título y las pautas.')}</p></div>
      <ol class="lista">${d.items.map((it, i) => filaHTML(it, i, d.items.length)).join('')}</ol>
      ${sinFoto ? `<p class="aviso-fotos">${IC.alerta}${sinFoto === 1 ? 'Un ejercicio no tiene foto' : `${sinFoto} ejercicios no tienen foto`}: subila una vez y queda para todas las rutinas.</p>` : ''}
      <button type="button" class="app__agregar" id="appAgregar">${IC.mas}Agregar ejercicio de la biblioteca</button>
      <label class="app__pautas">Pautas de la sesión<textarea data-dia-campo="p" placeholder="Ej.: Priorizar el control en la bajada">${esc(d.p)}</textarea></label>`;
    if (nueva !== undefined) editor.querySelector(`.fila[data-i="${nueva}"]`)?.classList.add('nueva');
  };
  const etapa = al => (al.sem === 8 ? ETAPAS_8[Math.min(al.act, 8) - 1] : '');
  const renderCelu = flash => {
    const al = alumno();
    const prog = Array.from({ length: al.sem }, (_, i) => `<i class="${i + 1 < al.act ? 'on' : i + 1 === al.act ? 'hoy' : ''}"></i>`).join('');
    let cuerpo = '';
    let chips = '';
    if (celuTab === 'guia') {
      cuerpo = al.guia
        ? `<div class="guia"><div class="guia__foto"><img src="images/plato-guia.webp" alt="Plato de la guía: arroz, verduras asadas, rúcula y huevo" width="1024" height="1024"></div><h4>Guía de alimentación</h4><p>Acompaña tu bloque de ${esc(al.plan)}.</p><ul>${GUIA.map(([m, t]) => `<li><b>${esc(m)}</b>${esc(t)}</li>`).join('')}</ul><p class="guia__nota">Guía de ejemplo: la de cada alumno la carga Nat.</p></div>`
        : `<p class="celu__vacio">Nat está preparando tu guía de alimentación.</p>`;
    } else if (!al.dias.length) {
      cuerpo = `<p class="celu__vacio">Tu rutina está en preparación. Te avisamos cuando esté lista.</p>`;
    } else {
      const d = diaAct();
      chips = `<div class="celu__dias" role="group" aria-label="Día">${al.dias.map((_, i) => `<button type="button" data-cdia="${i}" aria-pressed="${i === sel.dia}">Día ${i + 1}</button>`).join('')}</div>`;
      const hechosDia = d.items.filter((_, i) => hechos[`${al.id}-${sel.dia}-${i}`]).length;
      cuerpo = `<p class="celu__dia-tit">${esc(d.t || `Día ${sel.dia + 1}`)}</p><p class="celu__dia-foco">${esc(d.f || '')}</p>` +
        (d.items.length ? d.items.map((it, i) => {
          const ex = ej(it.e);
          const src = imgDe(ex);
          const k = `${al.id}-${sel.dia}-${i}`;
          const ab = abiertos[k];
          return `<article class="cej${hechos[k] ? ' hecho' : ''}${ab ? ' abierto' : ''}${flash === i ? ' cambio' : ''}" data-i="${i}">
            <div class="cej__fila"><button type="button" class="cej__abrir" data-cacc="abrir" aria-expanded="${ab ? 'true' : 'false'}">${src ? `<img src="${esc(src)}" alt="" width="480" height="480">` : `<span class="cej__sin" aria-hidden="true">${esc(ex.n.charAt(0))}</span>`}<span><span class="cej__n">${esc(ex.n)}</span><span class="cej__d">${it.s} × ${esc(it.r)} · ${fmtD(Number(it.d))}</span></span></button><button type="button" class="cej__check" data-cacc="hecho" aria-pressed="${hechos[k] ? 'true' : 'false'}" aria-label="Marcar ${esc(ex.n)} como hecho"><span>${IC.check}</span></button></div>
            <div class="cej__mas"><div>${src ? `<img src="${esc(src)}" alt="${esc(ex.n)}" width="480" height="480">` : ''}<p class="cej__tec"><b>Indicación técnica</b>${esc(it.t || 'Sin indicación')}</p></div></div>
          </article>`;
        }).join('') + `<p class="celu__hechos">${hechosDia === d.items.length ? '¡Día completo!' : `${hechosDia} de ${d.items.length} hechos`}</p>` : `<p class="celu__vacio">Este día todavía no tiene ejercicios.</p>`) +
        (d.p ? `<p class="cej__tec"><b>Pautas de la sesión</b>${esc(d.p)}</p>` : '');
    }
    const prevScroll = celu.querySelector('.celu__cuerpo')?.scrollTop || 0;
    celu.innerHTML = `<div class="celu__top"><p class="celu__hola">Hola, ${esc(pila(al))}</p><p class="celu__etapa">${al.dias.length ? `Semana ${al.act} de ${al.sem}${etapa(al) ? ` · ${esc(etapa(al))}` : ''}` : 'Tu plan arranca pronto'}</p><div class="celu__prog" aria-hidden="true">${prog}</div></div>
      <div class="celu__tabs" role="group" aria-label="Sección"><button type="button" data-ctab="rutina" aria-pressed="${celuTab === 'rutina'}">Rutina</button><button type="button" data-ctab="guia" aria-pressed="${celuTab === 'guia'}">Alimentación</button></div>
      ${chips}<div class="celu__cuerpo">${cuerpo}</div>`;
    const c = celu.querySelector('.celu__cuerpo');
    if (c) {
      if (flash !== undefined && flash !== null) {
        const card = c.querySelector(`.cej[data-i="${flash}"]`);
        if (card) c.scrollTop = Math.max(0, card.offsetTop - 70);
        setTimeout(() => card?.classList.remove('cambio'), 900);
      } else c.scrollTop = prevScroll;
    }
  };
  const todo = (flash, nueva) => { renderAlumnos(); renderPlan(); renderDias(); renderEditor(nueva); renderCelu(flash); refrescar(); };

  let celuTimer = 0;
  const celuLuego = i => { clearTimeout(celuTimer); celuTimer = setTimeout(() => renderCelu(i), 140); };
  const filaDe = el => Number(el.closest('.fila')?.dataset.i);

  selAl.addEventListener('change', () => {
    sel.alumno = selAl.value; sel.dia = 0; celuTab = 'rutina';
    todo();
  });
  dias.addEventListener('click', e => {
    const b = e.target.closest('[data-dia]');
    if (!b) return;
    sel.dia = Number(b.dataset.dia);
    renderDias(); renderEditor(); renderCelu(); refrescar();
  });
  editor.addEventListener('click', e => {
    const v = e.target.closest('[data-vacio]');
    if (v) {
      const al = alumno();
      if (v.dataset.vacio === 'copiar') {
        const de = panel.alumnos.find(a => a.id === v.dataset.de);
        if (de) { al.dias = clonar(de.dias); showToast(`Copiaste la rutina de ${pila(de)}. Ajustala al nivel de ${pila(al)}.`); }
      } else {
        al.dias = Array.from({ length: al.ses || 3 }, (_, i) => ({ t: `Día ${i + 1}`, f: '', p: '', items: [] }));
        showToast('Listo: tenés los días armados. Sumá ejercicios desde la biblioteca.');
      }
      sel.dia = 0; guardarPanel(); todo();
      return;
    }
    if (e.target.closest('#appAgregar')) { abrirBib(); return; }
    const b = e.target.closest('[data-acc]');
    if (!b) return;
    const d = diaAct();
    const i = filaDe(b);
    const it = d?.items[i];
    if (!it) return;
    const acc = b.dataset.acc;
    if (acc === 'mas' || acc === 'menos') {
      it.s = Math.max(1, Math.min(10, it.s + (acc === 'mas' ? 1 : -1)));
      b.closest('.paso__ctrl').querySelector('output').textContent = it.s;
      guardarPanel(); renderCelu(i);
    } else if (acc === 'arriba' || acc === 'abajo') {
      const j = acc === 'arriba' ? i - 1 : i + 1;
      if (j < 0 || j >= d.items.length) return;
      [d.items[i], d.items[j]] = [d.items[j], d.items[i]];
      guardarPanel(); renderEditor(); renderCelu(j);
      editor.querySelector(`.fila[data-i="${j}"] [data-acc="${acc}"]:not([disabled])`)?.focus() || editor.querySelector(`.fila[data-i="${j}"] .fila__tec`)?.focus();
    } else if (acc === 'quitar') {
      const ex = ej(it.e);
      d.items.splice(i, 1);
      guardarPanel(); renderDias(); renderEditor(); renderCelu(); refrescar();
      showToast(`Quitaste «${ex.n}» del Día ${pad2(sel.dia + 1)}.`);
    } else if (acc === 'foto') {
      fotoPara = it.e;
      $('#filaArchivo').value = '';
      $('#filaArchivo').click();
    }
  });
  editor.addEventListener('input', e => {
    const d = diaAct();
    if (!d) return;
    const campo = e.target.dataset.campo;
    const dc = e.target.dataset.diaCampo;
    if (campo) {
      const i = filaDe(e.target);
      if (!d.items[i]) return;
      d.items[i][campo] = campo === 'd' ? Number(e.target.value) : e.target.value;
      guardarPanel(); celuLuego(i);
    } else if (dc) {
      d[dc] = e.target.value;
      guardarPanel();
      if (dc === 't') { const tab = dias.querySelector(`[data-dia="${sel.dia}"] span`); if (tab) tab.textContent = e.target.value || 'Sin título'; }
      celuLuego();
    }
  });
  editor.addEventListener('change', e => {
    if (e.target.matches('select[data-campo]')) {
      const d = diaAct(); const i = filaDe(e.target);
      if (!d?.items[i]) return;
      d.items[i].d = Number(e.target.value);
      guardarPanel(); renderCelu(i);
    }
  });

  celu.addEventListener('click', e => {
    const t = e.target.closest('[data-ctab]');
    if (t) { celuTab = t.dataset.ctab; renderCelu(); return; }
    const cd = e.target.closest('[data-cdia]');
    if (cd) { sel.dia = Number(cd.dataset.cdia); renderDias(); renderEditor(); renderCelu(); refrescar(); return; }
    const b = e.target.closest('[data-cacc]');
    if (!b) return;
    const card = b.closest('.cej');
    const i = Number(card.dataset.i);
    const k = `${alumno().id}-${sel.dia}-${i}`;
    if (b.dataset.cacc === 'abrir') {
      abiertos[k] = !abiertos[k];
      card.classList.toggle('abierto', abiertos[k]);
      b.setAttribute('aria-expanded', String(!!abiertos[k]));
    } else {
      hechos[k] = !hechos[k];
      card.classList.toggle('hecho', hechos[k]);
      b.setAttribute('aria-pressed', String(!!hechos[k]));
      const d = diaAct();
      const n = d.items.filter((_, j) => hechos[`${alumno().id}-${sel.dia}-${j}`]).length;
      const p = celu.querySelector('.celu__hechos');
      if (p) p.textContent = n === d.items.length ? '¡Día completo!' : `${n} de ${d.items.length} hechos`;
    }
  });

  const vEd = $('#vistaEditar');
  const vAl = $('#vistaAlumno');
  const setVista = v => {
    app.dataset.vista = v;
    vEd.setAttribute('aria-pressed', String(v === 'editar'));
    vAl.setAttribute('aria-pressed', String(v === 'alumno'));
    refrescar();
  };
  vEd.addEventListener('click', () => setVista('editar'));
  vAl.addEventListener('click', () => setVista('alumno'));
  setVista(app.dataset.vista || 'editar');

  $('#appReset').addEventListener('click', () => {
    panel = { alumnos: alumnosEjemplo(), extra: [], fotos: {} };
    sel = { alumno: 'ramiro', dia: 1 }; hechos = {}; abiertos = {}; celuTab = 'rutina';
    guardarPanel(); todo();
    showToast('Volviste a la rutina de ejemplo de Ramiro.');
  });

  /* Fotos */
  const leerFoto = file => new Promise((res, rej) => {
    if (!file || !/^image\//.test(file.type)) { rej(new Error('tipo')); return; }
    const r = new FileReader();
    r.onload = () => {
      const url = r.result;
      if (file.type === 'image/gif' && file.size < 1200000) { res(url); return; }
      const img = new Image();
      img.onload = () => {
        const s = Math.min(img.width, img.height);
        const c = document.createElement('canvas');
        c.width = 480; c.height = 480;
        c.getContext('2d').drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, 480, 480);
        res(c.toDataURL('image/jpeg', 0.82));
      };
      img.onerror = () => rej(new Error('img'));
      img.src = url;
    };
    r.onerror = () => rej(r.error);
    r.readAsDataURL(file);
  });
  $('#filaArchivo').addEventListener('change', async e => {
    const f = e.target.files?.[0];
    if (!f || !fotoPara) return;
    try {
      panel.fotos[fotoPara] = await leerFoto(f);
      guardarPanel(); renderEditor(); renderCelu();
      showToast(`Foto guardada: ya se ve en todas las rutinas con «${ej(fotoPara).n}».`);
    } catch (err) { showToast('No pudimos leer ese archivo. Probá con una foto JPG, PNG o un GIF.'); }
  });

  /* Biblioteca */
  const bibGrilla = $('#bibGrilla');
  const bibBuscar = $('#bibBuscar');
  const bibGrupo = $('#bibGrupo');
  bibGrupo.insertAdjacentHTML('beforeend', GRUPOS.map(g => `<option value="${esc(g)}">${esc(g)}</option>`).join(''));
  $('#nuevoGrupo').innerHTML = GRUPOS.map(g => `<option value="${esc(g)}">${esc(g)}</option>`).join('');
  const renderBib = () => {
    const q = norm(bibBuscar.value.trim());
    const g = bibGrupo.value;
    const enDia = new Set((diaAct()?.items || []).map(x => x.e));
    const lista = biblioteca().filter(ex => (!g || ex.g === g) && (!q || norm(ex.n).includes(q) || norm(ex.g).includes(q)));
    bibGrilla.innerHTML = lista.length ? lista.map(ex => {
      const src = imgDe(ex);
      return `<li class="bej"><div class="bej__foto">${src ? `<img src="${esc(src)}" alt="${esc(ex.n)}" width="480" height="480" loading="lazy">` : 'Sin foto todavía'}</div><div><p class="bej__n">${esc(ex.n)}</p><p class="bej__g">${esc(ex.g)}</p></div><button type="button" class="app-btn${enDia.has(ex.id) ? ' sumado' : ''}" data-add="${esc(ex.id)}">${enDia.has(ex.id) ? 'Ya está en el día' : 'Agregar'}</button></li>`;
    }).join('') : `<li class="bib__vacio">No encontramos «${esc(bibBuscar.value.trim())}». Cargalo abajo con su foto y queda en tu biblioteca.</li>`;
  };
  const abrirBib = () => {
    if (!diaAct()) return;
    $('#bibPara').textContent = `Se suman al Día ${pad2(sel.dia + 1)} de ${pila(alumno())}`;
    renderBib();
    abrirDlg('dlgBib');
  };
  bibBuscar.addEventListener('input', renderBib);
  bibGrupo.addEventListener('change', renderBib);
  bibGrilla.addEventListener('click', e => {
    const b = e.target.closest('[data-add]');
    if (!b) return;
    const d = diaAct();
    if (!d) return;
    const ex = ej(b.dataset.add);
    d.items.push(mk(ex.id, 3, '12', 60, ex.tec || ''));
    guardarPanel();
    const i = d.items.length - 1;
    renderDias(); renderEditor(i); renderCelu(i); refrescar();
    b.classList.add('sumado'); b.textContent = 'Sumado';
    showToast(`Sumaste «${ex.n}» al Día ${pad2(sel.dia + 1)}.`);
  });

  const formNuevo = $('#formNuevo');
  const nNombre = $('#nuevoNombre');
  const nArchivo = $('#nuevoArchivo');
  const nError = $('#nuevoError');
  let nuevaFoto = '';
  nArchivo.addEventListener('change', async () => {
    const f = nArchivo.files?.[0];
    if (!f) return;
    try {
      nuevaFoto = await leerFoto(f);
      $('#nuevoPrev').innerHTML = `<img src="${esc(nuevaFoto)}" alt="">`;
      $('#nuevoArchivoTxt').textContent = f.name;
    } catch (err) { nuevaFoto = ''; showToast('Ese archivo no es una imagen. Elegí una foto o un GIF.'); }
  });
  formNuevo.addEventListener('submit', e => {
    e.preventDefault();
    const nombre = nNombre.value.trim();
    if (nombre.length < 3) {
      nNombre.setAttribute('aria-invalid', 'true');
      nError.textContent = 'Poné el nombre del ejercicio (al menos 3 letras).';
      nError.hidden = false;
      nNombre.focus();
      return;
    }
    nNombre.removeAttribute('aria-invalid'); nError.hidden = true;
    const btn = formNuevo.querySelector('button[type="submit"]');
    btn.disabled = true; btn.textContent = 'Guardando…';
    setTimeout(() => {
      const id = `x-${Date.now()}`;
      panel.extra.push({ id, n: nombre, g: $('#nuevoGrupo').value, img: '', tec: $('#nuevoTec').value.trim() });
      if (nuevaFoto) panel.fotos[id] = nuevaFoto;
      guardarPanel();
      formNuevo.reset(); nuevaFoto = '';
      $('#nuevoPrev').innerHTML = IC.subir;
      $('#nuevoArchivoTxt').textContent = 'Elegí una foto o un GIF desde el celu o la compu';
      btn.disabled = false; btn.textContent = 'Guardar en la biblioteca';
      bibBuscar.value = ''; bibGrupo.value = '';
      renderBib();
      bibGrilla.querySelector(`[data-add="${id}"]`)?.closest('.bej')?.scrollIntoView({ block: 'nearest' });
      showToast(`«${nombre}» quedó en tu biblioteca. Ya lo podés sumar a cualquier rutina.`);
    }, 500);
  });

  /* Duplicar */
  const dupPara = $('#dupPara');
  let dupModo = 'a';
  $('#appDuplicar').addEventListener('click', () => {
    const al = alumno();
    const otros = panel.alumnos.filter(a => a.id !== al.id);
    if (al.dias.length) {
      dupModo = 'a';
      $('#dupTitulo').textContent = `Duplicar la rutina de ${pila(al)}`;
      $('#dupPara').previousElementSibling.textContent = 'Copiarla para';
      dupPara.innerHTML = otros.map(a => `<option value="${esc(a.id)}">${esc(a.n)}${a.dias.length ? ' (reemplaza la suya)' : ''}</option>`).join('');
    } else {
      const con = otros.filter(a => a.dias.length);
      if (!con.length) { showToast('Todavía no hay rutinas para copiar.'); return; }
      dupModo = 'de';
      $('#dupTitulo').textContent = `Traer una rutina para ${pila(al)}`;
      $('#dupPara').previousElementSibling.textContent = 'Copiar la de';
      dupPara.innerHTML = con.map(a => `<option value="${esc(a.id)}">${esc(a.n)} · ${esc(a.plan)}</option>`).join('');
    }
    abrirDlg('dlgDup');
  });
  $('#dupOk').addEventListener('click', () => {
    const al = alumno();
    const otro = panel.alumnos.find(a => a.id === dupPara.value);
    if (!otro) return;
    if (dupModo === 'a') {
      otro.dias = clonar(al.dias);
      otro.plan = al.plan; otro.sem = al.sem;
      sel.alumno = otro.id;
      showToast(`Rutina duplicada para ${pila(otro)}. Ajustala a su nivel.`);
    } else {
      al.dias = clonar(otro.dias);
      showToast(`Copiaste la rutina de ${pila(otro)} para ${pila(al)}.`);
    }
    sel.dia = 0;
    guardarPanel(); cerrarDlg(); todo();
  });

  /* Compartir y PDF */
  const linkDe = al => `${location.origin === 'null' ? '' : location.origin}${location.pathname}?alumno=${encodeURIComponent(al.id)}#editor`;
  $('#appCompartir').addEventListener('click', () => {
    const al = alumno();
    if (!al.dias.length) { showToast(`Primero armá la rutina de ${pila(al)}.`); return; }
    const total = al.dias.reduce((s, d) => s + d.items.length, 0);
    const sinFoto = new Set(al.dias.flatMap(d => d.items.filter(it => !imgDe(ej(it.e))).map(it => it.e))).size;
    $('#compTitulo').textContent = `Rutina lista para ${pila(al)}`;
    const ok = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5L20 7"/></svg>';
    $('#compResumen').innerHTML = `<li>${ok}${al.dias.length} días y ${total} ejercicios, con series, repeticiones y descanso</li><li>${ok}Cada ejercicio con su indicación técnica${sinFoto ? ` (${sinFoto} sin foto: se ven con el nombre)` : ' y su foto'}</li><li>${ok}${al.guia ? 'Guía de alimentación incluida' : 'La guía de alimentación la sumás cuando quieras'}</li>`;
    const link = linkDe(al);
    $('#compLink').value = link;
    $('#compWsp').href = `https://wa.me/?text=${encodeURIComponent(`¡Hola ${pila(al)}! Ya tenés tu rutina de ${al.plan} en la app de NAT Training Studio: ${link}`)}`;
    abrirDlg('dlgComp');
  });
  $('#compCopiar').addEventListener('click', () => {
    const v = $('#compLink').value;
    const ok = () => showToast('Link copiado. Pegalo en el chat del alumno.');
    if (navigator.clipboard?.writeText) navigator.clipboard.writeText(v).then(ok).catch(() => { $('#compLink').select(); showToast('Seleccionamos el link: copialo con Ctrl+C.'); });
    else { $('#compLink').select(); showToast('Seleccionamos el link: copialo con Ctrl+C.'); }
  });
  const imprimir = () => {
    const al = alumno();
    if (!al.dias.length) { showToast(`Primero armá la rutina de ${pila(al)}.`); return; }
    const hoja = $('#hoja');
    hoja.innerHTML = `<div class="hoja__cab"><h2>${esc(al.plan)}</h2><p class="hoja__sub">Planificación del entrenamiento</p><p>Alumno: <b>${esc(al.n)}</b> · ${al.dias.length} sesiones semanales · ${al.sem} semanas</p></div>` +
      al.dias.map((d, i) => `<section class="hoja__dia"><h3><em>Día ${pad2(i + 1)}</em> · ${esc(d.t)}</h3><table><thead><tr><th>Foto</th><th>Ejercicio</th><th>Series</th><th>Reps</th><th>Descanso</th><th>Indicación técnica</th></tr></thead><tbody>${d.items.map(it => { const ex = ej(it.e); const src = imgDe(ex); return `<tr><td>${src ? `<img src="${esc(src)}" alt="">` : ''}</td><td><b>${esc(ex.n)}</b></td><td>${it.s}</td><td>${esc(it.r)}</td><td>${fmtD(Number(it.d))}</td><td>${esc(it.t)}</td></tr>`; }).join('')}</tbody></table>${d.p ? `<p class="hoja__pautas"><b>Pautas:</b> ${esc(d.p)}</p>` : ''}</section>`).join('') +
      `<div class="hoja__firma"><b>NATALIA AGUIRRE</b>Personal Trainer Int. · Mat. N.º 43121 · IFBB</div>`;
    const imgs = [...hoja.querySelectorAll('img')];
    Promise.all(imgs.map(im => (im.complete ? Promise.resolve() : new Promise(r => { im.onload = r; im.onerror = r; })))).then(() => {
      cerrarDlg();
      setTimeout(() => window.print(), 80);
    });
  };
  $('#appPdf').addEventListener('click', imprimir);
  $('#compPdf').addEventListener('click', imprimir);

  todo();
  if (q) window.addEventListener('load', () => document.getElementById('editor')?.scrollIntoView());
}

/* Diálogos */
let dlgAbierto = null;
let dlgVolver = null;
function abrirDlg(id) {
  const d = document.getElementById(id);
  if (!d) return;
  if (dlgAbierto && dlgAbierto !== d) cerrarDlg(true);
  dlgVolver = document.activeElement;
  d.hidden = false;
  void d.offsetWidth;
  d.classList.add('abierto');
  dlgAbierto = d;
  document.body.classList.add('no-scroll');
  const f = d.querySelector('input:not([type="file"]):not([readonly]), select') || d.querySelector('.dlg__cerrar');
  f?.focus({ preventScroll: true });
}
function cerrarDlg(sinVolver) {
  const d = dlgAbierto;
  if (!d) return;
  d.classList.remove('abierto');
  dlgAbierto = null;
  document.body.classList.remove('no-scroll');
  setTimeout(() => { if (dlgAbierto !== d) d.hidden = true; }, reduceMotion ? 0 : 320);
  if (!sinVolver) dlgVolver?.focus?.({ preventScroll: true });
}
function initDialogos() {
  document.querySelectorAll('.dlg [data-cerrar]').forEach(b => b.addEventListener('click', () => cerrarDlg()));
  document.addEventListener('keydown', e => {
    if (!dlgAbierto) return;
    if (e.key === 'Escape') { e.preventDefault(); cerrarDlg(); return; }
    if (e.key !== 'Tab') return;
    const f = [...dlgAbierto.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]):not([type="file"]), select, textarea, summary')].filter(el => el.offsetParent !== null);
    if (!f.length) return;
    const first = f[0];
    const last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
}

initDialogos();
initPanel();
initIndice();
initFaq();
initReveals();
initNav();
initWspFloat();
initModelBarScroll();
initHeroMotion();
initLeeScroll();
