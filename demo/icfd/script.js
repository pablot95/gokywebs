const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5493816398814';
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
const wspLink = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const esM2 = document.body.classList.contains('m2');

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const svg = (d, extra = '') => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"${extra}>${d}</svg>`;
const ICON = {
  plus: svg('<path d="M12 5v14M5 12h14"/>'),
  check: svg('<path d="M20 6 9 17l-5-5"/>'),
  clase: svg('<rect x="3" y="4" width="18" height="12" rx="2"/><path d="m10 8 4 2-4 2Z"/><path d="M8 20h8"/>'),
  lectura: svg('<path d="M2 6.5C4.5 5 7.5 5 12 7c4.5-2 7.5-2 10-.5V19c-2.5-1.5-5.5-1.5-10 .5-4.5-2-7.5-2-10-.5Z"/><path d="M12 7v12.5"/>'),
  practica: svg('<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V3h6v1"/><path d="m9 13 2 2 4-4"/>'),
  lista: svg('<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V3h6v1M9 10h6M9 14h6M9 18h3"/>'),
  flecha: svg('<path d="M5 12h14M13 6l6 6-6 6"/>'),
  wsp: '<svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>'
};
const TIPOS = { clase: 'Clase virtual', lectura: 'Material de lectura', practica: 'Práctica guiada' };
const AREAS = { farmacia: 'Farmacia', dermocosmetica: 'Dermocosmética' };

const CURSOS = [
  {
    id: 'auxiliar-de-farmacia', folio: '01', titulo: 'Auxiliar de Farmacia', area: 'farmacia', nivel: 'Inicial', modalidad: 'Virtual',
    img: 'auxiliar-farmacia.webp', alt: 'Frascos ámbar de farmacia y mortero de porcelana sobre una mesa clara',
    corta: 'El trabajo diario en la farmacia: medicamentos, recetas y atención al público.',
    completa: 'Una formación de inicio para entender cómo funciona una farmacia por dentro: las formas farmacéuticas, la lectura de recetas, la conservación de los medicamentos y la atención a cada persona que se acerca al mostrador.',
    paraQuien: 'Para quienes quieren dar sus primeros pasos en el ámbito de la farmacia, sin formación previa.',
    resultados: ['Reconocer las formas farmacéuticas y cómo se conservan', 'Leer una receta y acompañar al farmacéutico en la dispensa', 'Ordenar el stock y controlar vencimientos', 'Atender al público con criterio y cuidado'],
    tags: 'medicamentos recetas mostrador atencion stock vencimientos',
    modulos: [
      { titulo: 'La farmacia por dentro', clases: [['Organización y circuitos de la farmacia', 'clase'], ['Rol del auxiliar y ética profesional', 'clase'], ['Glosario farmacéutico', 'lectura']] },
      { titulo: 'Medicamentos y recetas', clases: [['Formas farmacéuticas y vías de administración', 'clase'], ['Lectura e interpretación de recetas', 'clase'], ['Conservación, stock y vencimientos', 'practica']] },
      { titulo: 'Atención en el mostrador', clases: [['Comunicación con el paciente', 'clase'], ['Productos de venta libre', 'clase'], ['Dermocosmética en la farmacia', 'lectura']] }
    ]
  },
  {
    id: 'dermofarmacia', folio: '02', titulo: 'Dermofarmacia', area: 'farmacia', nivel: 'Especialización', modalidad: 'Virtual',
    img: 'dermofarmacia.webp', alt: 'Pomos de crema blancos y un sérum con gotero sobre una base de mármol',
    corta: 'Activos, formulaciones y consejo dermocosmético para recomendar según cada piel.',
    completa: 'Une la mirada farmacéutica con el cuidado de la piel: cómo está formulado cada producto, qué hace cada activo y cómo armar una recomendación a medida desde el mostrador.',
    paraQuien: 'Para auxiliares de farmacia y personas del rubro que quieren sumar el consejo dermocosmético.',
    resultados: ['Identificar biotipos y necesidades de la piel', 'Entender la función de los activos más usados', 'Leer la etiqueta de un cosmético (INCI)', 'Armar rutinas de cuidado y fotoprotección'],
    tags: 'piel activos serum etiqueta inci fotoproteccion consejo cosmeticos',
    modulos: [
      { titulo: 'La piel y sus necesidades', clases: [['Estructura y funciones de la piel', 'clase'], ['Biotipos y fototipos', 'clase'], ['Piel sensible y reactiva', 'lectura']] },
      { titulo: 'Activos y formulaciones', clases: [['Emulsiones, geles y sérums', 'clase'], ['Activos hidratantes y antioxidantes', 'clase'], ['Fotoprotección', 'lectura']] },
      { titulo: 'El consejo en el mostrador', clases: [['Cómo leer una etiqueta INCI', 'clase'], ['Rutinas de cuidado por biotipo', 'clase'], ['Casos de recomendación', 'practica']] }
    ]
  },
  {
    id: 'cosmetologia', folio: '03', titulo: 'Cosmetología', area: 'dermocosmetica', nivel: 'Inicial', modalidad: 'Virtual',
    img: 'cosmetologia.webp', alt: 'Bandeja con pinceles de mango bordó y discos de algodón, junto a una toalla y un florero',
    corta: 'Tratamientos faciales y corporales con bioseguridad, de la ficha al gabinete.',
    completa: 'La base para trabajar con la piel en gabinete: anatomía y fisiología cutánea, higiene y bioseguridad, limpieza facial profunda, máscaras, masajes y los primeros tratamientos corporales.',
    paraQuien: 'Para quienes quieren iniciarse en la estética profesional, sin formación previa.',
    resultados: ['Evaluar la piel y completar la ficha de cada paciente', 'Trabajar con normas de higiene y bioseguridad', 'Realizar una limpieza facial profunda', 'Organizar un gabinete de trabajo'],
    tags: 'estetica facial limpieza gabinete bioseguridad corporal masaje',
    modulos: [
      { titulo: 'Bases de la cosmetología', clases: [['Anatomía y fisiología de la piel', 'clase'], ['Higiene y bioseguridad', 'clase'], ['La ficha del paciente', 'practica']] },
      { titulo: 'Tratamientos faciales', clases: [['Limpieza facial profunda', 'clase'], ['Máscaras y exfoliación', 'clase'], ['Masaje facial', 'practica']] },
      { titulo: 'Cuerpo y gabinete', clases: [['Tratamientos corporales', 'clase'], ['Aparatología básica', 'lectura'], ['Organización del gabinete', 'lectura']] }
    ]
  },
  {
    id: 'dermatocosmiatria', folio: '04', titulo: 'Dermatocosmiatría', area: 'dermocosmetica', nivel: 'Especialización', modalidad: 'Virtual',
    img: 'dermatocosmiatria.webp', alt: 'Dermatoscopio de mano junto a un cuaderno con banda bordó',
    corta: 'Acné, manchas y envejecimiento: protocolos para pieles con alteraciones.',
    completa: 'Profundiza en las alteraciones más frecuentes de la piel y en cómo abordarlas desde el gabinete: evaluación, diseño de protocolos, peelings superficiales y seguimiento, siempre en diálogo con el médico dermatólogo.',
    paraQuien: 'Para cosmetólogas y cosmetólogos que quieren especializarse en pieles con alteraciones.',
    resultados: ['Evaluar la piel y reconocer cuándo derivar al médico', 'Abordar acné, hiperpigmentaciones y envejecimiento', 'Diseñar protocolos de tratamiento por etapas', 'Hacer el seguimiento de cada paciente'],
    tags: 'acne manchas envejecimiento peeling protocolos piel cosmiatria',
    modulos: [
      { titulo: 'Evaluación de la piel', clases: [['Lesiones elementales', 'clase'], ['Evaluación y registro fotográfico', 'practica'], ['Cuándo derivar al dermatólogo', 'lectura']] },
      { titulo: 'Alteraciones frecuentes', clases: [['Acné', 'clase'], ['Hiperpigmentaciones', 'clase'], ['Envejecimiento cutáneo', 'clase']] },
      { titulo: 'Protocolos', clases: [['Peelings químicos superficiales', 'clase'], ['Diseño de protocolos por etapas', 'practica'], ['Seguimiento del paciente', 'lectura']] }
    ]
  },
  {
    id: 'estetica-oncologica', folio: '05', titulo: 'Estética Oncológica', area: 'dermocosmetica', nivel: 'Especialización', modalidad: 'Virtual',
    img: 'estetica-oncologica.webp', alt: 'Toallas blancas dobladas y un pote de crema sobre una bandeja de cerámica',
    corta: 'Cuidado de la piel durante y después del tratamiento oncológico, con protocolos seguros.',
    completa: 'Una especialización para acompañar a personas en tratamiento oncológico: cómo cambia la piel, qué se puede hacer y qué no, protocolos suaves de higiene e hidratación y el trabajo junto al equipo médico.',
    paraQuien: 'Para profesionales de la estética que quieren acompañar a pacientes oncológicos con seguridad.',
    resultados: ['Conocer los efectos de los tratamientos oncológicos en la piel', 'Aplicar protocolos suaves de higiene e hidratación', 'Reconocer contraindicaciones y trabajar con el equipo médico', 'Acompañar a cada paciente con empatía'],
    tags: 'oncologica oncologia paciente cuidado piel quimioterapia radioterapia',
    modulos: [
      { titulo: 'La piel en tratamiento oncológico', clases: [['Efectos de la quimio y la radioterapia en la piel', 'clase'], ['Contraindicaciones', 'lectura'], ['Trabajo con el equipo médico', 'clase']] },
      { titulo: 'Protocolos de cuidado', clases: [['Higiene e hidratación', 'clase'], ['Cuidado de uñas y cuero cabelludo', 'clase'], ['Fotoprotección', 'lectura']] },
      { titulo: 'Acompañamiento', clases: [['Comunicación con el paciente', 'clase'], ['Automaquillaje y bienestar', 'practica'], ['Un gabinete seguro', 'lectura']] }
    ]
  }
];
CURSOS.forEach(c => {
  c.buscable = norm([c.titulo, AREAS[c.area], c.nivel, c.modalidad, c.corta, c.completa, c.tags, c.modulos.map(m => m.titulo + ' ' + m.clases.map(k => k[0]).join(' ')).join(' ')].join(' '));
});
const getCurso = id => CURSOS.find(c => c.id === id);

const Cart = {
  KEY: 'icfd_inscripcion',
  mem: [],
  get() {
    try {
      const v = JSON.parse(localStorage.getItem(this.KEY));
      return Array.isArray(v) ? v.filter(i => i && getCurso(i.id)).map(i => ({ id: i.id, qty: 1 })) : [];
    } catch { return this.mem.slice(); }
  },
  save(items) {
    try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch { this.mem = items.slice(); }
    document.dispatchEvent(new CustomEvent('cart:updated'));
  },
  has(id) { return this.get().some(i => i.id === id); },
  add(curso) {
    const items = this.get();
    if (items.some(i => i.id === curso.id)) return false;
    items.push({ id: curso.id, qty: 1 });
    this.save(items);
    return true;
  },
  remove(id) { this.save(this.get().filter(i => i.id !== id)); },
  clear() { this.save([]); },
  count() { return this.get().length; }
};

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

const abiertos = new Set();
function overlay(nombre, abierto) {
  if (abierto) abiertos.add(nombre); else abiertos.delete(nombre);
  const nav = document.getElementById('mainNav');
  document.body.classList.toggle('no-scroll', abiertos.size > 0 || !!nav?.classList.contains('open'));
}

const FOCUSABLES = 'a[href], button:not([disabled]), input, summary, [tabindex]:not([tabindex="-1"])';
function atraparFoco(e, cont) {
  if (e.key !== 'Tab' || !cont) return;
  const f = [...cont.querySelectorAll(FOCUSABLES)].filter(el => el.getClientRects().length);
  if (!f.length) return;
  const first = f[0];
  const last = f[f.length - 1];
  if (e.shiftKey && (document.activeElement === first || document.activeElement === cont)) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

const estado = { q: '', area: '', nivel: '' };

function filtrados() {
  const palabras = norm(estado.q).split(/\s+/).filter(Boolean);
  return CURSOS.filter(c =>
    (!estado.area || c.area === estado.area) &&
    (!estado.nivel || c.nivel === estado.nivel) &&
    palabras.every(w => c.buscable.includes(w))
  );
}

function botonSumar(c, conTexto) {
  const en = Cart.has(c.id);
  const label = en ? `${c.titulo} ya está en tu inscripción` : `Sumar ${c.titulo} a mi inscripción`;
  return `<button type="button" class="btn-sumar${en ? ' is-en' : ''}${conTexto ? ' btn-sumar--texto' : ''}" data-add="${c.id}" aria-label="${esc(label)}" aria-pressed="${en}">${en ? ICON.check : ICON.plus}${conTexto ? `<span>${en ? 'En tu inscripción' : 'Sumar a mi inscripción'}</span>` : ''}</button>`;
}

function fichaHTML(c) {
  return `<article class="curso" data-animate="subir" style="opacity:0;transform:translateY(32px)">
    <button type="button" class="curso-foto" data-ver="${c.id}" aria-label="Ver el programa de ${esc(c.titulo)}"><img src="images/${c.img}" width="1024" height="1024" alt="${esc(c.alt)}"></button>
    <div class="curso-cuerpo">
      <p class="folio">Nº ${c.folio} · ${AREAS[c.area]}</p>
      <h3 class="curso-titulo">${esc(c.titulo)}</h3>
      <p class="curso-meta">${esc(c.nivel)} · ${c.modulos.length} módulos</p>
      <div class="curso-acciones"><button type="button" class="btn btn--chico" data-ver="${c.id}">Ver programa</button>${botonSumar(c, false)}</div>
    </div>
  </article>`;
}

function filaHTML(c) {
  return `<article class="fila" data-animate="subir" style="opacity:0;transform:translateY(32px)">
    <button type="button" class="fila-foto" data-ver="${c.id}" aria-label="Ver el programa de ${esc(c.titulo)}"><img src="images/${c.img}" width="1024" height="1024" alt="${esc(c.alt)}"></button>
    <div class="fila-info">
      <p class="folio">Nº ${c.folio} · ${AREAS[c.area]}</p>
      <h3 class="curso-titulo">${esc(c.titulo)}</h3>
      <p class="fila-corta">${esc(c.corta)}</p>
      <p class="curso-meta">${esc(c.modalidad)} · ${esc(c.nivel)} · ${c.modulos.length} módulos · Certificación nacional</p>
    </div>
    <div class="fila-acciones"><button type="button" class="btn btn--chico" data-ver="${c.id}">Ver programa</button>${botonSumar(c, true)}</div>
  </article>`;
}

function renderCursos() {
  const cont = document.getElementById('cursos');
  const vacio = document.getElementById('cursosVacio');
  if (!cont) return;
  const lista = filtrados();
  cont.innerHTML = lista.map(esM2 ? filaHTML : fichaHTML).join('');
  if (vacio) vacio.hidden = lista.length > 0;
  const contador = document.getElementById('contador');
  if (contador) contador.textContent = lista.length === 1 ? '1 formación' : `${lista.length} formaciones`;
  const limpiar = document.getElementById('limpiar');
  if (limpiar) limpiar.hidden = !(estado.q || estado.area || estado.nivel);
  document.querySelectorAll('[data-f-area]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.fArea === estado.area)));
  document.querySelectorAll('[data-f-nivel]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.fNivel === estado.nivel)));
  revelarNuevos(cont);
}

function limpiarFiltros() {
  estado.q = ''; estado.area = ''; estado.nivel = '';
  const input = document.getElementById('buscador');
  if (input) input.value = '';
  renderCursos();
}

function initFiltros() {
  const input = document.getElementById('buscador');
  let t = 0;
  input?.addEventListener('input', () => {
    clearTimeout(t);
    t = setTimeout(() => { estado.q = input.value.slice(0, 60); renderCursos(); }, 160);
  });
  document.querySelectorAll('[data-f-area]').forEach(b => b.addEventListener('click', () => { estado.area = b.dataset.fArea; renderCursos(); }));
  document.querySelectorAll('[data-f-nivel]').forEach(b => b.addEventListener('click', () => { estado.nivel = b.dataset.fNivel; renderCursos(); }));
  document.getElementById('limpiar')?.addEventListener('click', limpiarFiltros);
}

function refreshSumar(cont = document) {
  cont.querySelectorAll('[data-add]').forEach(b => {
    const c = getCurso(b.dataset.add);
    if (!c) return;
    const en = Cart.has(c.id);
    const conTexto = b.classList.contains('btn-sumar--texto');
    b.classList.toggle('is-en', en);
    b.setAttribute('aria-pressed', String(en));
    b.setAttribute('aria-label', en ? `${c.titulo} ya está en tu inscripción` : `Sumar ${c.titulo} a mi inscripción`);
    b.innerHTML = `${en ? ICON.check : ICON.plus}${conTexto ? `<span>${en ? 'En tu inscripción' : 'Sumar a mi inscripción'}</span>` : ''}`;
  });
}

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
}

function sumar(id) {
  const c = getCurso(id);
  if (!c) return;
  if (Cart.has(id)) { abrirDrawer(document.activeElement); return; }
  Cart.add(c);
  showToast(`Sumaste ${c.titulo} a tu inscripción.`);
}

function modalHTML(c) {
  const msg = `Hola ICFD! Quiero información sobre la formación ${c.titulo}: fechas, valores y requisitos.`;
  const modulos = c.modulos.map((m, i) => {
    const clases = m.clases.map(k => `<li class="clase">${ICON[k[1]]}<span>${esc(k[0])}</span><span class="clase-tipo">${TIPOS[k[1]]}</span></li>`).join('');
    return `<details class="modulo"${i === 0 ? ' open' : ''}><summary><span class="modulo-tit"><span>Módulo ${i + 1}</span><strong>${esc(m.titulo)}</strong></span><span class="modulo-n">${m.clases.length} clases<span class="mas-menos" aria-hidden="true"></span></span></summary><ol class="clases">${clases}</ol></details>`;
  }).join('');
  return `<div class="mc-top">
      <div class="mc-foto"><img src="images/${c.img}" width="1024" height="1024" alt="${esc(c.alt)}"></div>
      <div class="mc-info">
        <p class="folio">Nº ${c.folio} · ${AREAS[c.area]}</p>
        <h2 class="mc-titulo">${esc(c.titulo)}</h2>
        <p class="mc-desc">${esc(c.completa)}</p>
        <dl class="mc-datos">
          <div><dt>Modalidad</dt><dd>${esc(c.modalidad)}</dd></div>
          <div><dt>Nivel</dt><dd>${esc(c.nivel)}</dd></div>
          <div><dt>Programa</dt><dd>${c.modulos.length} módulos</dd></div>
          <div><dt>Certificación</dt><dd>Nacional</dd></div>
        </dl>
        <div class="mc-botones"><button type="button" class="btn btn--cta" data-inscribir="${c.id}">Inscribirme</button><a class="btn btn--linea" href="${wspLink(msg)}" target="_blank" rel="noopener">Consultar esta formación</a></div>
      </div>
    </div>
    <div class="mc-cuerpo">
      <div class="mc-bloque">
        <h3>Programa</h3>
        ${modulos}
        <p class="mc-nota">Programa orientativo: el instituto confirma contenidos, duración y fechas al inscribirte.</p>
      </div>
      <div class="mc-lado">
        <div class="mc-bloque"><h3>Para quién es</h3><p>${esc(c.paraQuien)}</p></div>
        <div class="mc-bloque"><h3>Lo que vas a aprender</h3><ul class="mc-lista">${c.resultados.map(r => `<li>${ICON.check}<span>${esc(r)}</span></li>`).join('')}</ul></div>
      </div>
    </div>`;
}

let modalOrigen = null;
let cursoAbierto = '';
function syncURL() {
  const url = new URL(location.href);
  if (cursoAbierto) url.searchParams.set('curso', cursoAbierto); else url.searchParams.delete('curso');
  window.history.replaceState(null, '', url.pathname + url.search + url.hash);
}

function abrirCurso(id, origen) {
  const c = getCurso(id);
  const modal = document.getElementById('modal');
  const cont = document.getElementById('modalContenido');
  if (!c || !modal || !cont) return;
  cont.innerHTML = modalHTML(c);
  modalOrigen = origen || document.activeElement;
  modal.querySelector('.modal-panel')?.setAttribute('aria-label', `Programa de ${c.titulo}`);
  modal.hidden = false;
  overlay('modal', true);
  const panel = modal.querySelector('.modal-panel');
  panel.scrollTop = 0;
  requestAnimationFrame(() => requestAnimationFrame(() => modal.classList.add('open')));
  panel.focus({ preventScroll: true });
  cursoAbierto = c.id;
  syncURL();
}

function cerrarModal(devolverFoco = true) {
  const modal = document.getElementById('modal');
  if (!modal || modal.hidden) return;
  modal.classList.remove('open');
  overlay('modal', false);
  cursoAbierto = '';
  syncURL();
  setTimeout(() => { if (!modal.classList.contains('open')) modal.hidden = true; }, reduceMotion ? 0 : 320);
  if (devolverFoco && modalOrigen && document.contains(modalOrigen)) modalOrigen.focus({ preventScroll: true });
}

function mensajeInscripcion(lista) {
  return `Hola ICFD! Quiero inscribirme en:\n${lista.map(c => `• ${c.titulo}`).join('\n')}\n¿Me pasan fechas, valores y requisitos?`;
}

let drawerOrigen = null;
function renderDrawer() {
  const items = document.getElementById('drawerItems');
  const pie = document.getElementById('drawerPie');
  if (!items || !pie) return;
  const lista = Cart.get().map(i => getCurso(i.id)).filter(Boolean);
  if (!lista.length) {
    items.innerHTML = `<div class="d-vacio">${ICON.lista}<p><strong>Todavía no sumaste ninguna formación.</strong></p><p>Mirá los programas y elegí por dónde empezar.</p><button type="button" class="btn btn--cta" data-ir-oferta>Ver la oferta académica</button></div>`;
    pie.hidden = true;
    return;
  }
  pie.hidden = false;
  items.innerHTML = lista.map(c => `<div class="d-item"><div class="d-foto"><img src="images/${c.img}" width="1024" height="1024" alt=""></div><div class="d-info"><strong>${esc(c.titulo)}</strong><span>${esc(c.modalidad)} · ${esc(c.nivel)}</span></div><button type="button" class="d-quitar" data-quitar="${c.id}" aria-label="Quitar ${esc(c.titulo)} de mi inscripción">Quitar</button></div>`).join('');
  const enviar = document.getElementById('drawerEnviar');
  if (enviar) enviar.href = wspLink(mensajeInscripcion(lista));
}

function abrirDrawer(origen) {
  const d = document.getElementById('drawer');
  if (!d) return;
  renderDrawer();
  drawerOrigen = origen || document.activeElement;
  d.hidden = false;
  overlay('drawer', true);
  requestAnimationFrame(() => requestAnimationFrame(() => d.classList.add('open')));
  d.querySelector('.drawer-panel')?.focus({ preventScroll: true });
}

function cerrarDrawer(devolverFoco = true) {
  const d = document.getElementById('drawer');
  if (!d || d.hidden) return;
  d.classList.remove('open');
  overlay('drawer', false);
  setTimeout(() => { if (!d.classList.contains('open')) d.hidden = true; }, reduceMotion ? 0 : 380);
  if (devolverFoco && drawerOrigen && document.contains(drawerOrigen)) drawerOrigen.focus({ preventScroll: true });
}

function inscribir(id) {
  const c = getCurso(id);
  if (!c) return;
  Cart.add(c);
  const modal = document.getElementById('modal');
  const desdeModal = modal && !modal.hidden;
  if (desdeModal) cerrarModal(false);
  abrirDrawer(desdeModal ? modalOrigen : document.activeElement);
}

function initAcciones() {
  document.addEventListener('click', e => {
    const t = e.target;
    const ver = t.closest('[data-ver]');
    if (ver) { e.preventDefault(); abrirCurso(ver.dataset.ver, ver); return; }
    const ins = t.closest('[data-inscribir]');
    if (ins) { e.preventDefault(); inscribir(ins.dataset.inscribir); return; }
    const add = t.closest('[data-add]');
    if (add) { e.preventDefault(); sumar(add.dataset.add); return; }
    const quitar = t.closest('[data-quitar]');
    if (quitar) {
      const c = getCurso(quitar.dataset.quitar);
      Cart.remove(quitar.dataset.quitar);
      if (c) showToast(`Sacaste ${c.titulo} de tu inscripción.`);
      document.querySelector('.drawer-panel')?.focus({ preventScroll: true });
      return;
    }
    if (t.closest('[data-limpiar]')) { limpiarFiltros(); return; }
    if (t.closest('[data-cart-open]')) { abrirDrawer(t.closest('[data-cart-open]')); return; }
    if (t.closest('[data-cerrar]')) { cerrarModal(); return; }
    if (t.closest('[data-cerrar-drawer]')) { cerrarDrawer(); return; }
    if (t.closest('[data-ir-oferta]')) {
      cerrarDrawer(false);
      document.getElementById('oferta')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    }
  });
  document.addEventListener('keydown', e => {
    const drawer = document.getElementById('drawer');
    const modal = document.getElementById('modal');
    const drawerAbierto = drawer && !drawer.hidden;
    const modalAbierto = modal && !modal.hidden;
    if (e.key === 'Escape') {
      if (drawerAbierto) cerrarDrawer();
      else if (modalAbierto) cerrarModal();
      return;
    }
    if (drawerAbierto) atraparFoco(e, drawer.querySelector('.drawer-panel'));
    else if (modalAbierto) atraparFoco(e, modal.querySelector('.modal-panel'));
  });
  document.addEventListener('cart:updated', () => { refreshSumar(); renderDrawer(); updateCartBadge(); });
}

function initFloats() {
  const wsp = document.getElementById('wsp-float');
  const cart = document.getElementById('cart-float');
  const sync = () => {
    const scrolled = window.scrollY > 600;
    wsp?.classList.toggle('visible', scrolled);
    cart?.classList.toggle('visible', scrolled || Cart.count() > 0);
  };
  window.addEventListener('scroll', sync, { passive: true });
  document.addEventListener('cart:updated', sync);
  cart?.addEventListener('click', () => abrirDrawer(cart));
  sync();
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
    toggle.setAttribute('aria-expanded', 'false'); document.body.classList.toggle('no-scroll', abiertos.size > 0);
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
  nav.addEventListener('keydown', e => { if (nav.classList.contains('open')) atraparFoco(e, nav); });
  const syncInert = () => {
    if (desktopMq.matches) { nav.removeAttribute('inert'); if (nav.classList.contains('open')) close(); }
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

function initMapa() {
  const el = document.getElementById('mapa');
  if (!el || typeof L === 'undefined') return;
  const punto = [-26.8303, -65.2038];
  const mapa = L.map(el, { scrollWheelZoom: false, zoomControl: true, attributionControl: true }).setView(punto, 13);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap', maxZoom: 19 }).addTo(mapa);
  const icono = L.divIcon({ className: 'mapa-pin', html: '<span></span>', iconSize: [34, 34], iconAnchor: [17, 34] });
  L.marker(punto, { icon: icono, keyboard: false }).addTo(mapa).bindPopup('<strong>ICFD</strong><br>Ubicación de referencia en Tucumán');
  const refrescar = () => mapa.invalidateSize();
  window.addEventListener('load', refrescar);
  setTimeout(refrescar, 1400);
}

function leerURL() {
  const p = new URLSearchParams(location.search);
  const curso = p.get('curso');
  return curso && getCurso(curso) ? curso : '';
}

const cursoInicial = leerURL();
renderCursos();
initFiltros();
initReveals();
initNav();
initModelBarScroll();
initAcciones();
initFloats();
initMapa();
updateCartBadge();
if (cursoInicial) abrirCurso(cursoInicial, document.getElementById('oferta'));
