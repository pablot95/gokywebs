const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5491169579606';

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

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

function initReveals() {
  const items = document.querySelectorAll('[data-animate]');
  if (!items.length) return;
  document.querySelectorAll('[data-animate-stagger]').forEach(parent => {
    parent.querySelectorAll('[data-animate]').forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i * 0.08, 0.6)}s`;
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

function initWspLinks() {
  document.querySelectorAll('[data-wsp-msg]').forEach(a => {
    a.href = `https://wa.me/${WSP}?text=${encodeURIComponent(a.dataset.wspMsg)}`;
  });
}

/* ===== Horarios de atención (hero, AN) ===== */
const ATENCION = { dias: [1, 2, 3, 4, 5], tramo: [8 * 60, 22 * 60], sabado: [9 * 60, 14 * 60] };

function initEstadoAtencion() {
  const caja = document.querySelector('[data-estado]');
  if (!caja) return;
  const ahora = new Date();
  const min = ahora.getHours() * 60 + ahora.getMinutes();
  const dia = ahora.getDay();
  let abierto = false, texto = '';
  if (ATENCION.dias.includes(dia) && min >= ATENCION.tramo[0] && min < ATENCION.tramo[1]) {
    abierto = true; texto = `Abierto ahora · hasta las ${ATENCION.tramo[1] / 60} h`;
  } else if (dia === 6 && min >= ATENCION.sabado[0] && min < ATENCION.sabado[1]) {
    abierto = true; texto = `Abierto ahora · hasta las ${ATENCION.sabado[1] / 60} h`;
  } else if (ATENCION.dias.includes(dia) && min < ATENCION.tramo[0]) {
    texto = `Cerrado · abrimos hoy a las ${ATENCION.tramo[0] / 60} h`;
  } else if (dia === 6 && min < ATENCION.sabado[0]) {
    texto = `Cerrado · abrimos hoy a las ${ATENCION.sabado[0] / 60} h`;
  } else if (dia === 0) {
    texto = 'Cerrado · abrimos mañana a las 8 h';
  } else {
    texto = 'Cerrado · abrimos mañana a las 8 h';
  }
  caja.classList.toggle('estado-vivo--cerrado', !abierto);
  const span = caja.querySelector('[data-estado-texto]');
  if (span) span.textContent = texto;
}

/* ===== Agenda semanal (fixture, compartida) ===== */
const DIAS_NOMBRE = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const AGENDA_SEMANA = [
  { dia: 1, hora: 18 * 60, actividad: 'Funcional', duracion: '50 min', nivel: 'Todos los niveles' },
  { dia: 2, hora: 19 * 60 + 30, actividad: 'Boxeo técnico', duracion: '60 min', nivel: 'Intermedio' },
  { dia: 3, hora: 18 * 60, actividad: 'Funcional', duracion: '50 min', nivel: 'Todos los niveles' },
  { dia: 3, hora: 19 * 60, actividad: 'Fuerza', duracion: '60 min', nivel: 'Intermedio' },
  { dia: 4, hora: 19 * 60 + 30, actividad: 'Boxeo técnico', duracion: '60 min', nivel: 'Intermedio' },
  { dia: 4, hora: 20 * 60 + 30, actividad: 'Preparación fútbol', duracion: '75 min', nivel: 'Avanzado' },
  { dia: 5, hora: 18 * 60, actividad: 'Fuerza', duracion: '60 min', nivel: 'Intermedio' },
  { dia: 5, hora: 19 * 60, actividad: 'Preparación tenis', duracion: '75 min', nivel: 'Avanzado' },
  { dia: 6, hora: 10 * 60, actividad: 'Funcional', duracion: '50 min', nivel: 'Todos los niveles' }
].sort((a, b) => a.dia - b.dia || a.hora - b.hora);

const DISCIPLINAS = {
  general: { nombre: 'Entrenamiento general', busca: 'Funcional', foco: 'Trabajo general de fuerza y resistencia, base para cualquier disciplina.' },
  futbol: { nombre: 'Fútbol', busca: 'Preparación fútbol', foco: 'Resistencia, cambios de ritmo y potencia de pierna pensados para la cancha.' },
  tenis: { nombre: 'Tenis', busca: 'Preparación tenis', foco: 'Rotación de cadera, potencia de brazo y resistencia para partidos largos.' },
  boxeo: { nombre: 'Boxeo', busca: 'Boxeo técnico', foco: 'Técnica, velocidad de manos y resistencia específica de combate.' }
};

function minutosDesdeAhora(entry, ahora) {
  const diaAhora = ahora.getDay(), minAhora = ahora.getHours() * 60 + ahora.getMinutes();
  let deltaDias = entry.dia - diaAhora;
  if (deltaDias < 0 || (deltaDias === 0 && entry.hora <= minAhora)) deltaDias += 7;
  return { faltan: deltaDias * 1440 + (entry.hora - minAhora), deltaDias };
}

function proximaOcurrencia(nombreActividad, ahora) {
  const candidatos = AGENDA_SEMANA.filter(e => e.actividad === nombreActividad);
  if (!candidatos.length) return null;
  return candidatos.map(e => ({ entry: e, ...minutosDesdeAhora(e, ahora) })).sort((a, b) => a.faltan - b.faltan)[0];
}

function proximaGeneral(ahora) {
  return AGENDA_SEMANA.map(e => ({ entry: e, ...minutosDesdeAhora(e, ahora) })).sort((a, b) => a.faltan - b.faltan)[0];
}

function formatCuando(deltaDias, faltanMin) {
  if (deltaDias === 0) {
    const horas = Math.floor(faltanMin / 60), min = faltanMin % 60;
    return `hoy en ${horas > 0 ? horas + 'h ' : ''}${min}min`;
  }
  if (deltaDias === 1) return 'mañana';
  return DIAS_NOMBRE[(new Date().getDay() + deltaDias) % 7];
}
const horaTexto = m => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;

function initAgenda() {
  const chips = document.querySelectorAll('.chip-actividad');
  const lista = document.getElementById('agendaLista');
  const nombreEl = document.getElementById('agendaNombre');
  const cuandoEl = document.getElementById('agendaCuando');
  const duracionEl = document.getElementById('agendaDuracion');
  const nivelEl = document.getElementById('agendaNivel');
  const focoEl = document.getElementById('agendaFoco');
  const ctaEl = document.getElementById('agendaCta');
  if (!chips.length || !lista) return;
  let disciplina = 'general';

  const pintar = () => {
    const ahora = new Date();
    const d = DISCIPLINAS[disciplina];
    const prox = proximaOcurrencia(d.busca, ahora);
    if (nombreEl) nombreEl.textContent = prox.entry.actividad;
    if (cuandoEl) cuandoEl.textContent = `Próxima: ${formatCuando(prox.deltaDias, prox.faltan)} ${horaTexto(prox.entry.hora)}`;
    if (duracionEl) duracionEl.textContent = prox.entry.duracion;
    if (nivelEl) nivelEl.textContent = prox.entry.nivel;
    if (focoEl) focoEl.textContent = d.foco;
    if (ctaEl) {
      const msg = `Hola, quiero reservar ${prox.entry.actividad} (${DIAS_NOMBRE[prox.entry.dia]} ${horaTexto(prox.entry.hora)}) en Ronnigym.`;
      ctaEl.dataset.wspMsg = msg;
      ctaEl.href = `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
    }
    lista.innerHTML = AGENDA_SEMANA.map(e => {
      const esProxima = e === prox.entry;
      return `<div class="agenda__fila${esProxima ? ' is-proxima' : ''}"><span>${DIAS_NOMBRE[e.dia]} · ${e.actividad}</span><span>${horaTexto(e.hora)}</span></div>`;
    }).join('');
  };

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      disciplina = chip.dataset.disciplina;
      chips.forEach(c => c.setAttribute('aria-pressed', String(c === chip)));
      pintar();
    });
  });
  pintar();
}

function initFranjaVivo() {
  const texto = document.getElementById('franjaTexto');
  if (!texto) return;
  const prox = proximaGeneral(new Date());
  texto.textContent = `próxima clase de ${prox.entry.actividad} ${formatCuando(prox.deltaDias, prox.faltan)} a las ${horaTexto(prox.entry.hora)}`;
}

/* ===== Mapa (Leaflet, AN) ===== */
function initMapa() {
  const el = document.getElementById('mapa');
  if (!el || typeof L === 'undefined') return;
  const coords = [-34.7764, -58.3958];
  const mapa = L.map(el, { scrollWheelZoom: false, zoomControl: true }).setView(coords, 16);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap &copy; CARTO', maxZoom: 19
  }).addTo(mapa);
  const icono = L.divIcon({
    className: 'mapa-pin',
    html: '<span style="display:block;width:22px;height:22px;border-radius:50%;background:#FF00FF;border:3px solid #fff;box-shadow:0 2px 10px rgba(0,0,0,.35)"></span>',
    iconSize: [22, 22], iconAnchor: [11, 11]
  });
  L.marker(coords, { icon: icono }).addTo(mapa).bindPopup('<b>Ronnigym</b><br>La Golondrina 3510, Temperley');
}

/* ===== Catálogo de productos (AO) ===== */
const PRODUCTOS = [
  { id: 'proteina', nombre: 'Proteína Whey 1kg', categoria: 'suplementos', precio: 42000, img: 'images/prod-proteina.webp' },
  { id: 'pack-recuperacion', nombre: 'Pack recuperación post-entreno', categoria: 'suplementos', precio: 38500, img: 'images/suplementos-1x1.webp' },
  { id: 'shaker', nombre: 'Shaker Ronnigym 700ml', categoria: 'accesorios', precio: 8900, img: 'images/prod-shaker.webp' },
  { id: 'guantes', nombre: 'Guantes de entrenamiento', categoria: 'accesorios', precio: 12500, img: 'images/prod-guantes.webp' },
  { id: 'bandas', nombre: 'Set de bandas elásticas x3', categoria: 'accesorios', precio: 15900, img: 'images/prod-bandas.webp' },
  { id: 'vendas', nombre: 'Vendas de boxeo 4m', categoria: 'boxeo', precio: 6500, img: 'images/prod-vendas.webp' },
  { id: 'zapatillas', nombre: 'Zapatillas de training', categoria: 'indumentaria', precio: 68000, img: 'images/prod-accesorios.webp' },
  { id: 'remera', nombre: 'Remera Ronnigym', categoria: 'indumentaria', precio: 17500, img: 'images/prod-remera.webp' }
];
const CATEGORIA_NOMBRE = { suplementos: 'Suplementos', accesorios: 'Accesorios', boxeo: 'Boxeo', indumentaria: 'Indumentaria' };
const getProducto = id => PRODUCTOS.find(p => p.id === id);

const Cart = {
  KEY: 'ronnigym_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { localStorage.setItem(this.KEY, JSON.stringify(items)); document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty = 1) {
    const items = this.get();
    const existing = items.find(i => i.id === producto.id);
    if (existing) existing.qty += qty; else items.push({ id: producto.id, qty });
    this.save(items);
  },
  setQty(id, qty) {
    const items = this.get(); const it = items.find(i => i.id === id); if (!it) return;
    it.qty = Math.max(1, qty); this.save(items);
  },
  remove(id) { this.save(this.get().filter(i => i.id !== id)); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + p.precio * i.qty : s; }, 0); }
};

function initCatalogo() {
  const grid = document.getElementById('productosGrid');
  if (!grid) return;
  const circulos = [...document.querySelectorAll('.cat-circulo')];
  let activa = null;

  const render = () => {
    const visibles = activa ? PRODUCTOS.filter(p => p.categoria === activa) : PRODUCTOS;
    grid.innerHTML = visibles.map(p => `
      <article class="prod-card" data-animate style="opacity:0;transform:translateY(18px)">
        <div class="prod-media"><span class="prod-cat-eti">${esc(CATEGORIA_NOMBRE[p.categoria])}</span><img src="${p.img}" alt="${esc(p.nombre)}" loading="lazy" decoding="async"></div>
        <div class="prod-info">
          <h3>${esc(p.nombre)}</h3>
          <p class="prod-precio">${formatearPrecio(p.precio)}</p>
          <div class="prod-actions">
            <button type="button" class="btn btn--cta btn--chico prod-add" data-agregar="${p.id}" aria-label="Agregar ${esc(p.nombre)} al carrito">Agregar</button>
          </div>
        </div>
      </article>`).join('');
    grid.querySelectorAll('[data-agregar]').forEach(btn => {
      btn.addEventListener('click', () => {
        const p = getProducto(btn.dataset.agregar);
        Cart.add(p, 1);
        showToast(`${p.nombre} sumado al carrito`);
      });
    });
    initReveals();
  };

  circulos.forEach(c => {
    c.addEventListener('click', () => {
      const nueva = activa === c.dataset.cat ? null : c.dataset.cat;
      activa = nueva;
      circulos.forEach(x => x.setAttribute('aria-pressed', String(x.dataset.cat === activa)));
      render();
      document.getElementById('tienda')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    });
  });
  render();
}

/* ===== Carrito: drawer y flotantes ===== */
let carritoFocoPrev = null;
function abrirCarrito() {
  const drawer = document.getElementById('cartDrawer');
  if (!drawer) return;
  carritoFocoPrev = document.activeElement;
  renderCarrito();
  drawer.hidden = false;
  document.body.classList.add('no-scroll');
  drawer.querySelector('[data-cerrar-carrito]')?.focus();
}
function cerrarCarrito() {
  const drawer = document.getElementById('cartDrawer');
  if (!drawer || drawer.hidden) return;
  drawer.hidden = true;
  document.body.classList.remove('no-scroll');
  carritoFocoPrev?.focus?.();
}
function atraparFoco(e, cont) {
  const focos = cont.querySelectorAll('a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])');
  if (!focos.length) return;
  const primero = focos[0], ultimo = focos[focos.length - 1];
  if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
  else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
}

function renderCarrito() {
  const lista = document.getElementById('cartLista');
  if (!lista) return;
  const items = Cart.get();
  lista.innerHTML = items.map(i => {
    const p = getProducto(i.id);
    if (!p) return '';
    return `<li class="cart-item"><img src="${p.img}" alt="" loading="lazy">
      <div class="cart-item-txt"><b>${esc(p.nombre)}</b><em>${formatearPrecio(p.precio)}</em>
      <span class="stepper stepper--mini"><button type="button" data-cart-step="-1" data-id="${p.id}" aria-label="Quitar uno">−</button><output>${i.qty}</output><button type="button" data-cart-step="1" data-id="${p.id}" aria-label="Sumar uno">+</button></span></div>
      <button type="button" class="cart-quitar" data-cart-del="${p.id}" aria-label="Sacar ${esc(p.nombre)} del carrito"><svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M18 6 6 18M6 6l12 12"/></svg></button></li>`;
  }).join('');
  const vacio = document.getElementById('cartVacio');
  if (vacio) vacio.hidden = items.length > 0;
  const pie = document.getElementById('cartPie');
  if (pie) pie.hidden = items.length === 0;
  const total = document.getElementById('cartTotal');
  if (total) total.textContent = formatearPrecio(Cart.total());
  lista.querySelectorAll('[data-cart-step]').forEach(b => b.addEventListener('click', () => {
    const it = Cart.get().find(x => x.id === b.dataset.id);
    const nueva = (it?.qty || 1) + parseInt(b.dataset.cartStep, 10);
    if (nueva < 1) Cart.remove(b.dataset.id); else Cart.setQty(b.dataset.id, nueva);
    renderCarrito();
  }));
  lista.querySelectorAll('[data-cart-del]').forEach(b => b.addEventListener('click', () => { Cart.remove(b.dataset.cartDel); renderCarrito(); }));
}

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
}

function initCarrito() {
  if (!document.getElementById('cartDrawer')) return;
  document.getElementById('cart-float')?.addEventListener('click', abrirCarrito);
  document.getElementById('cart-float-header')?.addEventListener('click', abrirCarrito);
  const drawer = document.getElementById('cartDrawer');
  drawer?.addEventListener('click', e => { if (e.target === drawer || e.target.closest('[data-cerrar-carrito]')) cerrarCarrito(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && drawer && !drawer.hidden) cerrarCarrito();
    if (e.key === 'Tab' && drawer && !drawer.hidden) atraparFoco(e, drawer);
  });
  document.getElementById('cartFinalizar')?.addEventListener('click', () => {
    showToast('¡Genial! El pago online se activa al pasar la web a producción.');
  });
  document.getElementById('cartSeguir')?.addEventListener('click', () => {
    cerrarCarrito();
    document.getElementById('tienda')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  });
  document.addEventListener('cart:updated', () => { updateCartBadge(); renderCarrito(); });
  updateCartBadge();
  renderCarrito();
}

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
  sync();
}

function initWspFloatSimple() {
  const btn = document.getElementById('wsp-float');
  if (!btn || document.getElementById('cart-float')) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) btn.classList.add('visible'); else btn.classList.remove('visible');
  }, { passive: true });
}

function initMovimiento() {
  if (typeof gsap === 'undefined') {
    document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
    return;
  }
  if (reduceMotion) return;
  const heroImg = document.querySelector('.hero__foto img, .hero__do-foto img');
  if (heroImg) gsap.fromTo(heroImg, { scale: 1.07 }, { scale: 1, duration: 1.4, ease: 'power2.out' });
}

document.addEventListener('DOMContentLoaded', () => {
  const anio = document.getElementById('anio');
  if (anio) anio.textContent = String(new Date().getFullYear());
  initNav();
  initWspLinks();
  initEstadoAtencion();
  initAgenda();
  initFranjaVivo();
  initMapa();
  initCatalogo();
  initCarrito();
  initFloats();
  initWspFloatSimple();
  initMovimiento();
  initReveals();
});
