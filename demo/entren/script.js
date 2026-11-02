const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5493434172904';
const SESIONES = {"tecnificacion": {"tab": "Tecnificación", "foco": "tecnificación", "fases": [{"t": "Activación con balón", "m": 15, "d": "Movilidad, coordinación y toques para despertar el pie."}, {"t": "Rondo 4 contra 1", "m": 10, "d": "Pase a uno o dos toques, perfil corporal y apoyos."}, {"t": "Circuito técnico", "m": 25, "d": "Control orientado, conducción y cambio de ritmo con las dos piernas."}, {"t": "Juego reducido 3 contra 3", "m": 25, "d": "El gesto técnico con oposición y poco espacio."}, {"t": "Vuelta a la calma", "m": 15, "d": "Estiramientos y devolución individual del entrenador."}]}, "tactica": {"tab": "Táctica", "foco": "táctica", "fases": [{"t": "Activación con balón", "m": 15, "d": "Movilidad, coordinación y toques para despertar el pie."}, {"t": "Rondo de posesión 5 contra 2", "m": 15, "d": "Circulación, líneas de pase y escaneo antes de recibir."}, {"t": "Juego de posición", "m": 25, "d": "Ocupar espacios, generar superioridad y encontrar al tercer hombre."}, {"t": "Partido condicionado", "m": 25, "d": "Reglas que obligan a aplicar la idea: presión tras pérdida y salida desde atrás."}, {"t": "Vuelta a la calma", "m": 10, "d": "Repaso de la tarea en la pizarra."}]}, "fisico": {"tab": "Físico específico", "foco": "preparación física", "fases": [{"t": "Activación y movilidad", "m": 15, "d": "Entrada en calor progresiva, con y sin pelota."}, {"t": "Coordinación y velocidad", "m": 20, "d": "Escalera, vallas bajas y apoyos rápidos: agilidad y reacción."}, {"t": "Fuerza y prevención", "m": 20, "d": "Core, estabilidad y excéntricos para cuidar isquiotibiales y aductores."}, {"t": "Juego reducido intenso", "m": 25, "d": "Esfuerzos repetidos con pelota, como en el partido."}, {"t": "Vuelta a la calma", "m": 10, "d": "Estiramientos y respiración."}]}, "finalizacion": {"tab": "Finalización", "foco": "finalización", "fases": [{"t": "Activación con balón", "m": 15, "d": "Movilidad, coordinación y toques para despertar el pie."}, {"t": "Golpeo y remate", "m": 20, "d": "Empeine, interior y borde externo; perfil para rematar de primera."}, {"t": "Finalización tras pared", "m": 20, "d": "Desmarque de ruptura, pared y definición frente al arquero."}, {"t": "2 contra 1 con arquero", "m": 25, "d": "Atacar con ventaja y decidir: pase o remate."}, {"t": "Vuelta a la calma", "m": 10, "d": "Estiramientos y devolución individual del entrenador."}]}};
const FOCOS = {"tecnificacion": "Tecnificación", "tactica": "Táctica", "lectura": "Lectura de juego", "fisico": "Físico", "finalizacion": "Finalización"};
const MSG_GENERAL = "Hola ENTREN! Quiero coordinar un entrenamiento de fútbol. ¿Qué turnos tienen disponibles?";

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

function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function waUrl(msg) {
  return `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
}

function refrescar() {
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
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
  const desktopMq = window.matchMedia('(min-width: 981px)');
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

let revealsListos = false;
function initReveals() {
  revealsListos = true;
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
  const img = hero.querySelector('[data-hero-img]');
  if (img) tl.from(img, { scale: 1.1, duration: 1.8 }, 0);
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.sello, .hero-ficha-in, .hero-badge'), { scale: 0.92, opacity: 0, duration: 1.1, stagger: 0.1, clearProps: 'transform,opacity' }, 0.65);
}

function initFichaAlto() {
  const ficha = document.querySelector('.hero-ficha');
  if (!ficha) return;
  const medir = () => {
    document.documentElement.style.setProperty('--ficha-h', `${Math.round(ficha.getBoundingClientRect().height)}px`);
  };
  medir();
  window.addEventListener('resize', medir, { passive: true });
  window.addEventListener('load', () => { medir(); refrescar(); });
}

function teclasTabs(tabs, i, e, elegir) {
  let j = -1;
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') j = (i + 1) % tabs.length;
  else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') j = (i - 1 + tabs.length) % tabs.length;
  else if (e.key === 'Home') j = 0;
  else if (e.key === 'End') j = tabs.length - 1;
  if (j < 0) return;
  e.preventDefault();
  elegir(tabs[j], true);
}

function initTabs() {
  document.querySelectorAll('[data-tabs]').forEach(box => {
    const tabs = [...box.querySelectorAll('[role="tab"]')];
    const elegir = (tab, foco) => {
      tabs.forEach(t => {
        const on = t === tab;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
        const panel = document.getElementById(t.getAttribute('aria-controls'));
        if (!panel) return;
        panel.hidden = !on;
        if (on && !reduceMotion) { panel.classList.remove('entra'); void panel.offsetWidth; panel.classList.add('entra'); }
      });
      if (foco) tab.focus();
      refrescar();
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => elegir(t));
      t.addEventListener('keydown', e => teclasTabs(tabs, i, e, elegir));
    });
  });
}

function initSesion() {
  const wrap = document.querySelector('.pizarra');
  if (!wrap) return;
  const tabs = [...wrap.querySelectorAll('.foco')];
  const barra = wrap.querySelector('.plan-barra');
  const lista = wrap.querySelector('.fases');
  const plan = document.getElementById('sesion-plan');
  const btn = document.getElementById('sesionWsp');
  const focoTxt = document.getElementById('sesionFoco');
  const elegir = (tab, foco) => {
    const s = SESIONES[tab.dataset.foco];
    if (!s) return;
    tabs.forEach(t => {
      const on = t === tab;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
    });
    plan?.setAttribute('aria-labelledby', tab.id);
    const segs = [...(barra?.children || [])];
    s.fases.forEach((f, i) => {
      const seg = segs[i];
      if (!seg) return;
      seg.style.setProperty('--m', f.m);
      const b = seg.querySelector('b');
      if (b) b.textContent = `${f.m}'`;
    });
    if (lista) {
      lista.innerHTML = s.fases.map(f => `<li class="fase${reduceMotion ? '' : ' entra'}"><span class="fase-min">${f.m}'</span><div><h3 class="fase-t">${esc(f.t)}</h3><p>${esc(f.d)}</p></div></li>`).join('');
    }
    if (focoTxt) focoTxt.textContent = s.foco;
    if (btn) btn.href = waUrl(`Hola ENTREN! Me interesa una sesión con foco en ${s.foco}. ¿Qué turnos tienen?`);
    if (foco) tab.focus();
    refrescar();
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => elegir(t));
    t.addEventListener('keydown', e => teclasTabs(tabs, i, e, elegir));
  });
}

function initRail() {
  document.querySelectorAll('[data-rail]').forEach(rail => {
    const vp = rail.querySelector('.rail-vp');
    const track = rail.querySelector('.rail-track');
    if (!vp || !track) return;
    const sec = rail.closest('section');
    const prev = sec?.querySelector('[data-rail-prev]');
    const next = sec?.querySelector('[data-rail-next]');
    const paso = () => {
      const item = track.children[0];
      const gap = parseFloat(getComputedStyle(track).columnGap) || 16;
      return (item ? item.getBoundingClientRect().width : 300) + gap;
    };
    const estado = () => {
      if (prev) prev.disabled = vp.scrollLeft <= 2;
      if (next) next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
    };
    prev?.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
    next?.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
    vp.addEventListener('scroll', estado, { passive: true });
    window.addEventListener('resize', estado, { passive: true });
    estado();

    let down = false;
    let moved = false;
    let x0 = 0;
    let s0 = 0;
    let pid = 0;
    vp.addEventListener('pointerdown', e => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      down = true; moved = false; x0 = e.clientX; s0 = vp.scrollLeft; pid = e.pointerId;
    });
    vp.addEventListener('pointermove', e => {
      if (!down) return;
      const dx = e.clientX - x0;
      if (!moved && Math.abs(dx) > 6) {
        moved = true;
        vp.classList.add('dragging');
        try { vp.setPointerCapture?.(pid); } catch (err) { /* sin captura igual arrastra */ }
      }
      if (moved) vp.scrollLeft = s0 - dx;
    });
    const fin = () => {
      if (!down) return;
      down = false;
      try { vp.releasePointerCapture?.(pid); } catch (err) { /* ya liberado */ }
      if (moved) {
        vp.addEventListener('click', ev => { ev.preventDefault(); ev.stopPropagation(); }, { capture: true, once: true });
        setTimeout(() => vp.classList.remove('dragging'), 0);
      }
    };
    vp.addEventListener('pointerup', fin);
    vp.addEventListener('pointercancel', fin);
    vp.addEventListener('lostpointercapture', fin);
    vp.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') { e.preventDefault(); vp.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); vp.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }); }
    });
  });
}

const CATEGORIAS = {
  infantiles: { t: 'Infantiles · 7 a 12', msg: 'Infantiles (7 a 12)', n: 1, etapa: 'formación', arranque: 'tecnificacion' },
  juveniles: { t: 'Juveniles · 13 a 17', msg: 'Juveniles (13 a 17)', n: 2, etapa: 'perfeccionamiento', arranque: 'tactica' },
  mayores: { t: 'Mayores · +18', msg: 'Mayores (+18)', n: 3, etapa: 'rendimiento', arranque: 'fisico' }
};
const ARRANQUES = {
  tecnificacion: 'tecnificación individual',
  tactica: 'preparación técnico-táctica',
  lectura: 'inteligencia de juego',
  fisico: 'preparación física específica',
  finalizacion: 'finalización'
};
const FORMATOS_TXT = { grupal: 'Grupal', personalizado: 'Personalizado' };

function listaY(arr) {
  if (arr.length < 2) return arr.join('');
  return `${arr.slice(0, -1).join(', ')} y ${arr[arr.length - 1]}`;
}

function initGuia() {
  const form = document.getElementById('guia');
  if (!form) return;
  const $ = id => document.getElementById(id);
  const nombre = $('g-nombre');
  const edad = $('g-edad');
  const ayuda = $('g-edad-ayuda');
  const puesto = $('g-puesto');
  const catBox = $('g-cat');
  const catErr = $('g-cat-error');
  const btn = $('guiaWsp');
  const ayudaBase = ayuda ? ayuda.textContent : '';
  const valor = n => form.querySelector(`input[name="${n}"]:checked`)?.value || '';
  const focos = () => [...form.querySelectorAll('input[data-f="foco"]:checked')].map(i => i.value);

  const mensaje = d => {
    const lineas = ['Hola ENTREN! Quiero coordinar un entrenamiento.'];
    if (d.nombre || d.edad) lineas.push(`• Jugador/a: ${[d.nombre, d.edad ? `${d.edad} años` : ''].filter(Boolean).join(', ')}`);
    if (d.cat) lineas.push(`• Categoría: ${CATEGORIAS[d.cat].msg}`);
    if (d.formato) lineas.push(`• Formato: ${FORMATOS_TXT[d.formato]}`);
    if (d.turno) lineas.push(`• Turno que me queda mejor: ${d.turno}`);
    if (d.puesto) lineas.push(`• Puesto: ${d.puesto}`);
    if (d.focos.length) lineas.push(`• Quiero mejorar: ${listaY(d.focos.map(f => FOCOS[f]))}`);
    lineas.push('¿Qué días y horarios tienen disponibles?');
    return lineas.join('\n');
  };

  const pintar = () => {
    const e = parseInt(edad?.value, 10);
    const d = {
      nombre: (nombre?.value || '').trim(),
      edad: e >= 7 && e <= 70 ? e : 0,
      cat: valor('cat'),
      formato: valor('formato'),
      turno: valor('turno'),
      puesto: puesto?.value || '',
      focos: focos()
    };
    const c = CATEGORIAS[d.cat];
    $('fNombre').textContent = d.nombre || 'Tu nombre';
    $('fCat').textContent = c ? c.t : 'A elegir';
    $('fSenal')?.setAttribute('data-n', c ? String(c.n) : '0');
    $('fFormato').textContent = d.formato ? FORMATOS_TXT[d.formato] : 'A elegir';
    $('fTurno').textContent = d.turno ? d.turno.charAt(0).toUpperCase() + d.turno.slice(1) : 'A elegir';
    $('fPuesto').textContent = d.puesto || 'Todavía no sé';
    $('fFocos').textContent = d.focos.length ? listaY(d.focos.map(f => FOCOS[f])) : 'A elegir';
    const arr = $('fArranque');
    if (arr) {
      if (c) {
        const k = d.focos[0] || c.arranque;
        arr.textContent = `Para arrancar: una sesión de ${ARRANQUES[k]}, en la etapa de ${c.etapa}.`;
      } else {
        arr.textContent = 'Elegí la categoría y te sugerimos por dónde empezar.';
      }
    }
    if (d.cat) { catBox?.classList.remove('campo--error'); if (catErr) catErr.hidden = true; }
    if (btn) btn.href = waUrl(d.cat ? mensaje(d) : MSG_GENERAL);
  };

  edad?.addEventListener('input', () => {
    const e = parseInt(edad.value, 10);
    if (ayuda) { ayuda.textContent = ayudaBase; ayuda.classList.remove('mal'); }
    if (!e) { pintar(); return; }
    if (e < 7) {
      if (ayuda) { ayuda.textContent = 'Entrenamos desde los 7 años.'; ayuda.classList.add('mal'); }
      form.querySelectorAll('input[name="cat"]').forEach(r => { r.checked = false; });
    } else {
      const k = e <= 12 ? 'infantiles' : e <= 17 ? 'juveniles' : 'mayores';
      const r = form.querySelector(`input[name="cat"][value="${k}"]`);
      if (r) r.checked = true;
    }
    pintar();
  });

  form.querySelectorAll('input[data-f="foco"]').forEach(cb => {
    cb.addEventListener('change', () => {
      if (cb.checked && focos().length > 2) {
        cb.checked = false;
        showToast('Elegí hasta 2: así enfocamos mejor la primera sesión.');
      }
      pintar();
    });
  });

  form.addEventListener('input', pintar);
  form.addEventListener('change', pintar);

  btn?.addEventListener('click', e => {
    if (valor('cat')) return;
    e.preventDefault();
    catBox?.classList.add('campo--error');
    if (catErr) catErr.hidden = false;
    showToast('Elegí la categoría para que te pasemos los turnos.');
    const primero = form.querySelector('input[name="cat"]');
    catBox?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
    setTimeout(() => primero?.focus({ preventScroll: true }), reduceMotion ? 0 : 450);
  });

  pintar();
}

function initDudas() {
  document.querySelectorAll('details.duda').forEach(d => d.addEventListener('toggle', refrescar));
}

initWspFloat();
initNav();
initModelBarScroll();
initFichaAlto();
initTabs();
initSesion();
initRail();
initGuia();
initDudas();
initReveals();
initHeroMotion();
