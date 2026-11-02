const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5493757445291';

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
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

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const img = hero.querySelector('[data-hero-img]');
  if (img) tl.from(img, { scale: 1.1, duration: 1.8 }, 0);
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 36, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-rayas'), { scaleX: 0, transformOrigin: '0 50%', duration: 1, clearProps: 'transform' }, 0.4)
    .from(hero.querySelectorAll('.hero-lead'), { y: 24, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 20, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.sello, .hero-badge'), { scale: 0.92, y: 24, opacity: 0, duration: 1.1, stagger: 0.1, clearProps: 'transform,opacity' }, 0.75);
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  const capa = document.querySelector('.hero .parallax');
  if (!capa) return;
  gsap.to(capa, {
    yPercent: 3, ease: 'none',
    scrollTrigger: { trigger: capa.closest('.hero'), start: 'top top', end: 'bottom top', scrub: true }
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

function initTabs() {
  const tabs = [...document.querySelectorAll('.tabs [role="tab"]')];
  if (!tabs.length) return;
  const activar = (tab, foco) => {
    tabs.forEach(t => {
      const on = t === tab;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      const panel = document.getElementById(t.getAttribute('aria-controls'));
      if (panel) panel.hidden = !on;
    });
    if (foco) tab.focus();
    revelarNuevos(document.getElementById(tab.getAttribute('aria-controls')));
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => activar(t, false));
    t.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        activar(tabs[(i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length], true);
      }
    });
  });
  document.querySelectorAll('[data-tab]').forEach(a => a.addEventListener('click', () => {
    const tab = document.getElementById(a.dataset.tab);
    if (tab) activar(tab, false);
  }));
}

function initVisor() {
  const visor = document.getElementById('visor');
  const tiles = [...document.querySelectorAll('[data-visor]')];
  if (!visor || !tiles.length) return;
  const img = document.getElementById('visorImg');
  const cap = document.getElementById('visorCap');
  const btnCerrar = document.getElementById('visorCerrar');
  const btnPrev = document.getElementById('visorPrev');
  const btnNext = document.getElementById('visorNext');
  let actual = 0;
  let origen = null;
  const mostrar = i => {
    actual = (i + tiles.length) % tiles.length;
    const t = tiles[actual];
    const foto = t.querySelector('img');
    img.src = t.dataset.full;
    img.alt = foto?.alt || '';
    cap.textContent = `${t.dataset.cap} · ${actual + 1} de ${tiles.length} · Imagen ilustrativa`;
  };
  const abrir = i => {
    origen = document.activeElement;
    mostrar(i);
    visor.hidden = false;
    document.body.classList.add('no-scroll');
    requestAnimationFrame(() => visor.classList.add('abierto'));
    btnCerrar.focus();
  };
  const cerrar = () => {
    visor.classList.remove('abierto');
    visor.hidden = true;
    document.body.classList.remove('no-scroll');
    origen?.focus();
  };
  tiles.forEach((t, i) => t.addEventListener('click', () => abrir(i)));
  btnCerrar.addEventListener('click', cerrar);
  btnPrev.addEventListener('click', () => mostrar(actual - 1));
  btnNext.addEventListener('click', () => mostrar(actual + 1));
  visor.addEventListener('click', e => { if (e.target === visor) cerrar(); });
  visor.addEventListener('keydown', e => {
    if (e.key === 'Escape') { e.preventDefault(); cerrar(); }
    else if (e.key === 'ArrowLeft') mostrar(actual - 1);
    else if (e.key === 'ArrowRight') mostrar(actual + 1);
    else if (e.key === 'Tab') {
      const focos = [btnCerrar, btnPrev, btnNext];
      const i = focos.indexOf(document.activeElement);
      e.preventDefault();
      focos[(i + (e.shiftKey ? -1 : 1) + focos.length) % focos.length].focus();
    }
  });
}

const LUGARES = {
  aeropuerto: 'Aeropuerto Cataratas del Iguazú',
  terminal: 'Terminal de ómnibus',
  alojamiento: 'Mi alojamiento',
  otro: 'Otro lugar'
};

const DESTINOS = {
  'cataratas-ar': { nombre: 'Cataratas del lado argentino', nota: '18 km desde el centro · día completo' },
  'cataratas-br': { nombre: 'Cataratas del lado brasileño', nota: 'Cruce por el puente Tancredo Neves · DNI o pasaporte' },
  'tres-fronteras': { nombre: 'Hito Tres Fronteras', nota: '2 km desde el centro · ideal al atardecer' },
  wanda: { nombre: 'Minas de Wanda', nota: '50 km por la Ruta 12 · menos de una hora' },
  otra: { nombre: 'Otra salida', nota: 'Contanos cuál en la consulta' }
};

const INCLUYE = {
  llegada: 'Traslado de llegada',
  salida: 'Traslado de salida',
  'cataratas-ar': 'Cataratas del lado argentino',
  'cataratas-br': 'Cataratas del lado brasileño',
  'tres-fronteras': 'Hito Tres Fronteras',
  wanda: 'Minas de Wanda'
};

const TITULOS = { traslado: 'Traslado', excursion: 'Excursión', receptivo: 'Turismo receptivo' };
const PEDIDO = { traslado: 'un traslado', excursion: 'una excursión', receptivo: 'mi estadía (turismo receptivo)' };

function isoHoy() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function aFecha(iso) {
  if (!iso) return null;
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

const fechaCorta = f => f.toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric', month: 'short' }).replace(/\./g, '');
const fechaLarga = f => f.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' });

function initReserva() {
  const form = document.getElementById('reservaForm');
  if (!form) return;
  const $ = id => document.getElementById(id);
  const cuenta = { rPax: 2, rVal: 2 };
  const topes = { rPax: [1, 40], rVal: [0, 40] };
  const hoy = isoHoy();
  form.querySelectorAll('input[type="date"]').forEach(i => { i.min = hoy; });

  const modo = () => form.querySelector('input[name="servicio"]:checked')?.value || 'traslado';
  const incluidos = () => [...form.querySelectorAll('input[data-f="incluye"]:checked')].map(i => i.value);

  const lugar = clave => {
    const aloja = $('rAloja').value.trim();
    if (clave === 'alojamiento' && aloja) return aloja;
    return LUGARES[clave] || '';
  };

  const marcar = (id, msg) => {
    const campo = $(id);
    const err = $(id + 'Error');
    if (campo) campo.setAttribute('aria-invalid', msg ? 'true' : 'false');
    if (err) { err.textContent = msg || ''; err.hidden = !msg; }
  };

  const errores = () => {
    const m = modo();
    const out = {};
    if ($('rNombre').value.trim().length < 2) out.rNombre = 'Escribí tu nombre para que Jorge sepa a quién responder.';
    if (m === 'traslado' || m === 'excursion') {
      if (!aFecha($('rFecha').value)) out.rFecha = 'Elegí la fecha.';
      else if ($('rFecha').value < hoy) out.rFecha = 'La fecha ya pasó.';
    }
    if (m === 'traslado') {
      const d = $('rDesde').value, h = $('rHasta').value;
      if (d === h && d !== 'otro') out.rHasta = 'El destino tiene que ser distinto del origen.';
      if ($('rVuelta').checked) {
        if (!aFecha($('rFechaVuelta').value)) out.rFechaVuelta = 'Elegí la fecha de la vuelta.';
        else if (aFecha($('rFecha').value) && $('rFechaVuelta').value < $('rFecha').value) out.rFechaVuelta = 'La vuelta no puede ser antes de la ida.';
      }
    }
    if (m === 'receptivo') {
      if (!aFecha($('rLlegada').value)) out.rLlegada = 'Elegí el día de llegada.';
      if (!aFecha($('rSalida').value)) out.rSalida = 'Elegí el día de salida.';
      else if (aFecha($('rLlegada').value) && $('rSalida').value < $('rLlegada').value) out.rSalida = 'La salida no puede ser antes de la llegada.';
      if (!incluidos().length) out.rIncluye = 'Marcá al menos una cosa para coordinar.';
    }
    return out;
  };

  const noches = () => {
    const a = aFecha($('rLlegada').value), b = aFecha($('rSalida').value);
    if (!a || !b || b < a) return null;
    return Math.round((b - a) / 86400000);
  };

  const mensaje = () => {
    const m = modo();
    const nombre = $('rNombre').value.trim();
    const lineas = [`Hola Mamdiotur${nombre ? `, soy ${nombre}` : ''}. Quiero consultar por ${PEDIDO[m]}.`];
    const fecha = aFecha($('rFecha').value);
    const aloja = $('rAloja').value.trim();
    if (m === 'traslado') {
      const hora = $('rHora').value.trim();
      lineas.push(`· Desde: ${lugar($('rDesde').value)}`);
      lineas.push(`· Hasta: ${lugar($('rHasta').value)}`);
      if (fecha) lineas.push(`· Fecha: ${fechaLarga(fecha)}${hora ? ` (${hora})` : ''}`);
      else if (hora) lineas.push(`· Hora o vuelo: ${hora}`);
      if ($('rVuelta').checked) {
        const fv = aFecha($('rFechaVuelta').value);
        lineas.push(`· Vuelta: ${fv ? fechaLarga(fv) : 'también, fecha a definir'}`);
      }
      lineas.push(`· Pasajeros: ${cuenta.rPax} · Valijas: ${cuenta.rVal}`);
    } else if (m === 'excursion') {
      lineas.push(`· Salida: ${DESTINOS[$('rDestino').value].nombre}`);
      if (fecha) lineas.push(`· Fecha: ${fechaLarga(fecha)}`);
      lineas.push(`· Pasajeros: ${cuenta.rPax}`);
      if (aloja) lineas.push(`· Nos buscan por: ${aloja}`);
    } else {
      const a = aFecha($('rLlegada').value), b = aFecha($('rSalida').value);
      const n = noches();
      if (a) lineas.push(`· Llegada: ${fechaLarga(a)}`);
      if (b) lineas.push(`· Salida: ${fechaLarga(b)}${n !== null ? ` (${n === 1 ? '1 noche' : `${n} noches`})` : ''}`);
      lineas.push(`· Pasajeros: ${cuenta.rPax} · Valijas: ${cuenta.rVal}`);
      const inc = incluidos().map(k => INCLUYE[k]);
      if (inc.length) lineas.push(`· Coordinar: ${inc.join(', ')}`);
      if (aloja) lineas.push(`· Alojamiento: ${aloja}`);
    }
    if (m === 'traslado' && aloja && $('rDesde').value !== 'alojamiento' && $('rHasta').value !== 'alojamiento') lineas.push(`· Alojamiento: ${aloja}`);
    const coment = $('rComent').value.trim();
    if (coment) lineas.push('', coment);
    lineas.push('', '¿Tienen disponibilidad?');
    return lineas.join('\n');
  };

  const tramo = (desde, hasta, nota) => `<span class="tramo-punto"></span><strong>${esc(desde)}</strong>
              <span class="tramo-linea"></span><span></span>
              <span class="tramo-punto tramo-punto--fin"></span><strong>${esc(hasta)}</strong>${nota ? `\n              <small>${esc(nota)}</small>` : ''}`;

  const notaTraslado = (d, h) => {
    const par = [d, h];
    if (par.includes('aeropuerto') && (par.includes('alojamiento') || par.includes('terminal'))) return 'Unos 20 km · 25 minutos';
    if (par.includes('otro')) return 'Detallá el lugar en la consulta';
    return '';
  };

  const pintar = () => {
    const m = modo();
    form.dataset.modo = m;
    form.querySelectorAll('[data-solo]').forEach(el => {
      const visible = el.dataset.solo.split(' ').includes(m) && (!el.hasAttribute('data-vuelta') || $('rVuelta').checked);
      el.hidden = !visible;
    });
    $('rFechaLbl').textContent = m === 'excursion' ? 'Fecha de la excursión' : 'Fecha del traslado';
    $('rDestinoAyuda').textContent = DESTINOS[$('rDestino').value].nota;
    $('resumen-titulo').textContent = TITULOS[m];
    const fecha = aFecha($('rFecha').value);
    let fechaTxt = 'A definir';
    if (m === 'traslado') {
      $('resTramo').innerHTML = tramo(lugar($('rDesde').value), lugar($('rHasta').value), notaTraslado($('rDesde').value, $('rHasta').value));
      if (fecha) fechaTxt = fechaCorta(fecha) + ($('rHora').value.trim() ? ` · ${$('rHora').value.trim()}` : '');
      if ($('rVuelta').checked) {
        const fv = aFecha($('rFechaVuelta').value);
        fechaTxt += ` · vuelta ${fv ? fechaCorta(fv) : 'a definir'}`;
      }
    } else if (m === 'excursion') {
      const d = DESTINOS[$('rDestino').value];
      $('resTramo').innerHTML = tramo($('rAloja').value.trim() || 'Tu alojamiento', d.nombre, d.nota);
      if (fecha) fechaTxt = fechaCorta(fecha);
    } else {
      const a = aFecha($('rLlegada').value), b = aFecha($('rSalida').value);
      const n = noches();
      const nota = n === null ? 'Elegí las dos fechas' : n === 0 ? 'Llegás y salís el mismo día' : `${n === 1 ? '1 noche' : `${n} noches`} · ${n + 1} días`;
      $('resTramo').innerHTML = tramo(`Llegada · ${a ? fechaCorta(a) : 'a definir'}`, `Salida · ${b ? fechaCorta(b) : 'a definir'}`, nota);
      const inc = incluidos().length;
      fechaTxt = inc ? `${inc} ${inc === 1 ? 'cosa' : 'cosas'} para coordinar` : 'Nada marcado';
    }
    $('resFecha').textContent = fechaTxt;
    $('resFecha').previousElementSibling.textContent = m === 'receptivo' ? 'Coordinar' : 'Fecha';
    $('resPax').textContent = cuenta.rPax;
    $('resVal').textContent = cuenta.rVal;
    $('resValFila').hidden = m === 'excursion';
    $('resNombre').textContent = $('rNombre').value.trim() || 'Falta tu nombre';
    $('reservaWsp').href = `https://wa.me/${WSP}?text=${encodeURIComponent(mensaje())}`;
  };

  const limpiarErrores = () => {
    const errs = errores();
    ['rNombre', 'rFecha', 'rHasta', 'rFechaVuelta', 'rLlegada', 'rSalida', 'rIncluye'].forEach(id => {
      if (!errs[id]) marcar(id, '');
    });
  };

  form.addEventListener('input', () => { pintar(); limpiarErrores(); });
  form.addEventListener('change', () => { pintar(); limpiarErrores(); });
  form.querySelectorAll('[data-paso]').forEach(b => b.addEventListener('click', () => {
    const k = b.dataset.paso;
    const [min, max] = topes[k];
    cuenta[k] = Math.max(min, Math.min(max, cuenta[k] + Number(b.dataset.d)));
    $(k).textContent = cuenta[k];
    pintar();
  }));

  $('reservaWsp').addEventListener('click', e => {
    const errs = errores();
    const ids = Object.keys(errs);
    ['rNombre', 'rFecha', 'rHasta', 'rFechaVuelta', 'rLlegada', 'rSalida', 'rIncluye'].forEach(id => marcar(id, errs[id] || ''));
    if (ids.length) {
      e.preventDefault();
      showToast('Revisá los datos marcados y volvé a enviar.');
      const primero = $(ids[0]) || $(ids[0] + 'Error');
      if (primero && primero.focus) primero.focus({ preventScroll: true });
      (primero?.closest('.campo') || primero)?.scrollIntoView({ block: 'center', behavior: reduceMotion ? 'auto' : 'smooth' });
      return;
    }
    pintar();
    showToast('Abrimos WhatsApp con tu consulta armada.');
  });

  document.querySelectorAll('[data-elegir]').forEach(a => a.addEventListener('click', () => {
    const radio = form.querySelector(`input[name="servicio"][value="${a.dataset.elegir}"]`);
    if (radio) radio.checked = true;
    if (a.dataset.destino && DESTINOS[a.dataset.destino]) $('rDestino').value = a.dataset.destino;
    pintar();
  }));

  pintar();
}

initTabs();
initReveals();
initNav();
initWspFloat();
initModelBarScroll();
initHeroMotion();
initParallax();
initVisor();
initReserva();
