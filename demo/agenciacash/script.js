document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const WSP = '5493483434905';
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const SORTEOS = [
  { nombre: 'La Previa', hora: '10:15', min: 615 },
  { nombre: 'Primera', hora: '12:00', min: 720 },
  { nombre: 'Matutina', hora: '15:00', min: 900 },
  { nombre: 'Vespertina', hora: '18:00', min: 1080 },
  { nombre: 'Nocturna', hora: '21:00', min: 1260 }
];
const DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}
if (typeof gsap === 'undefined') {
  document.querySelectorAll('[data-animate]').forEach(el => {
    el.style.opacity = 1; el.style.transform = 'none';
  });
}

function initWspLinks() {
  document.querySelectorAll('[data-wsp-msg]').forEach(a => {
    a.href = 'https://wa.me/' + WSP + '?text=' + encodeURIComponent(a.dataset.wspMsg);
  });
}

/* ---------- ficha de tablero ---------- */
function crearFlap(valor) {
  const el = document.createElement('span');
  el.className = 'flap';
  el.dataset.v = valor;
  el.setAttribute('aria-hidden', 'true');
  el.innerHTML =
    '<span class="flap-mitad flap-sup"><b></b></span>' +
    '<span class="flap-mitad flap-inf"><b></b></span>' +
    '<span class="flap-hoja flap-hoja-a"><b></b></span>' +
    '<span class="flap-hoja flap-hoja-b"><b></b></span>';
  el.querySelectorAll('b').forEach(b => { b.textContent = valor; });
  return el;
}

function setFlap(el, valor) {
  const nuevo = String(valor);
  if (el.dataset.v === nuevo) return;
  const sup = el.querySelector('.flap-sup b');
  const inf = el.querySelector('.flap-inf b');
  const hojaA = el.querySelector('.flap-hoja-a b');
  const hojaB = el.querySelector('.flap-hoja-b b');
  const viejo = el.dataset.v ?? '';
  el.dataset.v = nuevo;
  if (reduceMotion) {
    [sup, inf, hojaA, hojaB].forEach(b => { b.textContent = nuevo; });
    return;
  }
  hojaA.textContent = viejo;
  hojaB.textContent = nuevo;
  sup.textContent = nuevo;
  inf.textContent = viejo;
  el.classList.remove('girando');
  void el.offsetWidth;
  el.classList.add('girando');
  clearTimeout(el._flapT);
  el._flapT = setTimeout(() => {
    [sup, inf, hojaA, hojaB].forEach(b => { b.textContent = nuevo; });
    el.classList.remove('girando');
  }, 430);
}

function pintarGrupo(cont, texto) {
  const chars = String(texto).split('');
  while (cont.children.length < chars.length) cont.appendChild(crearFlap(chars[cont.children.length]));
  while (cont.children.length > chars.length) cont.removeChild(cont.lastChild);
  chars.forEach((c, i) => setFlap(cont.children[i], c));
}

/* ---------- reloj de los sorteos ---------- */
const FMT_AR = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'America/Argentina/Buenos_Aires',
  hourCycle: 'h23', weekday: 'short', hour: '2-digit', minute: '2-digit'
});

function ahoraAR() {
  try {
    const partes = FMT_AR.formatToParts(new Date());
    const val = t => partes.find(p => p.type === t)?.value;
    const mapa = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    const dia = mapa[val('weekday')];
    const min = parseInt(val('hour'), 10) * 60 + parseInt(val('minute'), 10);
    if (dia === undefined || Number.isNaN(min)) throw new Error('sin partes');
    return { dia, min };
  } catch {
    const d = new Date();
    return { dia: d.getDay(), min: d.getHours() * 60 + d.getMinutes() };
  }
}

function proximoSorteo() {
  const { dia, min } = ahoraAR();
  if (dia !== 0) {
    const i = SORTEOS.findIndex(s => s.min > min);
    if (i !== -1) return { i, falta: SORTEOS[i].min - min, cuando: 'hoy' };
  }
  let d = dia, saltos = 0;
  do { d = (d + 1) % 7; saltos++; } while (d === 0);
  return {
    i: 0,
    falta: (1440 - min) + (saltos - 1) * 1440 + SORTEOS[0].min,
    cuando: saltos === 1 ? 'manana' : 'proximo',
    dia: d
  };
}

function initReloj() {
  const vivo = document.getElementById('cuentaVivo');
  const fallback = document.getElementById('cuentaFallback');
  const reloj = document.getElementById('cuentaReloj');
  const nombre = document.getElementById('cuentaNombre');
  const pie = document.getElementById('cuentaPie');
  if (!vivo || !reloj) return;

  const armarGrupo = etiqueta => {
    const grupo = document.createElement('span');
    grupo.className = 'cuenta-grupo';
    const flaps = document.createElement('span');
    flaps.className = 'flaps';
    const i = document.createElement('i');
    i.textContent = etiqueta;
    grupo.append(flaps, i);
    reloj.appendChild(grupo);
    return flaps;
  };
  const flapsHoras = armarGrupo('h');
  const flapsMin = armarGrupo('m');

  const pintar = () => {
    const p = proximoSorteo();
    const s = SORTEOS[p.i];
    const h = Math.floor(p.falta / 60);
    const m = p.falta % 60;
    nombre.textContent = s.nombre;
    pintarGrupo(flapsHoras, String(h).padStart(2, '0'));
    pintarGrupo(flapsMin, String(m).padStart(2, '0'));
    if (p.cuando === 'hoy') pie.textContent = `Hoy a las ${s.hora}`;
    else if (p.cuando === 'manana') pie.textContent = `Mañana a las ${s.hora}`;
    else pie.textContent = `El ${DIAS[p.dia].toLowerCase()} a las ${s.hora}`;
    reloj.setAttribute('aria-label', `Faltan ${h} horas y ${m} minutos para el sorteo ${s.nombre}`);
  };

  pintar();
  fallback.hidden = true;
  vivo.hidden = false;
  window.setInterval(pintar, 20000);
}

function initPizarra() {
  const filas = [...document.querySelectorAll('.turno')];
  const badge = document.getElementById('fichaCostura');
  if (!filas.length) return;
  const pintar = () => {
    const { dia, min } = ahoraAR();
    const p = proximoSorteo();
    if (badge) badge.textContent = DIAS[dia];
    filas.forEach((el, i) => {
      const estado = el.querySelector('.turno-estado');
      el.classList.remove('es-proximo', 'es-pasado');
      if (dia === 0) { estado.textContent = 'Domingo sin sorteo'; el.classList.add('es-pasado'); return; }
      if (SORTEOS[i].min <= min) { el.classList.add('es-pasado'); estado.textContent = 'Ya se sorteó'; }
      else if (p.cuando === 'hoy' && p.i === i) { el.classList.add('es-proximo'); estado.textContent = 'Es el próximo'; }
      else { estado.textContent = 'Todavía se juega'; }
    });
  };
  pintar();
  window.setInterval(pintar, 20000);
}

/* ---------- capítulo: los juegos ---------- */
function initJuegos() {
  const stage = document.getElementById('juegosStage');
  const juegos = [...document.querySelectorAll('.juego')];
  const nombre = document.getElementById('visualNombre');
  const nota = document.getElementById('visualNota');
  const arriba = document.getElementById('visualEyebrow');
  const num = document.getElementById('visualNum');
  const barra = document.getElementById('visualBarra');
  if (!stage || !juegos.length || !num) return;

  let actual = -1;
  const setJuego = i => {
    if (i === actual) return;
    actual = i;
    const j = juegos[i];
    juegos.forEach((el, n) => el.classList.toggle('is-on', n === i));
    nombre.textContent = j.dataset.nombre;
    nota.textContent = j.dataset.nota;
    arriba.textContent = `Juego ${String(i + 1).padStart(2, '0')} de ${String(juegos.length).padStart(2, '0')}`;
    pintarGrupo(num, j.dataset.num);
  };
  setJuego(0);

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) {
    juegos.forEach(el => el.classList.add('is-on'));
    if (barra) barra.style.width = '100%';
    return;
  }

  ScrollTrigger.create({
    trigger: stage,
    start: 'top 62%',
    end: 'bottom 82%',
    scrub: true,
    invalidateOnRefresh: true,
    onUpdate: self => {
      const p = self.progress;
      setJuego(Math.min(juegos.length - 1, Math.floor(p * juegos.length)));
      if (barra) barra.style.width = (p * 100).toFixed(1) + '%';
    }
  });
}

/* ---------- entrada ---------- */
function initHero() {
  if (typeof gsap === 'undefined' || reduceMotion) return;
  gsap.timeline({ defaults: { ease: 'power3.out' } })
    .from('.hero-eyebrow', { y: 14, opacity: 0, duration: .7 }, .1)
    .from('.wordmark .flap', { y: 22, opacity: 0, duration: .6, stagger: .07 }, .16)
    .from('.hero-title', { y: 26, opacity: 0, duration: .85 }, .42)
    .from('.hero-sub', { y: 18, opacity: 0, duration: .75 }, .56)
    .from('.cuenta', { y: 22, opacity: 0, duration: .8 }, .68)
    .from('.hero-ctas .btn', { y: 16, opacity: 0, duration: .65, stagger: .08 }, .82)
    .from('.hero-legal', { opacity: 0, duration: .7 }, .96);
}

function initWordmark() {
  if (reduceMotion) return;
  const flaps = [...document.querySelectorAll('.wordmark .flap')];
  if (!flaps.length) return;
  const pool = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789';
  flaps.forEach((f, i) => {
    const destino = f.dataset.v;
    let vueltas = 0;
    const rodar = () => {
      vueltas++;
      if (vueltas < 5) {
        let c = destino;
        while (c === f.dataset.v) c = pool[Math.floor(Math.random() * pool.length)];
        setFlap(f, c);
        setTimeout(rodar, 120);
      } else {
        setFlap(f, destino);
      }
    };
    setTimeout(rodar, 700 + i * 110);
  });
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
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); }
  });
  const syncInert = () => {
    if (desktopMq.matches) nav.removeAttribute('inert');
    else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  desktopMq.addEventListener('change', syncInert);
  syncInert();
}

function initMapa() {
  const el = document.getElementById('mapa');
  if (!el || typeof L === 'undefined') return;
  const centro = [-29.67, -60.25];
  const mapa = L.map(el, { scrollWheelZoom: false }).setView(centro, 8);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap', maxZoom: 19
  }).addTo(mapa);
  L.circle(centro, {
    radius: 52000, color: '#2B6CB0', weight: 2, fillColor: '#3182CE', fillOpacity: .16
  }).addTo(mapa);
  L.circleMarker(centro, {
    radius: 8, color: '#ffffff', weight: 3, fillColor: '#DD6B20', fillOpacity: 1
  }).addTo(mapa).bindPopup('Agencia Cash — norte de Santa Fe');
}

function initWspFloat() {
  const btn = document.getElementById('wsp-float');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) btn.classList.add('visible'); else btn.classList.remove('visible');
  }, { passive: true });
}

function initAnio() {
  const el = document.getElementById('anio');
  if (el) el.textContent = new Date().getFullYear();
}

initWspLinks();
initNav();
initReloj();
initPizarra();
initJuegos();
initHero();
initWordmark();
initMapa();
initReveals();
initWspFloat();
initAnio();

if (typeof ScrollTrigger !== 'undefined') {
  window.addEventListener('load', () => ScrollTrigger.refresh());
}
