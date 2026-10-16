document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5491164226441';
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const waLink = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

const SERVICIOS = {
  cuidadoras: {
    etiqueta: 'Todas las edades y patologías',
    titulo: 'Cuidadoras domiciliarias 24 h',
    texto: 'Acompañamiento en casa de día, de noche o las 24 horas, adaptado a la rutina de cada persona.',
    puntos: ['Higiene, confort y cambio de ropa', 'Ayuda con las comidas y la hidratación', 'Movilidad dentro de la casa y acompañamiento en salidas', 'Recordatorio de la medicación indicada', 'Compañía, conversación y rutinas del día'],
    img: 'images/acompanamiento.webp',
    alt: 'Cuidadora con ambo celeste ayudando a un hombre con su medicación en el living',
    consulta: 'Hola Cuidar+, quiero consultar por el servicio de cuidadoras domiciliarias.'
  },
  enfermeria: {
    etiqueta: 'Personal matriculado',
    titulo: 'Enfermería domiciliaria',
    texto: 'Controles y procedimientos de salud en el domicilio, siguiendo las indicaciones del médico.',
    puntos: ['Control de signos vitales: presión, temperatura y saturación', 'Aplicación de inyectables y medicación indicada', 'Curaciones y cuidado de heridas', 'Control de glucemia', 'Seguimiento después de una internación o cirugía'],
    img: 'images/control-salud.webp',
    alt: 'Enfermera con estetoscopio midiendo la saturación de una señora mayor',
    consulta: 'Hola Cuidar+, quiero consultar por enfermería domiciliaria.'
  },
  eventos: {
    etiqueta: 'Sociales, deportivos y culturales',
    titulo: 'Cobertura de eventos',
    texto: 'Personal de salud en tu evento para asistir a quien lo necesite, de principio a fin.',
    puntos: ['Eventos deportivos: carreras, torneos y encuentros', 'Eventos sociales y culturales: fiestas, recitales y ferias', 'Primeros auxilios y atención de lesiones menores', 'Presencia durante todo el evento', 'Coordinación con el servicio de emergencias si hace falta'],
    img: 'images/eventos.webp',
    alt: 'Enfermera vendando la rodilla de una corredora en un evento deportivo',
    consulta: 'Hola Cuidar+, quiero consultar por la cobertura de un evento.'
  }
};

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

function initModalServicios() {
  const dlg = document.getElementById('servicioDialog');
  const botones = document.querySelectorAll('.serv-card__mas[data-servicio]');
  if (!dlg || !botones.length || typeof dlg.showModal !== 'function') return;
  const img = document.getElementById('modalImg');
  const etiqueta = document.getElementById('modalEtiqueta');
  const titulo = document.getElementById('modalTitulo');
  const texto = document.getElementById('modalTexto');
  const puntos = document.getElementById('modalPuntos');
  const wa = document.getElementById('modalWa');
  let origen = null;
  const abrir = id => {
    const s = SERVICIOS[id];
    if (!s) return;
    if (img) { img.src = s.img; img.alt = s.alt; }
    if (etiqueta) etiqueta.textContent = s.etiqueta;
    if (titulo) titulo.textContent = s.titulo;
    if (texto) texto.textContent = s.texto;
    if (puntos) puntos.innerHTML = s.puntos.map(p => `<li>${esc(p)}</li>`).join('');
    if (wa) wa.href = waLink(s.consulta);
    dlg.setAttribute('aria-label', s.titulo);
    document.body.classList.add('no-scroll');
    dlg.showModal();
    dlg.querySelector('.modal__caja')?.scrollTo(0, 0);
  };
  const limpiar = () => {
    if (!document.body.classList.contains('no-scroll')) return;
    document.body.classList.remove('no-scroll');
    origen?.focus();
  };
  const cerrar = () => { if (dlg.open) dlg.close(); limpiar(); };
  botones.forEach(b => b.addEventListener('click', () => { origen = b; abrir(b.dataset.servicio); }));
  dlg.querySelector('.modal-cerrar')?.addEventListener('click', cerrar);
  dlg.addEventListener('click', e => { if (e.target === dlg) cerrar(); });
  dlg.addEventListener('keydown', e => { if (e.key === 'Escape') { e.preventDefault(); cerrar(); } });
  dlg.addEventListener('close', limpiar);
}

function initTabs() {
  const tabs = [...document.querySelectorAll('.tab[data-servicio]')];
  if (!tabs.length) return;
  const lista = tabs[0].parentElement;
  const mobile = window.matchMedia('(max-width: 760px)');
  const activar = (tab, foco) => {
    tabs.forEach(b => {
      const on = b === tab;
      b.setAttribute('aria-selected', on ? 'true' : 'false');
      b.tabIndex = on ? 0 : -1;
      const panel = document.getElementById(b.getAttribute('aria-controls'));
      if (!panel) return;
      panel.hidden = !on;
      if (on) {
        panel.classList.remove('is-cambiando');
        void panel.offsetWidth;
        panel.classList.add('is-cambiando');
      }
    });
    if (foco) tab.focus({ preventScroll: true });
    if (mobile.matches && lista) lista.scrollTo({ left: Math.max(0, tab.offsetLeft - 16), behavior: reduceMotion ? 'auto' : 'smooth' });
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  };
  tabs.forEach((b, i) => {
    b.addEventListener('click', () => activar(b));
    b.addEventListener('keydown', e => {
      let j = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') j = (i + 1) % tabs.length;
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') j = (i - 1 + tabs.length) % tabs.length;
      else if (e.key === 'Home') j = 0;
      else if (e.key === 'End') j = tabs.length - 1;
      if (j !== null) { e.preventDefault(); activar(tabs[j], true); }
    });
  });
  document.querySelectorAll('[data-ir-servicio]').forEach(a => a.addEventListener('click', () => {
    const tab = tabs.find(t => t.dataset.servicio === a.dataset.irServicio);
    if (tab) activar(tab);
  }));
}

function initForm() {
  const form = document.getElementById('consultaForm');
  if (!form) return;
  const nombre = form.querySelector('#cNombre');
  const servicio = form.querySelector('#cServicio');
  const horario = form.querySelector('#cHorario');
  const zona = form.querySelector('#cZona');
  const detalle = form.querySelector('#cDetalle');
  if (!nombre || !servicio) return;
  const marcar = (campo, idError, mal) => {
    campo.setAttribute('aria-invalid', mal ? 'true' : 'false');
    const error = document.getElementById(idError);
    if (error) error.hidden = !mal;
  };
  const okNombre = () => nombre.value.trim().length >= 2;
  const okServicio = () => Boolean(servicio.value);
  nombre.addEventListener('input', () => { if (nombre.getAttribute('aria-invalid') === 'true') marcar(nombre, 'eNombre', !okNombre()); });
  servicio.addEventListener('change', () => { if (servicio.getAttribute('aria-invalid') === 'true') marcar(servicio, 'eServicio', !okServicio()); });
  form.addEventListener('submit', e => {
    e.preventDefault();
    const n = okNombre();
    const s = okServicio();
    marcar(nombre, 'eNombre', !n);
    marcar(servicio, 'eServicio', !s);
    if (!n || !s) {
      (n ? servicio : nombre).focus();
      showToast('Revisá los campos marcados y probá de nuevo.');
      return;
    }
    const lineas = [`Hola Cuidar+, soy ${nombre.value.trim()}.`, `Quiero consultar por: ${servicio.value}.`];
    if (horario?.value) lineas.push(`Horario o fecha: ${horario.value}.`);
    if (zona?.value.trim()) lineas.push(`Zona: ${zona.value.trim()}.`);
    if (detalle?.value.trim()) lineas.push(detalle.value.trim());
    window.open(waLink(lineas.join('\n')), '_blank', 'noopener');
    showToast('Listo: abrimos WhatsApp con tu consulta para que la envíes.');
    form.reset();
    marcar(nombre, 'eNombre', false);
    marcar(servicio, 'eServicio', false);
  });
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
  const desktopMq = window.matchMedia('(min-width: 1100px)');
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
  paso('.hero-eyebrow', { y: 16, opacity: 0, duration: 0.9 }, 0.1);
  paso('h1', { y: 32, opacity: 0, filter: 'blur(8px)', duration: 1.2, clearProps: 'filter' }, 0.2);
  paso('.hero-lead', { y: 22, opacity: 0, duration: 1 }, 0.42);
  paso('.hero-ctas .btn', { y: 20, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.58);
  paso('.hero-badges li', { y: 14, opacity: 0, duration: 0.8, stagger: 0.08, clearProps: 'transform,opacity' }, 0.75);
  paso('.nota-marca, .ficha', { y: 24, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.7);
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
      trigger: el, start: 'top 82%', end: 'bottom 55%', scrub: 0.4, invalidateOnRefresh: true,
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

initModalServicios();
initTabs();
initForm();
initReveals();
initNav();
initWspFloat();
initModelBarScroll();
initHeroMotion();
initParallax();
initLeeScroll();
initDetalles();
