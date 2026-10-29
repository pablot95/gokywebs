const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5491133905301';

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

function wspLink(msg) {
  return `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
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

function initPuertas() {
  const tabs = [...document.querySelectorAll('.puertas-tabs [role="tab"]')];
  if (!tabs.length) return;
  const activar = (tab, animar) => {
    tabs.forEach(t => {
      const sel = t === tab;
      t.setAttribute('aria-selected', sel ? 'true' : 'false');
      t.tabIndex = sel ? 0 : -1;
      const panel = document.getElementById(t.getAttribute('aria-controls'));
      if (!panel) return;
      panel.hidden = !sel;
      panel.classList.remove('is-entrando');
      if (sel) {
        revelarNuevos(panel);
        if (animar && !reduceMotion) { void panel.offsetWidth; panel.classList.add('is-entrando'); }
      }
    });
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  };
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => activar(tab, true));
    tab.addEventListener('keydown', e => {
      const mapa = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 };
      if (!(e.key in mapa)) return;
      e.preventDefault();
      const j = (mapa[e.key] + tabs.length) % tabs.length;
      activar(tabs[j], true);
      tabs[j].focus();
    });
  });
}

function initPlanilla() {
  const lista = document.querySelector('.planilla-lista');
  const visor = document.querySelector('.visor-marco');
  if (!lista || !visor) return;
  const filas = [...lista.querySelectorAll('.fila')];
  const fotos = [...visor.querySelectorAll('.visor-img')];
  let actual = null;
  const marcar = fila => {
    if (!fila || fila === actual) return;
    actual = fila;
    filas.forEach(f => f.classList.toggle('activa', f === fila));
    fotos.forEach(img => img.classList.toggle('activa', img.dataset.foto === fila.dataset.foto));
  };
  filas.forEach(f => {
    f.addEventListener('mouseenter', () => marcar(f));
    f.addEventListener('focus', () => marcar(f));
  });
  marcar(filas[0]);
  const mobile = window.matchMedia('(max-width: 900px)');
  let frame = 0;
  const porScroll = () => {
    frame = 0;
    if (!mobile.matches) return;
    const linea = visor.getBoundingClientRect().bottom + 70;
    let mejor = null;
    let dist = Infinity;
    filas.forEach(f => {
      const r = f.getBoundingClientRect();
      const d = Math.abs(r.top + r.height / 2 - linea);
      if (d < dist) { dist = d; mejor = f; }
    });
    marcar(mejor);
  };
  window.addEventListener('scroll', () => { if (!frame) frame = requestAnimationFrame(porScroll); }, { passive: true });
}

const LADRILLOS = {
  hueco8: { nombre: 'ladrillo hueco 8 × 18 × 33', largo: 0.33, alto: 0.18 },
  hueco12: { nombre: 'ladrillo hueco 12 × 18 × 33', largo: 0.33, alto: 0.18 },
  hueco18: { nombre: 'ladrillo hueco 18 × 18 × 33', largo: 0.33, alto: 0.18 },
  comun: { nombre: 'ladrillo común', largo: 0.26, alto: 0.055 }
};
const JUNTA = 0.01;
const DESPERDICIO = 1.05;
const PUERTA = { ancho: 0.8, alto: 2.05 };
const VENTANA = { ancho: 1.2, alto: 1.1, antepecho: 0.9 };

const num = (n, d = 2) => n.toLocaleString('es-AR', { minimumFractionDigits: d, maximumFractionDigits: d });
const entero = n => Math.round(n).toLocaleString('es-AR');

function cuentaPared(p) {
  const t = LADRILLOS[p.tipo];
  const bruto = p.largo * p.alto;
  const aberturas = p.puertas * PUERTA.ancho * Math.min(PUERTA.alto, p.alto) + p.ventanas * VENTANA.ancho * VENTANA.alto;
  const neto = Math.max(0, bruto - aberturas);
  const porM2 = 1 / ((t.largo + JUNTA) * (t.alto + JUNTA));
  return { neto, ladrillos: Math.ceil(neto * porM2 * DESPERDICIO), porM2 };
}

function describirPared(p) {
  const ab = [];
  if (p.puertas) ab.push(p.puertas === 1 ? '1 puerta' : `${p.puertas} puertas`);
  if (p.ventanas) ab.push(p.ventanas === 1 ? '1 ventana' : `${p.ventanas} ventanas`);
  return `${num(p.largo)} × ${num(p.alto)} m${ab.length ? ` con ${ab.join(' y ')}` : ''}`;
}

function dibujarPared(svg, p) {
  const W = p.largo * 100;
  const H = p.alto * 100;
  const t = LADRILLOS[p.tipo];
  const bw = (t.largo + JUNTA) * 100;
  const bh = (t.alto + JUNTA) * 100;
  const huecos = [];
  const n = p.puertas + p.ventanas;
  const paso = W / (n + 1);
  let k = 0;
  for (let i = 0; i < p.puertas; i++) {
    const cx = paso * (++k);
    const h = Math.min(PUERTA.alto, p.alto) * 100;
    huecos.push(`<rect class="hueco" x="${cx - 40}" y="${H - h}" width="80" height="${h}"/>`);
  }
  for (let i = 0; i < p.ventanas; i++) {
    const cx = paso * (++k);
    const base = Math.min(VENTANA.antepecho, Math.max(0, p.alto - VENTANA.alto - 0.1)) * 100;
    huecos.push(`<rect class="hueco" x="${cx - 60}" y="${H - base - 110}" width="120" height="110"/>`);
  }
  const m = Math.max(W, H) * 0.04;
  svg.setAttribute('viewBox', `${-m} ${-m} ${W + m * 2} ${H + m * 2}`);
  svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
  svg.innerHTML = `<defs><pattern id="ladrillo-${p.tipo}" width="${bw * 2}" height="${bh * 2}" patternUnits="userSpaceOnUse">
      <rect width="${bw * 2}" height="${bh * 2}" fill="#C9775A"/>
      <path d="M0 ${bh} H${bw * 2} M0 ${bh * 2} H${bw * 2} M${bw} 0 V${bh} M${bw * 2} 0 V${bh} M${bw / 2} ${bh} V${bh * 2} M${bw * 1.5} ${bh} V${bh * 2}" stroke="#EEE3D6" stroke-width="${Math.max(1, JUNTA * 100)}" fill="none"/>
    </pattern></defs>
    <rect x="0" y="0" width="${W}" height="${H}" fill="url(#ladrillo-${p.tipo})"/>
    ${huecos.join('')}
    <rect x="0" y="0" width="${W}" height="${H}" fill="none" stroke="#13284A" stroke-width="${Math.max(2, W / 300)}"/>`;
  svg.querySelectorAll('.hueco').forEach(r => { r.setAttribute('fill', '#F6F8FB'); r.setAttribute('stroke', '#13284A'); r.setAttribute('stroke-width', Math.max(1.5, W / 400)); });
}

function initCalc() {
  const largo = document.getElementById('c-largo');
  const svg = document.getElementById('c-svg');
  if (!largo || !svg) return;
  const alto = document.getElementById('c-alto');
  const outP = document.getElementById('c-puertas');
  const outV = document.getElementById('c-ventanas');
  const m2 = document.getElementById('c-m2');
  const lad = document.getElementById('c-ladrillos');
  const cotaL = document.getElementById('c-cota-largo');
  const cotaA = document.getElementById('c-cota-alto');
  const error = document.getElementById('c-error');
  const wsp = document.getElementById('c-wsp');
  const sumar = document.getElementById('c-sumar');
  const listaBox = document.getElementById('c-lista-box');
  const listaOl = document.getElementById('c-lista');
  const total = document.getElementById('c-total');
  const cont = { puertas: 1, ventanas: 1 };
  const lista = [];

  const leer = () => {
    const l = parseFloat(String(largo.value).replace(',', '.'));
    const a = parseFloat(String(alto.value).replace(',', '.'));
    const tipo = document.querySelector('input[name="calc-tipo"]:checked')?.value || 'hueco12';
    return { largo: l, alto: a, tipo, puertas: cont.puertas, ventanas: cont.ventanas };
  };
  const valida = p => {
    if (!(p.largo >= 0.5 && p.largo <= 50)) return 'El largo va de 0,5 a 50 metros.';
    if (!(p.alto >= 0.5 && p.alto <= 6)) return 'El alto va de 0,5 a 6 metros.';
    if (p.puertas && p.alto < 2.1) return 'Para una puerta, la pared tiene que medir 2,10 m de alto o más.';
    const anchoAb = p.puertas * PUERTA.ancho + p.ventanas * VENTANA.ancho;
    if (anchoAb > p.largo * 0.8) return 'Hay más aberturas de las que entran en ese largo.';
    return '';
  };

  const mensaje = actual => {
    const paredes = lista.length ? lista : (actual ? [actual] : []);
    if (!paredes.length) return 'Hola SOSA Hnos., quiero pedir un presupuesto de mano de obra para una pared.';
    const lineas = paredes.map((p, i) => {
      const c = cuentaPared(p);
      return `${paredes.length > 1 ? `${i + 1}. ` : '- '}Pared de ${describirPared(p)}: ${num(c.neto, 1)} m² de ${LADRILLOS[p.tipo].nombre}, unos ${entero(c.ladrillos)} ladrillos.`;
    });
    return `Hola SOSA Hnos., calculé ${paredes.length > 1 ? 'estas paredes' : 'esta pared'} en la web:\n${lineas.join('\n')}\nQuiero el presupuesto de mano de obra.`;
  };

  const pintarLista = () => {
    listaBox.hidden = !lista.length;
    listaOl.innerHTML = lista.map((p, i) => {
      const c = cuentaPared(p);
      return `<li><span>${esc(describirPared(p))} · ${num(c.neto, 1)} m² · ${entero(c.ladrillos)} lad.</span><button type="button" data-quitar="${i}" aria-label="Quitar la pared ${i + 1}"><svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg></button></li>`;
    }).join('');
    const tot = lista.reduce((acc, p) => { const c = cuentaPared(p); acc.m2 += c.neto; acc.lad += c.ladrillos; return acc; }, { m2: 0, lad: 0 });
    total.textContent = lista.length ? `Total: ${num(tot.m2, 1)} m² · unos ${entero(tot.lad)} ladrillos` : '';
  };

  let ultimo = null;
  const pintar = () => {
    const p = leer();
    const err = valida(p);
    error.hidden = !err;
    error.textContent = err;
    sumar.disabled = !!err;
    if (err) { ultimo = null; m2.textContent = '—'; lad.textContent = '—'; wsp.href = wspLink(mensaje(null)); return; }
    ultimo = p;
    const c = cuentaPared(p);
    m2.textContent = `${num(c.neto, 1)} m²`;
    lad.textContent = entero(c.ladrillos);
    cotaL.textContent = `${num(p.largo)} m`;
    cotaA.textContent = `${num(p.alto)} m`;
    dibujarPared(svg, p);
    wsp.href = wspLink(mensaje(p));
  };

  document.querySelectorAll('[data-contador]').forEach(box => {
    const clave = box.dataset.contador;
    const out = clave === 'puertas' ? outP : outV;
    box.querySelectorAll('[data-paso]').forEach(b => b.addEventListener('click', () => {
      cont[clave] = Math.min(6, Math.max(0, cont[clave] + Number(b.dataset.paso)));
      out.textContent = cont[clave];
      pintar();
    }));
  });
  [largo, alto].forEach(i => i.addEventListener('input', pintar));
  document.querySelectorAll('input[name="calc-tipo"]').forEach(r => r.addEventListener('change', pintar));
  sumar.addEventListener('click', () => {
    if (!ultimo) return;
    lista.push({ ...ultimo });
    pintarLista();
    wsp.href = wspLink(mensaje(ultimo));
    showToast(`Pared ${lista.length} sumada a tu lista`);
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  });
  listaOl.addEventListener('click', e => {
    const b = e.target.closest('[data-quitar]');
    if (!b) return;
    lista.splice(Number(b.dataset.quitar), 1);
    pintarLista();
    wsp.href = wspLink(mensaje(ultimo));
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  });
  pintar();
}

function initForm() {
  const form = document.querySelector('[data-form]');
  if (!form) return;
  const tel = form.querySelector('#f-tel');
  if (tel && typeof IMask !== 'undefined') IMask(tel, { mask: '+{54} 9 00 0000-0000' });
  const marcar = (input, msg) => {
    const err = document.getElementById(`${input.id}-error`);
    input.setAttribute('aria-invalid', msg ? 'true' : 'false');
    if (err) { err.textContent = msg; err.hidden = !msg; }
  };
  form.querySelectorAll('input, select, textarea').forEach(el => el.addEventListener('input', () => {
    if (el.getAttribute('aria-invalid') === 'true') marcar(el, '');
  }));
  form.addEventListener('submit', e => {
    e.preventDefault();
    const nombre = form.querySelector('#f-nombre');
    let ok = true;
    if (nombre.value.trim().length < 2) { marcar(nombre, 'Contanos tu nombre'); ok = false; } else marcar(nombre, '');
    if (tel.value.replace(/\D/g, '').length < 12) { marcar(tel, 'Falta el número completo, con el código de área'); ok = false; } else marcar(tel, '');
    if (!ok) { form.querySelector('[aria-invalid="true"]')?.focus(); return; }
    const btn = form.querySelector('button[type="submit"]');
    const txt = btn.querySelector('span');
    const antes = txt.textContent;
    btn.disabled = true;
    txt.textContent = 'Enviando…';
    setTimeout(() => {
      btn.disabled = false;
      txt.textContent = antes;
      form.reset();
      showToast('¡Gracias! El envío de mensajes se activa al pasar la web a producción.');
    }, 800);
  });
}

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const img = hero.querySelector('[data-hero-img]');
  if (img) tl.from(img, { scale: 1.1, duration: 1.8 }, 0);
  const filo = hero.querySelector('.hero-filo');
  if (filo) tl.from(filo, { xPercent: 6, opacity: 0, duration: 1.2, clearProps: 'transform,opacity' }, 0.05);
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 36, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-nivel'), { opacity: 0, x: -16, duration: 0.9, clearProps: 'transform,opacity' }, 0.4)
    .from(hero.querySelectorAll('.hero-lead'), { y: 24, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 20, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.hero-sello, .caratula'), { scale: 0.92, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.7);
}

let revealsListos = false;
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

initCalc();
initReveals();
initPuertas();
initPlanilla();
initForm();
initNav();
initWspFloat();
initModelBarScroll();
initHeroMotion();
