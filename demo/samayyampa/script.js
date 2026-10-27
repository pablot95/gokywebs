const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5492644774978';

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
const wa = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const precio = n => '$' + Math.round(n).toLocaleString('es-AR');
const refrescar = () => { if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); };

const ICO = {
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>'
};
const ico = n => `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICO[n]}</svg>`;

const CATS = { aventura: 'Aventura', rural: 'Turismo rural', artesanias: 'Artesanías', productores: 'Productores' };

const EXPERIENCIAS = [
  { id: 'cascadas', cat: 'aventura', titulo: 'Cascadas de la Quebrada de las Golondrinas', prestador: 'Huellas del Valle', rubro: 'Guías de montaña', duracion: '5 h', grupo: 'Hasta 12 personas', precio: 28000, foto: 'trekking-guia', alt: 'Un guía señala el camino a dos caminantes en una quebrada', desc: 'Caminata guiada por la quebrada hasta las cascadas, con paradas para descansar, mirar aves y escuchar la historia del lugar.', encuentro: 'Plaza de Astica', nivel: 'Dificultad media' },
  { id: 'cabalgata', cat: 'aventura', titulo: 'Cabalgata por los cerros de Astica', prestador: 'Baqueanos de Astica', rubro: 'Cabalgatas', duracion: '3 h', grupo: 'Hasta 8 personas', precio: 32000, foto: 'cabalgata', alt: 'Jinetes en fila por un sendero de montaña árido', desc: 'Salida a caballo con baqueanos del valle por las huellas de los cerros, a paso tranquilo y con caballos mansos.', encuentro: 'Puesto de los baqueanos', nivel: 'Para principiantes' },
  { id: 'estrellas', cat: 'aventura', titulo: 'Noche de estrellas en el valle', prestador: 'Cielo Vallisto', rubro: 'Observación del cielo', duracion: '2 h', grupo: 'Hasta 15 personas', precio: 15000, foto: 'noche-estrellas', alt: 'La vía láctea sobre la silueta de los cerros', desc: 'Lejos de las luces de la ciudad, el cielo del valle se ve entero. Una charla al aire libre para reconocer constelaciones y la vía láctea.', encuentro: 'Mirador según la luna', nivel: 'Para toda la familia' },
  { id: 'ischigualasto', cat: 'aventura', titulo: 'Ischigualasto, saliendo desde Astica', prestador: 'Traslados del Valle', rubro: 'Excursiones y traslados', duracion: 'Día completo', grupo: 'Hasta 10 personas', precio: 65000, foto: 'ischigualasto-bochas', alt: 'Rocas redondeadas de la Cancha de Bochas en Ischigualasto', desc: 'Traslado desde Astica al Parque Provincial Ischigualasto para hacer el circuito con guía del parque, y regreso al valle por la tarde.', encuentro: 'Retiro por tu alojamiento', nivel: 'Entrada al parque aparte' },
  { id: 'caminos', cat: 'rural', titulo: 'Caminos de Astica', prestador: 'Vecinos de Astica', rubro: 'Turismo comunitario', duracion: '3 h', grupo: 'Hasta 10 personas', precio: 18000, foto: 'caminos-astica', alt: 'Dos visitantes caminan por una calle de Astica junto a un vecino', desc: 'Recorré el pueblo y sus senderos con un vecino que conoce cada acequia, cada finca de cítricos y cada historia. Una caminata tranquila para entender cómo se vive en el valle.', encuentro: 'Plaza de Astica', nivel: 'Caminata suave' },
  { id: 'casa-adobe', cat: 'rural', titulo: 'Día de campo en la casa de adobe', prestador: 'Casa Las Tunas', rubro: 'Turismo rural', duracion: '6 h', grupo: 'Hasta 12 personas', precio: 35000, foto: 'casa-adobe', alt: 'Galería con techo de cañas en una casa de adobe rodeada de árboles', desc: 'Una jornada en una casa de campo: la huerta, los animales, la siesta bajo el algarrobo y un almuerzo con productos de la zona.', encuentro: 'Casa Las Tunas, Astica', nivel: 'Almuerzo incluido' },
  { id: 'ceramica', cat: 'artesanias', titulo: 'Taller de cerámica con barro del valle', prestador: 'Taller Barro Vivo', rubro: 'Ceramistas', duracion: '2 h 30', grupo: 'Hasta 6 personas', precio: 22000, foto: 'ceramica-torno', alt: 'Manos de un artesano modelando una vasija en el torno', desc: 'Conocé cómo se prepara el barro y modelá tu propia pieza en el torno, guiado por quienes trabajan la cerámica en el valle.', encuentro: 'Taller Barro Vivo', nivel: 'Te llevás tu pieza' },
  { id: 'cesteria', cat: 'artesanias', titulo: 'Cestería y telar: visita al taller', prestador: 'Tejedoras del Valle', rubro: 'Artesanas', duracion: '2 h', grupo: 'Hasta 8 personas', precio: 16000, foto: 'cesteria-tejidos', alt: 'Canastos tejidos y mantas de telar sobre una mesa al aire libre', desc: 'Las tejedoras muestran cómo trabajan las fibras, los tintes y el telar. Al final podés comprar piezas directo a quien las hizo.', encuentro: 'Taller de las tejedoras', nivel: 'Venta de piezas en el lugar' },
  { id: 'dulces', cat: 'productores', titulo: 'Dulces y conservas de la chacra', prestador: 'Chacra Los Membrillos', rubro: 'Productores', duracion: '2 h', grupo: 'Hasta 10 personas', precio: 14000, foto: 'dulces-chacra', alt: 'Productora preparando frascos de dulce junto a duraznos frescos', desc: 'Recorrida por la chacra y degustación de dulces, conservas y frutas de estación, con la receta de la familia.', encuentro: 'Chacra Los Membrillos', nivel: 'Degustación incluida' },
  { id: 'mesa', cat: 'productores', titulo: 'Mesa criolla con empanadas al horno de barro', prestador: 'Cocina de Campo El Algarrobo', rubro: 'Cocina regional', duracion: '2 h 30', grupo: 'Hasta 14 personas', precio: 26000, foto: 'mesa-criolla', alt: 'Empanadas, salsas y vino sobre una mesa de campo con los cerros de fondo', desc: 'Empanadas recién salidas del horno de barro, ensaladas de la huerta y vino de San Juan, en una mesa larga mirando los cerros.', encuentro: 'El Algarrobo, Astica', nivel: 'Comida casera' }
];

const SALIDAS = [
  { id: 'cascadas', dia: 6, hora: '08:00' },
  { id: 'estrellas', dia: 5, hora: '21:30' },
  { id: 'ceramica', dia: 3, hora: '10:00' },
  { id: 'cabalgata', dia: 0, hora: '17:30' },
  { id: 'ischigualasto', dia: 6, hora: '07:00' },
  { id: 'mesa', dia: 0, hora: '12:30' }
];

const DIM = { cabalgata: [442, 640], 'noche-estrellas': [426, 640], 'ischigualasto-bochas': [640, 434] };
const buscarExp = id => EXPERIENCIAS.find(x => x.id === id);

function hoyAR() {
  let ar;
  try { ar = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Argentina/Buenos_Aires' })); } catch (e) { ar = new Date(); }
  if (isNaN(ar)) ar = new Date();
  ar.setHours(0, 0, 0, 0);
  return ar;
}
const claveFecha = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const proximoDia = (dia, desde) => {
  const d = new Date(desde);
  d.setDate(d.getDate() + 1);
  while (d.getDay() !== dia) d.setDate(d.getDate() + 1);
  return d;
};
const fechaLarga = clave => {
  if (!clave) return '';
  const [y, m, d] = clave.split('-').map(Number);
  const f = new Date(y, m - 1, d);
  const txt = f.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' });
  return txt.charAt(0).toUpperCase() + txt.slice(1);
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

let revealIO = null;
const entrar = (el, n) => {
  const d = Math.min(n * 0.1, 0.6);
  el.style.transitionDelay = `${d}s`;
  el.classList.add('in');
  setTimeout(() => { el.style.transitionDelay = ''; }, (d + 1.2) * 1000);
};

function initReveals() {
  const items = document.querySelectorAll('[data-animate]');
  if (!items.length) return;
  if (!('IntersectionObserver' in window) || reduceMotion) {
    items.forEach(el => el.classList.add('in'));
    return;
  }
  revealIO = new IntersectionObserver(entries => {
    let n = 0;
    entries.forEach(entry => {
      if (entry.isIntersecting) { entrar(entry.target, n++); revealIO.unobserve(entry.target); }
    });
  }, { threshold: 0, rootMargin: '0px 0px -7% 0px' });
  items.forEach(el => revealIO.observe(el));

  let queued = false;
  const sweep = () => {
    queued = false;
    let pending = 0;
    let n = 0;
    document.querySelectorAll('[data-animate]:not(.in)').forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight && (r.width || r.height)) { entrar(el, n++); revealIO.unobserve(el); }
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

function revelarNuevos(root) {
  const nuevos = [...root.querySelectorAll('[data-animate]:not(.in)')];
  if (!nuevos.length) return;
  if (reduceMotion || (typeof gsap === 'undefined' && !revealIO)) { nuevos.forEach(el => el.classList.add('in')); return; }
  if (!revealIO) return;
  let n = 0;
  requestAnimationFrame(() => {
    nuevos.forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight) entrar(el, n++);
      else revealIO.observe(el);
    });
  });
}

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero, .hero2');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const img = hero.querySelector('[data-hero-img]');
  if (img) tl.from(img, { scale: 1.1, duration: 1.8 }, 0);
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1 }, 0.45);
  const ctas = hero.querySelectorAll('.hero-ctas .btn');
  if (ctas.length) tl.from(ctas, { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6);
  const buscador = hero.querySelector('.buscador');
  if (buscador) tl.from(buscador, { y: 30, opacity: 0, duration: 1, clearProps: 'transform,opacity' }, 0.6);
  const extras = hero.querySelectorAll('.hero-badge, .hero2__ficha');
  if (extras.length) tl.from(extras, { scale: 0.92, opacity: 0, duration: 1.1, stagger: 0.1, clearProps: 'transform,opacity' }, 0.75);
}

const Dialogo = (() => {
  let abierto = null;
  let origen = null;
  const enfocables = el => [...el.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])')]
    .filter(n => n.offsetParent !== null || n === document.activeElement);
  const onKey = e => {
    if (!abierto) return;
    if (e.key === 'Escape') { e.preventDefault(); cerrar(); return; }
    if (e.key !== 'Tab') return;
    const f = enfocables(abierto);
    if (!f.length) return;
    const first = f[0];
    const last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };
  function abrir(el, desde) {
    if (abierto && abierto !== el) cerrar(false);
    abierto = el;
    origen = desde || document.activeElement;
    el.hidden = false;
    document.body.classList.add('no-scroll');
    document.addEventListener('keydown', onKey);
    requestAnimationFrame(() => (el.querySelector('[data-foco]') || el.querySelector('.modal__cerrar, .visor__cerrar'))?.focus());
  }
  function cerrar(devolver = true) {
    if (!abierto) return;
    abierto.hidden = true;
    abierto.dispatchEvent(new CustomEvent('cerrado'));
    abierto = null;
    document.body.classList.remove('no-scroll');
    document.removeEventListener('keydown', onKey);
    if (devolver && origen && document.contains(origen)) origen.focus();
  }
  document.addEventListener('click', e => {
    if (abierto && e.target.closest('[data-cerrar]') && abierto.contains(e.target)) cerrar();
  });
  return { abrir, cerrar, get abierto() { return abierto; } };
})();

const Catalogo = (() => {
  const lista = document.getElementById('expLista');
  const mas = document.getElementById('expMas');
  const chips = [...document.querySelectorAll('.filtros .chip')];
  const INICIAL = 8;
  let cat = 'todas';
  let todas = false;

  const card = x => `
    <li class="exp" data-animate="subir" style="opacity:0;transform:translateY(40px)">
      <article class="exp__card">
        <button type="button" class="exp__foto foto-z" data-reservar="${x.id}" aria-label="Ver y reservar: ${esc(x.titulo)}">
          <img src="images/${x.foto}-640.webp" width="${(DIM[x.foto] || [640, 640])[0]}" height="${(DIM[x.foto] || [640, 640])[1]}" alt="${esc(x.alt)}">
          <span class="exp__cat">${esc(CATS[x.cat])}</span>
        </button>
        <div class="exp__cuerpo">
          <h3 class="exp__titulo">${esc(x.titulo)}</h3>
          <p class="exp__prestador">con <b>${esc(x.prestador)}</b></p>
          <p class="exp__meta"><span>${ico('clock')}${esc(x.duracion)}</span><span>${ico('users')}${esc(x.grupo)}</span></p>
          <div class="exp__pie">
            <p class="exp__precio"><b>${precio(x.precio)}</b><span>por persona</span></p>
            <button type="button" class="btn btn--verde" data-reservar="${x.id}">Reservar</button>
          </div>
        </div>
      </article>
    </li>`;

  function pintar() {
    if (!lista) return;
    const filtradas = EXPERIENCIAS.filter(x => cat === 'todas' || x.cat === cat);
    const visibles = cat === 'todas' && !todas ? filtradas.slice(0, INICIAL) : filtradas;
    lista.innerHTML = visibles.map(card).join('');
    if (mas) {
      mas.hidden = !(cat === 'todas' && !todas && filtradas.length > INICIAL);
      mas.textContent = `Ver las ${filtradas.length} experiencias`;
    }
    chips.forEach(c => {
      const on = c.dataset.cat === cat;
      c.classList.toggle('is-on', on);
      c.setAttribute('aria-pressed', String(on));
    });
    revelarNuevos(lista);
    refrescar();
  }
  function filtrar(nueva) {
    cat = CATS[nueva] ? nueva : 'todas';
    pintar();
  }
  function init() {
    if (!lista) return;
    chips.forEach(c => c.addEventListener('click', () => filtrar(c.dataset.cat)));
    mas?.addEventListener('click', () => { todas = true; pintar(); });
    document.addEventListener('click', e => {
      const a = e.target.closest('[data-filtro]');
      if (!a) return;
      filtrar(a.dataset.filtro);
    });
    pintar();
  }
  return { init, filtrar };
})();

const Reserva = (() => {
  const modal = document.getElementById('reserva');
  if (!modal) return { init() {} };
  const $ = id => document.getElementById(id);
  const form = $('rForm');
  const pasos = form ? [...form.querySelectorAll('[data-paso]')] : [];
  const fecha = form?.elements.fecha;
  const personas = form?.elements.personas;
  const nombre = form?.elements.nombre;
  const tel = form?.elements.telefono;
  const wsp = $('rWsp');
  const pagar = $('rPagar');
  let actual = null;
  const pref = { fecha: '', personas: 2 };

  const cantidad = () => {
    const n = parseInt(personas?.value, 10);
    return Number.isFinite(n) ? Math.min(20, Math.max(1, n)) : 1;
  };
  const error = (input, id, si) => {
    const p = $(id);
    if (si) { input?.setAttribute('aria-invalid', 'true'); p?.removeAttribute('hidden'); }
    else { input?.removeAttribute('aria-invalid'); p?.setAttribute('hidden', ''); }
  };
  const verPaso = n => pasos.forEach(p => { p.hidden = p.dataset.paso !== String(n); });

  function actualizar() {
    if (!actual) return;
    const n = cantidad();
    const total = actual.precio * n;
    $('rTotal').textContent = precio(total);
    $('rUnit').textContent = `${precio(actual.precio)} por persona`;
    if (pagar) pagar.textContent = `Pagar ${precio(total)}`;
    const cuando = fecha?.value ? fechaLarga(fecha.value) : 'a definir';
    wsp.href = wa(`Hola, quiero consultar por «${actual.titulo}» con ${actual.prestador}. Fecha: ${cuando}. Personas: ${n}.`);
  }

  function abrir(id, opciones = {}, desde) {
    const x = buscarExp(id);
    if (!x) return;
    actual = x;
    $('rFoto').src = `images/${x.foto}-640.webp`;
    $('rFoto').alt = x.alt;
    $('rCat').textContent = CATS[x.cat];
    $('rTitulo').textContent = x.titulo;
    $('rPrestador').textContent = x.prestador;
    $('rRubro').textContent = x.rubro;
    $('rDuracion').textContent = x.duracion;
    $('rGrupo').textContent = x.grupo;
    $('rEncuentro').textContent = x.encuentro;
    $('rNivel').textContent = x.nivel;
    $('rDesc').textContent = x.desc;
    form.reset();
    fecha.min = claveFecha(hoyAR());
    fecha.value = opciones.fecha || pref.fecha || '';
    personas.value = String(opciones.personas || pref.personas || 2);
    error(fecha, 'rFechaError', false);
    error(nombre, 'rNombreError', false);
    error(tel, 'rTelError', false);
    verPaso(1);
    actualizar();
    modal.setAttribute('aria-label', `Reservar: ${x.titulo}`);
    Dialogo.abrir(modal, desde);
  }

  function init() {
    if (!form) return;
    document.addEventListener('click', e => {
      const b = e.target.closest('[data-reservar]');
      if (!b) return;
      e.preventDefault();
      abrir(b.dataset.reservar, { fecha: b.dataset.fecha || '' }, b);
    });
    form.querySelectorAll('[data-paso-n]').forEach(b => b.addEventListener('click', () => {
      personas.value = String(Math.min(20, Math.max(1, cantidad() + Number(b.dataset.pasoN))));
      actualizar();
    }));
    personas.addEventListener('blur', () => { personas.value = String(cantidad()); actualizar(); });
    form.addEventListener('input', e => {
      if (e.target === fecha && fecha.value) error(fecha, 'rFechaError', false);
      if (e.target === nombre && nombre.value.trim()) error(nombre, 'rNombreError', false);
      if (e.target === tel && tel.value.replace(/\D/g, '').length >= 10) error(tel, 'rTelError', false);
      actualizar();
    });
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (!fecha.value || fecha.value < fecha.min) {
        error(fecha, 'rFechaError', true);
        fecha.focus();
        return;
      }
      const n = cantidad();
      $('rResumen').textContent = `${actual.titulo} · ${fechaLarga(fecha.value)} · ${n} ${n === 1 ? 'persona' : 'personas'} · Total ${precio(actual.precio * n)}`;
      verPaso(2);
      nombre.focus();
    });
    $('rVolver')?.addEventListener('click', () => { verPaso(1); fecha.focus(); });
    pagar?.addEventListener('click', () => {
      const okNombre = !!nombre.value.trim();
      const okTel = tel.value.replace(/\D/g, '').length >= 10;
      error(nombre, 'rNombreError', !okNombre);
      error(tel, 'rTelError', !okTel);
      if (!okNombre) { nombre.focus(); return; }
      if (!okTel) { tel.focus(); return; }
      const texto = pagar.textContent;
      pagar.disabled = true;
      pagar.textContent = 'Procesando…';
      setTimeout(() => {
        pagar.disabled = false;
        pagar.textContent = texto;
        Dialogo.cerrar();
        showToast('¡Gracias! El pago online se activa al pasar la web a producción.');
      }, 800);
    });
  }
  return { init, abrir, pref };
})();

function initPrestadores() {
  const modal = document.getElementById('prestadores');
  if (!modal) return;
  const login = document.getElementById('pLogin');
  const panel = document.getElementById('pPanel');
  const form = document.getElementById('pForm');
  const err = document.getElementById('pError');
  const reservas = document.getElementById('pReservas');
  const verPanel = () => {
    const hoy = hoyAR();
    const sab = proximoDia(6, hoy);
    const dom = proximoDia(0, hoy);
    const corta = d => `${d.toLocaleDateString('es-AR', { weekday: 'short' }).replace('.', '')} ${d.getDate()}/${d.getMonth() + 1}`;
    if (reservas) reservas.innerHTML = `
      <li><span><b>${esc(corta(sab))} · Cascadas de la Quebrada</b><small>4 personas · Lucía P.</small></span><span class="estado estado--ok">Pagada online</span></li>
      <li><span><b>${esc(corta(dom))} · Cascadas de la Quebrada</b><small>2 personas · Martín G.</small></span><span class="estado estado--mag">Consultó por WhatsApp</span></li>`;
    login.hidden = true;
    panel.hidden = false;
    panel.querySelector('#pCargar')?.focus();
  };
  const reset = () => {
    form?.reset();
    err?.setAttribute('hidden', '');
    form?.querySelectorAll('input').forEach(i => i.removeAttribute('aria-invalid'));
    login.hidden = false;
    panel.hidden = true;
  };
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-abrir="prestadores"]');
    if (!b) return;
    reset();
    Dialogo.abrir(modal, b);
  });
  form?.addEventListener('submit', e => {
    e.preventDefault();
    const email = form.elements.email;
    const clave = form.elements.clave;
    const okEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
    const okClave = !!clave.value;
    email.toggleAttribute('aria-invalid', !okEmail);
    clave.toggleAttribute('aria-invalid', !okClave);
    if (!okEmail || !okClave) {
      err?.removeAttribute('hidden');
      (okEmail ? clave : email).focus();
      return;
    }
    err?.setAttribute('hidden', '');
    const btn = form.querySelector('[type="submit"]');
    btn.disabled = true;
    setTimeout(() => { btn.disabled = false; verPanel(); }, 700);
  });
  document.getElementById('pEjemplo')?.addEventListener('click', verPanel);
  document.getElementById('pCargar')?.addEventListener('click', () => showToast('En producción cargás la experiencia y Samay Yampa la aprueba antes de publicarla.'));
  document.getElementById('pSalir')?.addEventListener('click', () => { reset(); form?.elements.email.focus(); });
}

function initGaleria() {
  const gal = document.getElementById('gal');
  const visor = document.getElementById('visor');
  if (!gal || !visor) return;
  const btns = [...gal.querySelectorAll('[data-gal]')];
  const img = document.getElementById('visorImg');
  const cap = document.getElementById('visorCap');
  const cont = document.getElementById('visorCont');
  let i = 0;
  const mostrar = n => {
    i = (n + btns.length) % btns.length;
    const b = btns[i];
    const mini = b.querySelector('img');
    img.src = b.dataset.src;
    img.alt = mini?.alt || '';
    img.width = mini?.width || 1600;
    img.height = mini?.height || 1200;
    cap.textContent = b.dataset.cap;
    cont.textContent = `${i + 1} / ${btns.length}`;
  };
  let arrastrado = false;
  btns.forEach((b, n) => b.addEventListener('click', e => {
    if (arrastrado) { e.preventDefault(); return; }
    mostrar(n);
    Dialogo.abrir(visor, b);
  }));
  document.getElementById('visorPrev')?.addEventListener('click', () => mostrar(i - 1));
  document.getElementById('visorNext')?.addEventListener('click', () => mostrar(i + 1));
  visor.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') mostrar(i - 1);
    if (e.key === 'ArrowRight') mostrar(i + 1);
  });
  let x0 = null;
  visor.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
  visor.addEventListener('touchend', e => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 50) mostrar(i + (dx < 0 ? 1 : -1));
    x0 = null;
  });

  if (!document.body.classList.contains('m2')) return;
  let down = false;
  let sx = 0;
  let sl = 0;
  gal.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'mouse') return;
    down = true; arrastrado = false; sx = e.clientX; sl = gal.scrollLeft;
  });
  window.addEventListener('pointermove', e => {
    if (!down) return;
    const dx = e.clientX - sx;
    if (!arrastrado && Math.abs(dx) > 6) { arrastrado = true; gal.classList.add('is-drag'); }
    if (arrastrado) gal.scrollLeft = sl - dx;
  });
  window.addEventListener('pointerup', () => {
    if (!down) return;
    down = false;
    gal.classList.remove('is-drag');
    setTimeout(() => { arrastrado = false; }, 0);
  });
}

function initAgenda() {
  const agenda = document.getElementById('agenda');
  if (!agenda) return;
  const hoy = hoyAR();
  const filas = SALIDAS.map(s => ({ ...s, x: buscarExp(s.id), fecha: proximoDia(s.dia, hoy) }))
    .filter(s => s.x)
    .sort((a, b) => a.fecha - b.fecha || a.hora.localeCompare(b.hora));
  agenda.innerHTML = filas.map(s => {
    const dia = s.fecha.toLocaleDateString('es-AR', { weekday: 'short' }).replace('.', '');
    const mes = s.fecha.toLocaleDateString('es-AR', { month: 'short' }).replace('.', '');
    return `
      <li class="salida" data-animate="subir" style="opacity:0;transform:translateY(24px)">
        <p class="salida__fecha"><small>${esc(dia)}</small><b>${s.fecha.getDate()}</b><small>${esc(mes)}</small></p>
        <p class="salida__hora">${esc(s.hora)} h<small>${esc(s.x.duracion)}</small></p>
        <div class="salida__info"><p class="salida__titulo">${esc(s.x.titulo)}</p><p class="salida__prest">con ${esc(s.x.prestador)} · ${esc(CATS[s.x.cat])}</p></div>
        <p class="salida__precio">${precio(s.x.precio)}<small>por persona</small></p>
        <button type="button" class="btn btn--verde" data-reservar="${s.x.id}" data-fecha="${claveFecha(s.fecha)}">Reservar lugar</button>
      </li>`;
  }).join('');
}

function initBuscador() {
  const form = document.getElementById('buscador');
  if (!form) return;
  const cats = [...form.querySelectorAll('[data-bcat]')];
  const fecha = form.elements.fecha;
  fecha.min = claveFecha(hoyAR());
  let elegida = 'todas';
  cats.forEach(b => b.addEventListener('click', () => {
    elegida = b.getAttribute('aria-pressed') === 'true' ? 'todas' : b.dataset.bcat;
    cats.forEach(c => c.setAttribute('aria-pressed', String(c.dataset.bcat === elegida)));
  }));
  form.addEventListener('submit', e => {
    e.preventDefault();
    Reserva.pref.fecha = fecha.value && fecha.value >= fecha.min ? fecha.value : '';
    Reserva.pref.personas = Number(form.elements.personas.value) || 2;
    Catalogo.filtrar(elegida);
    document.getElementById('experiencias')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    const n = EXPERIENCIAS.filter(x => elegida === 'todas' || x.cat === elegida).length;
    showToast(`${n} experiencias${elegida === 'todas' ? '' : ' de ' + CATS[elegida]} para ${Reserva.pref.personas} ${Reserva.pref.personas === 1 ? 'persona' : 'personas'}`);
  });
}

function initLeer() {
  const p = document.querySelector('[data-leer]');
  if (!p) return;
  const palabras = p.textContent.trim().split(/\s+/);
  p.setAttribute('aria-label', p.textContent.trim());
  p.innerHTML = palabras.map(w => `<span class="w" aria-hidden="true">${esc(w)} </span>`).join('');
  const spans = [...p.querySelectorAll('.w')];
  if (reduceMotion) { spans.forEach(s => s.classList.add('on')); return; }
  let frame = 0;
  const pintar = () => {
    frame = 0;
    const r = p.getBoundingClientRect();
    const vh = window.innerHeight;
    const prog = Math.min(1, Math.max(0, (vh * 0.88 - r.top) / (vh * 0.5)));
    const n = Math.round(prog * spans.length);
    spans.forEach((s, k) => s.classList.toggle('on', k < n));
  };
  window.addEventListener('scroll', () => { if (!frame) frame = requestAnimationFrame(pintar); }, { passive: true });
  window.addEventListener('resize', pintar, { passive: true });
  pintar();
}

function initMapa() {
  const el = document.getElementById('mapa');
  if (!el || typeof L === 'undefined') return;
  const astica = [-30.9538, -67.3011];
  const mapa = L.map(el, { center: astica, zoom: 10, scrollWheelZoom: false, zoomControl: false });
  L.control.zoom({ position: 'topright' }).addTo(mapa);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap', maxZoom: 19 }).addTo(mapa);
  const icono = L.divIcon({ className: 'pin-sy', html: '<span><b></b></span>', iconSize: [44, 44], iconAnchor: [22, 44] });
  L.marker(astica, { icon: icono, keyboard: false, title: 'Samay Yampa · Astica' })
    .bindTooltip('Samay Yampa · Astica, Valle Fértil', { direction: 'top', offset: [0, -44] })
    .addTo(mapa);
  const encuadrar = () => {
    mapa.invalidateSize();
    const m2 = document.body.classList.contains('m2');
    const ancho = window.innerWidth > 900;
    if (m2 && ancho) mapa.setView([astica[0] + 0.12, astica[1] - 0.32], 10, { animate: false });
    else if (m2) mapa.setView([astica[0] - 0.1, astica[1]], 10, { animate: false });
    else mapa.setView([astica[0] + 0.1, astica[1] - 0.05], 10, { animate: false });
  };
  encuadrar();
  window.addEventListener('load', encuadrar);
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; (document.querySelector('.site-header') || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 961px)');
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
  nav.querySelectorAll('a, .nav-cta').forEach(a => a.addEventListener('click', () => { if (nav.classList.contains('open')) close(); }));
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

[initAgenda, Catalogo.init, Reserva.init, initPrestadores, initGaleria, initBuscador, initLeer, initMapa, initHeroMotion, initReveals, initNav, initWspFloat, initModelBarScroll]
  .forEach(fn => { try { fn(); } catch (e) { console.error(e); } });
