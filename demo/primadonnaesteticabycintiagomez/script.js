const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5491144096246';
const LUGAR = [-34.56750608, -58.73422049];
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

function initTabs() {
  const lista = document.querySelector('.tabs__lista');
  if (!lista) return;
  const tabs = [...lista.querySelectorAll('[role="tab"]')];
  const elegir = (tab, enfocar) => {
    tabs.forEach(t => {
      const activo = t === tab;
      t.setAttribute('aria-selected', activo ? 'true' : 'false');
      t.tabIndex = activo ? 0 : -1;
      const panel = document.getElementById(t.getAttribute('aria-controls'));
      if (!panel) return;
      panel.hidden = !activo;
      if (activo && !reduceMotion) {
        panel.classList.remove('entra');
        void panel.offsetWidth;
        panel.classList.add('entra');
      }
    });
    if (enfocar) tab.focus({ preventScroll: true });
    if (lista.scrollWidth > lista.clientWidth + 2) {
      const izq = tab.offsetLeft - (lista.clientWidth - tab.offsetWidth) / 2;
      lista.scrollTo({ left: Math.max(0, izq), behavior: reduceMotion ? 'auto' : 'smooth' });
    }
    refrescar();
  };
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => elegir(tab, false));
    tab.addEventListener('keydown', e => {
      let j = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') j = (i + 1) % tabs.length;
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') j = (i - 1 + tabs.length) % tabs.length;
      else if (e.key === 'Home') j = 0;
      else if (e.key === 'End') j = tabs.length - 1;
      if (j === null) return;
      e.preventDefault();
      elegir(tabs[j], true);
    });
  });
}

function initDetalles() {
  document.querySelectorAll('details').forEach(d => d.addEventListener('toggle', refrescar));
}

function armarMensaje({ tratamiento, nombre, franja, nota }) {
  let msg = `Hola! Soy ${nombre}. Quiero pedir un turno para ${tratamiento}.`;
  msg += franja === 'en cualquier horario' ? ' Me sirve cualquier horario.' : ` Me queda mejor ${franja}.`;
  if (nota) msg += ` ${nota}`;
  msg += ' ¿Qué días tienen disponibles?';
  return msg;
}

function initPedido() {
  const form = document.getElementById('pedido');
  if (!form) return;
  const trat = form.elements.tratamiento;
  const nombre = form.elements.nombre;
  const nota = form.elements.nota;
  const enviar = form.querySelector('.pedido__enviar');

  const marcar = (campo, id, msg) => {
    const p = document.getElementById(id);
    if (p) { p.textContent = msg || ''; p.hidden = !msg; }
    campo.setAttribute('aria-invalid', msg ? 'true' : 'false');
    campo.closest('.campo')?.classList.toggle('error', Boolean(msg));
  };

  trat.addEventListener('change', () => marcar(trat, 'err-trat', ''));
  nombre.addEventListener('input', () => marcar(nombre, 'err-nombre', ''));

  form.addEventListener('submit', e => {
    e.preventDefault();
    const quien = nombre.value.trim();
    let primero = null;
    if (!trat.value) { marcar(trat, 'err-trat', 'Elegí qué tratamiento te interesa.'); primero = trat; }
    if (quien.length < 2) { marcar(nombre, 'err-nombre', 'Contanos tu nombre así sabemos a quién responderle.'); primero = primero || nombre; }
    if (primero) {
      primero.focus();
      showToast('Te falta un dato para armar el pedido.');
      return;
    }
    const franja = form.querySelector('input[name="franja"]:checked')?.value || 'en cualquier horario';
    const msg = armarMensaje({ tratamiento: trat.value, nombre: quien, franja, nota: nota.value.trim() });
    enviar.disabled = true;
    window.open(wspHref(msg), '_blank', 'noopener');
    showToast('Te abrimos WhatsApp con tu pedido listo para enviar.');
    setTimeout(() => {
      enviar.disabled = false;
      form.reset();
    }, 800);
  });
}

function initMapa() {
  const el = document.getElementById('mapa');
  if (!el) return;
  const destino = `https://www.google.com/maps/dir/?api=1&destination=${LUGAR[0]},${LUGAR[1]}`;
  if (typeof L === 'undefined') {
    el.innerHTML = `<p class="mapa__fallback"><a class="link-sub" href="${destino}" target="_blank" rel="noopener">Ver cómo llegar a Cnel. Charlone 4220</a></p>`;
    return;
  }
  const mapa = L.map(el, { scrollWheelZoom: false, zoomControl: true, attributionControl: false });
  L.control.attribution({ position: el.closest('.contacto--m2') ? 'topright' : 'bottomright', prefix: '<a href="https://leafletjs.com" target="_blank" rel="noopener">Leaflet</a>' }).addTo(mapa);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap',
    maxZoom: 19
  }).addTo(mapa);
  const icono = L.divIcon({
    className: '',
    html: '<span class="mapa-pin"><svg class="estrella" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2c.6 6.4 3.6 9.4 10 10c-6.4.6-9.4 3.6-10 10c-.6-6.4-3.6-9.4-10-10c6.4-.6 9.4-3.6 10-10z"/></svg></span>',
    iconSize: [46, 46],
    iconAnchor: [23, 23],
    popupAnchor: [0, -26]
  });
  const ubicar = () => {
    mapa.setView(LUGAR, 16, { animate: false });
    const ancho = el.getBoundingClientRect().width;
    if (el.closest('.contacto--m2') && window.matchMedia('(min-width: 901px)').matches) {
      mapa.panBy([-Math.min(260, ancho * 0.22), 0], { animate: false });
    }
  };
  ubicar();
  L.marker(LUGAR, { icon: icono, keyboard: true, title: 'Primadonna Estética' })
    .addTo(mapa)
    .bindPopup(`<strong>Primadonna Estética</strong>Cnel. Charlone 4220, Santa María<br><a href="${destino}" target="_blank" rel="noopener">Cómo llegar</a>`);
  let t = 0;
  window.addEventListener('resize', () => {
    clearTimeout(t);
    t = setTimeout(() => { mapa.invalidateSize(); ubicar(); }, 200);
  }, { passive: true });
  window.addEventListener('load', () => { mapa.invalidateSize(); ubicar(); });
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

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const paso = (sel, vars, t) => {
    const els = hero.querySelectorAll(sel);
    if (els.length) tl.from(els, vars, t);
  };
  paso('[data-hero-img]', { scale: 1.08, duration: 1.8 }, 0);
  paso('.hero__aro', { opacity: 0, duration: 1.4, clearProps: 'opacity' }, 0.25);
  paso('.hero-eyebrow', { y: 16, opacity: 0, duration: 0.9 }, 0.1);
  const h1 = hero.querySelector('h1');
  if (h1) {
    tl.fromTo(h1, { clipPath: 'inset(0% 100% -12% 0%)', y: 10 }, { clipPath: 'inset(0% 0% -12% 0%)', y: 0, duration: 1.3, ease: 'power3.inOut', clearProps: 'clipPath,transform' }, 0.15);
  }
  paso('.hero-lead', { y: 22, opacity: 0, duration: 1 }, 0.5);
  paso('.hero-ctas .btn', { y: 18, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.62);
  paso('.hero__sello, .hero-ficha', { scale: 0.92, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.6);
  const aros = hero.querySelectorAll('.sello__aro circle');
  if (aros.length) tl.fromTo(aros, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut' }, 0.75);
  paso('.hero-ficha__datos li', { y: 12, opacity: 0, duration: 0.7, stagger: 0.08, clearProps: 'transform,opacity' }, 0.85);
}

[initWspLinks, initModelBarScroll, initWspFloat, initNav, initTabs, initDetalles, initPedido, initMapa, initReveals, initHeroMotion].forEach(fn => {
  try { fn(); } catch (e) { console.error(e); }
});
