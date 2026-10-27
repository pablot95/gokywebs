const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const WSP = '5491127670369';
const wa = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;

const ICONO_WSP = '<svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>';

const AREAS = [
  {
    id: 'societario', folio: '01', nombre: 'Derecho societario', foto: 'societario',
    alt: 'Carpetas y un contrato con lapicera sobre la mesa de reuniones',
    resumen: 'Constitución de sociedades, estatutos, actas y acuerdos entre socios para que tu empresa funcione en regla.',
    hacemos: ['Constitución de SAS, SRL y SA', 'Redacción y reforma de estatutos', 'Actas de asamblea y de directorio', 'Acuerdos de socios y cesión de cuotas o acciones', 'Asesoramiento en las decisiones del día a día de la empresa'],
    tener: ['DNI y CUIT o CUIL de cada socio', 'El nombre que te gustaría para la sociedad', 'La actividad que va a desarrollar', 'Estatuto y actas vigentes, si la sociedad ya existe'],
    msg: 'Hola, quiero hacer una consulta sobre derecho societario.'
  },
  {
    id: 'danos', folio: '02', nombre: 'Daños y perjuicios', foto: 'danos',
    alt: 'Balanza de la justicia en una biblioteca de libros de derecho',
    resumen: 'Reclamos por accidentes, daños a tu propiedad o perjuicios causados por terceros, desde la carta documento hasta el juicio.',
    hacemos: ['Análisis del caso y de quién debe responder', 'Cartas documento e intimaciones', 'Reclamo ante la aseguradora', 'Mediación previa al juicio', 'Demanda y seguimiento del expediente'],
    tener: ['Fecha y lugar de lo que pasó', 'Fotos, videos o mensajes que lo muestren', 'Denuncia policial o ante el seguro, si la hiciste', 'Datos de testigos', 'Certificados médicos y comprobantes de gastos'],
    msg: 'Hola, quiero hacer una consulta por daños y perjuicios.'
  },
  {
    id: 'sucesiones', folio: '03', nombre: 'Sucesiones', foto: 'sucesiones',
    alt: 'Llave antigua y lapicera sobre una carpeta de papeles',
    resumen: 'Iniciamos y terminamos la sucesión para que los bienes queden a nombre de los herederos.',
    hacemos: ['Inicio de la sucesión, con o sin testamento', 'Declaratoria de herederos', 'Inventario y partición de bienes', 'Inscripción de inmuebles y vehículos a nombre de los herederos', 'Venta de bienes heredados'],
    tener: ['Partida de defunción', 'Partidas que acrediten el vínculo (nacimiento, matrimonio)', 'Último domicilio de la persona', 'Escrituras o títulos de los bienes', 'Testamento, si lo hubiera'],
    msg: 'Hola, quiero hacer una consulta sobre una sucesión.'
  },
  {
    id: 'divorcios', folio: '04', nombre: 'Divorcios', foto: 'divorcios',
    alt: 'Sala de reuniones con mesa, anotadores y vasos de agua',
    resumen: 'Divorcio de común acuerdo o unilateral, con el convenio que ordena lo que viene después.',
    hacemos: ['Divorcio de común acuerdo o a pedido de una de las partes', 'Propuesta y convenio regulador', 'Acuerdos sobre el cuidado de los hijos y la cuota alimentaria', 'División de los bienes en común', 'Uso de la vivienda familiar'],
    tener: ['Acta de matrimonio', 'Partidas de nacimiento de los hijos', 'Último domicilio en común', 'Listado de bienes y deudas en común', 'Lo que ya hayan acordado entre ustedes'],
    msg: 'Hola, quiero hacer una consulta sobre un divorcio.'
  },
  {
    id: 'marcas', folio: '05', nombre: 'Registro de marcas', foto: 'marcas',
    alt: 'Caja de producto con etiqueta en blanco junto a una notebook y un cuaderno',
    resumen: 'Búsqueda de antecedentes y registro de tu marca ante el INPI, para proteger su uso exclusivo.',
    hacemos: ['Búsqueda de antecedentes antes de elegir el nombre', 'Elección de las clases que corresponden', 'Presentación de la solicitud ante el INPI', 'Seguimiento y respuesta a observaciones u oposiciones', 'Renovación y vigilancia de la marca'],
    tener: ['El nombre de la marca y el logo, si ya lo tenés', 'Los productos o servicios que vas a ofrecer con ella', 'Datos del titular: persona o empresa'],
    msg: 'Hola, quiero hacer una consulta sobre el registro de una marca.'
  }
];
const areaPorId = id => AREAS.find(a => a.id === id);

const HORARIO = { 1: [9, 18], 2: [9, 18], 3: [9, 18], 4: [9, 18], 5: [9, 18] };
const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

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

function fichaHTML(a, idTitulo) {
  const lista = (items, extra) => `<ul class="ficha__lista${extra}">${items.map(t => `<li>${esc(t)}</li>`).join('')}</ul>`;
  return `<div class="ficha">
    <span class="folio">Área ${esc(a.folio)}</span>
    <h3 class="ficha__titulo" id="${idTitulo}">${esc(a.nombre)}</h3>
    <p class="ficha__resumen">${esc(a.resumen)}</p>
    <div class="ficha__bloque"><h4>Qué hacemos</h4>${lista(a.hacemos, '')}</div>
    <div class="ficha__bloque"><h4>Qué conviene tener a mano</h4>${lista(a.tener, ' ficha__lista--check')}</div>
    <a class="btn btn--primario" href="${esc(wa(a.msg))}" target="_blank" rel="noopener">${ICONO_WSP}Consultar por WhatsApp</a>
  </div>`;
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
    if (desktopMq.matches) nav.removeAttribute('inert');
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

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const img = hero.querySelector('[data-hero-img]');
  if (img) tl.from(img, { scale: 1.1, duration: 1.8, clearProps: 'transform' }, 0);
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 36, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 24, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 20, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.sello, .hero-badge'), { scale: 0.92, opacity: 0, duration: 1.1, stagger: 0.1, clearProps: 'transform,opacity' }, 0.65)
    .from(hero.querySelectorAll('.hero-indice__titulo, .hero-indice li'), { y: 18, opacity: 0, duration: 0.9, stagger: 0.07, clearProps: 'transform,opacity' }, 0.55);
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
      },
    });
  });
}

function initAreaModal() {
  const modal = document.getElementById('areaModal');
  if (!modal) return;
  const panel = modal.querySelector('.modal__panel');
  const cuerpo = document.getElementById('areaModalCuerpo');
  const foto = modal.querySelector('.modal__foto img');
  let disparador = null;
  let timer = 0;
  const enfocables = () => [...panel.querySelectorAll('a[href], button:not([disabled])')].filter(el => el.offsetParent);
  const cerrar = () => {
    modal.classList.remove('abierto');
    document.body.classList.remove('no-scroll');
    clearTimeout(timer);
    timer = setTimeout(() => { modal.hidden = true; }, reduceMotion ? 0 : 320);
    disparador?.focus();
  };
  const abrir = (a, btn) => {
    disparador = btn;
    cuerpo.innerHTML = fichaHTML(a, 'areaModalTitulo');
    panel.setAttribute('aria-label', a.nombre);
    foto.src = `images/${a.foto}-640.webp`;
    foto.srcset = `images/${a.foto}-640.webp 640w, images/${a.foto}.webp 1254w`;
    foto.sizes = '(max-width: 720px) 100vw, 380px';
    foto.alt = a.alt;
    clearTimeout(timer);
    modal.hidden = false;
    document.body.classList.add('no-scroll');
    requestAnimationFrame(() => requestAnimationFrame(() => modal.classList.add('abierto')));
    panel.scrollTop = 0;
    modal.querySelector('.modal__cerrar').focus();
  };
  document.querySelectorAll('[data-area]').forEach(btn => {
    btn.addEventListener('click', () => { const a = areaPorId(btn.dataset.area); if (a) abrir(a, btn); });
  });
  modal.querySelectorAll('[data-cerrar]').forEach(el => el.addEventListener('click', cerrar));
  document.addEventListener('keydown', e => {
    if (modal.hidden) return;
    if (e.key === 'Escape') { e.preventDefault(); cerrar(); return; }
    if (e.key !== 'Tab') return;
    const f = enfocables();
    if (!f.length) return;
    const primero = f[0];
    const ultimo = f[f.length - 1];
    if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
    else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
  });
}

function initTabs() {
  const tabs = document.querySelector('.tabs');
  if (!tabs) return;
  const botones = [...tabs.querySelectorAll('[role="tab"]')];
  const panel = document.getElementById('areaPanel');
  if (!panel || !botones.length) return;
  const pintar = a => `<div class="tabs__foto foto-card"><img src="images/${a.foto}-640.webp" srcset="images/${a.foto}-640.webp 640w, images/${a.foto}.webp 1254w" sizes="(max-width: 900px) 100vw, 360px" width="640" height="640" alt="${esc(a.alt)}"></div>${fichaHTML(a, 'panel-' + a.id)}`;
  let actual = '';
  let timer = 0;
  const activar = (id, foco) => {
    const a = areaPorId(id);
    if (!a || id === actual) { if (foco) botones.find(b => b.dataset.tab === id)?.focus(); return; }
    const primera = !actual;
    actual = id;
    botones.forEach(b => {
      const sel = b.dataset.tab === id;
      b.setAttribute('aria-selected', sel ? 'true' : 'false');
      b.tabIndex = sel ? 0 : -1;
      if (sel && foco) b.focus();
    });
    panel.setAttribute('aria-labelledby', `tab-${id}`);
    if (primera || reduceMotion) { panel.innerHTML = pintar(a); refrescar(); return; }
    clearTimeout(timer);
    panel.classList.add('cambiando');
    timer = setTimeout(() => {
      panel.innerHTML = pintar(a);
      panel.classList.remove('cambiando');
      refrescar();
    }, 220);
  };
  botones.forEach((b, i) => {
    b.addEventListener('click', () => activar(b.dataset.tab));
    b.addEventListener('keydown', e => {
      const paso = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
      if (e.key === 'Home' || e.key === 'End') { e.preventDefault(); activar(botones[e.key === 'Home' ? 0 : botones.length - 1].dataset.tab, true); return; }
      if (!paso) return;
      e.preventDefault();
      activar(botones[(i + paso + botones.length) % botones.length].dataset.tab, true);
    });
  });
  document.querySelectorAll('[data-ir-area]').forEach(a => a.addEventListener('click', () => activar(a.dataset.irArea)));
  const deHash = location.hash.slice(1);
  activar(areaPorId(deHash) ? deHash : botones[0].dataset.tab);
  if (areaPorId(deHash)) requestAnimationFrame(() => document.getElementById('areas')?.scrollIntoView());
}

function ahoraBA() {
  try {
    const partes = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Argentina/Buenos_Aires', weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' }).formatToParts(new Date());
    const parte = t => partes.find(p => p.type === t)?.value;
    const dia = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(parte('weekday'));
    if (dia < 0) throw new Error('dia');
    return { dia, min: (Number(parte('hour')) % 24) * 60 + Number(parte('minute')) };
  } catch {
    const d = new Date();
    return { dia: d.getDay(), min: d.getHours() * 60 + d.getMinutes() };
  }
}

function estadoHorario({ dia, min }) {
  const hoy = HORARIO[dia];
  if (hoy && min >= hoy[0] * 60 && min < hoy[1] * 60) return { abierto: true, texto: `Abierto ahora · hasta las ${hoy[1]} h` };
  if (hoy && min < hoy[0] * 60) return { abierto: false, texto: `Cerrado ahora · abrimos hoy a las ${hoy[0]} h` };
  for (let k = 1; k <= 7; k++) {
    const d = (dia + k) % 7;
    if (HORARIO[d]) return { abierto: false, texto: `Cerrado ahora · abrimos ${k === 1 ? 'mañana' : 'el ' + DIAS[d]} a las ${HORARIO[d][0]} h` };
  }
  return { abierto: false, texto: 'Lunes a viernes de 9 a 18 h' };
}

function initHorarios() {
  const estados = document.querySelectorAll('[data-estado]');
  const dias = document.querySelectorAll('.horarios__dia');
  if (!estados.length && !dias.length) return;
  const pintar = () => {
    const ahora = ahoraBA();
    const e = estadoHorario(ahora);
    estados.forEach(el => {
      el.classList.toggle('abierto', e.abierto);
      el.classList.toggle('cerrado', !e.abierto);
      const t = el.querySelector('[data-estado-texto]');
      if (t) t.textContent = e.texto;
    });
    dias.forEach(li => {
      const esHoy = Number(li.dataset.dia) === ahora.dia;
      li.classList.toggle('hoy', esHoy);
      let tag = li.querySelector('.horarios__hoy');
      if (esHoy && !tag) {
        tag = document.createElement('span');
        tag.className = 'horarios__hoy';
        tag.textContent = 'Hoy';
        li.firstElementChild.appendChild(tag);
      } else if (!esHoy && tag) tag.remove();
    });
  };
  pintar();
  window.setInterval(pintar, 60000);
}

function initForm() {
  document.querySelectorAll('.consulta-form').forEach(form => {
    const campos = { area: form.elements.area, nombre: form.elements.nombre, mensaje: form.elements.mensaje };
    if (!campos.area || !campos.nombre || !campos.mensaje) return;
    const reglas = {
      area: v => (v ? '' : 'Elegí el área de tu consulta.'),
      nombre: v => (v.trim().length >= 2 ? '' : 'Escribí tu nombre.'),
      mensaje: v => (v.trim().length >= 10 ? '' : 'Contanos un poco más: con una o dos frases alcanza.')
    };
    const marcar = k => {
      const el = campos[k];
      const msg = reglas[k](el.value);
      const err = document.getElementById(el.getAttribute('aria-describedby'));
      el.setAttribute('aria-invalid', msg ? 'true' : 'false');
      if (err) { err.textContent = msg; err.hidden = !msg; }
      return !msg;
    };
    Object.keys(campos).forEach(k => {
      campos[k].addEventListener('blur', () => { if (campos[k].value) marcar(k); });
      campos[k].addEventListener(k === 'area' ? 'change' : 'input', () => { if (campos[k].getAttribute('aria-invalid') === 'true') marcar(k); });
    });
    form.addEventListener('submit', e => {
      e.preventDefault();
      const ok = Object.keys(campos).map(marcar).every(Boolean);
      if (!ok) {
        form.querySelector('[aria-invalid="true"]')?.focus();
        showToast('Revisá los campos marcados y volvé a intentar.');
        return;
      }
      const texto = `Hola, soy ${campos.nombre.value.trim()}. Quiero hacer una consulta sobre ${campos.area.value.toLowerCase()}: ${campos.mensaje.value.trim()}`;
      window.open(wa(texto), '_blank', 'noopener');
      const btn = form.querySelector('[type="submit"]');
      btn.disabled = true;
      showToast('Te abrimos WhatsApp con tu consulta escrita.');
      setTimeout(() => {
        btn.disabled = false;
        form.reset();
        Object.values(campos).forEach(el => el.removeAttribute('aria-invalid'));
      }, 800);
    });
  });
}

function initFaq() {
  document.querySelectorAll('.faq-item').forEach(d => d.addEventListener('toggle', refrescar));
}

initTabs();
initAreaModal();
initReveals();
initNav();
initWspFloat();
initModelBarScroll();
initHeroMotion();
initLeeScroll();
initHorarios();
initForm();
initFaq();
