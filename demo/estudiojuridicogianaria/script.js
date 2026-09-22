const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5492914260708';

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

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

const AGENDA = {
  dias: [1, 2, 3, 4, 5],
  tramos: [[9 * 60, 13 * 60], [15 * 60, 18 * 60]],
  paso: 45,
  anticipacion: 120
};

const AREAS = {
  familia: 'Familia',
  contratos: 'Contratos',
  laboral: 'Laboral',
  inmobiliario: 'Inmobiliario',
  previsional: 'Previsional',
  amparos: 'Amparos',
  carta: 'Carta documento'
};

const MODOS = { estudio: 'en el estudio', video: 'por videollamada' };

const capitalizar = s => s.charAt(0).toUpperCase() + s.slice(1);
const dosDigitos = n => String(n).padStart(2, '0');

function nombreDia(fecha) {
  const hoy = new Date();
  const soloDia = d => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const dif = Math.round((soloDia(fecha) - soloDia(hoy)) / 86400000);
  if (dif === 0) return 'Hoy';
  if (dif === 1) return 'Mañana';
  const dia = fecha.toLocaleDateString('es-AR', { weekday: 'long' });
  const mes = fecha.toLocaleDateString('es-AR', { month: 'long' });
  return `${capitalizar(dia)} ${fecha.getDate()} de ${mes}`;
}

function buscarTurnos(franja, cantidad) {
  const ahora = new Date();
  const limite = ahora.getTime() + AGENDA.anticipacion * 60000;
  const salida = [];
  for (let d = 0; d < 24 && salida.length < cantidad; d++) {
    const fecha = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate() + d);
    if (!AGENDA.dias.includes(fecha.getDay())) continue;
    for (const tramo of AGENDA.tramos) {
      if (franja === 'manana' && tramo[0] >= 13 * 60) continue;
      if (franja === 'tarde' && tramo[0] < 13 * 60) continue;
      for (let m = tramo[0]; m + AGENDA.paso <= tramo[1]; m += AGENDA.paso) {
        const inicio = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate(), Math.floor(m / 60), m % 60);
        if (inicio.getTime() < limite) continue;
        salida.push(inicio);
        if (salida.length >= cantidad) break;
      }
      if (salida.length >= cantidad) break;
    }
  }
  return salida;
}

function initTurnero() {
  const caja = document.getElementById('turnero');
  if (!caja) return;
  const contenedor = document.getElementById('turneroSlots');
  const frase = document.getElementById('turneroFrase');
  const cta = document.getElementById('turneroCta');
  const estado = { area: 'familia', modo: 'estudio', franja: 'cualquiera', elegido: 0 };
  let turnos = [];

  const armarMensaje = () => {
    const areaNombre = AREAS[estado.area];
    const modo = MODOS[estado.modo];
    const turno = turnos[estado.elegido];
    if (!turno) return `Hola, quiero pedir un turno por ${areaNombre}, ${modo}. ¿Qué día tienen?`;
    const cuando = nombreDia(turno).toLowerCase();
    const hora = `${dosDigitos(turno.getHours())}:${dosDigitos(turno.getMinutes())}`;
    return `Hola, quiero pedir un turno por ${areaNombre}, ${modo}. ¿Puede ser ${cuando} a las ${hora}?`;
  };

  const pintarCta = () => {
    const msg = armarMensaje();
    cta.dataset.wspMsg = msg;
    cta.href = `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
  };

  const pintar = () => {
    turnos = buscarTurnos(estado.franja, 3);
    if (estado.elegido >= turnos.length) estado.elegido = 0;
    contenedor.innerHTML = turnos.map((t, i) => `
      <button type="button" class="slot" data-slot="${i}" aria-pressed="${i === estado.elegido}">
        <span class="slot__dia">${esc(nombreDia(t))}</span>
        <span class="slot__hora">${dosDigitos(t.getHours())}:${dosDigitos(t.getMinutes())}</span>
        ${i === 0 ? '<span class="slot__eti">El más cercano</span>' : ''}
      </button>`).join('');
    const primero = turnos[0];
    if (primero) {
      frase.innerHTML = `Para <b>${esc(AREAS[estado.area])}</b>, ${esc(MODOS[estado.modo])}, el turno más cercano es <b>${esc(nombreDia(primero).toLowerCase())} a las ${dosDigitos(primero.getHours())}:${dosDigitos(primero.getMinutes())}</b>.`;
    } else {
      frase.textContent = 'Esta semana no quedan turnos en esa franja. Escribinos y buscamos uno.';
    }
    contenedor.querySelectorAll('.slot').forEach(btn => {
      btn.addEventListener('click', () => {
        estado.elegido = Number(btn.dataset.slot);
        contenedor.querySelectorAll('.slot').forEach(b => b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'));
        pintarCta();
        const t = turnos[estado.elegido];
        showToast(`Turno elegido: ${nombreDia(t).toLowerCase()} a las ${dosDigitos(t.getHours())}:${dosDigitos(t.getMinutes())}`);
      });
    });
    pintarCta();
  };

  caja.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const grupo = chip.dataset.area ? 'area' : chip.dataset.modo ? 'modo' : 'franja';
      const valor = chip.dataset.area || chip.dataset.modo || chip.dataset.franja;
      estado[grupo] = valor;
      if (grupo === 'franja') estado.elegido = 0;
      const attr = grupo === 'area' ? 'data-area' : grupo === 'modo' ? 'data-modo' : 'data-franja';
      caja.querySelectorAll(`[${attr}]`).forEach(b => b.setAttribute('aria-pressed', b === chip ? 'true' : 'false'));
      pintar();
    });
  });

  document.querySelectorAll('[data-preset-area]').forEach(link => {
    link.addEventListener('click', () => {
      const area = link.dataset.presetArea;
      const chip = caja.querySelector(`[data-area="${area}"]`);
      if (!chip) return;
      estado.area = area;
      caja.querySelectorAll('[data-area]').forEach(b => b.setAttribute('aria-pressed', b === chip ? 'true' : 'false'));
      pintar();
      const select = document.getElementById('f-tema');
      if (select) select.value = area;
    });
  });

  pintar();
}

function initEstado() {
  const cajas = document.querySelectorAll('[data-estado]');
  if (!cajas.length) return;
  const ahora = new Date();
  const min = ahora.getHours() * 60 + ahora.getMinutes();
  const laborable = AGENDA.dias.includes(ahora.getDay());
  let texto = '';
  let abierto = false;
  if (laborable) {
    for (const tramo of AGENDA.tramos) {
      if (min >= tramo[0] && min < tramo[1]) {
        abierto = true;
        texto = `Abierto ahora · hasta las ${tramo[1] / 60} h`;
        break;
      }
    }
  }
  if (!abierto) {
    const proximo = AGENDA.tramos.find(t => laborable && min < t[0]);
    if (proximo) {
      texto = `Cerrado · abrimos hoy a las ${proximo[0] / 60} h`;
    } else {
      let d = 1;
      while (!AGENDA.dias.includes(new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate() + d).getDay())) d++;
      const fecha = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate() + d);
      const cuando = d === 1 ? 'mañana' : `el ${fecha.toLocaleDateString('es-AR', { weekday: 'long' })}`;
      texto = `Cerrado · abrimos ${cuando} a las 9 h`;
    }
  }
  cajas.forEach(caja => {
    caja.classList.toggle('estado--cerrado', !abierto);
    const span = caja.querySelector('[data-estado-texto]');
    if (span) span.textContent = texto;
  });
}

function initEscena() {
  const escena = document.getElementById('escena');
  if (!escena) return;
  const sticky = escena.querySelector('.escena__sticky');
  const horas = document.getElementById('escenaHoras');
  const etiqueta = document.getElementById('escenaEtiqueta');
  if (!sticky || !horas) return;
  const OFF = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--gw-modelos-h')) || 0;
  let pedido = false;

  const aplicar = p => {
    escena.style.setProperty('--p', `${(100 - p * 100).toFixed(2)}%`);
    horas.textContent = dosDigitos(Math.round(p * 48));
    const fin = p > 0.92;
    escena.classList.toggle('escena--fin', fin);
    if (etiqueta) etiqueta.textContent = fin ? 'h · contestada en término' : 'h desde que llegó';
  };

  if (reduceMotion) { aplicar(1); return; }

  const pintar = () => {
    pedido = false;
    const recorrido = escena.offsetHeight - sticky.offsetHeight;
    const avance = OFF - escena.getBoundingClientRect().top;
    aplicar(Math.min(1, Math.max(0, avance / (recorrido || 1))));
  };
  const pedir = () => { if (!pedido) { pedido = true; requestAnimationFrame(pintar); } };
  window.addEventListener('scroll', pedir, { passive: true });
  window.addEventListener('resize', pedir, { passive: true });
  window.addEventListener('load', pintar);
  pintar();
}

function initForm() {
  const form = document.getElementById('formContacto');
  if (!form) return;
  const boton = document.getElementById('formEnviar');
  const campos = [
    { input: form.querySelector('#f-nombre'), error: form.querySelector('#e-nombre'), test: v => v.trim().length >= 2, msg: 'Poné tu nombre para saber cómo llamarte.' },
    { input: form.querySelector('#f-tel'), error: form.querySelector('#e-tel'), test: v => v.replace(/\D/g, '').length >= 8, msg: 'Un teléfono con característica, así te podemos contestar.' },
    { input: form.querySelector('#f-msg'), error: form.querySelector('#e-msg'), test: v => v.trim().length >= 10, msg: 'Contanos aunque sea en dos renglones qué pasó.' }
  ];
  campos.forEach(campo => {
    campo.input?.addEventListener('input', () => {
      if (campo.test(campo.input.value)) {
        campo.input.removeAttribute('aria-invalid');
        campo.error.textContent = '';
      }
    });
  });
  form.addEventListener('submit', e => {
    e.preventDefault();
    let ok = true;
    campos.forEach(campo => {
      if (!campo.input) return;
      if (campo.test(campo.input.value)) {
        campo.input.removeAttribute('aria-invalid');
        campo.error.textContent = '';
      } else {
        campo.input.setAttribute('aria-invalid', 'true');
        campo.error.textContent = campo.msg;
        ok = false;
      }
    });
    if (!ok) { campos.find(c => c.input?.getAttribute('aria-invalid'))?.input.focus(); return; }
    const textoOriginal = boton.textContent;
    boton.disabled = true;
    boton.textContent = 'Enviando…';
    setTimeout(() => {
      boton.disabled = false;
      boton.textContent = textoOriginal;
      form.reset();
      showToast('¡Gracias! El envío de mensajes se activa al pasar la web a producción.');
    }, 800);
  });
}

function initMovimiento() {
  if (typeof gsap === 'undefined') {
    document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
    return;
  }
  if (typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
  if (reduceMotion) return;

  const heroImg = document.querySelector('.hero__foto img, .hero__banda img');
  if (heroImg) gsap.fromTo(heroImg, { scale: 1.07 }, { scale: 1, duration: 1.4, ease: 'power2.out' });

  if (typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('.estudio__ancha img, .areas__foto img, .zig__media img').forEach(img => {
    gsap.fromTo(img, { yPercent: -4 }, {
      yPercent: 4, ease: 'none',
      scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true }
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
  initTurnero();
  initEscena();
  initForm();
  initMovimiento();
  initReveals();
});
