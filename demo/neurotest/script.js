const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5491130910058';

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = String(e.key || '').toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

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
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; (document.querySelector('.site-header') || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 1080px)');
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
  if (img) tl.from(img, { scale: 1.1, duration: 1.8 }, 0);
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 36, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 24, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 20, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.sello'), { scale: 0.92, y: 16, opacity: 0, duration: 1.1, stagger: 0.1, clearProps: 'transform,opacity' }, 0.7);
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

function azar(semilla) {
  let a = semilla >>> 0;
  return () => {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function camino(fn, x0, x1, paso = 2) {
  const p = [];
  for (let x = x0; x <= x1; x += paso) p.push(`${x} ${fn(x).toFixed(1)}`);
  return 'M' + p.join(' L');
}

function rejilla(x0, x1, y0, y1, cada) {
  let s = '';
  for (let x = x0; x <= x1; x += cada) s += `<line class="m-grid" x1="${x}" y1="${y0}" x2="${x}" y2="${y1}"/>`;
  return s;
}

function suave(x, a, b, rampa) {
  return Math.min(1, Math.max(0, Math.min((x - a) / rampa, (b - x) / rampa)));
}

function muestraEEG() {
  const r = azar(7);
  const canales = ['Fp1-F3', 'F3-C3', 'C3-P3', 'P3-O1', 'Fp2-F4', 'F4-C4', 'C4-P4', 'P4-O2'];
  let s = rejilla(72, 632, 8, 272, 70);
  canales.forEach((c, i) => {
    const y0 = 24 + i * 33;
    const k = /O/.test(c) ? 1 : /P/.test(c) ? 0.72 : 0.48;
    const f1 = 0.33 + r() * 0.03;
    const f2 = 1.1 + r() * 0.3;
    const p1 = r() * 6;
    const p2 = r() * 6;
    let ruido = 0;
    const d = camino(x => {
      ruido = ruido * 0.65 + (r() - 0.5) * 2.6;
      return y0 + k * 8 * Math.sin(x * f1 + p1) + 2.2 * Math.sin(x * f2 + p2) + ruido;
    }, 72, 632);
    s += `<text class="m-etq" x="4" y="${y0 + 4}">${c}</text><path class="traza${i % 2 ? ' traza--b' : ''}" pathLength="1" d="${d}"/>`;
  });
  s += '<path class="m-escala" d="M562 290H632"/><text class="m-etq" x="597" y="284" text-anchor="middle">1 s</text>';
  return s;
}

function muestraMapeo() {
  const electrodos = [['Fp1', 124, 66], ['Fp2', 176, 66], ['F7', 76, 106], ['F3', 112, 110], ['Fz', 150, 108], ['F4', 188, 110], ['F8', 224, 106], ['T3', 56, 158], ['C3', 102, 158], ['Cz', 150, 158], ['C4', 198, 158], ['T4', 244, 158], ['T5', 76, 210], ['P3', 112, 206], ['Pz', 150, 208], ['P4', 188, 206], ['T6', 224, 210], ['O1', 124, 250], ['O2', 176, 250]];
  const manchas = [[150, 250, 82, '#5A2E72', 0.85], [108, 226, 58, '#8E58A6', 0.7], [196, 222, 60, '#B47EC4', 0.8], [70, 160, 52, '#B296E3', 0.75], [232, 150, 48, '#B47EC4', 0.55], [150, 90, 70, '#E3D6F1', 0.95], [150, 160, 44, '#C9B3E6', 0.6]];
  let s = '<defs><clipPath id="mp-clip"><circle cx="150" cy="158" r="116"/></clipPath>';
  manchas.forEach((m, i) => { s += `<radialGradient id="mp-g${i}"><stop offset="0" stop-color="${m[3]}" stop-opacity="${m[4]}"/><stop offset="1" stop-color="${m[3]}" stop-opacity="0"/></radialGradient>`; });
  s += '<linearGradient id="mp-ley" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#F3ECF7"/><stop offset=".45" stop-color="#B296E3"/><stop offset=".75" stop-color="#B47EC4"/><stop offset="1" stop-color="#5A2E72"/></linearGradient></defs>';
  s += '<g clip-path="url(#mp-clip)"><rect class="m-fondo" x="30" y="40" width="240" height="240"/>';
  manchas.forEach((m, i) => { s += `<circle class="m-mancha" cx="${m[0]}" cy="${m[1]}" r="${m[2]}" fill="url(#mp-g${i})"/>`; });
  s += '</g>';
  s += '<path class="traza m-cabeza" pathLength="1" d="M150 42a116 116 0 1 1-.1 0"/>';
  s += '<path class="traza m-cabeza" pathLength="1" d="M136 44 150 24l14 20"/>';
  s += '<path class="traza m-cabeza" pathLength="1" d="M34 140c-12 4-12 32 0 36"/><path class="traza m-cabeza" pathLength="1" d="M266 140c12 4 12 32 0 36"/>';
  electrodos.forEach(([n, x, y]) => { s += `<circle class="m-electrodo m-mancha" cx="${x}" cy="${y}" r="3.6"/><text class="m-etq m-etq--chica m-mancha" x="${x}" y="${y - 6}" text-anchor="middle">${n}</text>`; });
  s += '<rect x="304" y="72" width="12" height="172" rx="6" fill="url(#mp-ley)"/><text class="m-etq" x="310" y="62" text-anchor="middle">Alta</text><text class="m-etq" x="310" y="262" text-anchor="middle">Baja</text>';
  return s;
}

function muestraPoligrafia() {
  const r = azar(21);
  const fase = x => x * 0.088;
  const w = x => suave(x, 292, 420, 16);
  let s = '<rect class="m-zona m-mancha" x="296" y="26" width="120" height="262" rx="6"/><text class="m-etq m-zona-etq" x="356" y="18" text-anchor="middle">Pausa respiratoria</text>';
  s += rejilla(100, 632, 26, 288, 76);
  const canal = (y0, nombre, fn, b) => {
    s += `<text class="m-etq" x="4" y="${y0 + 4}">${nombre}</text><path class="traza${b ? ' traza--b' : ''}" pathLength="1" d="${camino(fn, 100, 632)}"/>`;
  };
  const vaiven = x => 0.82 + 0.18 * Math.sin(x * 0.017 + 1.3);
  canal(60, 'Flujo nasal', x => 60 - (17 - 15.8 * w(x)) * vaiven(x) * Math.sin(fase(x)) + (r() - 0.5) * 1.6);
  canal(124, 'Tórax', x => 124 - (12 + 3 * w(x)) * vaiven(x + 40) * Math.sin(fase(x) + 0.5) + (r() - 0.5) * 1.2, true);
  canal(184, 'Abdomen', x => 184 - (12 + 3 * w(x)) * vaiven(x + 80) * (1 - 2 * w(x)) * Math.sin(fase(x) + 0.5) + (r() - 0.5) * 1.2);
  canal(244, 'Saturación O₂', x => {
    const t = (x - 404) / 150;
    const caida = t > 0 && t < 1 ? Math.sin(Math.PI * t) * 26 : 0;
    return 236 + caida + (r() - 0.5) * 0.8;
  }, true);
  return s;
}

function muestraCPAP() {
  const r = azar(33);
  const pausas = [[128, 158], [190, 214], [262, 280]];
  const enPausa = x => pausas.reduce((m, [a, b]) => Math.max(m, suave(x, a, b, 6)), 0);
  let s = rejilla(100, 632, 20, 288, 76);
  s += `<text class="m-etq" x="4" y="64">Flujo</text><path class="traza" pathLength="1" d="${camino(x => 60 - 16 * (1 - enPausa(x) * 0.92) * (0.84 + 0.16 * Math.sin(x * 0.019)) * Math.sin(x * 0.09) + (r() - 0.5) * 1.4, 100, 632)}"/>`;
  s += '<text class="m-etq" x="4" y="122">Eventos</text><line class="m-base" x1="100" y1="118" x2="632" y2="118"/>';
  pausas.forEach(([a, b]) => { s += `<rect class="m-evento m-mancha" x="${a}" y="108" width="${b - a}" height="20" rx="4"/>`; });
  const tramos = [[100, 230, 236], [230, 360, 212], [360, 490, 188], [490, 632, 170]];
  let d = `M100 ${tramos[0][2]}`;
  tramos.forEach(([, b, y], i) => { d += `${i ? ` V${y}` : ''} H${b}`; });
  s += `<text class="m-etq" x="4" y="204">Presión</text><text class="m-etq m-etq--chica" x="4" y="218">cm H₂O</text><path class="traza traza--b traza--gruesa" pathLength="1" d="${d}"/>`;
  s += '<text class="m-etq m-zona-etq m-mancha" x="630" y="158" text-anchor="end">Presión indicada</text>';
  return s;
}

function dibujar(fig) {
  if (!fig) return;
  if (reduceMotion) { fig.classList.add('dibujada'); return; }
  fig.classList.remove('dibujada');
  void fig.getBoundingClientRect();
  let hecho = false;
  const ir = () => { if (!hecho) { hecho = true; fig.classList.add('dibujada'); } };
  requestAnimationFrame(ir);
  setTimeout(ir, 80);
}

function initGuia() {
  const tabs = [...document.querySelectorAll('.guia-tab')];
  if (!tabs.length) return;
  const generadores = { eeg: muestraEEG, mapeo: muestraMapeo, poligrafia: muestraPoligrafia, cpap: muestraCPAP };
  document.querySelectorAll('.muestra').forEach(fig => {
    const svg = fig.querySelector('svg');
    const gen = generadores[fig.dataset.muestra];
    if (svg && gen) svg.innerHTML = gen();
  });
  let visto = false;
  const activar = (id, foco) => {
    tabs.forEach(t => {
      const on = t.dataset.estudio === id;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      const panel = document.getElementById(t.getAttribute('aria-controls'));
      if (panel) {
        const yaVisible = !panel.hidden;
        panel.hidden = !on;
        if (on && !yaVisible) {
          panel.classList.remove('entrando');
          void panel.offsetWidth;
          if (!reduceMotion) panel.classList.add('entrando');
          if (visto) dibujar(panel.querySelector('.muestra'));
        }
      }
      if (on && foco) t.focus();
    });
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => activar(t.dataset.estudio));
    t.addEventListener('keydown', e => {
      let j = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') j = (i + 1) % tabs.length;
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') j = (i - 1 + tabs.length) % tabs.length;
      else if (e.key === 'Home') j = 0;
      else if (e.key === 'End') j = tabs.length - 1;
      if (j !== null) { e.preventDefault(); activar(tabs[j].dataset.estudio, true); }
    });
  });
  document.querySelectorAll('a[data-estudio]').forEach(a => a.addEventListener('click', () => activar(a.dataset.estudio)));
  const primera = () => {
    if (visto) return;
    visto = true;
    dibujar(document.querySelector('.guia-panel:not([hidden]) .muestra'));
  };
  const destino = document.querySelector('.guia-paneles');
  if ('IntersectionObserver' in window && destino && !reduceMotion) {
    const io = new IntersectionObserver(entradas => {
      if (entradas.some(x => x.isIntersecting)) { primera(); io.disconnect(); }
    }, { threshold: 0, rootMargin: '0px 0px -18% 0px' });
    io.observe(destino);
  } else {
    primera();
  }
}

function initEstado() {
  const els = document.querySelectorAll('[data-estado]');
  if (!els.length) return;
  const ahora = new Date(Date.now() - 3 * 3600e3);
  const dia = ahora.getUTCDay();
  const h = ahora.getUTCHours() + ahora.getUTCMinutes() / 60;
  const cierre = dia >= 1 && dia <= 5 ? 18 : dia === 6 ? 13 : 0;
  const abierto = cierre > 0 && h >= 9 && h < cierre;
  let texto;
  if (abierto) texto = `Abierto ahora · hasta las ${cierre} h`;
  else if (cierre > 0 && h < 9) texto = 'Cerrado ahora · abre hoy a las 9 h';
  else texto = (dia + 1) % 7 === 0 ? 'Cerrado ahora · abre el lunes a las 9 h' : 'Cerrado ahora · abre mañana a las 9 h';
  els.forEach(el => {
    el.textContent = texto;
    el.classList.add('con-estado');
    el.classList.toggle('abierto', abierto);
  });
}

function initMapa() {
  const el = document.getElementById('mapa');
  if (!el || typeof L === 'undefined') return;
  const pos = [-34.6328, -58.4831];
  const mapa = L.map(el, { scrollWheelZoom: false }).setView(pos, 16);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap', maxZoom: 19 }).addTo(mapa);
  const icono = L.divIcon({ className: 'pin', html: '<span></span>', iconSize: [34, 34], iconAnchor: [17, 40], popupAnchor: [0, -36] });
  L.marker(pos, { icon: icono, title: 'Neuro Test · Venancio Flores 3975', alt: 'Neuro Test' }).addTo(mapa)
    .bindPopup('<strong>Neuro Test</strong><br>Venancio Flores 3975, Floresta');
  window.addEventListener('load', () => mapa.invalidateSize());
}

function initVisor() {
  const visor = document.getElementById('visor');
  const botones = [...document.querySelectorAll('[data-visor]')];
  if (!visor || !botones.length) return;
  const img = visor.querySelector('img');
  const cap = visor.querySelector('figcaption');
  const cerrarBtn = visor.querySelector('.visor-cerrar');
  const fotos = botones.map(b => {
    const i = b.querySelector('img');
    return { src: i.getAttribute('src'), alt: i.alt, cap: i.dataset.cap || '' };
  });
  let idx = 0;
  let origen = null;
  const mostrar = n => {
    idx = (n + fotos.length) % fotos.length;
    img.src = fotos[idx].src;
    img.alt = fotos[idx].alt;
    cap.textContent = `${fotos[idx].cap} · Imagen ilustrativa`;
  };
  const abrir = n => {
    origen = document.activeElement;
    mostrar(n);
    visor.hidden = false;
    document.body.classList.add('no-scroll');
    cerrarBtn.focus();
  };
  const cerrar = () => {
    visor.hidden = true;
    document.body.classList.remove('no-scroll');
    origen?.focus();
  };
  botones.forEach((b, i) => b.addEventListener('click', () => abrir(i)));
  cerrarBtn.addEventListener('click', cerrar);
  visor.querySelector('.visor-prev')?.addEventListener('click', () => mostrar(idx - 1));
  visor.querySelector('.visor-next')?.addEventListener('click', () => mostrar(idx + 1));
  visor.addEventListener('click', e => { if (e.target === visor) cerrar(); });
  document.addEventListener('keydown', e => {
    if (visor.hidden) return;
    if (e.key === 'Escape') cerrar();
    else if (e.key === 'ArrowLeft') mostrar(idx - 1);
    else if (e.key === 'ArrowRight') mostrar(idx + 1);
    else if (e.key === 'Tab') {
      const foco = [...visor.querySelectorAll('button')];
      const i = foco.indexOf(document.activeElement);
      e.preventDefault();
      foco[(i + (e.shiftKey ? -1 : 1) + foco.length) % foco.length].focus();
    }
  });
}

function initConsulta() {
  const form = document.getElementById('consulta');
  if (!form) return;
  const vista = form.querySelector('[data-preview]');
  const nombre = form.elements.nombre;
  const zona = form.elements.zona;
  const error = document.getElementById('nombre-error');
  const valor = n => form.querySelector(`input[name="${n}"]:checked`)?.value || '';
  const armar = () => {
    const nom = nombre.value.trim();
    const z = zona.value.trim();
    let m = `Hola, soy ${nom || '(tu nombre)'}. Quiero consultar por ${valor('estudio')} ${valor('lugar')}`;
    if (z) m += ` (${z})`;
    m += '.';
    m += valor('cobertura') === 'OSOETSYLRA' ? ' Soy afiliado/a a OSOETSYLRA.' : ' Sería de forma particular.';
    return m;
  };
  const pintar = () => { if (vista) vista.textContent = armar(); };
  form.addEventListener('input', pintar);
  form.addEventListener('change', pintar);
  pintar();
  nombre.addEventListener('input', () => {
    if (nombre.value.trim()) { nombre.removeAttribute('aria-invalid'); if (error) error.hidden = true; }
  });
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!nombre.value.trim()) {
      nombre.setAttribute('aria-invalid', 'true');
      if (error) error.hidden = false;
      nombre.focus();
      showToast('Escribí tu nombre para saber a quién responder.');
      return;
    }
    window.open(`https://wa.me/${WSP}?text=${encodeURIComponent(armar())}`, '_blank', 'noopener');
    showToast('Abrimos WhatsApp con tu consulta lista para enviar.');
  });
}

function initFaq() {
  document.querySelectorAll('details.faq').forEach(d => d.addEventListener('toggle', () => {
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  }));
}

initGuia();
initReveals();
initNav();
initWspFloat();
initModelBarScroll();
initHeroMotion();
initEstado();
initMapa();
initVisor();
initConsulta();
initFaq();
