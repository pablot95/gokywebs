document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) e.preventDefault();
});
function initDevToolsGuard() {
  let overlay = null, open = false;
  window.setInterval(() => {
    const isOpen = window.outerWidth - window.innerWidth > 200 || window.outerHeight - window.innerHeight > 200;
    if (isOpen === open) return;
    open = isOpen;
    if (open) {
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'devtools-overlay';
        overlay.innerHTML = '<p>Contenido protegido.</p>';
        document.body.appendChild(overlay);
      }
      overlay.classList.add('visible');
    } else if (overlay) overlay.classList.remove('visible');
  }, 800);
}

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const norm = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = c => c.descuento > 0 ? Math.round(c.precio * (1 - c.descuento / 100)) : c.precio;
const getCurso = id => CURSOS.find(c => c.id === id);
const getCursoSlug = slug => CURSOS.find(c => c.slug === slug);
const getDocente = id => DOCENTES.find(d => d.id === id);
const allLessons = c => c.modulos.flatMap(m => m.clases);
const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const HAS_GSAP = () => typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';

if (HAS_GSAP()) gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') {
  document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
}

const Cart = {
  KEY: 'estimulaciontemprana_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { localStorage.setItem(this.KEY, JSON.stringify(items)); document.dispatchEvent(new CustomEvent('cart:updated')); },
  has(id) { return this.get().includes(id); },
  add(id) { const items = this.get(); if (!items.includes(id)) { items.push(id); this.save(items); } },
  remove(id) { this.save(this.get().filter(x => x !== id)); },
  clear() { this.save([]); },
  count() { return this.get().length; },
  total() { return this.get().reduce((s, id) => { const c = getCurso(id); return c ? s + precioFinal(c) : s; }, 0); },
  ahorro() { return this.get().reduce((s, id) => { const c = getCurso(id); return c && c.descuento > 0 ? s + (c.precio - precioFinal(c)) : s; }, 0); }
};

function showToast(msg) {
  let wrap = document.querySelector('.toast-wrap');
  if (!wrap) {
    wrap = document.createElement('div');
    wrap.className = 'toast-wrap';
    wrap.setAttribute('aria-live', 'polite');
    document.body.appendChild(wrap);
  }
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

function trapFocus(container, e) {
  const focusables = container.querySelectorAll('a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])');
  if (!focusables.length) return;
  const first = focusables[0], last = focusables[focusables.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

function mensajeInscripcion(ids) {
  const lineas = ids.map(id => { const c = getCurso(id); return c ? `• ${c.titulo} (${formatearPrecio(precioFinal(c))})` : ''; }).filter(Boolean);
  return `Hola Lorena, quiero inscribirme en:\n${lineas.join('\n')}\nTotal: ${formatearPrecio(Cart.total())}`;
}

let drawerTrigger = null;
function buildDrawer() {
  const wrap = document.createElement('div');
  wrap.id = 'cart-root';
  wrap.innerHTML = `
    <div class="drawer-overlay" id="drawer-overlay" hidden></div>
    <aside class="cart-drawer" id="cart-drawer" role="dialog" aria-modal="true" aria-label="Cursos elegidos" hidden>
      <div class="cart-head"><h2>Tu inscripción</h2><button type="button" class="icon-btn" id="cart-close" aria-label="Cerrar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg></button></div>
      <div class="cart-body" id="cart-body"></div>
      <div class="cart-foot" id="cart-foot"></div>
    </aside>`;
  document.body.appendChild(wrap);
  document.getElementById('cart-close').addEventListener('click', closeDrawer);
  document.getElementById('drawer-overlay').addEventListener('click', closeDrawer);
  document.addEventListener('keydown', e => {
    const drawer = document.getElementById('cart-drawer');
    if (!drawer || drawer.hidden) return;
    if (e.key === 'Escape') closeDrawer();
    if (e.key === 'Tab') trapFocus(drawer, e);
  });
}

function renderDrawer(success = false) {
  const body = document.getElementById('cart-body');
  const foot = document.getElementById('cart-foot');
  if (!body) return;
  const items = Cart.get();
  if (success) {
    body.innerHTML = `<div class="cart-empty"><span class="ring-badge" aria-hidden="true">♪</span><h3>Te escribo por WhatsApp</h3><p>Ya se abrió el chat con el detalle de tu inscripción. Ahí coordinamos la forma de pago y te mando el acceso a las clases.</p><button type="button" class="btn btn-primary" id="cart-back">Seguir mirando cursos</button></div>`;
    foot.innerHTML = '';
    document.getElementById('cart-back')?.addEventListener('click', closeDrawer);
    return;
  }
  if (!items.length) {
    body.innerHTML = `<div class="cart-empty"><svg class="cart-empty-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7.2 14.6h10.9c.8 0 1.5-.5 1.8-1.2l2.9-6.9c.3-.7-.2-1.5-1-1.5H6.1l-.8-2.2C5.1 2.3 4.6 2 4.1 2H1.9C1.4 2 1 2.4 1 2.9s.4.9.9.9h1.6l3.3 9.2-1.2 2.2c-.6 1.2.2 2.6 1.6 2.6h12c.5 0 .9-.4.9-.9s-.4-.9-.9-.9H7.5l.9-1.6c-.4.1-.8.2-1.2.2z"/><circle cx="8.5" cy="20.5" r="1.8"/><circle cx="17.5" cy="20.5" r="1.8"/></svg><h3>Todavía no elegiste ningún curso</h3><p>Mirá el programa de cada uno: te va a quedar claro cuál te sirve hoy.</p><button type="button" class="btn btn-primary" id="cart-ver">Ver los cursos</button></div>`;
    foot.innerHTML = '';
    document.getElementById('cart-ver')?.addEventListener('click', () => {
      closeDrawer();
      document.getElementById('cursos')?.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth' });
    });
    return;
  }
  body.innerHTML = items.map(id => {
    const c = getCurso(id);
    if (!c) return '';
    const final = precioFinal(c);
    return `<article class="cart-item"><img src="${c.portada}" alt="Portada de ${esc(c.titulo)}" width="96" height="72" loading="lazy" decoding="async"><div class="cart-item-info"><span class="cart-item-cat">${esc(c.categoria)} · ${esc(c.modalidad)}</span><h3>${esc(c.titulo)}</h3><p class="cart-item-price">${formatearPrecio(final)}${c.descuento > 0 ? ` <s>${formatearPrecio(c.precio)}</s>` : ''}</p></div><button type="button" class="icon-btn cart-remove" data-remove="${c.id}" aria-label="Quitar ${esc(c.titulo)}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg></button></article>`;
  }).join('');
  const ahorro = Cart.ahorro();
  foot.innerHTML = `${ahorro > 0 ? `<p class="cart-save">Estás ahorrando ${formatearPrecio(ahorro)}</p>` : ''}<div class="cart-total"><span>Total</span><strong>${formatearPrecio(Cart.total())}</strong></div><a class="btn btn-primary btn-block" id="cart-checkout" href="https://wa.me/${WHATSAPP}?text=${encodeURIComponent(mensajeInscripcion(items))}" target="_blank" rel="noopener">Coordinar mi inscripción</a><p class="cart-note">Se abre WhatsApp con el detalle. El pago online se activa al pasar la plataforma a producción.</p>`;
  body.querySelectorAll('[data-remove]').forEach(b => b.addEventListener('click', () => { Cart.remove(b.dataset.remove); renderDrawer(); }));
  document.getElementById('cart-checkout')?.addEventListener('click', () => {
    Cart.clear();
    renderDrawer(true);
    showToast('¡Listo! Seguimos por WhatsApp');
  });
}

function openDrawer(trigger) {
  drawerTrigger = trigger || null;
  renderDrawer();
  document.getElementById('drawer-overlay').hidden = false;
  const drawer = document.getElementById('cart-drawer');
  drawer.hidden = false;
  requestAnimationFrame(() => document.body.classList.add('drawer-open'));
  document.body.style.overflow = 'hidden';
  const closeBtn = document.getElementById('cart-close');
  if (closeBtn) closeBtn.focus();
}

function closeDrawer() {
  document.body.classList.remove('drawer-open');
  if (!document.body.classList.contains('modal-open')) document.body.style.overflow = '';
  setTimeout(() => {
    document.getElementById('cart-drawer').hidden = true;
    document.getElementById('drawer-overlay').hidden = true;
  }, 340);
  if (drawerTrigger) { drawerTrigger.focus(); drawerTrigger = null; }
}

function updateCartBadge() {
  document.querySelectorAll('.cart-badge').forEach(b => {
    const n = Cart.count();
    b.textContent = n;
    b.classList.toggle('show', n > 0);
    if (n > 0) { b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump'); }
  });
}

function addCurso(id, opts = {}) {
  const c = getCurso(id);
  if (!c) return;
  if (Cart.has(id)) {
    if (opts.open) openDrawer(opts.trigger); else showToast('Ya lo tenés en tu inscripción');
    return;
  }
  Cart.add(id);
  if (opts.open) openDrawer(opts.trigger); else showToast('¡Sumado! Tu inscripción te espera');
}

function initMenu() {
  const toggle = document.getElementById('menu-toggle');
  const nav = document.getElementById('site-nav');
  if (!toggle || !nav) return;
  const close = () => { nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); document.body.style.overflow = ''; };
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) nav.querySelector('a')?.focus();
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); }
  });
}

function initHeader() {
  document.querySelectorAll('.cart-open').forEach(btn => btn.addEventListener('click', () => openDrawer(btn)));
  document.addEventListener('cart:updated', updateCartBadge);
  updateCartBadge();
}

function revelar(el) {
  el.style.opacity = 1;
  el.style.transform = 'none';
  el.classList.add('in');
}

function initReveals() {
  const els = Array.from(document.querySelectorAll('[data-animate]:not(.in)'));
  const imgs = Array.from(document.querySelectorAll('.img-reveal:not(.in)'));
  if (REDUCED || !('IntersectionObserver' in window) || !window.innerHeight) {
    els.forEach(revelar);
    imgs.forEach(el => el.classList.add('in'));
    return;
  }
  imgs.forEach(el => el.classList.add('masked'));
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target;
      const delay = parseFloat(el.dataset.delay || 0);
      setTimeout(() => el.classList.add('in'), delay);
      io.unobserve(el);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  els.forEach(el => io.observe(el));
  imgs.forEach(el => io.observe(el));

  setTimeout(() => {
    [...els, ...imgs].forEach(el => {
      if (el.classList.contains('in')) return;
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) {
        io.unobserve(el);
        if (el.classList.contains('img-reveal')) el.classList.add('in'); else revelar(el);
      }
    });
  }, 2500);
}

function initMagnetic() {
  if (REDUCED || !window.matchMedia('(pointer:fine)').matches) return;
  document.querySelectorAll('.btn-magnetic').forEach(btn => {
    btn.addEventListener('pointermove', e => {
      const r = btn.getBoundingClientRect();
      btn.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .22}px, ${(e.clientY - r.top - r.height / 2) * .34}px)`;
    });
    btn.addEventListener('pointerleave', () => { btn.style.transform = ''; });
  });
}

function initHeroScene() {
  const photo = document.querySelector('.hero-photo');
  if (photo && !REDUCED) {
    photo.classList.add('masked');
    requestAnimationFrame(() => requestAnimationFrame(() => photo.classList.add('in')));
    setTimeout(() => photo.classList.add('reveal-failsafe'), 1600);
  }
  const scene = document.getElementById('hero-scene');
  if (!scene || REDUCED || !window.matchMedia('(pointer:fine)').matches) return;
  const layers = Array.from(scene.querySelectorAll('.layer'));
  scene.addEventListener('pointermove', e => {
    const r = scene.getBoundingClientRect();
    const dx = (e.clientX - r.left - r.width / 2) / r.width;
    const dy = (e.clientY - r.top - r.height / 2) / r.height;
    layers.forEach(l => {
      const d = parseFloat(l.dataset.depth || 1) * 7;
      l.style.translate = `${(dx * d).toFixed(1)}px ${(dy * d).toFixed(1)}px`;
    });
  });
  scene.addEventListener('pointerleave', () => layers.forEach(l => { l.style.translate = ''; }));
}

function initContadores() {
  const nums = document.querySelectorAll('[data-count]');
  if (!nums.length) return;
  if (REDUCED || !('IntersectionObserver' in window)) {
    nums.forEach(n => { n.textContent = Number(n.dataset.count).toLocaleString('es-AR'); });
    return;
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target;
      io.unobserve(el);
      const target = Number(el.dataset.count);
      const dur = 1300;
      const t0 = performance.now();
      const step = now => {
        const p = Math.min(1, (now - t0) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased).toLocaleString('es-AR');
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }, { threshold: 0.5 });
  nums.forEach(n => { n.textContent = '0'; io.observe(n); });
}

/* Firma de movimiento: la canción que acuna */
function initNana() {
  const pin = document.getElementById('nana-pin');
  const waveEl = document.getElementById('nana-wave');
  const headEl = document.getElementById('nana-playhead');
  const timeEl = document.getElementById('nana-time');
  const outro = document.getElementById('nana-outro');
  if (!pin || !waveEl) return;

  const N = window.matchMedia('(max-width: 720px)').matches ? 30 : 54;
  const marks = [Math.round(N * .1), Math.round(N * .36), Math.round(N * .62), Math.round(N * .86)];
  const bars = [];
  const frag = document.createDocumentFragment();
  for (let i = 0; i < N; i++) {
    const t = i / (N - 1);
    const envolvente = 1 - Math.pow(t, 1.7);
    const textura = .38 + .62 * Math.abs(Math.sin(i * 1.93)) * (.55 + .45 * Math.abs(Math.cos(i * .71)));
    const h = Math.max(6, Math.round((.1 + envolvente * textura * .9) * 100));
    const bar = document.createElement('i');
    bar.style.setProperty('--h', h);
    if (marks.includes(i)) bar.classList.add('is-mark');
    frag.appendChild(bar);
    bars.push(bar);
  }
  waveEl.appendChild(frag);

  const steps = Array.from(pin.querySelectorAll('.nana-step'));
  const TOTAL_SEG = 192;
  const fmt = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

  const apply = p => {
    const played = p * N;
    const calma = p > .84 ? Math.min(1, (p - .84) / .16) : 0;
    bars.forEach((bar, i) => {
      const local = Math.min(1, Math.max(0, played - i));
      const eased = 1 - Math.pow(1 - local, 2);
      const escala = (.05 + .95 * eased) * (1 - .78 * calma);
      bar.style.transform = `scaleY(${escala.toFixed(3)})`;
      bar.classList.toggle('is-played', local > .25);
    });
    if (headEl) headEl.style.transform = `translateX(${(p * waveEl.offsetWidth).toFixed(1)}px)`;
    if (timeEl) timeEl.textContent = fmt(p * TOTAL_SEG);
    const activo = Math.min(steps.length - 1, Math.floor(p * steps.length));
    steps.forEach((s, i) => s.classList.toggle('is-on', i === activo));
    if (outro) outro.classList.toggle('is-on', p > .9);
  };

  const estatico = () => {
    pin.classList.add('is-static');
    bars.forEach(bar => { bar.style.transform = 'scaleY(1)'; bar.classList.add('is-played'); });
    steps.forEach(s => s.classList.add('is-on'));
    if (timeEl) timeEl.textContent = fmt(TOTAL_SEG);
  };

  if (REDUCED || !HAS_GSAP()) { estatico(); return; }

  const mm = gsap.matchMedia();
  mm.add('(min-width: 981px)', () => {
    pin.classList.remove('is-static');
    const st = ScrollTrigger.create({
      trigger: pin,
      start: 'top top',
      end: '+=190%',
      pin: true,
      scrub: .55,
      onUpdate: self => apply(self.progress),
      onToggle: self => pin.classList.toggle('is-playing', self.isActive)
    });
    apply(0);
    return () => { st.kill(); estatico(); };
  });
  mm.add('(max-width: 980px)', () => { estatico(); });
}

function docenteAvatar(d, size) {
  const cls = size > 40 ? 'docente-avatar' : 'doc-inicial';
  return `<span class="${cls}" aria-hidden="true">${esc(d?.inicial || 'E')}</span>`;
}

function cursoCard(c) {
  const d = getDocente(c.docenteId);
  const final = precioFinal(c);
  const badge = c.modalidad === 'En vivo'
    ? '<span class="badge badge-live">En vivo</span>'
    : (c.nuevo ? '<span class="badge badge-nuevo">Nuevo</span>' : (c.destacado ? '<span class="badge">Más elegido</span>' : ''));
  return `
  <article class="curso-card" data-animate="up" style="transform:translateY(36px);opacity:0">
    <button type="button" class="curso-card-media" data-quick="${c.id}" aria-label="Ver el programa del curso ${esc(c.titulo)}">
      <img src="${c.portada}" alt="Portada del curso ${esc(c.titulo)}" width="1400" height="1050" loading="lazy" decoding="async">
      ${badge}${c.descuento > 0 ? `<span class="badge badge-desc">-${c.descuento}%</span>` : ''}
    </button>
    <div class="curso-card-body">
      <span class="curso-card-cat">${esc(c.categoria)} · ${esc(c.nivel)}</span>
      <h3><button type="button" class="curso-card-title" data-quick="${c.id}">${esc(c.titulo)}</button></h3>
      <p class="curso-card-doc">${docenteAvatar(d, 26)}${esc(d?.nombre || '')}</p>
      <ul class="curso-card-meta"><li>${esc(c.duracion)}</li><li>${c.cantidadClases} clases</li><li>${esc(c.modalidad)}</li></ul>
      <div class="curso-card-foot">
        <p class="curso-card-price">${formatearPrecio(final)}${c.descuento > 0 ? ` <s>${formatearPrecio(c.precio)}</s>` : ''}</p>
        <div class="curso-card-actions"><button type="button" class="btn btn-ghost btn-sm" data-quick="${c.id}">Ver programa</button><button type="button" class="btn btn-primary btn-sm" data-add="${c.id}">Sumar</button></div>
      </div>
    </div>
  </article>`;
}

function lessonIcon(tipo) {
  if (tipo === 'video') return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M10 8l6 4-6 4V8z"/></svg>';
  if (tipo === 'pdf') return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>';
  if (tipo === 'audio') return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>';
  return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>';
}

/* Vista rápida del curso (modal) */
let quickTrigger = null;
function buildQuickView() {
  const wrap = document.createElement('div');
  wrap.id = 'quick-root';
  wrap.innerHTML = `
    <div class="quick-overlay" id="quick-overlay" hidden></div>
    <div class="quick-modal" id="quick-modal" role="dialog" aria-modal="true" aria-labelledby="quick-title" hidden>
      <button type="button" class="icon-btn quick-close" id="quick-close" aria-label="Cerrar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
      <div class="quick-body" id="quick-body"></div>
    </div>`;
  document.body.appendChild(wrap);
  document.getElementById('quick-close').addEventListener('click', closeQuickView);
  document.getElementById('quick-overlay').addEventListener('click', closeQuickView);
  document.addEventListener('keydown', e => {
    const modal = document.getElementById('quick-modal');
    if (!modal || modal.hidden) return;
    if (e.key === 'Escape') closeQuickView();
    if (e.key === 'Tab') trapFocus(modal, e);
  });
}

function openQuickView(id, trigger) {
  const c = getCurso(id);
  const body = document.getElementById('quick-body');
  if (!c || !body) return;
  quickTrigger = trigger || null;
  const d = getDocente(c.docenteId) || DOCENTES[0];
  const final = precioFinal(c);
  const enVivo = c.modalidad === 'En vivo';
  const yaEsta = Cart.has(c.id);

  body.innerHTML = `
    <div class="quick-media"><img src="${c.portada}" alt="Portada del curso ${esc(c.titulo)}" width="1400" height="1050" decoding="async"></div>
    <div class="quick-content">
      <p class="eyebrow">${esc(c.categoria)} · ${esc(c.nivel)} · ${esc(c.modalidad)}</p>
      <h2 id="quick-title">${esc(c.titulo)}</h2>
      <p class="quick-lead">${esc(c.descripcionCorta)}</p>
      <div class="quick-buy">
        <p class="quick-price">${formatearPrecio(final)}${c.descuento > 0 ? ` <s>${formatearPrecio(c.precio)}</s> <span class="badge badge-desc" style="position:static">-${c.descuento}%</span>` : ''}</p>
        <div class="quick-buy-actions">
          <button type="button" class="btn ${yaEsta ? 'btn-done' : 'btn-primary'}" data-add="${c.id}">${yaEsta ? '✓ Ya está en tu inscripción' : (enVivo ? 'Reservar mi lugar' : 'Sumar a mi inscripción')}</button>
          <a class="btn btn-ghost" href="https://wa.me/${WHATSAPP}?text=${encodeURIComponent('Hola Lorena, tengo una consulta sobre el curso ' + c.titulo)}" target="_blank" rel="noopener">Consultar</a>
        </div>
      </div>
      <ul class="quick-meta">
        <li><strong>${esc(c.duracion)}</strong> de contenido</li>
        <li><strong>${c.cantidadClases}</strong> clases en ${c.modulos.length} módulos</li>
        <li>${enVivo ? 'Encuentro <strong>en vivo</strong> + grabación' : 'Acceso <strong>sin vencimiento</strong>'}</li>
        <li>Certificado de finalización propio</li>
      </ul>
      <div class="quick-block">
        <h3>Qué vas a lograr</h3>
        <ul class="check-list">${c.resultados.map(r => `<li>${esc(r)}</li>`).join('')}</ul>
        <p class="quick-desc">${esc(c.descripcionCompleta)}</p>
      </div>
      <div class="quick-block">
        <h3>Programa</h3>
        <div class="programa">
          ${c.modulos.map((m, mi) => `<details class="modulo" ${mi === 0 ? 'open' : ''}><summary><span class="modulo-num">0${mi + 1}</span><span class="modulo-title">${esc(m.titulo)}</span><span class="modulo-count">${m.clases.length} clases</span><svg class="modulo-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg></summary><ul class="clase-list">${m.clases.map(l => `<li class="clase">${lessonIcon(l.tipo)}<span>${esc(l.titulo)}</span>${l.preview ? '<em class="tag-preview">Clase abierta</em>' : ''}<small>${esc(l.duracion)}</small></li>`).join('')}</ul></details>`).join('')}
        </div>
      </div>
      <div class="quick-cols">
        <div class="quick-block"><h3>Requisitos</h3><ul class="dot-list">${c.requisitos.map(r => `<li>${esc(r)}</li>`).join('')}</ul></div>
        <div class="quick-block"><h3>Qué incluye</h3><ul class="check-list">${c.incluye.map(r => `<li>${esc(r)}</li>`).join('')}</ul></div>
      </div>
      <div class="quick-block">
        <h3>Quién te acompaña</h3>
        <article class="docente-inline">${docenteAvatar(d, 84)}<div><h4>${esc(d.nombre)}</h4><p class="docente-rol">${esc(d.rol)}</p><p>${esc(d.bio)}</p></div></article>
      </div>
      <p class="quick-nota">Contenido educativo de crianza. No diagnostica, no trata y no reemplaza los controles de salud ni la evaluación de un profesional del desarrollo.</p>
    </div>`;

  body.querySelectorAll('[data-add]').forEach(b => b.addEventListener('click', () => {
    if (Cart.has(b.dataset.add)) return;
    addCurso(b.dataset.add);
    b.textContent = '✓ Ya está en tu inscripción';
    b.classList.remove('btn-primary');
    b.classList.add('btn-done');
  }));

  document.getElementById('quick-overlay').hidden = false;
  const modal = document.getElementById('quick-modal');
  modal.hidden = false;
  modal.scrollTop = 0;
  requestAnimationFrame(() => document.body.classList.add('modal-open'));
  document.body.style.overflow = 'hidden';
  document.getElementById('quick-close').focus();
}

function closeQuickView() {
  document.body.classList.remove('modal-open');
  if (!document.body.classList.contains('drawer-open')) document.body.style.overflow = '';
  setTimeout(() => {
    document.getElementById('quick-modal').hidden = true;
    document.getElementById('quick-overlay').hidden = true;
  }, 320);
  if (quickTrigger) { quickTrigger.focus(); quickTrigger = null; }
}

const PAGE_SIZE = 12;
function initCatalogo() {
  const grid = document.getElementById('cursos-grid');
  if (!grid) return;
  const input = document.getElementById('curso-search');
  const chipsWrap = document.getElementById('curso-chips');
  const selNivel = document.getElementById('curso-nivel');
  const selMod = document.getElementById('curso-modalidad');
  const selSort = document.getElementById('curso-sort');
  const count = document.getElementById('curso-count');
  const clearBtn = document.getElementById('curso-clear');
  const moreBtn = document.getElementById('curso-more');
  const form = document.getElementById('curso-search-form');
  let cat = 'todos', shown = PAGE_SIZE;
  const cats = [...new Set(CURSOS.map(c => c.categoria))];
  chipsWrap.innerHTML = '<button type="button" class="chip active" data-cat="todos" aria-pressed="true">Todas</button>'
    + cats.map(c => `<button type="button" class="chip" data-cat="${esc(c)}" aria-pressed="false">${esc(c)}</button>`).join('');

  const filtered = () => {
    const q = norm(input.value);
    const nivel = selNivel ? selNivel.value : '';
    const modal = selMod ? selMod.value : '';
    let list = CURSOS.filter(c => {
      if (cat !== 'todos' && c.categoria !== cat) return false;
      if (nivel && c.nivel !== nivel) return false;
      if (modal && c.modalidad !== modal) return false;
      if (!q) return true;
      const doc = getDocente(c.docenteId);
      const blob = norm([c.titulo, c.categoria, c.nivel, c.modalidad, c.descripcionCorta, doc?.nombre, ...(c.etiquetas || [])].join(' '));
      return q.split(/\s+/).every(w => blob.includes(w));
    });
    const sort = selSort ? selSort.value : 'relevancia';
    if (sort === 'precio-asc') list = list.slice().sort((a, b) => precioFinal(a) - precioFinal(b));
    else if (sort === 'precio-desc') list = list.slice().sort((a, b) => precioFinal(b) - precioFinal(a));
    else if (sort === 'nuevos') list = list.slice().sort((a, b) => (b.nuevo === true) - (a.nuevo === true));
    else list = list.slice().sort((a, b) => (b.destacado === true) - (a.destacado === true));
    return list;
  };

  const render = () => {
    const list = filtered();
    const q = norm(input.value);
    const activos = !!q || cat !== 'todos' || (selNivel && selNivel.value) || (selMod && selMod.value);
    count.textContent = list.length === 1 ? '1 curso' : `${list.length} cursos`;
    clearBtn.hidden = !activos;
    if (!list.length) {
      grid.innerHTML = `<div class="sin-resultados"><h3>No encontramos cursos con esos filtros</h3><p>Probá con otra palabra —sueño, canciones, berrinches— o quitá algún filtro. En total hay ${CURSOS.length} cursos.</p><button type="button" class="btn btn-ghost" id="sr-clear">Limpiar filtros</button></div>`;
      document.getElementById('sr-clear').addEventListener('click', resetFilters);
      if (moreBtn) moreBtn.hidden = true;
      if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
      return;
    }
    grid.innerHTML = list.slice(0, shown).map(cursoCard).join('');
    grid.querySelectorAll('[data-animate]').forEach((el, i) => {
      setTimeout(() => { el.classList.add('in'); }, 60 + i * 70);
    });
    grid.querySelectorAll('[data-add]').forEach(b => b.addEventListener('click', () => addCurso(b.dataset.add, { open: true, trigger: b })));
    grid.querySelectorAll('[data-quick]').forEach(b => b.addEventListener('click', () => openQuickView(b.dataset.quick, b)));
    if (moreBtn) moreBtn.hidden = list.length <= shown;
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  };

  const resetFilters = () => {
    input.value = ''; cat = 'todos'; shown = PAGE_SIZE;
    if (selNivel) selNivel.value = '';
    if (selMod) selMod.value = '';
    if (selSort) selSort.value = 'relevancia';
    chipsWrap.querySelectorAll('.chip').forEach(ch => {
      const on = ch.dataset.cat === 'todos';
      ch.classList.toggle('active', on);
      ch.setAttribute('aria-pressed', String(on));
    });
    render();
  };

  chipsWrap.querySelectorAll('.chip').forEach(ch => ch.addEventListener('click', () => {
    cat = ch.dataset.cat; shown = PAGE_SIZE;
    chipsWrap.querySelectorAll('.chip').forEach(x => {
      const on = x === ch;
      x.classList.toggle('active', on);
      x.setAttribute('aria-pressed', String(on));
    });
    render();
  }));
  input.addEventListener('input', () => { shown = PAGE_SIZE; render(); });
  if (form) form.addEventListener('submit', e => e.preventDefault());
  [selNivel, selMod, selSort].forEach(s => s && s.addEventListener('change', () => { shown = PAGE_SIZE; render(); }));
  clearBtn.addEventListener('click', resetFilters);
  if (moreBtn) moreBtn.addEventListener('click', () => { shown += PAGE_SIZE; render(); moreBtn.blur(); });

  const params = new URLSearchParams(location.search);
  const catParam = params.get('cat');
  if (catParam && cats.includes(catParam)) {
    cat = catParam;
    chipsWrap.querySelectorAll('.chip').forEach(x => {
      const on = x.dataset.cat === catParam;
      x.classList.toggle('active', on);
      x.setAttribute('aria-pressed', String(on));
    });
  }
  render();

  const cursoParam = params.get('curso');
  const target = cursoParam ? getCursoSlug(cursoParam) : null;
  if (target) setTimeout(() => openQuickView(target.id, null), 350);

  window.__setCatalogoCategoria = nombre => {
    const btn = chipsWrap.querySelector(`.chip[data-cat="${CSS.escape(nombre)}"]`);
    if (btn) btn.click();
  };
}

function initAsesorias() {
  const grid = document.getElementById('asesorias-grid');
  if (!grid) return;
  grid.innerHTML = ASESORIAS.map((a, i) => `
    <article class="asesoria-card" data-animate="up" data-delay="${i * 90}" style="transform:translateY(30px);opacity:0">
      <h3>${esc(a.titulo)}</h3>
      <p class="asesoria-dur">${esc(a.duracion)}</p>
      <p>${esc(a.detalle)}</p>
      <ul class="check-list">${a.incluye.map(x => `<li>${esc(x)}</li>`).join('')}</ul>
      <a class="btn btn-primary" href="https://wa.me/${WHATSAPP}?text=${encodeURIComponent('Hola Lorena, quiero coordinar: ' + a.titulo)}" target="_blank" rel="noopener">Coordinar por WhatsApp</a>
    </article>`).join('');
}

function initCursosSchema() {
  const ld = document.createElement('script');
  ld.type = 'application/ld+json';
  ld.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': CURSOS.map(c => ({
      '@type': 'Course',
      name: c.titulo,
      description: c.descripcionCorta,
      provider: { '@type': 'EducationalOrganization', name: MARCA },
      offers: { '@type': 'Offer', price: precioFinal(c), priceCurrency: 'ARS', category: c.categoria }
    }))
  });
  document.head.appendChild(ld);
}

document.addEventListener('DOMContentLoaded', () => {
  initDevToolsGuard();
  buildDrawer();
  buildQuickView();
  initHeader();
  initMenu();
  initWspFloat();
  initCatalogo();
  initAsesorias();
  initHeroScene();
  initNana();
  initContadores();
  initMagnetic();
  initCursosSchema();
  document.addEventListener('click', e => {
    const link = e.target.closest('.home-cat-link');
    if (link) {
      e.preventDefault();
      if (window.__setCatalogoCategoria) window.__setCatalogoCategoria(link.dataset.cat);
      document.getElementById('cursos').scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth' });
      return;
    }
    const quick = e.target.closest('[data-quick]');
    if (quick && !quick.closest('#cursos-grid') && !quick.closest('#quick-modal')) {
      openQuickView(quick.dataset.quick, quick);
    }
  });
  initReveals();
});

if (typeof ScrollTrigger !== 'undefined') {
  window.addEventListener('load', () => ScrollTrigger.refresh());
}
