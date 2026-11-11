const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const OFERTA = [
  {
    id: 'guia-7-dias', tipo: 'guia', orden: 1, visible: true,
    etiqueta: 'La guía',
    nombre: 'Respira y Conduce Segura en 7 Días',
    desc: 'Un camino práctico de siete días para entender tu ansiedad al conducir y sumar herramientas a tu día a día.',
    temas: ['Reconocer qué te dispara la ansiedad', 'Técnicas de respiración y relajación', 'Preparación mental antes de salir', 'Enfrentar tus miedos de a poco'],
    img: 'images/guia-lector.webp', w: 1024, h: 1024,
    alt: 'Lector de libros electrónicos con la portada de la guía Respira y Conduce Segura en 7 Días',
  },
  {
    id: 'ejercicios-practicos', tipo: 'bono', orden: 2, visible: true,
    nombre: 'Ejercicios prácticos',
    desc: 'Actividades para reconocer lo que sentís, prepararte y enfrentar las situaciones que te generan inseguridad.',
    img: 'images/bono-ejercicios.webp', w: 1024, h: 1024,
    alt: 'Tablet con una plantilla de ejercicios en recuadros, junto a un lápiz óptico',
  },
  {
    id: 'mapa-mental-emergencia', tipo: 'bono', orden: 3, visible: true,
    nombre: 'Mapa mental de emergencia',
    desc: 'Una guía rápida con los pasos a seguir cuando los nervios suben.',
    img: 'images/bono-mapa.webp', w: 1024, h: 1024,
    alt: 'Celular sobre un soporte con la pantalla rosada, junto a flores y una taza',
  },
  {
    id: 'material-complementario', tipo: 'bono', orden: 4, visible: true,
    nombre: 'Material complementario',
    desc: 'Recursos y ejercicios extra para seguir practicando después de la guía.',
    img: 'images/bono-material.webp', w: 1024, h: 1024,
    alt: 'Tablet con una grilla de imágenes en tonos rosados y beige',
  },
  {
    id: 'bono-borrador', tipo: 'bono', orden: 9, visible: false,
    nombre: 'Bono en preparación',
    desc: 'Borrador oculto: no se muestra en la web.',
    img: 'images/bono-material.webp', w: 1024, h: 1024,
    alt: '',
  },
];

function crearOferta(coleccion, { tope = 100 } = {}) {
  const visibles = coleccion
    .filter(p => p && p.visible !== false)
    .sort((a, b) => (a.orden ?? 999) - (b.orden ?? 999) || String(a.id).localeCompare(String(b.id)));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || tope, 1), tope);
  function pagina({ cursor = null, limite = tope, tipo = null } = {}) {
    const lista = tipo ? visibles.filter(p => p.tipo === tipo) : visibles;
    let desde = 0;
    if (cursor) {
      const i = lista.findIndex(p => p.id === cursor);
      desde = i < 0 ? lista.length : i + 1;
    }
    const n = limitar(limite);
    const items = lista.slice(desde, desde + n).map(p => ({ ...p, temas: p.temas ? [...p.temas] : undefined }));
    const siguiente = desde + n < lista.length && items.length ? items[items.length - 1].id : null;
    return { items, siguiente };
  }
  return { pagina, tope };
}

const Oferta = crearOferta(OFERTA, { tope: 100 });

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const ICONO_CHECK = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="9"/><path d="M8.5 12.2l2.4 2.4 4.6-4.8"/></svg>';

function portadaLector() {
  return '<svg class="portada" viewBox="0 0 1024 1024" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false"><g transform="translate(313.5 190) scale(.7)">'
    + '<rect class="portada__panel" x="40" y="96" width="497" height="652" rx="26"/>'
    + '<text class="portada__kicker" x="288.5" y="178" text-anchor="middle">MANEJA EN CALMA</text>'
    + '<line class="portada__regla" x1="238" y1="210" x2="339" y2="210"/>'
    + '<text class="portada__titulo" x="288.5" y="320" text-anchor="middle">Respira y</text>'
    + '<text class="portada__titulo" x="288.5" y="400" text-anchor="middle">conduce</text>'
    + '<text class="portada__titulo" x="288.5" y="480" text-anchor="middle">segura</text>'
    + '<rect class="portada__pill" x="188.5" y="522" width="200" height="56" rx="28"/>'
    + '<text class="portada__dias" x="288.5" y="559" text-anchor="middle">en 7 días</text>'
    + '<text class="portada__pie" x="288.5" y="694" text-anchor="middle">Guía práctica + bonos</text>'
    + '</g></svg>';
}

function guiaHTML(g) {
  return `<article class="guia-destacada">
    <figure class="guia-destacada__media mock" data-animate="mascara" style="clip-path:inset(100% 0 0 0)"><div class="mock__lienzo"><img src="${esc(g.img)}" width="${g.w}" height="${g.h}" alt="${esc(g.alt)}">${portadaLector()}</div></figure>
    <div class="guia-destacada__texto" data-animate="subir" style="opacity:0;transform:translateY(32px)">
      <p class="etiqueta">${esc(g.etiqueta)}</p>
      <h3>${esc(g.nombre)}</h3>
      <p>${esc(g.desc)}</p>
      <ul class="temas">${(g.temas || []).map(t => `<li>${ICONO_CHECK}<span>${esc(t)}</span></li>`).join('')}</ul>
    </div>
  </article>`;
}

function bonoHTML(b, i) {
  return `<li data-animate="subir" style="opacity:0;transform:translateY(32px)">
    <article class="bono__card">
      <figure class="bono__media media"><img src="${esc(b.img)}" width="${b.w}" height="${b.h}" alt="${esc(b.alt)}"></figure>
      <div class="bono__texto">
        <p class="etiqueta">Bono ${i + 1}</p>
        <h4>${esc(b.nombre)}</h4>
        <p>${esc(b.desc)}</p>
      </div>
    </article>
  </li>`;
}

function initOferta() {
  const guias = Oferta.pagina({ tipo: 'guia', limite: 1 }).items;
  const bonos = Oferta.pagina({ tipo: 'bono' }).items;
  const todo = Oferta.pagina().items;
  document.querySelectorAll('[data-oferta-guia]').forEach(cont => { cont.innerHTML = guias.map(guiaHTML).join(''); });
  document.querySelectorAll('[data-oferta-bonos]').forEach(cont => { cont.innerHTML = bonos.map(bonoHTML).join(''); });
  document.querySelectorAll('[data-oferta-lista]').forEach(ul => {
    const tipo = ul.dataset.ofertaLista;
    if (tipo === 'todo') {
      ul.innerHTML = todo.map(p => `<li>${ICONO_CHECK}<span>${esc(p.tipo === 'bono' ? `Bono: ${p.nombre}` : `La guía ${p.nombre}`)}</span></li>`).join('');
    } else {
      ul.innerHTML = todo.filter(p => p.tipo === tipo).map(p => `<li>${esc(p.nombre)}</li>`).join('');
    }
  });
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

function initHeader() {
  const header = document.querySelector('.site-header--m1');
  if (!header) return;
  const update = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
  window.addEventListener('scroll', update, { passive: true });
  update();
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

function initRespira() {
  const etapa = document.querySelector('[data-respira]');
  const btn = document.querySelector('[data-respira-btn]');
  if (!etapa || !btn) return;
  const circulo = etapa.querySelector('.respira__circulo');
  const fase = etapa.querySelector('[data-respira-fase]');
  const cuenta = etapa.querySelector('[data-respira-cuenta]');
  const fin = document.querySelector('[data-respira-fin]');
  const FASES = [['Inhalá', 4, true], ['Sostené', 2, true], ['Soltá', 6, false]];
  const VUELTAS = 4;
  let timers = [];
  let activo = false;
  const limpiar = () => { timers.forEach(clearTimeout); timers = []; };
  const poner = (texto, seg, lleno) => {
    fase.textContent = texto;
    if (circulo) circulo.style.transitionDuration = reduceMotion ? '0s' : `${seg}s`;
    etapa.classList.toggle('is-lleno', lleno);
  };
  const detener = terminado => {
    limpiar();
    activo = false;
    etapa.classList.remove('is-activo', 'is-lleno');
    if (circulo) circulo.style.transitionDuration = '';
    btn.setAttribute('aria-pressed', 'false');
    if (terminado) {
      btn.textContent = 'Repetir la pausa';
      fase.textContent = 'Listo';
      cuenta.textContent = 'Volvé a tu ritmo';
      if (fin) fin.hidden = false;
    } else {
      btn.textContent = 'Empezar la pausa';
      fase.textContent = '¿Empezamos?';
      cuenta.textContent = '4 respiraciones · 48 s';
    }
  };
  const empezar = () => {
    limpiar();
    activo = true;
    if (fin) fin.hidden = true;
    btn.textContent = 'Detener';
    btn.setAttribute('aria-pressed', 'true');
    etapa.classList.add('is-activo');
    let t = 0;
    for (let v = 0; v < VUELTAS; v++) {
      FASES.forEach(([texto, seg, lleno]) => {
        timers.push(setTimeout(() => { poner(texto, seg, lleno); cuenta.textContent = `Respiración ${v + 1} de ${VUELTAS}`; }, t * 1000));
        t += seg;
      });
    }
    timers.push(setTimeout(() => detener(true), t * 1000));
  };
  btn.setAttribute('aria-pressed', 'false');
  btn.addEventListener('click', () => (activo ? detener(false) : empezar()));
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

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const img = hero.querySelector('[data-hero-img]');
  if (img) tl.from(img, { scale: 1.1, duration: 1.8 }, 0);
  tl.from(hero.querySelectorAll('.rama-deco'), { opacity: 0, duration: 1.6, clearProps: 'opacity' }, 0)
    .from(hero.querySelectorAll('.marca-xl, .hero2__marca'), { y: 22, opacity: 0, duration: 1, clearProps: 'transform,opacity' }, 0.05)
    .from(hero.querySelectorAll('.hero__sello'), { y: 12, opacity: 0, duration: 0.9, clearProps: 'transform,opacity' }, 0.15)
    .from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.22)
    .from(hero.querySelectorAll('h1'), { y: 36, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.3)
    .from(hero.querySelectorAll('.hero-lead'), { y: 24, opacity: 0, duration: 1 }, 0.48)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 20, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.sello, .hero-badge'), { scale: 0.92, opacity: 0, duration: 1.1, stagger: 0.1, clearProps: 'transform,opacity' }, 0.72);
}

initOferta();
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
initNav();
initHeader();
initWspFloat();
initModelBarScroll();
initRespira();
initReveals();
initHeroMotion();
