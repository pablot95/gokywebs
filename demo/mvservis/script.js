const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WA_NUMERO = '5493872510566';
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const waLink = msg => `https://wa.me/${WA_NUMERO}?text=${encodeURIComponent(msg)}`;

const PIEZAS = {
  autos: { sing: 'auto', plur: 'autos', tope: 6, msg: 'el tapizado del auto' },
  alfombras: { sing: 'alfombra', plur: 'alfombras', tope: 10, msg: 'una alfombra' },
  colchones: { sing: 'colchón', plur: 'colchones', tope: 6, msg: 'un colchón' },
  sillas: { sing: 'silla', plur: 'sillas', tope: 24, msg: 'sillas tapizadas' },
  sillones: { sing: 'sillón', plur: 'sillones', tope: 6, msg: 'un sillón' }
};
const MSG_GENERAL = '¡Hola MV.SERVIS! Quiero pedir un presupuesto de limpieza de tapizados.';
const msgPieza = cat => PIEZAS[cat] ? `¡Hola MV.SERVIS! Quiero pedir un presupuesto para lavar ${PIEZAS[cat].msg}.` : MSG_GENERAL;

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());
const refrescar = () => { if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); };

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

let revealsListos = false;
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
    .from(hero.querySelectorAll('.sello, .hero-chips li'), { scale: 0.92, opacity: 0, duration: 1.1, stagger: 0.08, clearProps: 'transform,opacity' }, 0.65);
}

function initGaleria() {
  const lista = document.getElementById('trabajos');
  const filtros = document.querySelectorAll('.filtro');
  if (!lista || !filtros.length) return;
  const aplicar = cat => {
    filtros.forEach(f => f.setAttribute('aria-pressed', String(f.dataset.cat === cat)));
    lista.querySelectorAll('.trabajo').forEach(li => { li.hidden = cat !== 'todos' && li.dataset.cat !== cat; });
    refrescar();
  };
  filtros.forEach(f => f.addEventListener('click', () => aplicar(f.dataset.cat)));
  document.querySelectorAll('[data-filtro]').forEach(a => a.addEventListener('click', () => aplicar(a.dataset.filtro)));
}

function initTabs() {
  const tabs = [...document.querySelectorAll('.tab[role="tab"]')];
  if (!tabs.length) return;
  const elegir = (tab, foco) => {
    tabs.forEach(t => {
      const activo = t === tab;
      t.setAttribute('aria-selected', String(activo));
      t.tabIndex = activo ? 0 : -1;
      const panel = document.getElementById(t.getAttribute('aria-controls'));
      if (!panel) return;
      panel.hidden = !activo;
      if (activo) {
        panel.classList.remove('entrando');
        void panel.offsetWidth;
        panel.classList.add('entrando');
      }
    });
    if (foco) tab.focus();
    refrescar();
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => elegir(t, false));
    t.addEventListener('keydown', e => {
      let j = null;
      if (e.key === 'ArrowRight') j = (i + 1) % tabs.length;
      if (e.key === 'ArrowLeft') j = (i - 1 + tabs.length) % tabs.length;
      if (e.key === 'Home') j = 0;
      if (e.key === 'End') j = tabs.length - 1;
      if (j === null) return;
      e.preventDefault();
      elegir(tabs[j], true);
    });
  });
  document.querySelectorAll('[data-tab]').forEach(a => a.addEventListener('click', () => {
    const t = document.getElementById(`tab-${a.dataset.tab}`);
    if (t) elegir(t, false);
  }));
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
      try { vp.setPointerCapture?.(pointerId); } catch (err) { }
    }
    e.preventDefault();
    vp.scrollLeft = startScroll - dx;
  });
  const end = e => {
    if (!dragging || (e && pointerId !== null && e.pointerId !== pointerId)) return;
    dragging = false;
    if (moved) {
      try { vp.releasePointerCapture?.(pointerId); } catch (err) { }
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

function initRail() {
  const vp = document.getElementById('railVp');
  if (!vp) return;
  const track = vp.querySelector('.rail-track');
  const prev = document.getElementById('railPrev');
  const next = document.getElementById('railNext');
  initRailDrag(vp);
  const paso = () => {
    const card = track?.querySelector('.trabajo');
    const gap = track ? parseFloat(getComputedStyle(track).columnGap) || 0 : 0;
    return card ? card.getBoundingClientRect().width + gap : vp.clientWidth * 0.8;
  };
  const estado = () => {
    if (!prev || !next) return;
    prev.disabled = vp.scrollLeft <= 2;
    next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  vp.addEventListener('scroll', estado, { passive: true });
  window.addEventListener('resize', estado, { passive: true });
  estado();
}

function initVisor() {
  const visor = document.getElementById('visor');
  if (!visor) return;
  const img = document.getElementById('visorImg');
  const tag = document.getElementById('visorTag');
  const tit = document.getElementById('visorTit');
  const desc = document.getElementById('visorDesc');
  const real = document.getElementById('visorReal');
  const cta = document.getElementById('visorCta');
  const cuenta = document.getElementById('visorCuenta');
  const botones = [...document.querySelectorAll('.trabajo-btn')];
  let lista = [];
  let actual = 0;
  let origen = null;
  const pintar = () => {
    const b = lista[actual];
    if (!b) return;
    const cat = b.closest('.trabajo')?.dataset.cat || '';
    img.src = b.dataset.full;
    img.alt = b.querySelector('img')?.alt || '';
    tag.innerHTML = `<span class="raya" aria-hidden="true"></span>${esc(b.dataset.tag)}`;
    tit.textContent = b.dataset.titulo || '';
    desc.textContent = b.dataset.desc || '';
    real.hidden = b.dataset.real !== '1';
    cta.href = waLink(msgPieza(cat));
    cta.textContent = `Pedir presupuesto de ${(PIEZAS[cat]?.plur || 'tapizados')}`;
    cuenta.textContent = `${actual + 1} / ${lista.length}`;
  };
  const foco = () => [...visor.querySelectorAll('a[href], button:not([disabled])')].filter(el => el.offsetParent !== null);
  const cerrar = () => {
    visor.classList.remove('abierto');
    document.body.classList.remove('no-scroll');
    setTimeout(() => { visor.hidden = true; }, reduceMotion ? 0 : 260);
    origen?.focus({ preventScroll: true });
  };
  const abrir = b => {
    lista = botones.filter(x => !x.closest('[hidden]'));
    actual = Math.max(0, lista.indexOf(b));
    origen = b;
    pintar();
    visor.hidden = false;
    document.body.classList.add('no-scroll');
    requestAnimationFrame(() => requestAnimationFrame(() => visor.classList.add('abierto')));
    visor.querySelector('.visor-cerrar')?.focus({ preventScroll: true });
  };
  const mover = d => { if (!lista.length) return; actual = (actual + d + lista.length) % lista.length; pintar(); };
  botones.forEach(b => b.addEventListener('click', () => abrir(b)));
  visor.querySelectorAll('[data-cerrar]').forEach(el => el.addEventListener('click', cerrar));
  document.getElementById('visorPrev')?.addEventListener('click', () => mover(-1));
  document.getElementById('visorNext')?.addEventListener('click', () => mover(1));
  document.addEventListener('keydown', e => {
    if (visor.hidden) return;
    if (e.key === 'Escape') { e.preventDefault(); cerrar(); return; }
    if (e.key === 'ArrowRight') mover(1);
    if (e.key === 'ArrowLeft') mover(-1);
    if (e.key === 'Tab') {
      const f = foco();
      if (!f.length) return;
      const primero = f[0];
      const ultimo = f[f.length - 1];
      if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
      else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
    }
  });
  cta?.addEventListener('click', () => showToast('Abrimos WhatsApp con tu consulta.'));
}

function initPresupuesto() {
  const form = document.getElementById('presuForm');
  if (!form) return;
  const salida = document.getElementById('presuMsg');
  const link = document.getElementById('presuEnviar');
  const error = document.getElementById('presuError');
  const cant = { autos: 1, alfombras: 1, colchones: 1, sillas: 4, sillones: 1 };
  const listar = arr => arr.length < 2 ? arr.join('') : `${arr.slice(0, -1).join(', ')} y ${arr[arr.length - 1]}`;
  const limpio = v => String(v || '').trim().replace(/\s+/g, ' ').replace(/[.\s]+$/, '');

  const armar = () => {
    const piezas = [...form.querySelectorAll('input[data-f="item"]:checked')].map(i => {
      const p = PIEZAS[i.value];
      const n = cant[i.value];
      return `${n} ${n === 1 ? p.sing : p.plur}`;
    });
    const preocupa = [...form.querySelectorAll('input[data-f="preocupa"]:checked')].map(i => i.value);
    const campo = n => limpio(form.querySelector(`input[name="${n}"]`)?.value);
    const detalle = campo('detalle');
    const barrio = campo('barrio');
    const nombre = campo('nombre');
    let msg = '¡Hola MV.SERVIS!';
    if (nombre) msg += ` Soy ${nombre}.`;
    msg += piezas.length ? ` Quiero pedir un presupuesto para lavar ${listar(piezas)}.` : ' Quiero pedir un presupuesto de limpieza de tapizados.';
    if (detalle) msg += ` Detalle: ${detalle}.`;
    if (preocupa.length) msg += ` Me preocupa: ${listar(preocupa)}.`;
    if (barrio) msg += ` Estoy en ${barrio}.`;
    if (piezas.length) msg += ' Les mando fotos por acá.';
    salida.textContent = msg;
    link.href = waLink(msg);
    if (piezas.length) error.hidden = true;
    return piezas.length;
  };

  form.querySelectorAll('.opcion').forEach(op => {
    const input = op.querySelector('input[data-f="item"]');
    const caja = op.querySelector('.opcion-cant');
    const num = op.querySelector('.cant-num');
    const item = op.dataset.item;
    input?.addEventListener('change', () => {
      op.classList.toggle('activa', input.checked);
      if (caja) caja.hidden = !input.checked;
      armar();
    });
    op.querySelectorAll('.cant-btn').forEach(b => b.addEventListener('click', () => {
      const tope = PIEZAS[item]?.tope || 10;
      cant[item] = Math.min(tope, Math.max(1, cant[item] + Number(b.dataset.d)));
      if (num) num.textContent = cant[item];
      armar();
    }));
  });
  form.addEventListener('input', armar);
  form.addEventListener('change', armar);
  link?.addEventListener('click', e => {
    if (!armar()) {
      e.preventDefault();
      error.hidden = false;
      form.querySelector('input[data-f="item"]')?.focus({ preventScroll: true });
      showToast('Elegí al menos una cosa para lavar.');
      return;
    }
    showToast('Abrimos WhatsApp con tu consulta.');
  });
  armar();
}

function initMapa() {
  const el = document.getElementById('mapa');
  if (!el || typeof L === 'undefined') return;
  const centro = L.latLng(-24.7889, -65.4103);
  const mapa = L.map(el, { zoomControl: true, scrollWheelZoom: false, dragging: !L.Browser.mobile, tap: false, attributionControl: true }).setView(centro, 12);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; OpenStreetMap' }).addTo(mapa);
  L.circle(centro, { radius: 5000, color: '#B3362E', weight: 1, fillColor: '#B3362E', fillOpacity: 0.08 }).addTo(mapa);
  const icono = L.divIcon({ className: 'mapa-pin', html: '<span></span>', iconSize: [30, 30], iconAnchor: [15, 15] });
  L.marker(centro, { icon: icono, keyboard: false, title: 'Salta capital' }).addTo(mapa);
  mapa.fitBounds(centro.toBounds(11000), { padding: [10, 10] });
  const ajustar = () => { mapa.invalidateSize(); mapa.fitBounds(centro.toBounds(11000), { padding: [10, 10] }); };
  window.addEventListener('load', ajustar);
  window.addEventListener('resize', () => mapa.invalidateSize(), { passive: true });
}

function initCtasWsp() {
  document.querySelectorAll('a[href^="https://wa.me/"]:not(#presuEnviar):not(#visorCta)').forEach(a => {
    a.addEventListener('click', () => showToast('Abrimos WhatsApp para que nos escribas.'));
  });
}

[initNav, initWspFloat, initModelBarScroll, initGaleria, initTabs, initRail, initVisor, initPresupuesto, initMapa, initCtasWsp, initReveals, initHeroMotion].forEach(fn => {
  try { fn(); } catch (e) { console.error(e); }
});
