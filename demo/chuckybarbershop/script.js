document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WA = '5493525438456';
const waLink = msg => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const FLECHA = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>';

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

const CATEGORIAS = [
  { id: 'cortes', nombre: 'Cortes' },
  { id: 'barba', nombre: 'Barba y cejas' },
  { id: 'diseno', nombre: 'Diseño y cuidado' }
];

const SERVICIOS = [
  { id: 'degrade', cat: 'cortes', nombre: 'Corte en degradé', desc: 'Fade bajo, medio o alto, con máquina y terminación a navaja.', min: 40, precio: 14000 },
  { id: 'tijera', cat: 'cortes', nombre: 'Corte clásico con tijera', desc: 'Todo a tijera, para quien quiere largo arriba y un acabado prolijo.', min: 45, precio: 13000 },
  { id: 'moda', cat: 'cortes', nombre: 'Corte de moda', desc: 'Texturizado, crop o mullet moderno: traé la foto y lo adaptamos a tu pelo.', min: 45, precio: 15000 },
  { id: 'barba', cat: 'barba', nombre: 'Recorte de barba', desc: 'Rebaje, perfilado y línea con navaja.', min: 30, precio: 8000 },
  { id: 'cejas', cat: 'barba', nombre: 'Perfilado de cejas', desc: 'Limpieza y forma con navaja, sin perder lo natural.', min: 10, precio: 3500 },
  { id: 'freestyle', cat: 'diseno', nombre: 'Diseño free style', desc: 'Líneas y figuras a máquina y navaja, sobre tu corte.', min: 15, precio: 3000, desde: true },
  { id: 'tratamiento', cat: 'diseno', nombre: 'Tratamiento capilar', desc: 'Lavado, hidratación y masaje del cuero cabelludo.', min: 30, precio: 9000, desde: true },
  { id: 'peinado', cat: 'diseno', nombre: 'Peinado', desc: 'Para un evento o una salida, con secador y producto.', min: 20, precio: 6000 }
];

const precioTxt = s => `${s.desde ? 'desde ' : ''}${formatearPrecio(s.precio)}`;

function filaHTML(s) {
  const msg = waLink(`Hola Chucky, quiero pedir turno para ${s.nombre}.`);
  return `<li class="fila" data-animate="subir" style="opacity:0;transform:translateY(24px)">
    <span class="fila__nombre">${esc(s.nombre)}</span>
    <span class="fila__valor">${s.desde ? '<small>desde</small>' : ''}${formatearPrecio(s.precio)}</span>
    <span class="fila__desc">${esc(s.desc)} · ${s.min} min</span>
    <a class="fila__pedir" href="${msg}" target="_blank" rel="noopener" aria-label="Pedir turno para ${esc(s.nombre)}">Pedir turno ${FLECHA}</a>
  </li>`;
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
  const desktopMq = window.matchMedia('(min-width: 901px)');
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

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const img = hero.querySelector('[data-hero-img]');
  if (img) gsap.set(img, { scale: 1.06 });
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  if (img) tl.from(img, { scale: 1.14, duration: 1.8 }, 0);
  tl.from(hero.querySelectorAll('.hero__logo'), { y: 24, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.05)
    .from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.15)
    .from(hero.querySelectorAll('.hero__kicker'), { y: 24, opacity: 0, duration: 1 }, 0.22)
    .from(hero.querySelectorAll('h1'), { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.3)
    .from(hero.querySelectorAll('.hero-lead'), { y: 24, opacity: 0, duration: 1 }, 0.5)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.62)
    .from(hero.querySelectorAll('.hero__sello'), { scale: 0.92, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.7);
  if (img && typeof ScrollTrigger !== 'undefined') {
    gsap.fromTo(img, { yPercent: -2.5 }, { yPercent: 2.5, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
  }
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

function revelarNuevos(cont) {
  if (!revealsListos || !cont) return;
  const nuevos = [...cont.querySelectorAll('[data-animate]:not(.in)')];
  if (!nuevos.length) return;
  if (reduceMotion) { nuevos.forEach(el => el.classList.add('in')); return; }
  requestAnimationFrame(() => requestAnimationFrame(() => nuevos.forEach((el, i) => {
    const d = Math.min(i * 0.06, 0.6);
    el.style.transitionDelay = `${d}s`;
    el.classList.add('in');
    setTimeout(() => { el.style.transitionDelay = ''; }, (d + 1.2) * 1000);
  })));
}

function initCarta() {
  const carta = document.getElementById('carta');
  if (!carta) return;
  carta.innerHTML = CATEGORIAS.map(c => `<div class="carta__grupo">
    <h3 data-animate="subir" style="opacity:0;transform:translateY(24px)">${esc(c.nombre)}</h3>
    <ul class="filas">${SERVICIOS.filter(s => s.cat === c.id).map(filaHTML).join('')}</ul>
  </div>`).join('');
}

function initTabs() {
  const tabs = [...document.querySelectorAll('.tab[data-cat]')];
  const filas = document.getElementById('tabFilas');
  if (!tabs.length || !filas) return;
  const fotos = document.querySelectorAll('.tabs-panel__foto img[data-cat]');
  const panel = document.getElementById('tabPanel');
  const pintar = (cat, animar) => {
    tabs.forEach(t => { const on = t.dataset.cat === cat; t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1; });
    fotos.forEach(f => f.classList.toggle('is-activo', f.dataset.cat === cat));
    filas.innerHTML = SERVICIOS.filter(s => s.cat === cat).map(filaHTML).join('');
    panel?.setAttribute('aria-labelledby', tabs.find(t => t.dataset.cat === cat)?.id || '');
    if (animar) { revelarNuevos(filas); if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); }
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => pintar(t.dataset.cat, true));
    t.addEventListener('keydown', e => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault();
      const sig = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
      sig.focus();
      pintar(sig.dataset.cat, true);
    });
  });
  pintar(tabs[0].dataset.cat, false);
}

function ahoraAR() {
  const partes = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Argentina/Buenos_Aires', year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date());
  const v = t => partes.find(p => p.type === t)?.value || '0';
  return {
    anio: Number(v('year')), mes: Number(v('month')), dia: Number(v('day')),
    dow: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(v('weekday')),
    minutos: (Number(v('hour')) % 24) * 60 + Number(v('minute'))
  };
}

const abreDia = dow => dow >= 2 && dow <= 6;

function estadoAtencion() {
  const a = ahoraAR();
  if (abreDia(a.dow)) {
    if (a.minutos >= 540 && a.minutos < 780) return { abierto: true, txt: 'Abierto ahora · hasta las 13 h' };
    if (a.minutos >= 960 && a.minutos < 1260) return { abierto: true, txt: 'Abierto ahora · hasta las 21 h' };
    if (a.minutos < 540) return { abierto: false, txt: 'Cerrado · abrimos hoy a las 9 h' };
    if (a.minutos < 960) return { abierto: false, txt: 'Cerrado · abrimos hoy a las 16 h' };
  }
  let prox = a.dow;
  let saltos = 0;
  do { prox = (prox + 1) % 7; saltos++; } while (!abreDia(prox));
  const nombres = ['el domingo', 'el lunes', 'el martes', 'el miércoles', 'el jueves', 'el viernes', 'el sábado'];
  return { abierto: false, txt: `Cerrado · abrimos ${saltos === 1 ? 'mañana' : nombres[prox]} a las 9 h` };
}

function initHorario() {
  const els = document.querySelectorAll('[data-estado]');
  const pintar = () => {
    const e = estadoAtencion();
    els.forEach(el => { el.textContent = e.txt; el.classList.toggle('is-abierto', e.abierto); });
    const dow = ahoraAR().dow;
    document.querySelectorAll('.tabla-horario tr').forEach(tr => {
      const d = Number(tr.dataset.dia);
      tr.classList.toggle('hoy', abreDia(dow) ? d === dow : tr.classList.contains('cerrado'));
    });
  };
  pintar();
  setInterval(pintar, 60000);
}

function initTurno() {
  const servCont = document.getElementById('turnoServicios');
  const diasCont = document.getElementById('turnoDias');
  if (!servCont || !diasCont) return;
  const lista = document.getElementById('turnoLista');
  const total = document.getElementById('turnoTotal');
  const cuando = document.getElementById('turnoCuando');
  const wsp = document.getElementById('turnoWsp');
  const nombre = document.getElementById('turnoNombre');
  const franjas = document.querySelectorAll('input[name="franja"]');
  const defaultHref = wsp.href;
  const elegidos = [];

  servCont.innerHTML = SERVICIOS.map(s => `<label class="chip"><input type="checkbox" data-f="servicio" value="${s.id}"><span>${esc(s.nombre)} <b>${precioTxt(s)}</b></span></label>`).join('');

  const a = ahoraAR();
  const base = Date.UTC(a.anio, a.mes - 1, a.dia, 12);
  const diasSemana = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  const cortos = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const dias = [];
  for (let k = 0; dias.length < 5 && k < 14; k++) {
    const f = new Date(base + k * 86400000);
    const dow = f.getUTCDay();
    if (!abreDia(dow)) continue;
    if (k === 0 && a.minutos >= 1230) continue;
    const fecha = `${f.getUTCDate()}/${f.getUTCMonth() + 1}`;
    dias.push({ hoy: k === 0, etiqueta: k === 0 ? 'Hoy' : `${cortos[dow]} ${fecha}`, texto: `${k === 0 ? 'hoy, ' : ''}${diasSemana[dow]} ${fecha}` });
  }
  diasCont.innerHTML = dias.map((d, i) => `<label class="chip"><input type="radio" name="dia" value="${i}"><span>${esc(d.etiqueta)}</span></label>`).join('');

  const pintar = () => {
    const sel = elegidos.map(id => SERVICIOS.find(s => s.id === id)).filter(Boolean);
    const diaInput = diasCont.querySelector('input[name="dia"]:checked');
    const dia = diaInput ? dias[Number(diaInput.value)] : null;
    const manana = franjas[0];
    const cerroManana = Boolean(dia?.hoy && a.minutos >= 750);
    manana.disabled = cerroManana;
    if (cerroManana && manana.checked) manana.checked = false;
    const franja = [...franjas].find(f => f.checked)?.value || '';

    lista.innerHTML = sel.length
      ? sel.map(s => `<li><span>${esc(s.nombre)}</span><span>${precioTxt(s)}</span></li>`).join('')
      : '<li class="turno__vacio">Todavía no elegiste ningún servicio.</li>';
    const suma = sel.reduce((t, s) => t + s.precio, 0);
    const mins = sel.reduce((t, s) => t + s.min, 0);
    total.textContent = sel.length ? `${sel.some(s => s.desde) ? 'desde ' : ''}${formatearPrecio(suma)} · ${mins} min` : '—';
    cuando.textContent = dia && franja ? `${dia.texto.charAt(0).toUpperCase()}${dia.texto.slice(1)}, ${franja}` : dia ? `${dia.texto.charAt(0).toUpperCase()}${dia.texto.slice(1)}: elegí mañana o tarde.` : 'Elegí el día y el horario.';
    cuando.classList.toggle('listo', Boolean(dia && franja));

    if (!sel.length && !dia && !franja && !nombre.value.trim()) { wsp.href = defaultHref; return; }
    let msg = 'Hola Chucky, quiero pedir un turno.';
    if (sel.length) msg += ` Servicio: ${sel.map(s => s.nombre).join(' + ')}.`;
    if (dia) msg += ` Día: ${dia.texto}${franja ? `, ${franja}` : ''}.`;
    else if (franja) msg += ` Horario: ${franja}.`;
    if (nombre.value.trim()) msg += ` Soy ${nombre.value.trim()}.`;
    wsp.href = waLink(msg);
  };

  servCont.querySelectorAll('input').forEach(input => input.addEventListener('change', () => {
    const i = elegidos.indexOf(input.value);
    if (input.checked && i === -1) elegidos.push(input.value);
    if (!input.checked && i > -1) elegidos.splice(i, 1);
    pintar();
  }));
  diasCont.querySelectorAll('input').forEach(input => input.addEventListener('change', pintar));
  franjas.forEach(input => input.addEventListener('change', pintar));
  nombre.addEventListener('input', pintar);
  wsp.addEventListener('click', () => {
    if (!elegidos.length) showToast('Te llevamos al WhatsApp: contanos qué te querés hacer.');
  });
  pintar();
}

function initVisor() {
  const visor = document.getElementById('visor');
  const btns = document.querySelectorAll('[data-visor]');
  if (!visor || !btns.length) return;
  const img = document.getElementById('visorImg');
  const txt = document.getElementById('visorTxt');
  const cerrar = document.getElementById('visorCerrar');
  let origen = null;
  let timer = 0;
  const close = () => {
    visor.classList.remove('open');
    document.body.classList.remove('no-scroll');
    clearTimeout(timer);
    timer = setTimeout(() => { visor.hidden = true; }, 320);
    origen?.focus();
  };
  btns.forEach(btn => btn.addEventListener('click', () => {
    origen = btn;
    img.src = btn.dataset.visor;
    img.alt = btn.querySelector('img')?.alt || '';
    txt.textContent = btn.dataset.visorTxt || '';
    clearTimeout(timer);
    visor.hidden = false;
    void visor.offsetWidth;
    visor.classList.add('open');
    document.body.classList.add('no-scroll');
    cerrar.focus();
  }));
  cerrar.addEventListener('click', close);
  visor.addEventListener('click', e => { if (e.target === visor || e.target.classList.contains('visor__fig')) close(); });
  document.addEventListener('keydown', e => {
    if (visor.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'Tab') { e.preventDefault(); cerrar.focus(); }
  });
}

function initMapa() {
  const el = document.getElementById('mapa');
  if (!el || typeof L === 'undefined') return;
  const centro = [-30.9815, -64.0944];
  const mapa = L.map(el, { scrollWheelZoom: false, attributionControl: true }).setView(centro, 14);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap', maxZoom: 19 }).addTo(mapa);
  L.circle(centro, { radius: 900, color: '#0E0E0E', weight: 1, fillColor: '#0E0E0E', fillOpacity: 0.07 }).addTo(mapa);
  L.circleMarker(centro, { radius: 8, color: '#FFFFFF', weight: 2, fillColor: '#0E0E0E', fillOpacity: 1 }).addTo(mapa);
  window.addEventListener('load', () => mapa.invalidateSize());
}

function initAnio() {
  document.querySelectorAll('[data-anio]').forEach(el => { el.textContent = new Date().getFullYear(); });
}

[initModelBarScroll, initWspFloat, initNav, initCarta, initTabs, initHorario, initTurno, initVisor, initAnio, initHeroMotion, initReveals, initMapa].forEach(fn => {
  try { fn(); } catch (e) { console.error(e); }
});
