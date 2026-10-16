const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5491127742940';
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const HORARIO = { 1: [8, 18], 2: [8, 18], 3: [8, 18], 4: [8, 18], 5: [8, 18], 6: [9, 13] };
const DIAS_LARGO = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const DIAS_CORTO = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

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
const irA = el => { if (el) el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' }); };

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

function ahoraAR() {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Argentina/Buenos_Aires', year: 'numeric', month: '2-digit', day: '2-digit',
    weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
  }).formatToParts(new Date());
  const get = t => parts.find(p => p.type === t)?.value || '0';
  return {
    dia: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday')),
    h: Number(get('hour')) + Number(get('minute')) / 60,
    hhmm: `${get('hour').padStart(2, '0')}:${get('minute').padStart(2, '0')}`,
    y: Number(get('year')), m: Number(get('month')), d: Number(get('day'))
  };
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

function initWspFloat() {
  const btn = document.getElementById('wsp-float');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) btn.classList.add('visible'); else btn.classList.remove('visible');
  }, { passive: true });
}

function initEstado() {
  const els = document.querySelectorAll('[data-estado]');
  const filas = document.querySelectorAll('.horarios tr[data-dias]');
  if (!els.length && !filas.length) return;
  const pintar = () => {
    const { dia, h } = ahoraAR();
    const hoy = HORARIO[dia];
    let txt;
    let abierto = false;
    if (hoy && h >= hoy[0] && h < hoy[1]) {
      abierto = true;
      txt = `Abierto ahora · hasta las ${hoy[1]} h`;
    } else if (hoy && h < hoy[0]) {
      txt = `Cerrado · abrimos hoy a las ${hoy[0]} h`;
    } else {
      let k = 1;
      while (!HORARIO[(dia + k) % 7] && k < 7) k++;
      const prox = (dia + k) % 7;
      txt = `Cerrado · abrimos ${k === 1 ? 'mañana' : 'el ' + DIAS_LARGO[prox]} a las ${HORARIO[prox][0]} h`;
    }
    els.forEach(el => { el.textContent = txt; el.classList.toggle('abierto', abierto); });
    filas.forEach(tr => tr.classList.toggle('hoy', tr.dataset.dias.split(',').includes(String(dia))));
  };
  pintar();
  window.setInterval(pintar, 60000);
}

function initSelector() {
  const lista = document.querySelector('[data-selector]');
  if (!lista) return;
  const tabs = [...lista.querySelectorAll('[role="tab"]')];
  const angosto = window.matchMedia('(max-width: 900px)');
  const activar = (tab, foco) => {
    tabs.forEach(t => {
      const on = t === tab;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      const panel = document.getElementById(t.getAttribute('aria-controls'));
      if (panel) panel.hidden = !on;
    });
    if (foco) tab.focus();
    if (angosto.matches) lista.scrollTo({ left: tab.offsetLeft - lista.clientWidth / 2 + tab.offsetWidth / 2, behavior: reduceMotion ? 'auto' : 'smooth' });
    refrescar();
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => activar(t));
    t.addEventListener('keydown', e => {
      let j = null;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') j = (i + 1) % tabs.length;
      else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') j = (i - 1 + tabs.length) % tabs.length;
      else if (e.key === 'Home') j = 0;
      else if (e.key === 'End') j = tabs.length - 1;
      if (j !== null) { e.preventDefault(); activar(tabs[j], true); }
    });
  });
}

function initRail() {
  const rail = document.querySelector('[data-rail]');
  if (!rail) return;
  const prev = document.querySelector('[data-rail-prev]');
  const next = document.querySelector('[data-rail-next]');
  const estado = () => {
    if (!prev || !next) return;
    prev.disabled = rail.scrollLeft <= 2;
    next.disabled = rail.scrollLeft >= rail.scrollWidth - rail.clientWidth - 2;
  };
  const paso = () => Math.max(260, rail.clientWidth * 0.7);
  prev?.addEventListener('click', () => rail.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => rail.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  rail.addEventListener('scroll', estado, { passive: true });
  window.addEventListener('resize', estado, { passive: true });
  estado();

  let down = false;
  let moved = false;
  let x0 = 0;
  let s0 = 0;
  let dx = 0;
  let pid = null;
  rail.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    down = true; moved = false; x0 = e.clientX; s0 = rail.scrollLeft; dx = 0; pid = e.pointerId;
  });
  rail.addEventListener('pointermove', e => {
    if (!down) return;
    dx = e.clientX - x0;
    if (!moved && Math.abs(dx) > 6) {
      moved = true;
      rail.classList.add('dragging');
      try { rail.setPointerCapture?.(pid); } catch { pid = null; }
    }
    if (moved) rail.scrollLeft = s0 - dx;
  });
  const fin = () => {
    if (!down) return;
    down = false;
    try { if (pid !== null) rail.releasePointerCapture?.(pid); } catch { pid = null; }
    if (!moved) return;
    const pad = parseFloat(window.getComputedStyle(rail).scrollPaddingInlineStart) || 0;
    const base = rail.getBoundingClientRect().left + pad;
    const ds = [...rail.querySelectorAll('.g-track > li')].map(li => li.getBoundingClientRect().left - base);
    let d = ds.reduce((a, b) => (Math.abs(b) < Math.abs(a) ? b : a), Infinity);
    if (dx < -60) d = ds.filter(v => v > 4).sort((a, b) => a - b)[0] ?? d;
    else if (dx > 60) d = ds.filter(v => v < -4).sort((a, b) => b - a)[0] ?? d;
    const destino = rail.scrollLeft + d;
    rail.scrollTo({ left: destino, behavior: reduceMotion ? 'auto' : 'smooth' });
    setTimeout(() => rail.classList.remove('dragging'), reduceMotion ? 0 : 520);
    const kill = ev => { ev.preventDefault(); ev.stopPropagation(); };
    rail.addEventListener('click', kill, { capture: true });
    setTimeout(() => rail.removeEventListener('click', kill, { capture: true }), 80);
  };
  rail.addEventListener('pointerup', fin);
  rail.addEventListener('pointercancel', fin);
  rail.addEventListener('lostpointercapture', fin);
}

function initVisor() {
  const dlg = document.getElementById('visor');
  const items = [...document.querySelectorAll('.g-item')];
  if (!dlg || !items.length) return;
  const img = dlg.querySelector('[data-visor-img]');
  const tit = dlg.querySelector('[data-visor-tit]');
  const det = dlg.querySelector('[data-visor-det]');
  const cont = dlg.querySelector('[data-visor-cont]');
  const wsp = dlg.querySelector('[data-visor-wsp]');
  const cerrarBtn = dlg.querySelector('[data-visor-cerrar]');
  let i = 0;
  let origen = null;
  const mostrar = k => {
    i = (k + items.length) % items.length;
    const it = items[i];
    const src = it.querySelector('img');
    if (!src) return;
    img.src = src.getAttribute('src');
    img.alt = src.alt;
    img.width = Number(src.getAttribute('width')) || 1600;
    img.height = Number(src.getAttribute('height')) || 1067;
    tit.textContent = it.dataset.titulo || '';
    det.textContent = it.dataset.detalle || '';
    cont.textContent = `${i + 1} / ${items.length}`;
    wsp.href = `https://wa.me/${WSP}?text=${encodeURIComponent(`Hola RFI Mantenimiento, vi el trabajo «${it.dataset.titulo}» en la web y quiero algo así.`)}`;
  };
  items.forEach((it, k) => it.addEventListener('click', () => {
    origen = it;
    mostrar(k);
    if (typeof dlg.showModal === 'function') dlg.showModal(); else dlg.setAttribute('open', '');
    document.body.classList.add('no-scroll');
    cerrarBtn?.focus();
  }));
  const cerrar = () => {
    if (typeof dlg.close === 'function' && dlg.open) dlg.close();
    else { dlg.removeAttribute('open'); dlg.dispatchEvent(new window.Event('close')); }
  };
  dlg.addEventListener('close', () => { document.body.classList.remove('no-scroll'); origen?.focus(); });
  cerrarBtn?.addEventListener('click', cerrar);
  dlg.querySelector('[data-visor-ant]')?.addEventListener('click', () => mostrar(i - 1));
  dlg.querySelector('[data-visor-sig]')?.addEventListener('click', () => mostrar(i + 1));
  dlg.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') mostrar(i - 1);
    else if (e.key === 'ArrowRight') mostrar(i + 1);
  });
  dlg.addEventListener('click', e => { if (e.target === dlg) cerrar(); });
}

function abrirWsp(texto) {
  const a = document.createElement('a');
  a.href = `https://wa.me/${WSP}?text=${encodeURIComponent(texto)}`;
  a.target = '_blank';
  a.rel = 'noopener';
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function initPedido() {
  const panel = document.querySelector('.pedido-panel');
  const fp = document.getElementById('form-presupuesto');
  const fv = document.getElementById('form-visita');
  if (!panel || !fp || !fv) return;
  const tabs = [...panel.querySelectorAll('[role="tab"]')];
  const preview = document.querySelector('[data-preview]');
  const hora = document.querySelector('[data-preview-hora]');
  const seccion = document.getElementById('presupuesto');
  let actual = 'presupuesto';

  const diasBox = fv.querySelector('[data-dias]');
  const franjasBox = fv.querySelector('[data-franjas]');
  const hoy = ahoraAR();
  const base = Date.UTC(hoy.y, hoy.m - 1, hoy.d, 12);
  let html = '';
  for (let k = 1, n = 0; n < 12 && k < 20; k++) {
    const f = new Date(base + k * 864e5);
    const dw = f.getUTCDay();
    if (!HORARIO[dw]) continue;
    const dd = f.getUTCDate();
    const mm = f.getUTCMonth() + 1;
    const largo = `${DIAS_LARGO[dw]} ${dd}/${mm}`;
    html += `<label class="chip dia"><input type="radio" name="dia" value="${largo}" data-dw="${dw}" aria-label="${largo}"><span><b>${DIAS_CORTO[dw]}</b><i>${dd}</i></span></label>`;
    n++;
  }
  diasBox.innerHTML = html;
  const FRANJAS = { semana: ['Mañana, de 8 a 12 h', 'Tarde, de 13 a 18 h'], sabado: ['Mañana, de 9 a 13 h'] };
  const pintarFranjas = dw => {
    const lista = dw === 6 ? FRANJAS.sabado : FRANJAS.semana;
    const previa = franjasBox.querySelector('input:checked')?.value;
    franjasBox.innerHTML = lista.map(f => `<label class="chip"><input type="radio" name="franja" value="${f}"${f === previa ? ' checked' : ''}><span>${f}</span></label>`).join('');
  };
  pintarFranjas(1);

  const mensaje = () => {
    if (actual === 'presupuesto') {
      const trabajos = [...fp.querySelectorAll('input[data-f="trabajo"]:checked')].map(x => x.value);
      const lugar = fp.querySelector('input[name="lugar"]:checked')?.value;
      const zona = fp.elements.zona.value.trim();
      const detalle = fp.elements.detalle.value.trim();
      const nombre = fp.elements.nombre.value.trim();
      const l = ['Hola RFI Mantenimiento, quiero pedir un presupuesto.'];
      if (trabajos.length) l.push(`• Trabajos: ${trabajos.join(', ')}`);
      if (lugar) l.push(`• Lugar: ${lugar}`);
      if (zona) l.push(`• Zona: ${zona}`);
      if (detalle) l.push(`• Detalle: ${detalle}`);
      if (nombre) l.push(`Soy ${nombre}.`);
      return l.join('\n');
    }
    const dia = fv.querySelector('input[name="dia"]:checked')?.value;
    const franja = fv.querySelector('input[name="franja"]:checked')?.value;
    const servicio = fv.elements.servicio.value;
    const zona = fv.elements.zona.value.trim();
    const nombre = fv.elements.nombre.value.trim();
    const l = ['Hola RFI Mantenimiento, quiero reservar una visita.'];
    if (dia) l.push(`• Día: ${dia}`);
    if (franja) l.push(`• Franja: ${franja.charAt(0).toLowerCase() + franja.slice(1)}`);
    l.push(`• Para revisar: ${servicio}`);
    if (zona) l.push(`• Zona: ${zona}`);
    if (nombre) l.push(`Soy ${nombre}.`);
    return l.join('\n');
  };
  const actualizar = () => {
    if (preview) preview.textContent = mensaje();
    if (hora) hora.textContent = ahoraAR().hhmm;
  };

  const activar = (nombre, foco) => {
    actual = nombre;
    tabs.forEach(t => {
      const on = t.dataset.tab === nombre;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      if (on && foco) t.focus();
    });
    fp.hidden = nombre !== 'presupuesto';
    fv.hidden = nombre !== 'visita';
    actualizar();
    refrescar();
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => activar(t.dataset.tab));
    t.addEventListener('keydown', e => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault();
      activar(tabs[(i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length].dataset.tab, true);
    });
  });

  diasBox.addEventListener('change', e => {
    if (e.target.name === 'dia') pintarFranjas(Number(e.target.dataset.dw));
    diasBox.classList.remove('invalido');
    document.getElementById('err-dia').hidden = true;
  });
  franjasBox.addEventListener('change', () => {
    franjasBox.classList.remove('invalido');
    document.getElementById('err-franja').hidden = true;
  });
  fp.querySelector('[data-grupo="trabajo"]').addEventListener('change', e => {
    e.currentTarget.classList.remove('invalido');
    document.getElementById('err-trabajo').hidden = true;
  });
  [fp, fv].forEach(f => {
    f.addEventListener('input', actualizar);
    f.addEventListener('change', actualizar);
    f.elements.zona.addEventListener('input', () => {
      f.elements.zona.setAttribute('aria-invalid', 'false');
      document.getElementById(f === fp ? 'err-zona-p' : 'err-zona-v').hidden = true;
    });
  });

  const exigir = (cond, box, errId) => {
    if (box.matches('input, select, textarea')) box.setAttribute('aria-invalid', cond ? 'true' : 'false');
    else box.classList.toggle('invalido', cond);
    document.getElementById(errId).hidden = !cond;
    return cond;
  };
  const enviar = form => {
    const btn = form.querySelector('button[type="submit"]');
    abrirWsp(mensaje());
    showToast(actual === 'visita' ? 'Abrimos WhatsApp con tu pedido de visita. Te confirmamos el horario por ahí.' : 'Abrimos WhatsApp con tu pedido. Si tenés fotos, sumalas en el chat.');
    btn.disabled = true;
    setTimeout(() => { btn.disabled = false; }, 1200);
  };
  fp.addEventListener('submit', e => {
    e.preventDefault();
    const sinTrabajo = exigir(!fp.querySelector('input[data-f="trabajo"]:checked'), fp.querySelector('[data-grupo="trabajo"]'), 'err-trabajo');
    const sinZona = exigir(!fp.elements.zona.value.trim(), fp.elements.zona, 'err-zona-p');
    if (sinTrabajo || sinZona) {
      showToast(sinTrabajo ? 'Elegí al menos un trabajo para el presupuesto.' : 'Decinos el barrio o la localidad.');
      (sinTrabajo ? fp.querySelector('input[data-f="trabajo"]') : fp.elements.zona).focus();
      return;
    }
    enviar(fp);
  });
  fv.addEventListener('submit', e => {
    e.preventDefault();
    const sinDia = exigir(!fv.querySelector('input[name="dia"]:checked'), diasBox, 'err-dia');
    const sinFranja = exigir(!fv.querySelector('input[name="franja"]:checked'), franjasBox, 'err-franja');
    const sinZona = exigir(!fv.elements.zona.value.trim(), fv.elements.zona, 'err-zona-v');
    if (sinDia || sinFranja || sinZona) {
      showToast(sinDia ? 'Elegí el día de la visita.' : sinFranja ? 'Elegí la franja horaria.' : 'Decinos el barrio o la localidad.');
      (sinDia ? diasBox.querySelector('input') : sinFranja ? franjasBox.querySelector('input') : fv.elements.zona)?.focus();
      return;
    }
    enviar(fv);
  });

  document.querySelectorAll('[data-abre="visita"]').forEach(a => a.addEventListener('click', e => {
    e.preventDefault();
    activar('visita');
    irA(seccion);
  }));
  document.querySelectorAll('[data-trabajo]').forEach(a => a.addEventListener('click', e => {
    e.preventDefault();
    activar('presupuesto');
    const chip = [...fp.querySelectorAll('input[data-f="trabajo"]')].find(x => x.value === a.dataset.trabajo);
    if (chip && !chip.checked) chip.checked = true;
    fp.querySelector('[data-grupo="trabajo"]').classList.remove('invalido');
    document.getElementById('err-trabajo').hidden = true;
    actualizar();
    irA(seccion);
    showToast(`Marcamos «${a.dataset.trabajo}» en tu pedido.`);
  }));
  if (location.hash === '#visita') activar('visita');
  actualizar();
}

function initMapa() {
  const el = document.getElementById('mapa');
  if (!el || typeof L === 'undefined') return;
  const centro = L.latLng(-34.64, -58.52);
  const limites = centro.toBounds(64000);
  const mapa = L.map(el, { scrollWheelZoom: false, dragging: !L.Browser.mobile, zoomControl: true, attributionControl: true }).setView(centro, 9);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap', maxZoom: 19 }).addTo(mapa);
  L.circle(centro, { radius: 32000, color: '#2B3FB0', weight: 1, opacity: 0.7, fillColor: '#2B3FB0', fillOpacity: 0.1, interactive: false }).addTo(mapa);
  L.marker([-34.6, -58.44], {
    icon: L.divIcon({ className: 'mapa-label-icon', html: '<span class="mapa-label">CABA y Gran Buenos Aires</span>', iconSize: null }),
    interactive: false,
    keyboard: false
  }).addTo(mapa);
  const banda = el.closest('.ubicacion--banda');
  const ajustar = () => {
    mapa.invalidateSize();
    const ancho = banda && window.innerWidth > 900;
    mapa.fitBounds(limites, ancho ? { paddingTopLeft: [Math.min(560, el.clientWidth * 0.45), 24], paddingBottomRight: [24, 24] } : { padding: [20, 20] });
  };
  ajustar();
  window.addEventListener('load', ajustar);
  window.addEventListener('resize', () => mapa.invalidateSize(), { passive: true });
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
  if (img) tl.from(img, { scale: 1.1, duration: 1.8 }, 0);
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.sello, .hero-badge'), { scale: 0.92, opacity: 0, duration: 1.1, stagger: 0.1, clearProps: 'transform,opacity' }, 0.65);
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('[data-parallax]').forEach(el => {
    gsap.fromTo(el, { yPercent: -3 }, {
      yPercent: 3,
      ease: 'none',
      scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true }
    });
  });
}

[initModelBarScroll, initNav, initWspFloat, initEstado, initSelector, initRail, initVisor, initPedido, initMapa, initReveals, initHeroMotion, initParallax].forEach(fn => {
  try { fn(); } catch (err) { console.error(err); }
});
