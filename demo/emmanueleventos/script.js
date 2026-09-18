const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5491154666908';

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

const MENU = {
  recepcion: {
    etiqueta: 'Recepción',
    items: [
      { id: 'finger', nombre: 'Finger food frío', detalle: 'Bocados fríos en bandeja, seis variedades' },
      { id: 'estaciones', nombre: 'Estaciones calientes', detalle: 'Cocina a la vista: brasas, wok y focaccias' },
      { id: 'picada', nombre: 'Picada de autor', detalle: 'Tablas de fiambres, quesos y conservas' }
    ]
  },
  principal: {
    etiqueta: 'Principal',
    items: [
      { id: 'asado', nombre: 'Asado a la parrilla', detalle: 'Tira, vacío y achuras con guarniciones' },
      { id: 'pollo', nombre: 'Pollo relleno', detalle: 'Suprema rellena con papas al horno' },
      { id: 'risotto', nombre: 'Risotto de hongos', detalle: 'Opción vegetariana, sin harinas' }
    ]
  },
  postre: {
    etiqueta: 'Postre',
    items: [
      { id: 'mesadulce', nombre: 'Mesa dulce', detalle: 'Mini pastelería, macarons y alfajores' },
      { id: 'volcan', nombre: 'Volcán de chocolate', detalle: 'Emplatado, servido tibio a la mesa' },
      { id: 'frutas', nombre: 'Frutas y helado', detalle: 'Copa de estación, opción más liviana' }
    ]
  }
};

const EXTRAS = [
  { id: 'mozos', nombre: 'Mozos y personal' },
  { id: 'vajilla', nombre: 'Vajilla y mantelería' },
  { id: 'barra', nombre: 'Barra móvil' },
  { id: 'dj', nombre: 'DJ y sonido' },
  { id: 'deco', nombre: 'Decoración' }
];

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

function initWspLinks() {
  document.querySelectorAll('[data-wsp-msg]').forEach(a => {
    a.href = 'https://wa.me/' + WSP + '?text=' + encodeURIComponent(a.getAttribute('data-wsp-msg'));
  });
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
  if (!bd) {
    bd = document.createElement('div');
    bd.className = 'nav-backdrop';
    const header = document.querySelector('.site-header');
    (header || document.body).appendChild(bd);
  }
  const desktopMq = window.matchMedia('(min-width: 861px)');
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

const ESCENAS = [
  {
    hasta: 0.34,
    kicker: 'Así lo encontramos',
    titulo: 'Un salón vacío',
    texto: 'Llegamos temprano, con la vajilla contada y el plano de mesas hecho. Lo que para vos es una fiesta, para nosotros es una jornada que arranca mucho antes.',
    hora: '07:00',
    reloj: 'empieza el montaje'
  },
  {
    hasta: 0.68,
    kicker: 'Mientras tanto',
    titulo: 'Se monta todo',
    texto: 'Mesas, mantelería, vajilla, centros y barra. Cada cosa entra en su horario para no pisarse con el sonido ni con la decoración.',
    hora: '15:30',
    reloj: 'mesas vestidas y vajilla puesta'
  },
  {
    hasta: 1.01,
    kicker: 'Así lo entregamos',
    titulo: 'Listo para el primer invitado',
    texto: 'Cuando se abren las puertas ya no queda nada por resolver. A partir de ahí el único trabajo es que nadie se quede sin copa.',
    hora: '21:00',
    reloj: 'entra el primer invitado'
  }
];

function initMontaje() {
  const sec = document.querySelector('.montaje');
  if (!sec) return;
  const escena = sec.querySelector('.montaje-escena');
  const imgB = sec.querySelector('.montaje-b');
  const kicker = document.getElementById('montajeKicker');
  const titulo = document.getElementById('montajeTitulo');
  const texto = document.getElementById('montajeTexto');
  const hora = document.getElementById('relojHora');
  const relojTxt = document.getElementById('relojTxt');
  const copy = sec.querySelector('.montaje-copy');
  if (!escena || !imgB || !kicker || !hora) return;

  const clamp01 = v => Math.max(0, Math.min(1, v));
  let indice = -1;

  function pintar(p) {
    sec.style.setProperty('--crece', clamp01((p - 0.02) / 0.52).toFixed(3));
    imgB.style.opacity = clamp01((p - 0.5) / 0.26).toFixed(3);

    let i = 0;
    while (i < ESCENAS.length - 1 && p > ESCENAS[i].hasta) i++;
    if (i !== indice) {
      indice = i;
      const e = ESCENAS[i];
      copy.style.opacity = '0';
      copy.style.transform = 'translateY(14px)';
      window.setTimeout(() => {
        kicker.textContent = e.kicker;
        titulo.textContent = e.titulo;
        texto.textContent = e.texto;
        hora.textContent = e.hora;
        relojTxt.textContent = e.reloj;
        copy.style.opacity = '1';
        copy.style.transform = 'none';
      }, reduceMotion ? 0 : 180);
    }
  }

  const progreso = () => {
    const r = sec.getBoundingClientRect();
    const total = r.height - window.innerHeight;
    return total > 0 ? clamp01(-r.top / total) : 0;
  };

  let queued = false;
  const frame = () => { queued = false; pintar(progreso()); };
  const queue = () => { if (!queued) { queued = true; requestAnimationFrame(frame); } };
  window.addEventListener('scroll', queue, { passive: true });
  window.addEventListener('resize', queue, { passive: true });
  window.addEventListener('load', queue);
  copy.style.transition = 'opacity .28s ease, transform .28s ease';
  pintar(0);
  window.__montajePintar = pintar;
}

const menuEstado = { invitados: 80, recepcion: '', principal: '', postre: '', extras: [], especial: '' };

function initMenu() {
  const inv = document.getElementById('invitados');
  const panelInv = document.getElementById('panelInv');
  const panelLista = document.getElementById('panelLista');
  const panelExtras = document.getElementById('panelExtras');
  const panelEspecial = document.getElementById('panelEspecial');
  const cta = document.getElementById('panelCta');
  const especial = document.getElementById('especial');
  if (!inv || !panelLista || !cta) return;

  Object.keys(MENU).forEach(grupo => {
    const cont = document.querySelector(`[data-grupo="${grupo}"]`);
    if (!cont) return;
    cont.innerHTML = MENU[grupo].items.map(it => `<label class="opcion">
      <input type="radio" name="${esc(grupo)}" value="${esc(it.id)}">
      <span>${esc(it.nombre)}</span>
    </label>`).join('');
    cont.querySelectorAll('input').forEach(r => r.addEventListener('change', () => {
      menuEstado[grupo] = r.value;
      pintarPanel();
    }));
  });

  const contExtras = document.getElementById('menuExtras');
  if (contExtras) {
    contExtras.innerHTML = EXTRAS.map(x => `<label class="opcion">
      <input type="checkbox" value="${esc(x.id)}">
      <span>${esc(x.nombre)}</span>
    </label>`).join('');
    contExtras.querySelectorAll('input').forEach(c => c.addEventListener('change', () => {
      menuEstado.extras = [...contExtras.querySelectorAll('input:checked')].map(i => i.value);
      pintarPanel();
    }));
  }

  const setInv = n => {
    menuEstado.invitados = Math.max(20, Math.min(400, Math.round(n / 10) * 10 || 20));
    inv.value = menuEstado.invitados;
    pintarPanel();
  };
  document.getElementById('invMenos')?.addEventListener('click', () => setInv(menuEstado.invitados - 10));
  document.getElementById('invMas')?.addEventListener('click', () => setInv(menuEstado.invitados + 10));
  inv.addEventListener('change', () => setInv(parseInt(inv.value, 10) || 80));

  let t = null;
  especial?.addEventListener('input', () => {
    clearTimeout(t);
    t = window.setTimeout(() => { menuEstado.especial = especial.value.trim(); pintarPanel(); }, 250);
  });

  document.getElementById('panelReset')?.addEventListener('click', () => {
    menuEstado.recepcion = ''; menuEstado.principal = ''; menuEstado.postre = '';
    menuEstado.extras = []; menuEstado.especial = ''; menuEstado.invitados = 80;
    document.querySelectorAll('.menu-pasos input').forEach(i => { i.checked = false; });
    inv.value = 80;
    if (especial) especial.value = '';
    pintarPanel();
    showToast('Menú vacío, arrancá de nuevo');
  });

  function nombreDe(grupo) {
    const id = menuEstado[grupo];
    return MENU[grupo].items.find(i => i.id === id)?.nombre || '';
  }

  function pintarPanel() {
    panelInv.textContent = menuEstado.invitados;
    panelLista.innerHTML = Object.keys(MENU).map(g => {
      const n = nombreDe(g);
      return `<li class="${n ? '' : 'vacio'}"><b>${esc(MENU[g].etiqueta)}</b><span>${esc(n || 'a elegir')}</span></li>`;
    }).join('');

    const nombresExtras = menuEstado.extras.map(id => EXTRAS.find(x => x.id === id)?.nombre).filter(Boolean);
    panelExtras.textContent = nombresExtras.length
      ? 'Con ' + nombresExtras.join(', ').toLowerCase() + '.'
      : 'Sin servicios extra por ahora.';

    if (menuEstado.especial) {
      panelEspecial.hidden = false;
      panelEspecial.textContent = 'Pedido especial: ' + menuEstado.especial;
    } else {
      panelEspecial.hidden = true;
      panelEspecial.textContent = '';
    }

    const elegidos = Object.keys(MENU).filter(g => menuEstado[g]).length;
    cta.textContent = elegidos === 3 ? 'Pedir el presupuesto de este menú' : 'Pedir el presupuesto';

    const lineas = Object.keys(MENU).map(g => `${MENU[g].etiqueta}: ${nombreDe(g) || 'a definir'}`).join('\n');
    const msg = `Hola Emmanuel Eventos, armé un menú en la web.\n\nInvitados: ${menuEstado.invitados}\n${lineas}\nServicios: ${nombresExtras.length ? nombresExtras.join(', ') : 'a definir'}${menuEstado.especial ? '\n\nPedido especial: ' + menuEstado.especial : ''}\n\n¿Me pasan el presupuesto?`;
    cta.href = 'https://wa.me/' + WSP + '?text=' + encodeURIComponent(msg);

    const mensajeForm = document.getElementById('f-mensaje');
    if (mensajeForm && !mensajeForm.dataset.tocado && elegidos > 0) {
      mensajeForm.value = `Menú armado en la web — ${menuEstado.invitados} invitados. ${lineas.replace(/\n/g, ' · ')}.${menuEstado.especial ? ' Pedido especial: ' + menuEstado.especial : ''}`;
    }
    const invForm = document.getElementById('f-invitados');
    if (invForm && !invForm.dataset.tocado) invForm.value = menuEstado.invitados;
  }

  pintarPanel();
}

function initForm() {
  const form = document.getElementById('formConsulta');
  if (!form) return;
  const boton = document.getElementById('formSubmit');
  const tel = document.getElementById('f-tel');
  if (tel && typeof IMask !== 'undefined') IMask(tel, { mask: '00 0000-0000', lazy: true, placeholderChar: ' ' });

  ['f-mensaje', 'f-invitados'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', e => { e.target.dataset.tocado = '1'; });
  });

  const campos = [
    { id: 'f-nombre', err: 'err-nombre', test: v => v.trim().length >= 2 },
    { id: 'f-tel', err: 'err-tel', test: v => v.replace(/\D/g, '').length >= 8 },
    { id: 'f-tipo', err: 'err-tipo', test: v => v !== '' },
    { id: 'f-fecha', err: 'err-fecha', test: v => v !== '' },
    { id: 'f-invitados', err: 'err-invitados', test: v => { const n = parseInt(v, 10); return n >= 20 && n <= 400; } }
  ];

  const limpiar = c => {
    const el = document.getElementById(c.id);
    if (!el || !c.test(el.value)) return;
    el.closest('.campo')?.classList.remove('con-error');
    const e = document.getElementById(c.err);
    if (e) e.hidden = true;
  };
  campos.forEach(c => {
    const el = document.getElementById(c.id);
    el?.addEventListener('input', () => limpiar(c));
    el?.addEventListener('change', () => limpiar(c));
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    let ok = true;
    let primero = null;
    campos.forEach(c => {
      const el = document.getElementById(c.id);
      const err = document.getElementById(c.err);
      if (!el) return;
      const valido = c.test(el.value);
      el.closest('.campo')?.classList.toggle('con-error', !valido);
      if (err) err.hidden = valido;
      if (!valido) { ok = false; if (!primero) primero = el; }
    });
    if (!ok) { primero?.focus(); showToast('Revisá los campos marcados y volvé a intentar.'); return; }

    const original = boton.textContent;
    boton.disabled = true;
    boton.textContent = 'Enviando…';
    window.setTimeout(() => {
      boton.disabled = false;
      boton.textContent = original;
      form.reset();
      document.getElementById('f-invitados').value = menuEstado.invitados;
      showToast('¡Gracias! El envío de mensajes se activa al pasar la web a producción.');
    }, 800);
  });
}

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

function initMovimiento() {
  if (typeof gsap === 'undefined') {
    document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
    return;
  }
  if (typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);
  if (reduceMotion) return;

  document.querySelectorAll('[data-parallax]').forEach(el => {
    const img = el.querySelector('img');
    if (!img) return;
    const factor = parseFloat(el.getAttribute('data-parallax')) || 0.05;
    gsap.fromTo(img,
      { yPercent: -factor * 100 },
      { yPercent: 0, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } }
    );
  });

  window.addEventListener('load', () => ScrollTrigger.refresh());
}

initWspLinks();
initNav();
initMontaje();
initMenu();
initForm();
initReveals();
initWspFloat();
initMovimiento();

document.querySelectorAll('.faq-item').forEach(d => {
  d.addEventListener('toggle', () => {
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  });
});
