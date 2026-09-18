const WHATSAPP_NUMBER = '5492657310232';
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const waHref = lines => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`;
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const mayus = s => s.charAt(0).toUpperCase() + s.slice(1);

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; el.style.clipPath = 'none'; });
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());
const refreshST = () => { if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); };

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = (e.key || '').toLowerCase();
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

const HORARIO_PERSONALIZADO = ['08:00', '09:00', '10:00', '11:00', '15:00', '16:00', '17:00'];
const ACTIVIDADES = {
  inicial: { nombre: 'Fuerza inicial', dur: 50, horarios: { 1: ['09:00', '18:30'], 2: ['19:30'], 3: ['09:00', '18:30'], 4: ['19:30'], 5: ['09:00', '18:30'], 6: ['10:00'] } },
  avanzada: { nombre: 'Fuerza avanzada', dur: 50, horarios: { 1: ['07:30', '20:00'], 2: ['18:00'], 3: ['07:30', '20:00'], 4: ['18:00'], 5: ['07:30', '20:00'] } },
  personalizado: { nombre: 'Personalizado 1 a 1', dur: 60, horarios: { 1: HORARIO_PERSONALIZADO, 2: HORARIO_PERSONALIZADO, 3: HORARIO_PERSONALIZADO, 4: HORARIO_PERSONALIZADO, 5: HORARIO_PERSONALIZADO } },
  estetica: { nombre: 'Estética corporal', dur: 45, horarios: { 2: ['10:00', '11:00', '12:00'], 4: ['10:00', '11:00', '12:00'], 6: ['09:00', '10:00', '11:00'] } }
};
const PLANES = {
  inicial: [{ label: '2 veces por semana', precio: 32000 }, { label: '3 veces por semana', precio: 38000 }, { label: 'Libre', precio: 45000 }],
  avanzada: [{ label: '2 veces por semana', precio: 32000 }, { label: '3 veces por semana', precio: 38000 }, { label: 'Libre', precio: 45000 }],
  personalizado: [{ label: '1 vez por semana', precio: 56000 }, { label: '2 veces por semana', precio: 98000 }],
  estetica: [{ label: 'Sesión', precio: 18000 }, { label: 'Pack de 4 sesiones', precio: 64000 }]
};
const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const DIAS_CORTOS = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
const MARGEN_MIN = 10;
const horaCorta = h => h.replace(/^0/, '');

function hoyCero() { const d = new Date(); d.setHours(0, 0, 0, 0); return d; }
function diasAbiertos(n) {
  const out = [];
  const d = hoyCero();
  while (out.length < n) { if (d.getDay() !== 0) out.push(new Date(d)); d.setDate(d.getDate() + 1); }
  return out;
}
function turnosDe(actId, dias) {
  const act = ACTIVIDADES[actId];
  const ahora = Date.now();
  return dias.map(dia => ({
    dia,
    turnos: (act.horarios[dia.getDay()] || []).map(h => {
      const [hh, mm] = h.split(':').map(Number);
      const fecha = new Date(dia);
      fecha.setHours(hh, mm, 0, 0);
      return { act: actId, hora: h, fecha, libre: fecha.getTime() - ahora > MARGEN_MIN * 60000 };
    })
  }));
}
function proximoTurno(actId) {
  for (const g of turnosDe(actId, diasAbiertos(8))) for (const t of g.turnos) if (t.libre) return t;
  return null;
}
function diasDesdeHoy(fecha) { const f = new Date(fecha); f.setHours(0, 0, 0, 0); return Math.round((f - hoyCero()) / 86400000); }
function etiquetaDia(fecha) {
  const n = diasDesdeHoy(fecha);
  if (n === 0) return 'hoy';
  if (n === 1) return 'mañana';
  return `el ${DIAS[fecha.getDay()]} ${fecha.getDate()}/${fecha.getMonth() + 1}`;
}
function cuandoCorto(t) {
  const n = diasDesdeHoy(t.fecha);
  const dia = n === 0 ? 'Hoy' : n === 1 ? 'Mañana' : `${mayus(DIAS_CORTOS[t.fecha.getDay()])} ${t.fecha.getDate()}/${t.fecha.getMonth() + 1}`;
  return `${dia} ${horaCorta(t.hora)}`;
}
function cuentaRegresiva(fecha) {
  const min = Math.round((fecha.getTime() - Date.now()) / 60000);
  if (min < 60) return `Empieza en ${Math.max(min, 1)} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h < 24) return `Empieza en ${h} h${m ? ` ${m} min` : ''}`;
  const d = diasDesdeHoy(fecha);
  return d === 1 ? 'Falta 1 día' : `Faltan ${d} días`;
}
function horaFin(t) {
  const f = new Date(t.fecha.getTime() + ACTIVIDADES[t.act].dur * 60000);
  return `${f.getHours()}:${String(f.getMinutes()).padStart(2, '0')}`;
}

const agenda = { act: 'inicial', sel: null, turnos: [], visto: false, token: 0 };

function botonSel() { return document.querySelector('#weekDays .slot.is-selected'); }

function moverPuck(btn, animar) {
  const puck = document.getElementById('puck');
  if (!puck) return;
  if (!btn) { puck.classList.remove('is-on'); return; }
  puck.style.width = `${btn.offsetWidth}px`;
  puck.style.height = `${btn.offsetHeight}px`;
  const destino = `translate(${btn.offsetLeft}px, ${btn.offsetTop}px)`;
  if (!animar || reduceMotion || !puck.classList.contains('is-on')) {
    puck.style.transition = 'none';
    puck.style.transform = destino;
    void puck.offsetWidth;
    puck.style.transition = '';
  } else {
    puck.style.transform = destino;
  }
  puck.classList.add('is-on');
}

function asegurarVisible(btn, suave) {
  const week = document.getElementById('week');
  if (!week || week.scrollWidth <= week.clientWidth + 2) return;
  const x = btn.offsetLeft;
  const w = btn.offsetWidth;
  if (x < week.scrollLeft || x + w > week.scrollLeft + week.clientWidth) {
    week.scrollTo({ left: Math.max(0, x - 12), behavior: suave && !reduceMotion ? 'smooth' : 'auto' });
  }
}

function actualizarVivo() {
  const act = ACTIVIDADES[agenda.act];
  const t = agenda.sel;
  const when = document.getElementById('liveWhen');
  const meta = document.getElementById('liveMeta');
  const amAct = document.getElementById('amAct');
  const amWhen = document.getElementById('amWhen');
  if (amAct) amAct.textContent = `${act.nombre} · ${act.dur}′`;
  if (!when || !meta) return;
  if (!t) {
    when.textContent = 'Esta semana no quedan turnos';
    meta.textContent = 'Escribinos y te avisamos apenas se libere uno.';
    if (amWhen) amWhen.textContent = 'Consultanos';
    return;
  }
  when.textContent = `${mayus(etiquetaDia(t.fecha))} a las ${horaCorta(t.hora)}`;
  meta.textContent = `${cuentaRegresiva(t.fecha)} · ${act.dur} minutos · termina ${horaFin(t)}`;
  if (amWhen) amWhen.textContent = cuandoCorto(t);
}

function actualizarCta() {
  const cta = document.getElementById('agendaCta');
  const detalle = document.getElementById('ctaDetail');
  if (!cta || !detalle) return;
  const act = ACTIVIDADES[agenda.act];
  const t = agenda.sel;
  if (!t) {
    detalle.textContent = act.nombre;
    cta.href = waHref([`Hola Maisa! Quiero reservar ${act.nombre}. ¿Qué horarios tenés?`]);
    return;
  }
  detalle.textContent = `${act.nombre} · ${cuandoCorto(t)}`;
  cta.href = waHref([
    'Hola Maisa! Quiero reservar un turno:',
    `• Clase: ${act.nombre}`,
    `• Día: ${DIAS[t.fecha.getDay()]} ${t.fecha.getDate()}/${t.fecha.getMonth() + 1}`,
    `• Hora: ${horaCorta(t.hora)}`,
    '¿Me confirmás si hay lugar?'
  ]);
}

function elegirTurno(t, animar) {
  agenda.sel = t;
  document.querySelectorAll('#weekDays .slot').forEach(b => {
    const on = !!t && agenda.turnos[Number(b.dataset.i)] === t;
    b.classList.toggle('is-selected', on);
    b.setAttribute('aria-pressed', on ? 'true' : 'false');
  });
  const btn = botonSel();
  moverPuck(btn, animar);
  if (btn) asegurarVisible(btn, animar);
  actualizarVivo();
  actualizarCta();
}

function barrer(botones, fin) {
  if (!botones.length) { fin(); return; }
  const paso = Math.max(22, Math.min(70, 560 / botones.length));
  botones.forEach((b, i) => setTimeout(() => {
    b.classList.add('is-scan');
    setTimeout(() => b.classList.remove('is-scan'), 240);
  }, i * paso));
  setTimeout(fin, botones.length * paso + 80);
}

function renderAgenda(animar, desdeInicio = false) {
  const cont = document.getElementById('weekDays');
  if (!cont) return;
  const token = ++agenda.token;
  const hoy = hoyCero().getTime();
  const grupos = turnosDe(agenda.act, diasAbiertos(6));
  agenda.turnos = [];
  cont.innerHTML = grupos.map(g => {
    const esHoy = g.dia.getTime() === hoy;
    const nombre = esHoy ? 'Hoy' : diasDesdeHoy(g.dia) === 1 ? 'Mañana' : DIAS_CORTOS[g.dia.getDay()];
    const slots = g.turnos.length ? g.turnos.map(t => {
      const i = agenda.turnos.push(t) - 1;
      const etiqueta = `${ACTIVIDADES[t.act].nombre}, ${DIAS[t.fecha.getDay()]} ${t.fecha.getDate()} a las ${horaCorta(t.hora)}${t.libre ? '' : ', ya no disponible'}`;
      return `<button type="button" class="slot${t.libre ? '' : ' is-past'}" data-i="${i}" aria-pressed="false" aria-label="${esc(etiqueta)}"${t.libre ? '' : ' disabled'}>${horaCorta(t.hora)}</button>`;
    }).join('') : '<p class="day-empty">Sin turnos</p>';
    return `<div class="day${esHoy ? ' is-today' : ''}" role="group" aria-label="${esc(`${DIAS[g.dia.getDay()]} ${g.dia.getDate()}`)}"><p class="day-head"><span class="day-name">${nombre}</span><span class="day-date">${DIAS_CORTOS[g.dia.getDay()]} ${g.dia.getDate()}</span></p>${slots}</div>`;
  }).join('');
  const t = agenda.turnos.find(x => x.libre) || null;
  if (animar && !reduceMotion) {
    const botones = [...cont.querySelectorAll('.slot')];
    if (desdeInicio && botones[0]) moverPuck(botones[0], false);
    barrer(botones, () => { if (token === agenda.token) elegirTurno(t, true); });
  } else {
    elegirTurno(t, animar);
  }
}

function mostrarFoto(actId) {
  document.querySelectorAll('#agendaMedia .am').forEach(img => {
    if (img.dataset.act === actId) {
      if (img.classList.contains('is-active')) return;
      img.classList.remove('was-active');
      img.classList.add('is-active');
    } else if (img.classList.contains('is-active')) {
      img.classList.remove('is-active');
      img.classList.add('was-active');
      setTimeout(() => img.classList.remove('was-active'), 900);
    }
  });
}

function seleccionarActividad(actId, { animar = true, demora = 0 } = {}) {
  if (!ACTIVIDADES[actId]) return;
  agenda.visto = true;
  const cambiar = () => {
    agenda.act = actId;
    document.querySelectorAll('input[name="agenda-act"]').forEach(i => { i.checked = i.value === actId; });
    mostrarFoto(actId);
    renderAgenda(animar);
    refreshST();
  };
  if (demora) setTimeout(cambiar, demora); else cambiar();
}

function initAgenda() {
  const days = document.getElementById('weekDays');
  const sec = document.getElementById('turnos');
  if (!days || !sec) return;
  document.querySelectorAll('input[name="agenda-act"]').forEach(inp => {
    inp.addEventListener('change', () => { if (inp.checked) seleccionarActividad(inp.value, { animar: true }); });
  });
  days.addEventListener('click', e => {
    const b = e.target.closest('.slot');
    if (!b || b.disabled) return;
    const t = agenda.turnos[Number(b.dataset.i)];
    if (t) elegirTurno(t, true);
  });
  renderAgenda(false);
  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver(entries => {
      if (!entries.some(en => en.isIntersecting)) return;
      io.disconnect();
      if (agenda.visto) return;
      agenda.visto = true;
      renderAgenda(true, true);
    }, { threshold: 0.3 });
    io.observe(sec);
  }
  window.setInterval(() => {
    if (agenda.sel && agenda.sel.fecha.getTime() - Date.now() <= MARGEN_MIN * 60000) renderAgenda(false);
    else actualizarVivo();
  }, 30000);
  window.addEventListener('resize', () => moverPuck(botonSel(), false), { passive: true });
  document.fonts?.ready.then(() => moverPuck(botonSel(), false));
}

function initHeroChip() {
  const chip = document.getElementById('heroChip');
  const when = document.getElementById('heroChipWhen');
  if (!chip || !when) return;
  const t = ['inicial', 'avanzada'].map(proximoTurno).filter(Boolean).sort((a, b) => a.fecha - b.fecha)[0];
  if (!t) return;
  when.textContent = `${cuandoCorto(t)} · ${ACTIVIDADES[t.act].nombre}`;
  chip.setAttribute('aria-label', `Próximo turno libre: ${cuandoCorto(t)}, ${ACTIVIDADES[t.act].nombre}. Ver la agenda`);
  chip.addEventListener('click', () => seleccionarActividad(t.act, { animar: true, demora: reduceMotion ? 0 : 300 }));
}

function initGoAgenda() {
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-go-agenda]');
    if (!b) return;
    agenda.visto = true;
    document.getElementById('turnos')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    seleccionarActividad(b.dataset.goAgenda, { animar: true, demora: reduceMotion ? 0 : 650 });
  });
}

function initTabs() {
  const tabs = [...document.querySelectorAll('.tab')];
  const lista = document.querySelector('.tabs');
  const ind = document.querySelector('.tabs-ind');
  if (!tabs.length || !lista) return;
  const actual = () => tabs.find(t => t.getAttribute('aria-selected') === 'true') || tabs[0];
  const ubicar = (tab, animar = true) => {
    if (!ind || !tab) return;
    if (!animar || reduceMotion) ind.style.transition = 'none';
    ind.style.width = `${tab.offsetWidth}px`;
    ind.style.transform = `translateX(${tab.offsetLeft}px)`;
    if (!animar || reduceMotion) { void ind.offsetWidth; ind.style.transition = ''; }
  };
  const activar = (tab, foco) => {
    tabs.forEach(t => {
      const on = t === tab;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      const panel = document.getElementById(t.getAttribute('aria-controls'));
      if (!panel) return;
      panel.hidden = !on;
      if (on && !reduceMotion) { panel.classList.remove('is-entering'); void panel.offsetWidth; panel.classList.add('is-entering'); }
    });
    ubicar(tab);
    if (foco) tab.focus();
    const izq = tab.offsetLeft - 16;
    const der = tab.offsetLeft + tab.offsetWidth + 16 - lista.clientWidth;
    if (lista.scrollLeft > izq) lista.scrollTo({ left: izq, behavior: reduceMotion ? 'auto' : 'smooth' });
    else if (lista.scrollLeft < der) lista.scrollTo({ left: der, behavior: reduceMotion ? 'auto' : 'smooth' });
    refreshST();
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => activar(t, false));
    t.addEventListener('keydown', e => {
      let j = null;
      if (e.key === 'ArrowRight') j = (i + 1) % tabs.length;
      if (e.key === 'ArrowLeft') j = (i - 1 + tabs.length) % tabs.length;
      if (e.key === 'Home') j = 0;
      if (e.key === 'End') j = tabs.length - 1;
      if (j !== null) { e.preventDefault(); activar(tabs[j], true); }
    });
  });
  ubicar(actual(), false);
  window.addEventListener('resize', () => ubicar(actual(), false), { passive: true });
  document.fonts?.ready.then(() => ubicar(actual(), false));
}

const autoVisibles = new WeakMap();
function reproducir(v) {
  if (reduceMotion || !v) return;
  const visible = autoVisibles.get(v) && v.offsetParent !== null;
  if (visible) { const p = v.play(); if (p && p.catch) p.catch(() => {}); } else if (!v.paused) v.pause();
}
function initAutoVideos() {
  const vids = [...document.querySelectorAll('video.auto-video')];
  if (!vids.length || reduceMotion || !('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver(entries => entries.forEach(en => {
    autoVisibles.set(en.target, en.isIntersecting);
    reproducir(en.target);
  }), { threshold: 0.3 });
  vids.forEach(v => io.observe(v));
}

const TEST_TXT = {
  exp: { cero: 'Nunca entrené o hace años', aveces: 'Entreno a veces', seguido: 'Entreno seguido' },
  obj: { fuerza: 'Sentirme más fuerte', tonificar: 'Tonificar y moldear', dolores: 'Moverme sin dolores', estetica: 'Verme y sentirme mejor' },
  modo: { grupo: 'En grupo', sola: 'Sola, 1 a 1' },
  dias: { 2: '1 o 2 días por semana', 3: '3 días por semana', 4: '4 días o más' }
};
const TEST_MEDIA = {
  inicial: { src: 'images/video-fuerza-inicial.mp4', poster: 'images/poster-fuerza-inicial.webp', pos: '50% 38%' },
  avanzada: { src: 'images/video-fuerza-avanzada.mp4', poster: 'images/poster-fuerza-avanzada.webp', pos: '50% 30%' },
  personalizado: { src: 'images/video-kettlebell.mp4', poster: 'images/poster-kettlebell.webp', pos: '50% 42%' }
};

function recomendar(r) {
  let clase = 'inicial';
  if (r.modo === 'sola' || (r.obj === 'dolores' && r.exp === 'cero')) clase = 'personalizado';
  else if (r.exp === 'seguido') clase = 'avanzada';
  const planes = PLANES[clase];
  const plan = clase === 'personalizado' ? (r.dias === '2' ? planes[0] : planes[1]) : planes[{ 2: 0, 3: 1, 4: 2 }[r.dias] ?? 0];
  const porque = [];
  if (clase === 'inicial') porque.push(r.exp === 'aveces' ? 'Afirmás la técnica con cargas livianas y, cuando te sientas firme, pasás a avanzada.' : 'Arrancás aprendiendo la técnica, sin apuro y con cargas livianas.');
  if (clase === 'avanzada') porque.push('Ya tenés base: acá sumás carga, ritmo y circuitos más exigentes.');
  if (clase === 'personalizado') porque.push(r.modo === 'sola' ? 'Una hora para vos sola, con un plan que se ajusta cada semana.' : 'Primero adaptamos cada ejercicio a tu cuerpo; después, si querés, pasás al grupo.');
  porque.push({
    fuerza: 'La fuerza se nota en lo cotidiano: escaleras, bolsas, chicos a upa.',
    tonificar: 'Para tonificar pesa más la constancia que la intensidad: venir seguido es la clave.',
    dolores: 'Adaptamos cada movimiento para que entrenes con confianza.',
    estetica: 'Y para verte mejor, podés sumar estética corporal al entrenamiento.'
  }[r.obj]);
  let extra = '';
  if (r.obj === 'estetica') extra = `Sumale Estética corporal: ${formatearPrecio(PLANES.estetica[0].precio)} la sesión.`;
  else if (clase === 'personalizado' && r.dias === '2') extra = `Si podés venir dos veces, el plan de 2 sale ${formatearPrecio(planes[1].precio)} por mes.`;
  else if (clase === 'personalizado') extra = '¿Te sobra un día? Sumá una clase de Fuerza inicial en grupo.';
  return { clase, plan, porque, extra };
}

function initTest() {
  const form = document.getElementById('testForm');
  const card = document.getElementById('testResult');
  if (!form || !card) return;
  const video = document.getElementById('resVideo');
  let claseActual = 'inicial';
  const leer = () => Object.fromEntries(['exp', 'obj', 'modo', 'dias'].map(k => [k, form.querySelector(`input[name="${k}"]:checked`)?.value]));
  const pintar = animar => {
    const r = leer();
    const res = recomendar(r);
    const act = ACTIVIDADES[res.clase];
    document.getElementById('resName').textContent = act.nombre;
    document.getElementById('resPlan').textContent = res.plan.label;
    document.getElementById('resPrice').textContent = formatearPrecio(res.plan.precio);
    document.getElementById('resWhy').innerHTML = res.porque.map(p => `<li>${esc(p)}</li>`).join('');
    const extra = document.getElementById('resExtra');
    extra.textContent = res.extra;
    extra.hidden = !res.extra;
    document.getElementById('resAgenda').dataset.goAgenda = res.clase;
    document.getElementById('resWa').href = waHref([
      'Hola Maisa! Hice el test de la web:',
      `• Cómo vengo: ${TEST_TXT.exp[r.exp]}`,
      `• Quiero: ${TEST_TXT.obj[r.obj]}`,
      `• Prefiero: ${TEST_TXT.modo[r.modo]}`,
      `• Puedo: ${TEST_TXT.dias[r.dias]}`,
      `Me recomendó ${act.nombre} · ${res.plan.label}. ¿Me ayudás a arrancar?`
    ]);
    if (video && res.clase !== claseActual) {
      claseActual = res.clase;
      const m = TEST_MEDIA[res.clase];
      video.poster = m.poster;
      video.src = m.src;
      video.style.objectPosition = m.pos;
      video.load();
      reproducir(video);
    }
    document.getElementById('resAnnounce').textContent = `Te recomendamos ${act.nombre}, ${res.plan.label}, ${formatearPrecio(res.plan.precio)} por mes.`;
    if (animar && !reduceMotion) { card.classList.remove('is-updating'); void card.offsetWidth; card.classList.add('is-updating'); }
    refreshST();
  };
  form.addEventListener('change', () => pintar(true));
  pintar(false);
}

const GALERIA = [
  { tipo: 'video', src: 'images/video-fuerza-inicial.mp4', poster: 'images/poster-fuerza-inicial.webp', cap: 'Elevaciones laterales en la clase inicial' },
  { tipo: 'foto', src: 'images/galeria-mancuerna.webp', alt: 'Mujer madura haciendo bíceps con una mancuerna roja', cap: 'Bíceps con mancuerna' },
  { tipo: 'video', src: 'images/video-grupo.mp4', poster: 'images/poster-grupo.webp', cap: 'Clase en grupo con mancuernas' },
  { tipo: 'foto', src: 'images/galeria-kettlebell.webp', alt: 'Mujer de pelo canoso haciendo sentadilla con kettlebell', cap: 'Sentadilla con kettlebell' },
  { tipo: 'video', src: 'images/video-kettlebell.mp4', poster: 'images/poster-kettlebell.webp', cap: 'Sentadilla sumo con kettlebell' },
  { tipo: 'foto', src: 'images/galeria-estiramiento.webp', alt: 'Dos mujeres hacen movilidad de cadera en el piso del estudio', cap: 'Movilidad antes de cargar' },
  { tipo: 'video', src: 'images/video-fuerza-avanzada.mp4', poster: 'images/poster-fuerza-avanzada.webp', cap: 'Empuje con mancuernas pesadas, clase avanzada' },
  { tipo: 'foto', src: 'images/galeria-correccion.webp', alt: 'Mujer atenta a la corrección durante el entrenamiento', cap: 'Corrección de cerca' }
];
const lb = { el: null, i: 0, origen: null };

function mostrarItem(i) {
  lb.i = (i + GALERIA.length) % GALERIA.length;
  const it = GALERIA[lb.i];
  const media = document.getElementById('lbMedia');
  media.innerHTML = it.tipo === 'video'
    ? `<video src="${it.src}" poster="${it.poster}" controls playsinline muted loop${reduceMotion ? '' : ' autoplay'} aria-label="${esc(it.cap)}"></video>`
    : `<img src="${it.src}" alt="${esc(it.alt)}">`;
  document.getElementById('lbCap').textContent = it.cap;
  document.getElementById('lbCount').textContent = `${lb.i + 1} / ${GALERIA.length}`;
}
function focoAtrapado(e) {
  const f = [...lb.el.querySelectorAll('button, [href], video[controls]')].filter(x => x.offsetParent !== null);
  if (!f.length) return;
  const first = f[0];
  const last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}
function teclasLb(e) {
  if (e.key === 'Escape') cerrarLightbox();
  else if (e.key === 'ArrowRight') mostrarItem(lb.i + 1);
  else if (e.key === 'ArrowLeft') mostrarItem(lb.i - 1);
  else if (e.key === 'Tab') focoAtrapado(e);
}
function abrirLightbox(i, origen) {
  if (!lb.el) return;
  lb.origen = origen;
  lb.el.hidden = false;
  document.body.classList.add('no-scroll');
  mostrarItem(i);
  lb.el.querySelector('.lb-close')?.focus();
  document.addEventListener('keydown', teclasLb);
}
function cerrarLightbox() {
  if (!lb.el || lb.el.hidden) return;
  lb.el.querySelector('video')?.pause();
  lb.el.hidden = true;
  document.getElementById('lbMedia').innerHTML = '';
  document.body.classList.remove('no-scroll');
  document.removeEventListener('keydown', teclasLb);
  lb.origen?.focus();
}
function initGaleria() {
  lb.el = document.getElementById('lightbox');
  const puedeHover = window.matchMedia('(hover: hover)').matches;
  document.querySelectorAll('.gal-btn').forEach(b => {
    const v = b.querySelector('video');
    if (v && puedeHover && !reduceMotion) {
      v.addEventListener('playing', () => b.classList.add('is-playing'));
      b.addEventListener('mouseenter', () => { const p = v.play(); if (p && p.catch) p.catch(() => {}); });
      b.addEventListener('mouseleave', () => { v.pause(); b.classList.remove('is-playing'); });
    }
    b.addEventListener('click', () => { v?.pause(); b.classList.remove('is-playing'); abrirLightbox(Number(b.dataset.gal), b); });
  });
  if (!lb.el) return;
  lb.el.querySelectorAll('[data-lb-close]').forEach(x => x.addEventListener('click', cerrarLightbox));
  document.getElementById('lbPrev')?.addEventListener('click', () => mostrarItem(lb.i - 1));
  document.getElementById('lbNext')?.addEventListener('click', () => mostrarItem(lb.i + 1));
}

function initMapa() {
  const el = document.getElementById('map');
  if (!el) return;
  const crear = () => {
    if (typeof L === 'undefined' || el.dataset.listo) return;
    el.dataset.listo = '1';
    const centro = [-33.6757, -65.4579];
    const mapa = L.map(el, { scrollWheelZoom: false }).setView(centro, 14);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap', maxZoom: 19 }).addTo(mapa);
    const icono = L.divIcon({ className: 'map-pin', html: '<span></span>', iconSize: [34, 34], iconAnchor: [17, 40], popupAnchor: [0, -36] });
    L.marker(centro, { icon: icono, keyboard: false, title: 'Maisa' }).addTo(mapa).bindPopup('<strong>Maisa</strong><br>Villa Mercedes, San Luis');
  };
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => { if (entries.some(en => en.isIntersecting)) { io.disconnect(); crear(); } }, { rootMargin: '300px 0px' });
    io.observe(el);
  } else crear();
}

function initForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  const nombre = form.querySelector('#f-nombre');
  const tel = form.querySelector('#f-tel');
  const errN = form.querySelector('#e-nombre');
  const errT = form.querySelector('#e-tel');
  let mask = null;
  if (typeof IMask !== 'undefined' && tel) {
    mask = IMask(tel, { mask: [
      { mask: '+{54} 9 (00) 0000-0000' },
      { mask: '+{54} 9 (000) 000-0000' },
      { mask: '+{54} 9 (0000) 00-0000' }
    ] });
  }
  const telOk = () => (mask ? mask.unmaskedValue.length >= 12 : tel.value.replace(/\D/g, '').length >= 10);
  const marcar = (input, err, mal) => { input.setAttribute('aria-invalid', mal ? 'true' : 'false'); err.hidden = !mal; };
  nombre.addEventListener('input', () => { if (nombre.value.trim().length >= 2) marcar(nombre, errN, false); });
  tel.addEventListener('input', () => { if (telOk()) marcar(tel, errT, false); });
  form.addEventListener('submit', e => {
    e.preventDefault();
    const okN = nombre.value.trim().length >= 2;
    const okT = telOk();
    marcar(nombre, errN, !okN);
    marcar(tel, errT, !okT);
    if (!okN || !okT) { (okN ? tel : nombre).focus(); return; }
    const btn = form.querySelector('button[type="submit"]');
    const texto = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Enviando…';
    setTimeout(() => {
      showToast('¡Gracias! El envío de mensajes se activa al pasar la web a producción.');
      form.reset();
      if (mask) mask.value = '';
      [nombre, tel].forEach(i => i.removeAttribute('aria-invalid'));
      btn.disabled = false;
      btn.textContent = texto;
    }, 800);
  });
}

function initSways() {
  const cierre = document.querySelector('.cierre-title .sway');
  if (!cierre) return;
  if (reduceMotion || !('IntersectionObserver' in window)) { cierre.classList.add('is-drawn'); return; }
  const io = new IntersectionObserver(entries => {
    if (!entries.some(en => en.isIntersecting)) return;
    io.disconnect();
    setTimeout(() => cierre.classList.add('is-drawn'), 650);
  }, { threshold: 0.6 });
  io.observe(cierre.closest('.cierre-title'));
}

function initHero() {
  const els = document.querySelectorAll('[data-hero]');
  const sways = document.querySelectorAll('.hero .sway');
  if (typeof gsap === 'undefined' || reduceMotion) {
    els.forEach(el => { el.style.opacity = 1; });
    sways.forEach(s => s.classList.add('is-drawn'));
    return;
  }
  const img = document.querySelector('.hero-media img');
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  if (img) tl.fromTo(img, { scale: 1.08 }, { scale: 1, duration: 1.6, ease: 'power2.out' }, 0);
  tl.fromTo('.hero .eyebrow', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.7 }, 0.15)
    .fromTo('.hero-title .w', { opacity: 0, y: 34, filter: 'blur(8px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.9, stagger: 0.07 }, 0.25)
    .add(() => sways.forEach(s => s.classList.add('is-drawn')), 0.85)
    .fromTo(['.hero-sub', '.hero-ctas'], { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.12 }, 0.7)
    .fromTo('#heroChip', { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 0.9, ease: 'back.out(1.7)' }, 1.05);
}

function initFinScroll() {
  document.querySelectorAll('.week, .tabs').forEach(el => {
    const sync = () => el.classList.toggle('at-end', el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
    el.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync, { passive: true });
    new window.MutationObserver(sync).observe(el, { childList: true, subtree: true });
    sync();
  });
}

function initParallax() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) return;
  document.querySelectorAll('.zig-media .pz').forEach(pz => {
    gsap.fromTo(pz, { yPercent: -4 }, { yPercent: 4, ease: 'none', scrollTrigger: { trigger: pz.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
}

initNav();
initWspFloat();
initTabs();
initAgenda();
initHeroChip();
initGoAgenda();
initTest();
initGaleria();
initAutoVideos();
initMapa();
initForm();
initSways();
initFinScroll();
initReveals();
initHero();
initParallax();
