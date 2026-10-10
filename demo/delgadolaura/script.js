const WHATSAPP_NUMBER = '5492804592401';
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const wspHref = texto => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(texto)}`;

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = (e.key || '').toLowerCase();
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
  if (!bd) {
    bd = document.createElement('div');
    bd.className = 'nav-backdrop';
    (document.querySelector('.site-header') || document.body).appendChild(bd);
  }
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

function initWspLinks() {
  document.querySelectorAll('[data-wsp-msg]').forEach(a => { a.href = wspHref(a.dataset.wspMsg); });
}

function initWspFloat() {
  const btn = document.getElementById('wsp-float');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) btn.classList.add('visible'); else btn.classList.remove('visible');
  }, { passive: true });
}

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const img = hero.querySelector('[data-hero-img]');
  if (img) tl.from(img, { scale: 1.08, duration: 1.8 }, 0);
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 16, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 32, opacity: 0, filter: 'blur(8px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 22, opacity: 0, duration: 1 }, 0.42)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 18, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.58)
    .from(hero.querySelectorAll('.hero-puntos li'), { y: 12, opacity: 0, duration: 0.8, stagger: 0.08, clearProps: 'transform,opacity' }, 0.72)
    .from(hero.querySelectorAll('.hero-sello, .hero-foto:not(:has([data-hero-img]))'), { y: 24, scale: 0.94, opacity: 0, duration: 1.1, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6);
}

const APORTES = {
  dependencia: { nombre: 'Relación de dependencia', texto: 'Con relación de dependencia podés usar tus aportes: la cuota baja y se calcula con tu recibo de sueldo.', linea: 'Relación de dependencia (quiero usar mis aportes)' },
  monotributo: { nombre: 'Monotributo', texto: 'Como monotributista también podés usar tus aportes. Lo calculo con tu categoría.', linea: 'Monotributo (quiero usar mis aportes)' },
  particular: { nombre: 'Particular, sin aportes', texto: 'Sin aportes te cotizo el valor completo de cada plan, para que compares con todos los números.', linea: 'Particular, sin aportes' },
};
const ROLES = ['Pareja', 'Hijo o hija', 'Otro familiar'];
const MAX_PERSONAS = 8;

function initCotizador() {
  const form = document.getElementById('form-cotizar');
  if (!form) return;
  const lista = form.querySelector('[data-personas]');
  const sumar = form.querySelector('[data-sumar]');
  const edadTitular = form.querySelector('#edad-0');
  const errorEdad = form.querySelector('#edad-0-error');
  const provincia = form.querySelector('#c-provincia');
  const errorProv = form.querySelector('#c-provincia-error');
  const localidad = form.querySelector('#c-localidad');
  const nombre = form.querySelector('#c-nombre');
  const enviar = form.querySelector('[type="submit"]');
  if (!lista || !sumar || !edadTitular || !provincia || !localidad || !nombre || !enviar) return;
  const res = k => form.querySelector(`[data-res="${k}"]`);
  const poner = (el, t) => { if (el) el.textContent = t; };
  let siguiente = 1;

  const edadDe = input => {
    const v = parseInt(input?.value, 10);
    return Number.isFinite(v) ? Math.min(99, Math.max(0, v)) : null;
  };
  const integrantes = () => {
    const out = [{ rol: 'Titular', edad: edadDe(edadTitular) }];
    lista.querySelectorAll('[data-persona]').forEach(fila => {
      out.push({ rol: fila.querySelector('select')?.value || 'Integrante', edad: edadDe(fila.querySelector('input')) });
    });
    return out;
  };
  const describir = p => (p.edad === null ? p.rol : `${p.rol} (${p.edad})`);
  const trabajo = () => form.querySelector('input[name="trabajo"]:checked')?.value || 'dependencia';
  const prepagas = () => [...form.querySelectorAll('[data-prepaga]:checked')].map(i => i.value);

  const actualizar = () => {
    const gente = integrantes();
    poner(res('personas'), gente.map(describir).join(', '));
    const prov = provincia.value;
    const loc = localidad.value.trim();
    poner(res('zona'), prov ? (loc ? `${loc}, ${prov}` : prov) : 'A definir');
    const t = APORTES[trabajo()] || APORTES.dependencia;
    poner(res('trabajo'), t.nombre);
    poner(res('aportes'), t.texto);
    const p = prepagas();
    poner(res('prepagas'), p.length ? p.join(', ') : 'Las que mejor te queden');
    sumar.disabled = gente.length >= MAX_PERSONAS;
  };

  const marcar = (input, error, mal) => {
    input.setAttribute('aria-invalid', mal ? 'true' : 'false');
    if (error) error.hidden = !mal;
  };

  sumar.addEventListener('click', () => {
    if (lista.querySelectorAll('[data-persona]').length + 1 >= MAX_PERSONAS) return;
    const n = siguiente++;
    const fila = document.createElement('div');
    fila.className = 'persona';
    fila.setAttribute('data-persona', '');
    fila.innerHTML = `
      <div class="campo"><label for="rol-${n}">Integrante</label><select id="rol-${n}">${ROLES.map(r => `<option>${r}</option>`).join('')}</select></div>
      <div class="campo"><label for="edad-${n}">Edad</label><input id="edad-${n}" type="number" inputmode="numeric" min="0" max="99" placeholder="Edad"></div>
      <button type="button" class="persona__quitar" aria-label="Quitar integrante"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg></button>`;
    if (lista.querySelectorAll('[data-persona]').length === 0) fila.querySelector('select').value = 'Pareja';
    else fila.querySelector('select').value = 'Hijo o hija';
    lista.appendChild(fila);
    fila.querySelector('.persona__quitar').addEventListener('click', () => { fila.remove(); actualizar(); sumar.focus(); });
    fila.querySelector('input').focus();
    actualizar();
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  });

  form.addEventListener('input', actualizar);
  form.addEventListener('change', actualizar);
  edadTitular.addEventListener('input', () => { if (edadTitular.getAttribute('aria-invalid') === 'true' && edadDe(edadTitular) >= 18) marcar(edadTitular, errorEdad, false); });
  provincia.addEventListener('change', () => { if (provincia.value) marcar(provincia, errorProv, false); });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const edad = edadDe(edadTitular);
    const edadMal = edad === null || edad < 18;
    const provMal = !provincia.value;
    marcar(edadTitular, errorEdad, edadMal);
    marcar(provincia, errorProv, provMal);
    if (edadMal || provMal) {
      const primero = edadMal ? edadTitular : provincia;
      primero.focus();
      primero.scrollIntoView({ block: 'center' });
      return;
    }
    const gente = integrantes();
    const t = APORTES[trabajo()] || APORTES.dependencia;
    const p = prepagas();
    const loc = localidad.value.trim();
    const lineas = [
      'Hola Laura, quiero cotizar una prepaga.',
      '',
      `• Quiénes se suman: ${gente.map(describir).join(', ')}`,
      `• Dónde: ${loc ? `${loc}, ${provincia.value}` : provincia.value}`,
      `• Cómo trabajo: ${t.linea}`,
      `• Prepagas que me interesan: ${p.length ? p.join(', ') : 'las que mejor me queden'}`,
    ];
    if (nombre.value.trim()) lineas.push('', `Me llamo ${nombre.value.trim()}.`);
    const a = document.createElement('a');
    a.href = wspHref(lineas.join('\n'));
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    a.remove();
    showToast('Te abro WhatsApp con tu consulta lista para enviar.');
    const txt = enviar.querySelector('span');
    const original = txt ? txt.textContent : '';
    enviar.disabled = true;
    poner(txt, 'Abriendo WhatsApp…');
    setTimeout(() => { enviar.disabled = false; poner(txt, original); }, 1600);
  });

  actualizar();
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

initModelBarScroll();
initNav();
initWspLinks();
initWspFloat();
initCotizador();
initHeroMotion();
initReveals();
