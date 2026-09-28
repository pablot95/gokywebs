const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const clamp01 = v => Math.max(0, Math.min(1, v));
const WSP = '5493794202005';
const wspHref = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const fmtV = n => Number(n).toLocaleString('es-AR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const barraModelos = () => parseFloat(window.getComputedStyle(document.documentElement).getPropertyValue('--gw-modelos-h')) || 0;
const refrescarTriggers = () => { if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); };

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

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

function initHero() {
  const wrap = document.querySelector('[data-mensajes]');
  if (!wrap) return;
  const img = document.querySelector('[data-hero-media] img');
  const btns = [...wrap.querySelectorAll('.mensaje')];
  let actual = 0;
  const aplicar = n => {
    actual = n;
    btns.forEach((b, k) => {
      const on = k === n;
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    const d = btns[n]?.dataset;
    if (img && d) {
      img.style.setProperty('--fx', d.fx);
      img.style.setProperty('--fy', d.fy);
      img.style.setProperty('--fz', d.fz);
    }
  };
  if (reduceMotion) wrap.classList.add('is-quieto');
  btns.forEach((b, k) => b.addEventListener('click', () => aplicar(k)));
  wrap.addEventListener('animationend', e => {
    if (e.animationName !== 'mensaje-barra') return;
    aplicar((actual + 1) % btns.length);
  });
  const pausar = on => wrap.classList.toggle('is-pausa', on);
  wrap.addEventListener('pointerenter', () => pausar(true));
  wrap.addEventListener('pointerleave', () => pausar(false));
  wrap.addEventListener('focusin', () => pausar(true));
  wrap.addEventListener('focusout', () => pausar(false));
  document.addEventListener('visibilitychange', () => pausar(document.hidden));
  aplicar(0);
}

function initHeroIn() {
  const items = [...document.querySelectorAll('[data-hero-in]')];
  if (!items.length) return;
  const mostrar = () => items.forEach(el => el.classList.add('in'));
  if (reduceMotion) { mostrar(); return; }
  items.forEach((el, i) => { el.style.transitionDelay = `${(0.1 + i * 0.1).toFixed(2)}s`; });
  setTimeout(mostrar, 60);
  window.addEventListener('load', mostrar);
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.utils.toArray('[data-parallax]').forEach(img => {
    gsap.fromTo(img, { yPercent: -5, scale: 1.12 }, {
      yPercent: 5,
      scale: 1.12,
      ease: 'none',
      scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });
}

function initDestacar() {
  document.addEventListener('click', e => {
    const a = e.target.closest('[data-destacar]');
    if (!a) return;
    const target = document.getElementById(a.dataset.destacar);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: target.classList.contains('serv') ? 'center' : 'start' });
    if (target.classList.contains('serv')) {
      target.classList.remove('is-destacado');
      void target.offsetWidth;
      target.classList.add('is-destacado');
      clearTimeout(target._destacado);
      target._destacado = setTimeout(() => target.classList.remove('is-destacado'), 3600);
    }
  });
}

function initContadores() {
  const nums = document.querySelectorAll('[data-contar]');
  if (!nums.length || reduceMotion || !('IntersectionObserver' in window)) return;
  const correr = el => {
    const fin = parseFloat(el.dataset.contar);
    const dec = parseInt(el.dataset.dec || '0', 10);
    const pre = el.dataset.prefijo || '';
    const texto = v => pre + v.toLocaleString('es-AR', { minimumFractionDigits: dec, maximumFractionDigits: dec });
    const final = texto(fin);
    let t0 = 0;
    const paso = t => {
      if (!t0) t0 = t;
      const k = Math.min(1, (t - t0) / 1100);
      const e = 1 - Math.pow(1 - k, 3);
      el.textContent = texto(fin * e);
      if (k < 1) requestAnimationFrame(paso); else el.textContent = final;
    };
    requestAnimationFrame(paso);
    setTimeout(() => { el.textContent = final; }, 1500);
  };
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) { correr(en.target); io.unobserve(en.target); } });
  }, { threshold: 0, rootMargin: '0px 0px -12% 0px' });
  nums.forEach(n => io.observe(n));
}

function initLlave() {
  const sec = document.querySelector('[data-llave]');
  if (!sec) return;
  const fotos = [...sec.querySelectorAll('[data-llave-foto]')];
  const textos = [...sec.querySelectorAll('[data-llave-texto]')];
  const tabs = [...sec.querySelectorAll('[data-llave-tab]')];
  const num = sec.querySelector('[data-volt-num]');
  const estado = sec.querySelector('[data-volt-estado]');
  const led = sec.querySelector('[data-volt-led]');
  const escala = sec.querySelector('[data-escala]');
  const barra = escala?.querySelector('.escala-barra');
  const testigoTxt = sec.querySelector('[data-testigo-txt]');
  const N = Math.min(textos.length, 4);
  if (!N || !num) return;
  let actual = -1;
  let voltAct = parseFloat(textos[0].dataset.volt);
  let objetivo = voltAct;
  let tween = 0;
  let frame = 0;

  const medirEscala = () => { if (escala && barra) escala.style.setProperty('--escala-w', barra.offsetWidth + 'px'); };

  const animarVolt = hasta => {
    objetivo = hasta;
    window.cancelAnimationFrame(tween);
    if (reduceMotion) { voltAct = hasta; num.textContent = fmtV(hasta); return; }
    const desde = voltAct;
    let t0 = 0;
    const paso = t => {
      if (!t0) t0 = t;
      const k = Math.min(1, (t - t0) / 900);
      const e = 1 - Math.pow(1 - k, 3);
      let v = desde + (hasta - desde) * e;
      if (k < 1) v += (Math.random() - .5) * .16 * (1 - k);
      voltAct = v;
      num.textContent = fmtV(v);
      if (k < 1) tween = requestAnimationFrame(paso);
      else { voltAct = hasta; num.textContent = fmtV(hasta); }
    };
    tween = requestAnimationFrame(paso);
    setTimeout(() => { if (objetivo === hasta) { voltAct = hasta; num.textContent = fmtV(hasta); } }, 1100);
  };

  const activar = i => {
    if (i === actual) return;
    actual = i;
    fotos.forEach((f, k) => f.classList.toggle('is-on', k === i));
    textos.forEach((t, k) => t.classList.toggle('is-on', k === i));
    tabs.forEach((b, k) => { if (k === i) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current'); });
    const d = textos[i].dataset;
    if (estado) estado.textContent = d.estado;
    if (led) led.className = 'led' + (d.led ? ' ' + d.led : '');
    sec.dataset.testigo = d.testigo;
    if (testigoTxt) testigoTxt.textContent = d.testigo === 'on' ? 'Prendido' : 'Apagado';
    escala?.style.setProperty('--x', d.x);
    animarVolt(parseFloat(d.volt));
  };

  const recorrido = () => Math.max(1, sec.offsetHeight - (window.innerHeight - barraModelos()));

  const update = () => {
    frame = 0;
    const r = sec.getBoundingClientRect();
    const p = clamp01((barraModelos() - r.top) / recorrido());
    const i = Math.min(N - 1, Math.floor(p * N * 0.9999));
    activar(i);
    const local = clamp01(p * N - i);
    fotos[i]?.querySelector('img')?.style.setProperty('--z', (1.08 - local * .08).toFixed(4));
    tabs.forEach((b, k) => b.style.setProperty('--p', k < i ? 1 : k === i ? local.toFixed(3) : 0));
  };
  const pedir = () => { if (!frame) frame = requestAnimationFrame(update); };

  window.addEventListener('scroll', pedir, { passive: true });
  window.addEventListener('resize', () => { medirEscala(); pedir(); }, { passive: true });
  tabs.forEach((b, k) => b.addEventListener('click', () => {
    const top = sec.getBoundingClientRect().top + window.scrollY - barraModelos() + recorrido() * ((k + .5) / N);
    window.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' });
  }));
  medirEscala();
  update();
}

const SERVICIOS = {
  arranques: ['s-arranques', 'Arranques'],
  alternadores: ['s-alternadores', 'Alternadores'],
  baterias: ['s-baterias', 'Baterías'],
  carga: ['s-carga', 'Carga'],
  luces: ['s-luces', 'Luces'],
  diagnostico: ['s-diagnostico', 'Diagnóstico eléctrico'],
};

const MOTOR = {
  apagado: {
    min: 10.5, max: 13.2, inicial: 12.4,
    zonas: [
      { hasta: 12.0, id: 'baja', nombre: 'Batería descargada', tono: 'rojo' },
      { hasta: 12.4, id: 'media', nombre: 'Batería a media carga', tono: 'ambar' },
      { hasta: 99, id: 'ok', nombre: 'Batería cargada', tono: 'verde' },
    ],
  },
  marcha: {
    min: 12.0, max: 15.5, inicial: 14.2,
    zonas: [
      { hasta: 13.5, id: 'nocarga', nombre: 'El alternador no carga', tono: 'rojo' },
      { hasta: 14.75, id: 'carga', nombre: 'Carga bien', tono: 'verde' },
      { hasta: 99, id: 'sobre', nombre: 'Sobrecarga', tono: 'ambar' },
    ],
  },
};

const TONOS = {
  rojo: { texto: '#B91C1C', pista: '#EF4444', led: 'led--rojo' },
  ambar: { texto: '#B45309', pista: '#F59E0B', led: 'led--ambar' },
  verde: { texto: '#15803D', pista: '#16A34A', led: '' },
};

const SINTOMAS = {
  clic: {
    frase: 'no arranca, hace clic',
    base: { titulo: 'Batería baja o arranque que no gira', texto: 'El clic es el automático del arranque que intenta, pero no le llega la fuerza o el motor de arranque no gira.', checks: ['Carga de la batería y bornes', 'Automático y carbones del arranque', 'Masa y cable de arranque'], serv: 'arranques' },
    apagado: {
      baja: { titulo: 'Batería descargada', texto: 'Con {v} V la batería no tiene fuerza para mover el arranque. Hay que cargarla y ver por qué se descargó.', checks: ['Estado de la batería', 'Carga del alternador', 'Consumo con el auto parado'], serv: 'baterias' },
      media: { titulo: 'Batería justa para arrancar', texto: 'Con {v} V la batería está a media carga: el arranque intenta y no alcanza. Conviene probarla con carga.', checks: ['Prueba de arranque de la batería', 'Bornes y masa', 'Carga del alternador'], serv: 'baterias' },
      ok: { titulo: 'El problema apunta al arranque', texto: 'La batería marca {v} V: está bien. Si igual hace clic, lo más común es el automático o los carbones del arranque.', checks: ['Automático del arranque', 'Carbones y bobinado', 'Bornes y cable de masa'], serv: 'arranques' },
    },
    marcha: 'Si el auto no arranca, medila con el motor apagado.',
  },
  lento: {
    frase: 'arranca con dificultad',
    base: { titulo: 'Batería cansada o arranque que consume de más', texto: 'Si el motor gira lento antes de arrancar, o la batería perdió capacidad o el arranque pide más corriente de la normal.', checks: ['Prueba de arranque de la batería', 'Consumo del arranque', 'Bornes sulfatados'], serv: 'baterias' },
    apagado: {
      baja: { titulo: 'Batería baja', texto: 'Con {v} V en reposo la batería no está completa: por eso gira lento. Hay que ver si se recupera con carga.', checks: ['Estado de la batería', 'Carga del alternador', 'Consumo con el auto parado'], serv: 'baterias' },
      media: { titulo: 'Batería baja', texto: 'Con {v} V en reposo la batería no está completa: por eso gira lento. Hay que ver si se recupera con carga.', checks: ['Estado de la batería', 'Carga del alternador', 'Consumo con el auto parado'], serv: 'baterias' },
      ok: { titulo: 'Arranque con consumo alto', texto: 'La batería marca {v} V en reposo. Si igual gira lento, el arranque puede estar pidiendo de más: bujes o bobinado.', checks: ['Consumo del arranque', 'Bujes y bendix', 'Cable de arranque y masa'], serv: 'arranques' },
    },
    marcha: {
      nocarga: { titulo: 'La batería no se está recargando', texto: 'Andando marca {v} V: el alternador no la recarga, por eso al otro día arranca con dificultad.', checks: ['Regulador de voltaje', 'Diodos y carbones', 'Correa y conexiones'], serv: 'alternadores' },
      carga: { titulo: 'La carga está bien: revisamos batería y arranque', texto: 'Andando marca {v} V, el alternador carga bien. El problema está en la batería o en el arranque.', checks: ['Prueba de arranque de la batería', 'Consumo del arranque', 'Bornes y masa'], serv: 'baterias' },
      sobre: { titulo: 'Sobrecarga del alternador', texto: 'Andando marca {v} V: el regulador no corta y la batería se castiga.', checks: ['Regulador de voltaje', 'Estado de la batería', 'Conexiones de carga'], serv: 'alternadores' },
    },
  },
  testigo: {
    frase: 'tiene el testigo de batería prendido andando',
    base: { titulo: 'El alternador no está cargando', texto: 'Ese testigo se prende cuando el alternador no llega a cargar. Si seguís andando, el auto usa lo que le queda a la batería.', checks: ['Regulador de voltaje', 'Diodos y carbones', 'Correa y conexiones'], serv: 'alternadores' },
    apagado: 'Para ver si carga, medila con el motor en marcha.',
    marcha: {
      nocarga: { titulo: 'Confirmado: el alternador no carga', texto: 'Andando marca {v} V, cuando tendría que dar entre 13,8 y 14,4 V. Hay que revisar el alternador.', checks: ['Regulador de voltaje', 'Diodos y carbones', 'Correa y conexiones'], serv: 'alternadores' },
      carga: { titulo: 'La carga da bien: revisamos el testigo', texto: 'Andando marca {v} V, que está bien. Puede ser el circuito del testigo o una falla que aparece y desaparece.', checks: ['Circuito del testigo', 'Fichas del alternador', 'Masas'], serv: 'diagnostico' },
      sobre: { titulo: 'Sobrecarga: regulador de voltaje', texto: 'Andando marca {v} V: pasa de lo normal. El regulador no está cortando la carga.', checks: ['Regulador de voltaje', 'Estado de la batería', 'Lámparas y consumos'], serv: 'alternadores' },
    },
  },
  descarga: {
    frase: 'se descarga estando parado',
    base: { titulo: 'Consumo con el auto apagado o batería vencida', texto: 'Si después de unos días parado no arranca, algo queda consumiendo o la batería ya no retiene la carga.', checks: ['Consumo con todo apagado (menos de 50 mA)', 'Estado de la batería', 'Relés, luces y accesorios'], serv: 'diagnostico' },
    apagado: {
      baja: { titulo: 'Batería baja: hay que encontrar por qué', texto: 'Con {v} V en reposo la batería se está vaciando. Medimos el consumo con todo apagado para encontrar el circuito.', checks: ['Consumo con todo apagado', 'Estado de la batería', 'Carga del alternador'], serv: 'diagnostico' },
      media: { titulo: 'Batería baja: hay que encontrar por qué', texto: 'Con {v} V en reposo la batería se está vaciando. Medimos el consumo con todo apagado para encontrar el circuito.', checks: ['Consumo con todo apagado', 'Estado de la batería', 'Carga del alternador'], serv: 'diagnostico' },
      ok: { titulo: 'Hoy está cargada: medimos el consumo', texto: 'Ahora marca {v} V. Si después de unos días parada baja, el consumo se mide en el taller con todo apagado.', checks: ['Consumo con todo apagado (menos de 50 mA)', 'Relés y módulos que quedan prendidos', 'Estado de la batería'], serv: 'diagnostico' },
    },
    marcha: {
      nocarga: { titulo: 'Además de descargarse, no carga', texto: 'Andando marca {v} V: el alternador no está reponiendo lo que la batería pierde.', checks: ['Alternador y regulador', 'Consumo con el auto parado', 'Estado de la batería'], serv: 'alternadores' },
      carga: { titulo: 'La carga está bien: medimos el consumo', texto: 'Andando marca {v} V, el alternador carga bien. Lo que la vacía es un consumo con el auto apagado o la batería.', checks: ['Consumo con todo apagado (menos de 50 mA)', 'Relés y módulos que quedan prendidos', 'Estado de la batería'], serv: 'diagnostico' },
      sobre: { titulo: 'Sobrecarga: regulador de voltaje', texto: 'Andando marca {v} V: pasa de lo normal y la batería se castiga.', checks: ['Regulador de voltaje', 'Estado de la batería', 'Consumo con el auto parado'], serv: 'alternadores' },
    },
  },
  titilan: {
    frase: 'tiene luces que bajan o titilan',
    base: { titulo: 'Carga inestable o masa floja', texto: 'Si las luces bajan con el aire prendido o al frenar, la carga no acompaña o hay una masa floja.', checks: ['Tensión con los consumos prendidos', 'Masas y conexiones', 'Regulador del alternador'], serv: 'carga' },
    apagado: 'Para esto sirve medirla con el motor en marcha y las luces prendidas.',
    marcha: {
      nocarga: { titulo: 'El alternador no alcanza', texto: 'Andando marca {v} V: con las luces y el aire prendidos, la carga se queda corta.', checks: ['Alternador y regulador', 'Correa', 'Masas'], serv: 'alternadores' },
      carga: { titulo: 'La carga da bien: buscamos la masa', texto: 'Andando marca {v} V, está bien. Lo que titila suele ser una masa floja o una ficha con falso contacto.', checks: ['Masas de carrocería y motor', 'Fichas de las ópticas', 'Cableado de luces'], serv: 'luces' },
      sobre: { titulo: 'Sobrecarga: cuidado con las lámparas', texto: 'Andando marca {v} V: con tanta tensión las lámparas se queman antes.', checks: ['Regulador de voltaje', 'Lámparas', 'Estado de la batería'], serv: 'alternadores' },
    },
  },
  unaluz: {
    frase: 'tiene una luz que no prende',
    base: { titulo: 'Lámpara, fusible o cableado', texto: 'Cuando es una sola luz, casi siempre es la lámpara, el fusible o una ficha sulfatada.', checks: ['Lámpara y portalámpara', 'Fusible y relé', 'Fichas y cableado'], serv: 'luces' },
    apagado: 'La batería no cambia este caso: lo revisamos en la luz.',
    marcha: 'La batería no cambia este caso: lo revisamos en la luz.',
  },
};

function initDiagnostico() {
  const root = document.querySelector('[data-diag]');
  if (!root) return;
  const radios = [...root.querySelectorAll('input[name="sintoma"]')];
  const segBtns = [...root.querySelectorAll('[data-motor]')];
  const tester = root.querySelector('[data-tester]');
  const ayuda = root.querySelector('[data-tester-ayuda]');
  const input = root.querySelector('[data-tester-input]');
  const numEl = root.querySelector('[data-tester-num]');
  const zonaEl = root.querySelector('[data-tester-zona]');
  const tickMin = root.querySelector('[data-tick-min]');
  const tickMax = root.querySelector('[data-tick-max]');
  const res = root.querySelector('[data-resultado]');
  const tituloEl = root.querySelector('[data-res-titulo]');
  const textoEl = root.querySelector('[data-res-texto]');
  const medidaEl = root.querySelector('[data-res-medida]');
  const checksEl = root.querySelector('[data-res-checks]');
  const servEl = root.querySelector('[data-res-servicio]');
  const wspEl = root.querySelector('[data-res-wsp]');
  let motor = 'nada';
  const valores = { apagado: MOTOR.apagado.inicial, marcha: MOTOR.marcha.inicial };

  const zonaDe = (m, v) => MOTOR[m].zonas.find(z => v < z.hasta) || MOTOR[m].zonas[MOTOR[m].zonas.length - 1];

  const pintarPista = m => {
    const cfg = MOTOR[m];
    const span = cfg.max - cfg.min;
    let desde = 0;
    const tramos = cfg.zonas.map(z => {
      const hasta = Math.min(100, ((Math.min(z.hasta, cfg.max) - cfg.min) / span) * 100);
      const t = `${TONOS[z.tono].pista} ${desde.toFixed(1)}% ${hasta.toFixed(1)}%`;
      desde = hasta;
      return t;
    });
    input.style.setProperty('--pista', `linear-gradient(90deg, ${tramos.join(', ')})`);
  };

  const render = animar => {
    const clave = radios.find(r => r.checked)?.value || 'clic';
    const s = SINTOMAS[clave];
    let out = s.base;
    let nota = '';
    let medida = null;
    if (motor !== 'nada') {
      const v = valores[motor];
      const zona = zonaDe(motor, v);
      medida = { v, zona };
      const rama = s[motor];
      if (typeof rama === 'string') nota = rama;
      else if (rama && rama[zona.id]) out = rama[zona.id];
    }
    const vTxt = medida ? fmtV(medida.v) : '';
    tituloEl.textContent = out.titulo;
    textoEl.textContent = (out.texto.replace('{v}', vTxt) + (nota ? ' ' + nota : '')).trim();
    checksEl.innerHTML = out.checks.map(c => `<li>${esc(c)}</li>`).join('');
    const [servId, servNombre] = SERVICIOS[out.serv] || SERVICIOS.diagnostico;
    servEl.textContent = servNombre;
    servEl.setAttribute('href', '#' + servId);
    servEl.dataset.destacar = servId;
    if (medida) {
      medidaEl.hidden = false;
      medidaEl.textContent = `Tu batería: ${vTxt} V con el motor ${motor === 'apagado' ? 'apagado' : 'en marcha'} · ${medida.zona.nombre.toLowerCase()}`;
      medidaEl.style.color = TONOS[medida.zona.tono].texto;
    } else {
      medidaEl.hidden = true;
    }
    let msg = `Hola! Les escribo desde la web. Mi auto ${s.frase}.`;
    if (medida) msg += ` La batería marca ${vTxt} V con el motor ${motor === 'apagado' ? 'apagado' : 'en marcha'}.`;
    msg += ` Según el diagnóstico de la web: ${out.titulo.charAt(0).toLowerCase() + out.titulo.slice(1)}. ¿Me lo pueden revisar?`;
    wspEl.setAttribute('href', wspHref(msg));
    if (animar && !reduceMotion) {
      res.classList.remove('is-cambio');
      void res.offsetWidth;
      res.classList.add('is-cambio');
    }
  };

  const pintarTester = () => {
    if (motor === 'nada') return;
    const v = valores[motor];
    const zona = zonaDe(motor, v);
    const tono = TONOS[zona.tono];
    numEl.textContent = fmtV(v);
    zonaEl.textContent = zona.nombre;
    tester.style.setProperty('--zona-texto', tono.texto);
    input.setAttribute('aria-valuetext', `${fmtV(v)} voltios, ${zona.nombre.toLowerCase()}`);
  };

  const setMotor = m => {
    motor = m;
    segBtns.forEach(b => b.setAttribute('aria-pressed', b.dataset.motor === m ? 'true' : 'false'));
    const medir = m !== 'nada';
    tester.hidden = !medir;
    if (ayuda) ayuda.textContent = medir
      ? (m === 'apagado' ? 'Con el auto apagado hace un rato, puntas en los bornes de la batería.' : 'Con el motor en marcha y en ralentí, puntas en los bornes de la batería.')
      : 'Con un tester en la escala de 20 V, puntas en los bornes de la batería.';
    if (medir) {
      const cfg = MOTOR[m];
      input.min = cfg.min;
      input.max = cfg.max;
      input.value = valores[m];
      tickMin.textContent = `${fmtV(cfg.min)} V`;
      tickMax.textContent = `${fmtV(cfg.max)} V`;
      pintarPista(m);
      pintarTester();
    }
    render(true);
    refrescarTriggers();
  };

  radios.forEach(r => r.addEventListener('change', () => render(true)));
  segBtns.forEach(b => b.addEventListener('click', () => setMotor(b.dataset.motor)));
  input.addEventListener('input', () => {
    valores[motor] = parseFloat(input.value);
    pintarTester();
    render(false);
  });
  render(false);
}

function initMapa() {
  const el = document.getElementById('mapa');
  if (!el || typeof L === 'undefined') return;
  const centro = [-27.4955, -58.7604];
  const mapa = L.map(el, { scrollWheelZoom: false, dragging: !L.Browser.mobile, attributionControl: true }).setView(centro, 15);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap', maxZoom: 19 }).addTo(mapa);
  L.circle(centro, { radius: 300, color: '#2563EB', weight: 1.5, fillColor: '#2563EB', fillOpacity: .08 }).addTo(mapa);
  L.marker(centro, {
    icon: L.divIcon({ className: 'mapa-pin', html: '<span></span>', iconSize: [30, 30], iconAnchor: [15, 15] }),
    title: 'Taller Electromotriz, zona Cremonte',
    keyboard: false,
  }).addTo(mapa);
  const ajustar = () => mapa.invalidateSize();
  window.addEventListener('load', ajustar);
  window.addEventListener('resize', ajustar, { passive: true });
}

function initForm() {
  const form = document.querySelector('[data-form]');
  if (!form) return;
  const tel = form.querySelector('#f-tel');
  let mask = null;
  if (tel && typeof IMask !== 'undefined') {
    mask = IMask(tel, { mask: [
      { mask: '+{54} 9 (000) 000-0000' },
      { mask: '+{54} 9 (00) 0000-0000' },
      { mask: '+{54} 9 (0000) 00-0000' },
    ] });
  }
  const reglas = {
    'f-nombre': v => v.trim().length >= 2 || 'Contanos tu nombre.',
    'f-tel': () => {
      const digitos = mask ? mask.unmaskedValue.replace(/\D/g, '') : tel.value.replace(/\D/g, '');
      return digitos.length >= 12 || (!mask && digitos.length >= 10) || 'Dejanos un WhatsApp completo, con característica.';
    },
    'f-msg': v => v.trim().length >= 4 || 'Contanos qué le pasa al auto.',
  };
  const marcar = (campo, msg) => {
    const err = document.getElementById(campo.id + '-error');
    if (msg === true) {
      campo.removeAttribute('aria-invalid');
      if (err) { err.hidden = true; err.textContent = ''; }
      return true;
    }
    campo.setAttribute('aria-invalid', 'true');
    if (err) { err.hidden = false; err.textContent = msg; }
    return false;
  };
  Object.keys(reglas).forEach(id => {
    const campo = document.getElementById(id);
    campo?.addEventListener('blur', () => { if (campo.value) marcar(campo, reglas[id](campo.value)); });
  });
  form.addEventListener('submit', e => {
    e.preventDefault();
    let primero = null;
    Object.keys(reglas).forEach(id => {
      const campo = document.getElementById(id);
      if (!campo) return;
      const ok = marcar(campo, reglas[id](campo.value));
      if (!ok && !primero) primero = campo;
    });
    if (primero) { primero.focus(); return; }
    const btn = form.querySelector('[type="submit"]');
    const texto = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Enviando…';
    setTimeout(() => {
      showToast('¡Gracias! El envío de mensajes se activa al pasar la web a producción.');
      form.reset();
      mask?.updateValue();
      btn.disabled = false;
      btn.textContent = texto;
    }, 800);
  });
}

function initFaq() {
  document.querySelectorAll('.faq-item').forEach(d => d.addEventListener('toggle', refrescarTriggers));
}

function initReveals() {
  const items = [...document.querySelectorAll('[data-animate]')].filter(el => !el.hasAttribute('data-hero-in'));
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

initModelBarScroll();
initNav();
initWspFloat();
initHero();
initHeroIn();
initDestacar();
initParallax();
initLlave();
initDiagnostico();
initMapa();
initForm();
initFaq();
initContadores();
initReveals();
