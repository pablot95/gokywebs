const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const WSP = '5492615615921';
const wa = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const ico = id => `<svg class="ico" aria-hidden="true"><use href="#${id}"/></svg>`;
const icoWsp = '<svg class="ico-wsp" aria-hidden="true"><use href="#i-wsp"/></svg>';

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
    id: 'riesgos', nombre: 'Evaluación de riesgos', icono: 'i-alerta', foto: '04-sonometro', ancho: 1254, alto: 1254,
    alt: 'Sonómetro sobre trípode midiendo el ruido junto a una sierra en un taller',
    bajada: 'Recorremos cada puesto y área para identificar los riesgos y ordenarlos por prioridad.',
    incluye: ['Relevamiento de puestos, máquinas e instalaciones', 'Identificación de los riesgos de cada tarea', 'Valoración y orden de prioridades', 'Medidas preventivas concretas para cada riesgo'],
    entrega: 'Informe con el mapa de riesgos y un plan de acción.',
    msg: 'Hola JIC! Quiero consultar por una evaluación de riesgos para mi empresa.'
  },
  {
    id: 'capacitaciones', nombre: 'Capacitaciones', icono: 'i-usuarios', foto: '07-sala-capacitacion', ancho: 1254, alto: 1254,
    alt: 'Sala de capacitación con sillas, pantalla y cascos de seguridad sobre una mesa',
    bajada: 'Capacitaciones para tu personal, pensadas para los riesgos de cada tarea.',
    incluye: ['Inducción para el personal nuevo', 'Uso y cuidado de los elementos de protección', 'Uso de extintores y evacuación', 'Trabajo seguro según la tarea: altura, máquinas, cargas'],
    entrega: 'Planilla de asistencia con temario, fecha y firmas.',
    msg: 'Hola JIC! Quiero consultar por capacitaciones para mi personal.'
  },
  {
    id: 'programas', nombre: 'Programas de seguridad', icono: 'i-escudo', foto: '02-planta', ancho: 1600, alto: 900,
    alt: 'Nave industrial con bancos de trabajo y demarcación amarilla en el piso',
    bajada: 'Un plan anual de prevención con objetivos, responsables y fechas.',
    incluye: ['Objetivos de seguridad del año', 'Cronograma de capacitaciones, mediciones y controles', 'Inspecciones periódicas y seguimiento', 'Indicadores para ver cómo avanza'],
    entrega: 'Programa anual con cronograma y registros de seguimiento.',
    msg: 'Hola JIC! Quiero consultar por un programa de seguridad para mi empresa.'
  },
  {
    id: 'epp', nombre: 'Elementos de protección personal', icono: 'i-casco', foto: '09-epp-botas', ancho: 1254, alto: 1254,
    alt: 'Protector auditivo amarillo, botines de seguridad y guantes de trabajo sobre el piso',
    bajada: 'Definimos qué protección necesita cada puesto y cómo se registra su entrega.',
    incluye: ['Elementos de protección según el riesgo de cada puesto', 'Asesoramiento para elegir elementos certificados', 'Planillas de entrega por trabajador', 'Capacitación en uso y cuidado'],
    entrega: 'Matriz de elementos por puesto y planillas de entrega.',
    msg: 'Hola JIC! Quiero consultar por los elementos de protección personal de mi equipo.'
  },
  {
    id: 'emergencia', nombre: 'Plan de emergencia', icono: 'i-sirena', foto: '06-salida-emergencia', ancho: 1254, alto: 1254,
    alt: 'Matafuego rojo colgado junto a una puerta de salida de emergencia con barra antipánico',
    bajada: 'Qué hacer, quién lo hace y por dónde salir ante un incendio, un sismo o un accidente.',
    incluye: ['Análisis de escenarios: incendio, sismo, derrames, accidentes', 'Roles y brigada de emergencia', 'Plano de evacuación y señalización', 'Simulacro con su registro'],
    entrega: 'Plan escrito, planos de evacuación y acta del simulacro.',
    msg: 'Hola JIC! Quiero consultar por un plan de emergencia para mi empresa.'
  },
  {
    id: 'accidentes', nombre: 'Investigación de accidentes', icono: 'i-lupa', foto: '03-casco', ancho: 1254, alto: 1254,
    alt: 'Casco blanco y anteojos de seguridad sobre un banco de trabajo metálico',
    bajada: 'Buscamos las causas de lo que pasó para que no se repita.',
    incluye: ['Relevamiento del lugar y de la tarea', 'Entrevistas con las personas involucradas', 'Análisis de causas', 'Medidas correctivas y su seguimiento'],
    entrega: 'Informe de investigación con causas y medidas.',
    msg: 'Hola JIC! Necesito investigar un accidente o incidente en mi empresa.'
  },
  {
    id: 'documentacion', nombre: 'Documentación legal', icono: 'i-doc', foto: '08-legajo', ancho: 1254, alto: 1254,
    alt: 'Carpeta, planilla con birome y casco blanco sobre un escritorio junto a la ventana',
    bajada: 'Registros, planillas e informes al día para presentar cuando te los pidan.',
    incluye: ['Revisión de lo que tenés y de lo que falta', 'Registros de capacitación y de entrega de elementos', 'Informes técnicos y relevamientos', 'Legajo ordenado y actualizado'],
    entrega: 'Legajo de higiene y seguridad al día.',
    msg: 'Hola JIC! Quiero poner al día la documentación de higiene y seguridad.'
  },
  {
    id: 'mediciones', nombre: 'Mediciones ambientales', icono: 'i-onda', foto: '05-monitor-ambiental', ancho: 1254, alto: 1254,
    alt: 'Monitor de condiciones ambientales sobre una mesada junto a un conducto de ventilación',
    bajada: 'Ruido, iluminación y las condiciones del ambiente de trabajo, medidas según protocolo.',
    incluye: ['Ruido en los puestos de trabajo', 'Iluminación de cada área', 'Otras condiciones que pida tu actividad', 'Mejoras si algún valor no cumple'],
    entrega: 'Protocolos de medición con sus resultados.',
    msg: 'Hola JIC! Quiero consultar por mediciones ambientales para mi empresa.'
  }
];

const SITUACIONES = {
  alta: {
    titulo: 'Arrancar con todo en regla',
    pasos: ['Evaluamos los riesgos de cada puesto.', 'Definimos los elementos de protección y registramos su entrega.', 'Capacitamos al personal desde el primer día.'],
    servicios: ['riesgos', 'epp', 'capacitaciones', 'documentacion'],
    nota: 'La Ley 19.587 de Higiene y Seguridad en el Trabajo y su Decreto 351/79 son la base de lo que se le pide a toda empresa con personal.',
    msg: 'Estamos empezando a tener personal y queremos arrancar en regla.'
  },
  pedido: {
    titulo: 'Responder con la documentación al día',
    pasos: ['Revisamos qué te pidieron y qué tenés hoy.', 'Completamos lo que falta: relevamientos, registros y planillas.', 'Armamos el programa para que la próxima vez esté listo.'],
    servicios: ['documentacion', 'riesgos', 'programas'],
    nota: 'Mandanos por WhatsApp la nota o el mail que te llegó: con eso arrancamos.',
    msg: 'Nos están pidiendo documentación de higiene y seguridad.'
  },
  accidente: {
    titulo: 'Entender qué pasó para que no se repita',
    pasos: ['Primero, la persona: atención médica y aviso a la ART.', 'Investigamos las causas en el lugar y con quienes estaban.', 'Proponemos medidas correctivas y las dejamos registradas.'],
    servicios: ['accidentes', 'riesgos', 'capacitaciones'],
    nota: 'Cuanto antes se releva el lugar, más claro queda lo que pasó.',
    msg: 'Tuvimos un accidente o incidente y queremos investigarlo.'
  },
  mediciones: {
    titulo: 'Medir con los protocolos de la SRT',
    pasos: ['Definimos qué hay que medir en cada puesto.', 'Medimos según el protocolo de cada agente.', 'Te entregamos los resultados y, si hace falta, las mejoras.'],
    servicios: ['mediciones', 'documentacion'],
    nota: 'Las mediciones de ruido e iluminación se hacen con los protocolos de las resoluciones SRT 85/2012 y 84/2012, y tienen una validez de 12 meses.',
    msg: 'Tenemos que hacer las mediciones del año.'
  },
  capacitar: {
    titulo: 'Capacitar según la tarea de cada uno',
    pasos: ['Vemos los riesgos de cada tarea.', 'Armamos el temario y las fechas.', 'Damos la capacitación y entregamos la planilla de asistencia.'],
    servicios: ['capacitaciones', 'epp', 'emergencia'],
    nota: 'Cada capacitación queda registrada con temario, fecha y firma de los asistentes.',
    msg: 'Necesitamos capacitar al personal.'
  },
  emergencia: {
    titulo: 'Saber qué hacer antes de que pase',
    pasos: ['Analizamos los escenarios posibles: incendio, sismo, derrames.', 'Armamos los roles, el plano de evacuación y la señalización.', 'Hacemos el simulacro y lo dejamos registrado.'],
    servicios: ['emergencia', 'capacitaciones'],
    nota: 'Un plan se practica: el simulacro muestra lo que el papel no.',
    msg: 'Queremos armar un plan de emergencia.'
  }
};

const RUBROS = {
  industria: { nombre: 'industria o taller', foco: 'máquinas, ruido, manejo de cargas y riesgo eléctrico' },
  construccion: { nombre: 'construcción', foco: 'trabajo en altura, excavaciones, andamios y herramientas eléctricas' },
  bodega: { nombre: 'bodega, finca o agro', foco: 'maquinaria agrícola, espacios confinados como piletas y tanques, y productos fitosanitarios' },
  comercio: { nombre: 'comercio u oficina', foco: 'evacuación, extintores, instalaciones eléctricas y puestos con pantalla' },
  gastronomia: { nombre: 'gastronomía', foco: 'cortes, quemaduras, instalaciones de gas y pisos resbaladizos' },
  logistica: { nombre: 'logística y depósitos', foco: 'autoelevadores, estanterías y manejo de cargas' },
  salud: { nombre: 'salud o educación', foco: 'evacuación de mucha gente, instalaciones y, en salud, riesgo biológico' },
  otro: { nombre: 'otro rubro', foco: '' }
};

function fichaHTML(s) {
  const n = SERVICIOS.indexOf(s) + 1;
  const src = `images/${s.foto}`;
  const set = s.ancho > s.alto ? `${src}-960.webp 960w, ${src}.webp ${s.ancho}w` : `${src}-640.webp 640w, ${src}.webp ${s.ancho}w`;
  return `<div class="ficha">
    <figure class="ficha__foto" style="--r:${s.ancho}/${s.alto}"><img src="${src}.webp" srcset="${set}" sizes="(min-width: 861px) 440px, 100vw" width="${s.ancho}" height="${s.alto}" alt="${esc(s.alt)}"></figure>
    <div class="ficha__cuerpo">
      <span class="ficha__folio">${String(n).padStart(2, '0')} / ${String(SERVICIOS.length).padStart(2, '0')}</span>
      <h3 class="ficha__titulo"><span class="ficha__icono">${ico(s.icono)}</span>${esc(s.nombre)}</h3>
      <p class="ficha__bajada">${esc(s.bajada)}</p>
      <h4 class="ficha__sub">Qué incluye</h4>
      <ul class="lista-check">${s.incluye.map(t => `<li>${ico('i-check')}<span>${esc(t)}</span></li>`).join('')}</ul>
      <p class="ficha__entrega">${ico('i-planilla')}<span><strong>Te entregamos:</strong> ${esc(s.entrega)}</span></p>
      <a class="btn btn--primario" href="${wa(s.msg)}" target="_blank" rel="noopener">${icoWsp}<span>Consultar por WhatsApp</span></a>
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

let abrirServicio = null;
let elegirServicio = null;

function initModalServicios() {
  const modal = document.getElementById('modal-servicio');
  if (!modal) return;
  const caja = modal.querySelector('.modal__caja');
  const contenido = modal.querySelector('.modal__contenido');
  let origen = null;
  const cerrar = () => {
    modal.hidden = true;
    document.body.classList.remove('no-scroll');
    origen?.focus();
  };
  abrirServicio = (id, btn) => {
    const s = SERVICIOS.find(x => x.id === id);
    if (!s) return;
    origen = btn || null;
    contenido.innerHTML = fichaHTML(s);
    modal.setAttribute('aria-label', s.nombre);
    modal.hidden = false;
    document.body.classList.add('no-scroll');
    caja.scrollTop = 0;
    caja.focus();
  };
  document.querySelectorAll('[data-servicio]').forEach(btn => btn.addEventListener('click', () => abrirServicio(btn.dataset.servicio, btn)));
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
    if (!reduceMotion) {
      panel.classList.remove('es-nuevo');
      void panel.offsetWidth;
      panel.classList.add('es-nuevo');
    }
    if (enfocar) tab.focus();
    if (lista.scrollWidth > lista.clientWidth) {
      lista.scrollTo({ left: tab.offsetLeft - lista.clientWidth / 2 + tab.offsetWidth / 2, behavior: reduceMotion ? 'auto' : 'smooth' });
    }
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  };
  elegirServicio = id => {
    const tab = tabs.find(t => t.dataset.tab === id);
    if (!tab) return;
    elegir(tab, false);
    document.getElementById('servicios')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
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
  const res = document.getElementById('guia-resultado');
  const chips = document.querySelectorAll('[data-situacion]');
  if (!res || !chips.length) return;
  const segs = document.querySelectorAll('[data-personas]');
  const rubroSel = document.getElementById('guia-rubro');
  const titulo = res.querySelector('.guia__titulo');
  const pasos = res.querySelector('.guia__pasos');
  const rubroTxt = res.querySelector('.guia__rubro');
  const servWrap = res.querySelector('.guia__servicios');
  const pills = res.querySelector('.pills');
  const nota = res.querySelector('.guia__nota');
  const cta = res.querySelector('.guia__cta');
  let situacion = 'alta';
  let personas = '1 a 10';
  const pintar = animar => {
    const s = SITUACIONES[situacion];
    const r = RUBROS[rubroSel?.value] || RUBROS.otro;
    if (!s) return;
    chips.forEach(c => c.setAttribute('aria-pressed', String(c.dataset.situacion === situacion)));
    segs.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.personas === personas)));
    titulo.textContent = s.titulo;
    pasos.innerHTML = s.pasos.map(t => `<li>${esc(t)}</li>`).join('');
    rubroTxt.hidden = !r.foco;
    rubroTxt.innerHTML = r.foco ? `En <strong>${esc(r.nombre)}</strong> suelen pesar ${esc(r.foco)}.` : '';
    pills.innerHTML = s.servicios.map(id => {
      const sv = SERVICIOS.find(x => x.id === id);
      return sv ? `<button type="button" class="pill" data-ir="${sv.id}">${ico(sv.icono)}<span>${esc(sv.nombre)}</span></button>` : '';
    }).join('');
    servWrap.hidden = false;
    nota.hidden = false;
    nota.querySelector('span').textContent = s.nota;
    const nombres = s.servicios.map(id => SERVICIOS.find(x => x.id === id)?.nombre.toLowerCase()).filter(Boolean);
    const rubroMsg = r.foco ? `de ${r.nombre}` : '';
    cta.href = wa(`Hola JIC! Somos una empresa ${rubroMsg} con ${personas} personas. ${s.msg} Queremos consultar por: ${nombres.join(', ')}.`.replace(/\s+/g, ' '));
    if (animar && !reduceMotion) {
      res.classList.remove('es-nuevo');
      void res.offsetWidth;
      res.classList.add('es-nuevo');
    }
    if (animar && typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  };
  chips.forEach(c => c.addEventListener('click', () => { situacion = c.dataset.situacion; pintar(true); }));
  segs.forEach(b => b.addEventListener('click', () => { personas = b.dataset.personas; pintar(true); }));
  rubroSel?.addEventListener('change', () => pintar(true));
  pills.addEventListener('click', e => {
    const b = e.target.closest('[data-ir]');
    if (!b) return;
    if (abrirServicio) abrirServicio(b.dataset.ir, b);
    else if (elegirServicio) elegirServicio(b.dataset.ir);
  });
  pintar(false);
}

function initFaq() {
  document.querySelectorAll('.faq__item').forEach(d => d.addEventListener('toggle', () => {
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  }));
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

function initForm() {
  const form = document.getElementById('form-contacto');
  if (!form) return;
  const tel = form.querySelector('#f-tel');
  if (tel && typeof IMask !== 'undefined') IMask(tel, { mask: '+{54} 9 000 000-0000' });
  const reglas = {
    nombre: v => v.trim().length >= 2 || 'Contanos tu nombre.',
    telefono: v => v.replace(/\D/g, '').length >= 10 || 'Dejanos un teléfono con código de área.',
    mensaje: v => v.trim().length >= 5 || 'Escribinos qué necesitás, aunque sea en una línea.'
  };
  const validar = campo => {
    const regla = reglas[campo.name];
    if (!regla) return true;
    const r = regla(campo.value);
    const error = form.querySelector(`#${campo.getAttribute('aria-describedby')}`);
    const ok = r === true;
    campo.setAttribute('aria-invalid', String(!ok));
    if (error) error.textContent = ok ? '' : r;
    return ok;
  };
  form.querySelectorAll('input, textarea').forEach(c => c.addEventListener('blur', () => { if (c.value) validar(c); }));
  form.addEventListener('submit', e => {
    e.preventDefault();
    const campos = [...form.querySelectorAll('[name]')].filter(c => reglas[c.name]);
    const malos = campos.filter(c => !validar(c));
    if (malos.length) { malos[0].focus(); return; }
    const btn = form.querySelector('.form__enviar');
    const txt = btn.querySelector('span');
    const original = txt.textContent;
    btn.disabled = true;
    txt.textContent = 'Enviando…';
    setTimeout(() => {
      showToast('¡Gracias! El envío de mensajes se activa al pasar la web a producción.');
      form.reset();
      campos.forEach(c => c.removeAttribute('aria-invalid'));
      btn.disabled = false;
      txt.textContent = original;
    }, 800);
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
  if (img) tl.from(img, { scale: 1.1, duration: 1.8, clearProps: 'transform' }, 0);
  tl.from(hero.querySelectorAll('.regla--hero'), { scaleX: 0, transformOrigin: '0 50%', duration: 1, clearProps: 'transform' }, 0.05)
    .from(hero.querySelectorAll('.hero-eyebrow'), { y: 16, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 32, opacity: 0, duration: 1.1 }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 22, opacity: 0, duration: 1 }, 0.4)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 18, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.55)
    .from(hero.querySelectorAll('.hero-badge'), { y: 14, opacity: 0, duration: 0.8, stagger: 0.08, clearProps: 'transform,opacity' }, 0.7)
    .from(hero.querySelectorAll('.sello'), { scale: 0.92, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.65);
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
  const desktopMq = window.matchMedia('(min-width: 1001px)');
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

initModalServicios();
initTabs();
initGuia();
initFaq();
initForm();
initReveals();
initNav();
initWspFloat();
initModelBarScroll();
initHeroMotion();
initParallax();
