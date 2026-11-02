const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP_NUM = '5491167299755';

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

const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

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
  if (img) tl.from(img, { scale: 1.1, duration: 1.8, clearProps: 'transform' }, 0);
  tl.from(hero.querySelectorAll('h1'), { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'transform,opacity,filter' }, 0.15)
    .from(hero.querySelectorAll('.hero-kicker'), { y: 18, opacity: 0, duration: 0.9, clearProps: 'transform,opacity' }, 0.35)
    .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1, clearProps: 'transform,opacity' }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.sello, .ruta-chip'), { scale: 0.92, opacity: 0, duration: 1.1, stagger: 0.12, clearProps: 'transform,opacity' }, 0.7);
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
      try { vp.setPointerCapture?.(pointerId); } catch (err) { void err; }
    }
    e.preventDefault();
    vp.scrollLeft = startScroll - dx;
  });
  const end = e => {
    if (!dragging || (e && pointerId !== null && e.pointerId !== pointerId)) return;
    dragging = false;
    if (moved) {
      try { vp.releasePointerCapture?.(pointerId); } catch (err) { void err; }
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
  const vp = document.getElementById('ciudadRail');
  if (!vp) return;
  initRailDrag(vp);
  const prev = document.querySelector('[data-rail="prev"]');
  const next = document.querySelector('[data-rail="next"]');
  const paso = () => Math.max(260, vp.clientWidth * 0.6);
  const sync = () => {
    if (prev) prev.disabled = vp.scrollLeft <= 2;
    if (next) next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  vp.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync, { passive: true });
  sync();
}

function initViaje() {
  const form = document.getElementById('viajeForm');
  if (!form) return;
  const $ = id => document.getElementById(id);
  const origen = $('vOrigen');
  const destino = $('vDestino');
  const fecha = $('vFecha');
  const hora = $('vHora');
  const vuelo = $('vVuelo');
  const nombre = $('vNombre');
  const cuando = $('vCuando');
  const vueloCampo = $('vVueloCampo');
  if (!origen || !destino || !fecha || !hora || !cuando) return;
  const cont = {
    pasajeros: { el: $('vPasajeros'), min: 1, max: 4, v: 1 },
    valijas: { el: $('vValijas'), min: 0, max: 5, v: 0 },
  };
  const b = {
    tipo: $('bTipo'), origen: $('bOrigen'), destino: $('bDestino'), cuando: $('bCuando'),
    pas: $('bPas'), val: $('bVal'), vueloFila: $('bVueloFila'), vuelo: $('bVuelo'),
  };
  const TIPOS = { taxi: 'Taxi · lo antes posible', traslado: 'Traslado con horario', aeropuerto: 'Aeropuerto · ida o vuelta' };
  const TIPO_MSG = { taxi: 'Un taxi ahora', traslado: 'Un traslado con horario', aeropuerto: 'Ir o volver del aeropuerto' };
  const iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  fecha.min = iso(new Date());

  const tipo = () => form.querySelector('input[name="tipo"]:checked')?.value || 'taxi';
  const conHorario = () => tipo() !== 'taxi';
  const mayus = s => s.charAt(0).toUpperCase() + s.slice(1);
  const fechaTxt = () => {
    if (!conHorario()) return 'Lo antes posible';
    if (!fecha.value) return hora.value ? `Día a definir, ${hora.value} h` : 'Elegí día y hora';
    const d = new Date(`${fecha.value}T12:00`);
    const dia = d.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' });
    return hora.value ? `${dia}, ${hora.value} h` : dia;
  };
  const pasTxt = n => (n === 1 ? '1 pasajero' : `${n} pasajeros`);
  const valTxt = n => (n === 0 ? 'Sin valijas' : n === 1 ? '1 valija' : `${n} valijas`);
  const ponerTxt = (el, valor, vacio) => {
    if (!el) return;
    el.textContent = valor || vacio;
    el.classList.toggle('vacio', !valor);
  };

  const pintar = () => {
    const t = tipo();
    cuando.hidden = !conHorario();
    if (vueloCampo) vueloCampo.hidden = t !== 'aeropuerto';
    if (b.tipo) b.tipo.textContent = TIPOS[t];
    ponerTxt(b.origen, origen.value.trim(), 'Tu dirección');
    ponerTxt(b.destino, destino.value.trim(), 'A dónde vas');
    if (b.cuando) b.cuando.textContent = mayus(fechaTxt());
    if (b.pas) b.pas.textContent = pasTxt(cont.pasajeros.v);
    if (b.val) b.val.textContent = valTxt(cont.valijas.v);
    const vv = vuelo ? vuelo.value.trim() : '';
    if (b.vueloFila) b.vueloFila.hidden = !(t === 'aeropuerto' && vv);
    if (b.vuelo) b.vuelo.textContent = vv || '—';
    Object.values(cont).forEach(c => {
      if (!c.el) return;
      c.el.textContent = c.v;
      const ctl = c.el.parentElement;
      const menos = ctl?.querySelector('[data-paso="-1"]');
      const mas = ctl?.querySelector('[data-paso="1"]');
      if (menos) menos.disabled = c.v <= c.min;
      if (mas) mas.disabled = c.v >= c.max;
    });
  };

  const reglas = [
    [origen, 'vOrigenErr', () => origen.value.trim().length >= 3],
    [destino, 'vDestinoErr', () => destino.value.trim().length >= 3],
    [fecha, 'vFechaErr', () => !conHorario() || Boolean(fecha.value)],
    [hora, 'vHoraErr', () => !conHorario() || Boolean(hora.value)],
  ];
  const marcar = (input, errId, ok) => {
    input.setAttribute('aria-invalid', ok ? 'false' : 'true');
    const err = $(errId);
    if (err) err.hidden = ok;
  };

  form.addEventListener('input', e => {
    const regla = reglas.find(r => r[0] === e.target);
    if (regla && e.target.getAttribute('aria-invalid') === 'true' && regla[2]()) marcar(regla[0], regla[1], true);
    pintar();
  });
  form.addEventListener('change', e => {
    pintar();
    if (e.target.name === 'tipo') {
      reglas.slice(2).forEach(([inp, err]) => { if (!conHorario()) marcar(inp, err, true); });
      if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
    }
  });
  form.addEventListener('click', e => {
    const btn = e.target.closest('[data-contar]');
    if (!btn) return;
    const c = cont[btn.dataset.contar];
    if (!c) return;
    c.v = Math.min(c.max, Math.max(c.min, c.v + Number(btn.dataset.paso)));
    pintar();
  });
  form.addEventListener('submit', e => {
    e.preventDefault();
    let primero = null;
    reglas.forEach(([inp, err, ok]) => {
      const bien = ok();
      marcar(inp, err, bien);
      if (!bien && !primero) primero = inp;
    });
    if (primero) {
      primero.focus();
      showToast('Faltan datos del viaje: revisá lo marcado.');
      return;
    }
    const t = tipo();
    const lineas = [
      '¡Hola Donato! Quiero pedir un viaje.',
      `Tipo: ${TIPO_MSG[t]}`,
      `Salgo de: ${origen.value.trim()}`,
      `Voy a: ${destino.value.trim()}`,
      `Cuándo: ${mayus(fechaTxt())}`,
      `Pasajeros: ${cont.pasajeros.v} · Valijas: ${cont.valijas.v}`,
    ];
    if (t === 'aeropuerto' && vuelo && vuelo.value.trim()) lineas.push(`Vuelo: ${vuelo.value.trim()}`);
    if (nombre && nombre.value.trim()) lineas.push(`Soy ${nombre.value.trim()}.`);
    const url = `https://wa.me/${WSP_NUM}?text=${encodeURIComponent(lineas.join('\n'))}`;
    form.dataset.ultimoWsp = url;
    const w = window.open(url, '_blank');
    if (w) w.opener = null; else window.location.href = url;
    showToast('Abrimos WhatsApp con tu viaje armado.');
  });

  pintar();
}

initModelBarScroll();
initNav();
initWspFloat();
initRail();
initViaje();
initReveals();
initHeroMotion();
