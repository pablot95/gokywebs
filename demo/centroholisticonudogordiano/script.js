const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5492804967286';
const KEY = 'nudogordiano_espacio_v1';
const HORIZONTE = 45;

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const linkWsp = texto => `https://wa.me/${WSP}?text=${encodeURIComponent(texto)}`;

const SESIONES = [
  { id: 'terapia', nombre: 'Terapia en línea', min: 50, precio: 35000 },
  { id: 'trayectorias', nombre: 'Acompañamiento de trayectorias', min: 60, precio: 38000 },
  { id: 'alimentacion', nombre: 'Alimentación consciente', min: 50, precio: 35000 },
  { id: 'relajacion', nombre: 'Relajación guiada', min: 40, precio: 25000 },
];
const getSesion = id => SESIONES.find(s => s.id === id) || SESIONES[0];

const SEMANA = [9, 10, 11, 12, 15, 16, 17, 18, 19];
const HORARIOS = { 0: [], 1: SEMANA, 2: SEMANA, 3: SEMANA, 4: SEMANA, 5: SEMANA, 6: [9, 10, 11] };
const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const DIAS_CORTOS = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const MESES_CORTOS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

const ICONO = {
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>',
  video: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"/><rect x="2" y="6" width="14" height="12" rx="2"/></svg>',
  mover: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>',
  clip: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>',
};

const hoy0 = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };
const sumarDias = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const isoDia = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const desdeIso = s => { const [y, m, d] = String(s).split('-').map(Number); return new Date(y, m - 1, d); };
const hh = h => `${String(h).padStart(2, '0')}:00`;
const fechaLarga = d => `${DIAS[d.getDay()]} ${d.getDate()} de ${MESES[d.getMonth()]}`;
const fechaCorta = d => `${d.getDate()} ${MESES_CORTOS[d.getMonth()]}`;
const tamArchivo = b => (b >= 1048576 ? `${(b / 1048576).toFixed(1).replace('.', ',')} MB` : `${Math.max(1, Math.round(b / 1024))} KB`);
const sinDomingo = d => (d.getDay() === 0 ? sumarDias(d, -1) : d);
const proximoHabil = (desde, h) => { let d = new Date(desde); for (let i = 0; i < 14 && !(HORARIOS[d.getDay()] || []).includes(h); i++) d = sumarDias(d, 1); return d; };

const SEMILLA = (() => {
  const h = hoy0();
  const s1 = sinDomingo(sumarDias(h, -21));
  const s2 = sinDomingo(sumarDias(h, -14));
  const s3 = sinDomingo(sumarDias(h, -7));
  const prox = proximoHabil(sumarDias(h, 3), 18);
  const horaDe = d => (d.getDay() === 6 ? 10 : 18);
  return {
    reservas: [{ id: 'r-ej', servicio: 'terapia', dia: isoDia(prox), hora: 18 }],
    hechas: [
      { id: 's1', dia: isoDia(s1), hora: horaDe(s1), servicio: 'terapia', titulo: 'Primer encuentro', trabajamos: 'Qué te trajo a consulta y qué te gustaría que cambie.', practica: 'Anotar en qué momentos del día aparece la tensión.' },
      { id: 's2', dia: isoDia(s2), hora: horaDe(s2), servicio: 'terapia', titulo: 'Cómo se arma el nudo', trabajamos: 'Situaciones que se repiten y qué sentís en el cuerpo cuando pasan.', practica: 'Respiración 4-7-8 antes de dormir, tres noches por semana.' },
      { id: 's3', dia: isoDia(s3), hora: horaDe(s3), servicio: 'alimentacion', titulo: 'Comer con atención', trabajamos: 'Señales de hambre, de cansancio y de ansiedad a la hora de comer.', practica: 'Una comida por día sin pantallas, registrando cómo llegás.' },
    ],
    pagos: [
      { id: 'p1', servicio: 'terapia', monto: 35000, pagado: isoDia(sumarDias(s1, -2)), dia: isoDia(s1), hora: horaDe(s1), op: 'NG-20481' },
      { id: 'p2', servicio: 'terapia', monto: 35000, pagado: isoDia(sumarDias(s2, -1)), dia: isoDia(s2), hora: horaDe(s2), op: 'NG-20537' },
      { id: 'p3', servicio: 'alimentacion', monto: 35000, pagado: isoDia(sumarDias(s3, -3)), dia: isoDia(s3), hora: horaDe(s3), op: 'NG-20612' },
      { id: 'p4', servicio: 'terapia', monto: 35000, pagado: isoDia(sumarDias(h, -1)), dia: isoDia(prox), hora: 18, op: 'NG-20688' },
    ],
    comentarios: [
      { id: 'c1', autor: 'terapeuta', dia: isoDia(s2), texto: 'Te dejo la guía de respiración que practicamos hoy. Probala antes de dormir.', adj: { nombre: 'guia-respiracion-4-7-8.pdf', tam: 186368 } },
      { id: 'c2', autor: 'vos', dia: isoDia(sumarDias(s2, 2)), texto: 'La hice dos noches. La segunda me dormí más rápido.' },
      { id: 'c3', autor: 'terapeuta', dia: isoDia(s3), texto: 'Para la próxima, completá el registro de comidas cuando puedas. No hace falta que sea perfecto.', adj: { nombre: 'registro-de-comidas.pdf', tam: 98304 } },
    ],
  };
})();

const Espacio = {
  estado: null,
  init() {
    let e;
    try { e = JSON.parse(localStorage.getItem(KEY)) || {}; } catch { e = {}; }
    this.estado = {
      reservas: Array.isArray(e.reservas) ? e.reservas : [],
      pagos: Array.isArray(e.pagos) ? e.pagos : [],
      practicas: e.practicas && typeof e.practicas === 'object' ? e.practicas : { s1: true },
      registros: Array.isArray(e.registros) ? e.registros : [],
      comentarios: Array.isArray(e.comentarios) ? e.comentarios : [],
    };
  },
  guardar() {
    try { localStorage.setItem(KEY, JSON.stringify(this.estado)); return true; } catch { return false; }
  },
  reset() {
    try { localStorage.removeItem(KEY); } catch { this.estado = null; }
    this.init();
  },
  reservas() { return [...SEMILLA.reservas, ...this.estado.reservas]; },
  pagos() { return [...SEMILLA.pagos, ...this.estado.pagos]; },
  comentarios() { return [...SEMILLA.comentarios, ...this.estado.comentarios]; },
};

const adjuntosVivos = new Map();

const ocupadoFijo = (d, h) => ((d.getDate() * 7 + h * 5 + d.getMonth() * 3) % 7) < 2;

function horasDelDia(d) {
  const base = HORARIOS[d.getDay()] || [];
  const ahora = Date.now();
  const iso = isoDia(d);
  const tomadas = new Set(Espacio.reservas().filter(r => r.dia === iso).map(r => Number(r.hora)));
  return base.map(h => {
    const t = new Date(d);
    t.setHours(h, 0, 0, 0);
    return { h, libre: t.getTime() - ahora > 2 * 3600e3 && !ocupadoFijo(d, h) && !tomadas.has(h) };
  });
}

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

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
  if (img) tl.from(img, { scale: 1.08, duration: 1.8 }, 0);
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 36, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2);
  const trazo = hero.querySelector('.hero-nudo path');
  if (trazo && trazo.getTotalLength) {
    const largo = Math.ceil(trazo.getTotalLength());
    tl.fromTo(trazo, { strokeDasharray: largo, strokeDashoffset: largo }, { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut', clearProps: 'strokeDasharray,strokeDashoffset' }, 0.4);
  }
  tl.from(hero.querySelectorAll('.hero-lead'), { y: 24, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 20, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.hero-datos li'), { y: 14, opacity: 0, duration: 0.9, stagger: 0.08, clearProps: 'transform,opacity' }, 0.75);
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

let resaltarReserva = '';

function renderTurnos() {
  const lista = document.getElementById('listaTurnos');
  if (!lista) return;
  const hoy = isoDia(hoy0());
  const proximas = Espacio.reservas().filter(r => r.dia >= hoy).sort((a, b) => (a.dia + hh(a.hora)).localeCompare(b.dia + hh(b.hora)));
  lista.innerHTML = proximas.map(r => {
    const s = getSesion(r.servicio);
    const d = desdeIso(r.dia);
    const mensaje = linkWsp(`Hola! Necesito reprogramar mi sesión de ${s.nombre} del ${fechaLarga(d)} a las ${hh(r.hora)} h.`);
    return `<li class="turno${r.id === resaltarReserva ? ' nuevo' : ''}">
      <div class="turno-fecha"><span>${DIAS_CORTOS[d.getDay()]}</span><strong>${d.getDate()}</strong><span>${MESES_CORTOS[d.getMonth()]}</span></div>
      <div><p class="turno-tit">${esc(s.nombre)}</p><p class="turno-det">${hh(r.hora)} h · ${s.min} min · por videollamada</p><p class="estado">${ICONO.check}Confirmada · Pagada</p></div>
      <div class="turno-acc"><button type="button" class="btn-mini lleno" data-video>${ICONO.video}Entrar a la videollamada</button><a class="btn-mini" href="${mensaje}" target="_blank" rel="noopener">${ICONO.mover}Reprogramar</a></div>
    </li>`;
  }).join('');
  const cuenta = document.getElementById('agendaCuenta');
  if (cuenta) cuenta.textContent = `${proximas.length} ${proximas.length === 1 ? 'reservada' : 'reservadas'} · ${SEMILLA.hechas.length} realizadas`;
}

function renderPagos() {
  const lista = document.getElementById('listaPagos');
  if (!lista) return;
  const pagos = Espacio.pagos().sort((a, b) => b.pagado.localeCompare(a.pagado));
  lista.innerHTML = pagos.map(p => {
    const s = getSesion(p.servicio);
    const pagado = desdeIso(p.pagado);
    const sesion = desdeIso(p.dia);
    return `<li><details class="pago">
      <summary><span class="pago-con">${esc(s.nombre)}</span><span class="pago-monto">${formatearPrecio(p.monto)}<span class="estado">${ICONO.check}Pagado</span></span><span class="pago-fecha">Pagado el ${fechaCorta(pagado)} · sesión del ${fechaCorta(sesion)}</span></summary>
      <dl class="pago-comp"><dt>Operación</dt><dd>${esc(p.op)}</dd><dt>Sesión</dt><dd>${fechaLarga(sesion)}, ${hh(p.hora)} h</dd><dt>Medio</dt><dd>Pago online</dd><dt>Importe</dt><dd>${formatearPrecio(p.monto)}</dd></dl>
    </details></li>`;
  }).join('');
  const total = document.getElementById('pagosTotal');
  if (total) total.innerHTML = `Total pagado: <strong>${formatearPrecio(pagos.reduce((t, p) => t + p.monto, 0))}</strong>`;
}

function renderAvances() {
  const lista = document.getElementById('listaAvances');
  if (!lista) return;
  const st = Espacio.estado;
  const sesiones = SEMILLA.hechas.map((h, i) => {
    const d = desdeIso(h.dia);
    const hecho = !!st.practicas[h.id];
    return `<li class="hilo-item${hecho ? ' hecho' : ''}">
      <p class="hilo-fecha">Sesión ${i + 1} · ${fechaCorta(d)} · ${esc(getSesion(h.servicio).nombre)}</p>
      <h4>${esc(h.titulo)}</h4>
      <p><b>Trabajamos:</b> ${esc(h.trabajamos)}</p>
      <label class="practica"><input type="checkbox" data-practica="${h.id}"${hecho ? ' checked' : ''}><span><b>Para practicar:</b> ${esc(h.practica)}</span></label>
    </li>`;
  });
  const registros = st.registros.map(r => `<li class="hilo-item hecho">
      <p class="hilo-fecha">Tu registro · ${fechaCorta(desdeIso(r.dia))}</p>
      <h4>${esc(r.estado)}</h4>${r.nota ? `<p>${esc(r.nota)}</p>` : ''}
    </li>`);
  const hoy = isoDia(hoy0());
  const prox = Espacio.reservas().filter(r => r.dia >= hoy).sort((a, b) => (a.dia + hh(a.hora)).localeCompare(b.dia + hh(b.hora)))[0];
  const cierre = prox ? [`<li class="hilo-item">
      <p class="hilo-fecha">Próxima · ${fechaCorta(desdeIso(prox.dia))} · ${hh(prox.hora)} h</p>
      <h4>${esc(getSesion(prox.servicio).nombre)}</h4>
      <p>Lo que traigas a la sesión lo seguimos desde acá.</p>
    </li>`] : [];
  lista.innerHTML = [...sesiones, ...registros, ...cierre].join('');
  const hechas = SEMILLA.hechas.filter(h => st.practicas[h.id]).length;
  const txt = document.getElementById('progresoTxt');
  const barra = document.getElementById('progresoBarra');
  if (txt) txt.textContent = `${hechas} de ${SEMILLA.hechas.length} hechas`;
  if (barra) barra.style.width = `${(hechas / SEMILLA.hechas.length) * 100}%`;
}

function renderComentarios() {
  const lista = document.getElementById('listaComentarios');
  if (!lista) return;
  lista.innerHTML = Espacio.comentarios().map(c => {
    const vos = c.autor === 'vos';
    const adj = c.adj ? `<button type="button" class="adjunto" data-adj="${esc(c.id)}">${ICONO.clip}<span>${esc(c.adj.nombre)}</span><small>${tamArchivo(c.adj.tam)}</small></button>` : '';
    return `<li class="coment${vos ? ' vos' : ''}"><p class="coment-meta">${vos ? 'Vos' : 'Tu terapeuta'} · ${fechaCorta(desdeIso(c.dia))}</p>${c.texto ? `<p>${esc(c.texto)}</p>` : ''}${adj}</li>`;
  }).join('');
  lista.scrollTop = lista.scrollHeight;
}

function renderEspacio() {
  renderTurnos();
  renderPagos();
  renderAvances();
  renderComentarios();
}

function abrirTab(id, foco) {
  const tab = document.getElementById(`tab-${id}`);
  if (!tab) return;
  document.querySelectorAll('.espacio-tab').forEach(t => {
    const activo = t === tab;
    t.setAttribute('aria-selected', String(activo));
    t.tabIndex = activo ? 0 : -1;
    const panel = document.getElementById(t.getAttribute('aria-controls'));
    if (panel) panel.hidden = !activo;
  });
  if (foco) tab.focus();
  if (id === 'comentarios') { const l = document.getElementById('listaComentarios'); if (l) l.scrollTop = l.scrollHeight; }
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
}

function initEspacio() {
  const card = document.querySelector('.espacio-card');
  if (!card) return;
  renderEspacio();

  const tabs = [...card.querySelectorAll('.espacio-tab')];
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => abrirTab(t.id.replace('tab-', '')));
    t.addEventListener('keydown', e => {
      const mov = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
      let j = null;
      if (mov) j = (i + mov + tabs.length) % tabs.length;
      if (e.key === 'Home') j = 0;
      if (e.key === 'End') j = tabs.length - 1;
      if (j === null) return;
      e.preventDefault();
      abrirTab(tabs[j].id.replace('tab-', ''), true);
    });
  });

  card.addEventListener('click', e => {
    if (e.target.closest('[data-video]')) {
      showToast('El enlace de la videollamada se habilita 10 minutos antes de la sesión.');
      return;
    }
    const adj = e.target.closest('[data-adj]');
    if (adj) {
      const url = adjuntosVivos.get(adj.dataset.adj);
      if (url) window.open(url, '_blank', 'noopener');
      else showToast('Vista de ejemplo: en la web real el archivo se abre desde acá.');
    }
  });

  card.addEventListener('change', e => {
    const chk = e.target.closest('[data-practica]');
    if (!chk) return;
    Espacio.estado.practicas[chk.dataset.practica] = chk.checked;
    Espacio.guardar();
    renderAvances();
    document.querySelector(`[data-practica="${chk.dataset.practica}"]`)?.focus();
    if (chk.checked) showToast('¡Bien! Tu terapeuta ve la práctica como hecha.');
  });

  const registro = document.getElementById('registroForm');
  registro?.addEventListener('submit', e => {
    e.preventDefault();
    const elegido = registro.querySelector('input[name="registro"]:checked');
    if (!elegido) { showToast('Elegí cómo llegás a la próxima sesión.'); registro.querySelector('input[name="registro"]')?.focus(); return; }
    const nota = document.getElementById('registroNota')?.value.trim() || '';
    Espacio.estado.registros.push({ dia: isoDia(hoy0()), estado: elegido.value, nota });
    Espacio.guardar();
    registro.reset();
    renderAvances();
    showToast('Registro guardado en tu hilo de avances.');
  });

  const form = document.getElementById('comentForm');
  const archivo = document.getElementById('comentArchivo');
  const elegido = document.getElementById('adjElegido');
  const nombreAdj = document.getElementById('adjNombre');
  const quitar = document.getElementById('adjQuitar');
  const limpiarAdj = () => { if (archivo) archivo.value = ''; if (elegido) elegido.hidden = true; };
  archivo?.addEventListener('change', () => {
    const f = archivo.files?.[0];
    if (!f) { limpiarAdj(); return; }
    if (f.size > 10 * 1048576) { showToast('El archivo supera los 10 MB. Probá con uno más liviano.'); limpiarAdj(); return; }
    nombreAdj.textContent = `${f.name} · ${tamArchivo(f.size)}`;
    elegido.hidden = false;
  });
  quitar?.addEventListener('click', () => { limpiarAdj(); archivo?.focus(); });
  form?.addEventListener('submit', e => {
    e.preventDefault();
    const txt = document.getElementById('comentTxt');
    const texto = txt.value.trim();
    const f = archivo?.files?.[0];
    if (!texto && !f) { showToast('Escribí algo o adjuntá un archivo.'); txt.focus(); return; }
    const c = { id: `c${Date.now()}`, autor: 'vos', dia: isoDia(hoy0()), texto };
    if (f) {
      c.adj = { nombre: f.name, tam: f.size };
      adjuntosVivos.set(c.id, URL.createObjectURL(f));
    }
    Espacio.estado.comentarios.push(c);
    Espacio.guardar();
    form.reset();
    limpiarAdj();
    renderComentarios();
    showToast(f ? 'Comentario y archivo enviados a tu terapeuta.' : 'Comentario enviado a tu terapeuta.');
  });

  document.getElementById('espacioReset')?.addEventListener('click', () => {
    Espacio.reset();
    resaltarReserva = '';
    renderEspacio();
    document.dispatchEvent(new CustomEvent('espacio:cambio'));
    showToast('Listo: volvió el ejemplo original.');
  });
}

function initReserva() {
  const form = document.getElementById('reservaForm');
  if (!form) return;
  const grid = document.getElementById('calGrid');
  const mesEl = document.getElementById('calMes');
  const prev = document.getElementById('calPrev');
  const next = document.getElementById('calNext');
  const horasEl = document.getElementById('horas');
  const resServicio = document.getElementById('resServicio');
  const resCuando = document.getElementById('resCuando');
  const resTotal = document.getElementById('resTotal');
  const linkCoordinar = document.getElementById('reservaWsp');
  const hoy = hoy0();
  const limite = sumarDias(hoy, HORIZONTE);
  const estado = { servicio: form.querySelector('input[name="servicio"]:checked')?.value || 'terapia', dia: null, hora: null, mes: new Date(hoy.getFullYear(), hoy.getMonth(), 1) };

  const tieneLibres = d => d >= hoy && d <= limite && horasDelDia(d).some(x => x.libre);

  function renderCal() {
    const m = estado.mes;
    mesEl.textContent = `${MESES[m.getMonth()]} ${m.getFullYear()}`;
    const offset = (new Date(m.getFullYear(), m.getMonth(), 1).getDay() + 6) % 7;
    const diasMes = new Date(m.getFullYear(), m.getMonth() + 1, 0).getDate();
    let html = '';
    for (let i = 0; i < offset; i++) html += '<span aria-hidden="true"></span>';
    for (let n = 1; n <= diasMes; n++) {
      const d = new Date(m.getFullYear(), m.getMonth(), n);
      const iso = isoDia(d);
      const libres = d >= hoy && d <= limite ? horasDelDia(d).filter(x => x.libre).length : 0;
      const label = `${fechaLarga(d)}, ${libres ? `${libres} ${libres === 1 ? 'horario libre' : 'horarios libres'}` : 'sin horarios'}`;
      html += `<button type="button" class="cal-dia${libres ? ' libre' : ''}${+d === +hoy ? ' hoy' : ''}" data-dia="${iso}" aria-pressed="${estado.dia === iso}" aria-label="${label}"${libres ? '' : ' disabled'}>${n}</button>`;
    }
    grid.innerHTML = html;
    prev.disabled = m.getFullYear() === hoy.getFullYear() && m.getMonth() === hoy.getMonth();
    next.disabled = m >= new Date(limite.getFullYear(), limite.getMonth(), 1);
  }

  function renderHoras() {
    if (!estado.dia) {
      horasEl.innerHTML = '<p class="horas-vacio">Elegí un día en el calendario para ver los horarios libres.</p>';
      return;
    }
    const d = desdeIso(estado.dia);
    horasEl.innerHTML = `<p class="horas-dia">Horarios del <strong>${fechaLarga(d)}</strong></p><div class="horas-lista">${horasDelDia(d).map(x => `<button type="button" class="hora" data-hora="${x.h}" aria-pressed="${estado.hora === x.h}" aria-label="${hh(x.h)} h${x.libre ? '' : ', ocupado'}"${x.libre ? '' : ' disabled'}>${hh(x.h)}</button>`).join('')}</div>`;
  }

  function renderResumen() {
    const s = getSesion(estado.servicio);
    resServicio.textContent = s.nombre;
    resTotal.textContent = formatearPrecio(s.precio);
    if (estado.dia && estado.hora !== null) resCuando.textContent = `${fechaLarga(desdeIso(estado.dia))} · ${hh(estado.hora)} h · ${s.min} min`;
    else if (estado.dia) resCuando.textContent = `${fechaLarga(desdeIso(estado.dia))} · elegí el horario`;
    else resCuando.textContent = `${s.min} min · elegí día y horario`;
    const cuando = estado.dia ? ` para el ${fechaLarga(desdeIso(estado.dia))}${estado.hora !== null ? ` a las ${hh(estado.hora)} h` : ''}` : '';
    linkCoordinar.href = linkWsp(`Hola! Quiero coordinar una sesión de ${s.nombre}${cuando}.`);
  }

  function renderTodo() { renderCal(); renderHoras(); renderResumen(); }

  function primerMesConLibres() {
    for (let i = 0; i <= HORIZONTE; i++) {
      const d = sumarDias(hoy, i);
      if (tieneLibres(d)) return new Date(d.getFullYear(), d.getMonth(), 1);
    }
    return estado.mes;
  }

  estado.mes = primerMesConLibres();

  form.addEventListener('change', e => {
    if (e.target.name === 'servicio') { estado.servicio = e.target.value; renderResumen(); }
  });

  grid.addEventListener('click', e => {
    const b = e.target.closest('.cal-dia');
    if (!b || b.disabled) return;
    estado.dia = b.dataset.dia;
    estado.hora = null;
    renderTodo();
    grid.querySelector(`[data-dia="${estado.dia}"]`)?.focus();
    if (window.matchMedia('(max-width: 760px)').matches) horasEl.scrollIntoView({ block: 'nearest', behavior: reduceMotion ? 'auto' : 'smooth' });
  });

  horasEl.addEventListener('click', e => {
    const b = e.target.closest('.hora');
    if (!b || b.disabled) return;
    estado.hora = Number(b.dataset.hora);
    renderHoras();
    renderResumen();
    horasEl.querySelector(`[data-hora="${estado.hora}"]`)?.focus();
  });

  prev.addEventListener('click', () => { estado.mes = new Date(estado.mes.getFullYear(), estado.mes.getMonth() - 1, 1); renderCal(); });
  next.addEventListener('click', () => { estado.mes = new Date(estado.mes.getFullYear(), estado.mes.getMonth() + 1, 1); renderCal(); });

  document.querySelectorAll('[data-agendar]').forEach(a => a.addEventListener('click', () => {
    const radio = form.querySelector(`input[name="servicio"][value="${a.dataset.agendar}"]`);
    if (!radio) return;
    radio.checked = true;
    estado.servicio = radio.value;
    renderResumen();
  }));

  const campos = {
    nombre: { el: document.getElementById('rNombre'), err: document.getElementById('rNombreErr'), ok: v => v.trim().length >= 2, msg: 'Escribí tu nombre.' },
    tel: { el: document.getElementById('rTel'), err: document.getElementById('rTelErr'), ok: v => v.replace(/\D/g, '').replace(/^549?/, '').length >= 10, msg: 'Revisá el número: código de área y número, sin 0 ni 15.' },
    email: { el: document.getElementById('rEmail'), err: document.getElementById('rEmailErr'), ok: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()), msg: 'Revisá el email: falta algo.' },
  };
  if (typeof IMask !== 'undefined' && campos.tel.el) {
    IMask(campos.tel.el, {
      mask: [{ mask: '+{54} 9 (00) 0000-0000' }, { mask: '+{54} 9 (000) 000-0000' }],
      dispatch: (agregado, dinamico) => {
        const digitos = (dinamico.value + agregado).replace(/\D/g, '').replace(/^549?/, '');
        return dinamico.compiledMasks[digitos.startsWith('11') ? 0 : 1];
      },
    });
  }
  const marcar = (c, mal) => {
    c.el.setAttribute('aria-invalid', String(mal));
    c.err.textContent = mal ? c.msg : '';
    c.err.hidden = !mal;
  };
  Object.values(campos).forEach(c => c.el?.addEventListener('input', () => { if (c.el.getAttribute('aria-invalid') === 'true' && c.ok(c.el.value)) marcar(c, false); }));

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!estado.dia) { showToast('Elegí un día en el calendario.'); grid.querySelector('.cal-dia.libre')?.focus(); return; }
    if (estado.hora === null) { showToast('Elegí un horario para ese día.'); horasEl.querySelector('.hora:not(:disabled)')?.focus(); return; }
    let primero = null;
    Object.values(campos).forEach(c => {
      const mal = !c.ok(c.el.value);
      marcar(c, mal);
      if (mal && !primero) primero = c.el;
    });
    if (primero) { primero.focus(); return; }
    Pago.abrir({
      servicio: estado.servicio,
      dia: estado.dia,
      hora: estado.hora,
      nombre: campos.nombre.el.value.trim(),
      alTerminar: () => {
        estado.dia = null;
        estado.hora = null;
        renderTodo();
      },
    });
  });

  document.addEventListener('espacio:cambio', renderTodo);
  renderTodo();
}

const Pago = {
  datos: null,
  procesando: false,
  ultimoFoco: null,
  el: {},
  init() {
    const modal = document.getElementById('pagoModal');
    if (!modal) return;
    this.el = {
      modal,
      paso1: document.getElementById('pagoPaso1'),
      paso2: document.getElementById('pagoPaso2'),
      det: document.getElementById('pagoDet'),
      total: document.getElementById('pagoTotal'),
      confirmar: document.getElementById('pagoConfirmar'),
      okTxt: document.getElementById('pagoOkTxt'),
      ver: document.getElementById('pagoVer'),
      wsp: document.getElementById('pagoWsp'),
    };
    modal.addEventListener('click', e => { if (e.target.closest('[data-cerrar]')) this.cerrar(); });
    modal.addEventListener('keydown', e => {
      if (e.key === 'Escape') { e.preventDefault(); this.cerrar(); return; }
      if (e.key !== 'Tab') return;
      const focos = [...modal.querySelectorAll('button, a[href]')].filter(x => !x.disabled && x.getClientRects().length);
      if (!focos.length) return;
      const primero = focos[0];
      const ultimo = focos[focos.length - 1];
      if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
      else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
    });
    this.el.confirmar.addEventListener('click', () => this.confirmar());
    this.el.ver.addEventListener('click', () => {
      this.cerrar();
      abrirTab('agenda');
      document.getElementById('mi-espacio')?.scrollIntoView({ block: 'start', behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  },
  abrir(datos) {
    if (!this.el.modal) return;
    this.datos = datos;
    const s = getSesion(datos.servicio);
    const d = desdeIso(datos.dia);
    this.el.det.innerHTML = `<dt>Sesión</dt><dd>${esc(s.nombre)}</dd><dt>Día</dt><dd>${fechaLarga(d)}</dd><dt>Horario</dt><dd>${hh(datos.hora)} h · ${s.min} min</dd><dt>A nombre de</dt><dd>${esc(datos.nombre)}</dd>`;
    this.el.total.textContent = formatearPrecio(s.precio);
    this.el.confirmar.querySelector('span').textContent = `Pagar ${formatearPrecio(s.precio)} y confirmar`;
    this.el.paso1.hidden = false;
    this.el.paso2.hidden = true;
    this.ultimoFoco = document.activeElement;
    this.el.modal.hidden = false;
    document.body.classList.add('no-scroll');
    this.el.confirmar.focus();
  },
  confirmar() {
    if (this.procesando || !this.datos) return;
    this.procesando = true;
    const btn = this.el.confirmar;
    btn.disabled = true;
    btn.querySelector('span').textContent = 'Procesando el pago…';
    setTimeout(() => {
      const datos = this.datos;
      const s = getSesion(datos.servicio);
      const d = desdeIso(datos.dia);
      const id = `r${Date.now()}`;
      Espacio.estado.reservas.push({ id, servicio: datos.servicio, dia: datos.dia, hora: datos.hora });
      Espacio.estado.pagos.push({ id: `p${Date.now()}`, servicio: datos.servicio, monto: s.precio, pagado: isoDia(hoy0()), dia: datos.dia, hora: datos.hora, op: `NG-${String(Date.now()).slice(-5)}` });
      Espacio.guardar();
      resaltarReserva = id;
      renderEspacio();
      this.el.okTxt.textContent = `${s.nombre} · ${fechaLarga(d)} a las ${hh(datos.hora)} h (hora de Argentina). El enlace de la videollamada y el comprobante quedan en Mi espacio.`;
      this.el.wsp.href = linkWsp(`Hola! Soy ${datos.nombre}. Reservé y pagué una sesión de ${s.nombre} para el ${fechaLarga(d)} a las ${hh(datos.hora)} h.`);
      this.el.paso1.hidden = true;
      this.el.paso2.hidden = false;
      btn.disabled = false;
      this.procesando = false;
      datos.alTerminar?.();
      this.el.ver.focus();
    }, 900);
  },
  cerrar() {
    if (this.procesando || !this.el.modal || this.el.modal.hidden) return;
    this.el.modal.hidden = true;
    document.body.classList.remove('no-scroll');
    const volver = this.el.paso2.hidden ? this.ultimoFoco : document.getElementById('tab-agenda');
    volver?.focus?.({ preventScroll: true });
    this.datos = null;
  },
};

initModelBarScroll();
initNav();
initWspFloat();
Espacio.init();
initEspacio();
initReserva();
Pago.init();
initReveals();
initHeroMotion();
initLeeScroll();
