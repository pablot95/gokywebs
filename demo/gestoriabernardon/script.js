document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5491167422583';

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

function wspLink(texto) {
  return `https://wa.me/${WSP}?text=${encodeURIComponent(texto)}`;
}

let revealsListos = false;

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
  const inset = hero.querySelector('.hero-inset');
  if (inset) tl.from(inset, { y: 40, opacity: 0, duration: 1.2, clearProps: 'transform,opacity' }, 0.35);
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 36, opacity: 0, filter: 'blur(8px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 24, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 20, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.hero-badge, .atajos a'), { scale: 0.92, opacity: 0, duration: 1.1, stagger: 0.1, clearProps: 'transform,opacity' }, 0.7);
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('.hero-inset-in img').forEach(img => {
    gsap.fromTo(img, { yPercent: -9 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; }
  const header = document.querySelector('.site-header');
  (header || document.body).appendChild(bd);
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

const GUIA = {
  automotor: {
    registro: 'Registro del Automotor',
    tramites: [
      { id: 'transferencia', nombre: 'Transferencia', docs: ['Título del vehículo', 'Cédula de identificación', 'Formulario 08 firmado, con las firmas certificadas', 'Verificación policial', 'DNI de quien vende y de quien compra'] },
      { id: 'informe', nombre: 'Informe de dominio', docs: ['Patente (dominio) del vehículo', 'Tu nombre y un contacto para mandarte el informe'] },
      { id: 'duplicado', nombre: 'Duplicado de título o cédula', docs: ['DNI del titular', 'Denuncia policial, si hubo robo o extravío', 'Firma del titular en la solicitud (te la preparamos)'] },
      { id: 'radicacion', nombre: 'Cambio de radicación', docs: ['Título y cédula del vehículo', 'DNI del titular con el domicilio nuevo', 'Patentes al día en la jurisdicción anterior'] },
      { id: 'denuncia', nombre: 'Denuncia de venta', docs: ['DNI del titular', 'Patente del vehículo', 'Datos de quien compró, si los tenés'] },
      { id: 'prenda', nombre: 'Prendas', docs: ['Título del vehículo', 'DNI del titular', 'Contrato de prenda o constancia de cancelación del acreedor'] }
    ]
  },
  naval: {
    registro: 'Prefectura Naval Argentina',
    tramites: [
      { id: 'matricula', nombre: 'Matrícula', docs: ['Factura o boleto de compra de la embarcación', 'Datos del casco y del motor', 'DNI y CUIT/CUIL del propietario'] },
      { id: 'transferencia', nombre: 'Transferencia', docs: ['Certificado de matrícula de la embarcación', 'Firmas de quien vende y de quien compra, certificadas', 'Tasa anual de matrícula al día', 'DNI de las dos partes'] },
      { id: 'tasa', nombre: 'Tasa anual', docs: ['Número de matrícula de la embarcación', 'DNI del titular'] },
      { id: 'certificados', nombre: 'Certificados e informes', docs: ['Número de matrícula de la embarcación', 'DNI del titular', 'Para qué lo necesitás (venta, seguro u otro)'] },
      { id: 'duplicados', nombre: 'Duplicados y bajas', docs: ['DNI del titular', 'Número de matrícula de la embarcación', 'Denuncia, si hubo pérdida o robo'] }
    ]
  }
};
const OBJETOS = { auto: 'Auto', moto: 'Moto', embarcacion: 'Embarcación' };

function initGuia() {
  const objetos = document.querySelectorAll('input[name="guia-objeto"]');
  const cont = document.getElementById('guiaTramites');
  const hoja = document.querySelector('.guia-hoja');
  const titulo = document.getElementById('guiaTitulo');
  const registro = document.getElementById('guiaRegistro');
  const docs = document.getElementById('guiaDocs');
  const wsp = document.getElementById('guiaWsp');
  if (!objetos.length || !cont || !hoja || !titulo || !docs || !wsp) return;
  let objeto = document.querySelector('input[name="guia-objeto"]:checked')?.value || 'auto';
  let tramite = cont.querySelector('input:checked')?.value || 'transferencia';
  let timer = 0;

  const grupo = () => (objeto === 'embarcacion' ? GUIA.naval : GUIA.automotor);

  const pintarChips = () => {
    const lista = grupo().tramites;
    if (!lista.some(t => t.id === tramite)) tramite = lista[0].id;
    cont.innerHTML = lista.map(t => `<label class="chip"><input type="radio" name="guia-tramite" value="${t.id}"${t.id === tramite ? ' checked' : ''}><span>${esc(t.nombre)}</span></label>`).join('');
  };

  const pintarResultado = (animar) => {
    const g = grupo();
    const t = g.tramites.find(x => x.id === tramite) || g.tramites[0];
    const aplicar = () => {
      registro.textContent = `${OBJETOS[objeto]} · ${g.registro}`;
      titulo.textContent = t.nombre;
      docs.innerHTML = t.docs.map(d => `<li>${esc(d)}</li>`).join('');
      wsp.href = wspLink(`Hola, Gestoría Bernardon. Quiero consultar por: ${t.nombre} (${OBJETOS[objeto].toLowerCase()}). ¿Me confirman qué papeles necesito?`);
      hoja.classList.remove('cambiando');
      if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
    };
    if (!animar || reduceMotion) { aplicar(); return; }
    clearTimeout(timer);
    hoja.classList.add('cambiando');
    timer = setTimeout(aplicar, 220);
  };

  objetos.forEach(r => r.addEventListener('change', () => {
    if (!r.checked) return;
    const antes = grupo();
    objeto = r.value;
    if (grupo() !== antes) pintarChips();
    pintarResultado(true);
  }));
  cont.addEventListener('change', e => {
    const r = e.target.closest('input[name="guia-tramite"]');
    if (!r) return;
    tramite = r.value;
    pintarResultado(true);
  });
  pintarChips();
  pintarResultado(false);
}

function initTabs() {
  const tabs = [...document.querySelectorAll('.tab-btn')];
  if (!tabs.length) return;
  const mostrar = (id, foco) => {
    tabs.forEach(t => {
      const activo = t.dataset.tab === id;
      t.setAttribute('aria-selected', activo ? 'true' : 'false');
      t.tabIndex = activo ? 0 : -1;
      if (activo && foco) t.focus();
    });
    document.querySelectorAll('.legajo[data-legajo]').forEach(p => {
      const activo = p.dataset.legajo === id;
      p.classList.toggle('activo', activo);
      if (activo) revelarNuevos(p);
    });
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => mostrar(t.dataset.tab));
    t.addEventListener('keydown', e => {
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp' && e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault();
      const paso = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : -1;
      mostrar(tabs[(i + paso + tabs.length) % tabs.length].dataset.tab, true);
    });
  });
  document.querySelectorAll('[data-tab-ir]').forEach(a => a.addEventListener('click', () => mostrar(a.dataset.tabIr)));
}

function initFaq() {
  document.querySelectorAll('.faq-lista details').forEach(d => d.addEventListener('toggle', () => {
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  }));
}

function initForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  const tel = form.querySelector('input[name="telefono"]');
  let mask = null;
  if (tel && typeof IMask !== 'undefined') {
    mask = IMask(tel, { mask: [
      { mask: '+{54} 9 (00) 0000-0000' },
      { mask: '+{54} 9 (000) 000-0000' },
      { mask: '+{54} 9 (0000) 00-0000' }
    ] });
  }
  const marcar = (input, msg) => {
    const campo = input.closest('.campo');
    if (!campo) return;
    let err = campo.querySelector('.campo-error');
    if (msg) {
      campo.setAttribute('data-error', '');
      input.setAttribute('aria-invalid', 'true');
      if (!err) {
        err = document.createElement('span');
        err.className = 'campo-error';
        err.id = `${input.name}-error`;
        campo.appendChild(err);
      }
      err.textContent = msg;
      input.setAttribute('aria-describedby', err.id);
    } else {
      campo.removeAttribute('data-error');
      input.removeAttribute('aria-invalid');
      input.removeAttribute('aria-describedby');
      err?.remove();
    }
  };
  const validar = () => {
    let ok = true;
    const nombre = form.elements.nombre;
    const tramite = form.elements.tramite;
    const digitos = mask ? mask.unmaskedValue.length : tel.value.replace(/\D/g, '').length;
    if (nombre.value.trim().length < 2) { marcar(nombre, 'Contanos cómo te llamás.'); ok = false; } else marcar(nombre);
    if (digitos < 12) { marcar(tel, 'Revisá el número: lo necesitamos para responderte.'); ok = false; } else marcar(tel);
    if (tramite.value.trim().length < 3) { marcar(tramite, 'Decinos qué trámite necesitás.'); ok = false; } else marcar(tramite);
    return ok;
  };
  form.querySelectorAll('input').forEach(i => i.addEventListener('input', () => { if (i.closest('[data-error]')) validar(); }));
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!validar()) {
      form.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }
    const btn = form.querySelector('button[type="submit"]');
    const label = btn.querySelector('span');
    const original = label.textContent;
    btn.disabled = true;
    label.textContent = 'Enviando…';
    setTimeout(() => {
      btn.disabled = false;
      label.textContent = original;
      form.reset();
      mask?.updateValue();
      showToast('¡Gracias! El envío de mensajes se activa al pasar la web a producción.');
    }, 800);
  });
}

initGuia();
initTabs();
initReveals();
initNav();
initWspFloat();
initModelBarScroll();
initHeroMotion();
initParallax();
initFaq();
initForm();
