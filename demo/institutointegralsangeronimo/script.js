'use strict';

const WHATSAPP_NUMBER = '5493844408357';
const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const BANNERS = [];
const CATEGORIAS = ['Grafología forense', 'Grafoanálisis', 'Perfilación criminal'];
const SEMILLAS = [
  ['grafologia-forense', 'Grafología forense', 0, 'Inicial', 'A distancia', 54000, 80, 3, 'Reconocé los elementos de una escritura y organizá una primera comparación documental.', ['El documento y su contexto', 'Observación de rasgos gráficos', 'Comparación y registro'], [['Alcances y límites del análisis', 'Documentos de referencia', 'Registro de observaciones'], ['Forma y proporción', 'Dirección y continuidad', 'Variaciones de escritura'], ['Selección de muestras', 'Coincidencias y diferencias', 'Práctica integradora']]],
  ['analisis-de-firmas', 'Análisis de firmas', 0, 'Intermedio', 'En vivo', 68000, 100, 4, 'Practicá un proceso de observación y cotejo de firmas con muestras de estudio.', ['La firma como objeto de estudio', 'Cotejo de muestras', 'Presentación del análisis'], [['Gestos gráficos', 'Variaciones naturales', 'Calidad de las muestras'], ['Selección del material', 'Puntos de comparación', 'Registro fotográfico'], ['Organización de hallazgos', 'Límites de la conclusión', 'Caso de práctica']]],
  ['grafoanalisis', 'Grafoanálisis científico', 1, 'Inicial', 'A distancia', 48000, 60, 5, 'Explorá el estudio de la escritura con énfasis en el método, sus alcances y sus límites.', ['Lectura del material gráfico', 'Criterios de observación', 'Análisis crítico'], [['Historia y enfoques', 'Condiciones de escritura', 'Contexto de la muestra'], ['Orden y distribución', 'Dimensión y dirección', 'Continuidad del trazo'], ['Hipótesis y evidencia', 'Sesgos de interpretación', 'Ejercicio de revisión']]],
  ['perfilacion-criminal', 'Perfilación criminal', 2, 'Inicial', 'En vivo', 72000, 120, 8, 'Introducí herramientas para ordenar información y formular hipótesis sobre un caso de estudio.', ['Bases de la perfilación', 'Análisis de información', 'Construcción de hipótesis'], [['Conceptos y alcances', 'Fuentes de información', 'Ética y límites'], ['Contexto del caso', 'Patrones y secuencias', 'Información faltante'], ['Hipótesis alternativas', 'Contraste con datos', 'Caso integrador']]],
  ['documentos-cuestionados', 'Documentos cuestionados', 0, 'Avanzado', 'Semipresencial', 86000, 140, 1, 'Organizá el examen de documentos y aprendé a comunicar observaciones con claridad.', ['Recepción del material', 'Examen documental', 'Informe de observaciones'], [['Identificación de piezas', 'Registro y preservación', 'Plan de examen'], ['Soportes y tintas', 'Alteraciones observables', 'Documentación visual'], ['Estructura del informe', 'Evidencia y limitaciones', 'Práctica de redacción']]],
  ['escritura-y-contexto', 'Escritura y contexto', 1, 'Intermedio', 'En vivo', 42000, 80, 6, 'Distinguí lo observado de lo interpretado al trabajar con muestras de escritura.', ['La muestra en contexto', 'Variabilidad gráfica', 'Revisión de conclusiones'], [['Material disponible', 'Condiciones de producción', 'Preguntas de análisis'], ['Diferencias entre muestras', 'Factores de variación', 'Registro comparativo'], ['Inferencias y límites', 'Revisión entre pares', 'Ejercicio integrador']]],
  ['analisis-de-casos', 'Análisis de casos', 2, 'Intermedio', 'Semipresencial', 64000, 100, 7, 'Construí una lectura ordenada de casos de estudio y diferenciá datos, hipótesis y conclusiones.', ['Organización del caso', 'Lectura de patrones', 'Comunicación del análisis'], [['Cronología', 'Fuentes y confiabilidad', 'Matriz de información'], ['Secuencia de hechos', 'Hipótesis alternativas', 'Sesgos frecuentes'], ['Síntesis del caso', 'Preguntas pendientes', 'Presentación final']]],
  ['introduccion-forense', 'Introducción forense', 2, 'Inicial', 'A distancia', 0, 40, 9, 'Conocé las áreas de las ciencias forenses y las preguntas que orientan su estudio.', ['El campo forense', 'Método y documentación', 'Rutas de formación'], [['Disciplinas y preguntas', 'Trabajo interdisciplinario', 'Glosario de inicio'], ['Observar y registrar', 'Datos e interpretación', 'Límites del análisis'], ['Áreas de interés', 'Lectura de un programa', 'Actividad de orientación']]]
];
const PRODUCTOS = SEMILLAS.map((s, i) => ({
  id: s[0], slug: s[0], titulo: s[1], categoria: CATEGORIAS[s[2]], nivel: s[3], modalidad: s[4], precio: s[5], descuento: 0,
  duracion: s[6] * 9 / 60, cantidadClases: 9, docenteId: 'equipo-por-confirmar', docente: 'Docente a confirmar',
  portada: `images/${String(s[7]).padStart(2, '0')}_imagen.webp`, descripcionCorta: s[8], descripcionCompleta: s[8],
  destacado: [0, 2, 3].includes(i), nuevo: i === 7, trailer: '', etiquetas: [s[3], s[4]],
  resultados: ['Identificar conceptos y límites del tema.', 'Registrar observaciones de manera ordenada.', 'Aplicar lo estudiado a un caso de práctica.'],
  requisitos: s[3] === 'Inicial' ? 'Interés por el área. No requiere experiencia previa en esta propuesta de ejemplo.' : 'Conocimientos introductorios del área. Requisitos definitivos a confirmar.',
  incluye: ['Programa por módulos', 'Lecturas y ejercicios de ejemplo', 'Actividad integradora propuesta'],
  modulos: s[9].map((titulo, m) => ({id: `${s[0]}-m${m + 1}`, titulo, clases: s[10][m].map((tituloClase, c) => ({id: `${s[0]}-m${m + 1}-c${c + 1}`, titulo: tituloClase, duracion: s[6], tipo: ['Lectura', 'Video', 'Práctica'][c], preview: false, recurso: ''}))}))
}));
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const getProducto = id => PRODUCTOS.find(p => p.id === id);
const normalize = text => String(text ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
function sanitizeCart(raw) {
  if (!Array.isArray(raw)) return [];
  const seen = new Set();
  return raw.filter(item => {
    if (!item || !getProducto(item.id) || seen.has(item.id)) return false;
    seen.add(item.id); return true;
  }).map(item => ({id: item.id, qty: 1}));
}
const Cart = {
  KEY: 'institutointegralsangeronimo_cart',
  memory: [],
  get() { try { return sanitizeCart(JSON.parse(localStorage.getItem(this.KEY)) || []); } catch { return this.memory; } },
  save(items) { this.memory = sanitizeCart(items); try { localStorage.setItem(this.KEY, JSON.stringify(this.memory)); } catch { showToast('Tu selección se conserva mientras esta página esté abierta.'); } document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto) { if (!producto) return; const items = this.get(); if (!items.some(i => i.id === producto.id)) items.push({id: producto.id, qty: 1}); this.save(items); },
  remove(id) { this.save(this.get().filter(i => i.id !== id)); },
  clear() { this.save([]); },
  count() { return this.get().length; },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) : s; }, 0); }
};
function filterCourses(courses, f = {}) {
  const terms = normalize(f.q).split(/\s+/).filter(Boolean);
  return courses.filter(p => {
    const haystack = normalize([p.titulo, p.categoria, p.nivel, p.modalidad, p.docenteId === 'equipo-por-confirmar' ? '' : p.docente, p.descripcionCorta, ...p.etiquetas].join(' '));
    return terms.every(t => haystack.includes(t)) && (!f.category || p.categoria === f.category) && (!f.level || p.nivel === f.level) && (!f.mode || p.modalidad === f.mode) && (!f.duration || (f.duration === 'short' ? p.duracion <= 9 : f.duration === 'medium' ? p.duracion > 9 && p.duracion <= 15 : p.duracion > 15)) && (!f.price || (f.price === 'free' ? p.precio === 0 : f.price === 'low' ? p.precio > 0 && p.precio <= 60000 : p.precio > 60000));
  });
}
const pageItems = (items, limit = 12) => items.slice(0, Math.max(0, limit));
const arrow = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M4 12h16m-6-6 6 6-6 6"/></svg>';
let revealsListos = false;
let activeOverlay = null;
let returnFocus = null;
let visibleLimit = 12;
const priceLabel = p => p.precio === 0 ? 'Gratis · demo' : formatearPrecio(precioFinal(p));
function cardHTML(p, featured = false) {
  return `<article class="course-wrap" data-animate="subir" style="opacity:0;transform:translateY(32px)"><div class="course-card${featured ? ' featured-card' : ''}"><div class="course-photo"><img src="${p.portada}" alt="Imagen ilustrativa de ${esc(p.titulo.toLowerCase())}" width="1254" height="1254" decoding="async"><span class="course-tag">${esc(p.modalidad)}</span></div><div class="course-info"><p class="course-category">${esc(p.categoria)}</p><h3>${esc(p.titulo)}</h3><p class="course-teacher">${p.docente}</p><p class="course-meta">${p.duracion} h · ${p.nivel} · 9 clases</p><div class="course-price">${priceLabel(p)}<span>Arancel de ejemplo</span></div><div class="course-actions"><button type="button" data-course="${p.id}" aria-label="Ver programa de ${esc(p.titulo)}">Ver programa ${arrow}</button><button type="button" class="add-course" data-add="${p.id}" aria-label="Agregar ${esc(p.titulo)} a tu inscripción">+</button></div></div></div></article>`;
}
function readFilters() {
  return Object.fromEntries(['q', 'category', 'level', 'mode', 'duration', 'price'].map(k => [k, document.querySelector(`[name="${k}"]`)?.value || '']));
}
function renderCatalog() {
  const grid = document.getElementById('catalog-grid'); if (!grid) return;
  const results = filterCourses(PRODUCTOS, readFilters());
  grid.innerHTML = pageItems(results, visibleLimit).map(p => cardHTML(p)).join('');
  document.getElementById('results-count').textContent = `${results.length} ${results.length === 1 ? 'curso' : 'cursos'}`;
  document.getElementById('empty-results').hidden = results.length > 0;
  document.getElementById('more-courses').hidden = results.length <= visibleLimit;
  revelarNuevos(grid);
}
function initCatalog() {
  const featured = document.getElementById('featured-grid'); if (featured) featured.innerHTML = PRODUCTOS.filter(p => p.destacado).map(p => cardHTML(p, true)).join('');
  const form = document.getElementById('course-filters'); if (!form) return;
  form.addEventListener('submit', e => e.preventDefault());
  form.addEventListener('input', () => { visibleLimit = 12; renderCatalog(); });
  document.querySelectorAll('[data-clear-filters]').forEach(b => b.addEventListener('click', () => { form.reset(); visibleLimit = 12; renderCatalog(); }));
  document.querySelectorAll('[data-category]').forEach(b => b.addEventListener('click', () => { form.reset(); form.elements.category.value = b.dataset.category; visibleLimit = 12; renderCatalog(); document.getElementById('cursos').scrollIntoView({behavior: reduceMotion ? 'auto' : 'smooth'}); }));
  document.getElementById('more-courses')?.addEventListener('click', () => { visibleLimit += 12; renderCatalog(); });
  document.querySelector('[data-open-filters]')?.addEventListener('click', e => { const panel = document.getElementById('filter-facets'); const open = panel.classList.toggle('is-open'); e.currentTarget.setAttribute('aria-expanded', String(open)); });
  renderCatalog();
}
function focusable(root) { return [...root.querySelectorAll('a[href],button:not([disabled]),input,select,textarea,summary,[tabindex="0"]')].filter(e => !e.closest('[hidden], [inert]') && e.getClientRects().length); }
function openOverlay(id, opener) {
  if (activeOverlay) closeOverlay(false);
  const overlay = document.getElementById(id); if (!overlay) return;
  returnFocus = opener || document.activeElement; activeOverlay = overlay;
  overlay.hidden = false; document.body.classList.add('no-scroll');
  document.querySelectorAll('body > header, body > main, body > footer').forEach(e => e.inert = true);
  requestAnimationFrame(() => overlay.classList.add('is-open'));
  focusable(overlay)[0]?.focus();
}
function closeOverlay(restore = true) {
  if (!activeOverlay) return;
  activeOverlay.classList.remove('is-open'); activeOverlay.hidden = true; activeOverlay = null;
  document.body.classList.remove('no-scroll');
  document.querySelectorAll('body > header, body > main, body > footer').forEach(e => e.inert = false);
  if (restore && returnFocus?.isConnected) returnFocus.focus();
}
function openCourse(id, opener) {
  const p = getProducto(id); if (!p) return;
  document.getElementById('course-detail').innerHTML = `<div class="detail-intro"><div class="detail-image"><img src="${p.portada}" alt="Imagen ilustrativa de ${esc(p.titulo)}" width="1254" height="1254"></div><div><p class="eyebrow">Programa demostrativo · ${esc(p.categoria)}</p><h2>${esc(p.titulo)}</h2><p>${esc(p.descripcionCompleta)}</p><p class="detail-meta">${p.duracion} horas · 9 clases · ${p.nivel}<br>${p.modalidad} · Fechas y acceso a confirmar</p><p class="detail-price">${priceLabel(p)}</p><button type="button" class="btn btn-primary" data-buy="${p.id}">${p.precio === 0 ? 'Inscribirme gratis' : 'Elegir este curso'} ${arrow}</button></div></div><p class="demo-note">Este curso, su programa y su arancel son ejemplos para mostrar la plataforma. La oferta definitiva se confirma con el instituto.</p><h3>El programa, módulo a módulo</h3><div class="program">${p.modulos.map((m, i) => `<details${i === 0 ? ' open' : ''}><summary><span>0${i + 1} · ${esc(m.titulo)}</span><span>${m.clases.reduce((n, c) => n + c.duracion, 0) / 60} h</span></summary><ol>${m.clases.map(c => `<li><span>${esc(c.titulo)}</span><small>${c.tipo} · ${c.duracion} min</small></li>`).join('')}</ol></details>`).join('')}</div><div class="detail-columns"><div><h3>Qué vas a trabajar</h3><ul>${p.resultados.map(t => `<li>${t}</li>`).join('')}</ul><h3>Qué necesitás</h3><p>${p.requisitos}</p></div><div><h3>Qué incluye la propuesta</h3><ul>${p.incluye.map(t => `<li>${t}</li>`).join('')}</ul><h3>Equipo docente</h3><p>Docente a confirmar. La institución publicará la presentación y las credenciales verificadas del equipo antes de abrir la inscripción.</p></div></div><details class="detail-faq"><summary>¿Este curso tiene aval nacional?</summary><p>No hay un aval nacional confirmado para esta propuesta de ejemplo. Consultá el alcance y la documentación antes de inscribirte.</p></details><details class="detail-faq"><summary>¿Puedo acceder a una clase desde esta demo?</summary><p>El programa permite explorar la estructura. Las clases, los materiales y el acceso del alumno se habilitan en la plataforma definitiva.</p></details>`;
  openOverlay('course-modal', opener);
}
function renderCart() {
  const items = Cart.get(); const root = document.getElementById('cart-items'); if (!root) return;
  root.innerHTML = items.length ? items.map(i => { const p = getProducto(i.id); return `<article class="cart-item"><div class="cart-image"><img src="${p.portada}" alt="" width="1254" height="1254"></div><div><h3>${esc(p.titulo)}</h3><p>${p.modalidad} · ${priceLabel(p)}</p><button type="button" class="text-button" data-remove="${p.id}" aria-label="Quitar ${esc(p.titulo)}">Quitar curso</button></div></article>`; }).join('') : '<div class="empty-cart"><p class="empty-title">Tu próximo aprendizaje empieza acá.</p><p>Explorá los programas y sumá los cursos que te interesan.</p><button type="button" class="btn btn-primary" data-back-catalog>Explorar cursos</button></div>';
  document.getElementById('cart-total').textContent = formatearPrecio(Cart.total());
  document.getElementById('cart-summary').hidden = items.length === 0;
  document.getElementById('finish-enrollment').disabled = items.length === 0;
}
function openCartDrawer(opener) { renderCart(); openOverlay('cart-drawer', opener?.nodeType === 1 ? opener : document.activeElement); }
function initInteractions() {
  document.addEventListener('click', e => {
    const b = e.target.closest('button,a');
    if (b?.dataset.course) openCourse(b.dataset.course, b);
    if (b?.dataset.add) { const p = getProducto(b.dataset.add); if (Cart.get().some(i => i.id === p?.id)) showToast('Este curso ya está en tu inscripción.'); else { Cart.add(p); showToast(`${p?.titulo}: agregado a tu inscripción.`); } }
    if (b?.dataset.buy) { const originalOpener = returnFocus; Cart.add(getProducto(b.dataset.buy)); openCartDrawer(originalOpener); }
    if (b?.hasAttribute('data-open-cart')) openCartDrawer(b);
    if (b?.dataset.remove) { const index = [...document.querySelectorAll('[data-remove]')].indexOf(b); Cart.remove(b.dataset.remove); const next = document.querySelectorAll('[data-remove]'); (next[Math.min(index, next.length - 1)] || document.querySelector('[data-back-catalog]'))?.focus(); }
    if (b?.hasAttribute('data-close-overlay')) closeOverlay();
    if (b?.hasAttribute('data-back-catalog')) { closeOverlay(); document.getElementById('cursos').scrollIntoView({behavior: reduceMotion ? 'auto' : 'smooth'}); document.querySelector('[name="q"]')?.focus({preventScroll: true}); }
    if (activeOverlay && e.target === activeOverlay) closeOverlay();
  });
  document.addEventListener('keydown', e => {
    const root = activeOverlay || document.querySelector('.main-nav.open'); if (!root) return;
    if (e.key === 'Escape' && activeOverlay) { e.preventDefault(); closeOverlay(); }
    if (e.key === 'Tab') { const all = focusable(root); const first = all[0], last = all.at(-1); if (e.shiftKey && (document.activeElement === first || !root.contains(document.activeElement))) { e.preventDefault(); last?.focus(); } else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); } }
  });
  document.getElementById('finish-enrollment')?.addEventListener('click', () => { if (!Cart.count()) return; document.getElementById('enrollment-notice').hidden = false; showToast('El pago y la creación automática de tu cuenta se activan al llevar la plataforma a producción.'); });
  document.addEventListener('cart:updated', () => { updateCartBadge(); renderCart(); });
  window.addEventListener('storage', e => { if (e.key === Cart.KEY) document.dispatchEvent(new CustomEvent('cart:updated')); });
  const slug = new URLSearchParams(location.search).get('curso'); if (slug) openCourse(PRODUCTOS.find(p => p.slug === slug)?.id);
}
function initSchema() {
  const base = 'https://gokywebs.com/demo/institutointegralsangeronimo/';
  const graph = [{ '@type': 'EducationalOrganization', '@id': `${base}#instituto`, name: 'Instituto Integral San Geronimo', url: base, telephone: '+' + WHATSAPP_NUMBER, description: 'Formación y servicios profesionales en ciencias forenses. Institución en etapa de apertura.', image: `${base}images/02_imagen.webp` }, ...PRODUCTOS.map(p => ({'@type': 'Course', name: `${p.titulo} — programa demostrativo`, description: `${p.descripcionCorta} Contenido de ejemplo, oferta y arancel sin confirmar.`, provider: {'@id': `${base}#instituto`}, offers: {'@type': 'Offer', category: 'Demo sin inscripción activa', price: p.precio, priceCurrency: 'ARS', availability: 'https://schema.org/PreOrder'}, hasCourseInstance: {'@type': 'CourseInstance', courseMode: p.modalidad, courseWorkload: `PT${p.duracion}H`}}))];
  graph.push({'@type': 'FAQPage', mainEntity: [...document.querySelectorAll('.institution-faq details')].map(d => ({'@type': 'Question', name: d.querySelector('summary').textContent, acceptedAnswer: {'@type': 'Answer', text: d.querySelector('p').textContent}}))});
  const script = document.createElement('script'); script.type = 'application/ld+json'; script.textContent = JSON.stringify({'@context': 'https://schema.org', '@graph': graph}); document.head.appendChild(script);
}
globalThis.InstitutoDemo = {PRODUCTOS, BANNERS, normalize, sanitizeCart, filterCourses, pageItems, precioFinal, formatearPrecio, Cart};

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

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; document.querySelector('.site-header').appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 769px)');
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open'); nav.removeAttribute('role'); nav.removeAttribute('aria-modal'); toggle.focus();
    if (!desktopMq.matches) nav.setAttribute('inert', '');
    toggle.setAttribute('aria-expanded', 'false'); document.body.classList.remove('no-scroll');
  };
  const open = () => {
    nav.classList.add('open'); bd.classList.add('open'); nav.removeAttribute('inert'); nav.setAttribute('role', 'dialog'); nav.setAttribute('aria-modal', 'true');
    toggle.setAttribute('aria-expanded', 'true'); document.body.classList.add('no-scroll');
    nav.querySelector('a')?.focus();
  };
  toggle.addEventListener('click', () => (nav.classList.contains('open') ? close() : open()));
  closeBtn?.addEventListener('click', () => { close(); toggle.focus(); });
  bd.addEventListener('click', close);
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); } });
  const syncInert = () => {
    if (desktopMq.matches) { if (nav.classList.contains('open')) close(); nav.removeAttribute('inert'); }
    else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  desktopMq.addEventListener('change', syncInert);
  syncInert();
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

function initFloats() {
  const wsp = document.getElementById('wsp-float');
  const cart = document.getElementById('cart-float');
  const sync = () => {
    const scrolled = window.scrollY > 600; if (scrolled) wsp?.classList.add('visible');
    
    cart?.classList.toggle('visible', scrolled || Cart.count() > 0);
  };
  window.addEventListener('scroll', sync, { passive: true });
  document.addEventListener('cart:updated', sync);
  cart?.addEventListener('click', openCartDrawer);
  sync();
}

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
}
document.addEventListener('cart:updated', updateCartBadge);

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
if (typeof document !== 'undefined') {
  initCatalog();
  initReveals();
  initNav();
  initFloats();
  updateCartBadge();
  initModelBarScroll();
  initInteractions();
  initSchema();
}

