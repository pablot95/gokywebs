const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) e.preventDefault();
});

const SERVICIOS = [
  {
    titulo: 'Coaching de equipos', tag: 'Se escuchan y se agrupan',
    txt: 'Mejor comunicación, confianza y resultados. Trabajamos sobre cómo se hablan, cómo se piden las cosas y qué pasa cuando algo sale mal.',
  },
  {
    titulo: 'Desarrollo de líderes', tag: 'Aparece quien conduce',
    txt: 'Liderazgo consciente, inspiración y acción. Acompañamos a quien conduce el equipo para que deje de resolver todo y empiece a hacer crecer a los demás.',
  },
  {
    titulo: 'Cultura colaborativa', tag: 'Todos con la misma información',
    txt: 'Equipos más alineados, comprometidos y productivos. Acuerdos claros, información que circula y una forma común de trabajar.',
  },
  {
    titulo: 'Estrategia y resultados', tag: 'Todos hacia el mismo objetivo',
    txt: 'Alineamos propósito, personas y objetivos. Que lo que el equipo hace todos los días empuje hacia donde la organización quiere ir.',
  },
];

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const suave = t => t * t * (3 - 2 * t);
const azar = i => { const x = Math.sin(i * 127.1) * 43758.5453; return x - Math.floor(x); };

/* ---------- las formaciones del equipo ---------- */
const N = 24;

function formacionDispersa() {
  return Array.from({ length: N }, (_, i) => ({
    x: .08 + .84 * azar(i * 3 + 1),
    y: .1 + .8 * azar(i * 7 + 5),
    s: .7 + .55 * azar(i * 11 + 2),
  }));
}
function formacionGrupos() {
  const centros = [[.25, .29], [.74, .26], [.27, .73], [.73, .72]];
  return Array.from({ length: N }, (_, i) => {
    const g = i % 4;
    const k = Math.floor(i / 4);
    const a = (k / 6) * Math.PI * 2 + g * .8;
    const r = .085 + .028 * azar(i * 5 + 3);
    return { x: centros[g][0] + Math.cos(a) * r, y: centros[g][1] + Math.sin(a) * r, s: 1 };
  });
}
function formacionLider() {
  return Array.from({ length: N }, (_, i) => {
    if (i === 0) return { x: .5, y: .19, s: 2.1 };
    const j = i - 1;
    const fila = Math.floor(j / 8);
    const col = j % 8;
    const ancho = .66 - fila * .07;
    return { x: .5 + (col - 3.5) / 7 * ancho, y: .48 + fila * .17, s: .95 };
  });
}
function formacionGrilla() {
  return Array.from({ length: N }, (_, i) => ({
    x: .14 + (i % 6) / 5 * .72,
    y: .17 + Math.floor(i / 6) / 3 * .66,
    s: 1,
  }));
}
function formacionMarcha() {
  return Array.from({ length: N }, (_, i) => {
    const t = i / (N - 1);
    return { x: .1 + t * .8, y: .85 - t * .7, s: .8 + .55 * t };
  });
}

const FORMACIONES = [formacionDispersa(), formacionGrupos(), formacionLider(), formacionGrilla(), formacionMarcha()];

function renderPasos() {
  const cont = document.getElementById('servPasos');
  if (!cont) return;
  cont.innerHTML = SERVICIOS.map((s, i) => `<li class="paso ${i === 0 ? 'is-on' : ''}" data-paso="${i}">
    <span class="paso-n">0${i + 1} — Servicio</span>
    <h3>${esc(s.titulo)}</h3>
    <div class="paso-cuerpo"><div><p>${esc(s.txt)}</p></div></div>
  </li>`).join('');
}

function initServicios() {
  const stage = document.getElementById('servStage');
  const tablero = document.getElementById('tablero');
  if (!stage || !tablero) return;

  const puntos = [];
  for (let i = 0; i < N; i++) {
    const p = document.createElement('span');
    p.className = 'punto' + (i === 0 ? ' punto--oro' : (i % 5 === 0 ? ' punto--soft' : ''));
    tablero.appendChild(p);
    puntos.push(p);
  }
  const eje = document.getElementById('ejeLinea');
  const tag = document.getElementById('tableroTag');
  const pasos = [...document.querySelectorAll('#servPasos .paso')];
  let W = 0, H = 0, progresoActual = 0;

  const medir = () => {
    const r = tablero.getBoundingClientRect();
    W = r.width; H = r.height;
  };

  const colocar = prog => {
    if (!W) medir();
    const raw = clamp(prog, 0, .9999) * 4;
    const i = Math.min(3, Math.floor(raw));
    const t = suave(clamp(raw - i, 0, 1));
    const a = FORMACIONES[i], b = FORMACIONES[i + 1];
    for (let k = 0; k < N; k++) {
      const x = a[k].x + (b[k].x - a[k].x) * t;
      const y = a[k].y + (b[k].y - a[k].y) * t;
      const s = a[k].s + (b[k].s - a[k].s) * t;
      puntos[k].style.transform = `translate(${(x * W).toFixed(1)}px,${(y * H).toFixed(1)}px) scale(${s.toFixed(2)})`;
    }
    pasos.forEach((p, k) => p.classList.toggle('is-on', k === i));
    if (eje) eje.style.strokeDashoffset = i === 3 ? (100 - 100 * t).toFixed(1) : 100;
    if (tag) tag.textContent = raw < .14 ? 'Antes: cada uno por su lado' : SERVICIOS[i].tag;
  };

  medir();
  colocar(0);
  let tr;
  window.addEventListener('resize', () => { clearTimeout(tr); tr = setTimeout(() => { medir(); colocar(progresoActual); }, 150); });
  window.addEventListener('load', () => { medir(); colocar(progresoActual); });

  const setProg = p => { progresoActual = p; colocar(p); };

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) {
    setProg(.999);
    pasos.forEach(p => p.classList.add('is-on'));
    return;
  }

  const mm = gsap.matchMedia();

  mm.add('(min-width: 1081px) and (prefers-reduced-motion: no-preference)', () => {
    const st = ScrollTrigger.create({
      trigger: stage, start: 'top top', end: '+=320%', pin: true, scrub: .6,
      invalidateOnRefresh: true, anticipatePin: 1,
      onRefresh: () => { medir(); colocar(progresoActual); },
      onUpdate: self => setProg(self.progress),
    });
    return () => st.kill();
  });

  mm.add('(max-width: 1080px) and (prefers-reduced-motion: no-preference)', () => {
    stage.classList.add('is-sticky-mobile');
    const st = ScrollTrigger.create({
      trigger: stage, start: 'top top', end: 'bottom bottom', scrub: .6, invalidateOnRefresh: true,
      onRefresh: () => { medir(); colocar(progresoActual); },
      onUpdate: self => setProg(self.progress),
    });
    requestAnimationFrame(() => { medir(); colocar(progresoActual); ScrollTrigger.refresh(); });
    return () => { stage.classList.remove('is-sticky-mobile'); st.kill(); };
  });
}

/* ---------- puntos decorativos del hero ---------- */
function initHeroPuntos() {
  const cont = document.getElementById('heroPuntos');
  if (!cont) return;
  const pos = [[6, 22], [13, 68], [22, 12], [31, 86], [44, 30], [52, 74], [63, 18], [71, 60], [84, 34], [92, 78], [38, 54], [77, 8]];
  cont.innerHTML = pos.map(([x, y]) => `<i style="left:${x}%;top:${y}%"></i>`).join('');
  if (typeof gsap === 'undefined' || reduceMotion) return;
  gsap.to('.hero-puntos i', { y: -14, duration: 3.4, ease: 'sine.inOut', stagger: { each: .18, from: 'random' }, yoyo: true, repeat: -1 });
}

function initHero() {
  if (typeof gsap === 'undefined' || reduceMotion) return;
  gsap.timeline({ defaults: { ease: 'power3.out' } })
    .from('.hero-copy .eyebrow', { y: 14, opacity: 0, duration: .7 }, .1)
    .from('.hero-copy h1 .linea', { y: 26, opacity: 0, duration: .85, stagger: .13 }, .18)
    .from('.hero-copy p', { y: 16, opacity: 0, duration: .8 }, .58)
    .from('.hero-cta .btn', { y: 14, opacity: 0, duration: .7, stagger: .1 }, .7)
    .from('.hero-media', { clipPath: 'inset(0 0 100% 0)', duration: 1.15, ease: 'power3.inOut' }, .25)
    .from('.hero-media img', { scale: 1.16, duration: 1.5, ease: 'power2.out' }, .25)
    .from('.hero-seal', { y: 18, opacity: 0, duration: .7 }, .95);

  if (typeof ScrollTrigger === 'undefined') return;
  if (window.matchMedia('(min-width:900px)').matches) {
    gsap.to('.hero-media img', { yPercent: 6, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .8 } });
  }
  gsap.fromTo('.claim-punto', { scale: .4, opacity: 0 }, {
    scale: 1, opacity: 1, duration: .8, ease: 'back.out(2)',
    scrollTrigger: { trigger: '.claim', start: 'bottom 92%' },
  });
}

/* ---------- reveals ---------- */
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

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; document.querySelector('.site-header').appendChild(bd); }
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open'); nav.setAttribute('inert', '');
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
}

function initWspFloat() {
  const btn = document.getElementById('wsp-float');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) btn.classList.add('visible'); else btn.classList.remove('visible');
  }, { passive: true });
}

function initAnclas() {
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href').slice(1);
    const dest = id === 'top' ? document.body : document.getElementById(id);
    if (!dest) return;
    e.preventDefault();
    if (id === 'top') { window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }); return; }
    const y = dest.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top: y, behavior: reduceMotion ? 'auto' : 'smooth' });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
  if (typeof gsap === 'undefined') {
    document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; el.style.clipPath = 'none'; });
  }

  document.getElementById('year').textContent = new Date().getFullYear();

  renderPasos();
  initHeroPuntos();
  initNav();
  initAnclas();
  initHero();
  initServicios();
  initReveals();
  initWspFloat();

  if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());
});
