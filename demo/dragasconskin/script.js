document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5491123697767';
const SITIO = 'https://gokywebs.com/demo/dragasconskin/';

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const wspLink = texto => 'https://wa.me/' + WSP + '?text=' + encodeURIComponent(texto);

const CAMINOS = [
  {
    id: 'dermatologia', folio: '01', nombre: 'Dermatología clínica',
    bajada: 'La consulta médica de siempre: mirar la piel, entender qué pasa y tratarlo.',
    servicios: [
      { id: 'consulta', nombre: 'Consulta dermatológica', duracion: 30 },
      { id: 'lunares', nombre: 'Control de lunares con dermatoscopía', duracion: 30 },
      { id: 'acne', nombre: 'Tratamiento de acné', duracion: 30 },
      { id: 'caida', nombre: 'Caída de cabello', duracion: 30 },
      { id: 'dermatitis', nombre: 'Dermatitis y psoriasis', duracion: 30 }
    ]
  },
  {
    id: 'estetica', folio: '02', nombre: 'Estética facial',
    bajada: 'Procedimientos médicos para la piel del rostro, siempre con criterio dermatológico.',
    servicios: [
      { id: 'toxina', nombre: 'Toxina botulínica', duracion: 45 },
      { id: 'relleno', nombre: 'Relleno con ácido hialurónico', duracion: 45 },
      { id: 'peeling', nombre: 'Peeling químico', duracion: 45 },
      { id: 'skinbooster', nombre: 'Skinbooster y mesoterapia', duracion: 45 },
      { id: 'limpieza', nombre: 'Limpieza profunda', duracion: 60 }
    ]
  },
  {
    id: 'laser', folio: '03', nombre: 'Láser',
    bajada: 'Para lo que la crema sola no resuelve: manchas, textura, vello y marcas.',
    servicios: [
      { id: 'depilacion', nombre: 'Depilación definitiva', duracion: 30 },
      { id: 'manchas', nombre: 'Láser para manchas', duracion: 45 },
      { id: 'rejuvenecimiento', nombre: 'Rejuvenecimiento láser', duracion: 45 },
      { id: 'cicatrices', nombre: 'Cicatrices de acné', duracion: 45 }
    ]
  }
];

const PREGUNTAS = [
  {
    q: '¿Qué llevo a la primera consulta?',
    a: 'Si tenés estudios dermatológicos previos, traelos. Y anotá las cremas o medicación que estés usando: sirve más de lo que parece. Si venís por control de lunares, mejor sin esmalte en las uñas y sin maquillaje.'
  },
  {
    q: '¿El control de lunares se hace en la misma consulta?',
    a: 'Sí. Reviso los lunares con dermatoscopía en la misma visita y ahí te digo si hay algo para seguir de cerca o para sacar.'
  },
  {
    q: '¿Puedo ir maquillada?',
    a: 'Si la consulta es facial, de estética o de láser, es mejor que vengas con la cara limpia. Si te olvidás no pasa nada: lo desmaquillamos en el consultorio.'
  },
  {
    q: '¿Cuántas sesiones lleva un tratamiento con láser?',
    a: 'Depende del tipo de piel, de la zona y de qué estemos tratando. En la primera consulta miramos la piel y recién ahí te digo cuántas sesiones y cada cuánto.'
  },
  {
    q: '¿Duele la toxina botulínica o el relleno?',
    a: 'La molestia es mínima y corta. Uso anestesia tópica antes cuando hace falta, y te explico paso a paso qué vas a sentir.'
  },
  {
    q: '¿Y si no puedo ir al turno?',
    a: 'Avisame por WhatsApp con la mayor anticipación posible y lo reprogramamos. Así el horario le queda libre a otra persona.'
  }
];

/* ---------- utilidades de agenda ---------- */
const DIAS_SEMANA = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

function isoDe(fecha) {
  const y = fecha.getFullYear();
  const m = String(fecha.getMonth() + 1).padStart(2, '0');
  const d = String(fecha.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function proximosDias(cantidad, desde) {
  const base = desde ? new Date(desde) : new Date();
  base.setHours(0, 0, 0, 0);
  const dias = [];
  const cursor = new Date(base);
  let guardia = 0;
  while (dias.length < cantidad && guardia < 60) {
    guardia++;
    cursor.setDate(cursor.getDate() + 1);
    if (cursor.getDay() === 0) continue;
    dias.push({
      iso: isoDe(cursor),
      diaSemana: DIAS_SEMANA[cursor.getDay()],
      numero: cursor.getDate(),
      mes: MESES[cursor.getMonth()],
      esSabado: cursor.getDay() === 6
    });
  }
  return dias;
}

function hashNum(txt) {
  let h = 0;
  for (let i = 0; i < txt.length; i++) h = (h * 31 + txt.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function slotsDe(dia) {
  const manana = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30'];
  const tarde = ['14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30'];
  const horas = dia.esSabado ? manana : manana.concat(tarde);
  const slots = horas.map(hora => ({ hora, libre: hashNum(dia.iso + hora) % 10 >= 3 }));
  if (!slots.some(s => s.libre)) slots[0].libre = true;
  return slots;
}

function fechaLarga(dia) {
  return `${dia.diaSemana} ${dia.numero} de ${dia.mes}`;
}

function servicioPorId(id) {
  for (const c of CAMINOS) {
    const s = c.servicios.find(x => x.id === id);
    if (s) return { ...s, camino: c.nombre, caminoId: c.id };
  }
  return null;
}

function validarNombre(v) {
  const partes = String(v ?? '').trim().split(/\s+/).filter(p => p.length >= 2);
  return partes.length >= 2;
}

function validarTelefono(v) {
  return String(v ?? '').replace(/\D/g, '').length >= 8;
}

/* ---------- toast ---------- */
function showToast(msg) {
  let wrap = document.querySelector('.toast-wrap');
  if (!wrap) {
    wrap = document.createElement('div');
    wrap.className = 'toast-wrap';
    wrap.setAttribute('aria-live', 'polite');
    document.body.appendChild(wrap);
  }
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  toast.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M20 6L9 17l-5-5"/></svg><span>' + esc(msg) + '</span>';
  wrap.appendChild(toast);
  setTimeout(() => { toast.classList.add('hiding'); setTimeout(() => toast.remove(), 220); }, 4000);
}

/* ---------- secciones ---------- */
function initCaminos() {
  const cont = document.getElementById('caminos');
  if (!cont) return;
  cont.innerHTML = CAMINOS.map(c =>
    '<article class="camino" data-animate style="transform:translateY(26px);opacity:0">' +
      '<div class="camino-cab"><span class="folio">' + esc(c.folio) + '</span><h3>' + esc(c.nombre) + '</h3></div>' +
      '<p class="camino-bajada">' + esc(c.bajada) + '</p>' +
      '<ul class="camino-lista">' + c.servicios.map(s => '<li>' + esc(s.nombre) + '</li>').join('') + '</ul>' +
      '<button type="button" class="camino-cta" data-camino="' + esc(c.id) + '" aria-label="Reservar turno de ' + esc(c.nombre) + '">Reservar turno →</button>' +
    '</article>'
  ).join('');

  cont.addEventListener('click', e => {
    const btn = e.target.closest('[data-camino]');
    if (!btn) return;
    elegirCamino(btn.dataset.camino);
    document.getElementById('turnos')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  });
}

function initFaq() {
  const cont = document.getElementById('faq');
  if (!cont) return;
  cont.innerHTML = PREGUNTAS.map(p =>
    '<details><summary>' + esc(p.q) + '</summary><p>' + esc(p.a) + '</p></details>'
  ).join('');
  cont.addEventListener('toggle', () => {
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  }, true);
}

/* ---------- reservador ---------- */
const reserva = { caminoId: null, servicioId: null, dia: null, hora: null, paso: 1 };
let DIAS = [];

function pintarPasos() {
  document.querySelectorAll('#reservaPasos .rp').forEach(el => {
    const n = Number(el.dataset.paso);
    el.classList.toggle('is-on', n === reserva.paso);
    el.classList.toggle('is-done', n < reserva.paso);
  });
}

function mostrarPanel(n) {
  ['panel1', 'panel2', 'panel3', 'panel4', 'panelOk'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.hidden = true;
  });
  const destino = n === 'ok' ? 'panelOk' : 'panel' + n;
  const el = document.getElementById(destino);
  if (el) el.hidden = false;
  if (n !== 'ok') reserva.paso = n;
  pintarPasos();
  const volver = document.getElementById('fichaVolver');
  if (volver) volver.hidden = !(typeof n === 'number' && n > 1);
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
}

function pintarFicha() {
  const s = reserva.servicioId ? servicioPorId(reserva.servicioId) : null;
  const set = (id, txt) => { const el = document.getElementById(id); if (el) el.textContent = txt; };
  set('fServicio', s ? s.nombre : '—');
  set('fDuracion', s ? s.duracion + ' minutos' : '—');
  set('fDia', reserva.dia ? fechaLarga(reserva.dia) : '—');
  set('fHora', reserva.hora ? reserva.hora + ' h' : '—');
}

function elegirCamino(id) {
  reserva.caminoId = id;
  reserva.servicioId = null;
  const camino = CAMINOS.find(c => c.id === id) || CAMINOS[0];
  document.querySelectorAll('#rcCaminos .rc-camino').forEach(b => b.classList.toggle('activo', b.dataset.camino === camino.id));
  const cont = document.getElementById('rcServicios');
  if (cont) {
    cont.innerHTML = camino.servicios.map(s =>
      '<button type="button" class="rc-servicio" data-servicio="' + esc(s.id) + '">' +
        '<span class="rc-servicio-nombre">' + esc(s.nombre) + '</span>' +
        '<span class="rc-servicio-dur">' + s.duracion + ' min</span>' +
      '</button>'
    ).join('');
  }
  pintarFicha();
}

function pintarDias() {
  const cont = document.getElementById('rcDias');
  if (!cont) return;
  cont.innerHTML = DIAS.map(d =>
    '<button type="button" class="rc-dia' + (reserva.dia && reserva.dia.iso === d.iso ? ' activo' : '') + '" data-dia="' + esc(d.iso) + '">' +
      '<small>' + esc(d.diaSemana.slice(0, 3)) + '</small>' +
      '<strong>' + d.numero + '</strong>' +
      '<em>' + esc(d.mes.slice(0, 3)) + '</em>' +
    '</button>'
  ).join('');
}

function pintarHoras() {
  const cont = document.getElementById('rcHoras');
  const nota = document.getElementById('rcNota');
  if (!cont || !reserva.dia) return;
  const slots = slotsDe(reserva.dia);
  cont.innerHTML = slots.map(s =>
    '<button type="button" class="rc-hora' + (reserva.hora === s.hora ? ' activo' : '') + '" data-hora="' + esc(s.hora) + '"' +
    (s.libre ? '' : ' disabled aria-label="' + esc(s.hora) + ', ocupado"') + '>' + esc(s.hora) + '</button>'
  ).join('');
  const libres = slots.filter(s => s.libre).length;
  if (nota) {
    nota.textContent = reserva.dia.esSabado
      ? `Los sábados atiendo solo por la mañana · ${libres} horarios libres.`
      : `${libres} horarios libres para el ${fechaLarga(reserva.dia)}.`;
  }
}

function mensajeTurno(nombre, motivo) {
  const s = servicioPorId(reserva.servicioId);
  const lineas = [
    'Hola Dra., reservé un turno desde la web:',
    '· Tratamiento: ' + (s ? s.nombre + ' (' + s.duracion + ' min)' : '—'),
    '· Día: ' + (reserva.dia ? fechaLarga(reserva.dia) : '—'),
    '· Hora: ' + (reserva.hora || '—'),
    '· A nombre de: ' + nombre
  ];
  if (motivo) lineas.push('· Nota: ' + motivo);
  lineas.push('¿Me lo confirmás?');
  return lineas.join('\n');
}

function initReserva() {
  const raiz = document.getElementById('reserva');
  if (!raiz) return;

  const contCaminos = document.getElementById('rcCaminos');
  if (contCaminos) {
    contCaminos.innerHTML = CAMINOS.map(c =>
      '<button type="button" class="rc-camino" data-camino="' + esc(c.id) + '"><span>' + esc(c.folio) + '</span>' + esc(c.nombre) + '</button>'
    ).join('');
  }

  DIAS = proximosDias(10);
  elegirCamino(CAMINOS[0].id);
  pintarDias();
  pintarFicha();
  pintarPasos();

  raiz.addEventListener('click', e => {
    const camino = e.target.closest('[data-camino]');
    if (camino) { elegirCamino(camino.dataset.camino); return; }

    const servicio = e.target.closest('[data-servicio]');
    if (servicio) {
      reserva.servicioId = servicio.dataset.servicio;
      pintarFicha();
      pintarDias();
      mostrarPanel(2);
      return;
    }

    const dia = e.target.closest('[data-dia]');
    if (dia) {
      reserva.dia = DIAS.find(d => d.iso === dia.dataset.dia) || null;
      reserva.hora = null;
      pintarFicha();
      pintarHoras();
      mostrarPanel(3);
      return;
    }

    const hora = e.target.closest('[data-hora]');
    if (hora && !hora.disabled) {
      reserva.hora = hora.dataset.hora;
      pintarFicha();
      pintarHoras();
      mostrarPanel(4);
    }
  });

  document.getElementById('fichaVolver')?.addEventListener('click', () => {
    if (reserva.paso > 1) mostrarPanel(reserva.paso - 1);
  });

  const form = document.getElementById('rcForm');
  form?.addEventListener('submit', e => {
    e.preventDefault();
    const nombreEl = document.getElementById('rcNombre');
    const telEl = document.getElementById('rcTel');
    const motivoEl = document.getElementById('rcMotivo');
    let ok = true;

    const marcar = (input, errId, valido) => {
      const campo = input.closest('.campo');
      const err = document.getElementById(errId);
      campo?.classList.toggle('error', !valido);
      if (err) err.hidden = valido;
      if (!valido) ok = false;
    };
    marcar(nombreEl, 'errNombre', validarNombre(nombreEl.value));
    marcar(telEl, 'errTel', validarTelefono(telEl.value));
    if (!ok) { nombreEl.closest('.campo')?.querySelector('input')?.focus(); return; }

    const btn = document.getElementById('rcSubmit');
    const textoOriginal = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Confirmando…';

    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = textoOriginal;
      const s = servicioPorId(reserva.servicioId);
      const detalle = document.getElementById('okDetalle');
      if (detalle) {
        detalle.textContent = `${s ? s.nombre : 'Tu turno'} · ${reserva.dia ? fechaLarga(reserva.dia) : ''} a las ${reserva.hora || ''} h, a nombre de ${nombreEl.value.trim()}.`;
      }
      const wsp = document.getElementById('okWsp');
      if (wsp) wsp.href = wspLink(mensajeTurno(nombreEl.value.trim(), motivoEl.value.trim()));
      mostrarPanel('ok');
      showToast('¡Listo! La agenda real se activa al pasar la web a producción.');
      form.reset();
    }, 800);
  });

  document.getElementById('okOtro')?.addEventListener('click', () => {
    reserva.servicioId = null;
    reserva.dia = null;
    reserva.hora = null;
    elegirCamino(CAMINOS[0].id);
    pintarDias();
    pintarFicha();
    mostrarPanel(1);
  });
}

/* ---------- nav (drawer en todos los anchos) ---------- */
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
  const close = () => {
    nav.classList.remove('open');
    bd.classList.remove('open');
    nav.setAttribute('inert', '');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
  };
  const open = () => {
    nav.classList.add('open');
    bd.classList.add('open');
    nav.removeAttribute('inert');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('no-scroll');
    nav.querySelector('a')?.focus();
  };
  toggle.addEventListener('click', () => (nav.classList.contains('open') ? close() : open()));
  closeBtn?.addEventListener('click', () => { close(); toggle.focus(); });
  bd.addEventListener('click', close);
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); }
    if (e.key !== 'Tab' || !nav.classList.contains('open')) return;
    const lista = [...nav.querySelectorAll('a[href], button:not([disabled])')].filter(el => el.offsetParent !== null);
    if (!lista.length) return;
    const primero = lista[0], ultimo = lista[lista.length - 1];
    if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
    else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
  });
  close();
}

/* ---------- reveals ---------- */
function initReveals() {
  const items = document.querySelectorAll('[data-animate]');
  if (!items.length) return;
  document.querySelectorAll('[data-animate-stagger]').forEach(parent => {
    parent.querySelectorAll('[data-animate]').forEach((el, i) => {
      el.style.transitionDelay = Math.min(i * 0.12, 0.72) + 's';
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

function initNodos() {
  const secciones = document.querySelectorAll('main > section');
  if (!secciones.length) return;
  if (!('IntersectionObserver' in window)) {
    secciones.forEach(s => s.classList.add('seccion-on'));
    return;
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) en.target.classList.add('seccion-on'); });
  }, { threshold: 0, rootMargin: '0px 0px -18% 0px' });
  secciones.forEach(s => io.observe(s));
}

function initWspFloat() {
  const btn = document.getElementById('wsp-float');
  if (!btn) return;
  const sync = () => btn.classList.toggle('visible', window.scrollY > 600);
  window.addEventListener('scroll', sync, { passive: true });
  sync();
}

/* ---------- movimiento ---------- */
function initHero() {
  if (typeof gsap === 'undefined' || reduceMotion) return;
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.from('.hero .eyebrow', { y: 14, opacity: 0, duration: .7 }, .05)
    .from('.hero h1', { clipPath: 'inset(0 0 100% 0)', y: 20, duration: 1.05, ease: 'expo.out' }, .12)
    .from('.hero-sub', { y: 16, opacity: 0, duration: .8 }, .42)
    .from('.hero-cta .btn', { y: 14, opacity: 0, duration: .7, stagger: .09 }, .54)
    .from('.hero-caminos li', { x: -18, opacity: 0, duration: .7, stagger: .1 }, .66)
    .from('.hero-sello', { scale: .82, opacity: 0, rotation: -12, duration: .9, ease: 'back.out(1.4)' }, .8);
}

function initFirma() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) return;
  const prog = document.querySelector('.hilo-progreso');
  if (prog) {
    gsap.to(prog, {
      scaleY: 1,
      ease: 'none',
      scrollTrigger: { trigger: 'main', start: 'top top', end: 'bottom bottom', scrub: .4 }
    });
  }
  document.querySelectorAll('.galeria img').forEach((img, i) => {
    gsap.fromTo(img, { yPercent: -3 }, {
      yPercent: 3, ease: 'none',
      scrollTrigger: { trigger: img.closest('figure'), start: 'top bottom', end: 'bottom top', scrub: .7 + i * .1 }
    });
  });
  const tira = document.querySelector('.tira img');
  if (tira) {
    gsap.fromTo(tira, { scale: 1.1 }, {
      scale: 1, ease: 'none',
      scrollTrigger: { trigger: '.tira', start: 'top bottom', end: 'bottom top', scrub: .8 }
    });
  }
}

/* ---------- datos estructurados ---------- */
function initJsonLd() {
  const grafo = [{
    '@type': ['Physician', 'MedicalBusiness'],
    '@id': SITIO + '#negocio',
    name: 'Dra. Yesika Gascón — Dermatología, estética y láser',
    description: 'Médica especialista en Dermatología (UBA). Consulta dermatológica, control de lunares, estética facial y tratamientos con láser en Buenos Aires.',
    url: SITIO,
    image: SITIO + 'images/dra-retrato.webp',
    telephone: '+54 9 11 2369-7767',
    medicalSpecialty: 'Dermatology',
    address: { '@type': 'PostalAddress', addressLocality: 'Buenos Aires', addressCountry: 'AR' },
    availableService: CAMINOS.flatMap(c => c.servicios.map(s => ({
      '@type': 'MedicalProcedure', name: s.nombre, category: c.nombre
    })))
  }, {
    '@type': 'FAQPage',
    '@id': SITIO + '#faq',
    mainEntity: PREGUNTAS.map(p => ({
      '@type': 'Question',
      name: p.q,
      acceptedAnswer: { '@type': 'Answer', text: p.a }
    }))
  }];
  const s = document.createElement('script');
  s.type = 'application/ld+json';
  s.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': grafo });
  document.head.appendChild(s);
}

/* ---------- arranque ---------- */
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}
if (typeof gsap === 'undefined') {
  document.querySelectorAll('[data-animate]').forEach(el => {
    el.style.opacity = 1;
    el.style.transform = 'none';
    el.style.clipPath = 'none';
  });
}

document.getElementById('anio').textContent = new Date().getFullYear();

initCaminos();
initFaq();
initReserva();
initReveals();
initNav();
initNodos();
initWspFloat();
initHero();
initFirma();
initJsonLd();

if (typeof ScrollTrigger !== 'undefined') {
  window.addEventListener('load', () => ScrollTrigger.refresh());
}
