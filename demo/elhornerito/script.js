document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WA = '5493412658778';
const waLink = msg => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const refrescar = () => { if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); };

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

const SALAS = [
  {
    "n": 1,
    "nombre": "Sala de 1",
    "edad": "1 año cumplido al 30 de junio",
    "foco": "Moverse y explorar",
    "resumen": "Un espacio seguro para gatear, trepar, dar los primeros pasos y descubrir el mundo con todo el cuerpo.",
    "hace": [
      "Juego de movimiento con rampas, colchonetas y arcos para trepar",
      "Experiencias con texturas, sonidos y colores",
      "Canciones, rimas y primeros cuentos",
      "Rutinas de comida, descanso e higiene, acompañadas con calma"
    ],
    "foto": "images/sala-1-movimiento-640.webp",
    "alt": "Sala de 1 con rampas de goma espuma, un arco de madera y juguetes de encastre sobre colchonetas"
  },
  {
    "n": 2,
    "nombre": "Sala de 2",
    "edad": "2 años cumplidos al 30 de junio",
    "foco": "Hacer por su cuenta",
    "resumen": "Apilan, encastran, guardan y eligen: cada día se animan a hacer un poco más por su cuenta.",
    "hace": [
      "Construcciones con bloques de madera y encastres",
      "Primeros pasos de autonomía: guardar, elegir y pedir",
      "Juego compartido en grupos chicos",
      "Rincón de cuentos y de música"
    ],
    "foto": "images/sala-2-bloques-640.webp",
    "alt": "Mesa baja con bloques de madera apilados y una torre de aros de colores"
  },
  {
    "n": 3,
    "nombre": "Sala de 3",
    "edad": "3 años cumplidos al 30 de junio",
    "foco": "Expresarse y crear",
    "resumen": "Pintan, dibujan, inventan juegos con otros y empiezan a ponerle palabras a lo que sienten.",
    "hace": [
      "Pintura, dibujo y modelado en la mesa de arte",
      "Juego dramático y juego en rincones",
      "Juegos en grupo con reglas simples",
      "Ponerle nombre a lo que sienten"
    ],
    "foto": "images/sala-3-arte-640.webp",
    "alt": "Mesa de arte con hojas en blanco, crayones y frascos de témpera listos para pintar"
  },
  {
    "n": 4,
    "nombre": "Sala de 4",
    "edad": "4 años cumplidos al 30 de junio",
    "foco": "Preguntar y resolver",
    "resumen": "Cuentan, clasifican, enhebran y trabajan en proyectos para responder sus propias preguntas.",
    "hace": [
      "Proyectos para investigar el entorno",
      "Contar, clasificar y comparar con materiales concretos",
      "Enhebrado y juegos de motricidad fina",
      "Más autonomía para el paso a la sala de 5"
    ],
    "foto": "images/sala-4-enhebrar-640.webp",
    "alt": "Mesa con cuentas de madera para enhebrar, cordones y tablas con formas para contar"
  }
];

const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

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

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; (document.querySelector('.site-header') || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 1041px)');
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

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const img = hero.querySelector('[data-hero-img]');
  if (img) gsap.set(img, { scale: 1.06 });
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  if (img) tl.from(img, { scale: 1.16, duration: 1.8 }, 0);
  tl.from(hero.querySelectorAll('.pill'), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 36, opacity: 0, filter: 'blur(8px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero__kicker, .hero-lead'), { y: 24, opacity: 0, duration: 1, stagger: 0.08 }, 0.42)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.55)
    .from(hero.querySelectorAll('.placa'), { y: 18, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.7);
  if (img && typeof ScrollTrigger !== 'undefined') {
    gsap.fromTo(img, { yPercent: -2.5 }, { yPercent: 2.5, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
  }
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

let abrirSala = null;

function initSalaModal() {
  const modal = document.getElementById('salaModal');
  if (!modal) return;
  const panel = modal.querySelector('.modal__panel');
  const cerrar = document.getElementById('salaCerrar');
  let origen = null;
  let timer = 0;
  const focusables = () => [...panel.querySelectorAll('a[href], button:not([disabled])')].filter(el => el.offsetParent !== null);
  const close = () => {
    modal.classList.remove('open');
    document.body.classList.remove('no-scroll');
    clearTimeout(timer);
    timer = setTimeout(() => { modal.hidden = true; }, 320);
    origen?.focus();
  };
  const open = (n, trigger) => {
    const s = SALAS.find(x => x.n === Number(n));
    if (!s) return;
    origen = trigger || null;
    const foto = document.getElementById('salaFoto');
    foto.src = s.foto;
    foto.alt = s.alt;
    document.getElementById('salaEdad').textContent = s.edad;
    document.getElementById('salaNombre').textContent = `${s.nombre} · ${s.foco}`;
    document.getElementById('salaResumen').textContent = s.resumen;
    document.getElementById('salaHace').innerHTML = s.hace.map(t => `<li>${esc(t)}</li>`).join('');
    document.getElementById('salaWsp').href = waLink(`Hola, les escribo desde la web de El hornerito. Quiero consultar por una vacante en la sala de ${s.n} para 2027.`);
    document.getElementById('salaWspTxt').textContent = `Consultar por la sala de ${s.n}`;
    modal.setAttribute('aria-label', s.nombre);
    clearTimeout(timer);
    modal.hidden = false;
    void modal.offsetWidth;
    modal.classList.add('open');
    document.body.classList.add('no-scroll');
    cerrar.focus();
  };
  abrirSala = open;
  document.querySelectorAll('.sala-card__ver[data-sala]').forEach(btn => {
    btn.addEventListener('click', () => open(btn.dataset.sala, btn));
  });
  cerrar.addEventListener('click', close);
  modal.addEventListener('click', e => { if (e.target === modal) close(); });
  document.addEventListener('keydown', e => {
    if (modal.hidden) return;
    if (e.key === 'Escape') { close(); return; }
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

let elegirTab = null;

function initTabsSalas() {
  const tabs = [...document.querySelectorAll('[data-tab-sala]')];
  if (!tabs.length) return;
  const activar = (tab, foco) => {
    tabs.forEach(t => {
      const activo = t === tab;
      t.setAttribute('aria-selected', String(activo));
      t.tabIndex = activo ? 0 : -1;
      const panel = document.getElementById(t.getAttribute('aria-controls'));
      if (!panel) return;
      panel.hidden = !activo;
      panel.classList.remove('is-entrando');
      if (activo && !reduceMotion) { void panel.offsetWidth; panel.classList.add('is-entrando'); }
    });
    if (foco) tab.focus();
    refrescar();
  };
  elegirTab = n => { const t = tabs.find(x => x.dataset.tabSala === String(n)); if (t) activar(t, false); };
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => activar(tab, false));
    tab.addEventListener('keydown', e => {
      let j = -1;
      if (e.key === 'ArrowRight') j = (i + 1) % tabs.length;
      if (e.key === 'ArrowLeft') j = (i - 1 + tabs.length) % tabs.length;
      if (e.key === 'Home') j = 0;
      if (e.key === 'End') j = tabs.length - 1;
      if (j > -1) { e.preventDefault(); activar(tabs[j], true); }
    });
  });
}

function salaPara(mes, anio) {
  return 2027 - anio - (mes > 6 ? 1 : 0);
}

function initGuia() {
  const form = document.getElementById('guiaForm');
  if (!form) return;
  const mes = document.getElementById('guiaMes');
  const anio = document.getElementById('guiaAnio');
  const ext = document.getElementById('guiaExt');
  const visita = document.getElementById('guiaVisita');
  const nombre = document.getElementById('guiaNombre');
  const pista = document.getElementById('guiaPista');
  const titulo = document.getElementById('guiaSala');
  const texto = document.getElementById('guiaTexto');
  const detalle = document.getElementById('guiaDetalle');
  const wsp = document.getElementById('guiaWsp');
  const ver = document.getElementById('guiaVer');
  const paradas = [...pista.querySelectorAll('.pista__paradas li')];
  const defaultHref = wsp.href;

  const pintar = () => {
    const m = Number(mes.value);
    const a = Number(anio.value);
    if (!m || !a) {
      pista.classList.add('is-vacia');
      paradas.forEach(p => p.classList.remove('is-activa'));
      titulo.textContent = 'Elegí la fecha';
      texto.textContent = 'Con el mes y el año de nacimiento te mostramos la sala que le corresponde para 2027.';
      texto.classList.add('guia__vacio');
      detalle.hidden = true;
      ver.hidden = true;
      wsp.href = defaultHref;
      return;
    }
    const edad = salaPara(m, a);
    const nacio = `${MESES[m - 1]} de ${a}`;
    const quien = nombre.value.trim();
    const turnoEl = form.querySelector('input[name="turno"]:checked');
    const turno = turnoEl ? turnoEl.value : '';
    let msg = `Hola, les escribo desde la web de El hornerito. Quiero consultar por la inscripción 2027${quien ? ` de ${quien}` : ''}: nació en ${nacio}`;
    texto.classList.remove('guia__vacio');
    paradas.forEach((p, i) => p.classList.toggle('is-activa', i === edad - 1));
    if (edad >= 1 && edad <= 4) {
      const s = SALAS[edad - 1];
      pista.classList.remove('is-vacia');
      pista.style.setProperty('--pos', String(edad - 1));
      titulo.textContent = s.nombre;
      texto.textContent = s.resumen;
      detalle.textContent = `Nació en ${nacio}: al 30 de junio de 2027 va a tener ${edad === 1 ? '1 año cumplido' : `${edad} años cumplidos`}.`;
      detalle.hidden = false;
      ver.hidden = false;
      ver.dataset.sala = String(edad);
      msg += `, así que iría a la sala de ${edad}.`;
    } else if (edad < 1) {
      pista.classList.add('is-vacia');
      titulo.textContent = 'Sala de 1 en 2028';
      texto.textContent = 'En 2027 todavía no llega a la edad de la sala de 1, que es para chicos con 1 año cumplido al 30 de junio. Escribinos y te avisamos cuándo abre su inscripción.';
      detalle.hidden = true;
      ver.hidden = true;
      msg += '. Quiero saber desde cuándo puede empezar en la sala de 1.';
    } else {
      pista.classList.add('is-vacia');
      titulo.textContent = 'Sala de 5';
      texto.textContent = 'Con esa fecha, en 2027 va a sala de 5. En El hornerito las salas van de 1 a 4 años: escribinos y te orientamos.';
      detalle.hidden = true;
      ver.hidden = true;
      msg += ', así que en 2027 iría a sala de 5. ¿Me pueden orientar?';
    }
    if (turno === 'a definir') msg += ' Todavía no definimos el turno.';
    else if (turno) msg += ` Buscamos turno ${turno}.`;
    if (ext.checked) msg += ' Necesitamos horario extendido.';
    if (visita.checked) msg += ' ¿Podemos coordinar una visita al jardín?';
    wsp.href = waLink(msg);
  };

  [mes, anio, ext, visita].forEach(el => el.addEventListener('change', pintar));
  form.querySelectorAll('input[name="turno"]').forEach(el => el.addEventListener('change', pintar));
  nombre.addEventListener('input', pintar);
  ver.addEventListener('click', () => {
    const n = ver.dataset.sala;
    if (abrirSala) { abrirSala(n, ver); return; }
    if (elegirTab) elegirTab(n);
    document.getElementById('salas')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  });
}

function initFaq() {
  document.querySelectorAll('.faq details').forEach(d => d.addEventListener('toggle', refrescar));
}

function initForm() {
  const form = document.getElementById('contactoForm');
  if (!form) return;
  const reglas = [
    { el: form.querySelector('#fNombre'), ok: v => v.trim().length >= 2, msg: 'Contanos tu nombre.' },
    { el: form.querySelector('#fTel'), ok: v => v.replace(/\D/g, '').length >= 8, msg: 'Revisá el número: con el código de área alcanza.' }
  ];
  const marcar = (r, mostrar) => {
    const campo = r.el.closest('.campo');
    const bien = r.ok(r.el.value);
    if (mostrar || campo.classList.contains('is-error')) {
      campo.classList.toggle('is-error', !bien);
      r.el.setAttribute('aria-invalid', String(!bien));
      campo.querySelector('.campo__error').textContent = bien ? '' : r.msg;
    }
    return bien;
  };
  reglas.forEach(r => r.el.addEventListener('input', () => marcar(r, false)));
  form.addEventListener('submit', e => {
    e.preventDefault();
    const malos = reglas.filter(r => !marcar(r, true));
    if (malos.length) { malos[0].el.focus(); return; }
    const btn = form.querySelector('button[type="submit"]');
    const txt = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Enviando…';
    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = txt;
      form.reset();
      showToast('¡Gracias! El envío de mensajes se activa al pasar la web a producción.');
    }, 800);
  });
}

function initAnio() {
  document.querySelectorAll('[data-anio]').forEach(el => { el.textContent = new Date().getFullYear(); });
}

[initModelBarScroll, initWspFloat, initNav, initSalaModal, initTabsSalas, initGuia, initFaq, initForm, initAnio, initHeroMotion, initReveals].forEach(fn => {
  try { fn(); } catch (e) { console.error(e); }
});
