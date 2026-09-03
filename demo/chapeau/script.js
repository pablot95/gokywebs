const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5491127067431';

const SERVICIOS = [
  { id: 1, nombre: 'Corte de pelo', dura: '45 min', precio: 18000,
    desc: 'Lavado, corte y secado. Charlamos la forma antes de tocar la tijera.',
    perfil: ['corte', 'retoque', 'cambio'] },
  { id: 2, nombre: 'Corte con cambio de forma', dura: '1 h 30', precio: 32000,
    desc: 'Cuando querés otra cabeza: estudiamos tu tipo de pelo y rediseñamos el largo entero.',
    perfil: ['corte', 'cambio', 'desdecero'] },
  { id: 3, nombre: 'Color completo', dura: '2 h 30', precio: 55000,
    desc: 'Color parejo de raíz a puntas, sin amoníaco, con el tono elegido sobre tu base real.',
    perfil: ['color', 'cambio', 'desdecero'] },
  { id: 4, nombre: 'Reflejos y balayage', dura: '3 h', precio: 72000,
    desc: 'Aclarado por mechones con transición suave, para que crezca sin marcar la raíz.',
    perfil: ['color', 'desdecero', 'cambio'] },
  { id: 5, nombre: 'Retoque de raíz', dura: '1 h', precio: 28000,
    desc: 'Solo el crecimiento, con la fórmula que ya usamos la vez anterior.',
    perfil: ['color', 'retoque'] },
  { id: 6, nombre: 'Tratamiento de nutrición', dura: '1 h', precio: 22000,
    desc: 'Para pelo poroso o castigado por el color: hidrata y devuelve el brillo en una sesión.',
    perfil: ['tratamiento', 'retoque', 'cambio'] },
  { id: 7, nombre: 'Alisado progresivo', dura: '2 h', precio: 65000,
    desc: 'Reduce el frizz y el tiempo de secado durante meses, sin dejar el pelo acartonado.',
    perfil: ['tratamiento', 'desdecero', 'cambio'] },
  { id: 8, nombre: 'Peinado para evento', dura: '1 h', precio: 25000,
    desc: 'Recogido, semi o planchado con cuerpo, listo para salir del salón a la fiesta.',
    perfil: ['peinado', 'retoque', 'cambio'] },
  { id: 9, nombre: 'Peinado con prueba previa', dura: '2 h', precio: 38000,
    desc: 'Para casamientos y quince: probamos el peinado unos días antes y lo dejamos definido.',
    perfil: ['peinado', 'desdecero', 'cambio'] },
];

const LOOKS = {
  corte: { img: 'images/look-corte.webp', cap: 'Corte recto con flequillo', alt: 'Corte recto con flequillo marcado' },
  color: { img: 'images/look-color.webp', cap: 'Color completo en tono claro', alt: 'Pelo rubio con color parejo de raíz a puntas' },
  tratamiento: { img: 'images/textura.webp', cap: 'Textura tratada y definida', alt: 'Detalle de cabello con textura definida' },
  peinado: { img: 'images/look-largo.webp', cap: 'Ondas largas para evento', alt: 'Peinado de ondas largas para un evento' },
};

const TRABAJOS = [
  { img: 'images/look-corte.webp', nombre: 'Corte recto', dato: '45 min', alt: 'Corte recto con flequillo' },
  { img: 'images/look-color.webp', nombre: 'Color completo', dato: '2 h 30', alt: 'Color completo en tono claro' },
  { img: 'images/corte.webp', nombre: 'Corte masculino', dato: '45 min', alt: 'Corte masculino con tijera' },
  { img: 'images/textura.webp', nombre: 'Rizos definidos', dato: '1 h', alt: 'Cabello rizado con textura definida' },
  { img: 'images/look-largo.webp', nombre: 'Ondas de evento', dato: '1 h', alt: 'Ondas largas peinadas para un evento' },
  { img: 'images/tratamiento.webp', nombre: 'Nutrición', dato: '1 h', alt: 'Aplicación de tratamiento de nutrición' },
  { img: 'images/lavado.webp', nombre: 'Lavado y masaje', dato: '15 min', alt: 'Lavado de cabello en la bacha del salón' },
  { img: 'images/tijeras.webp', nombre: 'Puntas', dato: '30 min', alt: 'Tijeras de peluquería y recortes de pelo' },
];

const FRASES = {
  corte: 'quiero un corte',
  color: 'quiero color',
  tratamiento: 'quiero un tratamiento',
  peinado: 'quiero un peinado',
  retoque: 'algo simple, un retoque',
  cambio: 'un cambio real',
  desdecero: 'algo nuevo de cero',
};

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');

function showToast(msg) {
  let wrap = document.querySelector('.toast-wrap');
  if (!wrap) { wrap = document.createElement('div'); wrap.className = 'toast-wrap'; wrap.setAttribute('aria-live', 'polite'); document.body.appendChild(wrap); }
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  toast.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg><span>${esc(msg)}</span>`;
  wrap.appendChild(toast);
  setTimeout(() => { toast.classList.add('hiding'); setTimeout(() => toast.remove(), 220); }, 3200);
}

/* ---------- servicios ---------- */

function initServicios() {
  const cont = document.getElementById('serv-lista');
  if (!cont) return;
  cont.innerHTML = SERVICIOS.map(s => `<li class="serv" data-animate="linea" style="opacity:0">
    <div class="serv-in">
      <h3 class="serv-nombre">${esc(s.nombre)}</h3>
      <p class="serv-desc">${esc(s.desc)}</p>
      <p class="serv-dura">${esc(s.dura)}</p>
      <p class="serv-precio">desde ${formatearPrecio(s.precio)}</p>
    </div>
  </li>`).join('');
}

/* ---------- trabajos ---------- */

function initTrabajos() {
  const track = document.getElementById('rail-track');
  const vp = document.getElementById('rail-vp');
  if (!track || !vp) return;
  track.innerHTML = TRABAJOS.map(t => `<figure class="trabajo bn" data-animate="arco" style="opacity:0">
    <span class="trabajo-media"><img src="${t.img}" alt="${esc(t.alt)}" width="1200" height="1500" decoding="async"></span>
    <figcaption class="trabajo-pie"><b>${esc(t.nombre)}</b><span>${esc(t.dato)}</span></figcaption>
  </figure>`).join('');

  const prev = document.getElementById('rail-prev');
  const next = document.getElementById('rail-next');
  const paso = () => vp.clientWidth * 0.72;
  const sincronizar = () => {
    if (!prev || !next) return;
    const inicio = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
    prev.disabled = vp.scrollLeft <= inicio + 2;
    next.disabled = vp.scrollLeft >= vp.scrollWidth - vp.clientWidth - 2;
  };
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: 'smooth' }));
  vp.addEventListener('scroll', sincronizar, { passive: true });
  window.addEventListener('resize', sincronizar, { passive: true });
  sincronizar();

  vp.addEventListener('wheel', e => {
    if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
    const max = vp.scrollWidth - vp.clientWidth;
    const enBorde = (e.deltaY < 0 && vp.scrollLeft <= 0) || (e.deltaY > 0 && vp.scrollLeft >= max - 1);
    if (enBorde) return;
    e.preventDefault();
    vp.scrollLeft += e.deltaY;
  }, { passive: false });

  let down = false, moved = false, startX = 0, startScroll = 0, pointerId = null;
  const end = () => {
    if (!down) return;
    down = false;
    if (pointerId !== null) { try { vp.releasePointerCapture?.(pointerId); } catch { /* ya liberado */ } }
    pointerId = null;
    setTimeout(() => { vp.classList.remove('dragging'); moved = false; }, 0);
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
      try { vp.setPointerCapture?.(pointerId); } catch { /* sin capture el drag igual funciona */ }
    }
    vp.scrollLeft = startScroll - dx;
  });
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
  vp.addEventListener('pointerleave', end);
}

/* ---------- elegí tu cambio (bloque interactivo) ---------- */

function puntaje(servicio, sel) {
  return (servicio.perfil.includes(sel.servicio) ? 3 : 0) + (servicio.perfil.includes(sel.cambio) ? 2 : 0);
}

function initCambio() {
  const cont = document.getElementById('cambio');
  const otros = document.getElementById('cambio-otros');
  if (!cont || !otros) return;
  const img = document.getElementById('look-img');
  const cap = document.getElementById('look-cap');
  const elNombre = document.getElementById('ficha-nombre');
  const elDura = document.getElementById('ficha-dura');
  const elPrecio = document.getElementById('ficha-precio');
  const elDesc = document.getElementById('ficha-desc');
  const cta = document.getElementById('ficha-cta');
  const sel = { servicio: 'corte', cambio: 'retoque' };

  const pintar = () => {
    const look = LOOKS[sel.servicio];
    if (look && img && cap) { img.src = look.img; img.alt = look.alt; cap.textContent = look.cap; }

    const orden = [...SERVICIOS]
      .map(s => ({ s, n: puntaje(s, sel) }))
      .sort((a, b) => b.n - a.n || a.s.id - b.s.id);
    const gana = orden[0].s;

    if (elNombre) elNombre.textContent = gana.nombre;
    if (elDura) elDura.textContent = gana.dura;
    if (elPrecio) elPrecio.textContent = formatearPrecio(gana.precio);
    if (elDesc) elDesc.textContent = gana.desc;
    if (cta) {
      const texto = `Hola CHAPEAU, ${FRASES[sel.servicio]} y busco ${FRASES[sel.cambio]}. ¿Tienen turno para ${gana.nombre.toLowerCase()}?`;
      cta.href = `https://wa.me/${WSP}?text=${encodeURIComponent(texto)}`;
    }

    otros.innerHTML = orden.slice(1, 5).map(({ s }) =>
      `<li data-otro-id="${s.id}"><b>${esc(s.nombre)}</b><span>${esc(s.dura)} · desde ${formatearPrecio(s.precio)}</span></li>`
    ).join('');

    if (reduceMotion || !img) return;
    img.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 240, easing: 'cubic-bezier(0.23,1,0.32,1)' });
    otros.querySelectorAll('li').forEach((li, i) => li.animate(
      [{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }],
      { duration: 220, delay: i * 40, easing: 'cubic-bezier(0.23,1,0.32,1)' }
    ));
  };

  cont.querySelectorAll('.bi-chip').forEach(chip => chip.addEventListener('click', () => {
    const q = chip.closest('.bi-q');
    const key = q.dataset.key;
    if (sel[key] === chip.dataset.val) return;
    q.querySelectorAll('.bi-chip').forEach(c => c.setAttribute('aria-pressed', 'false'));
    chip.setAttribute('aria-pressed', 'true');
    sel[key] = chip.dataset.val;
    pintar();
  }));

  pintar();
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
}

/* ---------- nav ---------- */

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
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open');
    nav.setAttribute('inert', '');
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
  nav.addEventListener('keydown', e => {
    if (e.key !== 'Tab' || !nav.classList.contains('open')) return;
    const focos = nav.querySelectorAll('button, a[href]');
    if (!focos.length) return;
    const primero = focos[0], ultimo = focos[focos.length - 1];
    if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
    else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
  });
}

function initWspFloat() {
  const btn = document.getElementById('wsp-float');
  if (!btn) return;
  const sync = () => btn.classList.toggle('visible', window.scrollY > 600);
  window.addEventListener('scroll', sync, { passive: true });
  sync();
}

/* ---------- devolución de demo ---------- */

const GKY_SLUG_ACENTOS = { 'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u', 'ñ': 'n', 'ü': 'u' };
function gkySlugify(s) {
  return String(s || '').toLowerCase()
    .replace(/[áéíóúñü]/g, c => GKY_SLUG_ACENTOS[c] || c)
    .replace(/[^a-z0-9]/g, '');
}

function initFeedbackFloat() {
  const GKY_FEEDBACK_WHATSAPP = '5491125068578';
  const btn = document.getElementById('feedback-float');
  const backdrop = document.getElementById('feedback-modal-backdrop');
  const closeBtn = document.getElementById('feedback-modal-close');
  const starsWrap = document.getElementById('feedback-stars');
  const coloresEl = document.getElementById('feedback-colores');
  const contenidoEl = document.getElementById('feedback-contenido');
  const otrosEl = document.getElementById('feedback-otros');
  const submitBtn = document.getElementById('feedback-submit');
  if (!btn || !backdrop) return;

  const stars = [...starsWrap.querySelectorAll('.feedback-star')];
  let rating = 0;
  const paintStars = n => stars.forEach((s, i) => {
    s.classList.toggle('active', i < n);
    s.setAttribute('aria-pressed', i < n ? 'true' : 'false');
  });
  stars.forEach((s, i) => {
    s.addEventListener('click', () => { rating = i + 1; paintStars(rating); });
    s.addEventListener('mouseenter', () => paintStars(i + 1));
  });
  starsWrap.addEventListener('mouseleave', () => paintStars(rating));

  const open = () => {
    backdrop.hidden = false;
    document.body.classList.add('no-scroll');
    (stars[0] || coloresEl)?.focus();
  };
  const close = () => {
    backdrop.hidden = true;
    document.body.classList.remove('no-scroll');
    btn.focus();
  };
  btn.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  backdrop.addEventListener('click', e => { if (e.target === backdrop) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !backdrop.hidden) close(); });

  submitBtn.addEventListener('click', () => {
    const colores = coloresEl.value.trim();
    const contenido = contenidoEl.value.trim();
    const otrosTxt = otrosEl.value.trim();
    if (!rating && !colores && !contenido && !otrosTxt) { coloresEl.focus(); return; }

    const slugUrl = (location.pathname.match(/\/demo\/([^/]+)/) || [])[1] || document.title;
    const slug = gkySlugify(slugUrl);
    const negocio = (document.title.split(/\s[—|]\s|\s-\s/)[0] || document.title || '').trim();
    const estrellas = rating ? '★'.repeat(rating) + '☆'.repeat(5 - rating) + ` (${rating}/5)` : 'Sin calificar';
    const lineas = [
      `Devolución de la demo${negocio ? ' — ' + negocio : ''}`,
      `Calificación: ${estrellas}`,
      colores ? `Colores: ${colores}` : null,
      contenido ? `Contenido: ${contenido}` : null,
      otrosTxt ? `Otros: ${otrosTxt}` : null,
      location.href,
    ].filter(Boolean);

    window.open(`https://wa.me/${GKY_FEEDBACK_WHATSAPP}?text=${encodeURIComponent(lineas.join('\n'))}`, '_blank', 'noopener');
    window.__gkySendResena?.({ slug, negocio, rating: rating || null, colores, contenido, otros: otrosTxt, url: location.href })
      ?.catch(err => console.warn('No se pudo guardar la devolución en Firestore:', err));

    if (typeof showToast === 'function') showToast('¡Gracias por tu devolución!'); else window.alert('¡Gracias por tu devolución!');
    close();
    rating = 0; paintStars(0); coloresEl.value = ''; contenidoEl.value = ''; otrosEl.value = '';
  });

  if (reduceMotion) return;
  let hideTimer = null;
  window.addEventListener('scroll', () => {
    btn.classList.add('is-hidden');
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => btn.classList.remove('is-hidden'), 550);
  }, { passive: true });
}

/* ---------- reveals y movimiento ---------- */

function initReveals() {
  const items = document.querySelectorAll('[data-animate]');
  if (!items.length) return;
  document.querySelectorAll('[data-animate-stagger]').forEach(parent => {
    parent.querySelectorAll('[data-animate]').forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i * 0.1, 0.6)}s`;
    });
  });
  document.querySelectorAll('.hero-h1 .hero-word').forEach((el, i) => {
    el.querySelector('span').style.transitionDelay = `${i * 0.09}s`;
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

function initLectura() {
  const el = document.querySelector('[data-lee]');
  if (!el) return;
  const palabras = el.textContent.trim().split(/\s+/);
  el.innerHTML = palabras.map(p => `<span class="w">${esc(p)}</span>`).join(' ');
  const spans = [...el.querySelectorAll('.w')];
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    spans.forEach(s => s.classList.add('on'));
    return;
  }
  ScrollTrigger.create({
    trigger: el,
    start: 'top 80%',
    end: 'bottom 48%',
    scrub: true,
    invalidateOnRefresh: true,
    onUpdate: self => {
      const corte = Math.round(self.progress * spans.length);
      spans.forEach((s, i) => s.classList.toggle('on', i < corte));
    },
  });
}

function initParallaxWordmark() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  const el = document.querySelector('.wordmark-hero');
  if (el) {
    gsap.fromTo(el, { yPercent: 0 }, {
      yPercent: -16, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .6, invalidateOnRefresh: true },
    });
  }
}

function initHero() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const foto = document.querySelector('.hero-foto img');
  if (foto) gsap.fromTo(foto, { scale: 1.09 }, { scale: 1, duration: 1.3, ease: 'power2.out' });
}

/* ---------- arranque ---------- */

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}
if (typeof gsap === 'undefined') {
  document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
}
if (typeof ScrollTrigger !== 'undefined') {
  window.addEventListener('load', () => ScrollTrigger.refresh());
}

initServicios();
initTrabajos();
initCambio();
initReveals();
initNav();
initWspFloat();
initLectura();
initParallaxWordmark();
initHero();
initFeedbackFloat();

const anio = document.getElementById('anio');
if (anio) anio.textContent = new Date().getFullYear();
