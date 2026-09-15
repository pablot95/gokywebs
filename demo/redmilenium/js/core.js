/* RED MILENIUM — núcleo compartido: helpers, carrito, progreso y sesión demo. */
/* global CURSOS, DOCENTES, AREAS */
/* eslint-disable no-unused-vars -- consumidos por app.js vía scope global */
const WSP = '5493813013003';
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const norm = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const formatPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = c => (c.precio == null ? null : (c.descuento > 0 ? Math.round(c.precio * (1 - c.descuento / 100)) : c.precio));
const getCurso = id => CURSOS.find(c => c.id === Number(id));
const getDocente = id => DOCENTES.find(d => d.id === id);
const getArea = id => AREAS.find(a => a.id === id);
const areaLabel = id => getArea(id)?.label || '';
const totalClases = c => c.modulos.reduce((s, m) => s + m.clases.length, 0);
const cursosDeArea = id => CURSOS.filter(c => c.area === id);
const waLink = msg => 'https://wa.me/' + WSP + '?text=' + encodeURIComponent(msg);

const Cart = {
  KEY: 'redmilenium_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(ids) { localStorage.setItem(this.KEY, JSON.stringify(ids)); document.dispatchEvent(new CustomEvent('cart:updated')); },
  has(id) { return this.get().includes(Number(id)); },
  add(id) { id = Number(id); const ids = this.get(); if (!ids.includes(id)) { ids.push(id); this.save(ids); } },
  remove(id) { this.save(this.get().filter(x => x !== Number(id))); },
  clear() { this.save([]); },
  count() { return this.get().length; },
  items() { return this.get().map(getCurso).filter(Boolean); },
  total() { return this.items().reduce((s, c) => s + (precioFinal(c) || 0), 0); },
  ahorro() { return this.items().reduce((s, c) => s + (c.precio == null ? 0 : c.precio - precioFinal(c)), 0); }
};

const Progress = {
  KEY: 'redmilenium_learning_state',
  base() { return { enrolledCourseIds: [], completedLessonIds: [], lastLessonByCourse: {}, notesByLesson: {} }; },
  get() { try { return Object.assign(this.base(), JSON.parse(localStorage.getItem(this.KEY)) || {}); } catch { return this.base(); } },
  save(st) { localStorage.setItem(this.KEY, JSON.stringify(st)); document.dispatchEvent(new CustomEvent('progress:updated')); },
  enroll(id) { const st = this.get(); id = Number(id); if (!st.enrolledCourseIds.includes(id)) { st.enrolledCourseIds.push(id); this.save(st); } },
  isEnrolled(id) { return this.get().enrolledCourseIds.includes(Number(id)); },
  lessonKey(cursoId, claseId) { return cursoId + ':' + claseId; },
  isDone(cursoId, claseId) { return this.get().completedLessonIds.includes(this.lessonKey(cursoId, claseId)); },
  toggleLesson(cursoId, claseId) {
    const st = this.get(), k = this.lessonKey(cursoId, claseId), i = st.completedLessonIds.indexOf(k);
    if (i >= 0) st.completedLessonIds.splice(i, 1); else st.completedLessonIds.push(k);
    this.save(st);
  },
  setLast(cursoId, claseId) { const st = this.get(); st.lastLessonByCourse[cursoId] = claseId; this.save(st); },
  getLast(cursoId) { return this.get().lastLessonByCourse[cursoId] || null; },
  courseProgress(curso) {
    const total = totalClases(curso); if (!total) return 0;
    const st = this.get();
    const done = curso.modulos.reduce((s, m) => s + m.clases.filter(cl => st.completedLessonIds.includes(this.lessonKey(curso.id, cl.id))).length, 0);
    return Math.round(done / total * 100);
  },
  saveNote(cursoId, claseId, text) { const st = this.get(); st.notesByLesson[this.lessonKey(cursoId, claseId)] = text; this.save(st); },
  getNote(cursoId, claseId) { return this.get().notesByLesson[this.lessonKey(cursoId, claseId)] || ''; },
  reset() { localStorage.removeItem(this.KEY); document.dispatchEvent(new CustomEvent('progress:updated')); }
};

const Session = {
  KEY: 'redmilenium_demo_session',
  isIn() { return localStorage.getItem(this.KEY) === '1'; },
  enter() { localStorage.setItem(this.KEY, '1'); },
  exit() { localStorage.removeItem(this.KEY); }
};

function filtrarCursos({ q = '', area = '', nivel = '', modalidad = '', rango = '' } = {}) {
  const nq = norm(q);
  return CURSOS.filter(c => {
    if (area && c.area !== area) return false;
    if (nivel && c.nivel !== nivel) return false;
    if (modalidad && c.modalidad !== modalidad) return false;
    if (rango && c.rango !== rango) return false;
    if (nq) {
      const hay = norm([c.titulo, areaLabel(c.area), c.nivel, c.modalidad, getDocente(c.docenteId)?.nombre, c.descripcionCorta, c.descripcionCompleta].join(' '));
      if (!nq.split(' ').filter(Boolean).every(w => hay.includes(w))) return false;
    }
    return true;
  });
}

function showToast(msg) {
  let wrap = document.querySelector('.toast-wrap');
  if (!wrap) { wrap = document.createElement('div'); wrap.className = 'toast-wrap'; wrap.setAttribute('aria-live', 'polite'); document.body.appendChild(wrap); }
  const t = document.createElement('div');
  t.className = 'toast'; t.setAttribute('role', 'status');
  t.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg><span>' + esc(msg) + '</span>';
  wrap.appendChild(t);
  setTimeout(() => { t.classList.add('hiding'); setTimeout(() => t.remove(), 220); }, 3400);
}
