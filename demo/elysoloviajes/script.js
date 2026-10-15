const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5491126390300';

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

const DESTINOS = {
  iguazu: {
    nombre: 'Cataratas del Iguazú', rumbo: 'N', punto: 'Norte', region: 'Misiones',
    img: 'images/cataratas-iguazu.webp', alt: 'Saltos de las Cataratas del Iguazú rodeados de selva',
    desc: 'Pasarelas sobre los saltos, la Garganta del Diablo y la selva misionera alrededor.',
    ver: ['Garganta del Diablo', 'Circuitos superior e inferior', 'Selva misionera'],
    epoca: 'Todo el año',
    msg: 'Hola Ely! Quiero consultar por un viaje a Cataratas del Iguazú.'
  },
  playas: {
    nombre: 'Playas argentinas', rumbo: 'E', punto: 'Este', region: 'Costa Atlántica',
    img: 'images/playas-argentinas.webp', alt: 'Playa de agua turquesa con rocas y montañas al fondo',
    desc: 'Arena, mar y días largos de verano, con el alojamiento y las comidas resueltos.',
    ver: ['Playa y mar', 'Paseos por la costa', 'Atardeceres de verano'],
    epoca: 'De diciembre a marzo',
    msg: 'Hola Ely! Quiero consultar por un viaje a las playas argentinas.'
  },
  mendoza: {
    nombre: 'Mendoza', rumbo: 'O', punto: 'Oeste', region: 'Cuyo',
    img: 'images/vinedos-mendoza.webp', alt: 'Copa de vino tinto sobre un barril frente a viñedos y la cordillera',
    desc: 'Bodegas, viñedos y la cordillera de fondo, para recorrer con calma y buena mesa.',
    ver: ['Bodegas y degustaciones', 'Alta montaña y Aconcagua', 'Valle de Uco'],
    epoca: 'Todo el año, con la vendimia en marzo',
    msg: 'Hola Ely! Quiero consultar por un viaje a Mendoza.'
  },
  patagonia: {
    nombre: 'Patagonia', rumbo: 'S', punto: 'Sur', region: 'Santa Cruz',
    img: 'images/glaciar-patagonia.webp', alt: 'Viajera frente al glaciar Perito Moreno',
    desc: 'El glaciar Perito Moreno desde las pasarelas, lagos turquesa y montaña nevada.',
    ver: ['Glaciar Perito Moreno', 'Pasarelas frente al hielo', 'Lagos y cordillera'],
    epoca: 'De octubre a abril',
    msg: 'Hola Ely! Quiero consultar por un viaje a la Patagonia.'
  }
};

const REGIMENES = {
  desayuno: {
    texto: 'Arrancás el día con el desayuno del hotel y el resto lo comés donde quieras. Para los que disfrutan probar la cocina de cada lugar.',
    cena: 'Por tu cuenta, donde quieras',
    cenaIncluida: false,
    cta: 'Consultar con desayuno',
    msg: 'Hola Ely! Quiero consultar por un viaje con alojamiento y desayuno.'
  },
  media: {
    texto: 'Desayuno y una comida principal en el hotel. Para tener el día resuelto y saber de antemano cuánto vas a gastar en comidas.',
    cena: 'Incluida en el hotel',
    cenaIncluida: true,
    cta: 'Consultar con media pensión',
    msg: 'Hola Ely! Quiero consultar por un viaje con media pensión.'
  }
};

const ICON_CHECK = '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';
const ICON_CAMA = '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8"/><path d="M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4"/><path d="M12 4v6"/><path d="M2 18h20"/></svg>';
const ICON_WSP = '<svg class="wsp-glyph" viewBox="0 0 32 32" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>';

const wspUrl = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;

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

function initModalDestino() {
  const modal = document.getElementById('modalDestino');
  if (!modal) return;
  const panel = modal.querySelector('.modal-panel');
  const cuerpo = modal.querySelector('[data-modal-cuerpo]');
  let ultimoFoco = null;
  let timer = 0;

  const focusables = () => [...panel.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')].filter(el => el.getClientRects().length);

  const cerrar = () => {
    if (modal.hidden) return;
    modal.classList.remove('open');
    document.body.classList.remove('no-scroll');
    clearTimeout(timer);
    timer = setTimeout(() => { modal.hidden = true; }, reduceMotion ? 0 : 320);
    ultimoFoco?.focus?.();
  };

  const abrir = (id, origen) => {
    const d = DESTINOS[id];
    if (!d) return;
    ultimoFoco = origen || document.activeElement;
    cuerpo.innerHTML = `
      <div class="modal-media"><img src="${d.img}" width="1000" height="1000" alt="${esc(d.alt)}"><span class="rumbo" aria-hidden="true">${d.rumbo}</span></div>
      <div class="modal-cuerpo">
        <p class="destino-region">${esc(d.punto)} · ${esc(d.region)}</p>
        <h3>${esc(d.nombre)}</h3>
        <p>${esc(d.desc)}</p>
        <p class="modal-subt">Qué conocer</p>
        <ul class="modal-ver">${d.ver.map(v => `<li>${ICON_CHECK}${esc(v)}</li>`).join('')}</ul>
        <p class="modal-epoca"><strong>Mejor época:</strong> ${esc(d.epoca)}</p>
        <p class="modal-incluye">${ICON_CAMA}<span>Alojamiento con desayuno o media pensión, a elección.</span></p>
        <a class="btn btn--cta btn--wsp" href="${wspUrl(d.msg)}" target="_blank" rel="noopener">${ICON_WSP}Consultar este viaje</a>
      </div>`;
    modal.setAttribute('aria-label', `Viaje a ${d.nombre}`);
    clearTimeout(timer);
    modal.hidden = false;
    document.body.classList.add('no-scroll');
    requestAnimationFrame(() => requestAnimationFrame(() => modal.classList.add('open')));
    modal.querySelector('.modal-cerrar')?.focus();
  };

  document.querySelectorAll('[data-destino]').forEach(btn => {
    btn.addEventListener('click', () => abrir(btn.dataset.destino, btn));
  });
  modal.querySelectorAll('[data-cerrar]').forEach(el => el.addEventListener('click', cerrar));
  document.addEventListener('keydown', e => {
    if (modal.hidden) return;
    if (e.key === 'Escape') { e.preventDefault(); cerrar(); return; }
    if (e.key === 'Tab') {
      const f = focusables();
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
}

function initRegimen() {
  const box = document.querySelector('[data-regimen]');
  if (!box) return;
  const botones = box.querySelectorAll('[data-reg]');
  const texto = box.querySelector('[data-reg-texto]');
  const cena = box.querySelector('[data-cena]');
  const cenaEstado = box.querySelector('[data-cena-estado]');
  const cenaMarca = box.querySelector('[data-cena-marca]');
  const cta = box.querySelector('[data-reg-cta]');
  const ctaLabel = cta?.querySelector('span');

  const aplicar = clave => {
    const r = REGIMENES[clave];
    if (!r) return;
    botones.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.reg === clave)));
    if (texto) texto.textContent = r.texto;
    if (cena) cena.classList.toggle('is-incluida', r.cenaIncluida);
    if (cenaEstado) cenaEstado.textContent = r.cena;
    if (cenaMarca) cenaMarca.textContent = r.cenaIncluida ? 'Incluida' : 'Libre';
    if (cta) cta.href = wspUrl(r.msg);
    if (ctaLabel) ctaLabel.textContent = r.cta;
  };
  botones.forEach(b => b.addEventListener('click', () => aplicar(b.dataset.reg)));
}

function initConsulta() {
  const form = document.getElementById('consultaForm');
  if (!form) return;
  const nombre = form.querySelector('#c-nombre');
  const destino = form.querySelector('#c-destino');
  const mes = form.querySelector('#c-mes');
  const viajeros = form.querySelector('#c-viajeros');
  const comentario = form.querySelector('#c-comentario');
  const boton = form.querySelector('button[type="submit"]');

  form.querySelectorAll('[data-paso]').forEach(b => b.addEventListener('click', () => {
    const v = Math.min(20, Math.max(1, (parseInt(viajeros.value, 10) || 1) + Number(b.dataset.paso)));
    viajeros.value = v;
  }));

  const marcar = (campo, msg) => {
    const err = form.querySelector(`#${campo.id}-error`);
    campo.setAttribute('aria-invalid', msg ? 'true' : 'false');
    if (err) err.textContent = msg || '';
    return !msg;
  };
  nombre.addEventListener('input', () => { if (nombre.getAttribute('aria-invalid') === 'true') marcar(nombre, nombre.value.trim().length >= 2 ? '' : 'Contanos tu nombre para saber a quién responder.'); });
  destino.addEventListener('change', () => marcar(destino, destino.value ? '' : 'Elegí un destino, o «Otro destino».'));

  form.addEventListener('submit', e => {
    e.preventDefault();
    const okNombre = marcar(nombre, nombre.value.trim().length >= 2 ? '' : 'Contanos tu nombre para saber a quién responder.');
    const okDestino = marcar(destino, destino.value ? '' : 'Elegí un destino, o «Otro destino».');
    if (!okNombre || !okDestino) {
      (okNombre ? destino : nombre).focus();
      showToast('Faltan un par de datos para armar la consulta.');
      return;
    }
    const n = Math.min(20, Math.max(1, parseInt(viajeros.value, 10) || 1));
    const reg = form.querySelector('input[name="regimen"]:checked')?.value || '';
    const dest = destino.value === 'otro' ? 'un destino que todavía no está en la web' : (DESTINOS[destino.value]?.nombre || destino.value);
    let msg = `Hola Ely! Soy ${nombre.value.trim()}. Quiero consultar por un viaje a ${dest}`;
    if (mes.value) msg += `, para ${mes.value}`;
    msg += `. Somos ${n} ${n === 1 ? 'persona' : 'personas'}`;
    if (reg) msg += reg === 'a definir' ? ' y todavía no sabemos si con desayuno o media pensión' : `, con ${reg}`;
    msg += '.';
    if (comentario.value.trim()) msg += ` ${comentario.value.trim()}`;

    boton.disabled = true;
    const label = boton.querySelector('span');
    const original = label.textContent;
    label.textContent = 'Abriendo WhatsApp…';
    setTimeout(() => {
      window.open(wspUrl(msg), '_blank', 'noopener');
      showToast('Tu consulta quedó lista en WhatsApp: solo falta enviarla.');
      boton.disabled = false;
      label.textContent = original;
    }, 800);
  });
}

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const img = hero.querySelector('[data-hero-img]');
  if (img) tl.from(img, { scale: 1.1, duration: 1.8 }, 0);
  tl.from(hero.querySelectorAll('.hero-logo'), { scale: 0.92, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.05)
    .from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.15)
    .from(hero.querySelectorAll('h1'), { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.25)
    .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6);
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  const foto = document.querySelector('.hero--foto .hero-media img');
  if (!foto) return;
  gsap.to(foto, { yPercent: 5, ease: 'none', scrollTrigger: { trigger: '.hero--foto', start: 'top top', end: 'bottom top', scrub: true } });
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

initModelBarScroll();
initNav();
initWspFloat();
initModalDestino();
initRegimen();
initConsulta();
initHeroMotion();
initParallax();
initReveals();
