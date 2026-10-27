document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WA = '5493434164671';
const waLink = msg => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

const SERVICIOS = {
  tercerizada: {
    nombre: 'Logística tercerizada',
    problema: '¿Coordinar envíos y fletes te consume el día?',
    resumen: 'Te ayudamos a evaluar y coordinar soluciones de logística tercerizada adaptadas a las necesidades de tu negocio.',
    foto: 'images/mapa-rutas.webp',
    alt: 'Manos marcando recorridos de distribución sobre un mapa de rutas',
    incluye: [
      'Relevamiento de volúmenes, destinos y frecuencias de envío',
      'Comparación de opciones de depósito, transporte y última milla',
      'Acompañamiento en la elección y la puesta en marcha del proveedor',
      'Seguimiento de la operación con indicadores acordados'
    ],
    para: 'Empresas que hoy hacen todo con estructura propia, o que ya tercerizan y sienten que perdieron el control.',
    inicio: 'Relevamos tus volúmenes, destinos y frecuencias, y comparamos opciones de depósito y transporte pensadas para tu escala.'
  },
  procesos: {
    nombre: 'Optimización de procesos',
    problema: '¿Los pedidos salen tarde o incompletos?',
    resumen: 'Analizamos tus procesos logísticos para detectar oportunidades de mejora y diseñar soluciones prácticas y sostenibles.',
    foto: 'images/mapa-procesos.webp',
    alt: 'Equipo ordenando las etapas de un proceso con tarjetas sobre una mesa',
    incluye: [
      'Mapa del recorrido de un pedido, de la compra a la entrega',
      'Detección de demoras, reprocesos y tareas duplicadas',
      'Plan de mejoras ordenado por impacto y esfuerzo',
      'Indicadores simples para saber si mejoró'
    ],
    para: 'Empresas que crecieron en ventas y sienten que la operación no las acompaña.',
    inicio: 'Seguimos el camino de un pedido, desde que entra hasta que se entrega, y marcamos dónde se demora o se repite trabajo.'
  },
  operativa: {
    nombre: 'Organización operativa',
    problema: '¿El stock del sistema no coincide con el del depósito?',
    resumen: 'Te acompañamos en la organización operativa de tu logística para lograr mayor eficiencia, orden y control.',
    foto: 'images/pasillo-deposito.webp',
    alt: 'Pasillo de depósito con estanterías ordenadas y cajas rotuladas',
    incluye: [
      'Orden del depósito: ubicaciones, rotulado y circulación',
      'Rutina de conteos y control de inventario',
      'Procedimientos y responsables para cada tarea',
      'Tablero semanal para seguir la operación'
    ],
    para: 'Empresas donde todo depende de una persona o de la memoria de alguien.',
    inicio: 'Empezamos por el depósito: ubicaciones, conteos y quién hace qué, para que el stock del sistema sea el real.'
  }
};

const SINTOMAS = {
  stock: { srv: 'operativa', txt: 'el stock del sistema no coincide con el del depósito' },
  tarde: { srv: 'procesos', txt: 'los pedidos salen tarde o incompletos' },
  envios: { srv: 'tercerizada', txt: 'coordinar envíos y fletes me consume el día' },
  costo: { srv: 'procesos', txt: 'no sé cuánto me cuesta la logística de cada pedido' },
  espacio: { srv: 'operativa', txt: 'el depósito quedó chico o desordenado' },
  tercerizar: { srv: 'tercerizada', txt: 'quiero tercerizar y no sé con quién ni cómo' },
  persona: { srv: 'operativa', txt: 'todo depende de una sola persona' },
  errores: { srv: 'procesos', txt: 'hay reclamos por errores o roturas en las entregas' }
};

const VOLUMEN = {
  bajo: { txt: 'hasta 50', nota: 'Con este volumen, ordenar la operación desde ahora evita sumar estructura cuando crezcas.' },
  medio: { txt: 'entre 50 y 300', nota: 'En este volumen, un error chico se repite muchas veces por semana: medir por etapa ayuda a encontrarlo.' },
  alto: { txt: 'más de 300', nota: 'Con este volumen, cada minuto por pedido pesa: el diagnóstico arranca midiendo tiempos por etapa.' }
};

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
  const desktopMq = window.matchMedia('(min-width: 981px)');
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
  if (img) gsap.set(img, { scale: 1.08 });
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  if (img) tl.from(img, { scale: 1.16, duration: 1.8 }, 0);
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 36, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero__regla'), { scaleX: 0, transformOrigin: '0 50%', duration: 1, clearProps: 'transform' }, 0.4)
    .from(hero.querySelectorAll('.hero__kicker, .hero-lead'), { y: 24, opacity: 0, duration: 1, stagger: 0.08 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.placa'), { y: 18, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.7);
  if (img && typeof ScrollTrigger !== 'undefined') {
    gsap.fromTo(img, { yPercent: -3 }, { yPercent: 3, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
  }
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

function estadoAtencion() {
  const partes = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Argentina/Buenos_Aires', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date());
  const valor = t => partes.find(p => p.type === t)?.value || '0';
  const dia = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(valor('weekday'));
  const minutos = (parseInt(valor('hour'), 10) % 24) * 60 + parseInt(valor('minute'), 10);
  const habil = dia >= 1 && dia <= 5;
  if (habil && minutos >= 540 && minutos < 1080) return { abierto: true, txt: 'Abierto ahora · hasta las 18 h' };
  if (habil && minutos < 540) return { abierto: false, txt: 'Cerrado · abrimos hoy a las 9 h' };
  let prox = dia;
  let saltos = 0;
  do { prox = (prox + 1) % 7; saltos++; } while (prox === 0 || prox === 6);
  const nombres = ['el domingo', 'el lunes', 'el martes', 'el miércoles', 'el jueves', 'el viernes', 'el sábado'];
  return { abierto: false, txt: `Cerrado · abrimos ${saltos === 1 ? 'mañana' : nombres[prox]} a las 9 h` };
}

function initHorario() {
  const els = document.querySelectorAll('[data-estado]');
  if (!els.length) return;
  const pintar = () => {
    const e = estadoAtencion();
    els.forEach(el => { el.textContent = e.txt; el.classList.toggle('is-abierto', e.abierto); });
  };
  pintar();
  setInterval(pintar, 60000);
}

function initPasos() {
  const botones = document.querySelectorAll('.paso');
  const fotos = document.querySelectorAll('.pasos__stack img');
  const etiqueta = document.querySelector('.pasos__etiqueta');
  if (!botones.length || !fotos.length) return;
  botones.forEach(btn => btn.addEventListener('click', () => {
    const i = Number(btn.dataset.paso);
    botones.forEach(b => { const activo = b === btn; b.classList.toggle('is-activo', activo); b.setAttribute('aria-pressed', String(activo)); });
    fotos.forEach((f, k) => f.classList.toggle('is-activo', k === i));
    if (etiqueta) {
      etiqueta.querySelector('b').textContent = btn.querySelector('.paso__num')?.textContent || '';
      etiqueta.querySelector('span').textContent = btn.querySelector('.paso__t')?.textContent || '';
    }
  }));
}

let abrirServicio = null;

function initServicioModal() {
  const modal = document.getElementById('srvModal');
  if (!modal) return;
  const panel = modal.querySelector('.modal__panel');
  const cerrar = document.getElementById('srvCerrar');
  let origen = null;
  let timer = 0;
  const focusables = () => [...panel.querySelectorAll('a[href], button:not([disabled])')].filter(el => el.offsetParent !== null);
  const close = () => {
    modal.classList.remove('open');
    document.body.classList.remove('no-scroll');
    clearTimeout(timer);
    timer = setTimeout(() => { modal.hidden = true; }, 320);
    origen?.focus();
  };
  const open = (id, trigger) => {
    const s = SERVICIOS[id];
    if (!s) return;
    origen = trigger || null;
    const foto = document.getElementById('srvFoto');
    foto.src = s.foto;
    foto.alt = s.alt;
    document.getElementById('srvProblema').textContent = s.problema;
    document.getElementById('srvNombre').textContent = s.nombre;
    document.getElementById('srvResumen').textContent = s.resumen;
    document.getElementById('srvIncluye').innerHTML = s.incluye.map(t => `<li>${esc(t)}</li>`).join('');
    document.getElementById('srvPara').innerHTML = `<strong>Para quién:</strong> ${esc(s.para)}`;
    document.getElementById('srvWsp').href = waLink(`Hola G&S, les escribo desde la web. Me interesa el servicio de ${s.nombre} para mi empresa.`);
    modal.setAttribute('aria-label', s.nombre);
    clearTimeout(timer);
    modal.hidden = false;
    void modal.offsetWidth;
    modal.classList.add('open');
    document.body.classList.add('no-scroll');
    cerrar.focus();
  };
  abrirServicio = open;
  document.querySelectorAll('[data-servicio]').forEach(btn => {
    if (btn.id === 'guiaVer') return;
    btn.addEventListener('click', () => open(btn.dataset.servicio, btn));
  });
  cerrar.addEventListener('click', close);
  modal.addEventListener('click', e => { if (e.target === modal) close(); });
  document.addEventListener('keydown', e => {
    if (modal.hidden) return;
    if (e.key === 'Escape') { close(); return; }
    if (e.key === 'Tab') {
      const f = focusables();
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
}

function initGuia() {
  const form = document.getElementById('guiaForm');
  if (!form) return;
  const titulo = document.getElementById('guiaServicio');
  const inicio = document.getElementById('guiaInicio');
  const vol = document.getElementById('guiaVol');
  const tambien = document.getElementById('guiaTambien');
  const wsp = document.getElementById('guiaWsp');
  const ver = document.getElementById('guiaVer');
  const rubro = document.getElementById('guiaRubro');
  const volumen = document.getElementById('guiaVolumen');
  const orden = [];
  const defaultHref = wsp.href;

  const pintar = () => {
    if (!orden.length) {
      titulo.textContent = 'Contanos qué te pasa';
      inicio.textContent = 'Elegí al menos una situación y te mostramos el primer paso que daríamos en tu empresa.';
      inicio.classList.add('guia__vacio');
      vol.hidden = true;
      tambien.hidden = true;
      ver.hidden = true;
      wsp.href = defaultHref;
      return;
    }
    const cuenta = {};
    orden.forEach(k => { const s = SINTOMAS[k].srv; cuenta[s] = (cuenta[s] || 0) + 1; });
    let mejor = null;
    orden.forEach(k => { const s = SINTOMAS[k].srv; if (!mejor || cuenta[s] > cuenta[mejor]) mejor = s; });
    const srv = SERVICIOS[mejor];
    const v = VOLUMEN[volumen.value] || VOLUMEN.bajo;
    titulo.textContent = srv.nombre;
    inicio.textContent = srv.inicio;
    inicio.classList.remove('guia__vacio');
    vol.textContent = v.nota;
    vol.hidden = false;
    const otros = Object.keys(cuenta).filter(s => s !== mejor).map(s => SERVICIOS[s].nombre);
    tambien.textContent = otros.length ? `También miraríamos: ${otros.join(' y ')}.` : '';
    tambien.hidden = !otros.length;
    ver.dataset.servicio = mejor;
    ver.hidden = false;
    const dolores = orden.map(k => SINTOMAS[k].txt).join('; ');
    wsp.href = waLink(`Hola G&S, les escribo desde la web. Tengo ${rubro.value}, con ${v.txt} pedidos o despachos por semana. Lo que más me cuesta: ${dolores}. Me interesa ${srv.nombre}. ¿Coordinamos una primera charla?`);
  };

  form.querySelectorAll('input[data-f="sintoma"]').forEach(input => input.addEventListener('change', () => {
    const i = orden.indexOf(input.value);
    if (input.checked && i === -1) orden.push(input.value);
    if (!input.checked && i > -1) orden.splice(i, 1);
    pintar();
  }));
  rubro.addEventListener('change', pintar);
  volumen.addEventListener('change', pintar);
  ver.addEventListener('click', () => {
    const id = ver.dataset.servicio;
    if (abrirServicio) { abrirServicio(id, ver); return; }
    document.getElementById(`servicio-${id}`)?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  });
}

function initForm() {
  const form = document.getElementById('contactoForm');
  if (!form) return;
  const reglas = [
    { el: form.querySelector('#fNombre'), ok: v => v.trim().length >= 2, msg: 'Contanos tu nombre.' },
    { el: form.querySelector('#fTel'), ok: v => v.replace(/\D/g, '').length >= 8, msg: 'Revisá el número: con el código de área alcanza.' }
  ];
  const marcar = (r, mostrar) => {
    const campo = r.el.closest('.campo');
    const bien = r.ok(r.el.value);
    if (mostrar || campo.classList.contains('is-error')) {
      campo.classList.toggle('is-error', !bien);
      r.el.setAttribute('aria-invalid', String(!bien));
      campo.querySelector('.campo__error').textContent = bien ? '' : r.msg;
    }
    return bien;
  };
  reglas.forEach(r => r.el.addEventListener('input', () => marcar(r, false)));
  form.addEventListener('submit', e => {
    e.preventDefault();
    const malos = reglas.filter(r => !marcar(r, true));
    if (malos.length) { malos[0].el.focus(); return; }
    const btn = form.querySelector('button[type="submit"]');
    const txt = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Enviando…';
    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = txt;
      form.reset();
      showToast('¡Gracias! El envío de mensajes se activa al pasar la web a producción.');
    }, 800);
  });
}

function initMapa() {
  const el = document.getElementById('mapa');
  if (!el || typeof L === 'undefined') return;
  const centro = [-31.7319, -60.5238];
  const mapa = L.map(el, { scrollWheelZoom: false, attributionControl: true }).setView(centro, 13);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap', maxZoom: 19 }).addTo(mapa);
  L.circle(centro, { radius: 2400, color: '#2457C5', weight: 1, fillColor: '#2457C5', fillOpacity: 0.08 }).addTo(mapa);
  L.circleMarker(centro, { radius: 8, color: '#FFFFFF', weight: 2, fillColor: '#2457C5', fillOpacity: 1 }).addTo(mapa);
  window.addEventListener('load', () => mapa.invalidateSize());
}

function initAnio() {
  document.querySelectorAll('[data-anio]').forEach(el => { el.textContent = new Date().getFullYear(); });
}

[initModelBarScroll, initWspFloat, initNav, initHorario, initPasos, initServicioModal, initGuia, initForm, initAnio, initHeroMotion, initReveals, initMapa].forEach(fn => {
  try { fn(); } catch (e) { console.error(e); }
});
