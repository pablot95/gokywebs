const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const WSP = '5491137724963';
const wa = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const ico = id => `<svg class="ico" aria-hidden="true"><use href="#${id}"/></svg>`;
const icoWsp = '<svg class="ico-wsp" aria-hidden="true"><use href="#i-wsp"/></svg>';
const MSG_GENERAL = 'Hola Gasiben! Vi la web y quiero hacer una consulta.';

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
    id: 'caldera', nombre: 'Calderas', icono: 'i-gauge', foto: 'caldera-instalacion',
    alt: 'Caldera mural con vaso de expansión y cañerías de cobre a la vista',
    bajada: 'Puesta en marcha, mantenimiento anual y reparación de calderas murales.',
    incluye: ['Revisión del quemador y de la combustión', 'Control de presión y del vaso de expansión', 'Chequeo del conducto de salida de gases', 'Limpieza y prueba de funcionamiento'],
    senales: ['Pierde presión o hay que cargarla seguido', 'No enciende o se apaga sola', 'Calienta el agua pero no los radiadores'],
    msg: 'Hola Gasiben! Quiero consultar por mi caldera.'
  },
  {
    id: 'calefaccion', nombre: 'Calefacción por radiadores', icono: 'i-termo', foto: 'radiador',
    alt: 'Radiador blanco bajo la ventana de un living con válvula termostática',
    bajada: 'Radiadores que calientan parejo: purgado, válvulas, pérdidas y equilibrado del circuito.',
    incluye: ['Purgado del aire de radiadores y circuito', 'Cambio de válvulas y cabezales termostáticos', 'Reparación de pérdidas en uniones y llaves', 'Equilibrado para que todos calienten igual'],
    senales: ['Un radiador está frío arriba', 'El circuito hace ruido al arrancar', 'Gotea una válvula o una unión'],
    msg: 'Hola Gasiben! Quiero consultar por la calefacción por radiadores.'
  },
  {
    id: 'termotanque', nombre: 'Termotanques y calefones', icono: 'i-gota', foto: 'termotanque',
    alt: 'Termotanque blanco instalado en un lavadero con cañerías de cobre',
    bajada: 'Instalación, cambio y service de termotanques y calefones a gas.',
    incluye: ['Limpieza del quemador y del piloto', 'Control de termocupla y válvula de seguridad', 'Revisión del conducto de evacuación', 'Cambio de ánodo y control de pérdidas'],
    senales: ['No calienta o tarda mucho', 'Se apaga el piloto', 'Sale agua turbia o con olor'],
    msg: 'Hola Gasiben! Quiero consultar por mi termotanque o calefón.'
  },
  {
    id: 'estufa', nombre: 'Estufas', icono: 'i-llama', foto: 'estufa',
    alt: 'Estufa de tiro balanceado encendida en la pared de un living',
    bajada: 'Instalación y service de estufas de tiro balanceado y convectores.',
    incluye: ['Limpieza del quemador y del piloto', 'Control de termocupla y de la llama', 'Revisión del conducto de tiro balanceado', 'Prueba de encendido y de pérdidas'],
    senales: ['La llama sale amarilla', 'El piloto no queda prendido', 'Hay olor al encenderla'],
    msg: 'Hola Gasiben! Quiero consultar por una estufa.'
  },
  {
    id: 'cocina', nombre: 'Cocinas y hornos', icono: 'i-olla', foto: 'cocina',
    alt: 'Cocina a gas de acero inoxidable con cinco hornallas y horno',
    bajada: 'Conexión, reparación y regulación de cocinas y hornos a gas.',
    incluye: ['Conexión con flexible aprobado', 'Regulación de la llama de las hornallas', 'Revisión de la válvula de seguridad del horno', 'Prueba de pérdidas en la conexión'],
    senales: ['Las hornallas tienen llama amarilla', 'El horno no prende o se apaga', 'Hay olor a gas cerca de la cocina'],
    msg: 'Hola Gasiben! Quiero consultar por mi cocina u horno.'
  },
  {
    id: 'instalacion', nombre: 'Cañerías e instalaciones', icono: 'i-llave', foto: 'canerias',
    alt: 'Cañerías de cobre y llaves de paso debajo de una caldera',
    bajada: 'Instalaciones nuevas, ampliaciones y búsqueda de pérdidas, hechas por un matriculado.',
    incluye: ['Tendido de cañerías nuevas', 'Prueba de hermeticidad de la instalación', 'Búsqueda y reparación de pérdidas', 'Conexión de artefactos nuevos'],
    senales: ['Hay olor a gas con todo apagado', 'Vas a sumar un artefacto', 'Estás por reformar la cocina o el baño'],
    msg: 'Hola Gasiben! Quiero consultar por una instalación de gas.'
  }
];

const SENALES = {
  olor: {
    nivel: 'urgente', titulo: 'Cortá el gas antes que nada',
    puede: 'Puede haber una pérdida en la instalación o en uno de los artefactos.',
    hacer: ['Cerrá la llave de paso del gas.', 'Abrí puertas y ventanas.', 'No toques interruptores ni enciendas fuego.', 'Si el olor es fuerte, salí y llamá a la distribuidora desde afuera.'],
    cta: 'Escribinos cuando hayas ventilado',
    msg: 'Hola Gasiben! Siento olor a gas en casa. ¿Pueden venir a buscar la pérdida?'
  },
  llama: {
    nivel: 'urgente', titulo: 'No lo uses hasta revisarlo',
    puede: 'El gas se está quemando mal y puede generar monóxido de carbono, que no tiene olor ni color.',
    hacer: ['Apagá el artefacto.', 'Ventilá el ambiente.', 'Si alguien tiene dolor de cabeza, mareos o náuseas, salgan al aire libre y llamen a emergencias.'],
    msg: 'Hola Gasiben! Un artefacto tiene la llama amarilla. ¿Pueden revisarlo?'
  },
  hollin: {
    nivel: 'urgente', titulo: 'Es una señal de mala combustión',
    puede: 'Las manchas oscuras alrededor de un artefacto aparecen cuando el gas no se quema bien: es otra señal de monóxido de carbono.',
    hacer: ['No lo uses con el ambiente cerrado.', 'Revisá que las rejillas de ventilación estén despejadas.', 'Pedí la revisión lo antes posible.'],
    msg: 'Hola Gasiben! Hay manchas negras alrededor de un artefacto a gas. ¿Pueden revisarlo?'
  },
  piloto: {
    nivel: 'pronto', titulo: 'Conviene revisarlo pronto',
    puede: 'Suele ser la termocupla, el piloto sucio o un problema de tiraje del conducto.',
    hacer: ['No insistas encendiéndolo una y otra vez.', 'Si sentís olor a gas, cerrá la llave de paso.', 'Mandanos una foto de la etiqueta con la marca y el modelo.'],
    msg: 'Hola Gasiben! Se me apaga el piloto. ¿Pueden revisarlo?'
  },
  presion: {
    nivel: 'pronto', titulo: 'Conviene revisarla pronto',
    puede: 'Puede ser una pérdida en el circuito, el vaso de expansión o la válvula de seguridad.',
    hacer: ['Anotá cuánto marca el manómetro.', 'Fijate cada cuánto vuelve a bajar.', 'Mirá si hay agua debajo de la caldera o de algún radiador.'],
    msg: 'Hola Gasiben! Mi caldera pierde presión. ¿Pueden revisarla?'
  },
  agua: {
    nivel: 'pronto', titulo: 'Conviene revisarlo pronto',
    puede: 'Puede ser el piloto, la termocupla, el termostato o sarro acumulado en el equipo.',
    hacer: ['Fijate si el piloto está prendido.', 'Mandanos una foto de la etiqueta con la marca y el modelo.'],
    msg: 'Hola Gasiben! Mi termotanque no calienta. ¿Pueden revisarlo?'
  },
  revision: {
    nivel: 'revision', titulo: 'Una revisión al año alcanza',
    puede: 'Lo recomendable es revisar los artefactos a gas una vez al año, idealmente antes del invierno.',
    hacer: ['Hacé una lista de los artefactos que tenés.', 'Anotá en qué ambiente está cada uno.'],
    msg: 'Hola Gasiben! Quiero coordinar una revisión de mis artefactos a gas.'
  }
};

const NIVELES = { urgente: 'Urgente', pronto: 'Revisalo pronto', revision: 'Para programar' };

function fichaHTML(s) {
  return `<div class="ficha">
    <figure class="ficha__foto"><img src="images/${s.foto}.webp" srcset="images/${s.foto}-640.webp 640w, images/${s.foto}.webp 1200w" sizes="(min-width: 861px) 420px, 100vw" width="1200" height="1200" alt="${esc(s.alt)}"></figure>
    <div class="ficha__cuerpo">
      <span class="ficha__icono">${ico(s.icono)}</span>
      <h3 class="ficha__titulo">${esc(s.nombre)}</h3>
      <p class="ficha__bajada">${esc(s.bajada)}</p>
      <div class="ficha__bloques">
        <div><h4>Qué incluye</h4><ul class="lista-check">${s.incluye.map(t => `<li>${ico('i-check')}<span>${esc(t)}</span></li>`).join('')}</ul></div>
        <div><h4>Escribinos si…</h4><ul class="lista-senal">${s.senales.map(t => `<li><span>${esc(t)}</span></li>`).join('')}</ul></div>
      </div>
      <a class="btn btn--navy" href="${wa(s.msg)}" target="_blank" rel="noopener">${icoWsp}<span>Consultar por WhatsApp</span></a>
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

function initTabs() {
  const lista = document.querySelector('.tabs__lista');
  const panel = document.querySelector('.tabs__panel');
  if (!lista || !panel) return;
  const tabs = [...lista.querySelectorAll('[role="tab"]')];
  const elegir = (tab, enfocar) => {
    const s = SERVICIOS.find(x => x.id === tab.dataset.tab);
    if (!s) return;
    tabs.forEach(t => {
      const activo = t === tab;
      t.setAttribute('aria-selected', String(activo));
      t.tabIndex = activo ? 0 : -1;
    });
    panel.setAttribute('aria-labelledby', tab.id);
    panel.innerHTML = fichaHTML(s);
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
  elegir(tabs.find(t => t.getAttribute('aria-selected') === 'true') || tabs[0], false);
}

function initGuia() {
  const chips = document.querySelectorAll('[data-senal]');
  const diag = document.getElementById('diagnostico');
  if (!chips.length || !diag) return;
  const nivel = diag.querySelector('.diagnostico__nivel');
  const titulo = diag.querySelector('.diagnostico__titulo');
  const cuerpo = diag.querySelector('.diagnostico__cuerpo');
  const cta = diag.querySelector('.diagnostico__cta');
  const mostrar = (chip, animar) => {
    const s = SENALES[chip.dataset.senal];
    if (!s) return;
    chips.forEach(c => c.setAttribute('aria-pressed', String(c === chip)));
    diag.dataset.nivel = s.nivel;
    nivel.hidden = false;
    nivel.innerHTML = `${ico(s.nivel === 'urgente' ? 'i-alerta' : 'i-planilla')}<span>${NIVELES[s.nivel]}</span>`;
    titulo.textContent = s.titulo;
    cuerpo.innerHTML = `<h4>Qué puede ser</h4><p>${esc(s.puede)}</p><h4>Mientras tanto</h4><ol class="lista-pasos">${s.hacer.map(t => `<li>${esc(t)}</li>`).join('')}</ol>`;
    cta.href = wa(s.msg);
    cta.querySelector('span').textContent = s.cta || 'Pedir la revisión por WhatsApp';
    if (animar && !reduceMotion) {
      diag.classList.remove('es-nuevo');
      void diag.offsetWidth;
      diag.classList.add('es-nuevo');
    }
    if (animar && typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  };
  chips.forEach(chip => chip.addEventListener('click', () => mostrar(chip, true)));
  const inicial = document.querySelector('[data-senal="revision"]');
  if (inicial) mostrar(inicial, false);
  else cta.href = wa(MSG_GENERAL);
}

function initFaq() {
  document.querySelectorAll('.faq__item').forEach(d => d.addEventListener('toggle', () => {
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  }));
}

function initParallax() {
  if (reduceMotion || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('[data-parallax]').forEach(img => {
    ScrollTrigger.create({
      trigger: img.parentElement,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: self => { img.style.translate = `0 ${((self.progress - 0.5) * 10).toFixed(2)}%`; }
    });
  });
}

function initHeroMotion() {
  const sello = document.querySelector('.hero .sello');
  const encender = () => sello?.classList.add('encendida');
  if (reduceMotion || typeof gsap === 'undefined') { encender(); return; }
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const img = hero.querySelector('[data-hero-img]');
  if (img) tl.from(img, { scale: 1.1, duration: 1.8 }, 0);
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1, stagger: 0.08 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.hero-badge'), { y: 14, opacity: 0, duration: 0.8, stagger: 0.08, clearProps: 'transform,opacity' }, 0.75);
  if (sello) tl.from(sello, { scale: 0.92, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.7).call(encender, null, 1.05);
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

initTabs();
initModalServicios();
initGuia();
initFaq();
initReveals();
initNav();
initWspFloat();
initModelBarScroll();
initHeroMotion();
initParallax();
