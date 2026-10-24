const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const WSP = '5491156625715';
let revealsListos = false;

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

function refrescarScroll() {
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
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
  const desktopMq = window.matchMedia('(min-width: 961px)');
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

const HORARIO = { 0: null, 1: [8, 19], 2: [8, 19], 3: [8, 19], 4: [8, 19], 5: [8, 19], 6: [8, 13] };
const DIAS = ['el domingo', 'el lunes', 'el martes', 'el miércoles', 'el jueves', 'el viernes', 'el sábado'];

function ahoraEnArgentina() {
  try {
    const partes = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Argentina/Buenos_Aires', weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' }).formatToParts(new Date());
    const val = t => partes.find(p => p.type === t)?.value;
    const dia = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(val('weekday'));
    const h = Number(val('hour')) % 24;
    const m = Number(val('minute'));
    if (dia < 0 || Number.isNaN(h)) throw new Error('fecha');
    return { dia, minutos: h * 60 + m };
  } catch (e) {
    const d = new Date();
    return { dia: d.getDay(), minutos: d.getHours() * 60 + d.getMinutes() };
  }
}

function estadoHorario() {
  const { dia, minutos } = ahoraEnArgentina();
  const hoy = HORARIO[dia];
  if (hoy && minutos >= hoy[0] * 60 && minutos < hoy[1] * 60) {
    return { abierto: true, texto: `Abierto ahora · hasta las ${hoy[1]} h`, dia };
  }
  if (hoy && minutos < hoy[0] * 60) {
    return { abierto: false, texto: `Cerrado · abre hoy a las ${hoy[0]} h`, dia };
  }
  for (let k = 1; k <= 7; k++) {
    const d = (dia + k) % 7;
    if (HORARIO[d]) {
      const cuando = k === 1 ? 'mañana' : DIAS[d];
      return { abierto: false, texto: `Cerrado · abre ${cuando} a las ${HORARIO[d][0]} h`, dia };
    }
  }
  return { abierto: false, texto: 'Consultá el horario por WhatsApp', dia };
}

function initHorario() {
  const estados = document.querySelectorAll('[data-estado]');
  const filas = document.querySelectorAll('.horarios li[data-dias]');
  if (!estados.length && !filas.length) return;
  const pintar = () => {
    const st = estadoHorario();
    estados.forEach(el => {
      el.dataset.abierto = st.abierto ? 'si' : 'no';
      const txt = el.querySelector('.estado__txt');
      if (txt) txt.textContent = st.texto;
    });
    filas.forEach(li => {
      const dias = (li.dataset.dias || '').split(',').map(Number);
      li.classList.toggle('hoy', dias.includes(st.dia));
    });
  };
  pintar();
  setInterval(pintar, 60000);
}

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
    .from(hero.querySelectorAll('.sello, .hero-badge'), { scale: 0.92, opacity: 0, duration: 1.1, stagger: 0.1, clearProps: 'transform,opacity' }, 0.65);
  if (img && typeof ScrollTrigger !== 'undefined') {
    gsap.fromTo(img, { yPercent: -3 }, { yPercent: 4, ease: 'none', immediateRender: false, scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
  }
}

function initVisor() {
  const visor = document.getElementById('visor');
  const botones = [...document.querySelectorAll('[data-visor-grupo] [data-visor]')];
  if (!visor || !botones.length) return;
  const img = visor.querySelector('.visor__img');
  const cap = visor.querySelector('.visor__cap');
  const cerrar = visor.querySelector('[data-visor-cerrar]');
  let actual = 0;
  let origen = null;
  const mostrar = i => {
    actual = (i + botones.length) % botones.length;
    const b = botones[actual];
    const alt = b.querySelector('img')?.alt || '';
    img.src = b.dataset.visor;
    img.alt = alt;
    cap.textContent = `${alt} · ${actual + 1} de ${botones.length}`;
  };
  const abrir = i => {
    origen = document.activeElement;
    mostrar(i);
    visor.hidden = false;
    document.body.classList.add('no-scroll');
    requestAnimationFrame(() => visor.classList.add('abierto'));
    cerrar?.focus();
  };
  const cerrarVisor = () => {
    visor.classList.remove('abierto');
    document.body.classList.remove('no-scroll');
    setTimeout(() => { visor.hidden = true; }, reduceMotion ? 0 : 300);
    origen?.focus?.();
  };
  botones.forEach((b, i) => b.addEventListener('click', () => abrir(i)));
  cerrar?.addEventListener('click', cerrarVisor);
  visor.querySelector('[data-visor-prev]')?.addEventListener('click', () => mostrar(actual - 1));
  visor.querySelector('[data-visor-next]')?.addEventListener('click', () => mostrar(actual + 1));
  visor.addEventListener('click', e => { if (e.target === visor) cerrarVisor(); });
  document.addEventListener('keydown', e => {
    if (visor.hidden) return;
    if (e.key === 'Escape') cerrarVisor();
    else if (e.key === 'ArrowLeft') mostrar(actual - 1);
    else if (e.key === 'ArrowRight') mostrar(actual + 1);
    else if (e.key === 'Tab') {
      const foco = [...visor.querySelectorAll('button')];
      const i = foco.indexOf(document.activeElement);
      if (e.shiftKey && i <= 0) { e.preventDefault(); foco[foco.length - 1].focus(); }
      else if (!e.shiftKey && i === foco.length - 1) { e.preventDefault(); foco[0].focus(); }
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
    if (!moved) { moved = true; vp.classList.add('dragging'); vp.setPointerCapture?.(pointerId); }
    e.preventDefault();
    vp.scrollLeft = startScroll - dx;
  });
  const end = e => {
    if (!dragging || (e && pointerId !== null && e.pointerId !== pointerId)) return;
    dragging = false;
    if (moved) {
      vp.releasePointerCapture?.(pointerId);
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
  const rail = document.querySelector('.rail');
  if (!rail) return;
  initRailDrag(rail);
  const paso = () => {
    const item = rail.querySelector('.rail__item');
    return item ? item.getBoundingClientRect().width + 16 : rail.clientWidth * 0.8;
  };
  document.querySelector('[data-rail-prev]')?.addEventListener('click', () => rail.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  document.querySelector('[data-rail-next]')?.addEventListener('click', () => rail.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
}

function initTabs() {
  const lista = document.querySelector('[role="tablist"]');
  if (!lista) return;
  const tabs = [...lista.querySelectorAll('[role="tab"]')];
  const elegir = (tab, foco) => {
    tabs.forEach(t => {
      const activo = t === tab;
      t.setAttribute('aria-selected', activo ? 'true' : 'false');
      t.tabIndex = activo ? 0 : -1;
      const panel = document.getElementById(t.getAttribute('aria-controls'));
      if (!panel) return;
      panel.hidden = !activo;
      if (activo && !reduceMotion) {
        panel.classList.remove('entrando');
        void panel.offsetWidth;
        panel.classList.add('entrando');
      }
    });
    if (foco) tab.focus();
    refrescarScroll();
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => elegir(t, false));
    t.addEventListener('keydown', e => {
      let j = null;
      if (e.key === 'ArrowRight') j = (i + 1) % tabs.length;
      else if (e.key === 'ArrowLeft') j = (i - 1 + tabs.length) % tabs.length;
      else if (e.key === 'Home') j = 0;
      else if (e.key === 'End') j = tabs.length - 1;
      if (j !== null) { e.preventDefault(); elegir(tabs[j], true); }
    });
  });
  const hash = location.hash.replace('#', '');
  const inicial = tabs.find(t => t.getAttribute('aria-controls') === hash);
  if (inicial) elegir(inicial, false);
  document.querySelectorAll('a[href^="#serv-"]').forEach(a => a.addEventListener('click', () => {
    const t = tabs.find(x => x.getAttribute('aria-controls') === a.getAttribute('href').slice(1));
    if (t) elegir(t, false);
  }));
}

const SINTOMAS = {
  heladera: ['No enfría', 'Pierde agua', 'Hace ruido', 'El motor no corta'],
  aire: ['No enfría', 'Gotea adentro', 'No arranca', 'Instalación nueva'],
  lavarropas: ['No centrifuga', 'No desagota', 'Pierde agua', 'No arranca'],
  lavavajillas: ['No lava bien', 'No desagota', 'No calienta', 'Pierde agua'],
  secarropas: ['No calienta', 'No gira', 'Tarda en secar', 'Hace ruido'],
};
const EQUIPO_TXT = {
  heladera: 'la reparación de mi heladera',
  aire: 'la reparación de un aire acondicionado',
  lavarropas: 'la reparación de mi lavarropas',
  lavavajillas: 'la reparación de mi lavavajillas',
  secarropas: 'la reparación de mi secarropas',
};
const MENSAJE_GENERAL = 'Hola, quiero consultar por un service de electrodomésticos.';

function initGuia() {
  const form = document.getElementById('guia');
  if (!form) return;
  const cajaSintomas = document.getElementById('guiaSintomas');
  const preview = document.getElementById('guiaPreview');
  const enviar = document.getElementById('guiaEnviar');
  const marca = document.getElementById('guiaMarca');
  const zona = document.getElementById('guiaZona');
  const nombre = document.getElementById('guiaNombre');

  const equipo = () => form.querySelector('input[name="equipo"]:checked')?.value || '';
  const sintomasElegidos = () => [...cajaSintomas.querySelectorAll('input[data-sintoma]:checked')].map(i => i.value);

  const armar = () => {
    const eq = equipo();
    if (!eq) return MENSAJE_GENERAL;
    const nom = nombre.value.trim();
    let sint = sintomasElegidos();
    let pedido = EQUIPO_TXT[eq];
    if (eq === 'aire' && sint.includes('Instalación nueva')) {
      sint = sint.filter(s => s !== 'Instalación nueva');
      pedido = sint.length ? 'la instalación de un aire nuevo y la reparación de otro' : 'la instalación de un aire acondicionado';
    }
    const lineas = [`Hola${nom ? `, soy ${nom}` : ''}. Quiero consultar por ${pedido}.`];
    if (sint.length) lineas.push(`Le pasa: ${sint.map(s => s.toLowerCase()).join(', ')}.`);
    const mm = marca.value.trim();
    if (mm) lineas.push(`Marca y modelo: ${mm}.`);
    const z = zona.value;
    lineas.push(z === 'otra zona' ? 'Estoy en otra zona, te paso la dirección.' : `Estoy en ${z}.`);
    return lineas.join('\n');
  };

  const actualizar = () => {
    const msg = armar();
    preview.textContent = msg;
    enviar.href = `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
    if (equipo()) form.classList.remove('guia--error');
  };

  const pintarSintomas = () => {
    const eq = equipo();
    const lista = SINTOMAS[eq];
    if (!lista) return;
    cajaSintomas.innerHTML = [...lista, 'Otra falla'].map(s =>
      `<label class="opcion"><input type="checkbox" data-sintoma value="${esc(s)}"><span>${esc(s)}</span></label>`
    ).join('');
    refrescarScroll();
  };

  form.addEventListener('change', e => {
    if (e.target.name === 'equipo') pintarSintomas();
    actualizar();
  });
  form.addEventListener('input', actualizar);
  enviar.addEventListener('click', e => {
    if (equipo()) return;
    e.preventDefault();
    form.classList.add('guia--error');
    showToast('Elegí qué equipo hay que revisar y armamos el mensaje.');
    form.querySelector('input[name="equipo"]')?.focus();
  });
  actualizar();
}

function initMapa() {
  const el = document.getElementById('mapa');
  if (!el || typeof L === 'undefined') return;
  try {
    const centro = [-34.4486, -58.7856];
    const mapa = L.map(el, { scrollWheelZoom: false, zoomControl: true, attributionControl: true }).setView(centro, 12);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap', maxZoom: 19 }).addTo(mapa);
    const primario = getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim() || '#2C3AAE';
    L.circle(centro, { radius: 5000, color: primario, weight: 1, fillColor: primario, fillOpacity: 0.08 }).addTo(mapa);
    const icono = L.divIcon({ className: 'pin-viso', html: '<span></span>', iconSize: [30, 30], iconAnchor: [15, 15] });
    L.marker(centro, { icon: icono, keyboard: false, title: 'Del Viso, Pilar' }).addTo(mapa);
    window.addEventListener('load', () => mapa.invalidateSize());
  } catch (e) {
    el.closest('.mapa-wrap')?.classList.add('mapa--sin');
  }
}

initModelBarScroll();
initNav();
initWspFloat();
initHorario();
initTabs();
initRail();
initGuia();
initVisor();
initMapa();
initReveals();
initHeroMotion();
