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

const WSP = '5491156641312';

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

/* ---------- HERO ---------- */
function initHero() {
  document.querySelectorAll('.hero-copy > [data-animate]').forEach((el, i) => {
    el.style.transitionDelay = `${(0.06 + i * 0.1).toFixed(2)}s`;
  });
  const arco = document.querySelector('.hero-arco');
  if (arco) arco.style.transitionDelay = '0.3s';
}

/* ---------- COLOR JOURNEY (el fondo se entibia) ---------- */
function initJourney() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) return;
  const desde = document.getElementById('criterio');
  const hasta = document.getElementById('proceso');
  if (!desde || !hasta) return;
  gsap.to(document.body, {
    backgroundColor: '#FFEBEB',
    ease: 'none',
    scrollTrigger: {
      trigger: desde, start: 'top 62%',
      endTrigger: hasta, end: 'bottom 60%',
      scrub: 0.6, invalidateOnRefresh: true,
    },
  });
}

/* ---------- BLOQUE INTERACTIVO: LA CORRIDA ---------- */
const CORRIDAS = {
  lanzamiento: {
    nombre: 'un lanzamiento de producto',
    resumen: 'Un lanzamiento se dirige para que el producto aparezca una sola vez, en el momento exacto en que todos están mirando.',
    momentos: [
      {
        h: '18:30', t: 'Acreditación',
        escena: 'Llegada escalonada, acreditación rápida y una copa. El producto todavía no se ve por ningún lado.',
        direccion: 'Se controla el flujo de entrada para que no se arme fila, y se ubica a prensa y voceros antes de que el salón se llene.',
        invitado: 'La sensación de haber llegado a algo organizado, sin trámite en la puerta.',
      },
      {
        h: '19:15', t: 'Apertura',
        escena: 'Baja la luz general, sube la del escenario. Bienvenida corta, de tres a cinco minutos.',
        direccion: 'Se le sostiene el tiempo a quien abre. Si se pasa, la corrida se recupera acortando el bloque siguiente — nunca el del producto.',
        invitado: 'Entiende de qué se trata la noche sin que se le haga larga.',
      },
      {
        h: '20:00', t: 'El producto',
        escena: 'El momento único: revelación, demostración en vivo y la foto que va a circular al día siguiente.',
        direccion: 'Luces, sonido y cámara sincronizados al segundo. Es el único punto de la noche que no admite improvisación.',
        invitado: 'Se lleva la imagen del producto, no el recuerdo de un discurso.',
      },
      {
        h: '21:00', t: 'Networking',
        escena: 'Vuelve la música, circula la comida y el producto queda accesible para probarlo de cerca.',
        direccion: 'Se abre el espacio para que el equipo comercial trabaje, y se cierra antes de que la energía baje sola.',
        invitado: 'Tiempo real para preguntar, tocar y hablar con quien lo hizo.',
      },
    ],
  },
  convencion: {
    nombre: 'una convención o kick-off',
    resumen: 'Una jornada larga se dirige por bloques: el problema nunca es el contenido, es la atención.',
    momentos: [
      {
        h: '09:00', t: 'Arranque',
        escena: 'Café, acreditación y una apertura corta que fija el objetivo del día.',
        direccion: 'Se arranca en horario aunque falte gente. Empezar tarde el primer bloque enseña que los horarios son una sugerencia.',
        invitado: 'Sabe para qué lo trajeron antes de sentarse.',
      },
      {
        h: '11:30', t: 'El bloque duro',
        escena: 'Los contenidos que piden cabeza fresca: números, estrategia, decisiones.',
        direccion: 'Se ubican acá y no después del almuerzo. Bloques de veinticinco minutos con corte, nunca una hora seguida.',
        invitado: 'Llega al mediodía habiendo entendido lo importante.',
      },
      {
        h: '14:00', t: 'La franja difícil',
        escena: 'Después de comer toda convención se cae. Va algo dinámico: taller, mesa de trabajo, actividad en grupos.',
        direccion: 'Nunca una presentación con luces bajas a esta hora. Se cambia el formato, no el volumen.',
        invitado: 'Se despierta participando en vez de escuchando.',
      },
      {
        h: '17:00', t: 'Cierre',
        escena: 'Síntesis, próximos pasos y un brindis breve.',
        direccion: 'Se cierra puntual. Una jornada que termina cuando dijo que iba a terminar vale más que media hora extra de contenido.',
        invitado: 'Se va con tres cosas claras, no con doce.',
      },
    ],
  },
  aniversario: {
    nombre: 'un aniversario o fiesta de fin de año',
    resumen: 'Una fiesta de equipo se dirige para que la gente se quede — y eso se decide en la primera hora, no en la última.',
    momentos: [
      {
        h: '20:30', t: 'Recepción',
        escena: 'Barra abierta, música de fondo baja y espacio para que la gente se encuentre antes de sentarse.',
        direccion: 'Se cuida que nadie quede solo: cómo está armado el espacio decide si los equipos se mezclan o se quedan en su isla.',
        invitado: 'Encuentra con quién hablar en los primeros diez minutos.',
      },
      {
        h: '21:30', t: 'El brindis',
        escena: 'Palabras de la empresa. Cortas, de pie, con la gente todavía con energía.',
        direccion: 'Va antes de la cena, no después. Un discurso sobre gente sentada y con el plato servido no lo escucha nadie.',
        invitado: 'Escucha el mensaje porque todavía está atento.',
      },
      {
        h: '22:30', t: 'La cena',
        escena: 'Servicio en mesa o estaciones, según el formato. Música que deja hablar.',
        direccion: 'Se sincroniza la cocina con el ritmo real de la sala, no con el reloj del contrato.',
        invitado: 'Come tranquilo y sigue conversando.',
      },
      {
        h: '00:00', t: 'La pista',
        escena: 'Sube la música, se abre la pista y arranca la parte que la gente cuenta al día siguiente.',
        direccion: 'Se sostiene la curva hasta el final y se prevé la salida: transporte, guardarropa y cierre sin apurar a nadie.',
        invitado: 'Se va cuando quiere irse, no cuando lo empujan.',
      },
    ],
  },
  gala: {
    nombre: 'una premiación o gala',
    resumen: 'En una premiación cada nombre tiene que sonar como si fuera el único. Eso se dirige, no se improvisa.',
    momentos: [
      {
        h: '19:30', t: 'Recepción',
        escena: 'Recepción con fotografía, ubicación por mesa y protocolo de invitados especiales.',
        direccion: 'Se define de antemano quién entra con quién y dónde se sienta cada uno. Un protocolo mal resuelto se nota toda la noche.',
        invitado: 'Sabe dónde está su lugar sin tener que preguntar.',
      },
      {
        h: '20:30', t: 'La ceremonia',
        escena: 'Apertura formal, conducción y presentación del sentido del premio.',
        direccion: 'Se ensaya la conducción con los nombres y las pronunciaciones reales. Un apellido mal dicho arruina un reconocimiento.',
        invitado: 'Entiende qué se está premiando y por qué importa.',
      },
      {
        h: '21:30', t: 'Los premios',
        escena: 'Entrega uno por uno, con su recorrido al escenario, su foto y sus segundos de aplauso.',
        direccion: 'Se cronometra cada terna para que la última no quede a las apuradas, y el orden se arma para que la ceremonia no decaiga.',
        invitado: 'Si lo premian, tiene su momento completo. Si no, no se le hace eterna.',
      },
      {
        h: '22:30', t: 'Brindis',
        escena: 'Brindis general, fotos con los premiados y cierre con música.',
        direccion: 'Se libera la formalidad de golpe y a propósito: la gala termina y ahí empieza la celebración.',
        invitado: 'Se lleva la foto y la sensación de haber estado en algo importante.',
      },
    ],
  },
};

function initCorrida() {
  const chips = [...document.querySelectorAll('#corTipos .chip')];
  const horasWrap = document.getElementById('corHoras');
  const panel = document.getElementById('corPanel');
  const elEscena = document.getElementById('corEscena');
  const elDir = document.getElementById('corDireccion');
  const elInv = document.getElementById('corInvitado');
  const elRes = document.getElementById('corResumen');
  const elCta = document.getElementById('corCta');
  const fill = document.getElementById('corRielFill');
  if (!chips.length || !horasWrap || !panel) return;

  let tipo = 'lanzamiento';
  let idx = 0;

  const pintarHoras = () => {
    const d = CORRIDAS[tipo];
    horasWrap.innerHTML = d.momentos.map((m, i) => `
      <button type="button" class="hora${i === idx ? ' is-on' : ''}" data-i="${i}" role="tab" aria-selected="${i === idx}">
        <span class="hora-punto" aria-hidden="true"></span>
        <span class="hora-h">${esc(m.h)}</span>
        <span class="hora-t">${esc(m.t)}</span>
      </button>`).join('');
    horasWrap.querySelectorAll('.hora').forEach(b => {
      b.addEventListener('click', () => { idx = Number(b.dataset.i); marcarHora(); pintarPanel(); });
    });
  };

  const moverRiel = () => {
    if (!fill) return;
    const riel = fill.parentElement;
    const activo = horasWrap.querySelector('.hora.is-on .hora-punto');
    if (!riel || !activo) return;
    const r = riel.getBoundingClientRect();
    const p = activo.getBoundingClientRect();
    if (!r.width) return;
    const frac = Math.min(1, Math.max(0.04, (p.left + p.width / 2 - r.left) / r.width));
    fill.style.transform = `scaleX(${frac.toFixed(3)})`;
  };

  const marcarHora = () => {
    horasWrap.querySelectorAll('.hora').forEach((b, i) => {
      b.classList.toggle('is-on', i === idx);
      b.setAttribute('aria-selected', i === idx ? 'true' : 'false');
    });
    moverRiel();
  };

  const escribir = () => {
    const m = CORRIDAS[tipo].momentos[idx];
    if (!m) return;
    elEscena.textContent = m.escena;
    elDir.textContent = m.direccion;
    elInv.textContent = m.invitado;
  };

  const pintarPanel = () => {
    if (reduceMotion) { escribir(); return; }
    panel.classList.add('swap');
    setTimeout(() => { escribir(); panel.classList.remove('swap'); }, 140);
  };

  const pintarSalida = () => {
    const d = CORRIDAS[tipo];
    elRes.textContent = d.resumen;
    if (elCta) {
      const msg = `Hola, vi la web de Caramel D'Âme. Estoy organizando ${d.nombre} y quería consultar por la dirección y el planeamiento.`;
      elCta.href = `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
    }
  };

  chips.forEach(c => c.addEventListener('click', () => {
    if (c.dataset.tipo === tipo) return;
    tipo = c.dataset.tipo;
    idx = 0;
    chips.forEach(x => {
      const on = x.dataset.tipo === tipo;
      x.classList.toggle('is-on', on);
      x.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    pintarHoras();
    pintarPanel();
    pintarSalida();
    requestAnimationFrame(moverRiel);
  }));

  pintarHoras();
  escribir();
  pintarSalida();
  window.addEventListener('resize', moverRiel, { passive: true });
  window.addEventListener('load', moverRiel);
  requestAnimationFrame(moverRiel);
  setTimeout(moverRiel, 400);
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

/* ---------- FORM (demo) ---------- */
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
      if (valido) input.removeAttribute('aria-invalid'); else input.setAttribute('aria-invalid', 'true');
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

initCorrida();
initHero();
initReveals();
initNav();
initWspFloat();
initJourney();
initLeeScroll();
initForm();
initFeedbackFloat();
