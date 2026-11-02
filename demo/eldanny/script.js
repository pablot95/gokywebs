const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5491125355923';

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

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
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; const header = document.querySelector('.site-header'); (header || document.body).appendChild(bd); }
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

function revelarNuevos(cont) {
  if (!revealsListos || !cont) return;
  const nuevos = [...cont.querySelectorAll('[data-animate]:not(.in)')];
  if (!nuevos.length) return;
  if (reduceMotion) { nuevos.forEach(el => el.classList.add('in')); return; }
  requestAnimationFrame(() => requestAnimationFrame(() => nuevos.forEach((el, i) => {
    const d = Math.min(i * 0.06, 0.6);
    el.style.transitionDelay = `${d}s`;
    el.classList.add('in');
    setTimeout(() => { el.style.transitionDelay = ''; }, (d + 1.2) * 1000);
  })));
}

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const img = hero.querySelector('[data-hero-img]');
  if (img) tl.from(img, { scale: 1.1, duration: 1.8 }, 0);
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 36, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 24, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 20, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.sello, .hero-badge'), { scale: 0.92, y: 24, opacity: 0, duration: 1.1, stagger: 0.1, clearProps: 'transform,opacity' }, 0.75);
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  const capa = document.querySelector('.hero .parallax');
  if (!capa) return;
  gsap.to(capa, {
    yPercent: 4, ease: 'none',
    scrollTrigger: { trigger: capa.closest('.hero-foto'), start: 'top top', end: 'bottom top', scrub: true }
  });
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

function initVisor() {
  const visor = document.getElementById('visor');
  const tiles = [...document.querySelectorAll('[data-visor]')];
  if (!visor || !tiles.length) return;
  const img = document.getElementById('visorImg');
  const cap = document.getElementById('visorCap');
  const btnCerrar = document.getElementById('visorCerrar');
  const btnPrev = document.getElementById('visorPrev');
  const btnNext = document.getElementById('visorNext');
  let actual = 0;
  let origen = null;
  const mostrar = i => {
    actual = (i + tiles.length) % tiles.length;
    const t = tiles[actual];
    const foto = t.querySelector('img');
    img.src = t.dataset.full;
    img.alt = foto?.alt || '';
    img.width = foto?.width || 1254;
    img.height = foto?.height || 1254;
    cap.textContent = `${t.dataset.cap} · ${actual + 1} de ${tiles.length}`;
  };
  const abrir = i => {
    origen = document.activeElement;
    mostrar(i);
    visor.hidden = false;
    document.body.classList.add('no-scroll');
    requestAnimationFrame(() => visor.classList.add('abierto'));
    btnCerrar.focus();
  };
  const cerrar = () => {
    visor.classList.remove('abierto');
    visor.hidden = true;
    document.body.classList.remove('no-scroll');
    origen?.focus();
  };
  tiles.forEach((t, i) => t.addEventListener('click', () => abrir(i)));
  btnCerrar.addEventListener('click', cerrar);
  btnPrev.addEventListener('click', () => mostrar(actual - 1));
  btnNext.addEventListener('click', () => mostrar(actual + 1));
  visor.addEventListener('click', e => { if (e.target === visor) cerrar(); });
  visor.addEventListener('keydown', e => {
    if (e.key === 'Escape') { e.preventDefault(); cerrar(); }
    else if (e.key === 'ArrowLeft') mostrar(actual - 1);
    else if (e.key === 'ArrowRight') mostrar(actual + 1);
    else if (e.key === 'Tab') {
      const focos = [btnCerrar, btnPrev, btnNext];
      const i = focos.indexOf(document.activeElement);
      e.preventDefault();
      focos[(i + (e.shiftKey ? -1 : 1) + focos.length) % focos.length].focus();
    }
  });
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
      try { vp.setPointerCapture?.(pointerId); } catch { /* sin capture el drag igual funciona */ }
    }
    e.preventDefault();
    vp.scrollLeft = startScroll - dx;
  });
  const end = e => {
    if (!dragging || (e && pointerId !== null && e.pointerId !== pointerId)) return;
    dragging = false;
    if (moved) {
      try { vp.releasePointerCapture?.(pointerId); } catch { /* ya liberado */ }
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
  const vp = document.getElementById('railTrabajos');
  if (!vp) return;
  initRailDrag(vp);
  const track = vp.querySelector('.rail-track');
  const prev = document.querySelector('[data-rail="prev"]');
  const next = document.querySelector('[data-rail="next"]');
  const inicio = () => parseFloat(getComputedStyle(track).paddingInlineStart) || 0;
  const items = [...track.children];
  const ir = dir => {
    const base = vp.getBoundingClientRect().left + inicio();
    const posiciones = items.map(it => it.getBoundingClientRect().left - base + vp.scrollLeft);
    const actual = vp.scrollLeft;
    let destino;
    if (dir > 0) destino = posiciones.find(p => p > actual + 4);
    else destino = [...posiciones].reverse().find(p => p < actual - 4);
    if (destino === undefined) destino = dir > 0 ? vp.scrollWidth : 0;
    vp.scrollTo({ left: destino, behavior: reduceMotion ? 'auto' : 'smooth' });
  };
  const estado = () => {
    if (prev) prev.disabled = vp.scrollLeft <= 2;
    if (next) next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  prev?.addEventListener('click', () => ir(-1));
  next?.addEventListener('click', () => ir(1));
  vp.addEventListener('scroll', estado, { passive: true });
  vp.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') { e.preventDefault(); ir(1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); ir(-1); }
  });
  window.addEventListener('resize', estado, { passive: true });
  estado();
}

function initTabs() {
  const tabs = [...document.querySelectorAll('.tabs [role="tab"]')];
  if (!tabs.length) return;
  const activar = (tab, foco) => {
    tabs.forEach(t => {
      const on = t === tab;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      const panel = document.getElementById(t.getAttribute('aria-controls'));
      if (panel) panel.hidden = !on;
    });
    if (foco) tab.focus();
    revelarNuevos(document.getElementById(tab.getAttribute('aria-controls')));
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => activar(t, false));
    t.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        activar(tabs[(i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length], true);
      }
    });
  });
}

const fmt = n => (Math.round(n * 10) / 10).toLocaleString('es-AR', { maximumFractionDigits: 1 });
const fmt2 = n => n.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function initMedir() {
  const form = document.getElementById('medirForm');
  if (!form) return;
  const $ = id => document.getElementById(id);
  const campos = { largo: $('mLargo'), ancho: $('mAncho'), alto: $('mAlto') };
  const limites = { largo: [0.5, 40], ancho: [0.5, 40], alto: [2, 6] };
  const nombres = { largo: 'el largo', ancho: 'el ancho', alto: 'el alto' };
  const cuenta = { puertas: 1, ventanas: 1 };
  const TRABAJOS = {
    paredes: { label: 'Pintar paredes', base: 'paredes' },
    cielorraso: { label: 'Pintar el cielorraso', base: 'piso' },
    tarquini: { label: 'Revestir con Tarquini', base: 'paredes' },
    parquet: { label: 'Pulir y plastificar el parquet', base: 'piso' },
    granito: { label: 'Pulir el granito', base: 'piso' },
    flotante: { label: 'Colocar piso flotante', base: 'piso' }
  };
  const lista = [];
  const leer = k => {
    const v = parseFloat(String(campos[k].value).trim().replace(/\s/g, '').replace(',', '.'));
    return Number.isFinite(v) ? v : NaN;
  };
  const marcarError = (k, msg) => {
    const err = $(campos[k].id + 'Error');
    campos[k].setAttribute('aria-invalid', msg ? 'true' : 'false');
    if (err) { err.textContent = msg || ''; err.hidden = !msg; }
  };
  const validar = (mostrar) => {
    let ok = true;
    Object.keys(campos).forEach(k => {
      const v = leer(k);
      const [min, max] = limites[k];
      let msg = '';
      if (!Number.isFinite(v)) msg = `Cargá ${nombres[k]} en metros.`;
      else if (v < min || v > max) msg = `Entre ${fmt(min)} y ${fmt(max)} m.`;
      if (msg) ok = false;
      if (mostrar || !msg) marcarError(k, msg);
    });
    return ok;
  };
  const trabajosElegidos = () => [...form.querySelectorAll('input[data-f="trabajo"]:checked')].map(i => i.value);
  const calcular = () => {
    const L = leer('largo'), A = leer('ancho'), H = leer('alto');
    const piso = L * A;
    const paredes = Math.max(0, 2 * (L + A) * H - cuenta.puertas * 1.6 - cuenta.ventanas * 1.5);
    const zocalo = Math.max(0, 2 * (L + A) - cuenta.puertas * 0.8);
    return { ambiente: $('mAmbiente').value, L, A, H, piso, paredes, zocalo, puertas: cuenta.puertas, ventanas: cuenta.ventanas, trabajos: trabajosElegidos() };
  };
  const plural = (n, s, p) => `${n} ${n === 1 ? s : p}`;
  const bloque = a => {
    const lineas = [`${a.ambiente}: ${fmt(a.L)} × ${fmt(a.A)} m, alto ${fmt(a.H)} m (${plural(a.puertas, 'puerta', 'puertas')}, ${plural(a.ventanas, 'ventana', 'ventanas')})`];
    a.trabajos.forEach(t => {
      const def = TRABAJOS[t];
      if (!def) return;
      const m2 = def.base === 'paredes' ? a.paredes : a.piso;
      lineas.push(`· ${def.label}: ${fmt(m2)} m²`);
    });
    if (a.trabajos.includes('flotante')) lineas.push(`· Zócalo: ${fmt(a.zocalo)} m`);
    return lineas.join('\n');
  };
  const mensaje = actual => {
    const todos = actual ? [...lista, actual] : [...lista];
    const zona = $('mZona').value.trim();
    let txt = 'Hola El Danny, quiero pedir un presupuesto.\n\n' + todos.map(bloque).join('\n\n');
    if (zona) txt += `\n\nZona: ${zona}.`;
    txt += '\n\n¿Cuándo podrían pasar a verlo?';
    return txt;
  };
  const dibujar = a => {
    const ok = Number.isFinite(a.L) && Number.isFinite(a.A) && a.L > 0 && a.A > 0;
    const piso = $('planoPiso'), muro = $('planoMuro'), puerta = $('planoPuerta');
    if (!ok) return;
    const maxW = 220, maxH = 160;
    const k = Math.min(maxW / a.L, maxH / a.A);
    const w = a.L * k, h = a.A * k;
    const x = 50 + (maxW - w) / 2 + 10, y = 40 + (maxH - h) / 2;
    [piso, muro].forEach(r => { r.setAttribute('x', x.toFixed(1)); r.setAttribute('y', y.toFixed(1)); r.setAttribute('width', w.toFixed(1)); r.setAttribute('height', h.toFixed(1)); });
    const hayPiso = a.trabajos.some(t => ['parquet', 'granito', 'flotante'].includes(t));
    const hayPared = a.trabajos.some(t => ['paredes', 'tarquini'].includes(t));
    piso.classList.toggle('activo', hayPiso);
    piso.classList.toggle('granito', a.trabajos.includes('granito') && !a.trabajos.includes('parquet') && !a.trabajos.includes('flotante'));
    muro.classList.toggle('activo', hayPared);
    if (a.puertas > 0) {
      const p = Math.min(0.8 * k, w * 0.4);
      const px = x + w - p - 8, py = y + h;
      puerta.setAttribute('d', `M${px.toFixed(1)} ${py.toFixed(1)} h${p.toFixed(1)} M${px.toFixed(1)} ${py.toFixed(1)} v${(-p).toFixed(1)} A${p.toFixed(1)} ${p.toFixed(1)} 0 0 1 ${(px + p).toFixed(1)} ${py.toFixed(1)}`);
    } else puerta.setAttribute('d', '');
    const cotaL = $('planoCotaL'), cotaA = $('planoCotaA'), nombre = $('planoNombre');
    cotaL.setAttribute('x', (x + w / 2).toFixed(1));
    cotaL.setAttribute('y', (y - 12).toFixed(1));
    cotaL.textContent = `${fmt2(a.L)} m`;
    const ax = x - 12, ay = y + h / 2;
    cotaA.setAttribute('x', ax.toFixed(1));
    cotaA.setAttribute('y', ay.toFixed(1));
    cotaA.setAttribute('transform', `rotate(-90 ${ax.toFixed(1)} ${ay.toFixed(1)})`);
    cotaA.textContent = `${fmt2(a.A)} m`;
    nombre.setAttribute('x', (x + w / 2).toFixed(1));
    nombre.setAttribute('y', (y + h / 2 + 5).toFixed(1));
    nombre.textContent = a.ambiente;
    $('plano').setAttribute('aria-label', `Plano a escala: ${a.ambiente} de ${fmt(a.L)} por ${fmt(a.A)} metros`);
  };
  const pintar = () => {
    const okMedidas = validar(false);
    const a = calcular();
    if (okMedidas) {
      $('rPiso').textContent = fmt(a.piso);
      $('rParedes').textContent = fmt(a.paredes);
      $('rZocalo').textContent = fmt(a.zocalo);
      dibujar(a);
      const ul = $('rTrabajos');
      ul.innerHTML = a.trabajos.map(t => {
        const def = TRABAJOS[t];
        const m2 = def.base === 'paredes' ? a.paredes : a.piso;
        return `<li class="rt rt--${def.base}"><span>${esc(def.label)}</span><strong>${fmt(m2)} m²</strong></li>`;
      }).join('');
    }
    $('medirWsp').href = `https://wa.me/${WSP}?text=${encodeURIComponent(mensaje(okMedidas ? a : null))}`;
    return okMedidas;
  };
  const pintarLista = () => {
    const wrap = $('medirLista');
    const ul = $('medirListaItems');
    wrap.hidden = !lista.length;
    ul.innerHTML = lista.map((a, i) => `<li><span>${esc(a.ambiente)} · ${fmt(a.L)} × ${fmt(a.A)} m</span><button type="button" data-quitar="${i}" aria-label="Quitar ${esc(a.ambiente)} de la lista"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></button></li>`).join('');
  };
  const validarTrabajos = () => {
    const ok = trabajosElegidos().length > 0;
    const err = $('mTrabajoError');
    err.textContent = ok ? '' : 'Elegí al menos un trabajo.';
    err.hidden = ok;
    return ok;
  };
  form.addEventListener('input', () => { pintar(); if (trabajosElegidos().length) validarTrabajos(); });
  form.addEventListener('change', () => { pintar(); if (trabajosElegidos().length) validarTrabajos(); });
  form.querySelectorAll('[data-step]').forEach(b => b.addEventListener('click', () => {
    const k = b.dataset.step;
    cuenta[k] = Math.max(0, Math.min(8, cuenta[k] + Number(b.dataset.d)));
    $(k === 'puertas' ? 'mPuertas' : 'mVentanas').textContent = cuenta[k];
    pintar();
  }));
  $('medirSumar').addEventListener('click', () => {
    const okM = validar(true);
    const okT = validarTrabajos();
    if (!okM || !okT) { showToast('Revisá las medidas marcadas para sumar el ambiente.'); return; }
    const a = calcular();
    lista.push(a);
    pintarLista();
    const sel = $('mAmbiente');
    showToast(`${a.ambiente} quedó en tu lista. Cargá el próximo ambiente.`);
    if (sel.selectedIndex < sel.options.length - 1) sel.selectedIndex += 1;
    pintar();
    sel.focus();
  });
  $('medirListaItems').addEventListener('click', e => {
    const b = e.target.closest('[data-quitar]');
    if (!b) return;
    const [quitado] = lista.splice(Number(b.dataset.quitar), 1);
    pintarLista();
    pintar();
    showToast(`Sacamos ${quitado.ambiente} de la lista.`);
  });
  $('medirWsp').addEventListener('click', e => {
    const okM = validar(true);
    const okT = lista.length > 0 || validarTrabajos();
    if (!okM && !lista.length) { e.preventDefault(); showToast('Revisá las medidas antes de mandarlas.'); campos.largo.focus(); return; }
    if (!okT) { e.preventDefault(); showToast('Elegí al menos un trabajo para el presupuesto.'); return; }
    pintar();
    showToast('Abrimos WhatsApp con tus medidas.');
  });
  pintar();
}

initTabs();
initMedir();
initReveals();
initNav();
initWspFloat();
initModelBarScroll();
initHeroMotion();
initParallax();
initVisor();
initRail();
