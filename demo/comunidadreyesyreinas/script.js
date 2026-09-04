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
  document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; el.style.filter = 'none'; });
}
if (typeof ScrollTrigger !== 'undefined') {
  window.addEventListener('load', () => ScrollTrigger.refresh());
}

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

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

function initWspFloat() {
  const btn = document.getElementById('wsp-float');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) btn.classList.add('visible'); else btn.classList.remove('visible');
  }, { passive: true });
}

function initHero() {
  const arco = document.querySelector('.hero-arco-path');
  if (!arco) return;
  if (reduceMotion) { arco.style.strokeDashoffset = '190'; return; }
  requestAnimationFrame(() => arco.classList.add('drawn'));
}

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
      trigger: el, start: 'top 82%', end: 'bottom 55%', scrub: .4, invalidateOnRefresh: true,
      onUpdate: self => {
        const hasta = self.progress * ws.length;
        ws.forEach((w, i) => w.classList.toggle('on', i < hasta));
      },
    });
  });
}

const AREAS = {
  vinculos: {
    label: 'Vínculos',
    foco: 'qué está pasando con la gente que te rodea',
    eje: 'tus vínculos',
    lista: ['Qué vínculo te está costando y desde cuándo', 'Qué venís evitando decir', 'El primer límite que sí podés poner esta semana'],
  },
  proposito: {
    label: 'Trabajo y propósito',
    foco: 'por qué lo que hacés todos los días dejó de tener sentido',
    eje: 'tu trabajo y tu propósito',
    lista: ['Qué parte de lo que hacés todavía te gusta', 'Qué estás sosteniendo solo por costumbre', 'Un movimiento chico y posible antes del lunes'],
  },
  cuerpo: {
    label: 'Cuerpo y energía',
    foco: 'cómo estás llegando al final del día',
    eje: 'tu cuerpo y tu energía',
    lista: ['Cómo llegás al final del día', 'Qué hábito propio se te cayó primero', 'Una sola cosa para recuperar esta semana'],
  },
  dinero: {
    label: 'Plata',
    foco: 'qué decisiones con la plata venís postergando',
    eje: 'tu relación con la plata',
    lista: ['Qué decisión venís pateando para adelante', 'Qué te contás cuando el número no cierra', 'El primer número que vas a mirar de frente'],
  },
  emociones: {
    label: 'Emociones',
    foco: 'eso que se te viene repitiendo hace rato',
    eje: 'tus emociones',
    lista: ['Qué se te repite y desde cuándo', 'Qué te saca de eje sin que lo veas venir', 'Un recurso propio para la próxima vez'],
  },
  tiempo: {
    label: 'Tiempo',
    foco: 'en qué se te está yendo realmente la semana',
    eje: 'tu tiempo',
    lista: ['En qué se te va realmente la semana', 'A qué dijiste que sí sin querer', 'Qué sacás de la agenda esta semana'],
  },
};

const MOMENTOS = {
  inicio: {
    label: 'Recién arranco',
    instancia: 'Encuentro inicial',
    porque: 'es tu primera vez y conviene ordenar el mapa antes de sumarte a la ronda.',
    detalle: foco => `Una charla a solas con Alexia para poner en palabras ${foco} y decidir el primer movimiento.`,
  },
  proceso: {
    label: 'Ya vengo trabajándolo',
    instancia: 'Programa Reyes y Reinas',
    porque: 'ya sabés lo que te pasa: lo que falta es un método semanal y un grupo que te lo sostenga.',
    detalle: (foco, eje) => `El programa completo — encuentros grupales, bitácora semanal y charlas uno a uno — con ${eje} como eje de tu recorrido.`,
  },
  sostener: {
    label: 'Quiero sostenerlo',
    instancia: 'Acompañamiento sostenido',
    porque: 'lo difícil no fue empezar, fue no aflojar: acá el foco es que lo logrado no se caiga.',
    detalle: (foco, eje) => `Encuentros más espaciados, pensados para que lo que ya moviste en ${eje} no vuelva al punto de partida.`,
  },
};

function initRueda() {
  const chipsArea = [...document.querySelectorAll('#chipsArea .chip')];
  const chipsMomento = [...document.querySelectorAll('#chipsMomento .chip')];
  if (!chipsArea.length || !chipsMomento.length) return;
  const segs = [...document.querySelectorAll('.seg')];
  const centro = document.getElementById('ruedaCentro');
  const tag = document.getElementById('resTag');
  const titulo = document.getElementById('resTitulo');
  const porque = document.getElementById('resPorque');
  const detalle = document.getElementById('resDetalle');
  const lista = document.getElementById('resLista');
  const cta = document.getElementById('resCta');

  let area = 'vinculos';
  let momento = 'inicio';

  const pintar = () => {
    const a = AREAS[area];
    const m = MOMENTOS[momento];
    if (!a || !m) return;
    segs.forEach(s => s.classList.toggle('is-on', s.dataset.seg === area));
    centro.textContent = a.label;
    tag.textContent = `${a.label} · ${m.label}`;
    titulo.textContent = m.instancia;
    porque.textContent = `Elegido por: ${m.porque}`;
    detalle.textContent = m.detalle(a.foco, a.eje);
    lista.innerHTML = a.lista.map(t => `<li>${esc(t)}</li>`).join('');
    const msg = `Hola Alexia, vengo de la web. Quiero trabajar ${a.eje} y estoy en el momento "${m.label}". La rueda me sugirió empezar por: ${m.instancia}.`;
    cta.href = `https://wa.me/5491139163255?text=${encodeURIComponent(msg)}`;
  };

  chipsArea.forEach(chip => chip.addEventListener('click', () => {
    area = chip.dataset.area;
    chipsArea.forEach(c => { const on = c === chip; c.classList.toggle('is-on', on); c.setAttribute('aria-pressed', on ? 'true' : 'false'); });
    pintar();
  }));
  chipsMomento.forEach(chip => chip.addEventListener('click', () => {
    momento = chip.dataset.momento;
    chipsMomento.forEach(c => { const on = c === chip; c.classList.toggle('is-on', on); c.setAttribute('aria-pressed', on ? 'true' : 'false'); });
    pintar();
  }));

  pintar();
}

function initMetodo() {
  const stage = document.getElementById('metodoStage');
  const pasos = [...document.querySelectorAll('.metodo-paso')];
  const fotos = [...document.querySelectorAll('.metodo-foto')];
  if (!stage || !pasos.length) return;
  const mobileMq = window.matchMedia('(max-width: 900px)');
  let actual = -1;
  const set = i => {
    if (i === actual) return;
    actual = i;
    pasos.forEach((p, n) => p.classList.toggle('is-on', n === i));
    fotos.forEach((f, n) => f.classList.toggle('is-on', n === i));
  };
  const calcular = () => {
    if (mobileMq.matches) {
      const r = stage.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      const p = total > 0 ? Math.min(Math.max(-r.top / total, 0), 1) : 0;
      set(Math.min(pasos.length - 1, Math.floor(p * pasos.length)));
      return;
    }
    const centro = window.innerHeight / 2;
    let mejor = 0, dist = Infinity;
    pasos.forEach((p, n) => {
      const r = p.getBoundingClientRect();
      const d = Math.abs((r.top + r.bottom) / 2 - centro);
      if (d < dist) { dist = d; mejor = n; }
    });
    set(mejor);
  };
  let queued = false;
  const onScroll = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; calcular(); });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  mobileMq.addEventListener('change', () => { actual = -1; calcular(); });
  calcular();
}

function initRail() {
  const vp = document.getElementById('railVp');
  if (!vp) return;
  const track = vp.querySelector('.rail-track');
  const prev = document.getElementById('railPrev');
  const next = document.getElementById('railNext');
  const card = vp.querySelector('.rail-card');

  let down = false, startX = 0, startLeft = 0, moved = false, justDragged = false, pointerId = null;
  vp.addEventListener('pointerdown', e => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    down = true; moved = false; startX = e.clientX; startLeft = vp.scrollLeft; pointerId = e.pointerId;
  });
  vp.addEventListener('pointermove', e => {
    if (!down) return;
    const dx = e.clientX - startX;
    if (!moved && Math.abs(dx) < 6) return;
    if (!moved) {
      moved = true;
      vp.classList.add('dragging');
      try { vp.setPointerCapture?.(pointerId); } catch { /* sin capture el drag igual funciona */ }
    }
    vp.scrollLeft = startLeft - dx;
  });
  const end = () => {
    if (!down) return;
    down = false;
    try { vp.releasePointerCapture?.(pointerId); } catch { /* ya liberado */ }
    if (moved) { justDragged = true; setTimeout(() => { justDragged = false; }, 80); }
    moved = false;
    vp.classList.remove('dragging');
  };
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
  vp.addEventListener('pointerleave', end);
  vp.addEventListener('click', e => { if (justDragged) { e.preventDefault(); e.stopPropagation(); } }, true);

  const paso = () => {
    if (!card) return vp.clientWidth * 0.8;
    const gap = parseFloat(window.getComputedStyle(track).columnGap) || 16;
    return card.getBoundingClientRect().width + gap;
  };
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));

  const sync = () => {
    const inicio = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
    if (prev) prev.disabled = vp.scrollLeft <= inicio + 2;
    if (next) next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  vp.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync, { passive: true });
  window.addEventListener('load', sync);
  sync();
}

function initForm() {
  const form = document.getElementById('formContacto');
  if (!form) return;
  const btn = document.getElementById('formSubmit');
  const campos = [
    { input: document.getElementById('f-nombre'), error: document.getElementById('e-nombre'), min: 2 },
    { input: document.getElementById('f-contacto'), error: document.getElementById('e-contacto'), min: 5 },
    { input: document.getElementById('f-mensaje'), error: document.getElementById('e-mensaje'), min: 4 },
  ];
  const validar = c => {
    const ok = (c.input?.value || '').trim().length >= c.min;
    c.input?.closest('.campo')?.classList.toggle('error', !ok);
    c.input?.setAttribute('aria-invalid', ok ? 'false' : 'true');
    if (c.error) c.error.hidden = ok;
    return ok;
  };
  campos.forEach(c => c.input?.addEventListener('input', () => {
    if (c.input.closest('.campo')?.classList.contains('error')) validar(c);
  }));
  form.addEventListener('submit', e => {
    e.preventDefault();
    let ok = true;
    let primero = null;
    campos.forEach(c => { const v = validar(c); if (!v && !primero) primero = c.input; ok = ok && v; });
    if (!ok) { primero?.focus(); return; }
    const texto = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Enviando…';
    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = texto;
      form.reset();
      showToast('¡Gracias! El envío de mensajes se activa al pasar la web a producción.');
    }, 800);
  });
}

const GKY_SLUG_ACENTOS = { "á": "a", "é": "e", "í": "i", "ó": "o", "ú": "u", "ñ": "n", "ü": "u" };
function gkySlugify(s) {
  return String(s || "").toLowerCase()
    .replace(/[áéíóúñü]/g, c => GKY_SLUG_ACENTOS[c] || c)
    .replace(/[^a-z0-9]/g, "");
}

function initFeedbackFloat() {
  const GKY_FEEDBACK_WHATSAPP = "5491125068578";
  const btn = document.getElementById('feedback-float');
  const backdrop = document.getElementById('feedback-modal-backdrop');
  const closeBtn = document.getElementById('feedback-modal-close');
  const coloresEl = document.getElementById('feedback-colores');
  const contenidoEl = document.getElementById('feedback-contenido');
  const otrosEl = document.getElementById('feedback-otros');
  const submitBtn = document.getElementById('feedback-submit');
  if (!btn || !backdrop) return;

  const open = () => {
    backdrop.hidden = false;
    document.body.classList.add('no-scroll');
    coloresEl?.focus();
  };
  const close = () => {
    backdrop.hidden = true;
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
    if (!colores && !contenido && !otros) { coloresEl.focus(); return; }

    const slugUrl = (location.pathname.match(/\/demo\/([^/]+)/) || [])[1] || document.title;
    const slug = gkySlugify(slugUrl);
    const negocio = (document.title.split(/\s[—|]\s|\s-\s/)[0] || document.title || '').trim();
    const lineas = [
      `Devolución de la demo${negocio ? ' — ' + negocio : ''}`,
      colores ? `Colores: ${colores}` : null,
      contenido ? `Contenido: ${contenido}` : null,
      otros ? `Otros: ${otros}` : null,
      location.href
    ].filter(Boolean);

    window.open(`https://wa.me/${GKY_FEEDBACK_WHATSAPP}?text=${encodeURIComponent(lineas.join('\n'))}`, '_blank', 'noopener');
    window.__gkySendResena?.({ slug, negocio, colores, contenido, otros, url: location.href })
      ?.catch(err => console.warn('No se pudo guardar la devolución en Firestore:', err));

    if (typeof showToast === 'function') showToast('¡Gracias por tu devolución!'); else window.alert('¡Gracias por tu devolución!');
    close();
    coloresEl.value = ''; contenidoEl.value = ''; otrosEl.value = '';
  });
}

function initAnio() {
  const el = document.getElementById('anio');
  if (el) el.textContent = new Date().getFullYear();
}

initRueda();
initMetodo();
initRail();
initForm();
initHero();
initLeeScroll();
initReveals();
initNav();
initWspFloat();
initFeedbackFloat();
initAnio();
