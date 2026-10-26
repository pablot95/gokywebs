const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const WSP = '5493704395662';
const wa = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
let lang = 'es';
const tr = o => (lang === 'en' ? o.en : o.es);
let revealsListos = false;

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

const LENGUAS = {
  qom: { nombre: { es: 'qom', en: 'Qom' }, pueblo: { es: 'Pueblo qom', en: 'Qom people' }, prov: ['chaco', 'formosa', 'santafe'], nota: { es: 'Comunidades en Chaco, Formosa y Santa Fe.', en: 'Communities in Chaco, Formosa and Santa Fe.' } },
  wichi: { nombre: { es: 'wichí', en: 'Wichí' }, pueblo: { es: 'Pueblo wichí', en: 'Wichí people' }, prov: ['chaco', 'formosa'], nota: { es: 'Comunidades en Chaco y Formosa.', en: 'Communities in Chaco and Formosa.' } },
  pilaga: { nombre: { es: 'pilagá', en: 'Pilagá' }, pueblo: { es: 'Pueblo pilagá', en: 'Pilagá people' }, prov: ['formosa'], nota: { es: 'Comunidades en Formosa.', en: 'Communities in Formosa.' } },
  moqoit: { nombre: { es: 'moqoit', en: 'Moqoit' }, pueblo: { es: 'Pueblo moqoit', en: 'Moqoit people' }, prov: ['chaco', 'santafe'], nota: { es: 'Comunidades en Chaco y Santa Fe.', en: 'Communities in Chaco and Santa Fe.' } },
  guarani: { nombre: { es: 'guaraní', en: 'Guaraní' }, pueblo: { es: 'Lengua guaraní', en: 'Guaraní language' }, prov: ['corrientes', 'misiones'], nota: { es: 'Presente en la vida diaria de Corrientes y Misiones.', en: 'Part of everyday life in Corrientes and Misiones.' } },
  mbya: { nombre: { es: 'mbya guaraní', en: 'Mbya Guaraní' }, pueblo: { es: 'Pueblo mbya guaraní', en: 'Mbya Guaraní people' }, prov: ['misiones'], nota: { es: 'Comunidades en Misiones.', en: 'Communities in Misiones.' } },
  charrua: { nombre: { es: 'charrúa', en: 'Charrúa' }, pueblo: { es: 'Pueblo charrúa', en: 'Charrúa people' }, prov: ['entrerios'], nota: { es: 'Comunidades en Entre Ríos, en un camino de recuperación de la lengua.', en: 'Communities in Entre Ríos, on a path to reclaim the language.' } },
};

const MESES = {
  feb: { es: 'febrero', en: 'February', corto: { es: 'feb', en: 'feb' } },
  abr: { es: 'abril', en: 'April', corto: { es: 'abr', en: 'apr' } },
  jul: { es: 'julio', en: 'July', corto: { es: 'jul', en: 'jul' } },
  ago: { es: 'agosto', en: 'August', corto: { es: 'ago', en: 'aug' } },
  sep: { es: 'septiembre', en: 'September', corto: { es: 'sep', en: 'sep' } },
  oct: { es: 'octubre', en: 'October', corto: { es: 'oct', en: 'oct' } },
};

const FECHAS = {
  feb: [
    { dia: 21, titulo: { es: 'Día Internacional de la Lengua Materna', en: 'International Mother Language Day' }, texto: { es: 'Una fecha para que las lenguas de cada aula se escuchen, se lean y se escriban.', en: 'A day for every language in the classroom to be heard, read and written.' } },
  ],
  abr: [
    { dia: 19, titulo: { es: 'Día de los Pueblos Indígenas de América', en: 'Day of the Indigenous Peoples of the Americas' }, texto: { es: 'Recuerda el Congreso Indigenista Interamericano de Pátzcuaro, en 1940.', en: 'It recalls the Inter-American Indigenist Congress held in Pátzcuaro in 1940.' } },
  ],
  jul: [
    { dia: 19, titulo: { es: 'Memoria de la Masacre de Napalpí', en: 'Remembrance of the Napalpí Massacre' }, texto: { es: 'Chaco, 1924: la masacre contra los pueblos qom y moqoit, declarada crimen de lesa humanidad en 2022.', en: 'Chaco, 1924: the massacre of the Qom and Moqoit peoples, ruled a crime against humanity in 2022.' } },
  ],
  ago: [
    { dia: 9, titulo: { es: 'Día Internacional de los Pueblos Indígenas', en: 'International Day of the World’s Indigenous Peoples' }, texto: { es: 'Fecha establecida por Naciones Unidas para reconocer los derechos de los pueblos indígenas.', en: 'Set by the United Nations to recognize the rights of Indigenous peoples.' } },
  ],
  sep: [
    { dia: 5, titulo: { es: 'Día Internacional de la Mujer Indígena', en: 'International Day of Indigenous Women' }, texto: { es: 'Un día para reconocer a las mujeres de nuestros pueblos y su lugar en la comunidad y en la escuela.', en: 'A day to honor the women of our peoples and their place in the community and at school.' } },
  ],
  oct: [
    { dia: 10, titulo: { es: 'Memoria de la Masacre de Rincón Bomba', en: 'Remembrance of the Rincón Bomba Massacre' }, texto: { es: 'Formosa, 1947: la masacre contra el pueblo pilagá.', en: 'Formosa, 1947: the massacre of the Pilagá people.' } },
    { dia: 11, titulo: { es: 'Último día de libertad de los pueblos originarios', en: 'Last Day of Freedom of the Indigenous Peoples' }, texto: { es: 'La víspera del 12 de octubre de 1492, recordada desde la mirada de los pueblos.', en: 'The eve of October 12, 1492, remembered from the perspective of our peoples.' } },
    { dia: 12, titulo: { es: 'Día del Respeto a la Diversidad Cultural', en: 'Day of Respect for Cultural Diversity' }, texto: { es: 'Así se nombra el 12 de octubre en Argentina desde 2010.', en: 'The name Argentina has given to October 12 since 2010.' } },
  ],
};

const ORIG = new WeakMap();
const ATTRS = ['aria-label', 'alt', 'placeholder', 'href'];
const ORIG_ATTR = Object.fromEntries(ATTRS.map(a => [a, new WeakMap()]));

function guardarOriginales() {
  document.querySelectorAll('[data-en]').forEach(el => { if (!ORIG.has(el)) ORIG.set(el, el.innerHTML); });
  ATTRS.forEach(a => document.querySelectorAll(`[data-en-${a}]`).forEach(el => {
    if (!ORIG_ATTR[a].has(el)) ORIG_ATTR[a].set(el, el.getAttribute(a) ?? '');
  }));
}

function aplicarIdioma(nuevo) {
  lang = nuevo === 'en' ? 'en' : 'es';
  document.documentElement.lang = lang === 'en' ? 'en' : 'es-AR';
  document.querySelectorAll('[data-en]').forEach(el => {
    if (!ORIG.has(el)) ORIG.set(el, el.innerHTML);
    el.innerHTML = lang === 'en' ? el.dataset.en : ORIG.get(el);
  });
  ATTRS.forEach(a => document.querySelectorAll(`[data-en-${a}]`).forEach(el => {
    if (!ORIG_ATTR[a].has(el)) ORIG_ATTR[a].set(el, el.getAttribute(a) ?? '');
    el.setAttribute(a, lang === 'en' ? el.getAttribute(`data-en-${a}`) : ORIG_ATTR[a].get(el));
  }));
  document.querySelectorAll('.idiomas__btn').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
  document.dispatchEvent(new CustomEvent('idioma'));
  if (typeof ScrollTrigger !== 'undefined') requestAnimationFrame(() => ScrollTrigger.refresh());
}

function initIdiomas() {
  guardarOriginales();
  const leer = () => { try { return localStorage.getItem('ceapi-idioma'); } catch { return null; } };
  const guardar = v => { try { localStorage.setItem('ceapi-idioma', v); return true; } catch { return false; } };
  if (leer() === 'en') aplicarIdioma('en');
  document.querySelectorAll('.idiomas__btn').forEach(b => b.addEventListener('click', () => {
    if (b.dataset.lang === lang) return;
    aplicarIdioma(b.dataset.lang);
    guardar(lang);
    showToast(lang === 'en' ? 'Now showing the website in English.' : 'La web está ahora en español.');
  }));
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
  const desktopMq = window.matchMedia('(min-width: 961px)');
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
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 36, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 24, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 20, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.sello--hero'), { scale: 0.92, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.7);
}

function initHeroParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  const mov = document.querySelector('.hero__mov');
  if (!mov) return;
  gsap.fromTo(mov, { yPercent: -3 }, {
    yPercent: 3, ease: 'none',
    scrollTrigger: { trigger: mov.parentElement, start: 'top top', end: 'bottom top', scrub: true },
  });
}

function partirLee(el) {
  const palabras = el.textContent.trim().split(/\s+/);
  el.textContent = '';
  palabras.forEach((palabra, i) => {
    const s = document.createElement('span');
    s.className = 'lee-w';
    s.textContent = palabra;
    el.appendChild(s);
    if (i < palabras.length - 1) el.appendChild(document.createTextNode(' '));
  });
}

function initLeeScroll() {
  const els = [...document.querySelectorAll('[data-lee]')];
  if (!els.length) return;
  const progreso = new WeakMap();
  const pintar = el => {
    const ws = el.querySelectorAll('.lee-w');
    const hasta = (progreso.get(el) ?? 0) * ws.length;
    ws.forEach((w, i) => w.classList.toggle('on', i < hasta));
  };
  const estatico = typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion;
  const preparar = () => els.forEach(el => {
    partirLee(el);
    if (estatico) el.querySelectorAll('.lee-w').forEach(w => w.classList.add('on'));
    else pintar(el);
  });
  preparar();
  document.addEventListener('idioma', preparar);
  if (estatico) return;
  els.forEach(el => {
    ScrollTrigger.create({
      trigger: el, start: 'top 82%', end: 'bottom 52%', scrub: .4, invalidateOnRefresh: true,
      onUpdate: self => { progreso.set(el, self.progress); pintar(el); },
    });
  });
}

function initDesplegables() {
  document.querySelectorAll('details').forEach(d => d.addEventListener('toggle', () => {
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  }));
}

function initLenguas() {
  const botones = [...document.querySelectorAll('.lengua-btn')];
  const nombre = document.getElementById('lengua-nombre');
  const nota = document.getElementById('lengua-nota');
  const cta = document.getElementById('lengua-cta');
  const ctaTxt = document.getElementById('lengua-cta-txt');
  if (!botones.length || !nombre) return;
  let actual = botones.find(b => b.getAttribute('aria-pressed') === 'true')?.dataset.lengua || 'qom';
  const pintar = () => {
    const l = LENGUAS[actual];
    if (!l) return;
    botones.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lengua === actual)));
    document.querySelectorAll('.provincia').forEach(p => p.classList.toggle('activa', l.prov.includes(p.dataset.prov)));
    nombre.textContent = tr(l.pueblo);
    if (nota) nota.textContent = tr(l.nota);
    if (ctaTxt) ctaTxt.textContent = lang === 'en' ? `Ask for materials in ${l.nombre.en}` : `Pedir materiales en ${l.nombre.es}`;
    if (cta) cta.href = wa(lang === 'en'
      ? `Hello, I would like to ask about teaching materials in the ${l.nombre.en} language.`
      : `Hola, quiero consultar por materiales didácticos en lengua ${l.nombre.es}.`);
  };
  botones.forEach(b => b.addEventListener('click', () => { actual = b.dataset.lengua; pintar(); }));
  document.addEventListener('idioma', pintar);
  pintar();
}

function initCalendario() {
  const panel = document.getElementById('fechas');
  const tabs = [...document.querySelectorAll('.mes')];
  if (!panel || !tabs.length) return;
  let mes = tabs.find(t => t.getAttribute('aria-selected') === 'true')?.dataset.mes || 'feb';
  const tarjeta = (f, animar) => {
    const m = MESES[mes];
    const msg = lang === 'en'
      ? `Hello, I would like to ask about materials to work on ${m.en} ${f.dia} (${f.titulo.en}) at school.`
      : `Hola, quiero consultar por materiales para trabajar el ${f.dia} de ${m.es} (${f.titulo.es}) en la escuela.`;
    const anim = animar ? ' data-animate="subir" style="opacity:0;transform:translateY(20px)"' : '';
    return `<article class="fecha"${anim}>
      <p class="fecha__dia">${f.dia}<small>${esc(tr(m.corto))}</small></p>
      <div>
        <h3>${esc(tr(f.titulo))}</h3>
        <p>${esc(tr(f.texto))}</p>
        <a class="enlace" href="${wa(msg)}" target="_blank" rel="noopener"><span>${lang === 'en' ? 'Ask for materials for this date' : 'Pedir materiales para esta fecha'}</span><svg class="ico" aria-hidden="true"><use href="#i-flecha"/></svg></a>
      </div>
    </article>`;
  };
  const pintar = animar => {
    panel.innerHTML = (FECHAS[mes] || []).map(f => tarjeta(f, animar)).join('');
    panel.setAttribute('aria-labelledby', `mes-${mes}`);
    tabs.forEach(t => {
      const sel = t.dataset.mes === mes;
      t.setAttribute('aria-selected', String(sel));
      t.tabIndex = sel ? 0 : -1;
    });
    if (animar) revelarNuevos(panel);
    if (typeof ScrollTrigger !== 'undefined') requestAnimationFrame(() => ScrollTrigger.refresh());
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => { if (t.dataset.mes === mes) return; mes = t.dataset.mes; pintar(true); });
    t.addEventListener('keydown', e => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault();
      const sig = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
      sig.focus();
      sig.click();
    });
  });
  document.addEventListener('idioma', () => pintar(false));
  pintar(true);
}

function initConsulta() {
  const form = document.getElementById('consulta');
  if (!form) return;
  const vista = document.getElementById('consulta-vista');
  const elegido = name => form.querySelector(`input[name="${name}"]:checked`)?.closest('label')?.querySelector('span')?.textContent.trim() || '';
  const opcion = name => {
    const sel = form.querySelector(`select[name="${name}"]`);
    return sel?.value === '' ? '' : (sel?.selectedOptions[0]?.textContent.trim() || '');
  };
  const armar = () => {
    const quien = elegido('quien');
    const necesidad = elegido('necesidad');
    const provincia = opcion('provincia');
    const lengua = opcion('lengua');
    const detalle = (form.querySelector('[name="detalle"]')?.value || '').trim();
    const en = lang === 'en';
    const lineas = [en ? 'Hello, I saw the CEAPI website and I would like to ask a question.' : 'Hola, vi la web del CEAPI y quiero hacer una consulta.'];
    if (quien) lineas.push(`${en ? 'I am asking as' : 'Consulto como'}: ${quien}.`);
    if (necesidad) lineas.push(`${en ? 'We need' : 'Necesitamos'}: ${necesidad}.`);
    if (provincia) lineas.push(`${en ? 'Province' : 'Provincia'}: ${provincia}.`);
    if (lengua) lineas.push(`${en ? 'Language' : 'Lengua'}: ${lengua}.`);
    if (detalle) lineas.push(detalle);
    return lineas.join('\n');
  };
  const actualizar = () => { if (vista) vista.textContent = armar(); };
  form.addEventListener('input', actualizar);
  form.addEventListener('change', actualizar);
  document.addEventListener('idioma', actualizar);
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!elegido('necesidad')) {
      showToast(lang === 'en' ? 'Choose what you need and the message will be ready to send.' : 'Elegí qué necesitan y el mensaje queda listo para enviar.');
      form.querySelector('input[name="necesidad"]')?.focus();
      return;
    }
    window.open(wa(armar()), '_blank', 'noopener');
  });
  actualizar();
}

initIdiomas();
initLenguas();
initCalendario();
initConsulta();
initHeroMotion();
initHeroParallax();
initLeeScroll();
initDesplegables();
initReveals();
initNav();
initWspFloat();
initModelBarScroll();
