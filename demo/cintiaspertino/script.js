document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5492921470167';
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const waLink = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

const svg = d => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const ICONOS = {
  transferencia: svg('<path d="m16 3 4 4-4 4"/><path d="M20 7H4"/><path d="m8 21-4-4 4-4"/><path d="M4 17h16"/>'),
  sellado: svg('<path d="M5 22h14"/><path d="M19.27 13.73A2.5 2.5 0 0 0 17.5 13h-11A2.5 2.5 0 0 0 4 15.5V17a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-1.5c0-.66-.26-1.3-.73-1.77Z"/><path d="M14 13V8.5C14 7 15 7 15 5a3 3 0 0 0-3-3c-1.69 0-3 1-3 3s1 2 1 3.5V13"/>'),
  baja: svg('<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="m14.5 12.5-5 5"/><path d="m9.5 12.5 5 5"/>'),
  infracciones: svg('<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>'),
  informe: svg('<path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M4.268 21a2 2 0 0 0 1.727 1H18a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v3"/><path d="m9 18-1.5-1.5"/><circle cx="5" cy="14" r="3"/>')
};
const CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';

const TRAMITES = [
  { id: 'transferencia', n: '01', titulo: 'Transferencias', texto: 'Pasamos el vehículo a nombre de quien compra, en todo el país. Revisamos los papeles antes de firmar, preparamos los formularios y presentamos el trámite en el registro.', puntos: ['Autos, motos y utilitarios', 'Revisión de la documentación antes de firmar', 'Seguimiento hasta que el título sale a tu nombre'], consulta: 'Hola Cintia, quiero consultar por una transferencia.' },
  { id: 'sellado', n: '02', titulo: 'Sellados', texto: 'Calculamos el impuesto de sellos que corresponde a la operación y lo dejamos pago y listo para presentar junto con el resto del trámite.', puntos: ['Liquidación según la operación', 'Sellados en todo el país', 'Se presenta junto con la transferencia'], consulta: 'Hola Cintia, quiero consultar por un sellado.' },
  { id: 'baja', n: '03', titulo: 'Bajas de dominio', texto: 'Damos de baja en el registro el auto o la moto que deja de circular, por destrucción, desarme o robo, y te entregamos la constancia.', puntos: ['Automotores y motovehículos', 'Baja por destrucción, desarme o robo', 'Bajas en todo el país'], consulta: 'Hola Cintia, quiero consultar por una baja de dominio.' },
  { id: 'infracciones', n: '04', titulo: 'Infracciones', texto: 'Consultamos las multas a nombre del vehículo o del titular, te explicamos qué corresponde y te ayudamos a resolverlas sin perder tiempo ni pagar de más.', puntos: ['Consulta en el día', 'Multas del vehículo o del titular', 'Cada acta explicada antes de pagar'], consulta: 'Hola Cintia, quiero consultar las infracciones de mi vehículo.' },
  { id: 'informe', n: '05', titulo: 'Informes', texto: 'Antes de señar un usado, pedí el informe de dominio: muestra a nombre de quién está y si tiene prendas, embargos u otras restricciones. También sirve si no encontrás al titular.', puntos: ['Informe de dominio en el día', 'Titular, prendas y embargos', 'Ideal antes de comprar un usado'], consulta: 'Hola Cintia, quiero pedir un informe de dominio.' }
];

const puntosHTML = t => t.puntos.map(p => `<li>${CHECK}<span>${esc(p)}</span></li>`).join('');

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

function initModalTramites() {
  const dlg = document.getElementById('tramiteDialog');
  const botones = document.querySelectorAll('.tram[data-tramite]');
  if (!dlg || !botones.length || typeof dlg.showModal !== 'function') return;
  const ico = document.getElementById('modalIco');
  const folio = document.getElementById('modalFolio');
  const titulo = document.getElementById('modalTitulo');
  const texto = document.getElementById('modalTexto');
  const puntos = document.getElementById('modalPuntos');
  const wa = document.getElementById('modalWa');
  let origen = null;
  const abrir = id => {
    const t = TRAMITES.find(x => x.id === id);
    if (!t) return;
    if (ico) ico.innerHTML = ICONOS[t.id] || '';
    if (folio) folio.textContent = `Trámite ${t.n}`;
    if (titulo) titulo.textContent = t.titulo;
    if (texto) texto.textContent = t.texto;
    if (puntos) puntos.innerHTML = puntosHTML(t);
    if (wa) wa.href = waLink(t.consulta);
    dlg.setAttribute('aria-label', t.titulo);
    document.body.classList.add('no-scroll');
    dlg.showModal();
    dlg.querySelector('.modal-tram__caja')?.scrollTo(0, 0);
  };
  const limpiar = () => {
    if (!document.body.classList.contains('no-scroll')) return;
    document.body.classList.remove('no-scroll');
    origen?.focus();
  };
  const cerrar = () => { if (dlg.open) dlg.close(); limpiar(); };
  botones.forEach(b => b.addEventListener('click', () => { origen = b; abrir(b.dataset.tramite); }));
  dlg.querySelector('.modal-cerrar')?.addEventListener('click', cerrar);
  dlg.addEventListener('click', e => { if (e.target === dlg) cerrar(); });
  dlg.addEventListener('keydown', e => { if (e.key === 'Escape') { e.preventDefault(); cerrar(); } });
  dlg.addEventListener('close', limpiar);
}

function initTabs() {
  const panel = document.getElementById('tramitePanel');
  const tabs = [...document.querySelectorAll('.tab[data-tramite]')];
  if (!panel || !tabs.length) return;
  const lista = tabs[0].parentElement;
  const folio = document.getElementById('panelFolio');
  const titulo = document.getElementById('panelTitulo');
  const texto = document.getElementById('panelTexto');
  const puntos = document.getElementById('panelPuntos');
  const wa = document.getElementById('panelWa');
  const mobile = window.matchMedia('(max-width: 760px)');
  const activar = (tab, foco) => {
    const t = TRAMITES.find(x => x.id === tab.dataset.tramite);
    if (!t) return;
    tabs.forEach(b => {
      const on = b === tab;
      b.setAttribute('aria-selected', on ? 'true' : 'false');
      b.tabIndex = on ? 0 : -1;
    });
    panel.setAttribute('aria-labelledby', tab.id);
    if (folio) folio.textContent = `Trámite ${t.n}`;
    if (titulo) titulo.textContent = t.titulo;
    if (texto) texto.textContent = t.texto;
    if (puntos) puntos.innerHTML = puntosHTML(t);
    if (wa) wa.href = waLink(t.consulta);
    panel.classList.remove('is-cambiando');
    void panel.offsetWidth;
    panel.classList.add('is-cambiando');
    if (foco) tab.focus({ preventScroll: true });
    if (mobile.matches && lista) lista.scrollTo({ left: Math.max(0, tab.offsetLeft - 16), behavior: reduceMotion ? 'auto' : 'smooth' });
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  };
  tabs.forEach((b, i) => {
    b.addEventListener('click', () => activar(b));
    b.addEventListener('keydown', e => {
      let j = null;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') j = (i + 1) % tabs.length;
      else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') j = (i - 1 + tabs.length) % tabs.length;
      else if (e.key === 'Home') j = 0;
      else if (e.key === 'End') j = tabs.length - 1;
      if (j !== null) { e.preventDefault(); activar(tabs[j], true); }
    });
  });
}

function initVisor() {
  const dlg = document.getElementById('visor');
  const botones = [...document.querySelectorAll('[data-visor]')];
  if (!dlg || !botones.length || typeof dlg.showModal !== 'function') return;
  const img = document.getElementById('visorImg');
  const cap = document.getElementById('visorCap');
  const fotos = botones.map(b => {
    const i = b.querySelector('img');
    return { src: i?.getAttribute('src') || '', alt: i?.alt || '', cap: b.querySelector('.foto-btn__cap')?.textContent.trim() || '' };
  });
  let idx = 0;
  let origen = null;
  const pintar = () => {
    const f = fotos[idx];
    if (!f) return;
    if (img) { img.src = f.src; img.alt = f.alt; }
    if (cap) cap.textContent = `${f.cap} · ${idx + 1}/${fotos.length}`;
  };
  const mover = paso => { idx = (idx + paso + fotos.length) % fotos.length; pintar(); };
  const limpiar = () => {
    if (!document.body.classList.contains('no-scroll')) return;
    document.body.classList.remove('no-scroll');
    origen?.focus();
  };
  const cerrar = () => { if (dlg.open) dlg.close(); limpiar(); };
  botones.forEach((b, i) => b.addEventListener('click', () => {
    origen = b;
    idx = i;
    pintar();
    document.body.classList.add('no-scroll');
    dlg.showModal();
  }));
  dlg.querySelectorAll('[data-visor-paso]').forEach(b => b.addEventListener('click', () => mover(Number(b.dataset.visorPaso) || 1)));
  dlg.querySelector('.modal-cerrar')?.addEventListener('click', cerrar);
  dlg.addEventListener('click', e => { if (e.target === dlg) cerrar(); });
  dlg.addEventListener('keydown', e => {
    if (e.key === 'Escape') { e.preventDefault(); cerrar(); }
    else if (e.key === 'ArrowRight') mover(1);
    else if (e.key === 'ArrowLeft') mover(-1);
  });
  dlg.addEventListener('close', limpiar);
}

const FRASES = {
  transferencia: 'pedir un turno para una transferencia',
  sellado: 'pedir un turno para un sellado',
  baja: 'pedir un turno para una baja de dominio',
  infracciones: 'consultar las infracciones',
  informe: 'pedir un informe de dominio',
  seguro: 'cotizar el seguro',
  otro: 'pedir un turno para un trámite'
};
const FORMATOS_PATENTE = [
  [/^[A-Z]{2}\d{3}[A-Z]{2}$/, p => `${p.slice(0, 2)} ${p.slice(2, 5)} ${p.slice(5)}`],
  [/^[A-Z]{3}\d{3}$/, p => `${p.slice(0, 3)} ${p.slice(3)}`],
  [/^[A-Z]\d{3}[A-Z]{3}$/, p => `${p.slice(0, 1)} ${p.slice(1, 4)} ${p.slice(4)}`],
  [/^\d{3}[A-Z]{3}$/, p => `${p.slice(0, 3)} ${p.slice(3)}`]
];
const limpiarPatente = v => String(v ?? '').toUpperCase().replace(/[^A-Z0-9]/g, '');
const formatoPatente = v => {
  const p = limpiarPatente(v);
  const f = FORMATOS_PATENTE.find(([re]) => re.test(p));
  return f ? f[1](p) : null;
};
const mensajeTurno = ({ tramite, patente, nombre }) => {
  const frase = FRASES[tramite] || FRASES.otro;
  const pat = formatoPatente(patente);
  const nom = String(nombre ?? '').trim().replace(/\s+/g, ' ');
  const cuerpo = `${frase}${pat ? ` (patente ${pat})` : ''}.`;
  return nom ? `Hola Cintia, soy ${nom}. Quiero ${cuerpo}` : `Hola Cintia, quiero ${cuerpo}`;
};

function initTurno() {
  const form = document.getElementById('formTurno');
  if (!form) return;
  const { tramite, patente, nombre } = form.elements;
  const preview = document.getElementById('turnoPreview');
  const marcar = (campo, msg) => {
    const err = document.getElementById(`${campo.id}Error`);
    campo.setAttribute('aria-invalid', msg ? 'true' : 'false');
    if (err) { err.textContent = msg; err.hidden = !msg; }
    return !msg;
  };
  const validarPatente = () => marcar(patente, patente.value.trim() && !formatoPatente(patente.value) ? 'Revisá la patente: va como AB 123 CD o ABC 123.' : '');
  const validarNombre = () => marcar(nombre, nombre.value.trim().length < 2 ? 'Contanos tu nombre así sabemos a quién respondemos.' : '');
  const actualizar = () => {
    if (preview) preview.textContent = mensajeTurno({ tramite: tramite.value, patente: patente.value, nombre: nombre.value });
  };
  form.addEventListener('input', e => {
    if (e.target === patente && patente.getAttribute('aria-invalid') === 'true') validarPatente();
    if (e.target === nombre && nombre.getAttribute('aria-invalid') === 'true') validarNombre();
    actualizar();
  });
  form.addEventListener('change', actualizar);
  patente.addEventListener('blur', () => { if (patente.value.trim()) validarPatente(); });
  form.addEventListener('submit', e => {
    e.preventDefault();
    const ok = [validarNombre(), validarPatente()].every(Boolean);
    if (!ok) { form.querySelector('[aria-invalid="true"]')?.focus(); return; }
    const msg = mensajeTurno({ tramite: tramite.value, patente: patente.value, nombre: nombre.value });
    window.open(waLink(msg), '_blank', 'noopener');
    showToast('Listo: se abrió WhatsApp con tu mensaje.');
  });
  actualizar();
}

const BLOQUES = [[450, 750], [930, 1080]];
const hhmm = m => `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`;
function ahoraEnDorrego() {
  try {
    const partes = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Argentina/Buenos_Aires', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date());
    const get = t => partes.find(p => p.type === t)?.value;
    const dia = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
    const min = (parseInt(get('hour'), 10) % 24) * 60 + parseInt(get('minute'), 10);
    if (dia < 0 || Number.isNaN(min)) return null;
    return { dia, min };
  } catch (e) {
    return null;
  }
}
function estadoOficina(ahora) {
  if (!ahora) return null;
  const { dia, min } = ahora;
  if (dia >= 1 && dia <= 5) {
    const abierto = BLOQUES.find(([a, b]) => min >= a && min < b);
    if (abierto) return { abierto: true, txt: `Abierto ahora · hasta las ${hhmm(abierto[1])}` };
    const prox = BLOQUES.find(([a]) => min < a);
    if (prox) return { abierto: false, txt: `Cerrado · abre hoy a las ${hhmm(prox[0])}` };
  }
  if (dia === 0 || (dia >= 1 && dia <= 4)) return { abierto: false, txt: `Cerrado · abre mañana a las ${hhmm(BLOQUES[0][0])}` };
  return { abierto: false, txt: `Cerrado · abre el lunes a las ${hhmm(BLOQUES[0][0])}` };
}

function initEstado() {
  const els = document.querySelectorAll('[data-estado]');
  const filas = document.querySelectorAll('tr[data-dia]');
  if (!els.length && !filas.length) return;
  const pintar = () => {
    const ahora = ahoraEnDorrego();
    const est = estadoOficina(ahora);
    if (est) els.forEach(el => { el.textContent = est.txt; el.classList.toggle('is-abierto', est.abierto); });
    if (ahora) filas.forEach(tr => tr.classList.toggle('is-hoy', tr.dataset.dia.split(' ').includes(String(ahora.dia))));
  };
  pintar();
  setInterval(pintar, 60000);
}

function initMapa() {
  const el = document.getElementById('mapa');
  if (!el || typeof L === 'undefined') return;
  const POS = [-38.717549, -61.287034];
  let listo = false;
  const crear = () => {
    if (listo) return;
    listo = true;
    const mapa = L.map(el, { center: POS, zoom: 16, scrollWheelZoom: false, dragging: !L.Browser.mobile, tap: false });
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap', maxZoom: 19 }).addTo(mapa);
    const icono = L.divIcon({ className: 'mapa-icono', html: '<span class="pin"><span>SS</span></span>', iconSize: [44, 44], iconAnchor: [22, 52], popupAnchor: [0, -50] });
    L.marker(POS, { icon: icono, keyboard: false, title: 'SS Gestoría del Automotor' })
      .addTo(mapa)
      .bindPopup('<b>SS Gestoría del Automotor</b><br>Perón 850, Coronel Dorrego');
    const ajustar = () => {
      mapa.invalidateSize();
      mapa.setView(POS, 16, { animate: false });
      if (el.closest('.mapa-banda') && window.matchMedia('(min-width: 761px)').matches) mapa.panBy([-Math.min(240, el.clientWidth * 0.16), 0], { animate: false });
    };
    ajustar();
    setTimeout(ajustar, 400);
  };
  if (!('IntersectionObserver' in window)) { crear(); return; }
  const io = new IntersectionObserver(entries => {
    if (entries.some(en => en.isIntersecting)) { io.disconnect(); crear(); }
  }, { rootMargin: '400px 0px' });
  io.observe(el);
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

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; (document.querySelector('.site-header') || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 1081px)');
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

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const paso = (sel, vars, t) => {
    const els = hero.querySelectorAll(sel);
    if (els.length) tl.from(els, vars, t);
  };
  paso('[data-hero-img]', { scale: 1.08, duration: 1.8, clearProps: 'transform' }, 0);
  paso('.hero__credencial--static', { y: 16, opacity: 0, duration: 0.9, clearProps: 'transform,opacity' }, 0.05);
  paso('.hero-eyebrow', { y: 16, opacity: 0, duration: 0.9 }, 0.1);
  paso('h1', { y: 32, opacity: 0, filter: 'blur(8px)', duration: 1.2, clearProps: 'filter' }, 0.2);
  paso('.hero-lead', { y: 22, opacity: 0, duration: 1 }, 0.42);
  paso('.hero__alta', { y: 48, opacity: 0, duration: 1.3, clearProps: 'transform,opacity' }, 0.35);
  paso('.hero-ctas .btn', { y: 20, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.58);
  paso('.hero-badges li', { y: 14, opacity: 0, duration: 0.8, stagger: 0.08, clearProps: 'transform,opacity' }, 0.75);
  paso('.hero__fotos .hero__credencial, .ficha', { y: 18, opacity: 0, duration: 1, clearProps: 'transform,opacity' }, 0.7);
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('[data-parallax]').forEach(fig => {
    const img = fig.querySelector('img');
    if (!img) return;
    gsap.fromTo(img, { yPercent: -3 }, { yPercent: 3, ease: 'none', scrollTrigger: { trigger: fig, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
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
      }
    });
  });
}

function initDetalles() {
  document.querySelectorAll('.faq-lista details').forEach(d => d.addEventListener('toggle', () => {
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  }));
}

initModalTramites();
initTabs();
initVisor();
initTurno();
initEstado();
initReveals();
initNav();
initWspFloat();
initModelBarScroll();
initHeroMotion();
initParallax();
initLeeScroll();
initDetalles();
initMapa();
