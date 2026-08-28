document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5493757315657';

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const nf = n => Number(n).toLocaleString('es-AR');

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}
if (typeof gsap === 'undefined') {
  document.querySelectorAll('[data-animate],[data-hero]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
}
if (typeof ScrollTrigger !== 'undefined') {
  window.addEventListener('load', () => ScrollTrigger.refresh());
}

const DESTINOS = [
  { id: 'igr', corto: 'IGR', nombre: 'Aeropuerto Cataratas (IGR)', x: 352, y: 300, kx: 10, ky: -13, pais: 'AR' },
  { id: 'centro', corto: 'Centro', nombre: 'Puerto Iguazú (centro)', x: 232, y: 214, kx: 0, ky: 0, pais: 'AR' },
  { id: 'cataratas', corto: 'Cataratas', nombre: 'Parque Nacional Iguazú', x: 420, y: 240, kx: 13, ky: -8, pais: 'AR' },
  { id: 'hito', corto: 'Hito', nombre: 'Hito Tres Fronteras', x: 196, y: 150, kx: -1.5, ky: 1.5, pais: 'AR' },
  { id: 'foz', corto: 'Foz', nombre: 'Foz do Iguaçu (Brasil)', x: 330, y: 128, kx: 12, ky: 10, pais: 'BR' },
  { id: 'igu', corto: 'IGU', nombre: 'Aeropuerto de Foz (IGU)', x: 452, y: 108, kx: 24, ky: 6, pais: 'BR' },
  { id: 'cde', corto: 'C. del Este', nombre: 'Ciudad del Este (Paraguay)', x: 150, y: 62, kx: -6, ky: 20, pais: 'PY' },
  { id: 'wanda', corto: 'Wanda', nombre: 'Minas de Wanda', x: 300, y: 400, kx: 20, ky: -26, pais: 'AR' }
];

const VEHICULOS = [
  {
    id: 'taxi', titulo: 'Auto / Taxi', badge: 'Más económico', min: 1, max: 4,
    pax: '1 a 4 pasajeros', valijas: '2 a 3 valijas', extra: 'Aire acondicionado', desde: 8500,
    why: 'Hasta 4 pasajeros con 2 o 3 valijas: la opción más directa y económica.',
    svg: '<svg viewBox="0 0 120 56" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 39c0-5 3-7.4 8-8.3l14-2.4 9-8.3c2.2-2 5-3 8-3h19c3 0 5.9 1 8.1 3l9 8.3 14 2.4c5 .9 8 3.3 8 8.3v3a2 2 0 0 1-2 2h-6"/><path d="M12 44h5.5"/><path d="M41.5 44h37"/><circle cx="29.5" cy="44" r="7.4"/><circle cx="90" cy="44" r="7.4"/><path d="M42 28.5l7.5-7.2h9.5v7.2z"/><path d="M64 21.3h8.5l7.6 7.2H64z"/></svg>'
  },
  {
    id: 'van', titulo: 'Van', badge: 'Ideal para grupos chicos', min: 1, max: 7,
    pax: '1 a 7 pasajeros', valijas: '7 valijas', extra: 'Asientos individuales', desde: 15000,
    why: 'Hasta 7 pasajeros viajando juntos, con lugar real para el equipaje de todos.',
    svg: '<svg viewBox="0 0 120 56" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 41v-8.5c0-2.2 1.2-4 3.2-4.9L21 23.2c2.1-3.1 4.6-4.7 8-4.7h63.5c3.3 0 5.5 2.2 5.5 5.5V40a2 2 0 0 1-2 2h-5"/><path d="M8 44h6.5"/><path d="M36.5 44h35"/><circle cx="25" cy="44" r="7.4"/><circle cx="84" cy="44" r="7.4"/><path d="M13.8 31.6l7.6-4c1.6-2.4 3.4-3.6 6-3.6h6.4v7.6z"/><path d="M40 23.9h20.5v10H40z"/><path d="M66.5 23.9H87v10H66.5z"/></svg>'
  },
  {
    id: 'minivan', titulo: 'Minivan', badge: 'Más espacio y confort', min: 1, max: 12,
    pax: '1 a 12 pasajeros', valijas: '12 valijas', extra: 'Bodega grande', desde: 19000,
    why: 'De 8 a 12 pasajeros: asientos individuales y bodega grande para valijas y cochecitos.',
    svg: '<svg viewBox="0 0 120 56" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 40V25.5c0-3.6 2.5-6.4 6-7.2l18-4c2.4-.5 4.3-.8 6.6-.8H73c3.4 0 6 1 8.5 3.3l11.5 10.4 6 1.7c3.6 1 5.5 3 5.5 6.6V40a2 2 0 0 1-2 2h-5.5"/><path d="M10 44h6"/><path d="M40 44h31"/><circle cx="28" cy="44" r="7.4"/><circle cx="83" cy="44" r="7.4"/><path d="M20 25.6l15.5-3.2H50v11.4H20z"/><path d="M56 22.4h16.5l10.4 11.4H56z"/></svg>'
  },
  {
    id: 'bus', titulo: 'Bus', badge: 'Para grandes grupos', min: 13, max: 50,
    pax: '13 a 50 pasajeros', valijas: 'Hasta 50 valijas', extra: 'Bodega y aire', desde: 35000,
    why: 'Contingentes de 13 a 50 pasajeros: bus con aire, bodega y chofer para todo el día.',
    svg: '<svg viewBox="0 0 120 56" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 41V15.5c0-3 2.2-5.2 5.2-5.2h93c3 0 5.2 2.2 5.2 5.2V40a2 2 0 0 1-2 2h-5"/><path d="M7 44h6"/><path d="M36 44h39"/><circle cx="24" cy="44" r="7.4"/><circle cx="87" cy="44" r="7.4"/><path d="M12.5 17.5h86.5v12.5H12.5z"/><path d="M34.1 17.5v12.5M55.7 17.5v12.5M77.3 17.5v12.5"/><path d="M12.5 35h18"/></svg>'
  }
];

const EXCURSIONES = [
  { n: '01', tit: 'Cataratas del lado argentino', img: 'images/salto-selva-1200x900.webp', alt: 'Salto de agua cayendo entre vegetación de selva', w: 1200, h: 900, dur: 'Día completo', txt: 'Los tres circuitos del Parque Nacional, el Tren Ecológico y la Garganta del Diablo. Te dejamos en el acceso y te esperamos a la salida.' },
  { n: '02', tit: 'Cataratas del lado brasileño', img: 'images/hero-cataratas-1920x1080.webp', alt: 'Vista panorámica de las Cataratas del Iguazú desde el mirador brasileño', w: 1920, h: 1080, dur: 'Medio día', txt: 'La vista panorámica de los saltos, la que sale en todas las fotos. Cruce de frontera con documentación en regla y espera incluida.' },
  { n: '03', tit: 'Gran Aventura náutica', img: 'images/rio-aventura-1200x900.webp', alt: 'Lancha navegando un río colorado entre la selva, vista aérea', w: 1200, h: 900, dur: '3 horas', txt: 'Camión ecológico por la selva y lancha hasta el pie de los saltos. Se moja todo el mundo, no hay forma de zafar.' },
  { n: '04', tit: 'Hito Tres Fronteras', img: 'images/laguna-palmeras-1200x900.webp', alt: 'Río ancho bordeado de palmeras con una canoa cruzando', w: 1200, h: 900, dur: '2 horas', txt: 'El mirador donde el Iguazú se junta con el Paraná: Argentina, Brasil y Paraguay a la vista. Va mejor al atardecer.' },
  { n: '05', tit: 'Güirá Oga, refugio de aves', img: 'images/tucan-selva-1200x900.webp', alt: 'Tucán posado en la rama de un árbol de la selva', w: 1200, h: 900, dur: '2 horas', txt: 'Recorrido guiado por el refugio de fauna: tucanes, harpías y rapaces en recuperación, dentro de la selva misionera.' },
  { n: '06', tit: 'Selva y Minas de Wanda', img: 'images/selva-canopy-1920x1080.webp', alt: 'Selva misionera cerrada vista desde arriba', w: 1920, h: 1080, dur: 'Medio día', txt: 'Ruta 12 hacia el sur entre plantaciones y monte cerrado, hasta las minas de piedras preciosas a cielo abierto.' }
];

const getDest = id => DESTINOS.find(d => d.id === id);
const getVeh = id => VEHICULOS.find(v => v.id === id);

function tramo(aId, bId) {
  const a = getDest(aId), b = getDest(bId);
  if (!a || !b || a.id === b.id) return null;
  const km = Math.max(2, Math.round(Math.hypot(b.kx - a.kx, b.ky - a.ky) * 1.25));
  const bruto = km / 52 * 60 + 6 + (a.pais !== b.pais ? 20 : 0);
  const min = Math.max(10, Math.round(bruto / 5) * 5);
  return { a, b, km, min };
}

function recomendar(pax) {
  const n = Number(pax) || 1;
  return VEHICULOS.find(v => n <= v.max) || VEHICULOS[VEHICULOS.length - 1];
}

let estado = { desde: 'igr', hasta: 'centro', pax: 2, modo: 'ida' };

/* ---------------- toast ---------------- */
function showToast(msg) {
  let wrap = document.querySelector('.toast-wrap');
  if (!wrap) { wrap = document.createElement('div'); wrap.className = 'toast-wrap'; wrap.setAttribute('aria-live', 'polite'); document.body.appendChild(wrap); }
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  toast.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg><span>${esc(msg)}</span>`;
  wrap.appendChild(toast);
  setTimeout(() => { toast.classList.add('hiding'); setTimeout(() => toast.remove(), 220); }, 3400);
}

/* ---------------- vehículos ---------------- */
function initVehiculos() {
  const grid = document.getElementById('vehGrid');
  if (!grid) return;
  grid.innerHTML = VEHICULOS.map(v => `
    <article class="veh-card" data-veh="${v.id}" data-animate style="opacity:0;transform:translateY(26px)">
      <span class="veh-badge">${esc(v.badge)}</span>
      <div class="veh-art"><span class="veh-svg">${v.svg}</span></div>
      <div class="veh-body">
        <h3>${esc(v.titulo)}</h3>
        <ul class="veh-specs">
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="8" r="3.4"/><path d="M5.5 19.5c0-3.6 2.9-5.5 6.5-5.5s6.5 1.9 6.5 5.5" stroke-linecap="round"/></svg>${esc(v.pax)}</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="5" y="7.5" width="14" height="12" rx="2"/><path d="M9.5 7.5V5.8c0-.7.6-1.3 1.3-1.3h2.4c.7 0 1.3.6 1.3 1.3v1.7" stroke-linecap="round"/></svg>${esc(v.valijas)}</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M12 3l7.5 3v6c0 4.4-3.1 7.8-7.5 9-4.4-1.2-7.5-4.6-7.5-9V6z"/></svg>${esc(v.extra)}</li>
        </ul>
      </div>
      <div class="veh-foot">
        <span class="veh-precio"><span>Desde</span><b>AR$ ${nf(v.desde)}</b></span>
        <a class="veh-btn" href="https://wa.me/${WSP}" data-veh-btn="${v.id}" target="_blank" rel="noopener">Seleccionar</a>
      </div>
    </article>`).join('');

  grid.querySelectorAll('[data-veh-btn]').forEach(a => {
    a.addEventListener('click', () => { a.href = linkVehiculo(a.dataset.vehBtn); });
    a.href = linkVehiculo(a.dataset.vehBtn);
  });
  marcarRecomendado();
}

function linkVehiculo(id) {
  const v = getVeh(id);
  const t = tramo(estado.desde, estado.hasta);
  let msg = `Hola Iguazú Travel, quiero reservar un traslado en ${v?.titulo || 'un vehículo'}`;
  if (t) msg += ` desde ${t.a.nombre} hasta ${t.b.nombre}`;
  msg += ` para ${estado.pax} ${estado.pax == 1 ? 'pasajero' : 'pasajeros'}.`;
  return `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
}

function marcarRecomendado() {
  const reco = recomendar(estado.pax);
  document.querySelectorAll('.veh-card').forEach(c => {
    const on = c.dataset.veh === reco.id;
    c.classList.toggle('is-reco', on);
    const badge = c.querySelector('.veh-badge');
    const v = getVeh(c.dataset.veh);
    if (badge && v) badge.textContent = on ? 'Recomendado para vos' : v.badge;
    const btn = c.querySelector('[data-veh-btn]');
    if (btn) btn.href = linkVehiculo(c.dataset.veh);
  });
}

function pintarResumen() {
  const box = document.getElementById('vehResumen');
  if (!box) return;
  const t = tramo(estado.desde, estado.hasta);
  if (!t) { box.hidden = true; return; }
  const modo = estado.modo === 'vuelta' ? 'Ida y vuelta' : estado.modo === 'hora' ? 'Servicio por hora' : 'Solo ida';
  box.innerHTML = `<b>${esc(t.a.nombre)}</b> <span class="vr-sep">→</span> <b>${esc(t.b.nombre)}</b>
    <span class="vr-sep">·</span> ${t.km} km <span class="vr-sep">·</span> ${t.min} min estimados
    <span class="vr-sep">·</span> ${esc(modo)} <span class="vr-sep">·</span> ${estado.pax} ${estado.pax == 1 ? 'pasajero' : 'pasajeros'}`;
  box.hidden = false;
}

/* ---------------- mapa de tramos ---------------- */
function initMapa() {
  const cont = document.getElementById('mapaNodos');
  const svg = document.querySelector('.mapa-svg');
  if (!cont || !svg) return;

  cont.innerHTML = DESTINOS.map(d => {
    const lado = d.x < 175 ? ' nodo-izq' : d.x > 425 ? ' nodo-der' : '';
    return `<button type="button" class="nodo${lado}" data-nodo="${d.id}" style="left:${(d.x / 600 * 100).toFixed(2)}%;top:${(d.y / 460 * 100).toFixed(2)}%" aria-label="Elegir ${esc(d.nombre)}">
      <span class="nodo-dot" aria-hidden="true"></span><span class="nodo-lbl">${esc(d.corto)}</span>
    </button>`;
  }).join('');

  cont.querySelectorAll('[data-nodo]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.nodo;
      if (id === estado.desde) return;
      if (id === estado.hasta) { const tmp = estado.desde; estado.desde = estado.hasta; estado.hasta = tmp; }
      else { estado.desde = estado.hasta; estado.hasta = id; }
      sincronizarSelects();
      actualizarTramo(true);
    });
  });
}

function pintarNodos() {
  document.querySelectorAll('[data-nodo]').forEach(b => {
    b.classList.toggle('is-desde', b.dataset.nodo === estado.desde);
    b.classList.toggle('is-hasta', b.dataset.nodo === estado.hasta);
  });
}

let rutaAnim = null;
function dibujarRuta(animar) {
  const path = document.getElementById('rutaViva');
  const pin = document.getElementById('rutaPin');
  const t = tramo(estado.desde, estado.hasta);
  if (!path || !pin || !t) return;

  const { a, b } = t;
  const dx = b.x - a.x, dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const off = len * 0.15;
  const cx = (a.x + b.x) / 2 - (dy / len) * off;
  const cy = (a.y + b.y) / 2 + (dx / len) * off;
  path.setAttribute('d', `M${a.x} ${a.y} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${b.x} ${b.y}`);

  const total = path.getTotalLength();
  path.style.strokeDasharray = total;
  pin.removeAttribute('hidden');

  if (rutaAnim) window.cancelAnimationFrame(rutaAnim);
  if (!animar || reduceMotion) {
    path.style.strokeDashoffset = 0;
    pin.setAttribute('transform', `translate(${b.x} ${b.y})`);
    return;
  }
  const dur = 900;
  const t0 = window.performance.now();
  const paso = now => {
    const p = Math.min(1, (now - t0) / dur);
    const e = 1 - Math.pow(1 - p, 3);
    path.style.strokeDashoffset = total * (1 - e);
    const pt = path.getPointAtLength(total * e);
    pin.setAttribute('transform', `translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)})`);
    if (p < 1) rutaAnim = requestAnimationFrame(paso);
  };
  path.style.strokeDashoffset = total;
  rutaAnim = requestAnimationFrame(paso);
}

function pintarFicha() {
  const t = tramo(estado.desde, estado.hasta);
  if (!t) return;
  const reco = recomendar(estado.pax);
  const set = (id, txt) => { const el = document.getElementById(id); if (el) el.textContent = txt; };
  set('fichaDesde', t.a.nombre);
  set('fichaHasta', t.b.nombre);
  set('fichaKm', `${t.km} km`);
  set('fichaMin', `${t.min} min`);
  set('fichaPax', String(estado.pax));
  set('fichaVeh', reco.titulo);
  set('fichaWhy', reco.why);

  const cta = document.getElementById('fichaWsp');
  if (cta) {
    const modo = estado.modo === 'vuelta' ? ' (ida y vuelta)' : estado.modo === 'hora' ? ' (servicio por hora)' : '';
    const msg = `Hola Iguazú Travel, quiero reservar un traslado desde ${t.a.nombre} hasta ${t.b.nombre}${modo} para ${estado.pax} ${estado.pax == 1 ? 'pasajero' : 'pasajeros'}. Me recomendaron ${reco.titulo}.`;
    cta.href = `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
  }
  const ficha = document.getElementById('ficha');
  if (ficha && !reduceMotion) {
    ficha.classList.remove('is-upd');
    void ficha.offsetWidth;
    ficha.classList.add('is-upd');
  }
}

function actualizarTramo(animar) {
  pintarNodos();
  dibujarRuta(animar);
  pintarFicha();
  pintarResumen();
  marcarRecomendado();
}

/* ---------------- buscador ---------------- */
function sincronizarSelects() {
  const d = document.getElementById('f-desde');
  const h = document.getElementById('f-hasta');
  const p = document.getElementById('f-pax');
  if (d) d.value = estado.desde;
  if (h) h.value = estado.hasta;
  if (p) p.value = String(estado.pax);
}

function initBuscador() {
  const form = document.getElementById('buscador');
  if (!form) return;
  const selDesde = document.getElementById('f-desde');
  const selHasta = document.getElementById('f-hasta');
  const selPax = document.getElementById('f-pax');
  const fecha = document.getElementById('f-fecha');

  const opciones = DESTINOS.map(d => `<option value="${d.id}">${esc(d.nombre)}</option>`).join('');
  selDesde.innerHTML = opciones;
  selHasta.innerHTML = opciones;
  selPax.innerHTML = Array.from({ length: 50 }, (_, i) => {
    const n = i + 1;
    return `<option value="${n}">${n} ${n === 1 ? 'pasajero' : 'pasajeros'}</option>`;
  }).join('');

  if (fecha) {
    const hoy = new Date();
    hoy.setDate(hoy.getDate() + 1);
    const iso = hoy.toISOString().slice(0, 10);
    fecha.value = iso;
    fecha.min = new Date().toISOString().slice(0, 10);
    const fv = document.getElementById('f-fecha-vuelta');
    if (fv) { fv.min = iso; fv.value = iso; }
  }

  sincronizarSelects();

  const onCambio = () => {
    if (selDesde.value === selHasta.value) {
      const otro = DESTINOS.find(d => d.id !== selDesde.value);
      selHasta.value = otro.id;
    }
    estado.desde = selDesde.value;
    estado.hasta = selHasta.value;
    estado.pax = Number(selPax.value) || 1;
    actualizarTramo(false);
  };
  [selDesde, selHasta, selPax].forEach(s => s.addEventListener('change', onCambio));

  form.querySelectorAll('.bus-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      form.querySelectorAll('.bus-tab').forEach(t => {
        const on = t === tab;
        t.classList.toggle('is-on', on);
        t.setAttribute('aria-selected', on ? 'true' : 'false');
      });
      estado.modo = tab.dataset.modo;
      form.querySelector('.campo-vuelta').hidden = estado.modo !== 'vuelta';
      form.querySelector('.campo-duracion').hidden = estado.modo !== 'hora';
      form.querySelector('.campo-hasta').hidden = estado.modo === 'hora';
      pintarResumen();
      if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
    });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    onCambio();
    actualizarTramo(true);
    const destino = document.getElementById('destinos');
    if (destino) {
      const y = destino.getBoundingClientRect().top + window.scrollY - 24;
      window.scrollTo({ top: y, behavior: reduceMotion ? 'auto' : 'smooth' });
    }
    const reco = recomendar(estado.pax);
    showToast(`Tramo armado: te recomendamos ${reco.titulo}.`);
  });
}

/* ---------------- excursiones ---------------- */
function initExcursiones() {
  const track = document.getElementById('excTrack');
  if (!track) return;
  track.innerHTML = EXCURSIONES.map(e => {
    const msg = `Hola Iguazú Travel, quiero consultar por la excursión "${e.tit}".`;
    return `<li class="exc-card">
      <a href="https://wa.me/${WSP}?text=${encodeURIComponent(msg)}" target="_blank" rel="noopener">
        <div class="exc-media">
          <img src="${e.img}" alt="${esc(e.alt)}" width="${e.w}" height="${e.h}" decoding="async">
          <span class="exc-n">${e.n}</span>
          <span class="exc-dur"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2" stroke-linecap="round"/></svg>${esc(e.dur)}</span>
        </div>
        <div class="exc-body">
          <h3>${esc(e.tit)}</h3>
          <p>${esc(e.txt)}</p>
          <span class="exc-link">Consultar por WhatsApp
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h13M13 6.5 18.5 12 13 17.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </span>
        </div>
      </a>
    </li>`;
  }).join('');

  const vp = document.getElementById('excVp');
  const prev = document.getElementById('excPrev');
  const next = document.getElementById('excNext');
  if (!vp) return;

  const sync = () => {
    const inicio = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
    if (prev) prev.disabled = vp.scrollLeft <= inicio + 2;
    if (next) next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  const salto = () => {
    const card = track.querySelector('.exc-card');
    return card ? card.getBoundingClientRect().width + 18 : 300;
  };
  prev?.addEventListener('click', () => vp.scrollBy({ left: -salto(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: salto(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  vp.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync, { passive: true });
  sync();

  initRailDrag(vp);
}

function initRailDrag(vp) {
  let down = false, moved = false, startX = 0, startScroll = 0, pointerId = null;
  const end = () => {
    if (!down) return;
    down = false;
    if (moved) {
      vp.classList.remove('dragging');
      try { vp.releasePointerCapture?.(pointerId); } catch { /* noop */ }
    }
  };
  vp.addEventListener('pointerdown', e => {
    if (e.pointerType === 'touch') return;
    down = true; moved = false; startX = e.clientX; startScroll = vp.scrollLeft; pointerId = e.pointerId;
  });
  vp.addEventListener('pointermove', e => {
    if (!down) return;
    const dx = e.clientX - startX;
    if (!moved && Math.abs(dx) < 6) return;
    if (!moved) {
      moved = true;
      vp.classList.add('dragging');
      try { vp.setPointerCapture?.(pointerId); } catch { /* noop */ }
    }
    vp.scrollLeft = startScroll - dx;
  });
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
  vp.addEventListener('pointerleave', end);
  vp.addEventListener('click', e => { if (moved) { e.preventDefault(); e.stopPropagation(); } }, true);
}

/* ---------------- pasos (sticky chapters) ---------------- */
function initPasos() {
  const seccion = document.getElementById('itinerario');
  const pasos = Array.from(document.querySelectorAll('.paso'));
  const imgs = Array.from(document.querySelectorAll('.paso-visual img'));
  const chip = document.getElementById('pasoChip');
  if (!seccion || !pasos.length || !imgs.length) return;
  const titulos = ['01 · Reservás', '02 · Te esperamos', '03 · Viajás'];

  let actual = -1;
  const activar = i => {
    if (i === actual) return;
    actual = i;
    pasos.forEach((p, k) => p.classList.toggle('is-on', k === i));
    imgs.forEach((im, k) => im.classList.toggle('is-on', k === i));
    if (chip) chip.textContent = titulos[i] || titulos[0];
  };

  const grid = document.getElementById('pasosGrid');

  const elegir = () => {
    const s = seccion.getBoundingClientRect();
    if (s.bottom < 0 || s.top > window.innerHeight) return;
    const apilado = grid ? window.getComputedStyle(grid).gridTemplateColumns.trim().split(/\s+/).length === 1 : false;
    const centro = window.innerHeight * (apilado ? 0.68 : 0.5);
    let mejor = 0, dist = Infinity;
    pasos.forEach((p, i) => {
      const r = p.getBoundingClientRect();
      const d = Math.abs(r.top + r.height / 2 - centro);
      if (d < dist) { dist = d; mejor = i; }
    });
    activar(mejor);
  };

  activar(0);
  let queued = false;
  const onScroll = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; elegir(); });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  elegir();
}

/* ---------------- reveals ---------------- */
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

/* ---------------- hero ---------------- */
function initHero() {
  const items = document.querySelectorAll('[data-hero]');
  const foto = document.querySelector('.hero-foto img');
  if (reduceMotion || typeof gsap === 'undefined') {
    items.forEach(el => el.classList.add('in'));
    return;
  }
  gsap.set(items, { clearProps: 'all' });
  gsap.set(items, { opacity: 0, y: 24 });
  const tl = gsap.timeline({ delay: .1 });
  if (foto) tl.fromTo(foto, { scale: 1.09 }, { scale: 1, duration: 1.6, ease: 'power2.out' }, 0);
  tl.to(items, { opacity: 1, y: 0, duration: .95, stagger: .13, ease: 'power3.out' }, .18);
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  const foto = document.querySelector('.hero-foto img');
  if (foto) {
    gsap.to(foto, {
      yPercent: 8, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .6 }
    });
  }
  const flota = document.querySelector('.flota-foto img');
  if (flota) {
    gsap.fromTo(flota, { yPercent: -4 }, {
      yPercent: 4, ease: 'none',
      scrollTrigger: { trigger: '.flota-foto', start: 'top bottom', end: 'bottom top', scrub: .8 }
    });
  }
  const cierre = document.querySelector('.cierre-foto img');
  if (cierre) {
    gsap.fromTo(cierre, { yPercent: -6 }, {
      yPercent: 6, ease: 'none',
      scrollTrigger: { trigger: '.cierre', start: 'top bottom', end: 'bottom top', scrub: .8 }
    });
  }
}

/* ---------------- nav ---------------- */
function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) {
    bd = document.createElement('div');
    bd.className = 'nav-backdrop';
    const header = document.querySelector('.barra');
    (header || document.body).appendChild(bd);
  }
  const desktopMq = window.matchMedia('(min-width: 769px)');
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

/* ---------------- WhatsApp ---------------- */
function initWspFloat() {
  const btn = document.getElementById('wsp-float');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) btn.classList.add('visible'); else btn.classList.remove('visible');
  }, { passive: true });
}

function initWspLinks() {
  document.querySelectorAll('[data-wsp-msg]').forEach(a => {
    a.href = `https://wa.me/${WSP}?text=${encodeURIComponent(a.dataset.wspMsg)}`;
  });
}

/* ---------------- formulario demo ---------------- */
function initForm() {
  const form = document.getElementById('contForm');
  if (!form) return;
  const btn = document.getElementById('cfSubmit');

  const marcarError = (campo, msg) => {
    campo.setAttribute('aria-invalid', 'true');
    let err = campo.parentElement.querySelector('.cf-err');
    if (!err) { err = document.createElement('span'); err.className = 'cf-err'; campo.parentElement.appendChild(err); }
    err.textContent = msg;
  };
  const limpiar = campo => {
    campo.removeAttribute('aria-invalid');
    campo.parentElement.querySelector('.cf-err')?.remove();
  };

  form.querySelectorAll('input, textarea').forEach(c => c.addEventListener('input', () => limpiar(c)));

  form.addEventListener('submit', e => {
    e.preventDefault();
    const nombre = form.querySelector('#cf-nombre');
    const wsp = form.querySelector('#cf-wsp');
    let ok = true;
    if (nombre.value.trim().length < 2) { marcarError(nombre, 'Necesitamos tu nombre para contestarte.'); ok = false; }
    const digitos = wsp.value.replace(/\D/g, '');
    if (digitos.length < 8) { marcarError(wsp, 'Dejanos un WhatsApp con código de área.'); ok = false; }
    if (!ok) { (form.querySelector('[aria-invalid="true"]'))?.focus(); return; }

    btn.disabled = true;
    const original = btn.textContent;
    btn.textContent = 'Enviando…';
    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = original;
      form.reset();
      showToast('¡Gracias! El envío de mensajes se activa al pasar la web a producción.');
    }, 800);
  });
}

/* ---------------- anclas ---------------- */
function initAnclas() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    if (a.classList.contains('skip-link')) return;
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      if (!id) return;
      const destino = document.getElementById(id);
      if (!destino) return;
      e.preventDefault();
      const y = destino.getBoundingClientRect().top + window.scrollY - (id === 'top' ? 0 : 20);
      window.scrollTo({ top: Math.max(0, y), behavior: reduceMotion ? 'auto' : 'smooth' });
      if (window.history.replaceState) window.history.replaceState(null, '', `#${id}`);
    });
  });
}

/* ---------------- arranque ---------------- */
function initAnio() {
  const el = document.getElementById('anio');
  if (el) el.textContent = String(new Date().getFullYear());
}

initVehiculos();
initMapa();
initBuscador();
initExcursiones();
actualizarTramo(false);
initReveals();
initPasos();
initNav();
initWspFloat();
initWspLinks();
initForm();
initAnclas();
initHero();
initParallax();
initAnio();
