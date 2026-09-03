const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}
if (typeof gsap === 'undefined') {
  document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
}
if (typeof ScrollTrigger !== 'undefined') {
  window.addEventListener('load', () => ScrollTrigger.refresh());
}

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
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

const WSP = '5493476200458';

/* ---------- NAV ---------- */
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
  const desktopMq = window.matchMedia('(min-width: 769px)');
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

/* ---------- REVEALS ---------- */
function initReveals() {
  const items = document.querySelectorAll('[data-animate]');
  if (!items.length) return;
  document.querySelectorAll('[data-animate-stagger]').forEach(parent => {
    parent.querySelectorAll('[data-animate]').forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i * 0.12, 0.72)}s`;
    });
  });
  if (!('IntersectionObserver' in window) || reduceMotion) {
    items.forEach(el => el.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); }
    });
  }, { threshold: 0, rootMargin: '0px 0px -7% 0px' });
  items.forEach(el => io.observe(el));

  let queued = false;
  const sweep = () => {
    queued = false;
    let pending = 0;
    items.forEach(el => {
      if (el.classList.contains('in')) return;
      const r = el.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight) { el.classList.add('in'); io.unobserve(el); }
      else pending++;
    });
    if (!pending) {
      window.removeEventListener('scroll', queueSweep);
      window.removeEventListener('resize', queueSweep);
    }
  };
  const queueSweep = () => { if (!queued) { queued = true; requestAnimationFrame(sweep); } };
  window.addEventListener('load', queueSweep);
  window.addEventListener('scroll', queueSweep, { passive: true });
  window.addEventListener('resize', queueSweep, { passive: true });
}

/* ---------- WHATSAPP FLOTANTE ---------- */
function initWspFloat() {
  const btn = document.getElementById('wsp-float');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) btn.classList.add('visible'); else btn.classList.remove('visible');
  }, { passive: true });
}

/* ---------- HERO: entrada, contadores y sello ---------- */
function initHero() {
  document.querySelectorAll('.hero-copy > [data-animate]').forEach((el, i) => {
    el.style.transitionDelay = `${(0.06 + i * 0.11).toFixed(2)}s`;
  });
  const scene = document.querySelector('.hero-scene');
  if (scene) scene.style.transitionDelay = '0.32s';

  const nums = document.querySelectorAll('#heroAsiento [data-count]');
  const sello = document.getElementById('heroSello');
  if (!nums.length) return;

  if (reduceMotion) {
    nums.forEach(n => { n.textContent = n.dataset.count; });
    sello?.classList.add('on');
    return;
  }

  const cerrar = () => {
    nums.forEach(n => { n.textContent = n.dataset.count; });
    sello?.classList.add('on');
  };

  const run = () => {
    const dur = 1150;
    let t0 = null;
    const tick = t => {
      if (t0 === null) t0 = t;
      const p = Math.min(1, (t - t0) / dur);
      const e = 1 - Math.pow(1 - p, 3);
      nums.forEach(n => { n.textContent = Math.round(parseInt(n.dataset.count, 10) * e); });
      if (p < 1) requestAnimationFrame(tick);
      else setTimeout(() => sello?.classList.add('on'), 200);
    };
    requestAnimationFrame(tick);
  };
  setTimeout(run, 950);
  setTimeout(() => { if (!sello || !sello.classList.contains('on')) cerrar(); }, 7000);
}

/* ---------- BLOQUE INTERACTIVO: el asiento de tu situación ---------- */
const PERFILES = {
  mono: {
    frase: 'soy monotributista',
    servicio: 'Monotributo integral',
    debe: [
      'Pago mensual de la cuota, con vencimiento fijo todos los meses',
      'Recategorización semestral según lo que hayas facturado',
      'Facturación electrónica emitida y respaldada',
      'Control del tope de tu categoría durante todo el año',
    ],
    haber: [
      'Alta, categoría y clave fiscal en orden desde el día uno',
      'Recategorización calculada y presentada en término',
      'Punto de venta y facturación configurados y andando',
      'Aviso antes de que el volumen te empuje de categoría',
    ],
  },
  dependencia: {
    frase: 'trabajo en relación de dependencia',
    servicio: 'Personas humanas',
    debe: [
      'Declaración jurada de Ganancias si superás el mínimo',
      'Bienes Personales si tenés bienes alcanzados',
      'SIRADIG con todas tus deducciones cargadas',
      'Comprobantes de deducciones guardados todo el año',
    ],
    haber: [
      'Cálculo de si te corresponde presentar, antes de presentar',
      'Ganancias y Bienes Personales armadas y presentadas',
      'SIRADIG cargado con cada deducción que te corresponda',
      'Revisión de retenciones para que no pagues de más',
    ],
  },
  empleador: {
    frase: 'tengo empleados a cargo',
    servicio: 'Sueldos y cargas sociales',
    debe: [
      'Recibos de sueldo en fecha, todos los meses',
      'F.931 y cargas sociales presentadas y pagas',
      'Altas, bajas y modificaciones informadas en ARCA',
      'SAC, vacaciones y libro de sueldos al día',
    ],
    haber: [
      'Liquidación mensual y recibos listos para firmar',
      'F.931 presentado y con su volante de pago',
      'Altas, bajas y modificaciones tramitadas por el estudio',
      'SAC, vacaciones y libro de sueldos llevados todo el año',
    ],
  },
  empresa: {
    frase: 'tengo una empresa o sociedad',
    servicio: 'Empresas y sociedades',
    debe: [
      'Declaración jurada mensual de IVA, con libros de compras y ventas',
      'Ganancias de la sociedad y sus anticipos',
      'Ingresos Brutos y Convenio Multilateral',
      'Estados contables anuales con firma profesional',
    ],
    haber: [
      'IVA mensual, libros y retenciones al día',
      'Ganancias, anticipos y ajustes calculados y presentados',
      'Ingresos Brutos y Convenio presentados en cada jurisdicción',
      'Balance, memoria y firma al cierre del ejercicio',
    ],
  },
};

const ESTADOS = {
  aldia: {
    frase: 'estoy al día con las presentaciones',
    por: {
      mono: 'Con todo en orden, el trabajo es sostenerlo: recategorización a tiempo, control de tope y aviso antes de cada vencimiento.',
      dependencia: 'Al día, el foco pasa a que no pagues de más: deducciones cargadas y retenciones revisadas una por una.',
      empleador: 'Con la nómina en orden, el trabajo es que ningún mes se atrase y que cada novedad entre antes del cierre.',
      empresa: 'Con los libros al día, el balance deja de ser una carrera contra reloj en marzo.',
    },
  },
  atrasado: {
    frase: 'vengo atrasado con las presentaciones',
    por: {
      mono: 'Primero se regulariza: se revisa qué falta presentar, se arma el plan y recién ahí se sostiene el mes a mes.',
      dependencia: 'Se reconstruyen los períodos que faltan y se presentan; después queda el calendario armado y andando.',
      empleador: 'Se ordena la nómina período por período y se presenta lo pendiente antes de que siga creciendo.',
      empresa: 'Se reconstruye la contabilidad desde el último período cerrado y se regulariza lo que quedó abierto.',
    },
  },
  arrancando: {
    frase: 'recién estoy arrancando',
    por: {
      mono: 'Se arranca por el alta, la categoría correcta y el punto de venta: hacerlo bien la primera vez sale más barato que corregirlo.',
      dependencia: 'Se empieza por ver si te corresponde presentar, que no siempre es que sí.',
      empleador: 'Antes del primer recibo hay que dar el alta como empleador y encuadrar el convenio: eso va primero.',
      empresa: 'Se define el esquema contable e impositivo desde el arranque, para no rehacerlo en el primer balance.',
    },
  },
};

function initTablero() {
  const chipsPerfil = document.querySelectorAll('#tbPerfil .chip');
  const chipsEstado = document.querySelectorAll('#tbEstado .chip');
  const ulDebe = document.getElementById('tbDebe');
  const ulHaber = document.getElementById('tbHaber');
  const elServicio = document.getElementById('tbServicio');
  const elPor = document.getElementById('tbPor');
  const elCta = document.getElementById('tbCta');
  if (!ulDebe || !ulHaber || !elServicio) return;

  let perfil = 'mono';
  let estado = 'aldia';

  const pintarLista = (ul, items) => {
    ul.innerHTML = items.map((t, i) =>
      `<li style="animation-delay:${(i * 0.06).toFixed(2)}s">${esc(t)}</li>`
    ).join('');
  };

  const render = () => {
    const p = PERFILES[perfil];
    const e = ESTADOS[estado];
    if (!p || !e) return;
    pintarLista(ulDebe, p.debe);
    pintarLista(ulHaber, p.haber);
    elServicio.textContent = p.servicio;
    elPor.textContent = e.por?.[perfil] || '';
    if (elCta) {
      const msg = `Hola Priscila, vi la web. ${p.frase.charAt(0).toUpperCase() + p.frase.slice(1)} y ${e.frase}. Quería consultar por ${p.servicio}.`;
      elCta.href = `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
    }
  };

  const marcar = (lista, activo, attr) => {
    lista.forEach(c => {
      const on = c.dataset[attr] === activo;
      c.classList.toggle('is-on', on);
      c.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  };

  chipsPerfil.forEach(c => c.addEventListener('click', () => {
    perfil = c.dataset.perfil;
    marcar(chipsPerfil, perfil, 'perfil');
    render();
  }));
  chipsEstado.forEach(c => c.addEventListener('click', () => {
    estado = c.dataset.estado;
    marcar(chipsEstado, estado, 'estado');
    render();
  }));

  render();
}

/* ---------- EJE DEL LIBRO MAYOR ---------- */
function initMayorEje() {
  const fill = document.getElementById('mayorEjeFill');
  const list = document.getElementById('mayorList');
  if (!fill || !list) return;
  const rows = [...list.querySelectorAll('.srow')];

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) {
    fill.style.transform = 'scaleY(1)';
    rows.forEach(r => r.classList.add('lit'));
    return;
  }
  ScrollTrigger.create({
    trigger: list,
    start: 'top 78%',
    end: 'bottom 62%',
    scrub: 0.5,
    invalidateOnRefresh: true,
    onUpdate: self => {
      fill.style.transform = `scaleY(${self.progress})`;
      const hasta = self.progress * rows.length;
      rows.forEach((r, i) => r.classList.toggle('lit', i < hasta));
    },
  });
}

/* ---------- TEXTO QUE SE LEE CON EL SCROLL ---------- */
function initLeeScroll() {
  const els = document.querySelectorAll('[data-lee]');
  if (!els.length) return;
  els.forEach(el => {
    const palabras = el.textContent.trim().split(/\s+/);
    if (palabras.length < 2) return;
    el.textContent = '';
    palabras.forEach((palabra, i) => {
      const s = document.createElement('span');
      s.className = 'lee-w';
      s.textContent = palabra;
      el.appendChild(s);
      if (i < palabras.length - 1) el.appendChild(document.createTextNode(' '));
    });
  });
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) {
    document.querySelectorAll('.lee-w').forEach(w => w.classList.add('on'));
    return;
  }
  els.forEach(el => {
    const ws = el.querySelectorAll('.lee-w');
    if (!ws.length) return;
    ScrollTrigger.create({
      trigger: el, start: 'top 82%', end: 'bottom 55%', scrub: 0.4, invalidateOnRefresh: true,
      onUpdate: self => {
        const hasta = self.progress * ws.length;
        ws.forEach((w, i) => w.classList.toggle('on', i < hasta));
      },
    });
  });
}

/* ---------- FORM DE CONTACTO (demo) ---------- */
function initForm() {
  const form = document.getElementById('cform');
  if (!form) return;
  const btn = document.getElementById('cfSubmit');
  const campos = [
    { id: 'cf-nombre', err: 'err-nombre', test: v => v.trim().length >= 2, msg: 'Poné tu nombre.' },
    { id: 'cf-email', err: 'err-email', test: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()), msg: 'Revisá el correo.' },
    { id: 'cf-msg', err: 'err-msg', test: v => v.trim().length >= 8, msg: 'Contanos un poco más.' },
  ];

  campos.forEach(c => {
    const input = document.getElementById(c.id);
    input?.addEventListener('input', () => {
      if (c.test(input.value)) {
        input.closest('.cf-field')?.classList.remove('err');
        input.removeAttribute('aria-invalid');
        const e = document.getElementById(c.err);
        if (e) e.textContent = '';
      }
    });
  });

  form.addEventListener('submit', ev => {
    ev.preventDefault();
    let ok = true;
    let primero = null;
    campos.forEach(c => {
      const input = document.getElementById(c.id);
      const err = document.getElementById(c.err);
      if (!input) return;
      const valido = c.test(input.value);
      input.closest('.cf-field')?.classList.toggle('err', !valido);
      if (valido) { input.removeAttribute('aria-invalid'); } else { input.setAttribute('aria-invalid', 'true'); }
      if (err) err.textContent = valido ? '' : c.msg;
      if (!valido) { ok = false; if (!primero) primero = input; }
    });
    if (!ok) { primero?.focus(); return; }

    const original = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Enviando…';
    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = original;
      form.reset();
      showToast('¡Gracias! El envío de mensajes se activa al pasar la web a producción.');
    }, 800);
  });
}

/* ---------- DEVOLUCIÓN DE DEMO ---------- */
const GKY_SLUG_ACENTOS = { 'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u', 'ñ': 'n', 'ü': 'u' };
function gkySlugify(s) {
  return String(s || '').toLowerCase()
    .replace(/[áéíóúñü]/g, c => GKY_SLUG_ACENTOS[c] || c)
    .replace(/[^a-z0-9]/g, '');
}

function initFeedbackFloat() {
  const GKY_FEEDBACK_WHATSAPP = '5491125068578';
  const btn = document.getElementById('feedback-float');
  const backdrop = document.getElementById('feedback-modal-backdrop');
  const closeBtn = document.getElementById('feedback-modal-close');
  const starsWrap = document.getElementById('feedback-stars');
  const coloresEl = document.getElementById('feedback-colores');
  const contenidoEl = document.getElementById('feedback-contenido');
  const otrosEl = document.getElementById('feedback-otros');
  const submitBtn = document.getElementById('feedback-submit');
  if (!btn || !backdrop) return;

  const stars = [...starsWrap.querySelectorAll('.feedback-star')];
  let rating = 0;
  const paintStars = (n) => stars.forEach((s, i) => {
    s.classList.toggle('active', i < n);
    s.setAttribute('aria-pressed', i < n ? 'true' : 'false');
  });
  stars.forEach((s, i) => {
    s.addEventListener('click', () => { rating = i + 1; paintStars(rating); });
    s.addEventListener('mouseenter', () => paintStars(i + 1));
  });
  starsWrap.addEventListener('mouseleave', () => paintStars(rating));

  const open = () => {
    backdrop.hidden = false;
    window.lenis?.stop();
    document.body.classList.add('no-scroll');
    (stars[0] || coloresEl)?.focus();
  };
  const close = () => {
    backdrop.hidden = true;
    window.lenis?.start();
    document.body.classList.remove('no-scroll');
    btn.focus();
  };
  btn.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  backdrop.addEventListener('click', (e) => { if (e.target === backdrop) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !backdrop.hidden) close(); });

  submitBtn.addEventListener('click', () => {
    const colores = coloresEl.value.trim();
    const contenido = contenidoEl.value.trim();
    const otros = otrosEl.value.trim();
    if (!rating && !colores && !contenido && !otros) { coloresEl.focus(); return; }

    const slugUrl = (location.pathname.match(/\/demo\/([^/]+)/) || [])[1] || document.title;
    const slug = gkySlugify(slugUrl);
    const negocio = (document.title.split(/\s[—|]\s|\s-\s/)[0] || document.title || '').trim();
    const estrellas = rating ? '★'.repeat(rating) + '☆'.repeat(5 - rating) + ` (${rating}/5)` : 'Sin calificar';
    const lineas = [
      `Devolución de la demo${negocio ? ' — ' + negocio : ''}`,
      `Calificación: ${estrellas}`,
      colores ? `Colores: ${colores}` : null,
      contenido ? `Contenido: ${contenido}` : null,
      otros ? `Otros: ${otros}` : null,
      location.href
    ].filter(Boolean);

    window.open(`https://wa.me/${GKY_FEEDBACK_WHATSAPP}?text=${encodeURIComponent(lineas.join('\n'))}`, '_blank', 'noopener');
    window.__gkySendResena?.({ slug, negocio, rating: rating || null, colores, contenido, otros, url: location.href })
      ?.catch(err => console.warn('No se pudo guardar la devolución en Firestore:', err));

    if (typeof showToast === 'function') showToast('¡Gracias por tu devolución!'); else window.alert('¡Gracias por tu devolución!');
    close();
    rating = 0; paintStars(0); coloresEl.value = ''; contenidoEl.value = ''; otrosEl.value = '';
  });

  if (reduceMotion) return;
  let hideTimer = null;
  window.addEventListener('scroll', () => {
    btn.classList.add('is-hidden');
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => btn.classList.remove('is-hidden'), 550);
  }, { passive: true });
}

/* ---------- ARRANQUE ---------- */
const anio = document.getElementById('anio');
if (anio) anio.textContent = new Date().getFullYear();

initTablero();
initHero();
initReveals();
initNav();
initWspFloat();
initMayorEje();
initLeeScroll();
initForm();
initFeedbackFloat();
