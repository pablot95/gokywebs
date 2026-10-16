document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5491160512531';
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const waLink = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

const CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';

const AREAS = [
  {
    id: 'viales', n: '01', titulo: 'Siniestros viales', foto: 'images/siniestro-vial.webp',
    alt: 'Una persona saca fotos con el celular del raspón en el paragolpes de un auto',
    desc: 'Si te chocaron, el reclamo va contra el seguro del vehículo responsable: por el arreglo del auto, los gastos que tuviste y las lesiones, si las hubo. Reviso lo que tenés y te explico cómo seguir.',
    tener: ['Fotos del choque y de los daños', 'Datos del otro conductor, su patente y su seguro', 'Denuncia del siniestro en tu aseguradora', 'Cédula del auto y registro', 'Certificados médicos, si hubo lesiones'],
    msg: 'Hola, quiero consultar por un siniestro vial.', pasos: true
  },
  {
    id: 'seguros', n: '02', titulo: 'Reclamos a aseguradoras', foto: 'images/seguros.webp',
    alt: 'Fotos de los daños de un auto sobre un escritorio, junto a la carpeta de la póliza',
    desc: 'Rechazos, demoras sin respuesta o una oferta que no cubre el daño. Revisamos la póliza y lo que te contestó la compañía para ver qué se puede reclamar.',
    tener: ['Póliza o número de póliza', 'Número de siniestro', 'Cartas, mails o respuestas de la aseguradora', 'Presupuestos de reparación'],
    msg: 'Hola, quiero consultar por un reclamo a mi aseguradora.'
  },
  {
    id: 'danos', n: '03', titulo: 'Daños y perjuicios', foto: 'images/danos.webp',
    alt: 'Dos personas revisan un escrito sobre un escritorio con una balanza y un martillo de juez',
    desc: 'Accidentes en la vía pública, caídas o daños en tu casa causados por un vecino o un tercero. Cuando alguien te causó un daño, se puede reclamar que lo repare.',
    tener: ['Fotos del lugar y del daño', 'Datos de testigos, si los hubo', 'Presupuestos, facturas o tickets de los gastos', 'Certificados médicos o constancias de atención'],
    msg: 'Hola, quiero consultar por daños y perjuicios.'
  },
  {
    id: 'familia', n: '04', titulo: 'Familia y divorcios', foto: 'images/familia.webp',
    alt: 'Una familia sentada frente a una profesional en una oficina luminosa',
    desc: 'Divorcios de común acuerdo o no, cuota alimentaria, cuidado personal de los hijos y régimen de comunicación. Te explico los pasos con claridad y sin vueltas.',
    tener: ['DNI de las dos partes', 'Acta o libreta de matrimonio', 'Partidas de nacimiento de los hijos', 'Datos de ingresos y gastos del hogar'],
    msg: 'Hola, quiero consultar por un tema de familia.'
  },
  {
    id: 'sucesiones', n: '05', titulo: 'Sucesiones', foto: 'images/sucesiones.webp',
    alt: 'Tres hermanos revisan papeles y fotos familiares sobre una mesa',
    desc: 'Cuando fallece un familiar, la sucesión es el trámite para que los herederos puedan disponer de los bienes. Te guío con los papeles y con el orden de los pasos.',
    tener: ['Partida de defunción', 'Partidas que acrediten el parentesco', 'Escrituras, título del auto o datos de las cuentas', 'Testamento, si existe'],
    msg: 'Hola, quiero consultar por una sucesión.'
  },
  {
    id: 'art', n: '06', titulo: 'Laborales y ART', foto: 'images/art-laboral.webp',
    alt: 'Un trabajador con campera reflectiva revisa un formulario con una asesora',
    desc: 'Si te lastimaste trabajando o en el trayecto, o la ART rechazó tu caso o te dio el alta antes de tiempo, se puede revisar y reclamar.',
    tener: ['Denuncia del accidente ante la ART', 'Recibos de sueldo', 'Estudios y certificados médicos', 'Cartas o notificaciones de la ART'],
    msg: 'Hola, quiero consultar por un accidente de trabajo o la ART.'
  },
  {
    id: 'jubilaciones', n: '07', titulo: 'Jubilaciones', foto: 'images/jubilaciones.webp',
    alt: 'Un hombre mayor revisa una carpeta de documentos junto a una asesora',
    desc: 'Iniciar la jubilación o la pensión, revisar si el haber está bien calculado y reclamar diferencias. Primero vemos tus aportes y qué te corresponde.',
    tener: ['DNI y CUIL', 'Historia laboral o constancias de aportes', 'Recibos de haberes, si ya cobrás', 'Certificados de trabajo'],
    msg: 'Hola, quiero consultar por una jubilación.'
  }
];

const getArea = id => AREAS.find(a => a.id === id);
const tenerHTML = a => a.tener.map(t => `<li>${CHECK}<span>${esc(t)}</span></li>`).join('');

function pintarArea(a, el) {
  if (!a) return;
  if (el.foto) { el.foto.src = a.foto; el.foto.alt = a.alt; }
  if (el.folio) el.folio.textContent = `Área ${a.n}`;
  if (el.titulo) el.titulo.textContent = a.titulo;
  if (el.texto) el.texto.textContent = a.desc;
  if (el.tener) el.tener.innerHTML = tenerHTML(a);
  if (el.wa) el.wa.href = waLink(a.msg);
  if (el.pasos) el.pasos.hidden = !a.pasos;
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

function initModalAreas() {
  const dlg = document.getElementById('areaDialog');
  const botones = document.querySelectorAll('.area__mas[data-area]');
  if (!dlg || !botones.length || typeof dlg.showModal !== 'function') return;
  const el = {
    foto: document.getElementById('modalFoto'),
    folio: document.getElementById('modalFolio'),
    titulo: document.getElementById('modalTitulo'),
    texto: document.getElementById('modalTexto'),
    tener: document.getElementById('modalTener'),
    wa: document.getElementById('modalWa'),
    pasos: document.getElementById('modalPasos')
  };
  let origen = null;
  const limpiar = () => {
    if (!document.body.classList.contains('no-scroll')) return;
    document.body.classList.remove('no-scroll');
    origen?.focus({ preventScroll: true });
  };
  const cerrar = () => { if (dlg.open) dlg.close(); limpiar(); };
  botones.forEach(b => b.addEventListener('click', () => {
    const a = getArea(b.dataset.area);
    if (!a) return;
    origen = b;
    pintarArea(a, el);
    dlg.setAttribute('aria-label', a.titulo);
    document.body.classList.add('no-scroll');
    dlg.showModal();
    dlg.querySelector('.modal-area__caja')?.scrollTo(0, 0);
  }));
  dlg.querySelector('.modal-cerrar')?.addEventListener('click', cerrar);
  el.pasos?.addEventListener('click', () => { origen = null; cerrar(); });
  dlg.addEventListener('click', e => { if (e.target === dlg) cerrar(); });
  dlg.addEventListener('keydown', e => { if (e.key === 'Escape') { e.preventDefault(); cerrar(); } });
  dlg.addEventListener('close', limpiar);
}

function initTabsAreas() {
  const panel = document.getElementById('areaPanel');
  const tabs = [...document.querySelectorAll('.tab[data-area]')];
  if (!panel || !tabs.length) return;
  const lista = tabs[0].parentElement;
  const el = {
    foto: document.getElementById('panelFoto'),
    folio: document.getElementById('panelFolio'),
    titulo: document.getElementById('panelTitulo'),
    texto: document.getElementById('panelTexto'),
    tener: document.getElementById('panelTener'),
    wa: document.getElementById('panelWa'),
    pasos: document.getElementById('panelPasos')
  };
  const mobile = window.matchMedia('(max-width: 999px)');
  const activar = (tab, foco) => {
    const a = getArea(tab.dataset.area);
    if (!a) return;
    tabs.forEach(b => {
      const on = b === tab;
      b.setAttribute('aria-selected', on ? 'true' : 'false');
      b.tabIndex = on ? 0 : -1;
    });
    panel.setAttribute('aria-labelledby', tab.id);
    pintarArea(a, el);
    panel.classList.remove('is-cambiando');
    void panel.offsetWidth;
    panel.classList.add('is-cambiando');
    if (foco) tab.focus({ preventScroll: true });
    if (mobile.matches && lista) lista.scrollTo({ left: Math.max(0, tab.offsetLeft - 16), behavior: reduceMotion ? 'auto' : 'smooth' });
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  };
  tabs.forEach((b, i) => {
    b.addEventListener('click', () => activar(b));
    b.addEventListener('keydown', e => {
      let j = null;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') j = (i + 1) % tabs.length;
      else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') j = (i - 1 + tabs.length) % tabs.length;
      else if (e.key === 'Home') j = 0;
      else if (e.key === 'End') j = tabs.length - 1;
      if (j !== null) { e.preventDefault(); activar(tabs[j], true); }
    });
  });
  document.querySelectorAll('[data-ir-area]').forEach(chip => chip.addEventListener('click', e => {
    const tab = tabs.find(t => t.dataset.area === chip.dataset.irArea);
    const destino = document.getElementById('areas');
    if (!tab || !destino) return;
    e.preventDefault();
    activar(tab);
    destino.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  }));
}

function initForm() {
  const form = document.getElementById('formConsulta');
  if (!form) return;
  const { nombre, telefono, mensaje } = form.elements;
  const boton = form.querySelector('button[type="submit"]');
  const marcar = (campo, msg) => {
    const err = document.getElementById(`${campo.id}Error`);
    campo.setAttribute('aria-invalid', msg ? 'true' : 'false');
    if (err) { err.textContent = msg; err.hidden = !msg; }
    return !msg;
  };
  const reglas = [
    [nombre, () => (nombre.value.trim().length < 2 ? 'Decime tu nombre así sé a quién le respondo.' : '')],
    [telefono, () => { const d = telefono.value.replace(/\D/g, '').length; return d < 8 || d > 13 ? 'Revisá el número: con el código de área, sin 0 ni 15.' : ''; }],
    [mensaje, () => (mensaje.value.trim().length < 10 ? 'Contame en una o dos líneas qué pasó.' : '')]
  ];
  reglas.forEach(([campo, regla]) => campo.addEventListener('input', () => {
    if (campo.getAttribute('aria-invalid') === 'true') marcar(campo, regla());
  }));
  form.addEventListener('submit', e => {
    e.preventDefault();
    const ok = reglas.map(([campo, regla]) => marcar(campo, regla())).every(Boolean);
    if (!ok) { form.querySelector('[aria-invalid="true"]')?.focus(); return; }
    const texto = boton.textContent;
    boton.disabled = true;
    boton.textContent = 'Enviando…';
    setTimeout(() => {
      boton.disabled = false;
      boton.textContent = texto;
      form.reset();
      reglas.forEach(([campo]) => campo.removeAttribute('aria-invalid'));
      showToast('¡Gracias! El envío de mensajes se activa al pasar la web a producción.');
    }, 800);
  });
}

function initMapa() {
  const el = document.getElementById('mapa');
  if (!el || typeof L === 'undefined') return;
  const POS = [-34.6066554, -58.3850335];
  let listo = false;
  const crear = () => {
    if (listo) return;
    listo = true;
    const mapa = L.map(el, { center: POS, zoom: 16, scrollWheelZoom: false, zoomControl: false, dragging: !L.Browser.mobile, tap: false });
    L.control.zoom({ position: 'topright' }).addTo(mapa);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap', maxZoom: 19 }).addTo(mapa);
    const icono = L.divIcon({ className: 'mapa-icono', html: '<span class="pin"><span>RS</span></span>', iconSize: [44, 44], iconAnchor: [22, 52], popupAnchor: [0, -50] });
    L.marker(POS, { icon: icono, keyboard: false, title: 'Reclamos de Siniestros' })
      .addTo(mapa)
      .bindPopup('<b>Reclamos de Siniestros</b><br>Talcahuano 178, 8º D, CABA');
    const ajustar = () => {
      mapa.invalidateSize();
      mapa.setView(POS, 16, { animate: false });
      if (el.closest('.mapa-banda') && window.matchMedia('(min-width: 761px)').matches) mapa.panBy([-Math.min(240, el.clientWidth * 0.16), 0], { animate: false });
    };
    ajustar();
    setTimeout(ajustar, 400);
  };
  if (!('IntersectionObserver' in window)) { crear(); return; }
  const io = new IntersectionObserver(entries => {
    if (entries.some(en => en.isIntersecting)) { io.disconnect(); crear(); }
  }, { rootMargin: '400px 0px' });
  io.observe(el);
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

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const paso = (sel, vars, t) => {
    const els = hero.querySelectorAll(sel);
    if (els.length) tl.from(els, vars, t);
  };
  paso('[data-hero-img]', { scale: 1.08, duration: 1.8, clearProps: 'transform' }, 0);
  paso('.hero__regla', { scaleY: 0, duration: 1.2, clearProps: 'transform' }, 0.05);
  paso('h1', { y: 32, opacity: 0, filter: 'blur(8px)', duration: 1.2, clearProps: 'filter' }, 0.2);
  paso('.hero-lead', { y: 22, opacity: 0, duration: 1 }, 0.42);
  paso('.hero-ctas .btn', { y: 20, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.58);
  paso('.hero__dato', { y: 14, opacity: 0, duration: 0.8, clearProps: 'transform,opacity' }, 0.72);
  paso('.situaciones__titulo, .situaciones li', { y: 14, opacity: 0, duration: 0.8, stagger: 0.05, clearProps: 'transform,opacity' }, 0.7);
  paso('.hero__sello', { y: 16, opacity: 0, duration: 1, clearProps: 'transform,opacity' }, 0.8);
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('[data-parallax]').forEach(fig => {
    const img = fig.querySelector('img');
    if (!img) return;
    gsap.fromTo(img, { yPercent: -3 }, { yPercent: 3, ease: 'none', scrollTrigger: { trigger: fig, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
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
      trigger: el, start: 'top 82%', end: 'bottom 50%', scrub: 0.4, invalidateOnRefresh: true,
      onUpdate: self => {
        const hasta = self.progress * ws.length;
        ws.forEach((w, i) => w.classList.toggle('on', i < hasta));
      }
    });
  });
}

function initDetalles() {
  document.querySelectorAll('.faq-lista details').forEach(d => d.addEventListener('toggle', () => {
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  }));
}

[initModalAreas, initTabsAreas, initForm, initReveals, initNav, initWspFloat, initModelBarScroll, initHeroMotion, initParallax, initLeeScroll, initDetalles, initMapa]
  .forEach(fn => { try { fn(); } catch (e) { console.error(e); } });
