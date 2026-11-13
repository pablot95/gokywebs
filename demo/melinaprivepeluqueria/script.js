const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5493476526303';
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

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

const wspHref = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;

function initWspLinks() {
  document.querySelectorAll('a[data-wsp-msg]').forEach(a => { a.href = wspHref(a.dataset.wspMsg); });
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

function initServicios() {
  const lista = document.querySelector('.serv-tabs');
  if (!lista) return;
  const tabs = [...lista.querySelectorAll('[role="tab"]')];
  const elegir = (tab, enfocar) => {
    tabs.forEach(t => {
      const activo = t === tab;
      t.setAttribute('aria-selected', activo ? 'true' : 'false');
      t.tabIndex = activo ? 0 : -1;
      const panel = document.getElementById(t.getAttribute('aria-controls'));
      if (!panel) return;
      panel.hidden = !activo;
      if (activo && !reduceMotion) {
        panel.classList.remove('entra');
        void panel.offsetWidth;
        panel.classList.add('entra');
      }
    });
    if (enfocar) tab.focus({ preventScroll: true });
    if (lista.scrollWidth > lista.clientWidth + 2) {
      const izq = tab.offsetLeft - (lista.clientWidth - tab.offsetWidth) / 2;
      lista.scrollTo({ left: Math.max(0, izq), behavior: reduceMotion ? 'auto' : 'smooth' });
    }
    refrescar();
  };
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => elegir(tab, false));
    tab.addEventListener('keydown', e => {
      let j = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') j = (i + 1) % tabs.length;
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') j = (i - 1 + tabs.length) % tabs.length;
      else if (e.key === 'Home') j = 0;
      else if (e.key === 'End') j = tabs.length - 1;
      if (j === null) return;
      e.preventDefault();
      elegir(tabs[j], true);
    });
  });
}

function initRailDrag(rail) {
  let x0 = 0;
  let left0 = 0;
  let activo = false;
  let movio = false;
  rail.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'mouse' || e.button !== 0 || rail.scrollWidth <= rail.clientWidth + 2) return;
    activo = true;
    movio = false;
    x0 = e.clientX;
    left0 = rail.scrollLeft;
  });
  window.addEventListener('pointermove', e => {
    if (!activo) return;
    const dx = e.clientX - x0;
    if (!movio && Math.abs(dx) < 6) return;
    if (!movio) { movio = true; rail.classList.add('arrastrando'); }
    rail.scrollLeft = left0 - dx;
  });
  const soltar = () => {
    if (!activo) return;
    activo = false;
    if (movio) {
      rail.dataset.arrastrado = '1';
      rail.classList.remove('arrastrando');
      setTimeout(() => { delete rail.dataset.arrastrado; }, 60);
    }
  };
  window.addEventListener('pointerup', soltar);
  window.addEventListener('pointercancel', soltar);
  rail.addEventListener('click', e => {
    if (rail.dataset.arrastrado) { e.preventDefault(); e.stopPropagation(); }
  }, true);
}

function initGaleria() {
  const gal = document.getElementById('gal');
  if (!gal) return;
  const items = [...gal.querySelectorAll('.gal__item')];

  if (gal.classList.contains('rail')) {
    initRailDrag(gal);
    const prev = document.querySelector('.rail-nav__btn[data-dir="-1"]');
    const next = document.querySelector('.rail-nav__btn[data-dir="1"]');
    const inicio = () => parseFloat(window.getComputedStyle(gal).paddingInlineStart) || 0;
    const flechas = () => {
      const max = gal.scrollWidth - gal.clientWidth;
      if (prev) prev.disabled = gal.scrollLeft <= 4;
      if (next) next.disabled = gal.scrollLeft >= max - 4;
    };
    document.querySelectorAll('.rail-nav__btn').forEach(b => b.addEventListener('click', () => {
      const paso = Math.max(260, (gal.clientWidth - inicio()) * 0.7) * Number(b.dataset.dir);
      gal.scrollBy({ left: paso, behavior: reduceMotion ? 'auto' : 'smooth' });
    }));
    gal.addEventListener('scroll', flechas, { passive: true });
    window.addEventListener('resize', flechas, { passive: true });
    flechas();
  }

  const visor = document.getElementById('visor');
  if (!visor) return;
  const img = visor.querySelector('.visor__img');
  const cap = visor.querySelector('.visor__cap');
  const num = visor.querySelector('.visor__n');
  const pedir = visor.querySelector('.visor__pedir');
  const cerrarBtn = visor.querySelector('.visor__cerrar');
  let idx = 0;
  let previo = null;
  const pintar = () => {
    const foto = items[idx].querySelector('img');
    const nombre = items[idx].dataset.cap || '';
    img.src = foto.currentSrc || foto.src;
    img.alt = foto.alt;
    img.width = foto.naturalWidth || Number(foto.getAttribute('width'));
    img.height = foto.naturalHeight || Number(foto.getAttribute('height'));
    cap.textContent = nombre;
    num.textContent = `${idx + 1} / ${items.length}`;
    if (pedir) pedir.href = wspHref(`Hola Melina! Vi la foto de ${nombre.toLowerCase()} en tu web y quiero un turno para algo así.`);
  };
  const abrir = i => {
    idx = i;
    previo = document.activeElement;
    pintar();
    visor.hidden = false;
    document.body.classList.add('no-scroll');
    requestAnimationFrame(() => visor.classList.add('abierto'));
    cerrarBtn.focus();
  };
  const cerrar = () => {
    visor.classList.remove('abierto');
    visor.hidden = true;
    document.body.classList.remove('no-scroll');
    previo?.focus({ preventScroll: true });
  };
  const mover = d => { idx = (idx + d + items.length) % items.length; pintar(); };
  items.forEach((it, i) => it.addEventListener('click', () => abrir(i)));
  cerrarBtn.addEventListener('click', cerrar);
  visor.querySelector('.visor__prev').addEventListener('click', () => mover(-1));
  visor.querySelector('.visor__next').addEventListener('click', () => mover(1));
  visor.querySelector('.visor__fondo').addEventListener('click', cerrar);
  document.addEventListener('keydown', e => {
    if (visor.hidden) return;
    if (e.key === 'Escape') { e.preventDefault(); cerrar(); }
    else if (e.key === 'ArrowLeft') mover(-1);
    else if (e.key === 'ArrowRight') mover(1);
    else if (e.key === 'Tab') {
      const focos = [...visor.querySelectorAll('button, a[href]')];
      const i = focos.indexOf(document.activeElement);
      e.preventDefault();
      focos[(i + (e.shiftKey ? -1 : 1) + focos.length) % focos.length].focus();
    }
  });
}

const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const DIAS_C = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const MESES_C = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const HORAS = ['9:30', '11:00', '12:30', '15:00', '16:30', '18:00'];
const HORAS_VACIO = '<p class="horas__vacio">Elegí un día y te muestro los horarios.</p>';

function proximosDias(cantidad) {
  const f = new Date();
  f.setHours(12, 0, 0, 0);
  const lista = [];
  while (lista.length < cantidad) {
    f.setDate(f.getDate() + 1);
    if (f.getDay() !== 0) lista.push(new Date(f));
  }
  return lista;
}

const claveDia = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

function horarioOcupado(clave, hora) {
  let s = 7;
  for (const c of clave + hora) s = (s * 31 + c.charCodeAt(0)) % 1009;
  return s % 3 === 0;
}

function initReserva() {
  const form = document.getElementById('reserva');
  if (!form) return;
  const diasBox = document.getElementById('dias');
  const horasBox = document.getElementById('horas');
  const salida = k => form.querySelector(`[data-r="${k}"]`);
  const elegido = n => form.querySelector(`input[name="${n}"]:checked`);
  const nombre = form.elements.nombre;
  const nota = form.elements.nota;
  const enviar = form.querySelector('.resumen__enviar');

  diasBox.innerHTML = proximosDias(12).map(d => {
    const largo = `${DIAS[d.getDay()]} ${d.getDate()} de ${MESES[d.getMonth()]}`;
    return `<label class="dia"><input type="radio" name="dia" value="${claveDia(d)}" data-largo="${largo}" aria-label="${largo}">`
      + `<span class="dia__d">${DIAS_C[d.getDay()]}</span><span class="dia__n">${d.getDate()}</span><span class="dia__m">${MESES_C[d.getMonth()]}</span></label>`;
  }).join('');

  const pintarHoras = clave => {
    horasBox.innerHTML = HORAS.map(h => {
      const ocupado = horarioOcupado(clave, h);
      return `<label class="hora${ocupado ? ' hora--ocupada' : ''}"><input type="radio" name="hora" value="${h}"${ocupado ? ' disabled' : ''} aria-label="${h} h${ocupado ? ', no disponible' : ''}"><span>${h}</span></label>`;
    }).join('');
  };

  const marcar = (id, msg) => {
    const p = document.getElementById(id);
    if (p) { p.textContent = msg || ''; p.hidden = !msg; }
    if (id === 'err-nombre') {
      nombre.setAttribute('aria-invalid', msg ? 'true' : 'false');
      nombre.closest('.campo')?.classList.toggle('error', Boolean(msg));
    }
  };

  const actualizar = () => {
    const s = elegido('servicio');
    const d = elegido('dia');
    const h = elegido('hora');
    const poner = (k, v, vacio = 'Sin elegir') => {
      const el = salida(k);
      if (!el) return;
      el.textContent = v || vacio;
      el.classList.toggle('listo', Boolean(v));
    };
    poner('servicio', s?.value);
    poner('dia', d?.dataset.largo);
    poner('hora', h ? `${h.value} h` : '');
    poner('dur', s?.dataset.dur, '—');
  };

  form.addEventListener('change', e => {
    const t = e.target;
    if (t.name === 'dia') { pintarHoras(t.value); marcar('err-dia', ''); marcar('err-hora', ''); }
    if (t.name === 'servicio') marcar('err-servicio', '');
    if (t.name === 'hora') marcar('err-hora', '');
    actualizar();
    refrescar();
  });
  nombre.addEventListener('input', () => marcar('err-nombre', ''));

  document.querySelectorAll('[data-servicio]').forEach(a => a.addEventListener('click', () => {
    const radio = [...form.querySelectorAll('input[name="servicio"]')].find(i => i.value === a.dataset.servicio);
    if (!radio) return;
    radio.checked = true;
    marcar('err-servicio', '');
    actualizar();
  }));

  form.addEventListener('submit', e => {
    e.preventDefault();
    const s = elegido('servicio');
    const d = elegido('dia');
    const h = elegido('hora');
    const quien = nombre.value.trim();
    let primero = null;
    if (!s) { marcar('err-servicio', 'Elegí qué servicio querés reservar.'); primero = primero || form.querySelector('input[name="servicio"]'); }
    if (!d) { marcar('err-dia', 'Elegí un día.'); primero = primero || form.querySelector('input[name="dia"]'); }
    else if (!h) { marcar('err-hora', 'Elegí uno de los horarios libres.'); primero = primero || form.querySelector('input[name="hora"]:not(:disabled)'); }
    if (quien.length < 2) { marcar('err-nombre', 'Contame tu nombre así sé a quién le respondo.'); primero = primero || nombre; }
    if (primero) {
      primero.focus();
      showToast('Te falta completar un paso para armar el pedido.');
      return;
    }
    let msg = `Hola Melina! Soy ${quien}. Quiero pedir un turno para ${s.value} el ${d.dataset.largo} a las ${h.value} h.`;
    if (nota.value.trim()) msg += ` ${nota.value.trim()}`;
    msg += ' ¿Me confirmás si está libre?';
    enviar.disabled = true;
    window.open(wspHref(msg), '_blank', 'noopener');
    showToast('Te abrimos WhatsApp con tu pedido listo para enviar.');
    setTimeout(() => {
      enviar.disabled = false;
      form.reset();
      horasBox.innerHTML = HORAS_VACIO;
      actualizar();
    }, 800);
  });

  actualizar();
}

function initFaq() {
  document.querySelectorAll('.faq__item').forEach(d => d.addEventListener('toggle', refrescar));
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
  const paso = (sel, vars, t) => {
    const els = hero.querySelectorAll(sel);
    if (els.length) tl.from(els, vars, t);
  };
  paso('[data-hero-img]', { scale: 1.08, duration: 1.8 }, 0);
  paso('.hero-eyebrow', { y: 16, opacity: 0, duration: 0.9 }, 0.1);
  paso('h1', { y: 30, opacity: 0, filter: 'blur(8px)', duration: 1.1, clearProps: 'filter' }, 0.2);
  paso('.hero-lead', { y: 22, opacity: 0, duration: 1 }, 0.4);
  paso('.trazo__svg path', { strokeDashoffset: 1, duration: 1.1, ease: 'power2.inOut' }, 0.55);
  paso('.hero-ctas .btn', { y: 18, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.55);
  paso('.hero__sello, .hero-ficha', { scale: 0.92, opacity: 0, duration: 1, clearProps: 'transform,opacity' }, 0.65);
  paso('.hero-ficha__datos li', { y: 12, opacity: 0, duration: 0.6, stagger: 0.06, clearProps: 'transform,opacity' }, 0.75);
  const fondo = hero.querySelector('.hero__fondo img');
  if (fondo && typeof ScrollTrigger !== 'undefined') {
    gsap.to(fondo, { yPercent: 4, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
  }
}

[initWspLinks, initModelBarScroll, initWspFloat, initNav, initServicios, initGaleria, initReserva, initFaq, initReveals, initHeroMotion].forEach(fn => {
  try { fn(); } catch (e) { console.error(e); }
});
