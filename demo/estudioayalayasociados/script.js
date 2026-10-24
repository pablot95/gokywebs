const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const WSP = '5491132049934';

const AREAS = {
  transito: {
    grupo: 'Para personas',
    titulo: 'Accidentes de tránsito',
    intro: 'Si tuviste un choque o te atropellaron, el reclamo se dirige al responsable y a su aseguradora. Te acompañamos desde el primer reclamo hasta la mediación o el juicio.',
    hacemos: ['Reclamos por lesiones, incapacidad y gastos médicos', 'Daños al vehículo y privación de uso', 'Conductores, acompañantes, peatones, ciclistas y motociclistas', 'Pasajeros de colectivos, taxis y aplicaciones'],
    mano: ['DNI y registro de conducir', 'Patente, compañía de seguro y datos del otro vehículo', 'Denuncia del siniestro y fotos del lugar', 'Constancias médicas y presupuestos de reparación'],
    msg: 'Hola, vi la web del Estudio Ayala y quiero consultar por un accidente de tránsito.',
  },
  laboral: {
    grupo: 'Para personas',
    titulo: 'Accidentes laborales · ART',
    intro: 'Si te lastimaste trabajando, en el camino de ida o vuelta, o tenés una enfermedad por tu tarea, la ART tiene que cubrirte. Te ayudamos a hacerlo valer ante la Comisión Médica y, si hace falta, en la Justicia.',
    hacemos: ['Accidentes en el lugar de trabajo o in itinere', 'Enfermedades profesionales', 'Rechazos del siniestro por parte de la ART', 'Desacuerdos con el porcentaje de incapacidad'],
    mano: ['DNI y últimos recibos de sueldo', 'Número de siniestro o denuncia ante la ART', 'Estudios médicos y alta', 'Notificaciones de la ART o de la Comisión Médica'],
    msg: 'Hola, vi la web del Estudio Ayala y quiero consultar por un accidente laboral con la ART.',
  },
  sucesiones: {
    grupo: 'Para personas',
    titulo: 'Sucesiones',
    intro: 'Cuando fallece un familiar, la sucesión permite que los bienes pasen a nombre de los herederos. Nos ocupamos del trámite completo y te contamos en qué etapa está.',
    hacemos: ['Sucesiones con o sin testamento', 'Declaratoria de herederos', 'Inscripción de inmuebles, autos y cuentas', 'Acuerdos de partición entre herederos'],
    mano: ['Partida de defunción', 'Partidas que acrediten el vínculo (nacimiento o matrimonio)', 'Títulos o datos de los bienes', 'Último domicilio de la persona fallecida'],
    msg: 'Hola, vi la web del Estudio Ayala y quiero consultar por una sucesión.',
  },
  sociedades: {
    grupo: 'Para empresas',
    titulo: 'Sociedades',
    intro: 'Elegir bien el tipo de sociedad ordena la relación entre socios desde el primer día. Armamos la sociedad, la inscribimos y la acompañamos cuando cambia.',
    hacemos: ['Constitución de SAS, SRL y SA', 'Estatutos, contratos sociales y pactos entre socios', 'Actas, asambleas y libros societarios', 'Cesión de cuotas o acciones y cambios de autoridades'],
    mano: ['Datos y DNI de cada socio', 'Actividad que va a desarrollar la sociedad', 'Capital inicial y cómo se reparte', 'Si ya existe: estatuto y últimas actas'],
    msg: 'Hola, vi la web del Estudio Ayala y quiero consultar por una sociedad.',
  },
  empresas: {
    grupo: 'Para empresas',
    titulo: 'Asesoramiento a empresas',
    intro: 'Tener un estudio de consulta evita que un problema chico se vuelva un juicio. Revisamos contratos, respondemos las consultas del día a día y te representamos cuando llega un reclamo.',
    hacemos: ['Contratos comerciales, con clientes y proveedores', 'Consultas laborales: altas, sanciones y despidos', 'Cartas documento y respuesta a reclamos', 'Cobranza de deudas y mediaciones'],
    mano: ['Estatuto o contrato social de la empresa', 'Contratos vigentes relacionados con la consulta', 'Carta documento o reclamo recibido, si lo hay', 'Una breve cronología de lo que pasó'],
    msg: 'Hola, escribo por una empresa: vi la web del Estudio Ayala y quiero consultar por asesoramiento legal.',
  },
};

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
  const desktopMq = window.matchMedia('(min-width: 901px)');
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
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 16, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 32, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 22, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 18, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.sello'), { scale: 0.92, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.75);
}

function initHeroParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  const mov = document.querySelector('.hero__mov');
  if (!mov) return;
  gsap.fromTo(mov, { yPercent: -3 }, {
    yPercent: 3, ease: 'none',
    scrollTrigger: { trigger: mov.closest('.hero__foto'), start: 'top bottom', end: 'bottom top', scrub: true },
  });
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
      trigger: el, start: 'top 85%', end: 'bottom 55%', scrub: .4, invalidateOnRefresh: true,
      onUpdate: self => {
        const hasta = self.progress * ws.length;
        ws.forEach((w, i) => w.classList.toggle('on', i < hasta));
      },
    });
  });
}

function initDesplegables() {
  document.querySelectorAll('details').forEach(d => d.addEventListener('toggle', () => {
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  }));
}

function initAreaModal() {
  const modal = document.getElementById('areaModal');
  if (!modal || typeof modal.showModal !== 'function') return;
  const $ = id => document.getElementById(id);
  const img = $('areaModalImg');
  const wsp = $('areaModalWsp');
  let origen = null;
  const lista = (items, icono) => items.map(t => `<li><svg class="ico" aria-hidden="true"><use href="#i-${icono}"/></svg><span>${esc(t)}</span></li>`).join('');
  const abrir = (id, btn) => {
    const a = AREAS[id];
    if (!a) return;
    origen = btn;
    img.src = `images/${id}-640.webp`;
    img.srcset = `images/${id}-640.webp 640w, images/${id}.webp 1254w`;
    img.sizes = '(max-width: 900px) 92vw, 380px';
    img.alt = btn.closest('li')?.querySelector('img')?.alt || '';
    $('areaModalGrupo').textContent = a.grupo;
    $('areaModalTitulo').textContent = a.titulo;
    $('areaModalIntro').textContent = a.intro;
    $('areaModalHacemos').innerHTML = lista(a.hacemos, 'check');
    $('areaModalMano').innerHTML = lista(a.mano, 'carpeta');
    wsp.href = `https://wa.me/${WSP}?text=${encodeURIComponent(a.msg)}`;
    modal.showModal();
    modal.scrollTop = 0;
    document.body.classList.add('no-scroll');
    modal.querySelector('[data-cerrar]')?.focus();
  };
  document.querySelectorAll('[data-area]').forEach(btn => btn.addEventListener('click', () => abrir(btn.dataset.area, btn)));
  modal.querySelector('[data-cerrar]')?.addEventListener('click', () => modal.close());
  modal.addEventListener('click', e => { if (e.target === modal) modal.close(); });
  modal.addEventListener('close', () => {
    document.body.classList.remove('no-scroll');
    origen?.focus();
  });
}

function initPuertas() {
  const lista = document.querySelector('.puertas__lista');
  if (!lista) return;
  const tabs = [...lista.querySelectorAll('[role="tab"]')];
  const elegir = (tab, foco) => {
    tabs.forEach(t => {
      const activo = t === tab;
      t.setAttribute('aria-selected', String(activo));
      t.tabIndex = activo ? 0 : -1;
      const panel = document.getElementById(t.getAttribute('aria-controls'));
      if (panel) panel.hidden = !activo;
    });
    if (foco) tab.focus();
    revelarNuevos(document.getElementById(tab.getAttribute('aria-controls')));
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  };
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => elegir(tab));
    tab.addEventListener('keydown', e => {
      let j = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') j = (i + 1) % tabs.length;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') j = (i - 1 + tabs.length) % tabs.length;
      if (e.key === 'Home') j = 0;
      if (e.key === 'End') j = tabs.length - 1;
      if (j !== null) { e.preventDefault(); elegir(tabs[j], true); }
    });
  });
  const desdeHash = () => {
    const tab = document.getElementById(`tab-${location.hash.slice(1)}`);
    if (!tab) return;
    elegir(tab);
    document.getElementById('areas')?.scrollIntoView();
  };
  desdeHash();
  window.addEventListener('hashchange', desdeHash);
}

function initForm() {
  const form = document.getElementById('consultaForm');
  if (!form) return;
  const reglas = [
    ['f-nombre', 'e-nombre', v => v.trim().length >= 2],
    ['f-email', 'e-email', v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())],
    ['f-consulta', 'e-consulta', v => v.trim().length >= 10],
  ].map(([i, e, ok]) => ({ input: document.getElementById(i), error: document.getElementById(e), ok })).filter(r => r.input && r.error);
  const validar = (r, mostrar) => {
    const bien = r.ok(r.input.value);
    if (mostrar || r.input.getAttribute('aria-invalid') === 'true') {
      r.input.setAttribute('aria-invalid', String(!bien));
      r.error.hidden = bien;
    }
    return bien;
  };
  reglas.forEach(r => {
    r.input.addEventListener('input', () => validar(r, false));
    r.input.addEventListener('blur', () => { if (r.input.value) validar(r, true); });
  });
  form.addEventListener('submit', e => {
    e.preventDefault();
    const malos = reglas.filter(r => !validar(r, true));
    if (malos.length) {
      malos[0].input.focus();
      showToast('Revisá los campos marcados y volvé a enviar.');
      return;
    }
    const btn = form.querySelector('.form__enviar');
    const html = btn.innerHTML;
    btn.disabled = true;
    btn.textContent = 'Enviando…';
    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = html;
      form.reset();
      reglas.forEach(r => { r.input.removeAttribute('aria-invalid'); r.error.hidden = true; });
      showToast('¡Gracias! El envío de mensajes se activa al pasar la web a producción.');
    }, 800);
  });
}

initHeroMotion();
initHeroParallax();
initLeeScroll();
initDesplegables();
initAreaModal();
initPuertas();
initForm();
initReveals();
initNav();
initWspFloat();
initModelBarScroll();
