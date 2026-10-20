const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WA = '5493548613886';
const GALERIA = [
  { src: 'images/telon-utileria.webp', w: 1672, h: 941, alt: 'Telón rojo con un tambor de circo, una pelota con estrellas, aros y valijas antiguas' },
  { src: 'images/escenario-aire-libre.webp', w: 1254, h: 1254, alt: 'Escenario al aire libre con cortinas rojas, luces y una valija antigua' },
  { src: 'images/salon-escolar.webp', w: 1254, h: 1254, alt: 'Salón de una escuela con telón rojo, banderines y bancos listos para la función' },
  { src: 'images/aros-valija.webp', w: 1254, h: 1254, alt: 'Aros de malabares rojo, amarillo y azul apoyados en una valija antigua' },
  { src: 'images/diabolo.webp', w: 1254, h: 1254, alt: 'Diábolo de colores con sus varillas sobre una mesa de madera' },
  { src: 'images/pelotas-malabares.webp', w: 1254, h: 1254, alt: 'Tres pelotas de malabares de colores sobre un escenario de madera' },
  { src: 'images/nariz-mono.webp', w: 1254, h: 1254, alt: 'Nariz roja de payasa y moño rojo a lunares sobre madera' },
  { src: 'images/panuelos-valija.webp', w: 1254, h: 1254, alt: 'Pañuelos de malabares de colores saliendo de una valija roja' },
  { src: 'images/valija-clavas.webp', w: 941, h: 1672, alt: 'Valija roja abierta con clavas de malabares frente al telón' }
];

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
  if (img) tl.from(img, { scale: 1.1, duration: 1.8, clearProps: 'transform' }, 0);
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.sello'), { scale: 0.92, rotation: -8, opacity: 0, duration: 1.1, ease: 'back.out(1.6)', clearProps: 'transform,opacity' }, 0.65);
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

function initEscena() {
  const rec = document.querySelector('[data-escena]');
  if (!rec) return;
  const fotos = [...rec.querySelectorAll('.show__foto')];
  const textos = [...rec.querySelectorAll('.show__texto')];
  const marcas = [...rec.querySelectorAll('.show__marca')];
  const contador = rec.querySelector('[data-contador]');
  const N = Math.min(textos.length, 4);
  if (!N) return;
  const clamp01 = v => Math.max(0, Math.min(1, v));
  let actual = -1;
  let frame = 0;
  const activar = i => {
    if (i === actual) return;
    actual = i;
    fotos.forEach((f, k) => f.classList.toggle('is-on', k === i));
    textos.forEach((t, k) => {
      t.classList.toggle('is-on', k === i);
      t.setAttribute('aria-hidden', k === i ? 'false' : 'true');
    });
    marcas.forEach((m, k) => {
      m.classList.toggle('is-on', k === i);
      if (k === i) m.setAttribute('aria-current', 'step'); else m.removeAttribute('aria-current');
    });
    if (contador) contador.textContent = String(i + 1).padStart(2, '0');
  };
  const update = () => {
    frame = 0;
    const total = rec.offsetHeight - window.innerHeight;
    const p = total > 0 ? clamp01(-rec.getBoundingClientRect().top / total) : 0;
    const i = Math.min(N - 1, Math.floor(p * N * 0.9999));
    activar(i);
    const local = clamp01(p * N - i);
    marcas.forEach((m, k) => m.style.setProperty('--lleno', k < i ? '1' : k === i ? local.toFixed(3) : '0'));
    if (!reduceMotion && fotos[i]) fotos[i].style.setProperty('--zoom', (1.07 - local * 0.07).toFixed(4));
  };
  const pedir = () => { if (!frame) frame = requestAnimationFrame(update); };
  window.addEventListener('scroll', pedir, { passive: true });
  window.addEventListener('resize', pedir, { passive: true });
  marcas.forEach((m, k) => m.addEventListener('click', () => {
    const total = rec.offsetHeight - window.innerHeight;
    const top = rec.getBoundingClientRect().top + window.scrollY + total * ((k + 0.5) / N);
    window.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' });
  }));
  update();
}

function atraparFoco(e, cont) {
  const f = [...cont.querySelectorAll('button, a[href], video, [tabindex]:not([tabindex="-1"])')].filter(el => el.getClientRects().length);
  if (!f.length) return;
  const first = f[0];
  const last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

function initVisor() {
  const visor = document.getElementById('visor');
  if (!visor) return;
  const img = visor.querySelector('.visor__img');
  const texto = visor.querySelector('.visor__texto');
  const cuenta = visor.querySelector('.visor__cuenta');
  let idx = 0;
  let ultimoFoco = null;
  const pintar = () => {
    const f = GALERIA[idx];
    if (!f) return;
    img.src = f.src;
    img.width = f.w;
    img.height = f.h;
    img.alt = f.alt;
    texto.textContent = f.alt;
    cuenta.textContent = `${idx + 1} / ${GALERIA.length}`;
  };
  const abrir = i => {
    idx = Math.max(0, Math.min(GALERIA.length - 1, i));
    pintar();
    ultimoFoco = document.activeElement;
    visor.hidden = false;
    document.body.classList.add('no-scroll');
    visor.querySelector('.visor__cerrar')?.focus();
  };
  const cerrar = () => {
    visor.hidden = true;
    document.body.classList.remove('no-scroll');
    ultimoFoco?.focus();
  };
  const mover = d => { idx = (idx + d + GALERIA.length) % GALERIA.length; pintar(); };
  document.querySelectorAll('[data-foto]').forEach(b => b.addEventListener('click', () => abrir(Number(b.dataset.foto) || 0)));
  visor.querySelectorAll('[data-cerrar-visor]').forEach(b => b.addEventListener('click', cerrar));
  visor.querySelectorAll('[data-visor]').forEach(b => b.addEventListener('click', () => mover(Number(b.dataset.visor))));
  visor.addEventListener('keydown', e => {
    if (e.key === 'Escape') cerrar();
    else if (e.key === 'ArrowRight') mover(1);
    else if (e.key === 'ArrowLeft') mover(-1);
    else if (e.key === 'Tab') atraparFoco(e, visor);
  });
  let x0 = null;
  const figura = visor.querySelector('.visor__figura');
  figura?.addEventListener('pointerdown', e => { x0 = e.clientX; });
  figura?.addEventListener('pointerup', e => {
    if (x0 === null) return;
    const dx = e.clientX - x0;
    x0 = null;
    if (Math.abs(dx) > 50) mover(dx < 0 ? 1 : -1);
  });
}

function initVideos() {
  const visor = document.getElementById('visor-video');
  if (!visor) return;
  const caja = visor.querySelector('.visor__video');
  let ultimo = null;
  const cerrar = () => {
    caja.innerHTML = '';
    visor.hidden = true;
    document.body.classList.remove('no-scroll');
    ultimo?.focus();
  };
  document.querySelectorAll('.video-card').forEach(card => {
    const src = (card.dataset.video || '').trim();
    if (!src) return;
    card.removeAttribute('target');
    card.addEventListener('click', e => {
      e.preventDefault();
      ultimo = card;
      caja.innerHTML = `<video src="${esc(src)}" controls autoplay playsinline></video>`;
      visor.hidden = false;
      document.body.classList.add('no-scroll');
      visor.querySelector('.visor__cerrar')?.focus();
    });
  });
  visor.querySelectorAll('[data-cerrar-video]').forEach(b => b.addEventListener('click', cerrar));
  visor.addEventListener('keydown', e => {
    if (e.key === 'Escape') cerrar();
    else if (e.key === 'Tab') atraparFoco(e, visor);
  });
}

function initDosier() {
  const btns = document.querySelectorAll('[data-imprimir-dosier]');
  const hoja = document.getElementById('dosier');
  if (!btns.length || !hoja) return;
  const armar = () => {
    let print = document.getElementById('print-dosier');
    if (print) return;
    print = document.createElement('div');
    print.id = 'print-dosier';
    print.setAttribute('aria-hidden', 'true');
    const marca = document.querySelector('.site-header .wm');
    const p = document.createElement('p');
    p.className = 'print-dosier__marca';
    if (marca) p.appendChild(marca.cloneNode(true));
    print.appendChild(p);
    const copia = hoja.cloneNode(true);
    [copia, ...copia.querySelectorAll('[id]')].forEach(el => el.removeAttribute('id'));
    copia.removeAttribute('aria-labelledby');
    copia.querySelectorAll('[data-animate]').forEach(el => { el.removeAttribute('data-animate'); el.removeAttribute('style'); });
    copia.querySelector('.dosier__acciones')?.remove();
    print.appendChild(copia);
    const contacto = document.createElement('p');
    contacto.className = 'print-dosier__contacto';
    contacto.textContent = 'WhatsApp +54 9 3548 61-3886 · Instagram @payasa_manzanita · Valle de Punilla, Córdoba';
    print.appendChild(contacto);
    document.body.appendChild(print);
  };
  btns.forEach(b => b.addEventListener('click', () => {
    armar();
    document.documentElement.classList.add('imprimiendo');
    const quitar = () => {
      document.documentElement.classList.remove('imprimiendo');
      window.removeEventListener('afterprint', quitar);
    };
    window.addEventListener('afterprint', quitar);
    showToast('Elegí «Guardar como PDF» para descargar el dosier.');
    setTimeout(() => window.print(), 300);
  }));
}

function formatearFecha(v) {
  const [a, m, d] = v.split('-').map(Number);
  if (!a || !m || !d) return v;
  return new Date(a, m - 1, d).toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

function initConsulta() {
  const form = document.getElementById('consulta');
  if (!form) return;
  const errTipo = document.getElementById('error-tipo');
  const errLoc = document.getElementById('error-localidad');
  const loc = form.querySelector('#c-localidad');
  const fecha = form.querySelector('#c-fecha');
  const hoy = new Date();
  if (fecha) fecha.min = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;
  form.addEventListener('change', e => { if (e.target.name === 'tipo' && errTipo) errTipo.hidden = true; });
  loc?.addEventListener('input', () => {
    if (loc.value.trim()) { if (errLoc) errLoc.hidden = true; loc.removeAttribute('aria-invalid'); }
  });
  form.addEventListener('submit', e => {
    e.preventDefault();
    const tipo = form.querySelector('input[name="tipo"]:checked')?.value || '';
    const localidad = loc?.value.trim() || '';
    if (errTipo) errTipo.hidden = !!tipo;
    if (errLoc) errLoc.hidden = !!localidad;
    if (localidad) loc?.removeAttribute('aria-invalid'); else loc?.setAttribute('aria-invalid', 'true');
    if (!tipo) { form.querySelector('input[name="tipo"]')?.focus(); return; }
    if (!localidad) { loc?.focus(); return; }
    const publico = form.querySelector('#c-publico')?.value || '';
    const nombre = form.querySelector('#c-nombre')?.value.trim() || '';
    const lineas = ['Hola Manzanita! Te escribo desde tu web.', `Evento: ${tipo}`];
    if (fecha?.value) lineas.push(`Fecha: ${formatearFecha(fecha.value)}`);
    lineas.push(`Localidad: ${localidad}`);
    if (publico) lineas.push(`Público: ${publico}`);
    if (nombre) lineas.push(`Mi nombre: ${nombre}`);
    lineas.push('¿Tenés disponibilidad?');
    const url = `https://wa.me/${WA}?text=${encodeURIComponent(lineas.join('\n'))}`;
    const btn = form.querySelector('button[type="submit"]');
    if (btn) btn.disabled = true;
    window.open(url, '_blank', 'noopener');
    showToast('Abrimos WhatsApp con tu consulta lista para enviar.');
    setTimeout(() => { if (btn) btn.disabled = false; }, 800);
  });
}

function initFaq() {
  document.querySelectorAll('.faq details').forEach(d => d.addEventListener('toggle', () => {
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  }));
}

initHeroMotion();
initReveals();
initNav();
initWspFloat();
initModelBarScroll();
initEscena();
initVisor();
initVideos();
initDosier();
initConsulta();
initFaq();
