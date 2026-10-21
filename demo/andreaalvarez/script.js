const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const WSP = '5492214181777';
const wa = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const ico = id => `<svg class="ico" aria-hidden="true"><use href="#${id}"/></svg>`;
const icoWsp = '<svg class="ico-wsp" aria-hidden="true"><use href="#i-wsp"/></svg>';
const MSG_TALLER = 'Hola Andrea! Vi tu web y quiero que me avises cuando haya fecha para un taller vivencial.';

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

const SERVICIOS = [
  {
    id: 'individual', tipo: 'Acompañamiento personal', nombre: 'Sesiones individuales', foto: 'calma',
    alt: 'Almohadón de meditación sobre una alfombra tejida, con lavanda y una amatista en un banquito',
    detalle: 'Cada sesión se arma con lo que traés ese día. Conversamos y, según tu momento, combinamos herramientas como la biodescodificación, el Reiki Usui, la canalización o el coaching.',
    sirve: ['Estás atravesando un cambio y querés ordenarte', 'Notás algo que se repite y querés entenderlo', 'Buscás un espacio para vos, con escucha y sin juicio'],
    pasos: ['Me escribís por WhatsApp y me contás qué te trae', 'Coordinamos día y horario', 'En la sesión definimos las herramientas'],
    cta: 'Coordinar una sesión', msg: 'Hola Andrea! Vi tu web y quiero coordinar una sesión individual.'
  },
  {
    id: 'masajes', tipo: 'Cuerpo y bienestar', nombre: 'Masajes', foto: 'masajes',
    alt: 'Camilla de masajes con sábana blanca, manta lila y toallas con una rama de lavanda',
    detalle: 'Masaje profesional para soltar tensiones y bajar el ritmo. Si querés ir más profundo, se pueden sumar prácticas corporales inspiradas en el tantra para registrar el cuerpo con más conciencia.',
    sirve: ['Sentís el cuerpo cargado o contracturado', 'Te cuesta desconectar del día a día', 'Querés regalarte una pausa de cuidado'],
    pasos: ['Coordinamos el turno por WhatsApp', 'Me contás si hay alguna zona o molestia a tener en cuenta', 'Venís con ropa cómoda y sin apuro'],
    cta: 'Coordinar un masaje', msg: 'Hola Andrea! Vi tu web y quiero coordinar un masaje.'
  },
  {
    id: 'talleres', tipo: 'Propuesta en desarrollo', nombre: 'Talleres vivenciales', foto: 'talleres',
    alt: 'Almohadones lilas y crudos en ronda sobre un piso de madera, con una planta en el centro',
    detalle: 'Estoy preparando talleres vivenciales grupales: encuentros para explorar el cuerpo, la energía y el autoconocimiento en ronda, compartiendo el proceso con otras personas.',
    sirve: ['Te interesa vivir la experiencia en grupo', 'Querés conocer las herramientas antes de una sesión individual', 'Buscás un espacio para compartir lo que estás transitando'],
    pasos: ['Me escribís y te sumo a la lista de aviso', 'Me contás qué temas te gustaría trabajar', 'Cuando haya fecha, te paso el lugar y la propuesta'],
    cta: 'Avisame del próximo taller', msg: MSG_TALLER
  }
];

const MOMENTOS = {
  cuerpo: {
    tipo: 'Masajes', titulo: 'Empezar por el cuerpo',
    texto: 'Un masaje profesional para soltar la tensión acumulada y volver a habitar el cuerpo. Si querés ir más profundo, sumamos prácticas corporales inspiradas en el tantra.',
    herr: ['Masaje profesional', 'Prácticas corporales inspiradas en el tantra'],
    cta: 'Coordinar un masaje', msg: 'Hola Andrea! Siento el cuerpo tenso y me gustaría coordinar un masaje.'
  },
  patron: {
    tipo: 'Sesión individual', titulo: 'Empezar por entender',
    texto: 'Una sesión individual para mirar eso que se repite con otros ojos y buscar de dónde viene, con biodescodificación y herramientas de autoconocimiento.',
    herr: ['Biodescodificación', 'Autoconocimiento'],
    cta: 'Coordinar una sesión', msg: 'Hola Andrea! Hay algo que se repite en mi vida y quiero entenderlo. ¿Coordinamos una sesión individual?'
  },
  energia: {
    tipo: 'Sesión individual', titulo: 'Empezar por la energía',
    texto: 'Una sesión de trabajo energético para armonizar y recuperar tu eje. Según lo que aparezca, combinamos Reiki Usui, canalización o activación de energía kundalini.',
    herr: ['Reiki Usui', 'Canalización y trabajo energético', 'Activación de energía kundalini'],
    cta: 'Coordinar una sesión', msg: 'Hola Andrea! Siento que me falta energía y me interesa una sesión de trabajo energético.'
  },
  cambio: {
    tipo: 'Sesión individual', titulo: 'Empezar por ordenar',
    texto: 'Una sesión con coaching para ordenar lo que querés, ver opciones y definir el próximo paso, con herramientas de autoconocimiento para seguir entre sesiones.',
    herr: ['Coaching', 'Autoconocimiento'],
    cta: 'Coordinar una sesión', msg: 'Hola Andrea! Estoy atravesando un cambio y me gustaría una sesión para ordenarme.'
  },
  grupo: {
    tipo: 'Talleres vivenciales', titulo: 'Empezar en ronda',
    texto: 'Los talleres vivenciales grupales están en preparación. Escribime y te aviso cuando haya fecha.',
    herr: ['Encuentros grupales', 'Cuerpo, energía y autoconocimiento'],
    cta: 'Avisame del próximo taller', msg: MSG_TALLER
  },
  nose: {
    tipo: 'Sesión individual', titulo: 'Empezar por una charla',
    texto: 'Contame qué te trae y te propongo por dónde arrancar. No hace falta que sepas qué herramienta elegir.',
    herr: [],
    cta: 'Escribirle a Andrea', msg: 'Hola Andrea! Vi tu web y me gustaría contarte qué me pasa para ver por dónde empezar.'
  }
};

function fichaHTML(s) {
  return `<div class="ficha">
    <figure class="ficha__foto"><img src="images/${s.foto}-640.webp" srcset="images/${s.foto}-640.webp 640w, images/${s.foto}.webp 1200w" sizes="(min-width: 641px) 380px, 100vw" width="640" height="640" alt="${esc(s.alt)}"></figure>
    <div class="ficha__cuerpo">
      <p class="ficha__tipo">${esc(s.tipo)}</p>
      <h3 class="ficha__titulo">${esc(s.nombre)}</h3>
      <p class="ficha__bajada">${esc(s.detalle)}</p>
      <div class="ficha__bloques">
        <div><h4>Te puede servir si…</h4><ul class="lista-check">${s.sirve.map(t => `<li>${ico('i-check')}<span>${esc(t)}</span></li>`).join('')}</ul></div>
        <div><h4>Cómo seguimos</h4><ol class="lista-pasos">${s.pasos.map(t => `<li><span>${esc(t)}</span></li>`).join('')}</ol></div>
      </div>
      <a class="btn btn--cta" href="${wa(s.msg)}" target="_blank" rel="noopener">${icoWsp}<span>${esc(s.cta)}</span></a>
    </div>
  </div>`;
}

function focoAtrapado(caja, e) {
  if (e.key !== 'Tab') return;
  const f = [...caja.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')].filter(el => el.offsetParent !== null);
  if (!f.length) return;
  const primero = f[0];
  const ultimo = f[f.length - 1];
  if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
  else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
}

function initModalServicios() {
  const modal = document.getElementById('modal-servicio');
  const botones = document.querySelectorAll('[data-servicio]');
  if (!modal || !botones.length) return;
  const caja = modal.querySelector('.modal__caja');
  const contenido = modal.querySelector('.modal__contenido');
  let origen = null;
  const cerrar = () => {
    modal.hidden = true;
    document.body.classList.remove('no-scroll');
    origen?.focus();
  };
  botones.forEach(btn => btn.addEventListener('click', () => {
    const s = SERVICIOS.find(x => x.id === btn.dataset.servicio);
    if (!s) return;
    origen = btn;
    contenido.innerHTML = fichaHTML(s);
    modal.setAttribute('aria-label', s.nombre);
    modal.hidden = false;
    document.body.classList.add('no-scroll');
    caja.scrollTop = 0;
    caja.focus();
  }));
  modal.querySelectorAll('[data-cerrar]').forEach(el => el.addEventListener('click', cerrar));
  document.addEventListener('keydown', e => {
    if (modal.hidden) return;
    if (e.key === 'Escape') cerrar();
    else focoAtrapado(caja, e);
  });
}

function initCapitulos() {
  const lista = document.querySelector('.caps__lista');
  if (!lista) return;
  const tabs = [...lista.querySelectorAll('[role="tab"]')];
  const elegir = (tab, enfocar) => {
    tabs.forEach(t => {
      const activo = t === tab;
      t.setAttribute('aria-selected', String(activo));
      t.tabIndex = activo ? 0 : -1;
      const panel = document.getElementById(t.getAttribute('aria-controls'));
      if (!panel) return;
      panel.hidden = !activo;
      if (activo && enfocar !== null && !reduceMotion) {
        panel.classList.remove('es-nuevo');
        void panel.offsetWidth;
        panel.classList.add('es-nuevo');
      }
    });
    if (enfocar) tab.focus();
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  };
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => elegir(tab, false));
    tab.addEventListener('keydown', e => {
      const mov = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
      if (mov) { e.preventDefault(); elegir(tabs[(i + mov + tabs.length) % tabs.length], true); }
      else if (e.key === 'Home') { e.preventDefault(); elegir(tabs[0], true); }
      else if (e.key === 'End') { e.preventDefault(); elegir(tabs[tabs.length - 1], true); }
    });
  });
  elegir(tabs.find(t => t.getAttribute('aria-selected') === 'true') || tabs[0], null);
}

function initGuia() {
  const opciones = document.querySelectorAll('[data-momento]');
  const res = document.getElementById('resultado');
  if (!opciones.length || !res) return;
  const tipo = res.querySelector('.resultado__tipo span');
  const titulo = res.querySelector('.resultado__titulo');
  const texto = res.querySelector('.resultado__texto');
  const herr = res.querySelector('.resultado__herr');
  const cta = res.querySelector('.resultado__cta');
  const mostrar = (op, animar) => {
    const m = MOMENTOS[op.dataset.momento];
    if (!m) return;
    opciones.forEach(o => o.setAttribute('aria-pressed', String(o === op)));
    tipo.textContent = m.tipo;
    titulo.textContent = m.titulo;
    texto.textContent = m.texto;
    herr.innerHTML = m.herr.map(h => `<li>${esc(h)}</li>`).join('');
    herr.hidden = !m.herr.length;
    cta.href = wa(m.msg);
    cta.querySelector('span').textContent = m.cta;
    if (animar && !reduceMotion) {
      res.classList.remove('es-nuevo');
      void res.offsetWidth;
      res.classList.add('es-nuevo');
    }
    if (animar && typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  };
  opciones.forEach(op => op.addEventListener('click', () => mostrar(op, true)));
  const inicial = document.querySelector('[data-momento][aria-pressed="true"]');
  if (inicial) mostrar(inicial, false);
}

function initFaq() {
  document.querySelectorAll('.faq__item').forEach(d => d.addEventListener('toggle', () => {
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  }));
}

function initMapa() {
  const el = document.getElementById('mapa');
  if (!el || typeof L === 'undefined') return;
  try {
    const centro = L.latLng(-34.9215, -57.9545);
    const mapa = L.map(el, { scrollWheelZoom: false, attributionControl: true });
    mapa.setView(centro, 14);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap', maxZoom: 19 }).addTo(mapa);
    L.circle(centro, { radius: 700, color: '#6A3FA6', weight: 1, fillColor: '#6A3FA6', fillOpacity: .14 }).addTo(mapa);
    L.circleMarker(centro, { radius: 7, color: '#FFFFFF', weight: 2, fillColor: '#2E2145', fillOpacity: 1 }).addTo(mapa).bindTooltip('Zona aproximada · dirección al coordinar');
    const ajustar = () => mapa.invalidateSize();
    window.addEventListener('load', ajustar);
    if ('ResizeObserver' in window) new window.ResizeObserver(ajustar).observe(el);
  } catch {
    el.hidden = true;
  }
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
      trigger: el, start: 'top 82%', end: 'bottom 55%', scrub: .4, invalidateOnRefresh: true,
      onUpdate: self => {
        const hasta = self.progress * ws.length;
        ws.forEach((w, i) => w.classList.toggle('on', i < hasta));
      }
    });
  });
}

function initParallax() {
  if (reduceMotion || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('[data-parallax]').forEach(img => {
    ScrollTrigger.create({
      trigger: img.parentElement,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: self => { img.style.translate = `0 ${((self.progress - 0.5) * 8).toFixed(2)}%`; }
    });
  });
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

initCapitulos();
initModalServicios();
initGuia();
initFaq();
initMapa();
initReveals();
initNav();
initWspFloat();
initModelBarScroll();
initHeroMotion();
initLeeScroll();
initParallax();
