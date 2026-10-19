const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const WA = '5493874449774';
const waLink = msg => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
const TZ = 'America/Argentina/Salta';
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const MESES_CORTOS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);

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
const refrescar = () => { if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); };

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

function hoySalta() {
  const ahora = new Date();
  try {
    const p = new Intl.DateTimeFormat('en-US', { timeZone: TZ, year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', hourCycle: 'h23', weekday: 'short' }).formatToParts(ahora);
    const g = t => p.find(x => x.type === t)?.value;
    return {
      y: Number(g('year')), m: Number(g('month')) - 1, d: Number(g('day')),
      h: Number(g('hour')) % 24, min: Number(g('minute')),
      wd: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(g('weekday')),
    };
  } catch {
    return { y: ahora.getFullYear(), m: ahora.getMonth(), d: ahora.getDate(), h: ahora.getHours(), min: ahora.getMinutes(), wd: ahora.getDay() };
  }
}

const FERIADOS = new Set(['2026-10-12', '2026-11-23', '2026-12-08', '2026-12-25', '2027-01-01', '2027-02-08', '2027-02-09', '2027-03-24', '2027-03-26', '2027-04-02']);
const isoUTC = f => f.toISOString().slice(0, 10);
function diaHabil(y, m, d) {
  const f = new Date(Date.UTC(y, m, d));
  let corrido = false;
  while (f.getUTCDay() === 0 || f.getUTCDay() === 6 || FERIADOS.has(isoUTC(f))) { f.setUTCDate(f.getUTCDate() + 1); corrido = true; }
  return { f, corrido };
}
const OBLIGACIONES = [
  { nombre: 'Monotributo', detalle: 'Cuota mensual · todas las terminaciones', dia: () => 20 },
  { nombre: 'Autónomos', detalle: 'Aportes del mes', dia: t => (t <= 3 ? 5 : t <= 6 ? 6 : 7) },
  { nombre: 'Cargas sociales (F.931)', detalle: 'Empleadores · declaración y pago', dia: t => (t <= 3 ? 9 : t <= 6 ? 10 : 11) },
  { nombre: 'IVA', detalle: 'Responsables inscriptos · declaración y pago', dia: t => [18, 18, 19, 19, 20, 20, 21, 21, 22, 22][t] },
];
const vencimientosDe = (t, y, m) => OBLIGACIONES.map(o => ({ ...o, ...diaHabil(y, m, o.dia(t)) })).sort((a, b) => a.f - b.f);
const diasHasta = (f, hoy) => Math.round((f - Date.UTC(hoy.y, hoy.m, hoy.d)) / 86400000);
const textoDias = n => (n < 0 ? 'Vencido' : n === 0 ? 'Hoy' : n === 1 ? 'Mañana' : `En ${n} días`);

function proximoMonotributo(hoy) {
  let y = hoy.y;
  let m = hoy.m;
  for (let k = 0; k < 3; k++) {
    const { f } = diaHabil(y, m, 20);
    if (diasHasta(f, hoy) >= 0) return f;
    m += 1;
    if (m > 11) { m = 0; y += 1; }
  }
  return null;
}

function initProxVenc() {
  if (!document.querySelector('[data-pv-dia], [data-pv-fecha]')) return;
  const hoy = hoySalta();
  const f = proximoMonotributo(hoy);
  if (!f) return;
  const n = diasHasta(f, hoy);
  const dia = f.getUTCDate();
  const mes = MESES[f.getUTCMonth()];
  const cuando = n === 0 ? 'vence hoy' : n === 1 ? 'vence mañana' : `faltan ${n} días`;
  document.querySelectorAll('[data-pv-dia]').forEach(el => { el.textContent = dia; });
  document.querySelectorAll('[data-pv-mes]').forEach(el => { el.textContent = el.dataset.pvMes === 'corto' ? MESES_CORTOS[f.getUTCMonth()] : mes; });
  document.querySelectorAll('[data-pv-fecha]').forEach(el => { el.textContent = `${dia} de ${mes}`; });
  document.querySelectorAll('[data-pv-cuando]').forEach(el => { el.textContent = cuando; });
}

function initVencimientos() {
  const lista = document.getElementById('vencLista');
  if (!lista) return;
  const hoy = hoySalta();
  const botonesMes = [...document.querySelectorAll('[data-mes]')];
  const aviso = document.getElementById('vencAviso');
  let t = Number(document.querySelector('input[name="cuit"]:checked')?.value ?? 0);
  let desfase = 0;
  botonesMes.forEach(b => { b.textContent = cap(MESES[(hoy.m + Number(b.dataset.mes)) % 12]); });
  const render = () => {
    let y = hoy.y;
    let m = hoy.m + desfase;
    if (m > 11) { m -= 12; y += 1; }
    lista.innerHTML = vencimientosDe(t, y, m).map(v => {
      const n = diasHasta(v.f, hoy);
      const extra = n < 0 ? ' badge-dias--pasado' : n <= 1 ? ' badge-dias--hoy' : '';
      const nota = v.corrido ? ' · se corre al día hábil' : '';
      return `<li class="venc-item${n < 0 ? ' is-pasado' : ''}"><span class="fecha-chip"><span class="fecha-chip__mes">${MESES_CORTOS[v.f.getUTCMonth()]}</span><span class="fecha-chip__dia">${v.f.getUTCDate()}</span></span><span class="venc-item__txt"><span class="venc-item__nombre">${esc(v.nombre)}</span><span class="venc-item__det">${esc(v.detalle + nota)}</span></span><span class="badge-dias${extra}">${textoDias(n)}</span></li>`;
    }).join('');
    if (aviso) aviso.href = waLink(`Hola, mi CUIT termina en ${t}. Quiero que me avisen antes de cada vencimiento.`);
    refrescar();
  };
  document.querySelectorAll('input[name="cuit"]').forEach(r => r.addEventListener('change', () => { t = Number(r.value); render(); }));
  botonesMes.forEach(b => b.addEventListener('click', () => {
    desfase = Number(b.dataset.mes);
    botonesMes.forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    render();
  }));
  render();
}

const DOLAR_RESPALDO = {
  fecha: '2026-10-19T21:00:00.000Z',
  oficial: { compra: 1490, venta: 1540 },
  blue: { compra: 1540, venta: 1560 },
  bolsa: { compra: 1536.7, venta: 1544.1 },
  contadoconliqui: { compra: 1623.6, venta: 1625.6 },
};
const fmtPeso = n => '$' + Number(n).toLocaleString('es-AR', { maximumFractionDigits: 2 });
function textoFechaDolar(iso, respaldo) {
  const f = new Date(iso);
  if (Number.isNaN(f.getTime())) return respaldo ? 'Último dato guardado' : 'Actualizado hoy';
  try {
    const dia = new Intl.DateTimeFormat('es-AR', { timeZone: TZ, day: 'numeric', month: 'short' }).format(f);
    const hora = new Intl.DateTimeFormat('es-AR', { timeZone: TZ, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(f);
    return respaldo ? `Último dato: ${dia}, ${hora} h` : `Actualizado ${dia}, ${hora} h`;
  } catch {
    return respaldo ? 'Último dato guardado' : 'Actualizado hoy';
  }
}
function pintarDolar(datos, respaldo) {
  document.querySelectorAll('[data-dolar]').forEach(el => {
    const valor = datos[el.dataset.dolar]?.[el.dataset.lado || 'venta'];
    if (valor != null) el.textContent = fmtPeso(valor);
  });
  const txt = textoFechaDolar(datos.fecha, respaldo);
  document.querySelectorAll('[data-dolar-fecha]').forEach(el => { el.textContent = txt; });
}
async function initDolar() {
  if (!document.querySelector('[data-dolar]')) return;
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 7000);
    const r = await fetch('https://dolarapi.com/v1/dolares', { signal: ctrl.signal, cache: 'no-store' });
    clearTimeout(timer);
    if (!r.ok) throw new Error(String(r.status));
    const lista = await r.json();
    const datos = { fecha: '' };
    lista.forEach(c => {
      datos[c.casa] = { compra: c.compra, venta: c.venta };
      if (c.fechaActualizacion && c.fechaActualizacion > datos.fecha) datos.fecha = c.fechaActualizacion;
    });
    if (!datos.oficial) throw new Error('sin datos');
    pintarDolar(datos, false);
  } catch {
    pintarDolar(DOLAR_RESPALDO, true);
  }
}

const HORARIO = { 1: [[9, 13], [17, 20]], 2: [[9, 13], [17, 20]], 3: [[9, 13], [17, 20]], 4: [[9, 13], [17, 20]], 5: [[9, 13], [17, 20]] };
function estadoHorario(h) {
  const ahora = h.h + h.min / 60;
  const tramos = HORARIO[h.wd] || [];
  const abierto = tramos.find(([a, b]) => ahora >= a && ahora < b);
  if (abierto) return { abierto: true, txt: `Abierto ahora · hasta las ${abierto[1]} h` };
  const luego = tramos.find(([a]) => ahora < a);
  if (luego) return { abierto: false, txt: `Cerrado · abrimos hoy a las ${luego[0]} h` };
  for (let k = 1; k <= 7; k++) {
    const wd = (h.wd + k) % 7;
    const t = HORARIO[wd];
    if (t?.length) return { abierto: false, txt: `Cerrado · abrimos ${k === 1 ? 'mañana' : 'el ' + DIAS[wd]} a las ${t[0][0]} h` };
  }
  return { abierto: false, txt: 'Horarios de atención' };
}
function initHorario() {
  const els = document.querySelectorAll('[data-estado-horario]');
  if (!els.length) return;
  const pintar = () => {
    const e = estadoHorario(hoySalta());
    els.forEach(el => {
      el.classList.toggle('is-abierto', e.abierto);
      const txt = el.querySelector('[data-estado-txt]');
      if (txt) txt.textContent = e.txt;
    });
  };
  pintar();
  setInterval(pintar, 60000);
}

function initHoy() {
  const els = document.querySelectorAll('[data-hoy]');
  if (!els.length) return;
  const h = hoySalta();
  els.forEach(el => { el.textContent = `${cap(DIAS[h.wd])} ${h.d} de ${MESES[h.m]}`; });
}

function initNovedades() {
  const cont = document.querySelector('.anuncios');
  const botones = document.querySelectorAll('.filtro');
  if (!cont || !botones.length) return;
  const verMas = document.getElementById('verMasAnuncios');
  verMas?.addEventListener('click', () => {
    cont.classList.remove('recortado');
    revelarNuevos(cont);
    cont.querySelector('.anuncio:nth-child(4) h3')?.setAttribute('tabindex', '-1');
    cont.querySelector('.anuncio:nth-child(4) h3')?.focus({ preventScroll: true });
    refrescar();
  });
  botones.forEach(b => b.addEventListener('click', () => {
    const cat = b.dataset.cat;
    cont.classList.remove('recortado');
    botones.forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    cont.querySelectorAll('.anuncio').forEach(a => { a.hidden = cat !== 'todas' && a.dataset.cat !== cat; });
    revelarNuevos(cont);
    refrescar();
  }));
}

function initCursos() {
  const items = [...document.querySelectorAll('.curso')];
  const pedir = document.getElementById('cursosPedir');
  const cuenta = document.getElementById('cursosCuenta');
  const ayuda = document.getElementById('cursosAyuda');
  if (!items.length || !pedir) return;
  const elegidos = () => items.filter(i => i.classList.contains('is-elegido')).map(i => i.dataset.curso);
  const actualizar = () => {
    const l = elegidos();
    if (cuenta) cuenta.textContent = l.length === 0 ? 'Ningún curso elegido' : l.length === 1 ? '1 curso elegido' : `${l.length} cursos elegidos`;
    if (ayuda) ayuda.textContent = l.length ? l.join(' · ') : 'Marcá uno o más cursos de la lista.';
    pedir.href = waLink(l.length ? `Hola, quiero recibir en PDF estos cursos:\n${l.map(x => '• ' + x).join('\n')}` : 'Hola, quiero recibir cursos en PDF.');
    pedir.setAttribute('aria-disabled', String(!l.length));
  };
  items.forEach(it => {
    const b = it.querySelector('.curso__elegir');
    if (!b) return;
    b.addEventListener('click', () => {
      const on = !it.classList.contains('is-elegido');
      it.classList.toggle('is-elegido', on);
      b.setAttribute('aria-pressed', String(on));
      const txt = b.querySelector('.curso__elegir-txt');
      if (txt) txt.textContent = on ? 'Elegido' : 'Elegir';
      actualizar();
    });
  });
  pedir.addEventListener('click', e => {
    if (!elegidos().length) { e.preventDefault(); showToast('Elegí al menos un curso para pedirlo.'); }
  });
  actualizar();
}

function initForms() {
  document.querySelectorAll('form[data-demo]').forEach(form => {
    const requeridos = [...form.querySelectorAll('[required]')];
    const marcar = (c, mal) => {
      c.setAttribute('aria-invalid', String(mal));
      const err = document.getElementById(`${c.id}-error`);
      if (err) err.textContent = mal ? (c.dataset.error || 'Completá este campo.') : '';
      if (err && mal) c.setAttribute('aria-describedby', err.id);
    };
    requeridos.forEach(c => c.addEventListener('input', () => {
      if (c.getAttribute('aria-invalid') === 'true' && c.value.trim()) marcar(c, false);
    }));
    form.addEventListener('submit', e => {
      e.preventDefault();
      let primero = null;
      requeridos.forEach(c => {
        const mal = !c.value.trim();
        marcar(c, mal);
        if (mal && !primero) primero = c;
      });
      if (primero) { primero.focus(); return; }
      const btn = form.querySelector('[type="submit"]');
      const texto = btn.textContent;
      btn.disabled = true;
      btn.textContent = 'Enviando…';
      setTimeout(() => {
        btn.disabled = false;
        btn.textContent = texto;
        form.reset();
        requeridos.forEach(c => c.removeAttribute('aria-invalid'));
        showToast('¡Gracias! El envío de mensajes se activa al pasar la web a producción.');
      }, 800);
    });
  });
}

function initTabs() {
  const lista = document.querySelector('[role="tablist"]');
  if (!lista) return;
  const tabs = [...lista.querySelectorAll('[role="tab"]')];
  const activar = (tab, foco) => {
    tabs.forEach(t => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      const panel = document.getElementById(t.getAttribute('aria-controls'));
      if (panel) panel.hidden = !on;
    });
    revelarNuevos(document.getElementById(tab.getAttribute('aria-controls')));
    if (foco) tab.focus();
    refrescar();
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => activar(t));
    t.addEventListener('keydown', e => {
      const mapa = { ArrowRight: (i + 1) % tabs.length, ArrowLeft: (i - 1 + tabs.length) % tabs.length, Home: 0, End: tabs.length - 1 };
      if (e.key in mapa) { e.preventDefault(); activar(tabs[mapa[e.key]], true); }
    });
  });
  document.querySelectorAll('[data-ir-tab]').forEach(a => a.addEventListener('click', () => {
    const t = tabs.find(x => x.dataset.tab === a.dataset.irTab);
    if (t) activar(t);
  }));
}

function initLeeScroll() {
  const el = document.querySelector('[data-lee]');
  if (!el) return;
  const palabras = el.textContent.trim().split(/\s+/);
  el.setAttribute('aria-label', el.textContent.trim());
  el.innerHTML = palabras.map(p => `<span aria-hidden="true">${esc(p)}</span>`).join(' ');
  const spans = [...el.querySelectorAll('span')];
  if (reduceMotion) { spans.forEach(s => s.classList.add('on')); return; }
  let frame = 0;
  const update = () => {
    frame = 0;
    const r = el.getBoundingClientRect();
    const vh = window.innerHeight;
    const p = Math.min(1, Math.max(0, (vh * 0.92 - r.top) / (vh * 0.45)));
    const n = Math.round(p * spans.length);
    spans.forEach((s, i) => s.classList.toggle('on', i < n));
  };
  window.addEventListener('scroll', () => { if (!frame) frame = requestAnimationFrame(update); }, { passive: true });
  window.addEventListener('resize', () => { if (!frame) frame = requestAnimationFrame(update); }, { passive: true });
  update();
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

function initWspFloat() {
  const btn = document.getElementById('wsp-float');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) btn.classList.add('visible'); else btn.classList.remove('visible');
  }, { passive: true });
}

let revealsListos = false;
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
  if (img) tl.from(img, { scale: 1.1, duration: 1.8, clearProps: 'transform' }, 0);
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 36, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 24, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 20, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.hero-badge'), { y: 16, scale: 0.96, opacity: 0, duration: 1, stagger: 0.08, clearProps: 'transform,opacity' }, 0.7);
}

initModelBarScroll();
initNav();
initWspFloat();
initProxVenc();
initVencimientos();
initDolar();
initHorario();
initHoy();
initNovedades();
initCursos();
initTabs();
initForms();
initLeeScroll();
initReveals();
initHeroMotion();
