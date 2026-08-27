document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}
if (typeof gsap === 'undefined') {
  document.querySelectorAll('[data-animate]').forEach(el => {
    el.style.opacity = 1; el.style.transform = 'none'; el.style.clipPath = 'none';
  });
}
if (typeof ScrollTrigger !== 'undefined') {
  window.addEventListener('load', () => ScrollTrigger.refresh());
}

const EMPRESAS = [
  {
    id: 'vantek', nombre: 'Vantek Logística', rubro: 'logistica', rubroLabel: 'Logística y depósito',
    tamano: '500-1000 empleados', puntaje: 3.8, resenas: 142,
    dims: [['Sueldo', 4.1], ['Horarios', 2.9], ['Jefatura', 3.4], ['Crecimiento', 3.6], ['Clima', 4.2]],
    citas: [
      { t: 'Pagan en fecha siempre, eso no falla. Los turnos rotativos se avisan con poca anticipación.', f: 'Operario de depósito · ingresó en 2021' },
      { t: 'La capacitación de ingreso está bien armada. Para crecer hay que esperar a que se libere un puesto.', f: 'Administrativo · ingresó en 2019' }
    ]
  },
  {
    id: 'kirola', nombre: 'Kirola Retail', rubro: 'comercio', rubroLabel: 'Comercio y retail',
    tamano: 'Más de 1000 empleados', puntaje: 2.9, resenas: 318,
    dims: [['Sueldo', 2.6], ['Horarios', 2.2], ['Jefatura', 2.8], ['Crecimiento', 3.1], ['Clima', 3.8]],
    citas: [
      { t: 'Con los compañeros de local se labura bárbaro. Los francos rotativos cambian de una semana a la otra.', f: 'Vendedora · ingresó en 2022' },
      { t: 'Hay plan de carrera escrito, pero los ascensos se definen bastante por afinidad con el encargado.', f: 'Encargado de sucursal · ingresó en 2018' }
    ]
  },
  {
    id: 'sanare', nombre: 'Sanare Salud', rubro: 'salud', rubroLabel: 'Salud',
    tamano: '200-500 empleados', puntaje: 4.1, resenas: 76,
    dims: [['Sueldo', 3.7], ['Horarios', 3.4], ['Jefatura', 4.3], ['Crecimiento', 4.2], ['Clima', 4.6]],
    citas: [
      { t: 'La jefatura de enfermería escucha de verdad. Si pedís cambiar una guardia, se puede conversar.', f: 'Enfermería · ingresó en 2020' },
      { t: 'Pagan los adicionales de guardia sin que tengas que reclamarlos. Las guardias de fin de semana pesan.', f: 'Técnico · ingresó en 2023' }
    ]
  },
  {
    id: 'auralis', nombre: 'Auralis Contact', rubro: 'atencion', rubroLabel: 'Atención al cliente',
    tamano: '500-1000 empleados', puntaje: 2.4, resenas: 205,
    dims: [['Sueldo', 2.4], ['Horarios', 2.1], ['Jefatura', 2.2], ['Crecimiento', 2.5], ['Clima', 3.0]],
    citas: [
      { t: 'Entrás sabiendo que es por objetivos, pero los objetivos se recalculan todos los meses hacia arriba.', f: 'Representante · ingresó en 2023' },
      { t: 'El clima entre compañeros salva bastante. La rotación es tan alta que en un año cambió medio piso.', f: 'Representante · ingresó en 2022' }
    ]
  },
  {
    id: 'nodonueve', nombre: 'Nodo Nueve', rubro: 'oficina', rubroLabel: 'Oficina y administración',
    tamano: '50-200 empleados', puntaje: 4.4, resenas: 38,
    dims: [['Sueldo', 4.2], ['Horarios', 4.6], ['Jefatura', 4.4], ['Crecimiento', 4.0], ['Clima', 4.7]],
    citas: [
      { t: 'Home office real, no de mentira. Nadie te escribe un domingo y si lo hacen, se disculpan.', f: 'Analista · ingresó en 2022' },
      { t: 'Al ser chica se aprende de todo un poco. El techo salarial se nota a los dos o tres años.', f: 'Administración · ingresó en 2021' }
    ]
  },
  {
    id: 'ferrone', nombre: 'Ferrone Gastronomía', rubro: 'gastronomia', rubroLabel: 'Gastronomía',
    tamano: '50-200 empleados', puntaje: 3.2, resenas: 61,
    dims: [['Sueldo', 3.0], ['Horarios', 2.4], ['Jefatura', 3.3], ['Crecimiento', 3.4], ['Clima', 4.0]],
    citas: [
      { t: 'La cocina es exigente pero se enseña. El cierre siempre se estira más de lo que dice el horario.', f: 'Cocina · ingresó en 2023' },
      { t: 'Las propinas se reparten parejo entre salón y cocina, cosa que no pasa en todos lados.', f: 'Salón · ingresó en 2021' }
    ]
  },
  {
    id: 'mendel', nombre: 'Grupo Mendel', rubro: 'oficina', rubroLabel: 'Oficina y administración',
    tamano: 'Más de 1000 empleados', puntaje: 3.5, resenas: 264,
    dims: [['Sueldo', 3.9], ['Horarios', 3.2], ['Jefatura', 3.0], ['Crecimiento', 3.6], ['Clima', 3.6]],
    citas: [
      { t: 'Los beneficios están bien y el sueldo es competitivo. Las decisiones tardan muchísimo en bajar.', f: 'Analista senior · ingresó en 2019' },
      { t: 'Depende enormemente del área en la que caigas. Dos personas del mismo edificio te cuentan cosas distintas.', f: 'Administración · ingresó en 2020' }
    ]
  },
  {
    id: 'delvent', nombre: 'Delvent Frío', rubro: 'logistica', rubroLabel: 'Logística y depósito',
    tamano: '200-500 empleados', puntaje: 3.9, resenas: 47,
    dims: [['Sueldo', 4.0], ['Horarios', 3.6], ['Jefatura', 3.8], ['Crecimiento', 3.5], ['Clima', 4.3]],
    citas: [
      { t: 'La ropa de trabajo para cámara de frío la entregan completa y la reponen sin drama.', f: 'Operario · ingresó en 2022' },
      { t: 'El turno noche paga bien. Para pasar a turno mañana hay lista de espera larga.', f: 'Operario · ingresó en 2020' }
    ]
  }
];

let revealsListos = false;

function showToast(msg) {
  let wrap = document.querySelector('.toast-wrap');
  if (!wrap) { wrap = document.createElement('div'); wrap.className = 'toast-wrap'; wrap.setAttribute('aria-live', 'polite'); document.body.appendChild(wrap); }
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  toast.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M20 6L9 17l-5-5"/></svg><span>${esc(msg)}</span>`;
  wrap.appendChild(toast);
  setTimeout(() => { toast.classList.add('hiding'); setTimeout(() => toast.remove(), 220); }, 3600);
}

function revelarNuevos(cont) {
  if (!revealsListos || !cont) return;
  cont.querySelectorAll('[data-animate]:not(.in)').forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i * 0.05, 0.35)}s`;
    requestAnimationFrame(() => el.classList.add('in'));
  });
}

function initReveals() {
  const items = document.querySelectorAll('[data-animate]');
  revealsListos = true;
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
    const header = document.querySelector('.topbar');
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
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); }
  });
  const syncInert = () => {
    if (desktopMq.matches) nav.removeAttribute('inert');
    else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  desktopMq.addEventListener('change', syncInert);
  syncInert();
}

function initAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      irA(target);
    });
  });
}

function irA(target) {
  const top = target.getBoundingClientRect().top + window.scrollY - 12;
  window.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' });
}

function initFloat() {
  const cta = document.getElementById('floatCta');
  if (!cta) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) cta.classList.add('visible'); else cta.classList.remove('visible');
  }, { passive: true });
}

/* ---------- buscador de empresas ---------- */
const barra = (v) => `<span class="ficha-barra" style="--w:${(v / 5 * 100).toFixed(0)}%"><i></i></span>`;

function fichaHTML(e) {
  return `<button type="button" class="ficha" data-empresa="${esc(e.id)}" data-animate="up" style="opacity:0;transform:translateY(22px)" aria-label="Ver la ficha de ${esc(e.nombre)}">
    <span class="ficha-head">
      <span class="ficha-nombre">${esc(e.nombre)}</span>
      <span class="ficha-meta">${esc(e.rubroLabel)} · ${esc(e.tamano)}</span>
    </span>
    <span class="ficha-score">
      <span class="score-num">${e.puntaje.toFixed(1)}</span>
      <span class="score-de">/5</span>
      <span class="score-n">${e.resenas} reseñas</span>
    </span>
    ${barra(e.puntaje)}
    <span class="ficha-cita">«${esc(e.citas[0].t)}»</span>
    <span class="ficha-firma">${esc(e.citas[0].f)}</span>
  </button>`;
}

function initBuscador() {
  const cont = document.getElementById('fichas');
  const inputLista = document.getElementById('q-lista');
  const inputHero = document.getElementById('q-hero');
  const chips = [...document.querySelectorAll('#chipsRubro .chip')];
  const count = document.getElementById('listaCount');
  const vacio = document.getElementById('listaVacio');
  if (!cont) return;
  let rubro = 'todos';

  const render = () => {
    const q = (inputLista?.value || '').trim().toLowerCase();
    const lista = EMPRESAS.filter(e => {
      const okRubro = rubro === 'todos' || e.rubro === rubro;
      const okTexto = !q || `${e.nombre} ${e.rubroLabel}`.toLowerCase().includes(q);
      return okRubro && okTexto;
    });
    cont.innerHTML = lista.map(fichaHTML).join('');
    if (count) count.textContent = lista.length === 1 ? '1 empresa' : `${lista.length} empresas`;
    if (vacio) vacio.hidden = lista.length > 0;
    revelarNuevos(cont);
  };

  const aplicarRubro = (r) => {
    rubro = r;
    chips.forEach(c => c.classList.toggle('is-on', c.dataset.rubro === r));
    render();
  };

  chips.forEach(c => c.addEventListener('click', () => aplicarRubro(c.dataset.rubro)));
  inputLista?.addEventListener('input', render);

  const buscarDesdeHero = (texto) => {
    if (inputLista) inputLista.value = texto;
    rubro = 'todos';
    chips.forEach(c => c.classList.toggle('is-on', c.dataset.rubro === 'todos'));
    render();
    const destino = document.getElementById('buscar');
    if (destino) irA(destino);
  };

  document.getElementById('buscadorHero')?.addEventListener('submit', e => {
    e.preventDefault();
    buscarDesdeHero((inputHero?.value || '').trim());
  });
  document.querySelectorAll('.pill-hint').forEach(p => {
    p.addEventListener('click', () => {
      if (inputHero) inputHero.value = p.dataset.q;
      buscarDesdeHero(p.dataset.q);
    });
  });
  document.querySelectorAll('.rubro[data-rubro]').forEach(b => {
    b.addEventListener('click', () => {
      if (inputLista) inputLista.value = '';
      aplicarRubro(b.dataset.rubro);
      const destino = document.getElementById('buscar');
      if (destino) irA(destino);
    });
  });

  cont.addEventListener('click', e => {
    const card = e.target.closest('[data-empresa]');
    if (card) abrirFicha(card.dataset.empresa, card);
  });

  render();
}

/* ---------- modal de ficha ---------- */
let modalVolverA = null;

function abrirFicha(id, origen) {
  const modal = document.getElementById('modal');
  const body = document.getElementById('modalBody');
  const e = EMPRESAS.find(x => x.id === id);
  if (!modal || !body || !e) return;
  modalVolverA = origen || null;
  const titulo = document.getElementById('modalTitulo');
  const meta = document.getElementById('modalMeta');
  if (titulo) titulo.textContent = e.nombre;
  if (meta) meta.textContent = `${e.rubroLabel} · ${e.tamano}`;
  body.innerHTML = `
    <div class="modal-score ficha-score">
      <span class="score-num">${e.puntaje.toFixed(1)}</span>
      <span class="score-de">/5</span>
      <span class="score-n">${e.resenas} reseñas verificadas</span>
    </div>
    ${barra(e.puntaje)}
    <ul class="modal-dims">
      ${e.dims.map(([n, v]) => `<li><span>${esc(n)}</span>${barra(v)}<em>${v.toFixed(1)}</em></li>`).join('')}
    </ul>
    <div class="modal-citas">
      ${e.citas.map(c => `<p class="modal-cita">«${esc(c.t)}»<span>${esc(c.f)}</span></p>`).join('')}
    </div>
    <div class="modal-pie">
      <a class="btn btn-solid" href="#sumate" data-cerrar>Escribir mi reseña de ${esc(e.nombre)}</a>
      <p class="modal-nota">Las reseñas se publican sin el nombre de quien las escribe.</p>
    </div>`;
  modal.hidden = false;
  document.body.classList.add('no-scroll');
  document.getElementById('modalClose')?.focus();
}

function cerrarFicha() {
  const modal = document.getElementById('modal');
  if (!modal || modal.hidden) return;
  modal.hidden = true;
  document.body.classList.remove('no-scroll');
  modalVolverA?.focus();
  modalVolverA = null;
}

function initModal() {
  const modal = document.getElementById('modal');
  if (!modal) return;
  document.getElementById('modalClose')?.addEventListener('click', cerrarFicha);
  modal.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar]')) cerrarFicha();
  });
  document.addEventListener('keydown', e => {
    if (modal.hidden) return;
    if (e.key === 'Escape') { cerrarFicha(); return; }
    if (e.key !== 'Tab') return;
    const foco = modal.querySelectorAll('a[href], button:not([disabled])');
    if (!foco.length) return;
    const primero = foco[0];
    const ultimo = foco[foco.length - 1];
    if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
    else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
  });
}

/* ---------- capítulo: tu reseña, sin tu nombre ---------- */
function initAnon() {
  const stage = document.getElementById('anonStage');
  const pasos = [...document.querySelectorAll('.anon-pasos li')];
  if (!stage || !pasos.length) return;

  const setPaso = p => {
    const i = Math.min(pasos.length - 1, Math.max(0, Math.floor(p * pasos.length * 0.999)));
    pasos.forEach((li, n) => li.classList.toggle('is-on', n === i));
    stage.classList.remove('is-p1', 'is-p2', 'is-p3', 'is-p4');
    stage.classList.add('is-p' + (i + 1));
  };
  setPaso(0);

  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    stage.classList.add('is-p4');
    pasos.forEach(li => li.classList.add('is-on'));
    return;
  }

  const mm = gsap.matchMedia();
  mm.add('(min-width: 1081px)', () => {
    const st = ScrollTrigger.create({
      trigger: stage, start: 'top top', end: '+=240%',
      pin: true, scrub: 0.6, invalidateOnRefresh: true,
      onUpdate: self => setPaso(self.progress)
    });
    return () => st.kill();
  });
  mm.add('(max-width: 1080px)', () => {
    stage.classList.add('is-sticky-mobile');
    requestAnimationFrame(() => ScrollTrigger.refresh());
    const st = ScrollTrigger.create({
      trigger: stage, start: 'top top', end: 'bottom bottom',
      scrub: 0.6, invalidateOnRefresh: true,
      onUpdate: self => setPaso(self.progress)
    });
    return () => { st.kill(); stage.classList.remove('is-sticky-mobile'); };
  });
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  [['.problema-media img', 4], ['.empresas-media img', 4], ['.cierre-bg img', 6]].forEach(([sel, mov]) => {
    document.querySelectorAll(sel).forEach(img => {
      gsap.fromTo(img,
        { yPercent: -mov, scale: 1.14 },
        {
          yPercent: mov, scale: 1.14, ease: 'none',
          scrollTrigger: { trigger: img.closest('figure, div') || img, start: 'top bottom', end: 'bottom top', scrub: 0.6, invalidateOnRefresh: true }
        }
      );
    });
  });
}

function initForm() {
  const form = document.getElementById('sumateForm');
  if (!form) return;
  const btn = document.getElementById('formSubmit');
  const reglas = [
    { input: 'f-nombre', error: 'err-nombre', test: v => v.trim().length >= 2, msg: 'Poné tu nombre para saber cómo llamarte.' },
    { input: 'f-mail', error: 'err-mail', test: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()), msg: 'Revisá el correo: ahí te avisamos cuando abramos tu rubro.' },
    { input: 'f-rubro', error: 'err-rubro', test: v => v !== '', msg: 'Elegí el rubro donde trabajás.' }
  ];

  reglas.forEach(r => {
    const el = document.getElementById(r.input);
    const limpiar = () => {
      const box = el.closest('.campo');
      if (!box.classList.contains('has-error')) return;
      if (r.test(el.value)) {
        box.classList.remove('has-error');
        el.removeAttribute('aria-invalid');
        document.getElementById(r.error).textContent = '';
      }
    };
    el?.addEventListener('input', limpiar);
    el?.addEventListener('change', limpiar);
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    let ok = true;
    let primero = null;
    reglas.forEach(r => {
      const el = document.getElementById(r.input);
      const box = el.closest('.campo');
      const err = document.getElementById(r.error);
      if (!r.test(el.value)) {
        ok = false;
        box.classList.add('has-error');
        el.setAttribute('aria-invalid', 'true');
        err.textContent = r.msg;
        if (!primero) primero = el;
      } else {
        box.classList.remove('has-error');
        el.removeAttribute('aria-invalid');
        err.textContent = '';
      }
    });
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

function initYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}

initNav();
initAnchors();
initBuscador();
initModal();
initAnon();
initParallax();
initFloat();
initForm();
initYear();
initReveals();
