const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5491136073049';
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

function initServicios() {
  const lista = document.querySelector('.serv-tabs');
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

function initRailDrag(rail) {
  let x0 = 0;
  let left0 = 0;
  let activo = false;
  let movio = false;
  rail.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'mouse' || e.button !== 0 || rail.scrollWidth <= rail.clientWidth + 2) return;
    activo = true;
    movio = false;
    x0 = e.clientX;
    left0 = rail.scrollLeft;
  });
  window.addEventListener('pointermove', e => {
    if (!activo) return;
    const dx = e.clientX - x0;
    if (!movio && Math.abs(dx) < 6) return;
    if (!movio) { movio = true; rail.classList.add('arrastrando'); }
    rail.scrollLeft = left0 - dx;
  });
  const soltar = () => {
    if (!activo) return;
    activo = false;
    if (movio) {
      rail.dataset.arrastrado = '1';
      rail.classList.remove('arrastrando');
      setTimeout(() => { delete rail.dataset.arrastrado; }, 60);
    }
  };
  window.addEventListener('pointerup', soltar);
  window.addEventListener('pointercancel', soltar);
  rail.addEventListener('click', e => {
    if (rail.dataset.arrastrado) { e.preventDefault(); e.stopPropagation(); }
  }, true);
}

function initGaleria() {
  const gal = document.getElementById('gal');
  if (!gal) return;
  const items = [...gal.querySelectorAll('.gal__item')];
  initRailDrag(gal);

  const prev = document.querySelector('.gal-nav__btn[data-dir="-1"]');
  const next = document.querySelector('.gal-nav__btn[data-dir="1"]');
  const flechas = () => {
    const max = gal.scrollWidth - gal.clientWidth;
    if (prev) prev.disabled = gal.scrollLeft <= 4;
    if (next) next.disabled = gal.scrollLeft >= max - 4;
  };
  document.querySelectorAll('.gal-nav__btn').forEach(b => b.addEventListener('click', () => {
    const paso = Math.max(240, gal.clientWidth * 0.7) * Number(b.dataset.dir);
    gal.scrollBy({ left: paso, behavior: reduceMotion ? 'auto' : 'smooth' });
  }));
  gal.addEventListener('scroll', flechas, { passive: true });
  window.addEventListener('resize', flechas, { passive: true });
  flechas();

  const visor = document.getElementById('visor');
  if (!visor) return;
  const img = visor.querySelector('.visor__img');
  const cap = visor.querySelector('.visor__cap');
  const num = visor.querySelector('.visor__n');
  const cerrarBtn = visor.querySelector('.visor__cerrar');
  let idx = 0;
  let previo = null;
  const pintar = () => {
    const foto = items[idx].querySelector('img');
    img.src = foto.currentSrc || foto.src;
    img.alt = foto.alt;
    cap.textContent = items[idx].dataset.cap || '';
    num.textContent = `${idx + 1} / ${items.length}`;
  };
  const abrir = i => {
    idx = i;
    previo = document.activeElement;
    pintar();
    visor.hidden = false;
    document.body.classList.add('no-scroll');
    requestAnimationFrame(() => visor.classList.add('abierto'));
    cerrarBtn.focus();
  };
  const cerrar = () => {
    visor.classList.remove('abierto');
    visor.hidden = true;
    document.body.classList.remove('no-scroll');
    previo?.focus({ preventScroll: true });
  };
  const mover = d => { idx = (idx + d + items.length) % items.length; pintar(); };
  items.forEach((it, i) => it.addEventListener('click', () => abrir(i)));
  cerrarBtn.addEventListener('click', cerrar);
  visor.querySelector('.visor__prev').addEventListener('click', () => mover(-1));
  visor.querySelector('.visor__next').addEventListener('click', () => mover(1));
  visor.querySelector('.visor__fondo').addEventListener('click', cerrar);
  document.addEventListener('keydown', e => {
    if (visor.hidden) return;
    if (e.key === 'Escape') { e.preventDefault(); cerrar(); }
    else if (e.key === 'ArrowLeft') mover(-1);
    else if (e.key === 'ArrowRight') mover(1);
    else if (e.key === 'Tab') {
      const focos = [...visor.querySelectorAll('button')];
      const i = focos.indexOf(document.activeElement);
      e.preventDefault();
      focos[(i + (e.shiftKey ? -1 : 1) + focos.length) % focos.length].focus();
    }
  });
}

function initMapa() {
  const el = document.getElementById('mapa');
  if (!el || typeof L === 'undefined') return;
  const centro = [-34.6082, -58.4206];
  const mapa = L.map(el, { center: centro, zoom: 14, scrollWheelZoom: false, dragging: !L.Browser.mobile, zoomControl: false });
  L.control.zoom({ position: 'topright' }).addTo(mapa);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '&copy; OpenStreetMap' }).addTo(mapa);
  L.circle(centro, { radius: 700, color: '#1e6a94', weight: 1.5, fillColor: '#87cefa', fillOpacity: 0.3, interactive: false }).addTo(mapa);
  L.marker(centro, { icon: L.divIcon({ className: 'pin-zona', html: '<span>Almagro</span>', iconSize: null }), interactive: false, keyboard: false }).addTo(mapa);
  setTimeout(() => mapa.invalidateSize(), 400);
  window.addEventListener('load', () => mapa.invalidateSize());
}

function initTurno() {
  const form = document.getElementById('turnoForm');
  if (!form) return;
  const nombre = form.elements.nombre;
  const motivo = form.elements.motivo;
  const comentario = form.elements.comentario;
  const enviar = form.querySelector('.turno__enviar');
  const marcar = (campo, msg) => {
    const caja = campo.closest('.campo');
    const p = caja?.querySelector('.campo__err');
    caja?.classList.toggle('error', Boolean(msg));
    if (p) { p.textContent = msg || ''; p.hidden = !msg; }
    campo.setAttribute('aria-invalid', msg ? 'true' : 'false');
  };
  nombre.addEventListener('input', () => marcar(nombre, ''));
  motivo.addEventListener('change', () => marcar(motivo, ''));
  form.addEventListener('submit', e => {
    e.preventDefault();
    let ok = true;
    if (nombre.value.trim().length < 2) { marcar(nombre, 'Contanos tu nombre así sabemos a quién le respondemos.'); ok = false; }
    if (!motivo.value) { marcar(motivo, 'Elegí el motivo de la consulta.'); ok = false; }
    if (!ok) { form.querySelector('[aria-invalid="true"]')?.focus(); return; }
    const pref = form.querySelector('input[name="pref"]:checked')?.value || '';
    let msg = `Hola! Soy ${nombre.value.trim()}. Quiero pedir un turno para ${motivo.value}.`;
    if (pref) msg += ` Me queda mejor ${pref}.`;
    if (comentario.value.trim()) msg += ` ${comentario.value.trim()}`;
    enviar.disabled = true;
    window.open(wspHref(msg), '_blank', 'noopener');
    showToast('Te abrimos WhatsApp con tu pedido listo para enviar.');
    setTimeout(() => { enviar.disabled = false; form.reset(); }, 800);
  });
}

function initFaq() {
  document.querySelectorAll('.faq__item').forEach(d => d.addEventListener('toggle', refrescar));
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
  paso('.hero-eyebrow', { y: 16, opacity: 0, duration: 0.9 }, 0.1);
  paso('h1', { y: 32, opacity: 0, duration: 1.1 }, 0.2);
  paso('.sonrisa path', { strokeDashoffset: 1, duration: 1.1, ease: 'power2.out' }, 0.55);
  paso('.hero-lead', { y: 22, opacity: 0, duration: 1 }, 0.4);
  paso('.hero-ctas .btn', { y: 18, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.55);
  paso('.hero__txt .hero-datos li', { y: 12, opacity: 0, duration: 0.8, stagger: 0.08 }, 0.7);
  paso('.placa, .hero-ficha > *', { scale: 0.94, opacity: 0, duration: 1, stagger: 0.1, clearProps: 'transform,opacity' }, 0.7);
  const fondo = hero.querySelector('.hero__fondo img');
  if (fondo && typeof ScrollTrigger !== 'undefined') {
    gsap.to(fondo, { yPercent: 4, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
  }
}

[initWspLinks, initModelBarScroll, initWspFloat, initNav, initServicios, initGaleria, initMapa, initTurno, initFaq, initReveals, initHeroMotion].forEach(fn => {
  try { fn(); } catch (e) { console.error(e); }
});
