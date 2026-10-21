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

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WA_NUMERO = '5493574638862';
const wa = msg => `https://wa.me/${WA_NUMERO}?text=${encodeURIComponent(msg)}`;
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const refrescarScroll = () => { if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); };

const ICONO_CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';
const ICONO_FLECHA = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

const SERVICIOS = {
  especiales: {
    nombre: 'Viajes especiales',
    tipo: 'especial',
    foto: 'images/combi-sierras.webp',
    foto640: 'images/combi-sierras-640.webp',
    alt: 'Minibús blanco en una ruta de sierras, junto a un lago',
    detalle: 'Vos nos decís adónde, cuándo y cuántos viajan; nosotros ponemos la unidad que le queda justa al grupo y coordinamos la salida y la vuelta.',
    ejemplos: ['Excursiones y paseos de un día', 'Casamientos, cumpleaños y fiestas', 'Contingentes deportivos y escolares', 'Traslados a aeropuertos y terminales'],
    msg: 'Hola Juliominibus, quiero consultar por un viaje especial.'
  },
  empresariales: {
    nombre: 'Viajes empresariales',
    tipo: 'empresarial',
    foto: 'images/combi-empresa.webp',
    foto640: 'images/combi-empresa-640.webp',
    alt: 'Minibús blanco estacionado frente a un edificio de oficinas',
    detalle: 'Movemos a tu equipo, a tus clientes o a tus visitas con horarios acordados de antemano, para que la empresa no tenga que pensar en cómo llegar.',
    ejemplos: ['Jornadas, capacitaciones y congresos', 'Traslado de clientes y visitas', 'Eventos y fiestas de fin de año', 'Viajes de equipo a otras sedes'],
    msg: 'Hola Juliominibus, quiero consultar por un viaje empresarial.'
  },
  personal: {
    nombre: 'Traslado de personal',
    tipo: 'personal',
    foto: 'images/colectivo-planta.webp',
    foto640: 'images/colectivo-planta-640.webp',
    alt: 'Colectivo blanco frente a una nave industrial',
    detalle: 'Llevamos y traemos a tu personal obrero entre la ciudad y la planta, la obra o el campo, con recorridos y horarios armados según los turnos.',
    ejemplos: ['Recorridos fijos por turno', 'Plantas industriales y obras', 'Cuadrillas a campo y zonas rurales', 'Refuerzos por temporada o por obra'],
    msg: 'Hola Juliominibus, quiero consultar por el traslado de personal.'
  }
};

const UNIDADES = [
  { cap: 15, nombre: 'Minibús de 15' },
  { cap: 19, nombre: 'Minibús de 19' },
  { cap: 24, nombre: 'Minibús de 24' },
  { cap: 45, nombre: 'Colectivo de 45' }
];
const TIPOS = { especial: 'Viaje especial', empresarial: 'Viaje empresarial', personal: 'Traslado de personal' };
const MAX_PAX = 180;

function fichaHTML(id) {
  const s = SERVICIOS[id];
  if (!s) return '';
  return `<div class="ficha">
    <figure class="ficha__foto"><img src="${s.foto640}" srcset="${s.foto640} 640w, ${s.foto} 1254w" sizes="(max-width: 640px) 100vw, 450px" width="1254" height="1254" alt="${esc(s.alt)}"></figure>
    <div class="ficha__texto">
      <p class="ficha__etq">Servicio</p>
      <h3>${esc(s.nombre)}</h3>
      <p class="ficha__detalle">${esc(s.detalle)}</p>
      <p class="ficha__sub">Por ejemplo</p>
      <ul class="ficha__lista">${s.ejemplos.map(e => `<li>${ICONO_CHECK}<span>${esc(e)}</span></li>`).join('')}</ul>
      <div class="ficha__ctas">
        <a class="btn btn--primario" href="${wa(s.msg)}" target="_blank" rel="noopener">Pedir presupuesto ${ICONO_FLECHA}</a>
        <a class="btn btn--borde" href="#guia" data-ir-guia="${s.tipo}">Calcular la unidad</a>
      </div>
    </div>
  </div>`;
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

let cerrarModalServicio = null;

function initModalServicios() {
  const modal = document.getElementById('modalServicio');
  const contenido = document.getElementById('modalContenido');
  const botones = document.querySelectorAll('[data-servicio]');
  if (!modal || !contenido || !botones.length) return;
  const caja = modal.querySelector('.modal__caja');
  let origen = null;
  let timer = 0;
  const focoables = () => [...caja.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')].filter(el => el.offsetParent !== null);
  const cerrar = (devolverFoco = true) => {
    if (modal.hidden) return;
    modal.classList.remove('abierto');
    document.body.classList.remove('no-scroll');
    clearTimeout(timer);
    timer = setTimeout(() => { modal.hidden = true; contenido.innerHTML = ''; }, reduceMotion ? 0 : 380);
    if (devolverFoco) origen?.focus({ preventScroll: true });
  };
  const abrir = (id, boton) => {
    origen = boton;
    clearTimeout(timer);
    contenido.innerHTML = fichaHTML(id);
    caja.setAttribute('aria-label', SERVICIOS[id]?.nombre || 'Detalle del servicio');
    modal.hidden = false;
    void modal.offsetWidth;
    modal.classList.add('abierto');
    document.body.classList.add('no-scroll');
    caja.scrollTop = 0;
    caja.focus({ preventScroll: true });
  };
  cerrarModalServicio = cerrar;
  botones.forEach(b => b.addEventListener('click', () => abrir(b.dataset.servicio, b)));
  modal.addEventListener('click', e => { if (e.target.closest('[data-cerrar]')) cerrar(); });
  document.addEventListener('keydown', e => {
    if (modal.hidden) return;
    if (e.key === 'Escape') { cerrar(); return; }
    if (e.key === 'Tab') {
      const f = focoables();
      if (!f.length) return;
      const primero = f[0];
      const ultimo = f[f.length - 1];
      if (e.shiftKey && (document.activeElement === primero || document.activeElement === caja)) { e.preventDefault(); ultimo.focus(); }
      else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
    }
  });
}

function initTabsServicios() {
  const lista = document.querySelector('.tabs');
  const panel = document.getElementById('panelServicio');
  if (!lista || !panel) return;
  const tabs = [...lista.querySelectorAll('[role="tab"]')];
  const elegir = (tab, enfocar = false) => {
    tabs.forEach(t => {
      const activo = t === tab;
      t.setAttribute('aria-selected', String(activo));
      t.tabIndex = activo ? 0 : -1;
    });
    panel.innerHTML = fichaHTML(tab.dataset.tab);
    panel.setAttribute('aria-labelledby', tab.id);
    if (enfocar) tab.focus();
    refrescarScroll();
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => elegir(t));
    t.addEventListener('keydown', e => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault();
      const sig = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
      elegir(sig, true);
    });
  });
  elegir(tabs.find(t => t.getAttribute('aria-selected') === 'true') || tabs[0]);
}

function sugerirUnidades(n) {
  const caps = UNIDADES.map(u => u.cap);
  if (n <= caps[caps.length - 1]) return [caps.find(c => c >= n)];
  let mejor = null;
  const probar = (desde, combo, suma) => {
    if (suma >= n) {
      const clave = [combo.length, suma - n];
      if (!mejor || clave[0] < mejor.clave[0] || (clave[0] === mejor.clave[0] && clave[1] < mejor.clave[1])) mejor = { combo: [...combo], clave };
      return;
    }
    if (combo.length === 4) return;
    for (let i = desde; i < caps.length; i++) {
      combo.push(caps[i]);
      probar(i, combo, suma + caps[i]);
      combo.pop();
    }
  };
  probar(0, [], 0);
  return mejor.combo.sort((a, b) => b - a);
}

const nombreUnidad = cap => UNIDADES.find(u => u.cap === cap)?.nombre || `Unidad de ${cap}`;

function mapaHTML(cap, ocupados) {
  let cols = '';
  for (let c = 0; c < Math.ceil(cap / 4); c++) {
    let asientos = '';
    for (let k = c * 4; k < Math.min(cap, c * 4 + 4); k++) asientos += `<i${k < ocupados ? ' class="on"' : ''}></i>`;
    cols += `<span class="mapa__col">${asientos}</span>`;
  }
  return `<div class="mapa"><p class="mapa__tit">${esc(nombreUnidad(cap))} · ${ocupados}/${cap}</p><div class="mapa__asientos" role="img" aria-label="${ocupados} de ${cap} asientos ocupados">${cols}</div></div>`;
}

function initGuia() {
  const form = document.getElementById('guiaForm');
  if (!form) return;
  const pax = document.getElementById('guiaPax');
  const rango = document.getElementById('guiaRango');
  const origen = document.getElementById('guiaOrigen');
  const destino = document.getElementById('guiaDestino');
  const fecha = document.getElementById('guiaFecha');
  const fechaLabel = document.getElementById('guiaFechaLabel');
  const frecuencia = document.getElementById('guiaFrecuencia');
  const frecuenciaCampo = document.getElementById('guiaFrecuenciaCampo');
  const vuelta = document.getElementById('guiaVuelta');
  const vueltaCampo = document.getElementById('guiaVueltaCampo');
  const outUnidad = document.getElementById('guiaUnidad');
  const outNota = document.getElementById('guiaNota');
  const outMapas = document.getElementById('guiaMapas');
  const outMsg = document.getElementById('guiaMsg');
  const cta = document.getElementById('guiaCta');
  if (!pax || !rango || !outUnidad || !cta) return;

  const hoy = new Date();
  if (fecha) fecha.min = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;

  const limitar = v => Math.min(MAX_PAX, Math.max(1, Math.round(Number(v) || 1)));
  const tipoActual = () => form.querySelector('input[name="tipo"]:checked')?.value || 'especial';
  const fechaTxt = v => { const [a, m, d] = String(v).split('-'); return d && m && a ? `${d}/${m}/${a}` : ''; };

  const render = () => {
    const n = limitar(pax.value);
    const tipo = tipoActual();
    const esPersonal = tipo === 'personal';
    if (frecuenciaCampo) frecuenciaCampo.hidden = !esPersonal;
    if (vueltaCampo) vueltaCampo.hidden = esPersonal;
    if (fechaLabel) fechaLabel.textContent = esPersonal ? 'Desde cuándo' : 'Fecha del viaje';

    const combo = sugerirUnidades(n);
    const sugerida = combo.map(nombreUnidad).join(' + ');
    outUnidad.textContent = sugerida;
    if (combo.length === 1) {
      const libres = combo[0] - n;
      outNota.textContent = libres === 0 ? `Viajan ${n}: la unidad va completa.` : `Viajan ${n} y ${libres === 1 ? 'queda 1 asiento libre' : `quedan ${libres} asientos libres`}.`;
    } else {
      outNota.textContent = `Para ${n} pasajeros combinamos ${combo.length} unidades, según la disponibilidad de la fecha.${n === MAX_PAX ? ' ¿Son más? Contanos en el mensaje.' : ''}`;
    }
    let resto = n;
    outMapas.innerHTML = combo.map(cap => { const o = Math.min(cap, resto); resto -= o; return mapaHTML(cap, o); }).join('');

    const lineas = ['Hola Juliominibus, quiero pedir un presupuesto.', `Tipo de viaje: ${TIPOS[tipo]}`, `Pasajeros: ${n}`, `Unidad sugerida: ${sugerida.toLowerCase()}`];
    if (origen?.value.trim()) lineas.push(`Origen: ${origen.value.trim()}`);
    if (destino?.value.trim()) lineas.push(`Destino: ${destino.value.trim()}`);
    if (fecha?.value) lineas.push(`${esPersonal ? 'Desde' : 'Fecha'}: ${fechaTxt(fecha.value)}`);
    if (esPersonal) lineas.push(`Frecuencia: ${frecuencia?.value || ''}`);
    else lineas.push(`Ida y vuelta: ${vuelta?.checked ? 'sí' : 'no'}`);
    const msg = lineas.join('\n');
    outMsg.textContent = msg;
    cta.href = wa(msg);
  };

  const fijarPax = v => {
    const n = limitar(v);
    pax.value = n;
    rango.value = n;
    render();
  };

  rango.addEventListener('input', () => { pax.value = rango.value; render(); });
  pax.addEventListener('input', () => {
    if (pax.value === '') return;
    const n = Number(pax.value);
    if (Number.isFinite(n) && n >= 1) { rango.value = limitar(n); render(); }
  });
  pax.addEventListener('change', () => fijarPax(pax.value));
  pax.addEventListener('blur', () => fijarPax(pax.value));
  form.querySelectorAll('[data-pax]').forEach(b => b.addEventListener('click', () => fijarPax(limitar(pax.value) + Number(b.dataset.pax))));
  form.addEventListener('input', e => { if (e.target !== pax && e.target !== rango) render(); });
  form.addEventListener('change', e => { if (e.target !== pax) render(); });

  document.addEventListener('click', e => {
    const link = e.target.closest('[data-ir-guia]');
    if (!link) return;
    const radio = form.querySelector(`input[name="tipo"][value="${link.dataset.irGuia}"]`);
    if (radio) { radio.checked = true; render(); }
    if (cerrarModalServicio) cerrarModalServicio(false);
  });

  cta.addEventListener('click', () => showToast('Abrimos WhatsApp con tu consulta lista para enviar.'));
  render();
}

function initFaq() {
  document.querySelectorAll('.faq__lista details').forEach(d => d.addEventListener('toggle', refrescarScroll));
}

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const img = hero.querySelector('[data-hero-img]');
  if (img) tl.from(img, { scale: 1.1, duration: 1.8, clearProps: 'transform' }, 0);
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-carril, .ruta'), { scaleX: 0, transformOrigin: '0% 50%', duration: 1.1, clearProps: 'transform' }, 0.4)
    .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.hero-badge'), { scale: 0.92, y: 12, opacity: 0, duration: 1, stagger: 0.08, clearProps: 'transform,opacity' }, 0.7);
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

initModelBarScroll();
initNav();
initWspFloat();
initModalServicios();
initTabsServicios();
initGuia();
initFaq();
initHeroMotion();
initReveals();
