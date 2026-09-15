document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}
if (typeof gsap === 'undefined') {
  document.querySelectorAll('[data-animate]').forEach(el => {
    el.style.opacity = 1; el.style.transform = 'none'; el.style.clipPath = 'none';
  });
}
if (typeof ScrollTrigger !== 'undefined') {
  window.addEventListener('load', () => ScrollTrigger.refresh());
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
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

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  const host = document.querySelector('.topbar') || document.body;
  let bd = host.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; host.appendChild(bd); }
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open'); nav.setAttribute('inert', '');
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
  const sync = () => { if (window.innerWidth > 768) nav.removeAttribute('inert'); else if (!nav.classList.contains('open')) nav.setAttribute('inert', ''); };
  sync();
  window.addEventListener('resize', sync, { passive: true });
}

function initWspFloat() {
  const btn = document.getElementById('wsp-float');
  if (!btn) return;
  const sync = () => {
    if (window.scrollY > 600) btn.classList.add('visible'); else btn.classList.remove('visible');
  };
  window.addEventListener('scroll', sync, { passive: true });
  sync();
}

function initAnclas() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (!id || id.length < 2) return;
      const destino = document.querySelector(id);
      if (!destino) return;
      e.preventDefault();
      destino.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    });
  });
}

function initMagnetico() {
  if (reduceMotion || !window.matchMedia('(hover:hover)').matches) return;
  document.querySelectorAll('[data-magnetic]').forEach(el => {
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * 0.2;
      const y = (e.clientY - r.top - r.height / 2) * 0.26;
      el.style.translate = `${x.toFixed(1)}px ${y.toFixed(1)}px`;
    });
    el.addEventListener('pointerleave', () => { el.style.translate = '0px 0px'; });
  });
}

function initContadores() {
  const cifras = document.querySelectorAll('[data-count]');
  if (!cifras.length) return;
  const formato = n => Math.round(n).toLocaleString('es-AR');
  const correr = el => {
    const meta = parseFloat(el.getAttribute('data-count')) || 0;
    if (reduceMotion) { el.textContent = formato(meta); return; }
    el.textContent = formato(0);
    let inicio = null;
    let listo = false;
    const dur = 1300;
    const paso = ahora => {
      if (inicio === null) inicio = ahora;
      const t = Math.min(1, (ahora - inicio) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = formato(meta * eased);
      if (t < 1) requestAnimationFrame(paso); else listo = true;
    };
    requestAnimationFrame(paso);
    setTimeout(() => { if (!listo) el.textContent = formato(meta); }, dur + 500);
  };
  if (!('IntersectionObserver' in window)) { cifras.forEach(correr); return; }
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { correr(entry.target); io.unobserve(entry.target); }
    });
  }, { threshold: 0.2 });
  cifras.forEach(el => io.observe(el));
}

function initFaq() {
  const lista = document.querySelector('[data-faq]');
  if (!lista) return;
  const items = Array.from(lista.querySelectorAll('details'));
  items.forEach(item => {
    item.addEventListener('toggle', () => {
      if (!item.open) return;
      items.forEach(otro => { if (otro !== item) otro.open = false; });
      if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
    });
  });
}

function initTelMask(input) {
  if (!input) return;
  input.addEventListener('input', () => {
    const v = input.value.replace(/\D/g, '').slice(0, 11);
    let out = v;
    if (v.length > 2 && v.length <= 6) out = `${v.slice(0, 2)} ${v.slice(2)}`;
    else if (v.length > 6 && v.length <= 10) out = `${v.slice(0, 2)} ${v.slice(2, 6)}-${v.slice(6)}`;
    else if (v.length > 10) out = `${v.slice(0, 3)} ${v.slice(3, 7)}-${v.slice(7)}`;
    input.value = out;
  });
}

function initForm() {
  const form = document.getElementById('consForm');
  if (!form) return;
  const boton = document.getElementById('consSubmit');
  const tel = form.querySelector('#f-tel');
  initTelMask(tel);

  const marcar = (campo, msg) => {
    const wrap = campo.closest('.campo');
    const salida = wrap?.querySelector('.error');
    wrap?.classList.toggle('is-error', !!msg);
    campo.setAttribute('aria-invalid', msg ? 'true' : 'false');
    if (salida) salida.textContent = msg || '';
    return !msg;
  };

  form.querySelectorAll('input,select,textarea').forEach(campo => {
    campo.addEventListener('input', () => {
      if (campo.closest('.campo')?.classList.contains('is-error')) marcar(campo, '');
    });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const nombre = form.querySelector('#f-nombre');
    const empresa = form.querySelector('#f-empresa');
    const tema = form.querySelector('#f-tema');
    let ok = true;
    ok = marcar(nombre, nombre.value.trim().length < 3 ? 'Escribí tu nombre y apellido.' : '') && ok;
    ok = marcar(empresa, empresa.value.trim().length < 2 ? '¿Cómo se llama tu empresa?' : '') && ok;
    ok = marcar(tel, tel.value.replace(/\D/g, '').length < 8 ? 'Necesitamos un teléfono para contestarte.' : '') && ok;
    ok = marcar(tema, tema.value ? '' : 'Elegí por dónde te aprieta más.') && ok;
    if (!ok) {
      form.querySelector('.campo.is-error input,.campo.is-error select')?.focus();
      return;
    }
    const texto = boton.textContent;
    boton.disabled = true;
    boton.textContent = 'Enviando…';
    setTimeout(() => {
      boton.disabled = false;
      boton.textContent = texto;
      form.reset();
      showToast('¡Gracias! El envío de mensajes se activa al pasar la web a producción.');
    }, 800);
  });
}

function initRueda() {
  const rueda = document.getElementById('rueda');
  const giro = document.getElementById('ruedaGiro');
  const contenedor = document.getElementById('areasBloques');
  if (!rueda || !giro || !contenedor) return;

  const bloques = Array.from(contenedor.querySelectorAll('.area'));
  const sectores = Array.from(giro.querySelectorAll('.sector'));
  const chips = Array.from(document.querySelectorAll('.rueda-leyenda [data-goto]'));
  const salidaGrado = document.getElementById('ruedaGrado');
  const salidaTit = document.getElementById('ruedaTit');
  if (bloques.length !== sectores.length) return;

  const titulos = bloques.map(b => b.querySelector('h3')?.textContent.trim() || '');
  const grados = bloques.map(b => b.querySelector('.area-grado')?.textContent.trim() || '');
  const usarGsap = typeof gsap !== 'undefined';
  const N = bloques.length;
  const PASO = 360 / N;

  let rot = 0;
  let activo = -1;
  let arrastrando = false;
  let movio = false;

  const aplicar = (deg, animar) => {
    rot = deg;
    if (usarGsap) {
      if (animar && !reduceMotion) {
        gsap.to(giro, { rotation: deg, svgOrigin: '150 150', overwrite: true, duration: .75, ease: 'power3.out' });
      } else {
        gsap.set(giro, { rotation: deg, svgOrigin: '150 150' });
      }
    } else {
      giro.setAttribute('transform', `rotate(${deg.toFixed(2)} 150 150)`);
    }
  };

  const marcar = i => {
    if (i === activo) return;
    activo = i;
    sectores.forEach((s, n) => s.classList.toggle('is-on', n === i));
    bloques.forEach((b, n) => b.classList.toggle('is-on', n === i));
    chips.forEach((c, n) => c.setAttribute('aria-selected', n === i ? 'true' : 'false'));
    if (salidaGrado) salidaGrado.textContent = grados[i];
    if (salidaTit) salidaTit.textContent = titulos[i];
  };

  const irA = i => {
    marcar(i);
    const base = -i * PASO;
    const vueltas = Math.round((rot - base) / 360);
    aplicar(base + vueltas * 360, true);
  };

  const llevarA = i => {
    irA(i);
    bloques[i].scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
  };

  const angulo = (x, y) => {
    const r = rueda.getBoundingClientRect();
    return Math.atan2(y - (r.top + r.height / 2), x - (r.left + r.width / 2)) * 180 / Math.PI;
  };

  let anguloInicial = 0;
  let rotInicial = 0;
  let punteroId = null;

  rueda.addEventListener('pointerdown', e => {
    if (e.button) return;
    arrastrando = true;
    movio = false;
    punteroId = e.pointerId;
    anguloInicial = angulo(e.clientX, e.clientY);
    rotInicial = rot;
  });

  window.addEventListener('pointermove', e => {
    if (!arrastrando) return;
    let d = angulo(e.clientX, e.clientY) - anguloInicial;
    while (d > 180) d -= 360;
    while (d < -180) d += 360;
    if (!movio && Math.abs(d) > 3) {
      movio = true;
      rueda.classList.add('dragging');
      try { rueda.setPointerCapture?.(punteroId); } catch { /* sin capture el drag igual funciona */ }
    }
    if (movio) aplicar(rotInicial + d, false);
  });

  const soltar = () => {
    if (!arrastrando) return;
    arrastrando = false;
    rueda.classList.remove('dragging');
    try { rueda.releasePointerCapture?.(punteroId); } catch { /* ya liberado */ }
    if (!movio) return;
    const destino = Math.round(rot / PASO) * PASO;
    let i = Math.round(-destino / PASO) % N;
    if (i < 0) i += N;
    marcar(i);
    aplicar(destino, true);
    bloques[i].scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
  };
  window.addEventListener('pointerup', soltar);
  window.addEventListener('pointercancel', soltar);

  sectores.forEach(s => s.addEventListener('click', () => {
    if (movio) return;
    llevarA(Number(s.getAttribute('data-i')) || 0);
  }));
  chips.forEach(c => c.addEventListener('click', () => llevarA(Number(c.getAttribute('data-goto')) || 0)));

  marcar(0);
  aplicar(0, false);

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entradas => {
      if (arrastrando) return;
      entradas.forEach(entrada => {
        if (entrada.isIntersecting) irA(bloques.indexOf(entrada.target));
      });
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
    bloques.forEach(b => io.observe(b));
  }
}

function initRuta() {
  const ruta = document.getElementById('ruta');
  if (!ruta) return;
  const hitos = Array.from(ruta.querySelectorAll('.hito'));
  const cortes = [0, .4, .74];
  const marcar = p => hitos.forEach((h, i) => h.classList.toggle('is-on', p >= (cortes[i] ?? 1)));

  if (typeof ScrollTrigger === 'undefined' || reduceMotion) {
    ruta.style.setProperty('--rm-p', '1');
    marcar(1);
    return;
  }
  ScrollTrigger.create({
    trigger: ruta, start: 'top 85%', end: 'bottom 45%', invalidateOnRefresh: true,
    onUpdate: self => {
      ruta.style.setProperty('--rm-p', self.progress.toFixed(3));
      marcar(self.progress);
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const anio = document.getElementById('anio');
  if (anio) anio.textContent = new Date().getFullYear();
  initReveals();
  initNav();
  initWspFloat();
  initAnclas();
  initMagnetico();
  initContadores();
  initFaq();
  initForm();
  initRueda();
  initRuta();
});
