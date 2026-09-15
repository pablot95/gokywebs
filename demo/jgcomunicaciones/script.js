document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WA = '5492616213056';
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}
if (typeof gsap === 'undefined') {
  document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; el.style.clipPath = 'none'; el.style.filter = 'none'; });
}
if (typeof ScrollTrigger !== 'undefined') {
  window.addEventListener('load', () => ScrollTrigger.refresh());
}

const TEST = [
  { dim: 'escucha', q: 'Llamás y la persona te dice: «Ya tengo internet, no me interesa». ¿Qué hacés?', ops: [
    { t: 'Le pregunto qué tiene hoy y si le anda bien a la noche. Si igual no quiere, agradezco y corto.', p: 3 },
    { t: 'Le leo la promoción completa antes de que llegue a cortar.', p: 0 },
    { t: 'Le agradezco y corto sin preguntar nada más.', p: 1 },
    { t: 'Le digo que es una oferta por tiempo limitado para que se quede en la línea.', p: 0 },
  ] },
  { dim: 'escucha', q: 'El cliente está contando un problema largo y vos ya sabés cuál es la solución.', ops: [
    { t: 'Lo dejo terminar y después confirmo con una pregunta corta.', p: 3 },
    { t: 'Lo interrumpo apenas lo entiendo, para no hacerle perder tiempo.', p: 1 },
    { t: 'Lo dejo hablar mientras voy cargando otra cosa en el sistema.', p: 0 },
    { t: 'Le digo la solución mientras él sigue hablando.', p: 0 },
  ] },
  { dim: 'escucha', q: 'Se escucha un bebé llorando de fondo y la persona está claramente apurada.', ops: [
    { t: 'Le ofrezco llamarlo en otro momento y le pregunto cuándo le queda cómodo.', p: 3 },
    { t: 'Acelero y le digo todo más rápido.', p: 1 },
    { t: 'Sigo igual: si atendió, es porque puede hablar.', p: 0 },
    { t: 'Corto sin decir nada y lo vuelvo a llamar más tarde.', p: 1 },
  ] },
  { dim: 'persuasion', q: 'El cliente escucha la propuesta y dice: «Está caro».', ops: [
    { t: 'Le pregunto con qué lo está comparando antes de responder.', p: 3 },
    { t: 'Le ofrezco un descuento enseguida para no perderlo.', p: 0 },
    { t: 'Le digo que es el mejor precio del mercado.', p: 1 },
    { t: 'Le repito los beneficios, más fuerte y más rápido.', p: 1 },
  ] },
  { dim: 'persuasion', q: 'Te pide una prestación que el servicio no tiene.', ops: [
    { t: 'Le digo que eso no lo hace y le muestro qué sí resuelve de lo que necesita.', p: 3 },
    { t: 'Le digo que sí; después lo verá con soporte.', p: 0 },
    { t: 'Le digo que «se puede llegar a ver» para no perder la venta.', p: 0 },
    { t: 'Lo derivo a otro sector para no tener que responder.', p: 1 },
  ] },
  { dim: 'persuasion', q: 'Ya lo escuchaste y entendiste qué necesita. ¿Cómo presentás la propuesta?', ops: [
    { t: 'Con dos opciones y la diferencia clara entre las dos, para que elija.', p: 3 },
    { t: 'Con la opción más cara primero, siempre.', p: 1 },
    { t: 'Con todas las opciones que existen, así ve el catálogo completo.', p: 1 },
    { t: 'Con la que a mí me deja mejor comisión.', p: 0 },
  ] },
  { dim: 'metodo', q: 'Cerraste una venta. ¿Qué hacés antes de la próxima llamada?', ops: [
    { t: 'Cargo la gestión completa y reviso que los datos estén bien escritos.', p: 3 },
    { t: 'Marco la siguiente y cargo todo junto al final del turno.', p: 1 },
    { t: 'Cargo lo mínimo para que la venta figure y sigo.', p: 0 },
    { t: 'Le paso los datos a un compañero para que los cargue él.', p: 0 },
  ] },
  { dim: 'metodo', q: 'Cinco llamadas seguidas te cortaron sin dejarte hablar.', ops: [
    { t: 'Sigo, pero aviso al supervisor por si el guion o la base están fallando.', p: 3 },
    { t: 'Sigo marcando sin decirle nada a nadie.', p: 1 },
    { t: 'Me tomo un rato largo hasta que se me pase.', p: 0 },
    { t: 'Cambio el discurso por mi cuenta a ver si engancha.', p: 1 },
  ] },
  { dim: 'metodo', q: 'Un compañero está trabado con un cliente enojado y vos estás libre.', ops: [
    { t: 'Aviso al supervisor y me ofrezco a tomar la llamada.', p: 3 },
    { t: 'Espero: se tiene que resolver solo.', p: 0 },
    { t: 'Le hago señas para que corte.', p: 0 },
    { t: 'Le paso una nota con lo que le diría yo.', p: 2 },
  ] },
];

const DIMS = { escucha: 'Escucha', persuasion: 'Persuasión', metodo: 'Método' };

const PERFILES = {
  persuasion: { titulo: 'Ventas telefónicas', texto: 'Manejás bien la objeción sin prometer de más y sabés cerrar dando a elegir. Es el perfil que buscamos para campañas de alta.' },
  escucha: { titulo: 'Atención y retención', texto: 'Escuchás antes de responder y no atropellás al cliente. Es lo que hace falta en postventa, reclamos y recupero.' },
  metodo: { titulo: 'Backoffice y control de calidad', texto: 'Sos ordenado y registrás bien lo que hacés. Ese perfil sostiene la operación: una venta mal cargada no es una venta.' },
  formacion: { titulo: 'Programa de formación inicial', texto: 'Todavía no aparecen los reflejos del puesto, y eso se entrena. Entrás por la capacitación inicial y arrancás acompañado por un supervisor.' },
};

function puntajePorDimension(respuestas) {
  const acc = { escucha: 0, persuasion: 0, metodo: 0 };
  respuestas.forEach((idx, i) => {
    if (idx == null) return;
    const preg = TEST[i];
    acc[preg.dim] += preg.ops[idx]?.p ?? 0;
  });
  return acc;
}

function perfilDe(respuestas) {
  const dims = puntajePorDimension(respuestas);
  const total = dims.escucha + dims.persuasion + dims.metodo;
  const maximo = TEST.length * 3;
  if (total < 11) return { clave: 'formacion', total, maximo, dims };
  const orden = ['persuasion', 'escucha', 'metodo'];
  let clave = orden[0];
  orden.forEach(k => { if (dims[k] > dims[clave]) clave = k; });
  return { clave, total, maximo, dims };
}

function armarPostulacion(datos, perfil, cv) {
  const lineas = [
    'Hola, me quiero postular a JG Comunicaciones.',
    `Nombre: ${datos.nombre}`,
    `Teléfono: ${datos.telefono}`,
  ];
  if (datos.email) lineas.push(`Email: ${datos.email}`);
  lineas.push(
    `Localidad: ${datos.localidad}`,
    `Turnos disponibles: ${datos.turnos.join(', ')}`,
    `Experiencia: ${datos.experiencia}`,
    `Estudios: ${datos.estudios}`,
    `Test de capacidades: ${perfil.total} de ${perfil.maximo} — Escucha ${perfil.dims.escucha}/9 · Persuasión ${perfil.dims.persuasion}/9 · Método ${perfil.dims.metodo}/9`,
    `Perfil sugerido por la web: ${PERFILES[perfil.clave].titulo}`
  );
  if (cv) lineas.push(`Tengo el CV listo para enviarles: ${cv}`);
  return `https://wa.me/${WA}?text=${encodeURIComponent(lineas.join('\n'))}`;
}

function formatearTelefono(valor) {
  const d = String(valor ?? '').replace(/\D/g, '').slice(0, 11);
  if (d.length <= 3) return d;
  if (d.startsWith('11')) {
    if (d.length <= 6) return `${d.slice(0, 2)} ${d.slice(2)}`;
    if (d.length <= 10) return `${d.slice(0, 2)} ${d.slice(2, 6)}-${d.slice(6)}`;
    return `${d.slice(0, 2)} ${d.slice(2, 7)}-${d.slice(7)}`;
  }
  if (d.length <= 6) return `${d.slice(0, 3)} ${d.slice(3)}`;
  if (d.length <= 10) return `${d.slice(0, 3)} ${d.slice(3, 6)}-${d.slice(6)}`;
  return `${d.slice(0, 3)} ${d.slice(3, 7)}-${d.slice(7)}`;
}

function cvValido(archivo) {
  if (!archivo) return true;
  const ok = /\.(pdf|docx?)$/i.test(archivo.name);
  return ok && archivo.size <= 5 * 1024 * 1024;
}

function reloj(segundos) {
  const s = Math.max(0, Math.round(segundos));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
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

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  const header = document.querySelector('.site-header');
  let bd = header.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; header.appendChild(bd); }
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open'); nav.setAttribute('inert', '');
    toggle.setAttribute('aria-expanded', 'false'); document.body.classList.remove('no-scroll');
  };
  const open = () => {
    nav.classList.add('open'); bd.classList.add('open'); nav.removeAttribute('inert');
    toggle.setAttribute('aria-expanded', 'true'); document.body.classList.add('no-scroll');
    nav.querySelector('a')?.focus();
  };
  const sync = () => {
    if (window.innerWidth > 768) { nav.removeAttribute('inert'); nav.classList.remove('open'); bd.classList.remove('open'); document.body.classList.remove('no-scroll'); toggle.setAttribute('aria-expanded', 'false'); }
    else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  toggle.addEventListener('click', () => (nav.classList.contains('open') ? close() : open()));
  closeBtn?.addEventListener('click', () => { close(); toggle.focus(); });
  bd.addEventListener('click', close);
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); } });
  window.addEventListener('resize', sync, { passive: true });
  sync();
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

function initWspFloat() {
  const btn = document.getElementById('wsp-float');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) btn.classList.add('visible'); else btn.classList.remove('visible');
  }, { passive: true });
}

function initHero() {
  if (typeof gsap === 'undefined' || reduceMotion) return;
  gsap.set('.hero-hilo', { scaleX: 0, transformOrigin: '0% 50%' });
  gsap.set('.hero-figure', { opacity: 0, y: 26, scale: .94 });
  gsap.set(['.hero-halo', '.hero-chip'], { opacity: 0 });

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.from('.eyebrow-neon', { y: 14, opacity: 0, duration: .7 })
    .from('.hero-title .line > span', { yPercent: 112, duration: 1.05, stagger: .09, ease: 'expo.out' }, '-=.42')
    .from('.hero-sub', { y: 18, opacity: 0, duration: .85 }, '-=.6')
    .from('.hero-cta > *', { y: 16, opacity: 0, duration: .7, stagger: .09 }, '-=.58')
    .to('.hero-halo', { opacity: 1, duration: 1.3 }, .2)
    .to('.hero-hilo', { scaleX: 1, duration: 1.15, ease: 'power2.inOut' }, .35)
    .to('.hero-figure', { opacity: 1, y: 0, scale: 1, duration: 1.1 }, .6)
    .to('.hero-chip', { opacity: 1, duration: .6 }, 1.15);

  gsap.to('.hero-figure', { y: -9, duration: 4.6, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 2 });
}

function initRail() {
  const rail = document.getElementById('railPrincipios');
  if (!rail) return;

  rail.addEventListener('wheel', e => {
    if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
    const max = rail.scrollWidth - rail.clientWidth;
    if ((e.deltaY < 0 && rail.scrollLeft <= 0) || (e.deltaY > 0 && rail.scrollLeft >= max - 1)) return;
    e.preventDefault();
    rail.scrollLeft += e.deltaY;
  }, { passive: false });

  let abajo = false, inicioX = 0, inicioScroll = 0, recorrido = 0;
  rail.addEventListener('pointerdown', e => {
    if (e.pointerType === 'touch') return;
    abajo = true; recorrido = 0; inicioX = e.clientX; inicioScroll = rail.scrollLeft;
    rail.setPointerCapture(e.pointerId);
  });
  rail.addEventListener('pointermove', e => {
    if (!abajo) return;
    const d = e.clientX - inicioX;
    if (Math.abs(d) > 6) { rail.classList.add('is-drag'); recorrido = Math.abs(d); }
    rail.scrollLeft = inicioScroll - d;
  });
  const soltar = () => {
    if (!abajo) return;
    abajo = false;
    rail.classList.remove('is-drag');
    if (recorrido > 6) {
      rail.addEventListener('click', ev => { ev.preventDefault(); ev.stopPropagation(); }, { capture: true, once: true });
    }
  };
  rail.addEventListener('pointerup', soltar);
  rail.addEventListener('pointercancel', soltar);
  rail.addEventListener('keydown', e => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    rail.scrollBy({ left: e.key === 'ArrowRight' ? 320 : -320, behavior: reduceMotion ? 'auto' : 'smooth' });
  });
}

function initLlamada() {
  const stage = document.getElementById('capStage');
  const avance = document.getElementById('capAvance');
  const nodosWrap = document.getElementById('capNodos');
  const pasos = Array.from(document.querySelectorAll('#capPasos li'));
  const relojEl = document.getElementById('capReloj');
  if (!stage || !avance || !pasos.length) return;

  const MARCAS = [6, 33, 62, 94];
  MARCAS.forEach(p => {
    const n = document.createElement('span');
    n.className = 'nodo';
    n.style.setProperty('--p', `${p}%`);
    nodosWrap.appendChild(n);
  });
  const nodos = Array.from(nodosWrap.children);

  const ESTADOS = [
    { estado: 'Abriendo', necesidad: 'Sin detectar', resultado: 'Pendiente' },
    { estado: 'Escuchando', necesidad: 'Internet lento a la noche', resultado: 'Pendiente' },
    { estado: 'Proponiendo', necesidad: 'Internet lento a la noche', resultado: 'Dos opciones enviadas' },
    { estado: 'Alta confirmada', necesidad: 'Internet lento a la noche', resultado: 'Servicio dado de alta' },
  ];
  const celdas = {
    estado: document.querySelector('[data-est="estado"]'),
    necesidad: document.querySelector('[data-est="necesidad"]'),
    resultado: document.querySelector('[data-est="resultado"]'),
  };
  const claves = ['estado', 'necesidad', 'resultado'];
  let actual = -1;

  const setStep = progreso => {
    nodos.forEach((n, i) => n.classList.toggle('on', progreso * 100 >= MARCAS[i] - 4));
    const i = progreso < .25 ? 0 : progreso < .5 ? 1 : progreso < .75 ? 2 : 3;
    if (i === actual) return;
    actual = i;
    pasos.forEach((li, n) => li.classList.toggle('is-on', n === i));
    claves.forEach(clave => {
      const cel = celdas[clave];
      if (!cel) return;
      const valor = ESTADOS[i][clave];
      if (cel.textContent === valor) return;
      cel.classList.add('swap');
      setTimeout(() => {
        cel.textContent = valor;
        cel.classList.toggle('is-on', i === 3);
        cel.classList.remove('swap');
      }, 170);
    });
  };

  const estatico = () => {
    avance.style.transform = 'none';
    if (relojEl) relojEl.textContent = '4:12';
    nodos.forEach(n => n.classList.add('on'));
    pasos.forEach(li => li.classList.add('is-on'));
    actual = 3;
    claves.forEach(clave => {
      const cel = celdas[clave];
      if (cel) { cel.textContent = ESTADOS[3][clave]; cel.classList.add('is-on'); }
    });
  };

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') { estatico(); return; }

  const construir = (triggerCfg, eje) => {
    document.getElementById('capPasos')?.classList.add('is-live');
    const cursor = { t: 0 };
    gsap.set(avance, eje === 'y' ? { scaleY: 0, scaleX: 1 } : { scaleX: 0, scaleY: 1 });
    const tl = gsap.timeline({ scrollTrigger: Object.assign({ scrub: .6, invalidateOnRefresh: true, onUpdate: self => setStep(self.progress) }, triggerCfg) });
    tl.to(avance, Object.assign({ duration: 1, ease: 'none' }, eje === 'y' ? { scaleY: 1 } : { scaleX: 1 }), 0)
      .to(cursor, { t: 252, duration: 1, ease: 'none', onUpdate: () => { if (relojEl) relojEl.textContent = reloj(cursor.t); } }, 0);
    return tl;
  };

  const mm = gsap.matchMedia();
  mm.add('(min-width: 1081px) and (prefers-reduced-motion: no-preference)', () => {
    construir({ trigger: stage, start: 'top top', end: '+=260%', pin: true, anticipatePin: 1 }, 'y');
    setStep(0);
  });
  mm.add('(max-width: 1080px) and (prefers-reduced-motion: no-preference)', () => {
    stage.classList.add('is-sticky-mobile');
    requestAnimationFrame(() => ScrollTrigger.refresh());
    construir({ trigger: stage, start: 'top top', end: 'bottom bottom' }, 'x');
    setStep(0);
    return () => { stage.classList.remove('is-sticky-mobile'); ScrollTrigger.refresh(); };
  });
  mm.add('(prefers-reduced-motion: reduce)', () => { estatico(); });
}

function initPostulacion() {
  const app = document.querySelector('.post-app');
  const form = document.getElementById('formDatos');
  if (!app || !form) return;

  const paneles = {
    0: document.getElementById('panelDatos'),
    1: document.getElementById('panelTest'),
    2: document.getElementById('panelResultado'),
  };
  const pasosUI = Array.from(document.querySelectorAll('#postSteps li'));
  const nombre = document.getElementById('nombre');
  const telefono = document.getElementById('telefono');
  const email = document.getElementById('email');
  const localidad = document.getElementById('localidad');
  const experiencia = document.getElementById('experiencia');
  const estudios = document.getElementById('estudios');
  const turnos = Array.from(form.querySelectorAll('input[name="turno[]"]'));
  const cvInput = document.getElementById('cv');
  const cvNombre = document.getElementById('cvNombre');

  const testDim = document.getElementById('testDim');
  const testNum = document.getElementById('testNum');
  const testActual = document.getElementById('testActual');
  const testTotal = document.getElementById('testTotal');
  const testRing = document.getElementById('testRing');
  const testPregunta = document.getElementById('testPregunta');
  const testOpciones = document.getElementById('testOpciones');
  const testAtras = document.getElementById('testAtras');

  const resTitulo = document.getElementById('resTitulo');
  const resTexto = document.getElementById('resTexto');
  const resBarras = document.getElementById('resBarras');
  const resEnviar = document.getElementById('resEnviar');
  const resReiniciar = document.getElementById('resReiniciar');

  const respuestas = new Array(TEST.length).fill(null);
  let indice = 0;
  let datos = null;
  let archivo = null;

  const CIRC = 2 * Math.PI * 19;
  testRing.style.strokeDasharray = CIRC;
  testRing.style.strokeDashoffset = CIRC;
  testTotal.textContent = TEST.length;

  Object.values(paneles).forEach(p => p.setAttribute('tabindex', '-1'));

  const irA = n => {
    Object.entries(paneles).forEach(([k, p]) => { p.hidden = Number(k) !== n; });
    pasosUI.forEach((li, i) => {
      li.classList.toggle('is-on', i === n);
      li.classList.toggle('done', i < n);
    });
    paneles[n].focus({ preventScroll: true });
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  };

  function marcar(campo, ok) {
    const err = document.getElementById(`err-${campo}`);
    if (err) err.hidden = ok;
    const input = document.getElementById(campo);
    if (input) input.setAttribute('aria-invalid', ok ? 'false' : 'true');
  }

  telefono.addEventListener('input', () => { telefono.value = formatearTelefono(telefono.value); });
  turnos.forEach(c => c.addEventListener('change', () => marcar('turno', turnos.some(t => t.checked))));

  cvInput.addEventListener('change', () => {
    const f = cvInput.files?.[0] ?? null;
    if (!f) { archivo = null; cvNombre.textContent = 'Ningún archivo seleccionado'; cvNombre.classList.remove('ok'); marcar('cv', true); return; }
    if (!cvValido(f)) {
      archivo = null; cvInput.value = '';
      cvNombre.textContent = 'Ningún archivo seleccionado'; cvNombre.classList.remove('ok');
      marcar('cv', false);
      return;
    }
    archivo = f.name;
    cvNombre.textContent = `${f.name} · ${(f.size / 1024 / 1024).toFixed(1)} MB`;
    cvNombre.classList.add('ok');
    marcar('cv', true);
  });

  const pintarPregunta = () => {
    const preg = TEST[indice];
    testDim.textContent = DIMS[preg.dim];
    testNum.textContent = indice + 1;
    testActual.textContent = indice + 1;
    testRing.style.strokeDashoffset = CIRC * (1 - indice / TEST.length);
    testPregunta.textContent = preg.q;
    testAtras.hidden = indice === 0;
    testOpciones.innerHTML = '';
    preg.ops.forEach((op, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'test-op';
      b.setAttribute('aria-pressed', respuestas[indice] === i ? 'true' : 'false');
      b.innerHTML = `<i>${String.fromCharCode(65 + i)}</i><span>${esc(op.t)}</span>`;
      b.addEventListener('click', () => {
        respuestas[indice] = i;
        Array.from(testOpciones.children).forEach((el, n) => el.setAttribute('aria-pressed', n === i ? 'true' : 'false'));
        setTimeout(() => {
          if (indice < TEST.length - 1) { indice++; pintarPregunta(); }
          else mostrarResultado();
        }, 220);
      });
      testOpciones.appendChild(b);
    });
    testOpciones.querySelector('button')?.focus({ preventScroll: true });
  };

  const mostrarResultado = () => {
    const perfil = perfilDe(respuestas);
    const info = PERFILES[perfil.clave];
    resTitulo.textContent = info.titulo;
    resTexto.textContent = info.texto;
    resBarras.innerHTML = '';
    Object.entries(DIMS).forEach(([k, etiqueta]) => {
      const valor = perfil.dims[k];
      const fila = document.createElement('div');
      fila.className = 'res-barra';
      fila.innerHTML = `<div class="res-barra-top"><span>${etiqueta}</span><span>${valor} / 9</span></div><div class="res-pista"><span class="res-fill"></span></div>`;
      resBarras.appendChild(fila);
      requestAnimationFrame(() => { fila.querySelector('.res-fill').style.width = `${(valor / 9) * 100}%`; });
    });
    resEnviar.href = armarPostulacion(datos, perfil, archivo);
    irA(2);
    showToast('Listo: tu resultado está abajo.');
  };

  form.addEventListener('submit', e => {
    e.preventDefault();
    const okNombre = nombre.value.trim().length >= 2;
    const okTel = telefono.value.replace(/\D/g, '').length >= 8;
    const okLoc = localidad.value.trim().length >= 2;
    const okTurno = turnos.some(t => t.checked);
    marcar('nombre', okNombre);
    marcar('telefono', okTel);
    marcar('localidad', okLoc);
    marcar('turno', okTurno);
    if (!okNombre || !okTel || !okLoc || !okTurno) {
      (!okNombre ? nombre : !okTel ? telefono : !okLoc ? localidad : turnos[0]).focus();
      showToast('Faltan datos para arrancar el test.');
      return;
    }
    datos = {
      nombre: nombre.value.trim(),
      telefono: telefono.value.trim(),
      email: email.value.trim(),
      localidad: localidad.value.trim(),
      turnos: turnos.filter(t => t.checked).map(t => t.value),
      experiencia: experiencia.value,
      estudios: estudios.value,
    };
    indice = 0;
    respuestas.fill(null);
    pintarPregunta();
    irA(1);
  });

  testAtras.addEventListener('click', () => { if (indice > 0) { indice--; pintarPregunta(); } });
  resReiniciar.addEventListener('click', () => {
    respuestas.fill(null);
    indice = 0;
    irA(0);
    nombre.focus();
  });
}

function initMapa() {
  const nodo = document.getElementById('mapa');
  if (!nodo || typeof L === 'undefined') return;
  const centro = [-32.8895, -68.8458];
  const mapa = L.map(nodo, { scrollWheelZoom: false, zoomControl: false }).setView(centro, 12);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap &copy; CARTO', maxZoom: 18,
  }).addTo(mapa);
  L.circle(centro, { radius: 9000, color: '#2563EB', weight: 1.5, fillColor: '#2563EB', fillOpacity: .1 }).addTo(mapa);
  L.circleMarker(centro, { radius: 7, color: '#2563EB', weight: 2, fillColor: '#2563EB', fillOpacity: 1 })
    .addTo(mapa).bindPopup('Base de operaciones en Mendoza');
}

function initDetalles() {
  if (typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('.faq-list details').forEach(d => {
    d.addEventListener('toggle', () => ScrollTrigger.refresh());
  });
}

const anio = document.getElementById('anio');
if (anio) anio.textContent = new Date().getFullYear();

initNav();
initReveals();
initWspFloat();
initHero();
initRail();
initLlamada();
initPostulacion();
initMapa();
initDetalles();
