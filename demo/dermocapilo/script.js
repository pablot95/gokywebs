const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5491151217004';
const wa = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
let revealsListos = false;

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

const refrescar = () => { if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); };

const CASOS = {
  caida: {
    area: 'Cabello · Salud capilar', titulo: 'Diagnóstico capilar y tratamiento para la caída',
    texto: 'Arrancamos mirando tu cuero cabelludo con microcámara para entender por qué se cae y, con eso, armamos las sesiones en gabinete y los cuidados para casa.',
    paso: 'diagnóstico capilar.', cta: 'Consultar por la caída',
    msg: 'Hola Dermocapilo! Noto que se me cae el pelo y quiero coordinar un diagnóstico capilar.'
  },
  caspa: {
    area: 'Cabello · Salud capilar', titulo: 'Limpieza profunda y activos calmantes',
    texto: 'Primero vemos qué provoca la caspa o la picazón. Después trabajamos con una limpieza profunda del cuero cabelludo y activos que lo calman.',
    paso: 'diagnóstico capilar.', cta: 'Consultar por caspa o picazón',
    msg: 'Hola Dermocapilo! Tengo caspa o picazón en el cuero cabelludo y quiero hacer una consulta.'
  },
  graso: {
    area: 'Cabello · Salud capilar', titulo: 'Equilibrio del cuero cabelludo graso',
    texto: 'Con una limpieza profunda y activos que regulan la grasitud buscamos que el pelo se mantenga limpio más tiempo, y te contamos cómo lavarlo en casa.',
    paso: 'diagnóstico capilar.', cta: 'Consultar por pelo graso',
    msg: 'Hola Dermocapilo! Tengo el pelo graso y quiero consultar por un tratamiento.'
  },
  acne: {
    area: 'Piel · Dermatocosmiatría', titulo: 'Tratamiento para acné y piel grasa',
    texto: 'Combinamos limpiezas y activos para calmar los brotes y controlar el brillo, con seguimiento entre sesiones para ver cómo responde tu piel.',
    paso: 'evaluación de la piel y limpieza facial profunda.', cta: 'Consultar por acné',
    msg: 'Hola Dermocapilo! Tengo granitos o acné y quiero consultar por un tratamiento.'
  },
  manchas: {
    area: 'Piel · Dermatocosmiatría', titulo: 'Peeling y luminosidad',
    texto: 'Con peelings suaves y activos despigmentantes buscamos emparejar el tono de a poco, y te contamos cómo cuidarte del sol entre sesiones.',
    paso: 'evaluación de la piel.', cta: 'Consultar por manchas',
    msg: 'Hola Dermocapilo! Tengo manchas o el tono desparejo y quiero consultar por un tratamiento.'
  },
  seca: {
    area: 'Piel · Dermatocosmiatría', titulo: 'Limpieza facial e hidratación',
    texto: 'Una limpieza facial profunda con máscara y sérums hidratantes para devolverle agua y luz a la piel, más una rutina simple para sostenerlo en casa.',
    paso: 'limpieza facial profunda.', cta: 'Consultar por piel seca',
    msg: 'Hola Dermocapilo! Tengo la piel seca o apagada y quiero consultar por un tratamiento.'
  }
};

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

function focoAtrapado(caja, e) {
  if (e.key !== 'Tab') return;
  const f = [...caja.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')].filter(el => el.offsetParent !== null);
  if (!f.length) return;
  const primero = f[0];
  const ultimo = f[f.length - 1];
  if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
  else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
  else if (!f.includes(document.activeElement)) { e.preventDefault(); primero.focus(); }
}

function initPestanas() {
  const lista = document.querySelector('.pestanas');
  if (!lista) return;
  const tabs = [...lista.querySelectorAll('[role="tab"]')];
  const elegir = (tab, enfocar, animar) => {
    tabs.forEach(t => {
      const activo = t === tab;
      t.setAttribute('aria-selected', String(activo));
      t.tabIndex = activo ? 0 : -1;
      const panel = document.getElementById(t.getAttribute('aria-controls'));
      if (!panel) return;
      panel.hidden = !activo;
      if (!activo) return;
      if (animar && !reduceMotion) {
        panel.classList.remove('es-nuevo');
        void panel.offsetWidth;
        panel.classList.add('es-nuevo');
      }
      revelarNuevos(panel);
    });
    if (enfocar) tab.focus();
    refrescar();
  };
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => elegir(tab, false, true));
    tab.addEventListener('keydown', e => {
      const mov = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
      if (mov) { e.preventDefault(); elegir(tabs[(i + mov + tabs.length) % tabs.length], true, true); }
      else if (e.key === 'Home') { e.preventDefault(); elegir(tabs[0], true, true); }
      else if (e.key === 'End') { e.preventDefault(); elegir(tabs[tabs.length - 1], true, true); }
    });
  });
  const tabDe = id => tabs.find(t => t.getAttribute('aria-controls') === id);
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    const tab = tabDe(a.getAttribute('href').slice(1));
    if (!tab) return;
    a.addEventListener('click', e => {
      e.preventDefault();
      elegir(tab, false, true);
      const y = lista.getBoundingClientRect().top + window.scrollY - 24;
      window.scrollTo({ top: y, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  });
  const inicial = tabDe(location.hash.slice(1));
  if (inicial) elegir(inicial, false, false);
}

function initGaleria() {
  const sec = document.getElementById('galeria');
  if (!sec) return;
  const grid = sec.querySelector('.galeria__grid');
  const items = [...sec.querySelectorAll('.galeria__item')];
  const filtros = [...sec.querySelectorAll('.filtro')];
  const bento = document.body.classList.contains('m2');
  const acomodar = () => {
    if (!bento) return;
    const vis = items.filter(i => !i.hidden);
    items.forEach(i => i.classList.remove('es-grande', 'es-ancho'));
    if (vis.length >= 8) { vis[0].classList.add('es-grande'); vis[3].classList.add('es-ancho'); }
    else if (vis.length === 3) { vis[0].classList.add('es-grande'); vis[1].classList.add('es-ancho'); vis[2].classList.add('es-ancho'); }
    else if (vis.length === 2) vis.forEach(i => i.classList.add('es-grande'));
  };
  filtros.forEach(f => f.addEventListener('click', () => {
    const cat = f.dataset.filtro;
    filtros.forEach(x => x.setAttribute('aria-pressed', String(x === f)));
    items.forEach(i => { i.hidden = cat !== 'todo' && i.dataset.cat !== cat; });
    acomodar();
    revelarNuevos(grid);
    refrescar();
  }));
  acomodar();
}

function initVisor() {
  const visor = document.getElementById('visor');
  const sec = document.getElementById('galeria');
  if (!visor || !sec) return;
  const caja = visor.querySelector('.visor__caja');
  const img = visor.querySelector('.visor__img');
  const cat = visor.querySelector('.visor__cat');
  const tit = visor.querySelector('.visor__titulo');
  const num = visor.querySelector('.visor__n');
  let lista = [];
  let pos = 0;
  let origen = null;
  const pintar = () => {
    const btn = lista[pos];
    const mini = btn?.querySelector('img');
    if (!mini) return;
    img.src = mini.dataset.grande || mini.src;
    img.alt = mini.alt;
    cat.textContent = btn.querySelector('.galeria__cat')?.textContent || '';
    tit.textContent = btn.querySelector('.galeria__titulo')?.textContent || '';
    num.textContent = `${pos + 1} / ${lista.length}`;
  };
  const abrir = btn => {
    lista = [...sec.querySelectorAll('.galeria__item:not([hidden]) .galeria__btn')];
    pos = Math.max(0, lista.indexOf(btn));
    origen = btn;
    pintar();
    visor.hidden = false;
    document.body.classList.add('no-scroll');
    caja.focus();
  };
  const cerrar = () => {
    visor.hidden = true;
    document.body.classList.remove('no-scroll');
    origen?.focus();
  };
  const mover = d => {
    if (!lista.length) return;
    pos = (pos + d + lista.length) % lista.length;
    pintar();
  };
  sec.querySelectorAll('.galeria__btn').forEach(b => b.addEventListener('click', () => abrir(b)));
  visor.querySelectorAll('[data-cerrar]').forEach(el => el.addEventListener('click', cerrar));
  visor.querySelector('.visor__nav--prev')?.addEventListener('click', () => mover(-1));
  visor.querySelector('.visor__nav--next')?.addEventListener('click', () => mover(1));
  document.addEventListener('keydown', e => {
    if (visor.hidden) return;
    if (e.key === 'Escape') cerrar();
    else if (e.key === 'ArrowLeft') mover(-1);
    else if (e.key === 'ArrowRight') mover(1);
    else focoAtrapado(visor, e);
  });
  let x0 = null;
  caja.addEventListener('pointerdown', e => { x0 = e.clientX; });
  caja.addEventListener('pointerup', e => {
    if (x0 === null) return;
    const dx = e.clientX - x0;
    x0 = null;
    if (Math.abs(dx) > 50) mover(dx < 0 ? 1 : -1);
  });
}

function initGuia() {
  const opciones = document.querySelectorAll('[data-caso]');
  const res = document.getElementById('resultado');
  if (!opciones.length || !res) return;
  const area = res.querySelector('.resultado__area');
  const titulo = res.querySelector('.resultado__titulo');
  const texto = res.querySelector('.resultado__texto');
  const paso = res.querySelector('.resultado__paso span');
  const cta = res.querySelector('.resultado__cta');
  opciones.forEach(op => op.addEventListener('click', () => {
    const c = CASOS[op.dataset.caso];
    if (!c) return;
    opciones.forEach(o => o.setAttribute('aria-pressed', String(o === op)));
    area.textContent = c.area;
    titulo.textContent = c.titulo;
    texto.textContent = c.texto;
    paso.textContent = c.paso;
    cta.href = wa(c.msg);
    cta.querySelector('span').textContent = c.cta;
    if (!reduceMotion) {
      res.classList.remove('es-nuevo');
      void res.offsetWidth;
      res.classList.add('es-nuevo');
    }
    refrescar();
  }));
}

function initFaq() {
  document.querySelectorAll('.faq__item').forEach(d => d.addEventListener('toggle', refrescar));
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
      }
    });
  });
}

function initLenteGiro() {
  if (reduceMotion || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('.lente__anillo').forEach(svg => {
    ScrollTrigger.create({
      trigger: svg.closest('section') || svg,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: self => { svg.style.rotate = `${(self.progress * 72).toFixed(1)}deg`; }
    });
  });
}

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const img = hero.querySelector('[data-hero-img]');
  if (img) tl.from(img, { scale: 1.08, duration: 1.8 }, 0);
  tl.from(hero.querySelectorAll('.hero__panel'), { y: 28, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.05)
    .from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.15)
    .from(hero.querySelectorAll('h1'), { y: 36, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.25)
    .from(hero.querySelectorAll('.hero-lead'), { y: 24, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 20, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.sello'), { scale: 0.92, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.7);
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
    if (desktopMq.matches) { nav.removeAttribute('inert'); if (nav.classList.contains('open')) close(); }
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

initPestanas();
initGaleria();
initVisor();
initGuia();
initFaq();
initLeeScroll();
initReveals();
initNav();
initWspFloat();
initModelBarScroll();
initHeroMotion();
initLenteGiro();
