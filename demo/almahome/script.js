const WHATSAPP_NUMBER = '5492915784369';

const CATEGORIAS = {
  cosmetica: 'Cosmética natural',
  aromaterapia: 'Aromaterapia',
  deco: 'Deco',
  kits: 'Kits de regalo',
};

const PRODUCTOS = [
  {
    id: 'vela-calma', nombre: 'Vela aromática «Calma»', cats: ['aromaterapia', 'deco'], precio: 16500, descuento: 0, stock: 14,
    img: 'images/vela-soja-1200x1500.webp', alt: 'Vela en frasco de vidrio ámbar con la etiqueta en blanco, vista desde arriba',
    variantes: ['Lavanda y vetiver', 'Palo santo', 'Naranja y canela'], varLabel: 'Aroma', varPlural: 'aromas',
    desc: 'Frasco de vidrio ámbar y un aroma que se queda en el ambiente sin invadir. Pensada para el primer rato de la noche, cuando llegás y querés bajar un cambio.',
    ficha: [['Para', 'encender al volver a casa'], ['Frasco', 'vidrio ámbar, 200 g']],
  },
  {
    id: 'kit-pausa', nombre: 'Kit «Pausa»', cats: ['kits'], precio: 34900, descuento: 0, stock: 6, badge: 'Para regalar',
    img: 'images/kit-pausa-1200x1500.webp', alt: 'Jabón verde, vela en vaso de vidrio y palitos de palo santo sobre bloques de madera clara',
    variantes: ['Con vela de lavanda', 'Con vela de palo santo'], varLabel: 'Vela del kit', varPlural: 'opciones',
    desc: 'Una vela aromática, un jabón artesanal y palitos de palo santo, en caja lista para regalar. Para alguien que necesita frenar un rato.',
    ficha: [['Trae', 'vela, jabón y palo santo'], ['Entrega', 'en caja para regalo']],
  },
  {
    id: 'blend-respiro', nombre: 'Blend roll-on «Respiro»', cats: ['aromaterapia', 'cosmetica'], precio: 9800, descuento: 0, stock: 20,
    img: 'images/blend-rollon-1200x1500.webp', alt: 'Frascos roll-on de vidrio ámbar sobre un fondo claro',
    variantes: ['Eucalipto y menta', 'Lavanda', 'Romero y limón'], varLabel: 'Aroma', varPlural: 'aromas',
    desc: 'Aceites esenciales en base vegetal, en un roll-on que entra en cualquier bolsillo. Se pasa por muñecas y sienes cuando el día se acelera.',
    ficha: [['Para', 'llevar encima'], ['Envase', 'roll-on de 10 ml']],
  },
  {
    id: 'jabon-avena', nombre: 'Jabón artesanal de avena', cats: ['cosmetica'], precio: 6900, descuento: 0, stock: 25,
    img: 'images/jabon-avena-1200x1500.webp', alt: 'Dos barras de jabón artesanal apiladas con flores blancas sobre lino',
    variantes: ['Avena y miel', 'Caléndula', 'Arcilla rosa'], varLabel: 'Variedad', varPlural: 'variedades',
    desc: 'Barra hecha a mano, suave para todos los días en cara y cuerpo. Cada tanda sale apenas distinta en color y veta.',
    ficha: [['Para', 'la ducha de todos los días'], ['Barra', '100 g aprox.']],
  },
  {
    id: 'giftcard-armonizacion', nombre: 'Giftcard: armonización de chakras', cats: ['kits'], precio: 38000, descuento: 0, stock: 99, badge: 'Para regalar',
    gift: true, img: '', alt: 'Giftcard de Alma home para una sesión de armonización de chakras',
    variantes: [], varLabel: '', varPlural: '',
    desc: 'Una sesión de armonización de 60 minutos para regalar. Quien la recibe elige el día y el horario en la agenda de turnos.',
    ficha: [['Incluye', 'una sesión de 60 min'], ['Modalidad', 'en el espacio u online']],
  },
  {
    id: 'portasahumerio-onda', nombre: 'Portasahumerio «Onda»', cats: ['deco'], precio: 12500, descuento: 0, stock: 8,
    img: 'images/portasahumerio-ceramica-1200x1500.webp', alt: 'Portasahumerio de cerámica con forma ondulada, un sahumerio encendido y dos geodas',
    variantes: ['Crudo', 'Blanco tiza'], varLabel: 'Terminación', varPlural: 'terminaciones',
    desc: 'Cerámica modelada a mano: no hay dos iguales. Sostiene sahumerios de varilla y junta la ceniza sin ensuciar la mesa.',
    ficha: [['Para', 'el rincón donde meditás'], ['Material', 'cerámica esmaltada']],
  },
  {
    id: 'balsamo-karite', nombre: 'Bálsamo corporal de karité', cats: ['cosmetica'], precio: 14200, descuento: 0, stock: 10,
    img: 'images/balsamo-karite-1200x1500.webp', alt: 'Potes abiertos de bálsamo y crema entre hojas de eucalipto sobre mármol',
    variantes: ['Caléndula', 'Sin aroma'], varLabel: 'Versión', varPlural: 'versiones',
    desc: 'Textura densa que se funde con el calor de la piel. Para manos, codos y talones que piden más que una crema.',
    ficha: [['Para', 'después del baño'], ['Pote', '150 ml']],
  },
];

const SERVICIOS = {
  chakras: {
    nombre: 'Armonización de chakras', dur: 60, precio: 38000,
    agenda: {
      presencial: { 2: ['10:00', '11:30', '15:00', '16:30', '18:00'], 4: ['10:00', '11:30', '15:00', '16:30', '18:00'], 6: ['10:00', '11:30', '13:00'] },
      online: { 1: ['19:30'], 3: ['19:30', '20:45'], 5: ['19:30'] },
    },
  },
  cartas: {
    nombre: 'Lectura de cartas', dur: 45, precio: 26000,
    agenda: {
      presencial: {
        1: ['11:00', '12:00', '16:00', '17:00', '18:00'], 3: ['11:00', '12:00', '16:00', '17:00', '18:00'],
        5: ['11:00', '12:00', '16:00', '17:00', '18:00'], 6: ['10:00', '11:00', '12:00', '13:00'],
      },
      online: { 1: ['09:00', '20:00'], 2: ['20:00', '21:00'], 3: ['09:00'], 4: ['20:00', '21:00'], 5: ['09:00'] },
    },
  },
};

const HORARIO = { 0: null, 1: [10, 19], 2: [10, 19], 3: [10, 19], 4: [10, 19], 5: [10, 19], 6: [10, 14] };
const DIAS_SEM = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const DIAS_CORTOS = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const getProducto = id => PRODUCTOS.find(p => p.id === id);
const waHref = lineas => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lineas.join('\n'))}`;
const capitalizar = s => s.charAt(0).toUpperCase() + s.slice(1);

const Cart = {
  KEY: 'almahome_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { localStorage.setItem(this.KEY, JSON.stringify(items)); document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty = 1, variante = '') {
    const items = this.get();
    const existing = items.find(i => i.id === producto.id && (i.variante || '') === variante);
    if (existing) existing.qty = Math.min(existing.qty + qty, producto.stock ?? 99);
    else items.push({ id: producto.id, variante, qty: Math.min(qty, producto.stock ?? 99) });
    this.save(items);
  },
  setQty(id, variante, qty) {
    const items = this.get(); const it = items.find(i => i.id === id && (i.variante || '') === variante); if (!it) return;
    const p = getProducto(id); it.qty = Math.max(1, Math.min(qty, p?.stock ?? 99)); this.save(items);
  },
  remove(id, variante) { this.save(this.get().filter(i => !(i.id === id && (i.variante || '') === variante))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); },
};

function mensajePedido(items) {
  const lineas = items.map(i => {
    const p = getProducto(i.id);
    if (!p) return null;
    return `${i.qty}x ${p.nombre}${i.variante ? ` | ${i.variante}` : ''} | ${formatearPrecio(precioFinal(p) * i.qty)}`;
  }).filter(Boolean);
  const total = items.reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0);
  return ['Hola Alma home, quiero hacer este pedido:', '', ...lineas, '', `Total: ${formatearPrecio(total)}`, '¿Cómo seguimos con el pago y la entrega?'];
}

function isoLocal(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function turnoTomado(clave) {
  let h = 2166136261;
  for (let i = 0; i < clave.length; i++) { h ^= clave.charCodeAt(i); h = Math.imul(h, 16777619); }
  return (h >>> 0) % 100 < 36;
}

function armarAgenda(servicioId, modalidad, ahora = new Date(), maxDias = 8) {
  const servicio = SERVICIOS[servicioId];
  if (!servicio) return [];
  const grilla = servicio.agenda[modalidad] || {};
  const dias = [];
  for (let i = 0; i < 28 && dias.length < maxDias; i++) {
    const fecha = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate() + i);
    const horas = grilla[fecha.getDay()];
    if (!horas?.length) continue;
    const iso = isoLocal(fecha);
    const slots = horas.map(hora => {
      const [hh, mm] = hora.split(':').map(Number);
      const inicio = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate(), hh, mm);
      if (inicio.getTime() - ahora.getTime() < 90 * 60000) return null;
      const tomado = turnoTomado(`${iso}|${hora}|${servicioId}|${modalidad}`);
      return { hora, libre: !tomado };
    }).filter(Boolean);
    if (!slots.length) continue;
    dias.push({ iso, fecha, slots, libres: slots.filter(s => s.libre).length });
  }
  return dias;
}

function proximoTurno(dias) {
  for (const dia of dias) {
    const slot = dia.slots.find(s => s.libre);
    if (slot) return { dia, slot };
  }
  return null;
}

function nombreDia(fecha, ahora = new Date()) {
  const a = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
  const b = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
  const diff = Math.round((b - a) / 86400000);
  if (diff === 0) return 'hoy';
  if (diff === 1) return 'mañana';
  return `${DIAS_SEM[fecha.getDay()]} ${fecha.getDate()}`;
}

function fechaLarga(fecha) {
  return `${DIAS_SEM[fecha.getDay()]} ${fecha.getDate()} de ${MESES[fecha.getMonth()]}`;
}

function mensajeTurno(servicioId, modalidad, fecha, hora) {
  const s = SERVICIOS[servicioId];
  return [
    'Hola Alma home, quiero pedir un turno:',
    `• ${s.nombre} (${s.dur} min)`,
    `• ${modalidad === 'online' ? 'Online, por videollamada' : 'En el espacio'}`,
    `• ${capitalizar(fechaLarga(fecha))} a las ${hora} h`,
    '',
    '¿Me lo confirman?',
  ];
}

function estadoLocal(ahora = new Date()) {
  const dia = ahora.getDay();
  const h = ahora.getHours() + ahora.getMinutes() / 60;
  const hoy = HORARIO[dia];
  if (hoy && h >= hoy[0] && h < hoy[1]) return { abierto: true, texto: `Abierto ahora · cerramos a las ${hoy[1]} h` };
  if (hoy && h < hoy[0]) return { abierto: false, texto: `Cerrado ahora · abrimos hoy a las ${hoy[0]} h` };
  for (let i = 1; i <= 7; i++) {
    const d = (dia + i) % 7;
    if (HORARIO[d]) return { abierto: false, texto: `Cerrado ahora · abrimos ${i === 1 ? 'mañana' : `el ${DIAS_SEM[d]}`} a las ${HORARIO[d][0]} h` };
  }
  return { abierto: false, texto: 'Cerrado ahora' };
}

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; el.style.filter = 'none'; el.style.clipPath = 'none'; });
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

const refrescarTriggers = () => { if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); };

const ICON_MENOS = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14"/></svg>';
const ICON_MAS = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14"/><path d="M12 5v14"/></svg>';
const ICON_CARRITO = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>';

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

function initWspLinks() {
  document.querySelectorAll('[data-wsp-msg]').forEach(a => { a.href = waHref([a.dataset.wspMsg]); });
}

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

const Capas = {
  pila: [],
  abrir(capa, trigger) {
    if (!capa || this.pila.some(c => c.capa === capa)) return;
    clearTimeout(capa._cierre);
    capa.hidden = false;
    void capa.offsetWidth;
    capa.classList.add('open');
    this.pila.push({ capa, trigger: trigger || document.activeElement });
    document.body.classList.add('no-scroll');
    const panel = capa.querySelector('[role="dialog"]');
    const foco = panel?.querySelector('[data-autofocus]') || panel?.querySelector(FOCUSABLE);
    foco?.focus({ preventScroll: true });
  },
  cerrar(capa, devolverFoco = true) {
    const i = this.pila.findIndex(c => c.capa === capa);
    if (i < 0) return null;
    const [{ trigger }] = this.pila.splice(i, 1);
    capa.classList.remove('open');
    capa._cierre = setTimeout(() => { capa.hidden = true; }, 420);
    if (!this.pila.length && !document.getElementById('mainNav')?.classList.contains('open')) document.body.classList.remove('no-scroll');
    if (devolverFoco && trigger?.isConnected) trigger.focus({ preventScroll: true });
    return trigger;
  },
  tope() { return this.pila[this.pila.length - 1]?.capa || null; },
};

document.addEventListener('keydown', e => {
  const capa = Capas.tope();
  if (!capa) return;
  if (e.key === 'Escape') { e.preventDefault(); Capas.cerrar(capa); return; }
  if (e.key !== 'Tab') return;
  const panel = capa.querySelector('[role="dialog"]');
  const els = [...panel.querySelectorAll(FOCUSABLE)].filter(el => el.offsetParent !== null);
  if (!els.length) return;
  const first = els[0];
  const last = els[els.length - 1];
  if (!panel.contains(document.activeElement)) { first.focus(); e.preventDefault(); }
  else if (e.shiftKey && document.activeElement === first) { last.focus(); e.preventDefault(); }
  else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); }
});

document.addEventListener('click', e => {
  const cierre = e.target.closest('[data-close]');
  if (!cierre) return;
  const capa = cierre.closest('.capa');
  if (capa) Capas.cerrar(capa);
});

function giftcardHTML(p) {
  return `<span class="gc" role="img" aria-label="${esc(p.alt)}"><span class="wordmark"><span class="wm-alma">Alma</span><span class="wm-home">home</span></span><span class="gc-titulo">Una hora para vos</span><span class="gc-meta">Giftcard · armonización · 60 min</span></span>`;
}

function mediaHTML(p, extra = '') {
  return p.gift ? giftcardHTML(p) : `<img src="${p.img}" width="1200" height="1500" alt="${esc(p.alt)}" decoding="async"${extra}>`;
}

function cardHTML(p) {
  const vars = p.variantes.length ? `<span class="card-vars">${p.variantes.length} ${esc(p.varPlural)}</span>` : '';
  return `<li class="card" data-id="${p.id}" data-animate style="opacity:0;transform:translateY(40px)">
    <div class="card-media">
      <button type="button" class="card-open" data-open="${p.id}" aria-label="Ver el detalle de ${esc(p.nombre)}">${mediaHTML(p)}</button>
      ${p.badge ? `<span class="card-badge">${esc(p.badge)}</span>` : ''}
      <button type="button" class="card-quick" data-buy="${p.id}">Comprar ahora</button>
    </div>
    <div class="card-body">
      <p class="card-cat">${esc(CATEGORIAS[p.cats[0]])}</p>
      <h4 class="card-nombre"><button type="button" data-open="${p.id}">${esc(p.nombre)}</button></h4>
      <p class="card-linea"><span class="card-precio">${formatearPrecio(precioFinal(p))}</span>${vars}</p>
      <div class="prod-actions">
        <div class="stepper" data-stepper>
          <button type="button" data-step="-1" aria-label="Restar uno">${ICON_MENOS}</button>
          <output aria-live="polite">1</output>
          <button type="button" data-step="1" aria-label="Sumar uno">${ICON_MAS}</button>
        </div>
        <button type="button" class="btn btn-primary prod-add" data-add="${p.id}">Agregar</button>
      </div>
    </div>
  </li>`;
}

let revealsListos = false;

function revelarNuevos(cont) {
  if (!revealsListos) return;
  const nuevos = cont.querySelectorAll('[data-animate]:not(.in)');
  if (reduceMotion) { nuevos.forEach(el => el.classList.add('in')); return; }
  nuevos.forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i * 0.09, 0.5)}s`;
    requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('in')));
  });
}

let filtroCat = null;

function agregar(p, qty = 1, variante = '') {
  Cart.add(p, qty, variante);
  showToast(`Listo: ${qty > 1 ? `${qty} × ` : ''}${p.nombre}${variante ? ` (${variante})` : ''} ya está en tu pedido.`);
}

function cantidadDeCard(card) {
  const out = card?.querySelector('[data-stepper] output');
  return Math.max(1, parseInt(out?.textContent || '1', 10) || 1);
}

function initTienda() {
  const track = document.getElementById('railTrack');
  const vp = document.getElementById('railVp');
  const titulo = document.getElementById('railTitle');
  const meta = document.getElementById('railMeta');
  const verTodo = document.getElementById('verTodo');
  const prev = document.getElementById('railPrev');
  const next = document.getElementById('railNext');
  if (!track || !vp) return;

  document.querySelectorAll('[data-count]').forEach(el => {
    const n = PRODUCTOS.filter(p => p.cats.includes(el.dataset.count)).length;
    el.textContent = `${n} ${n === 1 ? 'producto' : 'productos'}`;
  });

  const syncFlechas = () => {
    if (!prev || !next) return;
    prev.disabled = vp.scrollLeft <= 2;
    next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };

  const render = animar => {
    const lista = filtroCat ? PRODUCTOS.filter(p => p.cats.includes(filtroCat)) : PRODUCTOS;
    track.innerHTML = lista.map(cardHTML).join('');
    if (titulo) titulo.textContent = filtroCat ? CATEGORIAS[filtroCat] : 'Los más elegidos';
    if (meta) meta.textContent = `${lista.length} ${lista.length === 1 ? 'producto' : 'productos'}`;
    if (verTodo) verTodo.hidden = !filtroCat;
    document.querySelectorAll('.cat').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.cat === filtroCat)));
    vp.scrollLeft = 0;
    if (animar) revelarNuevos(track);
    syncFlechas();
    refrescarTriggers();
  };

  document.querySelectorAll('.cat').forEach(btn => {
    btn.addEventListener('click', () => {
      filtroCat = filtroCat === btn.dataset.cat ? null : btn.dataset.cat;
      render(true);
    });
  });
  verTodo?.addEventListener('click', () => { filtroCat = null; render(true); });

  const paso = () => {
    const card = track.querySelector('.card');
    const gap = parseFloat(getComputedStyle(track).columnGap) || 16;
    return card ? card.getBoundingClientRect().width + gap : 300;
  };
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso() * (window.innerWidth > 900 ? 2 : 1), behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso() * (window.innerWidth > 900 ? 2 : 1), behavior: reduceMotion ? 'auto' : 'smooth' }));
  vp.addEventListener('scroll', syncFlechas, { passive: true });
  window.addEventListener('resize', syncFlechas, { passive: true });

  track.addEventListener('click', e => {
    const step = e.target.closest('[data-step]');
    if (step) {
      const card = step.closest('.card');
      const p = getProducto(card?.dataset.id);
      const out = step.parentElement.querySelector('output');
      const max = Math.min(p?.stock ?? 20, 20);
      out.textContent = String(Math.max(1, Math.min(max, cantidadDeCard(card) + Number(step.dataset.step))));
      return;
    }
    const abrir = e.target.closest('[data-open]');
    if (abrir) { abrirQuickView(abrir.dataset.open, abrir); return; }
    const comprar = e.target.closest('[data-buy]');
    if (comprar) {
      const p = getProducto(comprar.dataset.buy);
      if (!p) return;
      Cart.add(p, cantidadDeCard(comprar.closest('.card')), p.variantes[0] || '');
      abrirCarrito(comprar);
    }
  });

  initRailDrag(vp);
  render(false);
}

function initRailDrag(vp) {
  if (!vp) return;
  let dragging = false, moved = false, startX = 0, startScroll = 0, pointerId = null;
  const THRESHOLD = 6;
  vp.addEventListener('pointerdown', e => {
    if (e.pointerType === 'touch' || e.button !== 0) return;
    dragging = true; moved = false; pointerId = e.pointerId;
    startX = e.clientX; startScroll = vp.scrollLeft;
  });
  vp.addEventListener('pointermove', e => {
    if (!dragging || e.pointerId !== pointerId) return;
    const dx = e.clientX - startX;
    if (!moved && Math.abs(dx) < THRESHOLD) return;
    if (!moved) {
      moved = true;
      vp.classList.add('dragging');
      try { vp.setPointerCapture?.(pointerId); } catch { }
    }
    e.preventDefault();
    vp.scrollLeft = startScroll - dx;
  });
  const end = e => {
    if (!dragging || (e && pointerId !== null && e.pointerId !== pointerId)) return;
    dragging = false;
    if (moved) {
      try { vp.releasePointerCapture?.(pointerId); } catch { }
      vp.classList.remove('dragging');
      const kill = ev => { ev.stopPropagation(); ev.preventDefault(); };
      vp.addEventListener('click', kill, { capture: true, once: true });
      setTimeout(() => vp.removeEventListener('click', kill, { capture: true }), 0);
    }
    pointerId = null; moved = false;
  };
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
  vp.addEventListener('dragstart', e => e.preventDefault());
}

document.addEventListener('click', e => {
  const btn = e.target.closest('[data-add]');
  if (!btn) return;
  const p = getProducto(btn.dataset.add);
  if (!p) return;
  const card = btn.closest('.card');
  const qty = card ? cantidadDeCard(card) : 1;
  agregar(p, qty, p.variantes[0] || '');
  const out = card?.querySelector('[data-stepper] output');
  if (out) out.textContent = '1';
});

const QV = { producto: null, qty: 1, variante: '' };

function abrirQuickView(id, trigger) {
  const p = getProducto(id);
  const capa = document.getElementById('quickView');
  if (!p || !capa) return;
  QV.producto = p;
  QV.qty = 1;
  QV.variante = p.variantes[0] || '';
  document.getElementById('qvMedia').innerHTML = mediaHTML(p);
  document.getElementById('qvCat').textContent = p.cats.map(c => CATEGORIAS[c]).join(' · ');
  document.getElementById('qvTitle').textContent = p.nombre;
  document.getElementById('qvPrecio').textContent = formatearPrecio(precioFinal(p));
  document.getElementById('qvDesc').textContent = p.desc;
  document.getElementById('qvFicha').innerHTML = p.ficha.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('');
  const vars = document.getElementById('qvVars');
  if (p.variantes.length) {
    vars.hidden = false;
    vars.innerHTML = `<legend>${esc(p.varLabel)}</legend><div class="qv-vars-lista">${p.variantes.map((v, i) => `<label class="chip"><input type="radio" name="qvVar" value="${esc(v)}"${i === 0 ? ' checked' : ''}>${esc(v)}</label>`).join('')}</div>`;
  } else {
    vars.hidden = true;
    vars.innerHTML = '';
  }
  document.getElementById('qvQty').textContent = '1';
  const relacionados = PRODUCTOS.filter(x => x.id !== p.id && x.cats.some(c => p.cats.includes(c))).slice(0, 3);
  const rel = document.getElementById('qvRel');
  rel.hidden = !relacionados.length;
  rel.innerHTML = relacionados.length ? `<p class="qv-rel-k">También te puede interesar</p><div class="qv-rel-lista">${relacionados.map(r => `<button type="button" class="rel" data-rel="${r.id}"><span class="rel-media">${mediaHTML(r)}</span><span class="rel-nombre">${esc(r.nombre)}</span></button>`).join('')}</div>` : '';
  const panel = capa.querySelector('.qv-panel');
  if (panel) panel.scrollTop = 0;
  if (!capa.classList.contains('open')) Capas.abrir(capa, trigger);
}

function initQuickView() {
  const capa = document.getElementById('quickView');
  if (!capa) return;
  capa.addEventListener('change', e => {
    if (e.target.name === 'qvVar') QV.variante = e.target.value;
  });
  document.getElementById('qvStepper')?.addEventListener('click', e => {
    const step = e.target.closest('[data-step]');
    if (!step || !QV.producto) return;
    const max = Math.min(QV.producto.stock ?? 20, 20);
    QV.qty = Math.max(1, Math.min(max, QV.qty + Number(step.dataset.step)));
    document.getElementById('qvQty').textContent = String(QV.qty);
  });
  document.getElementById('qvAdd')?.addEventListener('click', () => {
    if (QV.producto) agregar(QV.producto, QV.qty, QV.variante);
  });
  document.getElementById('qvBuy')?.addEventListener('click', () => {
    if (!QV.producto) return;
    Cart.add(QV.producto, QV.qty, QV.variante);
    const trigger = Capas.cerrar(capa, false);
    abrirCarrito(trigger);
  });
  document.getElementById('qvRel')?.addEventListener('click', e => {
    const r = e.target.closest('[data-rel]');
    if (r) abrirQuickView(r.dataset.rel);
  });
}

function renderCarrito() {
  const body = document.getElementById('cartBody');
  const foot = document.getElementById('cartFoot');
  if (!body || !foot) return;
  const items = Cart.get().filter(i => getProducto(i.id));
  if (!items.length) {
    foot.hidden = true;
    body.innerHTML = `<div class="carrito-vacio">${ICON_CARRITO}<strong>Tu pedido está vacío</strong><p>Empezá por una vela: es el ritual más corto y el que más se regala.</p><a class="btn btn-ghost" href="#tienda" data-close>Ir a la tienda</a></div>`;
    return;
  }
  foot.hidden = false;
  body.innerHTML = items.map(i => {
    const p = getProducto(i.id);
    const v = esc(i.variante || '');
    return `<div class="linea">
      <div class="linea-media">${mediaHTML(p)}</div>
      <div class="linea-info">
        <p class="linea-nombre">${esc(p.nombre)}</p>
        ${i.variante ? `<p class="linea-var">${v}</p>` : ''}
        <div class="linea-fila">
          <div class="stepper">
            <button type="button" data-linea="${p.id}" data-var="${v}" data-delta="-1" aria-label="Restar uno de ${esc(p.nombre)}">${ICON_MENOS}</button>
            <output>${i.qty}</output>
            <button type="button" data-linea="${p.id}" data-var="${v}" data-delta="1" aria-label="Sumar uno de ${esc(p.nombre)}">${ICON_MAS}</button>
          </div>
          <span class="linea-precio">${formatearPrecio(precioFinal(p) * i.qty)}</span>
        </div>
        <button type="button" class="linea-quitar" data-quitar="${p.id}" data-var="${v}">Quitar</button>
      </div>
    </div>`;
  }).join('');
  document.getElementById('cartTotal').textContent = formatearPrecio(Cart.total());
  const wsp = document.getElementById('cartWsp');
  if (wsp) wsp.href = waHref(mensajePedido(items));
}

function abrirCarrito(trigger) {
  const capa = document.getElementById('cartDrawer');
  if (!capa) return;
  document.querySelectorAll('.toast').forEach(t => t.remove());
  renderCarrito();
  Capas.abrir(capa, trigger);
}

function initCarrito() {
  const capa = document.getElementById('cartDrawer');
  if (!capa) return;
  document.getElementById('cartBtn')?.addEventListener('click', e => abrirCarrito(e.currentTarget));
  document.getElementById('cartBody')?.addEventListener('click', e => {
    const delta = e.target.closest('[data-delta]');
    if (delta) {
      const it = Cart.get().find(i => i.id === delta.dataset.linea && (i.variante || '') === delta.dataset.var);
      if (it) Cart.setQty(it.id, it.variante || '', it.qty + Number(delta.dataset.delta));
      return;
    }
    const quitar = e.target.closest('[data-quitar]');
    if (quitar) Cart.remove(quitar.dataset.quitar, quitar.dataset.var);
  });
  document.getElementById('checkoutBtn')?.addEventListener('click', () => {
    showToast('¡Genial! El pago online se activa al pasar la web a producción.');
  });
  document.addEventListener('cart:updated', () => { if (capa.classList.contains('open')) renderCarrito(); });
}

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
}
document.addEventListener('cart:updated', updateCartBadge);

function initFloats() {
  const wsp = document.getElementById('wsp-float');
  const cart = document.getElementById('cart-float');
  const sync = () => {
    const scrolled = window.scrollY > 600;
    wsp?.classList.toggle('visible', scrolled);
    cart?.classList.toggle('visible', scrolled || Cart.count() > 0);
  };
  window.addEventListener('scroll', sync, { passive: true });
  document.addEventListener('cart:updated', sync);
  cart?.addEventListener('click', e => abrirCarrito(e.currentTarget));
  sync();
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
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); } });
  const syncInert = () => {
    if (desktopMq.matches) nav.removeAttribute('inert');
    else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  desktopMq.addEventListener('change', syncInert);
  syncInert();
}

const Agenda = {
  estado: { servicio: 'chakras', modalidad: 'presencial', iso: null, hora: null },
  dias: [],
  el: {},
  init() {
    const raiz = document.getElementById('agenda');
    if (!raiz) return;
    this.el = {
      raiz,
      dias: document.getElementById('agendaDias'),
      horas: document.getElementById('agendaHoras'),
      prox: document.getElementById('agendaProx'),
      servicio: document.getElementById('resServicio'),
      modalidad: document.getElementById('resModalidad'),
      cuando: document.getElementById('resCuando'),
      valor: document.getElementById('resValor'),
      cta: document.getElementById('agendaCta'),
    };
    raiz.addEventListener('change', e => {
      if (e.target.name === 'servicio') { this.estado.servicio = e.target.value; this.recalcular(); }
      if (e.target.name === 'modalidad') { this.estado.modalidad = e.target.value; this.recalcular(); }
    });
    this.el.dias.addEventListener('click', e => {
      const b = e.target.closest('[data-iso]');
      if (!b || b.disabled) return;
      this.estado.iso = b.dataset.iso;
      const dia = this.dias.find(d => d.iso === b.dataset.iso);
      this.estado.hora = dia?.slots.find(s => s.libre)?.hora || null;
      this.render();
    });
    this.el.horas.addEventListener('click', e => {
      const b = e.target.closest('[data-hora]');
      if (!b || b.disabled) return;
      this.estado.hora = b.dataset.hora;
      this.renderHoras();
      this.renderResumen();
    });
    this.recalcular();
  },
  elegirServicio(id) {
    if (!SERVICIOS[id] || !this.el.raiz) return;
    const radio = this.el.raiz.querySelector(`input[name="servicio"][value="${id}"]`);
    if (radio) radio.checked = true;
    this.estado.servicio = id;
    this.recalcular();
  },
  recalcular() {
    this.dias = armarAgenda(this.estado.servicio, this.estado.modalidad, new Date());
    const prox = proximoTurno(this.dias);
    this.estado.iso = prox?.dia.iso || this.dias[0]?.iso || null;
    this.estado.hora = prox?.slot.hora || null;
    this.render();
  },
  render() {
    this.renderDias();
    this.renderHoras();
    this.renderResumen();
    refrescarTriggers();
  },
  renderDias() {
    const ahora = new Date();
    this.el.dias.innerHTML = this.dias.map(d => {
      const etiqueta = nombreDia(d.fecha, ahora);
      const sem = etiqueta === 'hoy' || etiqueta === 'mañana' ? etiqueta : DIAS_CORTOS[d.fecha.getDay()];
      const libres = d.libres ? `${d.libres} ${d.libres === 1 ? 'libre' : 'libres'}` : 'completo';
      return `<button type="button" class="dia" data-iso="${d.iso}" aria-pressed="${d.iso === this.estado.iso}"${d.libres ? '' : ' disabled'} aria-label="${capitalizar(fechaLarga(d.fecha))}: ${d.libres ? libres : 'sin horarios libres'}"><span class="dia-sem">${sem}</span><span class="dia-num">${d.fecha.getDate()}</span><span class="dia-libres">${libres}</span></button>`;
    }).join('');
  },
  renderHoras() {
    const dia = this.dias.find(d => d.iso === this.estado.iso);
    if (!dia) {
      this.el.horas.innerHTML = '<p class="agenda-vacia">No encontramos horarios en los próximos días para esta combinación. Escribinos y buscamos uno a tu medida.</p>';
      return;
    }
    const prox = proximoTurno(this.dias);
    this.el.horas.innerHTML = dia.slots.map(s => {
      const esProx = prox && prox.dia.iso === dia.iso && prox.slot.hora === s.hora;
      const detalle = s.libre ? (esProx ? ', el más cercano' : '') : ', tomado';
      return `<button type="button" class="hora" data-hora="${s.hora}" aria-pressed="${s.hora === this.estado.hora}"${s.libre ? '' : ' disabled'} aria-label="${s.hora} h${detalle}">${s.hora}${esProx ? '<span class="hora-tag">más cercano</span>' : ''}</button>`;
    }).join('');
  },
  renderResumen() {
    const s = SERVICIOS[this.estado.servicio];
    const online = this.estado.modalidad === 'online';
    const prox = proximoTurno(this.dias);
    this.el.prox.textContent = prox ? `${capitalizar(nombreDia(prox.dia.fecha))} · ${prox.slot.hora} h` : 'Sin lugar en la agenda';
    this.el.servicio.textContent = s.nombre;
    this.el.modalidad.textContent = online ? 'Online' : 'En el espacio';
    this.el.valor.textContent = formatearPrecio(s.precio);
    const dia = this.dias.find(d => d.iso === this.estado.iso);
    if (dia && this.estado.hora) {
      this.el.cuando.textContent = `${capitalizar(fechaLarga(dia.fecha))}, ${this.estado.hora} h`;
      this.el.cta.href = waHref(mensajeTurno(this.estado.servicio, this.estado.modalidad, dia.fecha, this.estado.hora));
      this.el.cta.textContent = 'Pedir este turno por WhatsApp';
    } else {
      this.el.cuando.textContent = 'A coordinar';
      this.el.cta.href = waHref([`Hola Alma home, quiero un turno de ${s.nombre.toLowerCase()} (${online ? 'online' : 'en el espacio'}). ¿Qué horarios tienen?`]);
      this.el.cta.textContent = 'Consultar horarios por WhatsApp';
    }
  },
};

function initHorarios() {
  const estado = document.getElementById('estadoAhora');
  const txt = document.getElementById('estadoTxt');
  const ahora = new Date();
  if (estado && txt) {
    const est = estadoLocal(ahora);
    estado.classList.toggle('abierto', est.abierto);
    txt.textContent = est.texto;
  }
  const hoy = document.querySelector(`#diasLista li[data-dia="${ahora.getDay()}"]`);
  if (hoy) { hoy.classList.add('hoy'); hoy.setAttribute('aria-current', 'date'); }
}

function initDual() {
  const sec = document.getElementById('casa-alma');
  const escena = document.getElementById('dualEscena');
  const copyA = document.getElementById('copyA');
  const copyB = document.getElementById('copyB');
  const num = document.getElementById('dualNum');
  const txt = document.getElementById('dualTxt');
  const dato = document.getElementById('dualDato');
  if (!sec || !escena || !copyA || !copyB || !num || !txt || !dato) return;

  const clamp01 = v => Math.max(0, Math.min(1, v));
  const rango = (p, a, b) => clamp01((p - a) / (b - a));
  let ultimoTxt = '';

  const pintar = p => {
    const w = 108 - rango(p, 0.05, 0.72) * 116;
    sec.style.setProperty('--w', w.toFixed(2));

    const oA = 1 - rango(p, 0.08, 0.3);
    const oB = rango(p, 0.36, 0.62);
    copyA.style.opacity = oA.toFixed(3);
    copyA.style.transform = `translateY(${((1 - oA) * -18).toFixed(1)}px)`;
    copyA.style.pointerEvents = oA < 0.15 ? 'none' : 'auto';
    copyA.style.visibility = oA <= 0.02 ? 'hidden' : 'visible';
    copyB.style.opacity = oB.toFixed(3);
    copyB.style.transform = `translateY(${((1 - oB) * 18).toFixed(1)}px)`;
    copyB.style.pointerEvents = oB < 0.15 ? 'none' : 'auto';
    copyB.style.visibility = oB <= 0.02 ? 'hidden' : 'visible';

    const minutos = Math.round(5 + rango(p, 0.08, 0.72) * 55);
    num.textContent = String(minutos);
    const nuevo = minutos < 20 ? 'encender una vela en casa' : minutos < 45 ? 'un baño largo con aceites' : 'una sesión de armonización';
    if (nuevo !== ultimoTxt) { txt.textContent = nuevo; ultimoTxt = nuevo; }

    const ancho = escena.clientWidth;
    const dw = dato.offsetWidth;
    const margen = Math.min(24, ancho * 0.04);
    const derecha = ancho > 768 ? 104 : margen;
    const x = Math.max(margen, Math.min(ancho - dw - derecha, (ancho * w) / 100 - dw / 2));
    dato.style.setProperty('--dx', `${x.toFixed(1)}px`);
  };

  const progreso = () => {
    const r = sec.getBoundingClientRect();
    const total = r.height - window.innerHeight;
    return total > 0 ? clamp01(-r.top / total) : 0;
  };

  let queued = false;
  const frame = () => { queued = false; pintar(progreso()); };
  const queue = () => { if (!queued) { queued = true; requestAnimationFrame(frame); } };
  window.addEventListener('scroll', queue, { passive: true });
  window.addEventListener('resize', queue, { passive: true });
  window.addEventListener('load', () => pintar(progreso()));
  pintar(progreso());
}

function initForm() {
  const form = document.getElementById('consultaForm');
  if (!form) return;
  const nombre = document.getElementById('fNombre');
  const tel = document.getElementById('fTel');
  const mensaje = document.getElementById('fMensaje');
  const boton = document.getElementById('formSubmit');
  let mascara = null;
  if (typeof IMask !== 'undefined' && tel) {
    mascara = IMask(tel, { mask: [
      { mask: '+{54} 9 (00) 0000-0000' },
      { mask: '+{54} 9 (000) 000-0000' },
      { mask: '+{54} 9 (0000) 00-0000' },
    ] });
  }
  const digitos = () => (mascara ? mascara.unmaskedValue : tel.value.replace(/\D/g, '')).length;
  const reglas = [
    [nombre, () => nombre.value.trim().length >= 2],
    [tel, () => digitos() >= (mascara ? 12 : 10)],
    [mensaje, () => mensaje.value.trim().length >= 5],
  ];
  const marcar = (campo, ok) => {
    campo.setAttribute('aria-invalid', String(!ok));
    const err = document.getElementById(campo.getAttribute('aria-describedby'));
    if (err) err.hidden = ok;
  };
  reglas.forEach(([campo, ok]) => {
    campo.addEventListener('blur', () => { if (campo.value) marcar(campo, ok()); });
    campo.addEventListener('input', () => { if (campo.getAttribute('aria-invalid') === 'true') marcar(campo, ok()); });
  });
  form.addEventListener('submit', e => {
    e.preventDefault();
    let primero = null;
    reglas.forEach(([campo, ok]) => { const valido = ok(); marcar(campo, valido); if (!valido && !primero) primero = campo; });
    if (primero) { primero.focus({ preventScroll: true }); primero.scrollIntoView({ block: 'center', behavior: reduceMotion ? 'auto' : 'smooth' }); return; }
    const texto = boton.textContent;
    boton.disabled = true;
    boton.textContent = 'Enviando…';
    setTimeout(() => {
      showToast('¡Gracias! El envío de mensajes se activa al pasar la web a producción.');
      form.reset();
      if (mascara) mascara.value = '';
      reglas.forEach(([campo]) => campo.setAttribute('aria-invalid', 'false'));
      boton.disabled = false;
      boton.textContent = texto;
    }, 800);
  });
}

function initAnclas() {
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || e.defaultPrevented) return;
    const id = a.getAttribute('href');
    if (id.length < 2) return;
    const destino = document.querySelector(id);
    if (!destino) return;
    if (a.dataset.servicio) Agenda.elegirServicio(a.dataset.servicio);
    e.preventDefault();
    destino.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  });
}

function initReveals() {
  const items = document.querySelectorAll('[data-animate]');
  revealsListos = true;
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
      },
    });
  });
}

function initParallax() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) return;
  const img = document.querySelector('.historia-foto img');
  if (!img) return;
  gsap.fromTo(img, { yPercent: 0 }, {
    yPercent: -7, ease: 'none',
    scrollTrigger: { trigger: '.historia-foto', start: 'top bottom', end: 'bottom top', scrub: 0.6, invalidateOnRefresh: true },
  });
}

function abrirDesdeURL() {
  const slug = new URLSearchParams(window.location.search).get('producto');
  if (!slug) return;
  const p = PRODUCTOS.find(x => x.id === slug);
  if (p) abrirQuickView(p.id);
}

initWspLinks();
initTienda();
initCarrito();
initQuickView();
Agenda.init();
initHorarios();
initDual();
initForm();
initAnclas();
initNav();
initFloats();
updateCartBadge();
initReveals();
initLeeScroll();
initParallax();
abrirDesdeURL();
