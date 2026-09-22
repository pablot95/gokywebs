const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5491123202616';

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPesos = n => '$' + Math.round(n).toLocaleString('es-AR');

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

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

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) {
    bd = document.createElement('div');
    bd.className = 'nav-backdrop';
    const header = document.querySelector('.site-header');
    (header || document.body).appendChild(bd);
  }
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

function initWspLinks() {
  document.querySelectorAll('[data-wsp-msg]').forEach(a => {
    a.href = `https://wa.me/${WSP}?text=${encodeURIComponent(a.dataset.wspMsg)}`;
  });
}

const HORARIO = { dias: [1, 2, 3, 4, 5, 6], tramos: { 1: [8 * 60, 18 * 60], 2: [8 * 60, 18 * 60], 3: [8 * 60, 18 * 60], 4: [8 * 60, 18 * 60], 5: [8 * 60, 18 * 60], 6: [8 * 60, 13 * 60] } };

function initEstado() {
  const cajas = document.querySelectorAll('[data-estado]');
  if (!cajas.length) return;
  const ahora = new Date();
  const dia = ahora.getDay();
  const min = ahora.getHours() * 60 + ahora.getMinutes();
  const tramo = HORARIO.tramos[dia];
  const abierto = !!tramo && min >= tramo[0] && min < tramo[1];
  let texto;
  if (abierto) {
    texto = `Abierto ahora · hasta las ${tramo[1] / 60} h`;
  } else if (tramo && min < tramo[0]) {
    texto = `Cerrado · abre hoy a las ${tramo[0] / 60} h`;
  } else {
    texto = 'Cerrado · escribí igual, se responde al abrir';
  }
  cajas.forEach(caja => {
    caja.classList.toggle('estado--cerrado', !abierto);
    const span = caja.querySelector('[data-estado-texto]');
    if (span) span.textContent = texto;
  });
}

const SERVICIOS = [
  {
    id: 'impermeabilizacion', nombre: 'Impermeabilización', corto: 'Impermeabilización de techos y terrazas',
    desc: 'Techos, terrazas y balcones sellados contra filtraciones, con membrana aplicada de forma prolija.',
    tipo: 'm2', min: 18000, max: 24000,
  },
  {
    id: 'interiores-exteriores', nombre: 'Interiores y exteriores', corto: 'Pintura de interiores y exteriores',
    desc: 'Paredes, cielorrasos y fachadas, con el empastado y la preparación que sostienen el color en el tiempo.',
    tipo: 'm2', min: 9000, max: 13000,
  },
  {
    id: 'texturizado', nombre: 'Texturizado', corto: 'Texturizado de fachadas e interiores',
    desc: 'Revoques texturados para paredes con relieve y carácter, por dentro y por fuera.',
    tipo: 'm2', min: 11000, max: 15000,
  },
  {
    id: 'barnizado', nombre: 'Barnizado', corto: 'Barnizado de muebles y superficies de madera',
    desc: 'Muebles y superficies de madera con manos parejas, sin marcas de pincel ni brillos disparejos.',
    tipo: 'pieza',
  },
  {
    id: 'puertas-rejas', nombre: 'Puertas y rejas', corto: 'Pintura de puertas y rejas',
    desc: 'Puertas de madera y rejas de hierro, lijadas, protegidas contra el óxido y pintadas.',
    tipo: 'pieza',
  },
];

function initConsulta() {
  const contenedores = document.querySelectorAll('[data-servicio]');
  const panel = document.getElementById('consultaPanel');
  if (!contenedores.length || !panel) return;

  const lista = panel.querySelector('[data-consulta-lista]');
  const totalValor = panel.querySelector('[data-consulta-total]');
  const totalFila = panel.querySelector('[data-consulta-total-fila]');
  const contador = panel.querySelector('[data-consulta-contador]');
  const cta = panel.querySelector('[data-consulta-cta]');

  const estado = new Map();

  const pintarPanel = () => {
    const elegidos = SERVICIOS.filter(s => estado.get(s.id)?.on);
    contador.textContent = String(elegidos.length);
    contador.hidden = elegidos.length === 0;

    if (!elegidos.length) {
      lista.innerHTML = '<p class="consulta-panel__vacio">Elegí uno o más servicios de la lista para armar tu consulta.</p>';
      totalFila.hidden = true;
      cta.dataset.wspMsg = 'Hola Sebastián, quiero hacer una consulta por pintura e impermeabilización.';
      cta.href = `https://wa.me/${WSP}?text=${encodeURIComponent(cta.dataset.wspMsg)}`;
      return;
    }

    let totalMin = 0, totalMax = 0, hayEstimado = false, hayCoordinar = false;
    const lineas = elegidos.map(s => {
      const e = estado.get(s.id);
      if (s.tipo === 'm2') {
        const m2 = Number(e.m2) > 0 ? Number(e.m2) : null;
        if (m2) {
          const min = s.min * m2, max = s.max * m2;
          totalMin += min; totalMax += max; hayEstimado = true;
          return { texto: `${s.nombre} · ${m2} m²`, valor: `${formatearPesos(min)} – ${formatearPesos(max)}` };
        }
        hayEstimado = true;
        return { texto: s.nombre, valor: `desde ${formatearPesos(s.min)}/m²` };
      }
      hayCoordinar = true;
      return { texto: s.nombre, valor: 'a coordinar' };
    });

    lista.innerHTML = lineas.map(l => `<div class="consulta-panel__item"><span>${esc(l.texto)}</span><b>${esc(l.valor)}</b></div>`).join('');

    if (totalMin > 0) {
      totalFila.hidden = false;
      totalValor.textContent = `${formatearPesos(totalMin)} – ${formatearPesos(totalMax)}`;
    } else {
      totalFila.hidden = true;
    }

    const mensajeLineas = [
      'Hola Sebastián, quiero pedir un presupuesto para:',
      ...elegidos.map(s => {
        const e = estado.get(s.id);
        if (s.tipo === 'm2' && Number(e.m2) > 0) return `- ${s.corto} (${e.m2} m² aprox.)`;
        return `- ${s.corto}`;
      }),
    ];
    if (hayEstimado || hayCoordinar) mensajeLineas.push('', '¿Coordinamos una visita para confirmar el presupuesto?');
    cta.dataset.wspMsg = mensajeLineas.join('\n');
    cta.href = `https://wa.me/${WSP}?text=${encodeURIComponent(cta.dataset.wspMsg)}`;
  };

  contenedores.forEach(cont => {
    const id = cont.dataset.servicio;
    const servicio = SERVICIOS.find(s => s.id === id);
    if (!servicio) return;
    estado.set(id, { on: false, m2: '' });

    const chk = cont.querySelector('[data-chk]');
    const m2Input = cont.querySelector('[data-m2]');

    chk?.addEventListener('change', () => {
      estado.get(id).on = chk.checked;
      cont.classList.toggle('is-elegido', chk.checked);
      if (chk.checked) showToast(`Sumaste ${servicio.nombre} a tu consulta`);
      pintarPanel();
    });

    m2Input?.addEventListener('input', () => {
      estado.get(id).m2 = m2Input.value;
      pintarPanel();
    });
  });

  pintarPanel();
}

function initTabsFiltro() {
  const tabs = document.querySelectorAll('[data-tab]');
  const filas = document.querySelectorAll('.servicio-fila');
  if (!tabs.length || !filas.length) return;
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.setAttribute('aria-pressed', t === tab ? 'true' : 'false'));
      const cat = tab.dataset.tab;
      filas.forEach(fila => {
        const coincide = cat === 'todos' || fila.dataset.categoria === cat;
        fila.hidden = !coincide;
      });
    });
  });
}

function initReveals() {
  const items = document.querySelectorAll('[data-animate]');
  if (!items.length) return;
  document.querySelectorAll('[data-animate-stagger]').forEach(parent => {
    parent.querySelectorAll('[data-animate]').forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i * 0.1, 0.6)}s`;
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

function initMovimiento() {
  if (typeof gsap === 'undefined') {
    document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
    return;
  }
  if (typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
  if (reduceMotion) return;

  const heroImg = document.querySelector('.hero__fondo img');
  if (heroImg) gsap.fromTo(heroImg, { scale: 1.09 }, { scale: 1, duration: 1.5, ease: 'power2.out' });

  if (typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('.cierre__foto img').forEach(img => {
    gsap.fromTo(img, { yPercent: -5 }, {
      yPercent: 5, ease: 'none',
      scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });
  window.addEventListener('load', () => ScrollTrigger.refresh());
}

document.addEventListener('DOMContentLoaded', () => {
  const anio = document.getElementById('anio');
  if (anio) anio.textContent = String(new Date().getFullYear());
  initNav();
  initWspFloat();
  initWspLinks();
  initEstado();
  initConsulta();
  initTabsFiltro();
  initMovimiento();
  initReveals();
});
