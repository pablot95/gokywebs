const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5491136745158';

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
    .from(hero.querySelectorAll('.sello, .hero-badge'), { scale: 0.92, opacity: 0, duration: 1.1, stagger: 0.1, clearProps: 'transform,opacity' }, 0.65);
}

const fmtLectura = n => {
  const r = Math.round(n);
  return (r < 0 ? '−' : '') + Math.abs(r).toLocaleString('es-AR');
};

function contar(numEl, desde, hasta, dur = 1500) {
  if (!numEl) return;
  if (reduceMotion || desde === hasta) { numEl.textContent = fmtLectura(hasta); return; }
  const t0 = window.performance.now();
  const paso = t => {
    const p = Math.min((t - t0) / dur, 1);
    const e = 1 - Math.pow(1 - p, 3);
    numEl.textContent = fmtLectura(desde + (hasta - desde) * e);
    if (p < 1) requestAnimationFrame(paso);
  };
  requestAnimationFrame(paso);
}

function initLecturas() {
  const els = [...document.querySelectorAll('.readout[data-target]')];
  if (!els.length || reduceMotion || !('IntersectionObserver' in window)) return;
  els.forEach(el => {
    const num = el.querySelector('.readout__num');
    if (num) num.textContent = fmtLectura(parseFloat(el.dataset.from));
  });
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      io.unobserve(entry.target);
      const el = entry.target;
      setTimeout(() => contar(el.querySelector('.readout__num'), parseFloat(el.dataset.from), parseFloat(el.dataset.target)), 280);
    });
  }, { threshold: 0.5 });
  els.forEach(el => io.observe(el));
}

const EQUIPOS = {
  aire: { nombre: 'Aire acondicionado', n: 24, u: '°C', label: 'Lo recomendado en verano', fallas: ['No enfría', 'Gotea agua', 'No prende', 'Tira olor feo', 'Hace ruido'] },
  heladera: { nombre: 'Heladera familiar', n: 4, u: '°C', label: 'Lo que tiene que marcar adentro', fallas: ['No enfría', 'Junta escarcha', 'Pierde agua', 'Hace ruido', 'No prende'] },
  comercial: { nombre: 'Heladera o freezer comercial', n: -18, u: '°C', label: 'Freezers y conservadoras', fallas: ['No llega al frío', 'Junta escarcha', 'No corta nunca', 'Burlete roto', 'Hace ruido'] },
  lavarropas: { nombre: 'Lavarropas', n: 1000, u: 'rpm', label: 'Centrifugado parejo', fallas: ['No centrifuga', 'No desagota', 'Pierde agua', 'No arranca', 'Vibra mucho'] },
  otro: { nombre: 'Otro electrodoméstico', n: null, u: '', label: 'Contanos qué equipo es', fallas: ['No prende', 'Hace ruido', 'Pierde agua', 'Otra falla'] }
};

function initTermostato() {
  const t = document.querySelector('.termostato');
  if (!t) return;
  const num = t.querySelector('.readout__num');
  const uni = t.querySelector('.readout__unit');
  const eq = t.querySelector('.termostato__eq');
  const lab = t.querySelector('.termostato__label');
  const pasos = [...t.querySelectorAll('.termostato__paso')];
  const orden = ['aire', 'heladera', 'comercial', 'lavarropas'];
  let i = 0;
  let actual = 24;
  const marcar = k => pasos.forEach((p, j) => p.classList.toggle('on', j === k));
  marcar(0);
  if (reduceMotion) return;
  setTimeout(() => contar(num, 31, 24, 1400), 900);
  let visible = true;
  if ('IntersectionObserver' in window) new IntersectionObserver(([en]) => { visible = en.isIntersecting; }).observe(t);
  const ir = k => {
    const s = EQUIPOS[orden[k]];
    const desde = uni.textContent === s.u ? actual : (s.u === 'rpm' ? 0 : s.n + 14);
    eq.textContent = s.nombre;
    lab.textContent = s.label;
    uni.textContent = s.u;
    marcar(k);
    contar(num, desde, s.n, 1300);
    actual = s.n;
  };
  window.setInterval(() => {
    if (!visible || document.hidden) return;
    i = (i + 1) % orden.length;
    ir(i);
  }, 3800);
}

function initAmbitosTabs() {
  const tabs = [...document.querySelectorAll('.ambitos__tabs [role="tab"]')];
  if (!tabs.length) return;
  const activar = (tab, foco) => {
    tabs.forEach(t => {
      const on = t === tab;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      const panel = document.getElementById(t.getAttribute('aria-controls'));
      if (!panel) return;
      panel.hidden = !on;
      if (on) {
        const nuevos = [...panel.querySelectorAll('[data-animate]:not(.in)')];
        if (reduceMotion) nuevos.forEach(el => el.classList.add('in'));
        else requestAnimationFrame(() => requestAnimationFrame(() => nuevos.forEach(el => el.classList.add('in'))));
      }
    });
    if (foco) tab.focus();
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => activar(t));
    t.addEventListener('keydown', e => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault();
      activar(tabs[(i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length], true);
    });
  });
}

function initOrden() {
  const caja = document.getElementById('orden-form');
  const enviar = document.getElementById('orden-enviar');
  if (!caja || !enviar) return;
  const estado = { equipo: '', necesito: 'Reparación', falla: '', donde: '' };
  const fallasBox = document.getElementById('orden-fallas');
  const campoFalla = document.getElementById('campo-falla');
  const zona = document.getElementById('orden-zona');
  const nombre = document.getElementById('orden-nombre');
  const lectura = document.getElementById('ticket-lectura');
  const num = lectura?.querySelector('.readout__num');
  const uni = lectura?.querySelector('.readout__unit');
  const labelLectura = document.getElementById('ticket-label');
  const dd = k => caja.ownerDocument.querySelector(`[data-t="${k}"]`);
  let numActual = null;

  const poner = (k, valor, vacio) => {
    const el = dd(k);
    if (!el) return;
    el.textContent = valor || vacio;
    el.classList.toggle('vacio', !valor);
  };

  const pintarFallas = () => {
    const eq = EQUIPOS[estado.equipo];
    if (!eq) { fallasBox.innerHTML = '<p class="campo__hint">Elegí primero el equipo.</p>'; return; }
    fallasBox.innerHTML = eq.fallas.map(f => `<button type="button" class="chip" aria-pressed="${f === estado.falla}" data-valor="${esc(f)}">${esc(f)}</button>`).join('');
  };

  const mensaje = () => {
    const eq = EQUIPOS[estado.equipo];
    const lineas = ['Hola Ferny, quiero pedir una visita del servicio técnico.'];
    if (eq) lineas.push(`Equipo: ${eq.nombre}`);
    lineas.push(`Necesito: ${estado.necesito}`);
    if (estado.necesito === 'Reparación' && estado.falla) lineas.push(`Qué le pasa: ${estado.falla}`);
    const z = zona.value.trim();
    const lugar = [estado.donde, z && `en ${z}`].filter(Boolean).join(', ');
    if (lugar) lineas.push(`Dónde: ${lugar}`);
    const n = nombre.value.trim();
    if (n) lineas.push(`Me llamo ${n}.`);
    return lineas.join('\n');
  };

  const actualizar = () => {
    const eq = EQUIPOS[estado.equipo];
    poner('equipo', eq?.nombre, 'Elegí el equipo');
    poner('necesito', estado.necesito, '—');
    poner('falla', estado.falla, estado.equipo ? 'Elegí qué le pasa' : '—');
    campoFalla.hidden = estado.necesito !== 'Reparación';
    document.querySelector('[data-t-fila="falla"]')?.toggleAttribute('hidden', estado.necesito !== 'Reparación');
    const z = zona.value.trim();
    poner('donde', [estado.donde, z].filter(Boolean).join(' · '), 'Casa o comercio, y el barrio');
    poner('nombre', nombre.value.trim(), 'Opcional');
    enviar.href = `https://wa.me/${WSP}?text=${encodeURIComponent(mensaje())}`;
  };

  const actualizarLectura = () => {
    const eq = EQUIPOS[estado.equipo];
    if (!num || !uni) return;
    if (!eq || eq.n === null) {
      num.textContent = '--';
      uni.textContent = '';
      numActual = null;
    } else {
      const desde = numActual === null || uni.textContent !== eq.u ? (eq.u === 'rpm' ? 0 : eq.n + 14) : numActual;
      uni.textContent = eq.u;
      contar(num, desde, eq.n, 1100);
      numActual = eq.n;
    }
    if (labelLectura) labelLectura.textContent = eq ? eq.label : 'Elegí el equipo';
  };

  caja.addEventListener('click', e => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    const grupo = chip.closest('[data-campo]');
    if (!grupo) return;
    const campo = grupo.dataset.campo;
    const valor = chip.dataset.valor;
    grupo.querySelectorAll('.chip').forEach(c => c.setAttribute('aria-pressed', c === chip ? 'true' : 'false'));
    if (campo === 'equipo') {
      const cambio = estado.equipo !== valor;
      estado.equipo = valor;
      if (cambio) { estado.falla = ''; pintarFallas(); actualizarLectura(); }
    } else {
      estado[campo] = valor;
    }
    actualizar();
  });
  [zona, nombre].forEach(input => input.addEventListener('input', actualizar));

  enviar.addEventListener('click', e => {
    if (estado.equipo) return;
    e.preventDefault();
    showToast('Elegí el equipo así sabemos qué llevar a la visita.');
    caja.querySelector('[data-campo="equipo"] .chip')?.focus();
  });

  pintarFallas();
  actualizar();
}

initReveals();
initNav();
initWspFloat();
initModelBarScroll();
initHeroMotion();
initLecturas();
initTermostato();
initAmbitosTabs();
initOrden();
