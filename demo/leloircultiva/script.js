const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5491158861705';

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

function esc(str) {
  return String(str).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
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

function initWspLinks() {
  document.querySelectorAll('[data-wsp-msg]').forEach(a => {
    a.href = 'https://wa.me/' + WSP + '?text=' + encodeURIComponent(a.getAttribute('data-wsp-msg'));
  });
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

function initMarcadores() {
  const marcas = document.querySelectorAll('.marker');
  if (!marcas.length || reduceMotion || !('IntersectionObserver' in window)) return;
  marcas.forEach(m => m.classList.add('off'));
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      requestAnimationFrame(() => entry.target.classList.remove('off'));
      io.unobserve(entry.target);
    });
  }, { threshold: 0, rootMargin: '0px 0px -10% 0px' });
  marcas.forEach(m => io.observe(m));
  setTimeout(() => marcas.forEach(m => {
    if (m.classList.contains('off') && m.getBoundingClientRect().top < window.innerHeight) m.classList.remove('off');
  }), 1600);
}

function initLectura() {
  const frase = document.querySelector('[data-lectura]');
  if (!frase) return;
  const palabras = frase.textContent.trim().split(/\s+/);
  frase.textContent = '';
  palabras.forEach((p, i) => {
    const span = document.createElement('span');
    span.className = 'palabra';
    span.textContent = p + (i < palabras.length - 1 ? ' ' : '');
    frase.appendChild(span);
  });
  if (reduceMotion) { frase.querySelectorAll('.palabra').forEach(s => s.classList.add('on')); return; }
  const spans = frase.querySelectorAll('.palabra');
  let queued = false;
  const pintar = () => {
    queued = false;
    const r = frase.getBoundingClientRect();
    const inicio = window.innerHeight * 0.88;
    const fin = window.innerHeight * 0.32;
    const p = Math.max(0, Math.min(1, (inicio - r.top) / (inicio - fin)));
    const corte = Math.round(p * spans.length);
    spans.forEach((s, i) => s.classList.toggle('on', i < corte));
  };
  const queue = () => { if (!queued) { queued = true; requestAnimationFrame(pintar); } };
  window.addEventListener('scroll', queue, { passive: true });
  window.addEventListener('resize', queue, { passive: true });
  window.addEventListener('load', queue);
  queue();
}

function initDual() {
  const sec = document.querySelector('.dual');
  if (!sec) return;
  const escena = sec.querySelector('.dual-escena');
  const copyA = sec.querySelector('.mundo-a .mundo-copy');
  const copyB = sec.querySelector('.mundo-b .mundo-copy');
  const num = document.getElementById('dualNum');
  const txt = document.getElementById('dualTxt');
  if (!escena || !copyA || !copyB || !num || !txt) return;

  const clamp01 = v => Math.max(0, Math.min(1, v));
  const rango = (p, a, b) => clamp01((p - a) / (b - a));

  function pintar(p) {
    const barrido = rango(p, 0.04, 0.70);
    sec.style.setProperty('--w', (108 - barrido * 116).toFixed(2));

    const oA = 1 - rango(p, 0.08, 0.28);
    const oB = rango(p, 0.34, 0.58);

    copyA.style.opacity = oA.toFixed(3);
    copyA.style.transform = `translateX(${(-(1 - oA) * 40).toFixed(1)}px)`;
    copyA.style.pointerEvents = oA < 0.15 ? 'none' : 'auto';
    copyA.style.visibility = oA <= 0.02 ? 'hidden' : 'visible';

    copyB.style.opacity = oB.toFixed(3);
    copyB.style.transform = `translateX(${((1 - oB) * 40).toFixed(1)}px)`;
    copyB.style.pointerEvents = oB < 0.15 ? 'none' : 'auto';
    copyB.style.visibility = oB <= 0.02 ? 'hidden' : 'visible';

    const t = rango(p, 0.10, 0.70);
    num.textContent = String(Math.round(9 - t * 3));
    txt.textContent = t < 0.5
      ? 'plantas en floración autorizadas por paciente'
      : 'goteros de 30 ml que se pueden trasladar';
  }

  const progreso = () => {
    const r = sec.getBoundingClientRect();
    const total = r.height - window.innerHeight;
    return total > 0 ? clamp01(-r.top / total) : 0;
  };

  let queued = false;
  const frame = () => { queued = false; pintar(progreso()); };
  const queue = () => { if (!queued) { queued = true; requestAnimationFrame(frame); } };

  window.addEventListener('scroll', queue, { passive: true });
  window.addEventListener('resize', queue, { passive: true });
  window.addEventListener('load', queue);
  pintar(0);
  window.__dualPintar = pintar;
}

const CHEQUEO = {
  propio: {
    rol: 'Paciente con cultivo propio',
    vigencia: '3 años',
    resumen: 'cultivo yo mismo'
  },
  tercero: {
    rol: 'Paciente + tercero cultivador',
    vigencia: '3 años',
    resumen: 'cultiva un tercero por mí'
  },
  ong: {
    rol: 'Paciente + persona jurídica permitida',
    vigencia: '1 año (asociaciones civiles)',
    resumen: 'quiero que cultive la asociación'
  }
};

function initChequeo() {
  const bloque = document.getElementById('chequeo');
  if (!bloque) return;
  const barra = document.getElementById('chequeoBarra');
  const avance = document.getElementById('chequeoAvance');
  const vacio = document.getElementById('chequeoVacio');
  const resultado = document.getElementById('chequeoResultado');
  const rolTxt = document.getElementById('chequeoRol');
  const datoRol = document.getElementById('datoRol');
  const datoPlantas = document.getElementById('datoPlantas');
  const datoVigencia = document.getElementById('datoVigencia');
  const lista = document.getElementById('chequeoFalta');
  const cta = document.getElementById('chequeoCta');

  const leer = name => {
    const marcado = bloque.querySelector(`input[name="${name}"]:checked`);
    return marcado ? marcado.value : '';
  };

  function actualizar() {
    const indicacion = leer('indicacion');
    const cultivo = leer('cultivo');
    const miarg = leer('miarg');
    const respondidas = [indicacion, cultivo, miarg].filter(Boolean).length;

    barra.style.width = (respondidas / 3 * 100) + '%';
    avance.textContent = `${respondidas} de 3 respondidas`;

    if (respondidas < 3) {
      resultado.hidden = true;
      vacio.hidden = false;
      return;
    }

    const perfil = CHEQUEO[cultivo];
    vacio.hidden = true;
    resultado.hidden = false;

    rolTxt.textContent = indicacion === 'si'
      ? 'Podés iniciar el trámite ahora mismo.'
      : indicacion === 'tramite'
        ? 'Te falta cerrar el paso médico y ya estás.'
        : 'Primero hay que conseguir la indicación médica.';

    datoRol.textContent = perfil.rol;
    datoPlantas.textContent = 'Hasta 9 en floración';
    datoVigencia.textContent = perfil.vigencia;

    const pasos = [];
    if (indicacion === 'si') pasos.push({ ok: true, txt: 'Indicación médica: ya la tenés' });
    else if (indicacion === 'tramite') pasos.push({ ok: false, txt: 'Cerrar la consulta y pedir la indicación por escrito' });
    else pasos.push({ ok: false, txt: 'Conseguir indicación de un profesional inscripto en REFEPS, con formación acreditada y firma digital' });

    pasos.push({ ok: false, txt: 'Firmar el consentimiento informado y la declaración jurada' });

    if (miarg === 'si') pasos.push({ ok: true, txt: 'Cuenta de Mi Argentina: validada' });
    else pasos.push({ ok: false, txt: 'Crear y validar tu cuenta en Mi Argentina' });

    if (cultivo === 'propio') pasos.push({ ok: false, txt: 'Declarar el domicilio donde vas a cultivar' });
    if (cultivo === 'tercero') pasos.push({ ok: false, txt: 'Tener los datos del tercero cultivador para vincularlo al trámite' });
    if (cultivo === 'ong') pasos.push({ ok: false, txt: 'Firmar con nosotros la vinculación como persona jurídica permitida' });

    lista.innerHTML = pasos.map(p => `<li class="${p.ok ? 'ok' : ''}">${esc(p.txt)}</li>`).join('');

    const faltan = pasos.filter(p => !p.ok).map(p => '- ' + p.txt).join('\n');
    const msg = `Hola Leloir Cultiva, hice el chequeo del REPROCANN.\n\nMi situación: ${perfil.resumen}.\nIndicación médica: ${indicacion === 'si' ? 'ya la tengo' : indicacion === 'tramite' ? 'la estoy gestionando' : 'todavía no la tengo'}.\nMi Argentina: ${miarg === 'si' ? 'cuenta validada' : 'me falta validarla'}.\n\nMe falta:\n${faltan}\n\n¿Me ayudan con los siguientes pasos?`;
    cta.href = 'https://wa.me/' + WSP + '?text=' + encodeURIComponent(msg);
  }

  bloque.querySelectorAll('input[type="radio"]').forEach(r => r.addEventListener('change', actualizar));
  actualizar();
}

function initForm() {
  const form = document.getElementById('formReprocann');
  if (!form) return;
  const boton = document.getElementById('formSubmit');
  const tel = document.getElementById('f-tel');

  if (tel && typeof IMask !== 'undefined') {
    IMask(tel, { mask: '00 0000-0000', lazy: true, placeholderChar: ' ' });
  }

  const campos = [
    { id: 'f-nombre', err: 'err-nombre', test: v => v.trim().length >= 2 },
    { id: 'f-tel', err: 'err-tel', test: v => v.replace(/\D/g, '').length >= 8 },
    { id: 'f-email', err: 'err-email', test: v => /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(v.trim()) },
    { id: 'f-situacion', err: 'err-situacion', test: v => v !== '' }
  ];

  campos.forEach(c => {
    const el = document.getElementById(c.id);
    el?.addEventListener('input', () => {
      if (c.test(el.value)) {
        el.closest('.campo')?.classList.remove('con-error');
        const e = document.getElementById(c.err);
        if (e) e.hidden = true;
      }
    });
    el?.addEventListener('change', () => {
      if (c.test(el.value)) {
        el.closest('.campo')?.classList.remove('con-error');
        const e = document.getElementById(c.err);
        if (e) e.hidden = true;
      }
    });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    let ok = true;
    let primero = null;
    campos.forEach(c => {
      const el = document.getElementById(c.id);
      const err = document.getElementById(c.err);
      if (!el) return;
      const valido = c.test(el.value);
      el.closest('.campo')?.classList.toggle('con-error', !valido);
      if (err) err.hidden = valido;
      if (!valido) { ok = false; if (!primero) primero = el; }
    });
    if (!ok) { primero?.focus(); showToast('Revisá los campos marcados y volvé a intentar.'); return; }

    const textoOriginal = boton.textContent;
    boton.disabled = true;
    boton.textContent = 'Enviando…';
    setTimeout(() => {
      boton.disabled = false;
      boton.textContent = textoOriginal;
      form.reset();
      showToast('¡Gracias! El envío de mensajes se activa al pasar la web a producción.');
    }, 800);
  });
}

function initMovimiento() {
  if (typeof gsap === 'undefined') {
    document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
    return;
  }
  if (typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);
  if (reduceMotion) return;

  document.querySelectorAll('[data-parallax]').forEach(el => {
    const img = el.querySelector('img');
    if (!img) return;
    const factor = parseFloat(el.getAttribute('data-parallax')) || 0.05;
    gsap.fromTo(img,
      { yPercent: -factor * 100 },
      { yPercent: 0, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } }
    );
  });

  window.addEventListener('load', () => ScrollTrigger.refresh());
}

initWspLinks();
initNav();
initWspFloat();
initLectura();
initDual();
initChequeo();
initForm();
initMarcadores();
initMovimiento();
initReveals();

document.querySelectorAll('.faq-item').forEach(d => {
  d.addEventListener('toggle', () => {
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  });
});
