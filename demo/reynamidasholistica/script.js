const WSP = '5491171418354';
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const wspHref = msg => 'https://wa.me/' + WSP + '?text=' + encodeURIComponent(msg);

const SIGNOS = ['Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo', 'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'];
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const DIAS_CORTOS = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
const DIAS_LARGOS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

const norm360 = x => ((x % 360) + 360) % 360;
const diaJuliano = fecha => fecha.getTime() / 86400000 + 2440587.5;

function longitudSolar(jd) {
  const n = jd - 2451545.0;
  const L = norm360(280.460 + 0.9856474 * n);
  const g = norm360(357.528 + 0.9856003 * n) * Math.PI / 180;
  return norm360(L + 1.915 * Math.sin(g) + 0.020 * Math.sin(2 * g));
}

const ayanamsaLahiri = jd => 23.853 + ((jd - 2451545.0) / 365.25) * 0.0139689;

function posicion(lon) {
  const base = Math.floor(lon / 30);
  const enSigno = lon - base * 30;
  let indice = base % 12;
  let grados = Math.floor(enSigno);
  let minutos = Math.round((enSigno - grados) * 60);
  if (minutos === 60) { grados += 1; minutos = 0; }
  if (grados === 30) { grados = 0; indice = (indice + 1) % 12; }
  return { indice, signo: SIGNOS[indice], grados, minutos, enSigno };
}

function solEn(fechaUTC) {
  const jd = diaJuliano(fechaUTC);
  const tropical = longitudSolar(jd);
  const ayanamsa = ayanamsaLahiri(jd);
  const sideral = norm360(tropical - ayanamsa);
  return { tropical, sideral, ayanamsa, trop: posicion(tropical), sid: posicion(sideral) };
}

const fechaNacimientoUTC = (anio, mes, dia, hora, minuto) => new Date(Date.UTC(anio, mes - 1, dia, hora + 3, minuto));

function enBorde(lon, margen) {
  const g = lon - Math.floor(lon / 30) * 30;
  if (g < margen) return -1;
  if (30 - g < margen) return 1;
  return 0;
}

const formatoGrados = p => `${p.grados}° ${String(p.minutos).padStart(2, '0')}′`;

function notaNacimiento(res, conHora) {
  const borde = enBorde(res.sideral, conHora ? 0.1 : 0.6);
  if (borde) {
    const vecino = SIGNOS[(res.sid.indice + (borde > 0 ? 1 : 11)) % 12];
    const [a, b] = borde > 0 ? [res.sid.signo, vecino] : [vecino, res.sid.signo];
    return `Naciste con el Sol en el borde entre ${a} y ${b}: con tu hora exacta lo confirmamos en la carta.`;
  }
  if (res.trop.indice === res.sid.indice) return `En tu caso los dos zodíacos coinciden: tu Sol es ${res.sid.signo} en los dos.`;
  return `Tu signo del horóscopo es ${res.trop.signo}, pero el día que naciste el Sol estaba en ${res.sid.signo} contra las estrellas.`;
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
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; el.style.clipPath = 'none'; });
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
  if (!bd) {
    bd = document.createElement('div');
    bd.className = 'nav-backdrop';
    const header = document.querySelector('.site-header');
    (header || document.body).appendChild(bd);
  }
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

function initWspFloat() {
  const btn = document.getElementById('wsp-float');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) btn.classList.add('visible'); else btn.classList.remove('visible');
  }, { passive: true });
}

function initWspLinks() {
  document.querySelectorAll('a[data-wsp-msg]').forEach(a => { a.href = wspHref(a.dataset.wspMsg); });
}

function initTopH() {
  const aviso = document.querySelector('.aviso');
  const header = document.querySelector('.site-header');
  if (!header) return;
  const medir = () => {
    const alto = (aviso ? aviso.offsetHeight : 0) + header.offsetHeight;
    document.documentElement.style.setProperty('--top-h', alto + 'px');
  };
  medir();
  window.addEventListener('resize', medir, { passive: true });
  window.addEventListener('load', medir);
}

function initSolHoy() {
  const hoy = new Date();
  const res = solEn(hoy);
  const mismo = res.trop.indice === res.sid.indice;
  const poner = (sel, txt) => document.querySelectorAll(sel).forEach(el => { el.textContent = txt; });
  poner('[data-sol-hoy-frase]', mismo
    ? `Hoy el Sol está en ${res.sid.signo}, en el cielo real y en el horóscopo.`
    : `Hoy el Sol está en ${res.sid.signo} en el cielo real, aunque el horóscopo ya diga ${res.trop.signo}.`);
  poner('[data-sol-hoy-cuando]', `Hoy, ${hoy.getDate()} de ${MESES[hoy.getMonth()]}`);
  poner('[data-sol-hoy-signo]', res.sid.signo);
  poner('[data-sol-hoy-grados]', `${res.sid.grados}°`);
  poner('[data-sol-hoy-sub]', mismo
    ? 'En el cielo real y también en el horóscopo.'
    : `En el cielo real. El horóscopo ya dice ${res.trop.signo}.`);
}

function initSol() {
  const sec = document.getElementById('sol');
  if (!sec) return;
  const $ = sel => sec.querySelector(sel);
  const form = $('#solForm');
  const inFecha = $('#solFecha');
  const inHora = $('#solHora');
  const inLugar = $('#solLugar');
  const error = $('#solFechaError');
  const resultado = $('.sol__resultado');
  const el = {
    cuando: $('[data-sol-cuando]'),
    signo: $('[data-sol-signo]'),
    grados: $('[data-sol-grados]'),
    tropical: $('[data-sol-tropical]'),
    nota: $('[data-sol-nota]'),
    cta: $('[data-sol-cta]'),
  };
  const banda = $('.banda');
  const ventana = $('.banda__ventana');
  const filaT = $('[data-banda-tropical]');
  const filaS = $('[data-banda-sideral]');
  if (!form || !inFecha || !resultado || !el.signo || !el.cta) return;

  const hoy = new Date();
  const isoHoy = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;
  inFecha.max = isoHoy;

  const armarFila = fila => {
    if (!fila) return;
    const frag = document.createDocumentFragment();
    for (let c = 0; c < 3; c++) {
      SIGNOS.forEach((nombre, i) => {
        const s = document.createElement('span');
        s.className = 'banda__signo';
        s.dataset.i = String(i);
        s.dataset.c = String(c);
        s.textContent = nombre;
        frag.appendChild(s);
      });
    }
    fila.appendChild(frag);
  };
  armarFila(filaT);
  armarFila(filaS);
  if (banda && ventana && filaT && filaS) banda.hidden = false;

  let ultimo = null;
  const ubicarBanda = (res, animar) => {
    if (!banda || banda.hidden) return;
    const k = parseFloat(window.getComputedStyle(ventana).getPropertyValue('--k')) || 6;
    const mitad = ventana.clientWidth / 2;
    banda.classList.toggle('sin-transicion', !animar);
    filaT.style.transform = `translateX(${(mitad - (res.tropical + 360) * k).toFixed(1)}px)`;
    filaS.style.transform = `translateX(${(mitad - (res.sideral + 360) * k).toFixed(1)}px)`;
    [[filaT, res.trop.indice], [filaS, res.sid.indice]].forEach(([fila, idx]) => {
      fila.querySelectorAll('.banda__signo').forEach(s => {
        s.classList.toggle('is-sol', s.dataset.c === '1' && Number(s.dataset.i) === idx);
      });
    });
  };

  const render = (res, ctx) => {
    el.signo.textContent = res.sid.signo;
    if (el.grados) el.grados.textContent = formatoGrados(res.sid);
    if (el.tropical) el.tropical.textContent = `${res.trop.signo} ${formatoGrados(res.trop)}`;
    if (el.cuando) el.cuando.textContent = ctx.cuando;
    if (el.nota) el.nota.textContent = ctx.nota;
    el.cta.dataset.wspMsg = ctx.mensaje;
    el.cta.href = wspHref(ctx.mensaje);
    ubicarBanda(res, ctx.animar);
    ultimo = res;
    if (ctx.animar) {
      resultado.classList.remove('is-nuevo');
      void resultado.offsetWidth;
      resultado.classList.add('is-nuevo');
    }
  };

  const res0 = solEn(hoy);
  render(res0, {
    cuando: `Hoy, ${hoy.getDate()} de ${MESES[hoy.getMonth()]}`,
    nota: res0.trop.indice === res0.sid.indice
      ? `Hoy el Sol está en ${res0.sid.signo} en los dos zodíacos.`
      : `El Sol ya entró en ${res0.trop.signo} según el horóscopo, pero en el cielo sigue en ${res0.sid.signo}.`,
    mensaje: 'Hola, quiero pedir mi carta natal sideral en Reyna Midas Holística.',
    animar: false,
  });

  const limpiarError = () => {
    if (error && !error.hidden) { error.hidden = true; inFecha.removeAttribute('aria-invalid'); }
  };
  const mostrarError = msg => {
    if (error) { error.textContent = msg; error.hidden = false; }
    inFecha.setAttribute('aria-invalid', 'true');
    inFecha.focus();
  };

  form.addEventListener('submit', e => {
    e.preventDefault();
    const valor = inFecha.value;
    if (!valor) { mostrarError('Poné tu fecha de nacimiento para calcular.'); return; }
    const [a, m, d] = valor.split('-').map(Number);
    const prueba = new Date(Date.UTC(a, m - 1, d));
    if (!a || !m || !d || prueba.getUTCMonth() !== m - 1 || prueba.getUTCDate() !== d) { mostrarError('Esa fecha no existe en el calendario: revisala.'); return; }
    if (a < 1900) { mostrarError('Por ahora calculamos desde 1900: revisá el año.'); return; }
    if (valor > isoHoy) { mostrarError('Esa fecha todavía no llegó: revisala.'); return; }
    limpiarError();
    const hv = inHora ? inHora.value : '';
    const [hh, mm] = hv ? hv.split(':').map(Number) : [12, 0];
    const res = solEn(fechaNacimientoUTC(a, m, d, hh || 0, mm || 0));
    const lugar = inLugar ? inLugar.value.trim().replace(/\s+/g, ' ').slice(0, 60) : '';
    const fechaTxt = `${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}/${a}`;
    const lineas = [
      'Hola, calculé mi Sol sideral en la web de Reyna Midas Holística.',
      `Nací el ${fechaTxt}${hv ? ` a las ${hv}` : ' (no sé la hora)'}${lugar ? ` en ${lugar}` : ''}.`,
      `Me dio Sol en ${res.sid.signo} ${formatoGrados(res.sid)} (en el horóscopo, ${res.trop.signo}).`,
      'Quiero pedir mi carta natal sideral.',
    ];
    render(res, {
      cuando: `Naciste el ${d} de ${MESES[m - 1]} de ${a}${hv ? `, a las ${hv}` : ', al mediodía (hora estimada)'}`,
      nota: notaNacimiento(res, Boolean(hv)),
      mensaje: lineas.join('\n'),
      animar: !reduceMotion,
    });
    if (window.matchMedia('(max-width: 900px)').matches) {
      resultado.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    }
  });
  inFecha.addEventListener('input', limpiarError);
  window.addEventListener('resize', () => { if (ultimo) ubicarBanda(ultimo, false); }, { passive: true });
}

function initRueda() {
  const sec = document.querySelector('.rueda');
  if (!sec) return;
  const pista = sec.querySelector('.rueda__pista');
  const escena = sec.querySelector('.rueda__escena');
  const visual = sec.querySelector('.rueda__visual');
  const meds = [...sec.querySelectorAll('.medallon')];
  const items = [...sec.querySelectorAll('.rueda__item')];
  const grado = sec.querySelector('[data-grado]');
  if (!pista || !escena || !visual || meds.length < 2 || items.length !== meds.length) return;
  if (reduceMotion) return;
  sec.classList.add('is-live');
  const N = meds.length;
  const PASO = 360 / N;
  const offset = () => parseFloat(window.getComputedStyle(document.documentElement).getPropertyValue('--gw-modelos-h')) || 0;
  const suave = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  let activa = -1;
  let ticking = false;
  const activar = idx => {
    if (idx === activa) return;
    activa = idx;
    items.forEach((it, i) => {
      const on = i === idx;
      it.classList.toggle('is-activa', on);
      it.inert = !on;
    });
  };
  const update = () => {
    ticking = false;
    const recorrido = pista.offsetHeight - escena.offsetHeight;
    const top = pista.getBoundingClientRect().top;
    const p = Math.min(1, Math.max(0, (offset() - top) / Math.max(1, recorrido)));
    const seg = p * (N - 1);
    const k = Math.min(N - 2, Math.floor(seg));
    const f = seg - k;
    const pos = k + suave(Math.min(1, Math.max(0, (f - 0.2) / 0.6)));
    const r = pos * PASO;
    visual.style.setProperty('--r', r.toFixed(2) + 'deg');
    meds.forEach((m, i) => {
      const d = Math.abs(i - pos);
      m.style.setProperty('--s', (0.7 + 0.3 * Math.max(0, 1 - d / 0.75)).toFixed(3));
      m.classList.toggle('is-activa', d < 0.5);
    });
    if (grado) grado.textContent = String(Math.round(r)).padStart(3, '0');
    activar(Math.min(N - 1, Math.round(pos)));
  };
  const queue = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  window.addEventListener('scroll', queue, { passive: true });
  window.addEventListener('resize', queue, { passive: true });
  window.addEventListener('load', update);
  update();
}

function initTabs() {
  const lista = document.querySelector('[role="tablist"]');
  if (!lista) return;
  const tabs = [...lista.querySelectorAll('[role="tab"]')];
  if (!tabs.length) return;
  const activar = (tab, foco) => {
    tabs.forEach(t => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      const panel = document.getElementById(t.getAttribute('aria-controls'));
      if (!panel) return;
      panel.hidden = !on;
      if (on) {
        panel.querySelectorAll('[data-animate]').forEach(fig => {
          fig.classList.remove('in');
          void fig.offsetWidth;
          fig.classList.add('in');
        });
      }
    });
    if (foco) tab.focus();
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => activar(t, false));
    t.addEventListener('keydown', e => {
      let destino = null;
      if (e.key === 'ArrowRight') destino = tabs[(i + 1) % tabs.length];
      else if (e.key === 'ArrowLeft') destino = tabs[(i - 1 + tabs.length) % tabs.length];
      else if (e.key === 'Home') destino = tabs[0];
      else if (e.key === 'End') destino = tabs[tabs.length - 1];
      if (destino) { e.preventDefault(); activar(destino, true); }
    });
  });
}

function initTurnos() {
  const sec = document.getElementById('turnos');
  if (!sec) return;
  const sel = sec.querySelector('#turnoPractica');
  const diasBox = sec.querySelector('[data-dias]');
  const franjas = [...sec.querySelectorAll('[data-franja]')];
  const resumen = sec.querySelector('[data-turno-resumen]');
  const cta = sec.querySelector('[data-turno-cta]');
  if (!sel || !diasBox || !resumen || !cta) return;

  const hoy = new Date();
  const dias = [];
  for (let i = 1; dias.length < 6 && i < 14; i++) {
    const d = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + i);
    if (d.getDay() !== 0) dias.push(d);
  }
  diasBox.textContent = '';
  dias.forEach(d => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'chip chip--dia';
    b.setAttribute('aria-pressed', 'false');
    b.setAttribute('aria-label', `${DIAS_LARGOS[d.getDay()]} ${d.getDate()} de ${MESES[d.getMonth()]}`);
    b.dataset.dia = `${DIAS_LARGOS[d.getDay()]} ${d.getDate()}/${d.getMonth() + 1}`;
    b.innerHTML = `<small>${DIAS_CORTOS[d.getDay()]}</small>${d.getDate()}`;
    diasBox.appendChild(b);
  });

  let franja = '';
  const actualizar = () => {
    const op = sel.selectedOptions[0];
    const practica = sel.value && op ? (op.dataset.nombre || op.textContent).trim() : '';
    const elegidos = [...diasBox.querySelectorAll('[aria-pressed="true"]')].map(b => b.dataset.dia);
    resumen.innerHTML = `Vas a pedir <strong>${esc(practica || 'una práctica a elegir')}</strong>`
      + (elegidos.length ? ` · ${esc(elegidos.join(', '))}` : ' · el día que haya lugar')
      + (franja ? ` · por la ${esc(franja)}` : '');
    const lineas = [
      'Hola, quiero pedir un turno en Reyna Midas Holística.',
      practica ? `Práctica: ${practica} (${op.dataset.min} min · ${formatearPrecio(Number(op.dataset.precio))}).` : 'Todavía no sé qué práctica elegir: ¿me orientan?',
      elegidos.length ? `Días que me quedan bien: ${elegidos.join(', ')}.` : 'Me queda bien cualquier día.',
      franja ? `Mejor por la ${franja}.` : '',
    ];
    cta.href = wspHref(lineas.filter(Boolean).join('\n'));
  };

  diasBox.addEventListener('click', e => {
    const b = e.target.closest('.chip');
    if (!b) return;
    b.setAttribute('aria-pressed', String(b.getAttribute('aria-pressed') !== 'true'));
    actualizar();
  });
  franjas.forEach(b => b.addEventListener('click', () => {
    const on = b.getAttribute('aria-pressed') !== 'true';
    franjas.forEach(x => x.setAttribute('aria-pressed', 'false'));
    b.setAttribute('aria-pressed', String(on));
    franja = on ? b.dataset.franja : '';
    actualizar();
  }));
  sel.addEventListener('change', actualizar);
  cta.addEventListener('click', () => showToast('Te abrimos WhatsApp con tu pedido listo para enviar.'));
  actualizar();
}

function initMovimiento() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('[data-parallax]').forEach(fig => {
    const img = fig.querySelector('img');
    if (!img) return;
    gsap.fromTo(img, { yPercent: -4, scale: 1.1 }, {
      yPercent: 4,
      scale: 1.1,
      ease: 'none',
      scrollTrigger: { trigger: fig, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });
}

function initAnio() {
  document.querySelectorAll('[data-anio]').forEach(el => { el.textContent = String(new Date().getFullYear()); });
}

initModelBarScroll();
initWspLinks();
initTopH();
initSolHoy();
initSol();
initRueda();
initTabs();
initTurnos();
initReveals();
initNav();
initWspFloat();
initMovimiento();
initAnio();
