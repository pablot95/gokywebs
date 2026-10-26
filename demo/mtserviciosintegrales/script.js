const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5492616990086';
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const linkWsp = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;

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

const SERVICIOS = {
  plomeria: {
    nombre: 'Plomería',
    tag: 'Agua',
    puntos: ['agua'],
    foto: 'images/griferia.webp',
    alt: 'Grifería cromada de cocina sobre bacha de acero',
    resumen: 'Instalación, mantenimiento y reparación de cañerías, griferías y artefactos.',
    incluye: [
      'Detección y reparación de pérdidas de agua',
      'Cañerías de agua fría y caliente, nuevas o a reparar',
      'Griferías, bachas, sifones y flexibles',
      'Inodoros, depósitos y llaves de paso'
    ],
    msg: 'Hola MT servicios integrales, quiero consultar por un trabajo de plomería.'
  },
  gas: {
    nombre: 'Gas domiciliario',
    tag: 'Gas',
    puntos: ['gas'],
    foto: 'images/calefon.webp',
    alt: 'Calefón blanco instalado en la pared con sus conexiones de gas y agua',
    resumen: 'Instalación, mantenimiento y reparación de artefactos a gas y conexiones.',
    incluye: [
      'Colocación de calefones, termotanques y cocinas',
      'Instalación de calefactores y estufas',
      'Conexiones, flexibles y llaves de paso de gas',
      'Detección de pérdidas de gas'
    ],
    msg: 'Hola MT servicios integrales, quiero consultar por un trabajo de gas.'
  },
  mantenimiento: {
    nombre: 'Mantenimiento',
    tag: 'Agua y gas',
    puntos: ['agua', 'gas'],
    foto: 'images/caja-herramientas.webp',
    alt: 'Caja de herramientas azul abierta con llaves, cortacaños y conexiones de bronce',
    resumen: 'Revisión, ajuste y solución de problemas en instalaciones de plomería y gas.',
    incluye: [
      'Mantenimiento de calefones y calefactores',
      'Limpieza de quemadores y piloto',
      'Revisión de la instalación antes del invierno',
      'Ajustes y cambio de repuestos'
    ],
    msg: 'Hola MT servicios integrales, quiero consultar por un mantenimiento.'
  }
};

const ICONO_CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';
const ICONO_FLECHA = '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

function fichaHTML(id, completa) {
  const s = SERVICIOS[id];
  if (!s) return '';
  const lista = `<p class="ficha-titulo-lista">Qué incluye</p>
    <ul class="ficha-lista">${s.incluye.map(i => `<li>${ICONO_CHECK}<span>${esc(i)}</span></li>`).join('')}</ul>
    <a class="btn btn-primary" href="${linkWsp(s.msg)}" target="_blank" rel="noopener">Consultar por ${esc(s.nombre.toLowerCase())}${ICONO_FLECHA}</a>`;
  if (!completa) return lista;
  const puntos = s.puntos.map(p => `<span class="punto punto-${p}" aria-hidden="true"></span>`).join('');
  return `<div class="ficha">
    <div class="ficha-foto"><img src="${s.foto}" width="1200" height="1200" alt="${esc(s.alt)}"></div>
    <div class="ficha-cuerpo">
      <p class="tag">${puntos}${esc(s.tag)}</p>
      <h3>${esc(s.nombre)}</h3>
      <p>${esc(s.resumen)}</p>
      ${lista}
    </div>
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

function crearDialogo(el) {
  let previo = null;
  let timer = 0;
  const enfocables = () => [...el.querySelectorAll('a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])')].filter(n => n.getClientRects().length);
  const onKey = e => {
    if (e.key === 'Escape') { e.preventDefault(); cerrar(); return; }
    if (e.key !== 'Tab') return;
    const f = enfocables();
    if (!f.length) return;
    const primero = f[0];
    const ultimo = f[f.length - 1];
    if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
    else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
  };
  function abrir() {
    clearTimeout(timer);
    previo = document.activeElement;
    el.hidden = false;
    void el.offsetWidth;
    el.classList.add('abierto');
    document.body.classList.add('no-scroll');
    document.addEventListener('keydown', onKey);
    el.querySelector('[data-cerrar]')?.focus();
  }
  function cerrar() {
    if (el.hidden) return;
    el.classList.remove('abierto');
    document.body.classList.remove('no-scroll');
    document.removeEventListener('keydown', onKey);
    timer = setTimeout(() => { el.hidden = true; }, reduceMotion ? 0 : 280);
    previo?.focus?.();
  }
  el.addEventListener('click', e => {
    if (e.target === el || e.target.closest('[data-cerrar]')) cerrar();
  });
  return { abrir, cerrar };
}

function initServicioModal() {
  const modal = document.getElementById('servicioModal');
  const cuerpo = document.getElementById('servicioModalCuerpo');
  const botones = document.querySelectorAll('[data-servicio-abrir]');
  if (!modal || !cuerpo || !botones.length) return;
  const dialogo = crearDialogo(modal);
  botones.forEach(btn => btn.addEventListener('click', () => {
    const id = btn.dataset.servicioAbrir;
    if (!SERVICIOS[id]) return;
    cuerpo.innerHTML = fichaHTML(id, true);
    modal.setAttribute('aria-label', SERVICIOS[id].nombre);
    dialogo.abrir();
  }));
}

function initServiciosAcordeon() {
  const toggles = [...document.querySelectorAll('[data-servicio-toggle]')];
  if (!toggles.length) return;
  const marco = document.querySelector('.servicios-visual-marco');
  const mostrar = id => marco?.querySelectorAll('img[data-visual]').forEach(img => img.classList.toggle('activa', img.dataset.visual === id));
  document.querySelectorAll('[data-servicio-detalle]').forEach(c => { c.innerHTML = fichaHTML(c.dataset.servicioDetalle, false); });
  toggles.forEach(btn => btn.addEventListener('click', () => {
    const abrir = btn.getAttribute('aria-expanded') !== 'true';
    toggles.forEach(b => {
      b.setAttribute('aria-expanded', 'false');
      const p = document.getElementById(b.getAttribute('aria-controls'));
      if (p) p.hidden = true;
    });
    if (abrir) {
      btn.setAttribute('aria-expanded', 'true');
      const panel = document.getElementById(btn.getAttribute('aria-controls'));
      if (panel) panel.hidden = false;
      mostrar(btn.dataset.servicioToggle);
    } else {
      mostrar('base');
    }
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  }));
}

function initVisor() {
  const visor = document.getElementById('visor');
  const img = document.getElementById('visorImg');
  const txt = document.getElementById('visorTxt');
  const botones = [...document.querySelectorAll('.trabajo[data-visor]')];
  if (!visor || !img || !txt || !botones.length) return;
  const items = botones.map(b => {
    const foto = b.querySelector('img');
    return {
      src: (foto?.getAttribute('src') || '').replace('-640.webp', '.webp'),
      alt: foto?.alt || '',
      txt: b.querySelector('.trabajo-txt')?.textContent.trim() || ''
    };
  });
  let actual = 0;
  const dialogo = crearDialogo(visor);
  const mostrar = i => {
    actual = (i + items.length) % items.length;
    img.src = items[actual].src;
    img.alt = items[actual].alt;
    txt.textContent = `${items[actual].txt} · ${actual + 1} de ${items.length}`;
  };
  botones.forEach((b, i) => b.addEventListener('click', () => { mostrar(i); dialogo.abrir(); }));
  visor.querySelectorAll('[data-paso]').forEach(b => b.addEventListener('click', () => mostrar(actual + Number(b.dataset.paso))));
  visor.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') mostrar(actual + 1);
    if (e.key === 'ArrowLeft') mostrar(actual - 1);
  });
}

const PROBLEMAS = {
  perdida: {
    aviso: 'Si la pérdida es grande, cerrá la llave de paso general hasta que lleguemos. Sacale una foto a la mancha de humedad o al caño y mandala con la consulta.'
  },
  gas: {
    urgente: true,
    aviso: '<strong>Primero tu seguridad:</strong> cerrá la llave de paso del gas, abrí puertas y ventanas y no prendas ni apagues luces ni uses fuego. Si el olor es fuerte, salí de la casa y llamá a la guardia de emergencias de la distribuidora de gas.'
  },
  instalar: {
    aviso: 'Si ya tenés el artefacto, mandá la marca y el modelo (o una foto de la etiqueta): así sabemos qué conexión lleva.'
  },
  mantenimiento: {
    aviso: 'Contanos la marca y hace cuánto no se revisa. Si la llama sale amarilla o ves hollín, no lo uses hasta que lo revisemos.'
  },
  caneria: {
    aviso: 'Si podés, mandá una foto del caño y de la pared o el piso: ayuda a llevar los materiales justos.'
  }
};

function initConsulta() {
  const form = document.getElementById('consultaForm');
  const btn = document.getElementById('consultaBtn');
  const msgEl = document.getElementById('consultaMsg');
  const aviso = document.getElementById('consultaAviso');
  const avisoTxt = document.getElementById('consultaAvisoTxt');
  if (!form || !btn || !msgEl || !aviso || !avisoTxt) return;
  const avisoInicial = avisoTxt.innerHTML;
  const elegido = name => form.querySelector(`input[name="${name}"]:checked`);
  const etiqueta = input => input?.closest('.chip')?.querySelector('span')?.textContent.trim() || '';

  const armar = () => {
    const problema = elegido('problema');
    const lineas = ['Hola MT servicios integrales, quiero hacer una consulta.'];
    if (problema) lineas.push(`Necesito: ${etiqueta(problema)}`);
    const lugar = elegido('lugar');
    if (lugar) lineas.push(`Lugar: ${lugar.value}`);
    const cuando = elegido('cuando');
    if (cuando) lineas.push(`Para: ${cuando.value}`);
    const zona = form.querySelector('input[name="zona"]')?.value.trim();
    if (zona) lineas.push(`Zona: ${zona}`);
    if (problema && problema.value !== 'gas') lineas.push('Te mando una foto por acá.');
    const mensaje = lineas.join('\n');
    msgEl.textContent = mensaje;
    btn.href = linkWsp(mensaje);
    const info = PROBLEMAS[problema?.value];
    avisoTxt.innerHTML = info ? info.aviso : avisoInicial;
    aviso.classList.toggle('is-urgente', Boolean(info?.urgente));
  };

  form.addEventListener('change', e => {
    if (e.target.name === 'problema' && e.target.value === 'gas') {
      const urgente = form.querySelector('input[name="cuando"][value="Lo antes posible"]');
      if (urgente) urgente.checked = true;
    }
    armar();
  });
  form.addEventListener('input', e => { if (e.target.name === 'zona') armar(); });
  form.addEventListener('keydown', e => {
    if (e.key === 'Enter' && e.target.name === 'zona') { e.preventDefault(); btn.click(); }
  });
  btn.addEventListener('click', e => {
    if (elegido('problema')) return;
    e.preventDefault();
    showToast('Elegí qué necesitás y armamos el mensaje.');
    form.querySelector('input[name="problema"]')?.focus();
  });
  armar();
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
    (document.querySelector('.site-header') || document.body).appendChild(bd);
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
  if (img) tl.from(img, { scale: 1.1, duration: 1.8 }, 0);
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.sello, .hero-badge'), { scale: 0.92, opacity: 0, duration: 1.1, stagger: 0.1, clearProps: 'transform,opacity' }, 0.65);
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  const capa = document.querySelector('.hero-parallax');
  if (capa) {
    gsap.fromTo(capa, { yPercent: -4 }, {
      yPercent: 4, ease: 'none',
      scrollTrigger: { trigger: capa.closest('.hero-media'), start: 'top bottom', end: 'bottom top', scrub: true }
    });
  }
  const anillo = document.querySelector('.sello-anillo');
  if (anillo) {
    gsap.to(anillo, {
      rotation: 160, svgOrigin: '60 60', ease: 'none',
      scrollTrigger: { trigger: anillo.closest('.sello'), start: 'top bottom', end: 'bottom top', scrub: 0.6 }
    });
  }
}

initModelBarScroll();
initNav();
initWspFloat();
initServicioModal();
initServiciosAcordeon();
initVisor();
initConsulta();
initReveals();
initHeroMotion();
initParallax();
