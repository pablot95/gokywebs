const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5493413222965';

const MESES = {
  nov: {
    nombre: 'Noviembre', tema: 'Volver al cuerpo',
    semanas: [
      { n: 1, fecha: 'Martes 3/11', hora: '19 h', tipo: 'Clase en vivo', titulo: 'Respiración consciente para bajar la ansiedad', texto: 'Tres técnicas de respiración para usar cuando el día se acelera, explicadas paso a paso y practicadas en el encuentro.', lleva: ['Una práctica de 10 minutos para repetir en casa', 'El audio guiado en el grupo'], dur: '60 min', modo: 'Por videollamada' },
      { n: 2, fecha: 'Martes 10/11', hora: '19 h', tipo: 'Curso corto', titulo: 'Introducción a la mesa radiónica', texto: 'Qué es una mesa radiónica, cómo se lee el péndulo y para qué sirve cada sector del tablero.', lleva: ['3 clases cortas para ver a tu ritmo', 'Una ronda de preguntas en vivo'], dur: '3 clases + 1 encuentro', modo: 'Grabado y en vivo' },
      { n: 3, fecha: 'Martes 17/11', hora: '19 h', tipo: 'Práctica guiada', titulo: 'Meditación para soltar lo que no es tuyo', texto: 'Una meditación guiada para reconocer las cargas ajenas que venís sosteniendo y devolverlas sin culpa.', lleva: ['La meditación en audio', 'Una pregunta para escribir durante la semana'], dur: '45 min', modo: 'Por videollamada' },
      { n: 4, fecha: 'Martes 24/11', hora: '19 h', tipo: 'Encuentro de comunidad', titulo: 'Círculo de palabra: cómo cerrás el mes', texto: 'Nos encontramos a compartir qué se movió en estas semanas y qué querés llevarte al mes que viene.', lleva: ['Un espacio para hablar y que te escuchen', 'La propuesta del mes siguiente'], dur: '75 min', modo: 'Por videollamada' }
    ]
  },
  dic: {
    nombre: 'Diciembre', tema: 'Cerrar el año en calma',
    semanas: [
      { n: 1, fecha: 'Martes 1/12', hora: '19 h', tipo: 'Clase en vivo', titulo: 'Limpieza energética de tu casa para fin de año', texto: 'Cómo limpiar y armonizar los ambientes de tu casa con sahumo, sal e intención, sin comprar nada especial.', lleva: ['Una lista simple para hacerla en una tarde', 'El paso a paso en PDF'], dur: '60 min', modo: 'Por videollamada' },
      { n: 2, fecha: 'Martes 8/12', hora: '19 h', tipo: 'Curso corto', titulo: 'Péndulo: primeros pasos', texto: 'Cómo elegir tu péndulo, programarlo y hacerle preguntas claras para que las respuestas te sirvan.', lleva: ['3 clases cortas para ver a tu ritmo', 'Plantillas para practicar'], dur: '3 clases + 1 encuentro', modo: 'Grabado y en vivo' },
      { n: 3, fecha: 'Martes 15/12', hora: '19 h', tipo: 'Práctica guiada', titulo: 'Escritura terapéutica: carta al año que se va', texto: 'Una práctica de escritura guiada para agradecer, soltar y poner en palabras lo que viviste este año.', lleva: ['Las consignas para escribir', 'Un cierre con meditación'], dur: '50 min', modo: 'Por videollamada' },
      { n: 4, fecha: 'Martes 22/12', hora: '19 h', tipo: 'Encuentro de comunidad', titulo: 'Ritual de intenciones para el año nuevo', texto: 'Armamos en grupo las intenciones del año que empieza y una práctica simple para sostenerlas.', lleva: ['Tu lista de intenciones', 'La propuesta de enero'], dur: '75 min', modo: 'Por videollamada' }
    ]
  },
  ene: {
    nombre: 'Enero', tema: 'Empezar de nuevo',
    semanas: [
      { n: 1, fecha: 'Martes 5/1', hora: '19 h', tipo: 'Clase en vivo', titulo: 'Chakras: un mapa para entender tu energía', texto: 'Los siete centros de energía explicados en simple: qué expresa cada uno y cómo notar cuándo está en desequilibrio.', lleva: ['Una guía visual de los chakras', 'Una meditación corta por centro'], dur: '60 min', modo: 'Por videollamada' },
      { n: 2, fecha: 'Martes 12/1', hora: '19 h', tipo: 'Curso corto', titulo: 'Autocuidado energético para el día a día', texto: 'Herramientas de protección y limpieza energética para usar antes y después de los días intensos.', lleva: ['3 clases cortas para ver a tu ritmo', 'Un ritual de 5 minutos para la mañana'], dur: '3 clases + 1 encuentro', modo: 'Grabado y en vivo' },
      { n: 3, fecha: 'Martes 19/1', hora: '19 h', tipo: 'Práctica guiada', titulo: 'Visualización para renacer', texto: 'Una visualización guiada para conectar con la versión de vos que querés despertar este año.', lleva: ['La visualización en audio', 'Una pregunta para la semana'], dur: '45 min', modo: 'Por videollamada' },
      { n: 4, fecha: 'Martes 26/1', hora: '19 h', tipo: 'Encuentro de comunidad', titulo: 'Círculo de la comunidad: primer mes del año', texto: 'Compartimos cómo arrancó el año y qué necesitás para sostener lo que empezaste.', lleva: ['Un espacio para hablar y que te escuchen', 'La propuesta de febrero'], dur: '75 min', modo: 'Por videollamada' }
    ]
  }
};

let mesActual = 'nov';
let semanaActual = 1;

const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const waLink = texto => `https://wa.me/${WSP}?text=${encodeURIComponent(texto)}`;

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
  const desktopMq = window.matchMedia('(min-width: 1081px)');
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
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const img = hero.querySelector('[data-hero-img]');
  if (img) tl.from(img, { scale: 1.1, duration: 1.8 }, 0);
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 36, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 24, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 20, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.sello, .hero-badge'), { scale: 0.94, opacity: 0, duration: 1.1, stagger: 0.1, clearProps: 'transform,opacity' }, 0.65);
}

function initCierreSol() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('.cierre__sol').forEach(sol => {
    gsap.fromTo(sol, { yPercent: 16 }, {
      yPercent: -18, ease: 'none',
      scrollTrigger: { trigger: sol.closest('.cierre'), start: 'top bottom', end: 'bottom bottom', scrub: true }
    });
  });
}

function detalleHTML(s) {
  return `<p class="semana__texto">${esc(s.texto)}</p>
    <ul class="lleva">${s.lleva.map(l => `<li><svg class="ico" aria-hidden="true"><use href="#i-check"/></svg>${esc(l)}</li>`).join('')}</ul>
    <p class="chips"><span class="chip"><svg class="ico" aria-hidden="true"><use href="#i-reloj"/></svg>${esc(s.dur)}</span><span class="chip"><svg class="ico" aria-hidden="true"><use href="#i-video"/></svg>${esc(s.modo)}</span></p>`;
}

function renderLista(cont, id) {
  const mes = MESES[id];
  cont.innerHTML = mes.semanas.map(s => {
    const abierta = s.n === semanaActual;
    const panel = `sem-${id}-${s.n}`;
    return `<li class="semana" data-animate="subir" style="opacity:0;transform:translateY(32px)">
      <button type="button" class="semana__fila" aria-expanded="${abierta}" aria-controls="${panel}" data-n="${s.n}">
        <span class="semana__num">0${s.n}</span>
        <span class="semana__datos"><span class="semana__meta">${esc(s.fecha)} · ${esc(s.hora)} · ${esc(s.tipo)}</span><span class="semana__titulo">${esc(s.titulo)}</span></span>
        <span class="semana__mas" aria-hidden="true"><svg class="ico"><use href="#i-mas"/></svg></span>
      </button>
      <div class="semana__detalle" id="${panel}"${abierta ? '' : ' hidden'}>${detalleHTML(s)}</div>
    </li>`;
  }).join('');
}

function renderColumnas(cont, id) {
  const mes = MESES[id];
  cont.innerHTML = mes.semanas.map(s => `<li class="semana semana--col" data-animate="subir" style="opacity:0;transform:translateY(32px)">
      <button type="button" class="semana__col" aria-pressed="${s.n === semanaActual}" aria-controls="semana-detalle" data-n="${s.n}">
        <span class="semana__num">Semana ${s.n}</span>
        <span class="semana__meta">${esc(s.fecha)} · ${esc(s.hora)}</span>
        <span class="semana__tipo">${esc(s.tipo)}</span>
        <span class="semana__titulo">${esc(s.titulo)}</span>
      </button>
    </li>`).join('');
}

function pintarDetalleColumnas() {
  const caja = document.getElementById('semana-detalle-info');
  if (!caja) return;
  const s = MESES[mesActual].semanas.find(x => x.n === semanaActual);
  if (!s) return;
  caja.innerHTML = `<p class="semana-detalle__tipo">Semana ${s.n} · ${esc(s.tipo)}</p>
    <h3 class="semana-detalle__titulo">${esc(s.titulo)}</h3>
    <div class="semana-detalle__info">${detalleHTML(s)}</div>`;
  const sol = document.querySelector('.arco__sol');
  if (sol) {
    const x = (s.n - 0.5) / 4;
    const t = 2 * x - 1;
    sol.style.setProperty('--x', `${x * 100}%`);
    sol.style.setProperty('--y', `${(1 - Math.sqrt(1 - t * t)) * 100}%`);
  }
}

function pintarSemanas() {
  const cont = document.getElementById('semanas');
  if (!cont) return;
  if (cont.classList.contains('semanas--columnas')) {
    renderColumnas(cont, mesActual);
    pintarDetalleColumnas();
  } else {
    renderLista(cont, mesActual);
  }
  cont.setAttribute('aria-labelledby', `tab-${mesActual}`);
  revelarNuevos(cont);
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
}

function pintarModalSemanas() {
  const lista = document.getElementById('modal-semanas');
  if (!lista) return;
  lista.innerHTML = MESES[mesActual].semanas.map(s => `<li><b>0${s.n}</b><span>${esc(s.titulo)}<small>${esc(s.fecha)} · ${esc(s.tipo)}</small></span></li>`).join('');
}

function setMes(id, { repintar = true } = {}) {
  if (!MESES[id]) return;
  mesActual = id;
  semanaActual = 1;
  const nombre = MESES[id].nombre.toLowerCase();
  document.querySelectorAll('.meses .mes').forEach(tab => {
    const activo = tab.dataset.mes === id;
    tab.setAttribute('aria-selected', String(activo));
    tab.tabIndex = activo ? 0 : -1;
  });
  document.querySelectorAll('[data-mes-nombre]').forEach(el => { el.textContent = nombre; });
  document.querySelectorAll('[data-wsp-membresia]').forEach(a => {
    a.href = waLink(`Hola Ariadna! Quiero consultar por la membresía de ${nombre} de Espacio mirenacer.`);
  });
  const radio = document.querySelector(`input[name="mes-membresia"][value="${id}"]`);
  if (radio) radio.checked = true;
  pintarModalSemanas();
  if (repintar) pintarSemanas();
}

function initPrograma() {
  const cont = document.getElementById('semanas');
  const tabs = [...document.querySelectorAll('.meses .mes')];
  if (!cont || !tabs.length) return;
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => { if (tab.dataset.mes !== mesActual) setMes(tab.dataset.mes); });
    tab.addEventListener('keydown', e => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault();
      const sig = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
      sig.focus();
      setMes(sig.dataset.mes);
    });
  });
  cont.addEventListener('click', e => {
    const fila = e.target.closest('.semana__fila');
    if (fila) {
      const abrir = fila.getAttribute('aria-expanded') !== 'true';
      cont.querySelectorAll('.semana__fila').forEach(f => {
        const p = document.getElementById(f.getAttribute('aria-controls'));
        const esta = f === fila && abrir;
        f.setAttribute('aria-expanded', String(esta));
        if (p) {
          p.hidden = !esta;
          p.classList.toggle('abriendo', esta);
        }
      });
      semanaActual = abrir ? Number(fila.dataset.n) : 0;
      if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
      return;
    }
    const col = e.target.closest('.semana__col');
    if (col) {
      semanaActual = Number(col.dataset.n);
      cont.querySelectorAll('.semana__col').forEach(c => c.setAttribute('aria-pressed', String(c === col)));
      pintarDetalleColumnas();
      if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
    }
  });
  setMes(mesActual, { repintar: false });
  if (cont.classList.contains('semanas--columnas')) {
    renderColumnas(cont, mesActual);
    pintarDetalleColumnas();
  } else {
    renderLista(cont, mesActual);
  }
}

function initModal() {
  const modal = document.getElementById('modal-membresia');
  if (!modal) return;
  const caja = modal.querySelector('.modal__caja');
  let ultimoFoco = null;
  const focusables = () => [...modal.querySelectorAll('button, [href], input, [tabindex]:not([tabindex="-1"])')].filter(el => !el.disabled && el.getClientRects().length);
  const abrir = () => {
    ultimoFoco = document.activeElement;
    pintarModalSemanas();
    modal.hidden = false;
    document.body.classList.add('no-scroll');
    requestAnimationFrame(() => requestAnimationFrame(() => modal.classList.add('open')));
    caja.focus();
  };
  const cerrar = () => {
    modal.classList.remove('open');
    document.body.classList.remove('no-scroll');
    setTimeout(() => { modal.hidden = true; }, reduceMotion ? 0 : 320);
    ultimoFoco?.focus();
  };
  modal.cerrar = cerrar;
  document.querySelectorAll('[data-abrir-membresia]').forEach(b => b.addEventListener('click', abrir));
  modal.querySelectorAll('[data-cerrar]').forEach(b => b.addEventListener('click', cerrar));
  modal.addEventListener('keydown', e => {
    if (e.key === 'Escape') { e.preventDefault(); cerrar(); return; }
    if (e.key !== 'Tab') return;
    const f = focusables();
    if (!f.length) return;
    const primero = f[0];
    const ultimo = f[f.length - 1];
    if (e.shiftKey && (document.activeElement === primero || document.activeElement === caja)) { e.preventDefault(); ultimo.focus(); }
    else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
  });
  modal.querySelectorAll('input[name="mes-membresia"]').forEach(r => r.addEventListener('change', () => setMes(r.value)));
}

function initFormMembresia() {
  const form = document.getElementById('form-membresia');
  if (!form) return;
  const nombre = form.querySelector('#m-nombre');
  const wsp = form.querySelector('#m-wsp');
  const marcar = (input, ok) => {
    const err = document.getElementById(`${input.id}-error`);
    input.setAttribute('aria-invalid', String(!ok));
    if (ok) input.removeAttribute('aria-describedby'); else input.setAttribute('aria-describedby', err.id);
    err.hidden = ok;
  };
  [nombre, wsp].forEach(i => i.addEventListener('input', () => { if (i.getAttribute('aria-invalid') === 'true') marcar(i, true); }));
  form.addEventListener('submit', e => {
    e.preventDefault();
    const okNombre = nombre.value.trim().length >= 2;
    const okWsp = wsp.value.replace(/\D/g, '').length >= 10;
    marcar(nombre, okNombre);
    marcar(wsp, okWsp);
    if (!okNombre) { nombre.focus(); return; }
    if (!okWsp) { wsp.focus(); return; }
    const btn = form.querySelector('button[type="submit"]');
    const texto = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Procesando…';
    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = texto;
      form.reset();
      document.getElementById('modal-membresia')?.cerrar?.();
      showToast('¡Gracias! El pago con Mercado Pago se activa al pasar la web a producción.');
    }, 800);
  });
}

function initTabs() {
  const tabs = [...document.querySelectorAll('.tabs [role="tab"]')];
  if (!tabs.length) return;
  const activar = tab => {
    tabs.forEach(t => {
      const activo = t === tab;
      t.setAttribute('aria-selected', String(activo));
      t.tabIndex = activo ? 0 : -1;
      const panel = document.getElementById(t.getAttribute('aria-controls'));
      if (panel) {
        panel.hidden = !activo;
        panel.classList.toggle('entrando', activo);
        if (activo) panel.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
      }
    });
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  };
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => activar(tab));
    tab.addEventListener('keydown', e => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault();
      const sig = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
      sig.focus();
      activar(sig);
    });
  });
}

initPrograma();
initReveals();
initNav();
initWspFloat();
initModelBarScroll();
initHeroMotion();
initCierreSol();
initModal();
initFormMembresia();
initTabs();
