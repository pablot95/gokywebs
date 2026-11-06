const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const WSP = '5491130941048';

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

const refrescar = () => { if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); };

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

function initHeaderScroll() {
  const header = document.querySelector('.m1 .site-header');
  if (!header) return;
  let frame = 0;
  const update = () => { frame = 0; header.classList.toggle('scrolled', window.scrollY > 8); };
  window.addEventListener('scroll', () => { if (!frame) frame = requestAnimationFrame(update); }, { passive: true });
  update();
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

function revelarNuevos(cont) {
  if (!revealsListos || !cont) return;
  const nuevos = [...cont.querySelectorAll('[data-animate]:not(.in)')];
  if (!nuevos.length) return;
  if (reduceMotion) { nuevos.forEach(el => el.classList.add('in')); return; }
  requestAnimationFrame(() => requestAnimationFrame(() => nuevos.forEach((el, i) => {
    const d = Math.min(i * 0.06, 0.6);
    el.style.transitionDelay = `${d}s`;
    el.classList.add('in');
    setTimeout(() => { el.style.transitionDelay = ''; }, (d + 1.2) * 1000);
  })));
}

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const img = hero.querySelector('[data-hero-img]');
  if (img) tl.from(img, { scale: 1.1, duration: 1.8 }, 0);
  tl.from(hero.querySelectorAll('.hero-ficha'), { y: 36, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.05)
    .from(hero.querySelectorAll('h1'), { y: 36, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-regla'), { scaleX: 0, transformOrigin: '0 50%', duration: 1, clearProps: 'transform' }, 0.4)
    .from(hero.querySelectorAll('.hero-lead'), { y: 24, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 20, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.hero-badge'), { scale: 0.92, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.7);
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('[data-parallax]').forEach(fig => {
    const img = fig.querySelector('img');
    if (!img) return;
    gsap.fromTo(img, { yPercent: -3 }, { yPercent: 3, ease: 'none', scrollTrigger: { trigger: fig, start: 'top top', end: 'bottom top', scrub: true } });
  });
}

function initTabs() {
  const lista = document.querySelector('.tabs[role="tablist"]');
  if (!lista) return;
  const tabs = [...lista.querySelectorAll('[role="tab"]')];
  const activar = (tab, foco) => {
    tabs.forEach(t => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      const panel = document.getElementById(t.getAttribute('aria-controls'));
      if (panel) {
        panel.hidden = !on;
        if (on) revelarNuevos(panel);
      }
    });
    if (foco) tab.focus();
    refrescar();
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => activar(t));
    t.addEventListener('keydown', e => {
      let j = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') j = (i + 1) % tabs.length;
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') j = (i - 1 + tabs.length) % tabs.length;
      else if (e.key === 'Home') j = 0;
      else if (e.key === 'End') j = tabs.length - 1;
      if (j !== null) { e.preventDefault(); activar(tabs[j], true); }
    });
  });
}

const HORAS_SEMANA = ['10:00', '11:30', '13:00', '14:30', '16:00', '17:30'];
const HORAS_SABADO = ['10:00', '11:30', '13:00'];
const DIAS_CORTO = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const DIAS_LARGO = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const KEY_TURNOS = 'saomi_turnos';

const isoDe = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const leerTurnos = () => { try { return JSON.parse(localStorage.getItem(KEY_TURNOS)) || []; } catch { return []; } };
const guardarTurno = t => { try { localStorage.setItem(KEY_TURNOS, JSON.stringify([...leerTurnos(), t].slice(-20))); } catch { /* sin almacenamiento */ } };
const hashTxt = s => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
const fechaLarga = f => `${DIAS_LARGO[f.getDay()]} ${f.getDate()} de ${MESES[f.getMonth()]}`;
const minutosDe = h => Number(h.slice(0, 2)) * 60 + Number(h.slice(3, 5));
const duracionTxt = min => {
  const n = Number(min) || 0;
  const h = Math.floor(n / 60);
  const m = n % 60;
  if (!h) return `${m} min`;
  return m ? `${h} h ${m} min` : `${h} h`;
};

function horariosDe(fecha) {
  const base = fecha.getDay() === 6 ? HORAS_SABADO : HORAS_SEMANA;
  const ahora = new Date();
  const iso = isoDe(fecha);
  const esHoy = iso === isoDe(ahora);
  const yaPaso = ahora.getHours() * 60 + ahora.getMinutes() + 60;
  const tomados = leerTurnos();
  return base
    .filter(h => !(esHoy && minutosDe(h) <= yaPaso))
    .map(h => {
      if (tomados.some(t => t.fecha === iso && t.hora === h)) return { h, estado: 'tuyo' };
      if (hashTxt(`${iso}|${h}`) % 100 < 34) return { h, estado: 'ocupado' };
      return { h, estado: 'libre' };
    });
}

function proximosDias(n) {
  const out = [];
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  let vueltas = 0;
  while (out.length < n && vueltas++ < 40) {
    if (d.getDay() !== 0) {
      const hs = horariosDe(d);
      if (hs.length) out.push({ fecha: new Date(d), libres: hs.filter(x => x.estado === 'libre').length });
    }
    d.setDate(d.getDate() + 1);
  }
  return out;
}

function initReserva() {
  const form = document.getElementById('reservaForm');
  if (!form) return;
  const sel = document.getElementById('rServicio');
  const cDias = document.getElementById('rDias');
  const cHoras = document.getElementById('rHoras');
  const libres = document.getElementById('rLibres');
  const nombre = document.getElementById('rNombre');
  const resumen = document.querySelector('#rResumen span');
  const enviar = document.getElementById('rEnviar');
  const errDia = document.getElementById('errDia');
  const errHora = document.getElementById('errHora');
  const errNombre = document.getElementById('errNombre');
  const ok = document.getElementById('reservaOk');
  const okDetalle = document.getElementById('okDetalle');
  const okWsp = document.getElementById('okWsp');
  const okOtro = document.getElementById('okOtro');
  if (!sel || !cDias || !cHoras || !nombre || !resumen || !enviar || !ok) return;
  let dias = [];

  const etiqueta = f => {
    const hoy = new Date();
    const manana = new Date(); manana.setDate(hoy.getDate() + 1);
    if (isoDe(f) === isoDe(hoy)) return 'Hoy';
    if (isoDe(f) === isoDe(manana)) return 'Mañana';
    return DIAS_CORTO[f.getDay()];
  };
  const diaElegido = () => {
    const v = form.querySelector('input[name="dia"]:checked')?.value;
    return dias.find(d => isoDe(d.fecha) === v);
  };
  const datos = () => {
    const op = sel.selectedOptions[0];
    return { d: diaElegido(), h: form.querySelector('input[name="hora"]:checked')?.value, servicio: op?.dataset.nombre || '', min: op?.dataset.min || '' };
  };
  const actualizar = () => {
    const { d, h, servicio, min } = datos();
    if (d && h) resumen.innerHTML = `<strong>${esc(servicio)}</strong> · ${esc(fechaLarga(d.fecha))} · ${esc(h)} h · ${esc(duracionTxt(min))} aprox.`;
    else if (d) resumen.textContent = `${servicio} · ${fechaLarga(d.fecha)}: elegí un horario.`;
    else resumen.textContent = 'Elegí día y horario para ver tu turno.';
  };
  const pintarHoras = () => {
    const d = diaElegido();
    if (!d) { cHoras.innerHTML = ''; libres.textContent = ''; actualizar(); return; }
    const hs = horariosDe(d.fecha);
    cHoras.innerHTML = hs.map(x => {
      const nota = x.estado === 'tuyo' ? '<small>Tuyo</small>' : x.estado === 'ocupado' ? '<small>Ocupado</small>' : '';
      return `<label class="hora hora--${x.estado}"><input type="radio" name="hora" value="${x.h}"${x.estado === 'libre' ? '' : ' disabled'}><span>${x.h}</span>${nota}</label>`;
    }).join('');
    const n = hs.filter(x => x.estado === 'libre').length;
    libres.textContent = `· ${n} ${n === 1 ? 'libre' : 'libres'}`;
    actualizar();
  };
  const pintarDias = () => {
    dias = proximosDias(10);
    const primero = dias.find(d => d.libres > 0);
    cDias.innerHTML = dias.map(d => {
      const iso = isoDe(d.fecha);
      const lleno = d.libres === 0;
      const marcado = primero && iso === isoDe(primero.fecha) ? ' checked' : '';
      const aria = `${fechaLarga(d.fecha)}${lleno ? ', completo' : ''}`;
      return `<label class="dia"><input type="radio" name="dia" value="${iso}" aria-label="${esc(aria)}"${lleno ? ' disabled' : ''}${marcado}><span class="dia-sem" aria-hidden="true">${etiqueta(d.fecha)}</span><span class="dia-num" aria-hidden="true">${d.fecha.getDate()}</span><span class="dia-mes" aria-hidden="true">${lleno ? 'Completo' : MESES[d.fecha.getMonth()].slice(0, 3)}</span></label>`;
    }).join('');
    pintarHoras();
  };

  cDias.addEventListener('change', () => { errDia.hidden = true; pintarHoras(); refrescar(); });
  cHoras.addEventListener('change', () => { errHora.hidden = true; actualizar(); });
  sel.addEventListener('change', actualizar);
  nombre.addEventListener('input', () => {
    if (nombre.value.trim().length >= 2) { nombre.removeAttribute('aria-invalid'); errNombre.hidden = true; }
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const { d, h, servicio, min } = datos();
    const nom = nombre.value.trim();
    errDia.hidden = Boolean(d);
    errHora.hidden = Boolean(h);
    const nombreOk = nom.length >= 2;
    errNombre.hidden = nombreOk;
    if (nombreOk) nombre.removeAttribute('aria-invalid'); else nombre.setAttribute('aria-invalid', 'true');
    if (!d || !h || !nombreOk) {
      showToast('Te falta un dato para reservar.');
      const foco = !d ? cDias.querySelector('input:not(:disabled)') : !h ? cHoras.querySelector('input:not(:disabled)') : nombre;
      foco?.focus();
      refrescar();
      return;
    }
    const etiquetaBoton = enviar.innerHTML;
    enviar.disabled = true;
    enviar.textContent = 'Reservando…';
    setTimeout(() => {
      guardarTurno({ fecha: isoDe(d.fecha), hora: h, servicio, nombre: nom });
      const cuando = fechaLarga(d.fecha);
      okDetalle.textContent = `${nom}, te esperamos el ${cuando} a las ${h} h para ${servicio} (${duracionTxt(min)} aprox.).`;
      const msg = `Hola Saomi, soy ${nom}. Reservé un turno desde la web: ${servicio}, el ${cuando} a las ${h} h.`;
      okWsp.href = `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
      enviar.disabled = false;
      enviar.innerHTML = etiquetaBoton;
      form.hidden = true;
      ok.hidden = false;
      ok.focus({ preventScroll: true });
      showToast('¡Listo! Tu turno quedó reservado.');
      refrescar();
    }, 800);
  });

  okOtro?.addEventListener('click', () => {
    form.reset();
    nombre.removeAttribute('aria-invalid');
    [errDia, errHora, errNombre].forEach(el => { el.hidden = true; });
    ok.hidden = true;
    form.hidden = false;
    pintarDias();
    sel.focus();
    refrescar();
  });

  pintarDias();
}

function initIrTurno() {
  const sel = document.getElementById('rServicio');
  const card = document.getElementById('reserva');
  const seccion = document.getElementById('turno');
  if (!card || !seccion) return;
  const ir = valor => {
    if (valor && sel && [...sel.options].some(o => o.value === valor)) {
      sel.value = valor;
      sel.dispatchEvent(new window.Event('change'));
    }
    const header = document.querySelector('.m1 .site-header');
    const offset = (header ? header.offsetHeight : 0) + 16;
    const escritorioM1 = document.body.classList.contains('m1') && window.matchMedia('(min-width: 961px)').matches;
    const objetivo = escritorioM1 ? seccion : card;
    const corrido = objetivo.matches('[data-animate]:not(.in)') ? 32 : 0;
    const y = objetivo.getBoundingClientRect().top + window.scrollY - offset - corrido + (escritorioM1 ? parseFloat(window.getComputedStyle(seccion).paddingTop) - 24 : 0);
    window.scrollTo({ top: Math.max(0, y), behavior: reduceMotion ? 'auto' : 'smooth' });
    card.classList.remove('destacar');
    void card.offsetWidth;
    card.classList.add('destacar');
    const formVisible = !document.getElementById('reservaForm')?.hidden;
    setTimeout(() => (formVisible && sel ? sel : card).focus({ preventScroll: true }), reduceMotion ? 0 : 800);
  };
  document.querySelectorAll('[data-reservar]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); ir(a.dataset.reservar); }));
  card.addEventListener('animationend', () => card.classList.remove('destacar'));
}

initModelBarScroll();
initWspFloat();
initNav();
initHeaderScroll();
initTabs();
initReserva();
initIrTurno();
initReveals();
initHeroMotion();
initParallax();
