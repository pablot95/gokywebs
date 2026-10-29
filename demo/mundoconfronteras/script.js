const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5493757337310';
const WSP_ELIAS = '5493757500780';

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = (e.key || '').toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const waLink = (msg, num = WSP) => `https://wa.me/${num}?text=${encodeURIComponent(msg)}`;

const DESTINOS = {
  ar: { nombre: 'Cataratas · Argentina', largo: 'Cataratas · lado argentino', dist: '18 km · 25 min aprox.', sello: ['Argentina', 'Iguazú', 'Parque Nacional'], cls: 'sello-pas--verde' },
  br: { nombre: 'Cataratas · Brasil', largo: 'Cataratas · lado brasilero', dist: '16 km · 20 min + Migraciones', sello: ['Brasil', 'Iguaçu', 'Cruce de frontera'], cls: '' },
  wanda: { nombre: 'Minas de Wanda', largo: 'Minas de Wanda', dist: '50 km · menos de 1 h', sello: ['Wanda', 'Amatista', 'Ruta 12'], cls: 'sello-pas--tierra' },
  otro: { nombre: 'Otro destino', largo: 'Otro destino', dist: 'A definir', sello: ['Traslado', 'A medida', 'Nac. o internac.'], cls: '' }
};

const RUTAS = {
  ar: {
    color: '#47751F', nombre: 'Cataratas · Argentina', corto: 'Cataratas AR', dir: 'right', off: [14, 0],
    linea: [[-25.5997, -54.5746], [-25.5976, -54.5768], [-25.6145, -54.5591], [-25.6419, -54.5331], [-25.6744, -54.4917], [-25.6904, -54.4784], [-25.6887, -54.4719], [-25.6882, -54.4626], [-25.6885, -54.4610], [-25.6901, -54.4589], [-25.6900, -54.4575], [-25.6890, -54.4563], [-25.6824, -54.4538]]
  },
  br: {
    color: '#2A4866', nombre: 'Cataratas · Brasil', corto: 'Cataratas BR', dir: 'top', off: [0, -14],
    linea: [[-25.5997, -54.5746], [-25.5976, -54.5768], [-25.6074, -54.5668], [-25.6064, -54.5677], [-25.6064, -54.5637], [-25.6047, -54.5637], [-25.5976, -54.5611], [-25.5938, -54.5587], [-25.5868, -54.5629], [-25.5858, -54.5622], [-25.5850, -54.5631], [-25.5850, -54.5646], [-25.5836, -54.5649], [-25.5816, -54.5628], [-25.5764, -54.5535], [-25.5752, -54.5499], [-25.5814, -54.5311], [-25.5821, -54.5271], [-25.5965, -54.5101], [-25.6132, -54.4830], [-25.6141, -54.4811], [-25.6140, -54.4793]]
  },
  wanda: {
    color: '#9C4A2C', nombre: 'Minas de Wanda', corto: 'Wanda', dir: 'left', off: [-14, 0],
    linea: [[-25.5997, -54.5746], [-25.5976, -54.5768], [-25.6419, -54.5331], [-25.6691, -54.4991], [-25.6899, -54.5142], [-25.7039, -54.5150], [-25.7169, -54.5202], [-25.7307, -54.5323], [-25.7479, -54.5397], [-25.7864, -54.5362], [-25.8083, -54.5392], [-25.8248, -54.5373], [-25.8290, -54.5398], [-25.8360, -54.5544], [-25.8402, -54.5579], [-25.8705, -54.5530], [-25.8822, -54.5632], [-25.8972, -54.5572], [-25.9151, -54.5733], [-25.9283, -54.5769], [-25.9635, -54.5789], [-25.9573, -54.5987]]
  }
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

let revealsListos = false;
function revelarNuevos(cont) {
  if (!revealsListos || !cont) return;
  const nuevos = [...cont.querySelectorAll('[data-animate]:not(.in)')].filter(el => el.getClientRects().length);
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
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.sello, .hero-badge'), { scale: 0.92, opacity: 0, duration: 1.1, stagger: 0.1, clearProps: 'transform,opacity' }, 0.65);
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('[data-parallax]').forEach(el => {
    gsap.fromTo(el, { yPercent: -3 }, {
      yPercent: 3,
      ease: 'none',
      scrollTrigger: { trigger: el.closest('.hero') || el, start: 'top top', end: 'bottom top', scrub: true }
    });
  });
}

function trapFoco(cont, e) {
  const f = [...cont.querySelectorAll('a[href], button:not([disabled]), input, select, [tabindex]:not([tabindex="-1"])')].filter(el => el.getClientRects().length);
  if (!f.length) return;
  const i = f.indexOf(document.activeElement);
  if (e.shiftKey && (i <= 0)) { e.preventDefault(); f[f.length - 1].focus(); }
  else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
}

function initDestinoModal() {
  const modal = document.getElementById('destinoModal');
  const cuerpo = document.getElementById('destinoModalCuerpo');
  if (!modal || !cuerpo) return;
  const panel = modal.querySelector('.modal__panel');
  let ultimo = null;
  const abrir = (id, origen) => {
    const fuente = document.getElementById(`detalle-${id}`);
    if (!fuente) return;
    ultimo = origen || document.activeElement;
    cuerpo.replaceChildren(fuente.content.cloneNode(true));
    modal.setAttribute('aria-label', cuerpo.querySelector('h3')?.textContent || 'Detalle del destino');
    modal.hidden = false;
    document.body.classList.add('no-scroll');
    modal.querySelector('.modal__cerrar')?.focus();
  };
  const cerrar = (devolverFoco = true) => {
    modal.hidden = true;
    cuerpo.replaceChildren();
    document.body.classList.remove('no-scroll');
    if (devolverFoco) ultimo?.focus?.();
  };
  document.querySelectorAll('[data-destino]').forEach(b => b.addEventListener('click', () => abrir(b.dataset.destino, b)));
  modal.querySelectorAll('[data-cerrar]').forEach(el => el.addEventListener('click', () => cerrar()));
  cuerpo.addEventListener('click', e => { if (e.target.closest('[data-pedir]')) cerrar(false); });
  document.addEventListener('keydown', e => {
    if (modal.hidden) return;
    if (e.key === 'Escape') cerrar();
    else if (e.key === 'Tab') trapFoco(panel, e);
  });
}

function initPedir() {
  document.addEventListener('click', e => {
    const a = e.target.closest('[data-pedir]');
    if (!a) return;
    const radio = document.querySelector(`#pedidoForm input[name="destino"][value="${a.dataset.pedir}"]`);
    if (!radio) return;
    e.preventDefault();
    radio.checked = true;
    radio.dispatchEvent(new window.Event('change', { bubbles: true }));
    document.getElementById('pedido')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    setTimeout(() => radio.focus({ preventScroll: true }), reduceMotion ? 0 : 700);
  });
}

function initGaleria() {
  const lista = document.getElementById('galeriaLista');
  if (!lista) return;
  const items = [...lista.querySelectorAll('.foto-item')];
  const botones = [...document.querySelectorAll('[data-filtro]')];
  botones.forEach(b => b.addEventListener('click', () => {
    const f = b.dataset.filtro;
    botones.forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    items.forEach(it => { it.hidden = f !== 'todo' && it.dataset.cat !== f; });
    lista.classList.toggle('filtrada', f !== 'todo');
    if (lista.classList.contains('riel')) lista.scrollLeft = 0;
    lista.dispatchEvent(new window.Event('scroll'));
    revelarNuevos(lista);
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  }));

  const visor = document.getElementById('visor');
  const vImg = document.getElementById('visorImg');
  const vPie = document.getElementById('visorPie');
  const vCuenta = document.getElementById('visorCuenta');
  if (!visor || !vImg) return;
  let lista_ = [];
  let actual = 0;
  let ultimo = null;
  const pintar = () => {
    const btn = lista_[actual]?.querySelector('.foto-btn');
    const img = btn?.querySelector('img');
    if (!img) return;
    vImg.src = img.getAttribute('src');
    vImg.alt = img.alt;
    vPie.textContent = btn.dataset.pie || '';
    vCuenta.textContent = `${actual + 1} / ${lista_.length}`;
  };
  const abrir = (item, origen) => {
    lista_ = items.filter(it => !it.hidden);
    actual = Math.max(0, lista_.indexOf(item));
    ultimo = origen;
    pintar();
    visor.hidden = false;
    document.body.classList.add('no-scroll');
    visor.querySelector('.visor__cerrar')?.focus();
  };
  const cerrar = () => {
    visor.hidden = true;
    document.body.classList.remove('no-scroll');
    ultimo?.focus?.();
  };
  const mover = d => {
    if (!lista_.length) return;
    actual = (actual + d + lista_.length) % lista_.length;
    pintar();
  };
  items.forEach(it => it.querySelector('.foto-btn')?.addEventListener('click', e => abrir(it, e.currentTarget)));
  visor.querySelector('[data-cerrar-visor]')?.addEventListener('click', cerrar);
  visor.querySelectorAll('[data-visor-paso]').forEach(b => b.addEventListener('click', () => mover(Number(b.dataset.visorPaso))));
  visor.addEventListener('click', e => { if (e.target === visor || e.target.classList.contains('visor__figura')) cerrar(); });
  document.addEventListener('keydown', e => {
    if (visor.hidden) return;
    if (e.key === 'Escape') cerrar();
    else if (e.key === 'ArrowRight') mover(1);
    else if (e.key === 'ArrowLeft') mover(-1);
    else if (e.key === 'Tab') trapFoco(visor, e);
  });
}

function initRiel() {
  const riel = document.querySelector('.riel');
  if (!riel) return;
  let x0 = 0;
  let s0 = 0;
  let activo = false;
  let movido = false;
  riel.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    activo = true;
    movido = false;
    x0 = e.clientX;
    s0 = riel.scrollLeft;
  });
  window.addEventListener('pointermove', e => {
    if (!activo) return;
    const dx = e.clientX - x0;
    if (!movido && Math.abs(dx) > 6) { movido = true; riel.classList.add('arrastrando'); }
    if (movido) riel.scrollLeft = s0 - dx;
  });
  window.addEventListener('pointerup', () => {
    if (!activo) return;
    activo = false;
    if (movido) {
      const sl = riel.scrollLeft;
      riel.classList.remove('arrastrando');
      riel.scrollLeft = sl;
      setTimeout(() => { movido = false; }, 0);
    }
  });
  riel.addEventListener('click', e => { if (movido) { e.preventDefault(); e.stopPropagation(); } }, true);
  const flechas = [...document.querySelectorAll('[data-riel]')];
  const paso = () => {
    const it = [...riel.querySelectorAll('.foto-item')].find(x => !x.hidden);
    return it ? it.getBoundingClientRect().width + 16 : 300;
  };
  flechas.forEach(b => b.addEventListener('click', () => {
    riel.scrollBy({ left: Number(b.dataset.riel) * paso() * 2, behavior: reduceMotion ? 'auto' : 'smooth' });
  }));
  const estado = () => {
    const max = riel.scrollWidth - riel.clientWidth - 2;
    flechas.forEach(b => { b.disabled = b.dataset.riel === '-1' ? riel.scrollLeft <= 2 : riel.scrollLeft >= max; });
  };
  riel.addEventListener('scroll', estado, { passive: true });
  window.addEventListener('resize', estado, { passive: true });
  estado();
}

function initMapa() {
  const el = document.getElementById('mapa');
  if (!el || typeof L === 'undefined') return;
  const base = [-25.5997, -54.5746];
  const puente = [-25.5886, -54.5617];
  const mapa = L.map(el, { scrollWheelZoom: false, zoomControl: true, attributionControl: true });
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap', maxZoom: 18 }).addTo(mapa);
  mapa.attributionControl.setPrefix(false);
  const icono = (cls, color, size) => L.divIcon({ className: `pin ${cls}`, html: `<span style="--pin:${color}"></span>`, iconSize: [size, size], iconAnchor: [size / 2, size / 2], tooltipAnchor: [0, 0] });
  const angosto = el.clientWidth < 560;
  const capas = {};
  Object.entries(RUTAS).forEach(([id, r]) => {
    const linea = L.polyline(r.linea, { color: r.color, weight: 4, opacity: 0.92, dashArray: '1 9', lineCap: 'round', interactive: false }).addTo(mapa);
    const fin = L.marker(r.linea[r.linea.length - 1], { icon: icono('', r.color, 22), keyboard: false, title: r.nombre })
      .addTo(mapa)
      .bindTooltip(angosto ? r.corto : r.nombre, { permanent: true, direction: r.dir, offset: r.off, className: 'etiqueta' });
    capas[id] = { linea, fin };
  });
  L.marker(puente, { icon: icono('pin--puente', '', 14), keyboard: false, title: 'Puente Tancredo Neves · Migraciones' })
    .addTo(mapa)
    .bindTooltip('Puente Tancredo Neves · Migraciones', { direction: 'top', offset: [0, -10], className: 'etiqueta etiqueta--suave' });
  L.marker(base, { icon: icono('pin--base', '', 30), keyboard: false, title: 'Puerto Iguazú', zIndexOffset: 500 })
    .addTo(mapa)
    .bindTooltip(angosto ? 'Pto. Iguazú' : 'Puerto Iguazú', { permanent: true, direction: 'left', offset: [-18, 0], className: 'etiqueta' });
  const todos = L.latLngBounds([base, ...Object.values(RUTAS).flatMap(r => r.linea)]);
  let elegido = null;
  const encuadrar = () => {
    const b = elegido ? L.latLngBounds([base, ...RUTAS[elegido].linea]) : todos;
    const ancho = document.body.classList.contains('m2');
    const tapa = ancho ? (window.innerWidth > 860 ? 170 : 70) : 40;
    const lado = el.clientWidth < 560 ? [74, 88] : [120, 130];
    mapa.fitBounds(b, { paddingTopLeft: [lado[0], 40], paddingBottomRight: [lado[1], tapa], animate: false, maxZoom: 13 });
  };
  const botones = [...document.querySelectorAll('.ruta-btn')];
  botones.forEach(b => b.addEventListener('click', () => {
    elegido = elegido === b.dataset.ruta ? null : b.dataset.ruta;
    botones.forEach(x => x.setAttribute('aria-pressed', String(x.dataset.ruta === elegido)));
    Object.entries(capas).forEach(([k, c]) => {
      const on = !elegido || k === elegido;
      c.linea.setStyle({ opacity: on ? 0.92 : 0.18, weight: elegido === k ? 6 : 4 });
      c.fin.setOpacity(on ? 1 : 0.4);
      if (elegido === k) c.linea.bringToFront();
    });
    if (elegido === 'br') capas.br.fin.openTooltip();
    encuadrar();
  }));
  encuadrar();
  window.addEventListener('load', () => { mapa.invalidateSize(); encuadrar(); });
  let t = 0;
  window.addEventListener('resize', () => { clearTimeout(t); t = setTimeout(() => { mapa.invalidateSize(); encuadrar(); }, 150); }, { passive: true });
}

function initPedido() {
  const form = document.getElementById('pedidoForm');
  if (!form) return;
  const $ = id => document.getElementById(id);
  const enviar = $('pedidoEnviar');
  const elias = $('pedidoElias');
  const sello = $('pSello');
  const otro = form.querySelector('[name="otro"]');
  const fecha = form.querySelector('[name="fecha"]');
  const out = $('pasajeros');
  const MIN = 1;
  const MAX = 30;
  let pasajeros = 2;
  let ultimoDestino = 'ar';
  const hoy = new Date();
  const dd = n => String(n).padStart(2, '0');
  fecha.min = `${hoy.getFullYear()}-${dd(hoy.getMonth() + 1)}-${dd(hoy.getDate())}`;
  const valor = n => (form.querySelector(`[name="${n}"]`)?.value || '').trim();
  const elegido = n => form.querySelector(`input[name="${n}"]:checked`)?.value || '';
  const dia = () => {
    if (!fecha.value) return 'A confirmar';
    const [a, m, d] = fecha.value.split('-').map(Number);
    const txt = new Date(a, m - 1, d).toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' });
    return txt.charAt(0).toUpperCase() + txt.slice(1);
  };
  const destinoTexto = () => {
    const id = elegido('destino');
    if (id === 'otro') return valor('otro') || 'Otro destino';
    return DESTINOS[id]?.largo || '';
  };
  const mensaje = () => {
    const lineas = ['Hola Mundo con fronteras, quiero consultar un traslado.', `Destino: ${destinoTexto()}`, `Día: ${dia()}`, `Pasajeros: ${pasajeros}`, `Tramo: ${elegido('tramo')}`];
    if (valor('alojamiento')) lineas.push(`Nos buscan en: ${valor('alojamiento')}`);
    if (valor('nombre')) lineas.push(`Mi nombre: ${valor('nombre')}`);
    return lineas.join('\n');
  };
  const sellar = id => {
    const d = DESTINOS[id];
    if (!d || !sello) return;
    sello.className = `sello-pas pase__sello ${d.cls}`.trim();
    sello.innerHTML = `<span>${esc(d.sello[0])}</span><strong>${esc(d.sello[1])}</strong><span>${esc(d.sello[2])}</span>`;
    if (!reduceMotion) { void sello.offsetWidth; sello.classList.add('sellar'); }
  };
  const pintar = () => {
    const id = elegido('destino');
    $('otroWrap').hidden = id !== 'otro';
    $('pDestino').textContent = id === 'otro' ? (valor('otro') || 'Otro destino') : DESTINOS[id].nombre;
    $('pDist').textContent = DESTINOS[id]?.dist || '';
    $('pFecha').textContent = dia();
    $('pPasajeros').textContent = String(pasajeros);
    $('pTramo').textContent = elegido('tramo');
    $('pAloja').textContent = valor('alojamiento') || 'Lo coordinamos por WhatsApp';
    out.textContent = String(pasajeros);
    form.querySelector('[data-paso="-1"]').disabled = pasajeros <= MIN;
    form.querySelector('[data-paso="1"]').disabled = pasajeros >= MAX;
    if (id !== ultimoDestino) { ultimoDestino = id; sellar(id); }
    enviar.href = waLink(mensaje());
    if (elias) elias.href = waLink(mensaje(), WSP_ELIAS);
  };
  const marcarOtro = mal => {
    const err = $('otroError');
    if (mal) { otro.setAttribute('aria-invalid', 'true'); err.hidden = false; }
    else { otro.removeAttribute('aria-invalid'); err.hidden = true; }
  };
  form.addEventListener('input', e => {
    if (e.target === otro && otro.value.trim()) marcarOtro(false);
    pintar();
  });
  form.addEventListener('change', pintar);
  form.querySelectorAll('[data-paso]').forEach(b => b.addEventListener('click', () => {
    pasajeros = Math.min(MAX, Math.max(MIN, pasajeros + Number(b.dataset.paso)));
    pintar();
  }));
  const validar = e => {
    if (elegido('destino') === 'otro' && !otro.value.trim()) {
      e.preventDefault();
      marcarOtro(true);
      otro.focus();
      showToast('Contanos el destino y armamos el mensaje');
      return;
    }
    e.currentTarget.href = waLink(mensaje(), e.currentTarget === elias ? WSP_ELIAS : WSP);
    showToast('Abrimos WhatsApp con tu consulta lista');
  };
  enviar.addEventListener('click', validar);
  elias?.addEventListener('click', validar);
  pintar();
}

function initFaq() {
  document.querySelectorAll('.faq__item').forEach(d => d.addEventListener('toggle', () => {
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  }));
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; (document.querySelector('.site-header') || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 1061px)');
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

[initDestinoModal, initPedir, initGaleria, initRiel, initMapa, initPedido, initFaq, initHeroMotion, initParallax, initReveals, initNav, initWspFloat, initModelBarScroll]
  .forEach(fn => { try { fn(); } catch (e) { console.error(e); } });
