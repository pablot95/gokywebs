const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5491127158715';

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const SERVICIOS = {
 "personal-trainer": {
  "t": "Personal trainer en General Rodríguez",
  "d": "Clases personalizadas con el profe al lado: técnica, cargas y progresión según tu nivel y tu objetivo.",
  "l": [
   "Técnica de cada ejercicio",
   "Fuerza y resistencia",
   "Movilidad y flexibilidad"
  ],
  "m": [
   "Presencial"
  ],
  "img": "images/correccion-sentadilla-540.webp",
  "w": 540,
  "h": 960,
  "alt": "Entrenador corrigiendo la sentadilla de una alumna en el gimnasio",
  "pos": "50% 34%"
 },
 "domicilio": {
  "t": "Entrenador personal a domicilio",
  "d": "La clase va a tu casa: una rutina individual pensada para tu espacio, sin traslados y con el profe al lado.",
  "l": [
   "Fuerza con elementos simples",
   "Acondicionamiento físico general",
   "Movilidad y coordinación"
  ],
  "m": [
   "A domicilio"
  ],
  "img": "images/domicilio-banda-640.webp",
  "w": 640,
  "h": 640,
  "alt": "Clase a domicilio con banda elástica en el living de una casa",
  "pos": "50% 40%"
 },
 "online": {
  "t": "Entrenamiento personalizado online",
  "d": "Planificación de tus rutinas, seguimiento y asesoramiento a distancia, para entrenar con un plan estés donde estés.",
  "l": [
   "Rutinas planificadas para tu semana",
   "Seguimiento de tu avance",
   "Asesoramiento a distancia"
  ],
  "m": [
   "Online"
  ],
  "img": "images/online-en-casa-640.webp",
  "w": 640,
  "h": 640,
  "alt": "Alumna entrenando en su casa con la rutina en la notebook",
  "pos": "40% 50%"
 },
 "preparador": {
  "t": "Preparador físico en General Rodríguez",
  "d": "Preparación física con un plan por etapas: cada capacidad se evalúa, se entrena y se sigue de cerca.",
  "l": [
   "Fuerza y resistencia",
   "Velocidad y coordinación",
   "Movilidad y flexibilidad"
  ],
  "m": [
   "Presencial",
   "A domicilio",
   "Online"
  ],
  "img": "images/velocidad-escalera-640.webp",
  "w": 640,
  "h": 640,
  "alt": "Trabajo de velocidad con escalera de coordinación y conos al aire libre",
  "pos": "35% 50%"
 },
 "mujeres": {
  "t": "Entrenamiento para mujeres",
  "d": "Planes para mujeres orientados a tonificación muscular, fortalecimiento, descenso de grasa corporal y mejora de la composición física.",
  "l": [
   "Tonificación y fortalecimiento",
   "Descenso de grasa corporal",
   "Mejora de la composición física"
  ],
  "m": [
   "Presencial",
   "A domicilio",
   "Online"
  ],
  "img": "images/sentadilla-mancuerna-640.webp",
  "w": 640,
  "h": 640,
  "alt": "Alumna haciendo sentadilla con mancuerna mientras el entrenador la observa",
  "pos": "40% 45%"
 },
 "musculacion": {
  "t": "Musculación y acondicionamiento físico",
  "d": "Desarrollo y fortalecimiento de los distintos grupos musculares, con acondicionamiento general para tu salud, tu condición física y tu rendimiento.",
  "l": [
   "Aumento de masa muscular",
   "Fuerza por grupos musculares",
   "Acondicionamiento físico general"
  ],
  "m": [
   "Presencial",
   "A domicilio",
   "Online"
  ],
  "img": "images/musculacion-banco-640.webp",
  "w": 640,
  "h": 640,
  "alt": "Alumno haciendo curl de bíceps con mancuerna junto al entrenador",
  "pos": "40% 45%"
 },
 "deportistas": {
  "t": "Preparación física para deportistas",
  "d": "Trabajo físico complementario para deportistas que quieren mejorar su rendimiento, con experiencia en Judo y Jiu-Jitsu.",
  "l": [
   "Trabajo complementario a tu deporte",
   "Velocidad, fuerza y resistencia",
   "Coordinación y movilidad"
  ],
  "m": [
   "Presencial",
   "A domicilio",
   "Online"
  ],
  "img": "images/judo-jiujitsu-640.webp",
  "w": 640,
  "h": 640,
  "alt": "Judocas entrenando técnica de piernas sobre el tatami",
  "pos": "35% 45%"
 },
 "funcional": {
  "t": "Entrenamiento funcional",
  "d": "Ejercicios adaptados a tus capacidades y a tu objetivo, para ganar fuerza, coordinación y movilidad que se notan en el día a día.",
  "l": [
   "Coordinación",
   "Fuerza y resistencia",
   "Movilidad y flexibilidad"
  ],
  "m": [
   "Presencial",
   "A domicilio",
   "Online"
  ],
  "img": "images/coordinacion-funcional-640.webp",
  "w": 640,
  "h": 640,
  "alt": "Ejercicio funcional de coordinación con elevación de rodilla guiado por el entrenador",
  "pos": "45% 45%"
 }
};

const OBJETIVOS = {
  tonificar: {
    msg: 'tonificar', serv: 'Musculación y acondicionamiento físico',
    cap: ['Fuerza', 'Resistencia', 'Movilidad'],
    sem: {
      2: ['Fuerza · cuerpo completo y core', 'Funcional en circuito y movilidad'],
      3: ['Fuerza · tren inferior y core', 'Fuerza · tren superior y postura', 'Funcional en circuito y movilidad'],
      4: ['Fuerza · tren inferior y glúteos', 'Fuerza · tren superior y postura', 'Funcional en circuito', 'Core, movilidad y flexibilidad']
    }
  },
  masa: {
    msg: 'ganar masa muscular', serv: 'Musculación y acondicionamiento físico',
    cap: ['Fuerza', 'Masa muscular', 'Movilidad'],
    sem: {
      2: ['Fuerza · cuerpo completo, ejercicios básicos', 'Fuerza · cuerpo completo, variantes'],
      3: ['Tren inferior', 'Empuje · pecho, hombros y tríceps', 'Tracción · espalda y bíceps'],
      4: ['Tren inferior · cuádriceps y glúteos', 'Empuje · pecho, hombros y tríceps', 'Tren inferior · isquios y core', 'Tracción · espalda y bíceps']
    }
  },
  grasa: {
    msg: 'bajar grasa corporal', serv: 'Entrenamiento funcional',
    cap: ['Resistencia', 'Fuerza', 'Coordinación'],
    sem: {
      2: ['Fuerza · cuerpo completo', 'Circuito funcional de resistencia'],
      3: ['Fuerza · cuerpo completo', 'Circuito funcional de resistencia', 'Intervalos y coordinación'],
      4: ['Fuerza · tren inferior', 'Circuito funcional de resistencia', 'Fuerza · tren superior', 'Intervalos y coordinación']
    }
  },
  deporte: {
    msg: 'rendir más en mi deporte', serv: 'Preparación física para deportistas',
    cap: ['Velocidad', 'Fuerza', 'Coordinación', 'Resistencia'],
    sem: {
      2: ['Fuerza aplicada a tu deporte', 'Velocidad, agilidad y coordinación'],
      3: ['Fuerza aplicada a tu deporte', 'Velocidad, agilidad y coordinación', 'Resistencia específica'],
      4: ['Fuerza aplicada a tu deporte', 'Velocidad, agilidad y coordinación', 'Resistencia específica', 'Movilidad y flexibilidad']
    }
  },
  salud: {
    msg: 'moverme mejor y sentirme bien', serv: 'Entrenamiento funcional',
    cap: ['Movilidad', 'Flexibilidad', 'Coordinación', 'Fuerza'],
    sem: {
      2: ['Funcional · cuerpo completo', 'Movilidad y flexibilidad'],
      3: ['Fuerza básica', 'Funcional y coordinación', 'Movilidad y flexibilidad'],
      4: ['Fuerza básica', 'Funcional y coordinación', 'Resistencia aeróbica suave', 'Movilidad y flexibilidad']
    }
  }
};
const NOTAS = {
  presencial: 'Orientativo: el plan final sale de la charla sobre tu nivel y tu objetivo.',
  domicilio: 'Orientativo: la rutina se adapta al espacio de tu casa y a lo que tengas a mano.',
  online: 'Orientativo: recibís la planificación y hacemos el seguimiento a distancia.'
};
const FRANJAS = { 'mañana': 'a la mañana', 'mediodía': 'al mediodía', tarde: 'a la tarde', noche: 'a la noche' };

function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function waLink(msg) {
  return `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
}

function lista(arr) {
  if (arr.length < 2) return arr.join('');
  return `${arr.slice(0, -1).join(', ')} y ${arr[arr.length - 1]}`;
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
  const desktopMq = window.matchMedia('(min-width: 1025px)');
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
  tl.from(hero.querySelectorAll('.hero-raya'), { scaleY: 0, transformOrigin: '50% 0%', duration: 1.1, clearProps: 'transform' }, 0.15)
    .from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.sello, .hero-badge'), { scale: 0.92, opacity: 0, duration: 1.1, stagger: 0.1, clearProps: 'transform,opacity' }, 0.65);
}

function initVisor() {
  const dlg = document.getElementById('visor');
  if (!dlg) return;
  const img = document.getElementById('visorImg');
  const tag = document.getElementById('visorTag');
  const tit = document.getElementById('visorT');
  const desc = document.getElementById('visorD');
  const lis = document.getElementById('visorL');
  const cta = document.getElementById('visorCta');
  const check = '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><use href="#i-check"/></svg>';
  let ultimo = null;
  const abrir = (id, btn) => {
    const s = SERVICIOS[id];
    if (!s) return;
    ultimo = btn;
    img.src = s.img;
    img.alt = s.alt;
    img.width = s.w;
    img.height = s.h;
    img.style.objectPosition = s.pos;
    tag.textContent = s.m.join(' · ');
    tit.textContent = s.t;
    desc.textContent = s.d;
    lis.innerHTML = s.l.map(x => `<li>${check}<span>${esc(x)}</span></li>`).join('');
    cta.href = waLink(`Hola Caballo Crew! Quiero consultar por ${s.t}.`);
    document.body.classList.add('no-scroll');
    if (typeof dlg.showModal === 'function') dlg.showModal(); else dlg.setAttribute('open', '');
    document.getElementById('visorX')?.focus();
  };
  const cerrar = () => { if (typeof dlg.close === 'function') dlg.close(); else { dlg.removeAttribute('open'); dlg.dispatchEvent(new window.Event('close')); } };
  document.querySelectorAll('.ent-btn').forEach(b => b.addEventListener('click', () => abrir(b.dataset.servicio, b)));
  document.getElementById('visorX')?.addEventListener('click', cerrar);
  dlg.addEventListener('click', e => { if (e.target === dlg) cerrar(); });
  dlg.addEventListener('close', () => {
    document.body.classList.remove('no-scroll');
    ultimo?.focus();
  });
}

function initRailDrag(vp) {
  if (!vp) return;
  let dragging = false, moved = false, startX = 0, startScroll = 0, pointerId = null;
  const THRESHOLD = 6;
  vp.addEventListener('pointerdown', e => {
    if (e.pointerType === 'touch' || e.button !== 0) return;
    dragging = true; moved = false; pointerId = e.pointerId;
    startX = e.clientX; startScroll = vp.scrollLeft;
  });
  vp.addEventListener('pointermove', e => {
    if (!dragging || e.pointerId !== pointerId) return;
    const dx = e.clientX - startX;
    if (!moved && Math.abs(dx) < THRESHOLD) return;
    if (!moved) {
      moved = true;
      vp.classList.add('dragging');
      try { vp.setPointerCapture?.(pointerId); } catch { moved = true; }
    }
    e.preventDefault();
    vp.scrollLeft = startScroll - dx;
  });
  const end = e => {
    if (!dragging || (e && pointerId !== null && e.pointerId !== pointerId)) return;
    dragging = false;
    if (moved) {
      try { vp.releasePointerCapture?.(pointerId); } catch { dragging = false; }
      vp.classList.remove('dragging');
      const kill = ev => { ev.stopPropagation(); ev.preventDefault(); };
      vp.addEventListener('click', kill, { capture: true, once: true });
      setTimeout(() => vp.removeEventListener('click', kill, { capture: true }), 0);
    }
    pointerId = null; moved = false;
  };
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
  vp.addEventListener('dragstart', e => e.preventDefault());
}

function initRail() {
  const vp = document.getElementById('railEnt');
  if (!vp) return;
  initRailDrag(vp);
  const track = vp.querySelector('.rail-track');
  const prev = document.querySelector('[data-rail="prev"]');
  const next = document.querySelector('[data-rail="next"]');
  const paso = () => {
    const c = track?.querySelector('.ent-item');
    const gap = parseFloat(window.getComputedStyle(track).columnGap) || 20;
    return c ? c.getBoundingClientRect().width + gap : 320;
  };
  const estado = () => {
    if (!prev || !next || !track) return;
    const inicio = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
    prev.disabled = vp.scrollLeft <= inicio + 2;
    next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  vp.addEventListener('scroll', estado, { passive: true });
  window.addEventListener('resize', estado, { passive: true });
  estado();
}

function initGuia() {
  const form = document.getElementById('guiaForm');
  if (!form) return;
  const plMod = document.getElementById('plMod');
  const plTit = document.getElementById('plTit');
  const plCap = document.getElementById('plCap');
  const plSem = document.getElementById('plSem');
  const plNota = document.getElementById('plNota');
  const plDias = document.getElementById('plDias');
  const plCta = document.getElementById('plCta');
  const cuerpo = document.querySelector('.pl-cuerpo');
  const zonaWrap = document.getElementById('gZonaWrap');
  const zona = document.getElementById('gZona');
  const mujer = document.getElementById('gMujer');
  const valor = name => form.querySelector(`input[name="${name}"]:checked`)?.value;
  let primera = true;

  const pintar = () => {
    const objKey = valor('g-obj') || 'tonificar';
    const mod = valor('g-mod') || 'presencial';
    const dias = valor('g-dias') || '3';
    const obj = OBJETIVOS[objKey] || OBJETIVOS.tonificar;
    const loc = zona?.value || 'General Rodríguez';
    const franjas = [...form.querySelectorAll('input[data-franja]:checked')].map(i => FRANJAS[i.value]).filter(Boolean);
    const esMujer = !!mujer?.checked;
    if (zonaWrap) zonaWrap.hidden = mod === 'online';

    let tag = 'Entrenamiento personalizado online';
    let modMsg = 'online';
    if (mod === 'presencial') {
      tag = objKey === 'deporte' ? 'Preparador físico en General Rodríguez' : 'Personal trainer en General Rodríguez';
      modMsg = loc === 'General Rodríguez' ? 'presencial en General Rodríguez' : `presencial en General Rodríguez (vivo en ${loc})`;
    } else if (mod === 'domicilio') {
      tag = `Entrenador personal a domicilio · ${loc.charAt(0).toUpperCase()}${loc.slice(1)}`;
      modMsg = `a domicilio en ${loc}`;
    }
    const titulo = esMujer ? 'Entrenamiento para mujeres' : obj.serv;
    const semana = obj.sem[dias] || obj.sem[3];
    const diasTxt = dias === '4' ? '4 o más días' : `${dias} días`;

    plMod.textContent = tag;
    plTit.textContent = titulo;
    plCap.innerHTML = obj.cap.map(c => `<li>${esc(c)}</li>`).join('');
    plSem.innerHTML = semana.map((t, i) => `<li><span class="pl-dia">Día ${i + 1}</span><span>${esc(t)}</span></li>`).join('');
    plNota.textContent = NOTAS[mod];
    plDias.textContent = diasTxt;

    const lineas = [
      'Hola Caballo Crew! Quiero empezar a entrenar.',
      `Objetivo: ${obj.msg}`,
      `Modalidad: ${modMsg}`,
      `Días por semana: ${dias === '4' ? '4 o más' : dias}`,
      `Horario: ${franjas.length ? lista(franjas) : 'a coordinar'}`
    ];
    if (esMujer) lineas.push('Busco un plan pensado para mujeres.');
    lineas.push('¿Me pasás info para arrancar?');
    plCta.href = waLink(lineas.join('\n'));

    if (!primera && cuerpo && !reduceMotion) {
      cuerpo.classList.remove('pl-cambio');
      void cuerpo.offsetWidth;
      cuerpo.classList.add('pl-cambio');
    }
    primera = false;
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  };

  form.addEventListener('change', pintar);
  plCta.addEventListener('click', () => showToast('Abrimos WhatsApp con tu consulta lista para mandar.'));
  pintar();
}

function initDudas() {
  document.querySelectorAll('.duda').forEach(d => d.addEventListener('toggle', () => {
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  }));
}

initWspFloat();
initModelBarScroll();
initNav();
initVisor();
initRail();
initGuia();
initDudas();
initReveals();
initHeroMotion();
