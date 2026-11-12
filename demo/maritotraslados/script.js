const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5493757516743';
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

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

const wspHref = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;

function initWspLinks() {
  document.querySelectorAll('a[data-wsp-msg]').forEach(a => { a.href = wspHref(a.dataset.wspMsg); });
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

const IGR = { lat: -25.7373, lng: -54.4734 };
const PUERTO_IGUAZU = { lat: -25.5991, lng: -54.5736 };
const DESTINOS = [
  { id: 'aeropuerto', nombre: 'Aeropuerto IGR', pais: 'AR', desde: 'Tu hotel', lat: IGR.lat, lng: IGR.lng, desc: 'Aeropuerto Internacional Cataratas del Iguazú: te buscamos cuando llegás y te llevamos cuando te vas.', msg: 'Hola Marito! Quiero consultar un traslado al aeropuerto IGR.' },
  { id: 'cataratas-ar', nombre: 'Cataratas argentinas', pais: 'AR', lat: -25.6829, lng: -54.4545, desc: 'Las pasarelas y la Garganta del Diablo, del lado argentino.' },
  { id: 'wanda', nombre: 'Minas de Wanda', pais: 'AR', lat: -25.976, lng: -54.56, desc: 'Las minas de piedras semipreciosas, sobre la ruta 12.' },
  { id: 'san-ignacio', nombre: 'Ruinas de San Ignacio', pais: 'AR', lat: -27.2555, lng: -55.5321, desc: 'Las ruinas jesuíticas de San Ignacio Miní, Patrimonio de la Humanidad.' },
  { id: 'posadas', nombre: 'Posadas', pais: 'AR', lat: -27.3671, lng: -55.8961, desc: 'La capital de Misiones, con su costanera sobre el río Paraná.' },
  { id: 'mocona', nombre: 'Saltos del Moconá', pais: 'AR', lat: -27.146, lng: -53.893, desc: 'Saltos a lo largo del río Uruguay, en plena selva misionera.' },
  { id: 'cataratas-br', nombre: 'Cataratas brasileñas', pais: 'BR', lat: -25.6872, lng: -54.4423, desc: 'La vista panorámica de los saltos, del lado brasileño.' },
  { id: 'foz', nombre: 'Foz do Iguaçu', pais: 'BR', lat: -25.5163, lng: -54.5854, desc: 'La ciudad brasileña, cruzando el puente Tancredo Neves.' },
  { id: 'itaipu', nombre: 'Represa de Itaipú', pais: 'BR', lat: -25.4086, lng: -54.5892, desc: 'La represa binacional sobre el río Paraná.' },
  { id: 'templo', nombre: 'Templo Budista', pais: 'BR', lat: -25.5605, lng: -54.556, desc: 'El templo budista Chen Tien, en Foz do Iguaçu.' },
  { id: 'marco', nombre: 'Marco das Três Fronteiras', pais: 'BR', lat: -25.5925, lng: -54.587, desc: 'El mirador donde se juntan Argentina, Brasil y Paraguay.' },
  { id: 'cde', nombre: 'Ciudad del Este', pais: 'PY', lat: -25.5094, lng: -54.6111, desc: 'Viajes de compras, cruzando el Puente de la Amistad.' }
];
const ICONO_AVION = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>';

function curva(a, b) {
  const dx = b.lng - a.lng;
  const dy = b.lat - a.lat;
  const cx = (a.lng + b.lng) / 2 - dy * 0.22;
  const cy = (a.lat + b.lat) / 2 + dx * 0.22;
  const puntos = [];
  for (let i = 0; i <= 28; i++) {
    const t = i / 28;
    const u = 1 - t;
    puntos.push([u * u * a.lat + 2 * u * t * cy + t * t * b.lat, u * u * a.lng + 2 * u * t * cx + t * t * b.lng]);
  }
  return puntos;
}

function initDestinos() {
  const lista = document.getElementById('destLista');
  if (!lista) return;
  const botones = [...lista.querySelectorAll('.dest')];
  const filtros = [...document.querySelectorAll('.filtro')];
  const mapaWrap = document.querySelector('.mapa-wrap');
  const ficha = {
    desde: document.getElementById('fichaDesde'),
    pais: document.getElementById('fichaPais'),
    nombre: document.getElementById('fichaNombre'),
    desc: document.getElementById('fichaDesc'),
    btn: document.getElementById('fichaBtn')
  };
  const mqMovil = window.matchMedia('(max-width: 900px)');
  const marcadores = {};
  let mapa = null;
  let ruta = null;
  let actual = 'cataratas-ar';
  let paisActual = 'todos';

  const mapaEl = document.getElementById('mapa');
  if (mapaEl && typeof L !== 'undefined') {
    mapa = L.map(mapaEl, { scrollWheelZoom: false, dragging: !L.Browser.mobile, zoomSnap: 0.25, attributionControl: true }).setView([IGR.lat, IGR.lng], 11);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap', maxZoom: 18 }).addTo(mapa);
    DESTINOS.forEach(d => {
      const esIgr = d.id === 'aeropuerto';
      const icono = L.divIcon({
        className: 'pin-icono',
        html: esIgr ? `<span class="pin pin--igr">${ICONO_AVION}</span>` : '<span class="pin"></span>',
        iconSize: [22, 22],
        iconAnchor: [11, 11]
      });
      const m = L.marker([d.lat, d.lng], { icon: icono, title: d.nombre, alt: d.nombre, keyboard: false, zIndexOffset: esIgr ? 500 : 0 }).addTo(mapa);
      m.bindTooltip(d.nombre, { direction: 'top', offset: [0, -12] });
      m.on('click', () => seleccionar(d.id));
      marcadores[d.id] = m;
    });
  }

  const padding = () => mqMovil.matches
    ? { paddingTopLeft: [30, 40], paddingBottomRight: [30, 30] }
    : { paddingTopLeft: [mapaEl && mapaEl.clientWidth > 640 ? 390 : 40, 50], paddingBottomRight: [50, 50] };

  const pinDe = id => marcadores[id]?.getElement()?.querySelector('.pin');

  function seleccionar(id, opciones = {}) {
    const d = DESTINOS.find(x => x.id === id);
    if (!d) return;
    actual = id;
    botones.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.dest === id)));
    if (ficha.nombre) {
      ficha.desde.textContent = d.desde || 'IGR';
      ficha.pais.textContent = d.id === 'aeropuerto' ? 'IGR' : d.pais;
      ficha.nombre.textContent = d.nombre;
      ficha.desc.textContent = d.desc;
      ficha.btn.href = wspHref(d.msg || `Hola Marito! Quiero consultar un viaje a ${d.nombre}.`);
    }
    if (!mapa) return;
    Object.keys(marcadores).forEach(k => pinDe(k)?.classList.toggle('pin--sel', k === id));
    const origen = d.id === 'aeropuerto' ? PUERTO_IGUAZU : IGR;
    if (ruta) mapa.removeLayer(ruta);
    ruta = L.polyline(curva(origen, d), { color: '#a8452b', weight: 3, opacity: 0.95, dashArray: '2 9', lineCap: 'round', className: 'ruta-mapa', interactive: false }).addTo(mapa);
    if (opciones.mover !== false) {
      mapa.flyToBounds(L.latLngBounds([[origen.lat, origen.lng], [d.lat, d.lng]]), { ...padding(), maxZoom: 13, animate: !reduceMotion, duration: 0.9 });
    }
  }

  function filtrar(pais) {
    paisActual = pais;
    filtros.forEach(f => f.setAttribute('aria-pressed', String(f.dataset.pais === pais)));
    lista.querySelectorAll('li').forEach(li => { li.hidden = pais !== 'todos' && li.dataset.pais !== pais; });
    revelarNuevos(lista);
    const visibles = DESTINOS.filter(d => pais === 'todos' || d.pais === pais);
    Object.keys(marcadores).forEach(k => pinDe(k)?.classList.toggle('pin--apagado', !visibles.some(v => v.id === k) && k !== 'aeropuerto'));
    const sigue = visibles.some(v => v.id === actual);
    if (!sigue) seleccionar(visibles[0].id, { mover: false });
    if (mapa) {
      const puntos = visibles.map(v => [v.lat, v.lng]).concat([[IGR.lat, IGR.lng]]);
      mapa.flyToBounds(L.latLngBounds(puntos), { ...padding(), maxZoom: 12, animate: !reduceMotion, duration: 0.9 });
    }
    refrescar();
  }

  botones.forEach(b => b.addEventListener('click', () => {
    seleccionar(b.dataset.dest);
    if (mqMovil.matches && mapaWrap) mapaWrap.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  }));
  filtros.forEach(f => f.addEventListener('click', () => filtrar(f.dataset.pais)));
  document.querySelectorAll('.postal').forEach(p => p.addEventListener('click', () => {
    const d = DESTINOS.find(x => x.id === p.dataset.dest);
    if (!d) return;
    if (paisActual !== 'todos' && paisActual !== d.pais) filtrar('todos');
    seleccionar(d.id);
    mapaWrap?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: mqMovil.matches ? 'start' : 'center' });
  }));

  seleccionar(actual, { mover: false });
  if (mapa) {
    const d = DESTINOS.find(x => x.id === actual);
    mapa.fitBounds(L.latLngBounds([[IGR.lat, IGR.lng], [d.lat, d.lng]]), { ...padding(), maxZoom: 13, animate: false });
    window.addEventListener('load', () => mapa.invalidateSize());
  }
}

function initTabs() {
  const tabs = [...document.querySelectorAll('.tab[role="tab"]')];
  if (!tabs.length) return;
  const activar = (tab, foco) => {
    tabs.forEach(t => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      const panel = document.getElementById(t.getAttribute('aria-controls'));
      if (panel) panel.hidden = !on;
      if (on && panel) revelarNuevos(panel);
    });
    if (foco) tab.focus();
    refrescar();
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => activar(t, false));
    t.addEventListener('keydown', e => {
      let j = -1;
      if (e.key === 'ArrowRight') j = (i + 1) % tabs.length;
      else if (e.key === 'ArrowLeft') j = (i - 1 + tabs.length) % tabs.length;
      else if (e.key === 'Home') j = 0;
      else if (e.key === 'End') j = tabs.length - 1;
      if (j < 0) return;
      e.preventDefault();
      activar(tabs[j], true);
    });
  });
}

function initPedido() {
  const form = document.getElementById('pedidoForm');
  if (!form) return;
  const fecha = document.getElementById('fFecha');
  if (fecha) {
    const hoy = new Date();
    const pad = n => String(n).padStart(2, '0');
    fecha.min = `${hoy.getFullYear()}-${pad(hoy.getMonth() + 1)}-${pad(hoy.getDate())}`;
  }
  const reglas = {
    fDesde: el => el.value.trim().length >= 3,
    fHasta: el => el.value !== '',
    fFecha: el => el.value !== '',
    fNombre: el => el.value.trim().length >= 2
  };
  const validar = el => {
    const ok = reglas[el.id](el);
    const err = document.getElementById(`${el.id}Err`);
    if (ok) {
      el.removeAttribute('aria-invalid');
      el.removeAttribute('aria-describedby');
      if (err) err.hidden = true;
    } else {
      el.setAttribute('aria-invalid', 'true');
      if (err) { el.setAttribute('aria-describedby', err.id); err.hidden = false; }
    }
    return ok;
  };
  Object.keys(reglas).forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    const revisar = () => { if (el.getAttribute('aria-invalid') === 'true') validar(el); };
    el.addEventListener('input', revisar);
    el.addEventListener('change', revisar);
  });
  form.addEventListener('submit', e => {
    e.preventDefault();
    const campos = Object.keys(reglas).map(id => document.getElementById(id)).filter(Boolean);
    const malos = campos.filter(el => !validar(el));
    if (malos.length) { malos[0].focus(); return; }
    const v = id => document.getElementById(id)?.value.trim() || '';
    const [a, m, d] = v('fFecha').split('-').map(Number);
    const dia = new Date(a, m - 1, d).toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' });
    const lineas = [
      'Hola Marito! Quiero pedir un traslado.',
      `• Desde: ${v('fDesde')}`,
      `• Hasta: ${v('fHasta')}`,
      `• Día: ${dia}${v('fHora') ? ` a las ${v('fHora')} h` : ''}`,
      `• Pasajeros: ${v('fPasajeros')}`,
      `Soy ${v('fNombre')}.`
    ];
    window.open(wspHref(lineas.join('\n')), '_blank', 'noopener');
    showToast('Listo: se abrió WhatsApp con tu pedido. Solo falta enviarlo.');
  });
}

function initFaq() {
  document.querySelectorAll('.faq__item').forEach(d => d.addEventListener('toggle', refrescar));
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
  if (img) tl.from(img, { scale: 1.1, duration: 1.8 }, 0);
  const tarjeta = hero.querySelector('.hero__visual--card');
  if (tarjeta) tl.from(tarjeta, { y: 48, opacity: 0, duration: 1.2, clearProps: 'transform,opacity' }, 0.3);
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.sello, .hero-badge'), { scale: 0.92, opacity: 0, duration: 1.1, stagger: 0.1, clearProps: 'transform,opacity' }, 0.65);
  const fondo = hero.querySelector('.hero__fondo img');
  if (fondo && typeof ScrollTrigger !== 'undefined') {
    gsap.to(fondo, { yPercent: 4, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
  }
}

[initWspLinks, initModelBarScroll, initWspFloat, initNav, initDestinos, initTabs, initPedido, initFaq, initReveals, initHeroMotion].forEach(fn => {
  try { fn(); } catch (e) { console.error(e); }
});
