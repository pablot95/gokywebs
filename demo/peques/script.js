const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WA = '5492954375420';

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = (e.key || '').toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
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

function initWspFloat() {
  const btn = document.getElementById('wsp-float');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) btn.classList.add('visible'); else btn.classList.remove('visible');
  }, { passive: true });
}

function trapFocus(cont, e) {
  if (e.key !== 'Tab') return;
  const f = [...cont.querySelectorAll('a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])')].filter(el => el.getClientRects().length);
  if (!f.length) return;
  const first = f[0];
  const last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

function crearCapa(capa) {
  let origen = null;
  let timer = 0;
  const onKey = e => {
    if (e.key === 'Escape') cerrar();
    else trapFocus(capa, e);
  };
  function cerrar() {
    capa.classList.remove('open');
    document.body.classList.remove('no-scroll');
    document.removeEventListener('keydown', onKey);
    clearTimeout(timer);
    timer = setTimeout(() => { capa.hidden = true; }, reduceMotion ? 0 : 300);
    origen?.focus();
  }
  const abrir = desde => {
    origen = desde || document.activeElement;
    clearTimeout(timer);
    capa.hidden = false;
    void capa.offsetWidth;
    capa.classList.add('open');
    document.body.classList.add('no-scroll');
    document.addEventListener('keydown', onKey);
    capa.querySelector('[data-cerrar]')?.focus();
  };
  capa.addEventListener('click', e => {
    if (e.target === capa || e.target.closest('[data-cerrar]')) cerrar();
  });
  return { abrir, cerrar };
}

function initServicios() {
  const modal = document.getElementById('srv-modal');
  const body = document.getElementById('srv-modal-body');
  if (!modal || !body) return;
  const capa = crearCapa(modal);
  const panel = modal.querySelector('.srv-modal-panel');
  document.querySelectorAll('.srv-card[data-srv]').forEach(btn => btn.addEventListener('click', () => {
    const tpl = document.getElementById(`tpl-${btn.dataset.srv}`);
    if (!tpl) return;
    body.replaceChildren(tpl.content.cloneNode(true));
    modal.setAttribute('aria-label', btn.querySelector('.srv-tit')?.textContent.trim() || 'Detalle del servicio');
    if (panel) panel.scrollTop = 0;
    capa.abrir(btn);
  }));
}

function initTabs() {
  const list = document.querySelector('.srv-tabs[role="tablist"]');
  if (!list) return;
  const tabs = [...list.querySelectorAll('[role="tab"]')];
  const activar = (tab, foco) => {
    tabs.forEach(t => {
      const on = t === tab;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      const p = document.getElementById(t.getAttribute('aria-controls'));
      if (p) p.hidden = !on;
    });
    if (foco) tab.focus();
    const wrap = list.parentElement;
    if (wrap && wrap.scrollWidth > wrap.clientWidth) {
      wrap.scrollTo({ left: tab.offsetLeft - (wrap.clientWidth - tab.offsetWidth) / 2, behavior: reduceMotion ? 'auto' : 'smooth' });
    }
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => activar(t));
    t.addEventListener('keydown', e => {
      let j = null;
      if (e.key === 'ArrowRight') j = (i + 1) % tabs.length;
      else if (e.key === 'ArrowLeft') j = (i - 1 + tabs.length) % tabs.length;
      else if (e.key === 'Home') j = 0;
      else if (e.key === 'End') j = tabs.length - 1;
      if (j !== null) { e.preventDefault(); activar(tabs[j], true); }
    });
  });
}

function initVisor() {
  const visor = document.getElementById('visor');
  const btns = [...document.querySelectorAll('[data-visor]')];
  if (!visor || !btns.length) return;
  const img = document.getElementById('visor-img');
  const cap = document.getElementById('visor-cap');
  const capa = crearCapa(visor);
  let i = 0;
  const mostrar = n => {
    i = (n + btns.length) % btns.length;
    const b = btns[i];
    img.src = b.dataset.visor;
    img.alt = b.querySelector('img')?.alt || '';
    cap.textContent = `${b.dataset.cap} · ${i + 1} de ${btns.length}`;
  };
  btns.forEach((b, n) => b.addEventListener('click', () => { mostrar(n); capa.abrir(b); }));
  visor.querySelector('.visor-prev')?.addEventListener('click', () => mostrar(i - 1));
  visor.querySelector('.visor-next')?.addEventListener('click', () => mostrar(i + 1));
  visor.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') mostrar(i - 1);
    else if (e.key === 'ArrowRight') mostrar(i + 1);
  });
  let x0 = null;
  visor.addEventListener('pointerdown', e => { x0 = e.clientX; });
  visor.addEventListener('pointerup', e => {
    if (x0 === null) return;
    const dx = e.clientX - x0;
    x0 = null;
    if (Math.abs(dx) > 50) mostrar(i + (dx < 0 ? 1 : -1));
  });
}

const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const ESTACIONES = ['Verano', 'Otoño', 'Invierno', 'Primavera'];
const TITULARES = [
  'Temporada de pileta y césped.',
  'Temporada de hojas: el jardín se prepara para el frío.',
  'Temporada de poda, con las plantas en reposo.',
  'El jardín arranca: momento de ponerlo a punto.'
];
const FRASES = {
  poda: ['Recorte de cercos y arbustos para mantener la forma.', 'Arranca la poda de árboles y la limpieza de ramas secas.', 'Poda de árboles y frutales con la planta en reposo.', 'Despunte de cercos cuando arranca el crecimiento.'],
  cesped: ['Corte cada 7 a 10 días y bordes prolijos.', 'Cortes más espaciados, un poco más altos.', 'Primer corte y limpieza del pasto seco.', 'Vuelve el crecimiento fuerte: corte semanal o quincenal.'],
  recoleccion: ['Retiro de pasto cortado y restos del jardín.', 'Hojas secas: la época de más recolección.', 'Retiro de ramas y restos de poda.', 'Limpieza general para dejar el jardín listo.'],
  piletas: ['Limpieza, aspirado y control del agua.', 'Invernada: agua tratada y pileta cubierta.', 'Revisión antes de la temporada.', 'Puesta a punto: limpieza a fondo y agua lista.'],
  plagas: ['Control de hormigas, pulgones y cochinillas.', 'Último control antes del frío.', 'Tratamiento de invierno en árboles y frutales.', 'Prevención: arranca la temporada de hormigas y pulgones.']
};

function unir(arr) {
  if (arr.length < 2) return arr[0] || '';
  return `${arr.slice(0, -1).join(', ')} y ${arr[arr.length - 1]}`;
}

function initCalendario() {
  const cal = document.getElementById('cal');
  if (!cal) return;
  const filas = [...cal.querySelectorAll('.cal-fila')].map(f => ({
    key: f.dataset.srv,
    nombre: f.querySelector('.cal-lab')?.textContent.trim() || '',
    vals: [...f.querySelectorAll('.cal-c')].map(c => Number(c.dataset.i))
  }));
  const btns = [...cal.querySelectorAll('.cal-mes-btn')];
  const celdas = [...cal.querySelectorAll('.cal-barra .cal-c')];
  const elMes = document.getElementById('cal-mes-nombre');
  const elEst = document.getElementById('cal-estacion');
  const elHoy = document.getElementById('cal-hoy');
  const elTit = document.getElementById('cal-titular');
  const elList = document.getElementById('cal-tareas');
  const elCta = document.getElementById('cal-cta');
  const elCtaTxt = document.getElementById('cal-cta-txt');
  const hoy = new Date().getMonth();
  const pintar = m => {
    const e = Math.floor(m / 3);
    cal.dataset.sel = String(m);
    btns.forEach(b => b.setAttribute('aria-pressed', Number(b.dataset.mes) === m ? 'true' : 'false'));
    celdas.forEach(c => c.classList.toggle('is-sel', Number(c.dataset.m) === m));
    if (elMes) elMes.textContent = MESES[m];
    if (elEst) elEst.textContent = ESTACIONES[e];
    if (elHoy) elHoy.hidden = m !== hoy;
    if (elTit) elTit.textContent = TITULARES[e];
    const tareas = filas.filter(f => f.vals[m] > 0).sort((a, b) => b.vals[m] - a.vals[m]);
    if (elList) {
      elList.innerHTML = tareas.map(f => `<li data-i="${f.vals[m]}"><span class="cal-dot"></span><span><strong>${esc(f.nombre)}</strong>${esc(FRASES[f.key]?.[e] || '')}</span></li>`).join('');
    }
    const fuertes = tareas.filter(f => f.vals[m] === 2);
    const nombres = (fuertes.length ? fuertes : tareas).map(f => f.nombre.toLowerCase());
    const mes = MESES[m].toLowerCase();
    const msg = `Hola Peques, quiero pedir un presupuesto para ${mes}: ${unir(nombres)}.`;
    if (elCta) elCta.href = `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
    if (elCtaTxt) elCtaTxt.textContent = `Pedir presupuesto para ${mes}`;
  };
  btns.forEach(b => {
    const m = Number(b.dataset.mes);
    if (m === hoy) {
      b.classList.add('es-hoy');
      b.setAttribute('aria-label', `${MESES[m]} (este mes)`);
    }
    b.addEventListener('click', () => pintar(m));
  });
  pintar(hoy);
}

function initPresupuesto() {
  const form = document.getElementById('presupuesto');
  if (!form) return;
  const prev = document.getElementById('f-preview');
  const err = document.getElementById('err-servicio');
  const armar = () => {
    const fd = new window.FormData(form);
    const servs = fd.getAll('servicio[]');
    const lineas = ['Hola Peques, quiero pedir un presupuesto.'];
    if (servs.length) lineas.push(`Servicios: ${servs.join(', ')}`);
    const esp = fd.get('espacio');
    if (esp) lineas.push(`Espacio: ${esp}`);
    const fr = fd.get('frecuencia');
    if (fr) lineas.push(`Frecuencia: ${fr}`);
    const zona = String(fd.get('zona') || '').trim();
    if (zona) lineas.push(`Zona: ${zona}`);
    const nom = String(fd.get('nombre') || '').trim();
    if (nom) lineas.push(`Nombre: ${nom}`);
    return { servs, texto: lineas.join('\n') };
  };
  const refrescar = () => {
    const { servs, texto } = armar();
    if (prev) prev.textContent = texto;
    if (servs.length && err) err.hidden = true;
  };
  form.addEventListener('input', refrescar);
  form.addEventListener('change', refrescar);
  form.addEventListener('submit', e => {
    e.preventDefault();
    const { servs, texto } = armar();
    if (!servs.length) {
      if (err) err.hidden = false;
      form.querySelector('input[name="servicio[]"]')?.focus();
      showToast('Elegí al menos un servicio para armar el pedido.');
      return;
    }
    const btn = form.querySelector('button[type="submit"]');
    if (btn) btn.disabled = true;
    window.open(`https://wa.me/${WA}?text=${encodeURIComponent(texto)}`, '_blank', 'noopener');
    showToast('Abrimos WhatsApp con tu pedido listo para enviar.');
    setTimeout(() => { if (btn) btn.disabled = false; }, 800);
  });
  refrescar();
}

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const img = hero.querySelector('[data-hero-img]');
  if (img) tl.from(img, { scale: 1.1, duration: 1.8 }, 0);
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.aside-foto, .sello, .hero-badge'), { scale: 0.92, opacity: 0, duration: 1.1, stagger: 0.1, clearProps: 'transform,opacity' }, 0.65);
}

function initSello() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('.sello-txt').forEach(s => {
    gsap.to(s, { rotation: 160, ease: 'none', scrollTrigger: { trigger: s, start: 'top bottom', end: 'bottom top', scrub: 0.6 } });
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

initModelBarScroll();
initNav();
initWspFloat();
initServicios();
initTabs();
initVisor();
initCalendario();
initPresupuesto();
initHeroMotion();
initSello();
initReveals();
