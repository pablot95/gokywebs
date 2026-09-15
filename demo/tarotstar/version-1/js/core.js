/* Núcleo compartido — helpers, carrito de cursos, progreso, sesión demo. Idéntico en ambas versiones. */
const esc = s => String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
const formatPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = c => c.descuento > 0 ? Math.round(c.precio * (1 - c.descuento/100)) : c.precio;
const getCurso = id => CURSOS.find(c => c.id === Number(id));
const totalClases = c => c.modulos.reduce((s,m) => s + m.clases.length, 0);
const WSP = '5491153126057';

const Cart = {
  KEY: 'tarotstar_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(ids) { localStorage.setItem(this.KEY, JSON.stringify(ids)); document.dispatchEvent(new CustomEvent('cart:updated')); },
  has(id) { return this.get().includes(Number(id)); },
  add(id) { id = Number(id); const ids = this.get(); if (!ids.includes(id)) { ids.push(id); this.save(ids); } },
  remove(id) { this.save(this.get().filter(x => x !== Number(id))); },
  clear() { this.save([]); },
  count() { return this.get().length; },
  items() { return this.get().map(getCurso).filter(Boolean); },
  total() { return this.items().reduce((s,c) => s + precioFinal(c), 0); },
  ahorro() { return this.items().reduce((s,c) => s + (c.precio - precioFinal(c)), 0); }
};

const Progress = {
  KEY: 'tarotstar_learning_state',
  get() { try { return Object.assign({ enrolledCourseIds: [], completedLessonIds: [], lastLessonByCourse: {}, notesByLesson: {} }, JSON.parse(localStorage.getItem(this.KEY)) || {}); } catch { return { enrolledCourseIds: [], completedLessonIds: [], lastLessonByCourse: {}, notesByLesson: {} }; } },
  save(st) { localStorage.setItem(this.KEY, JSON.stringify(st)); document.dispatchEvent(new CustomEvent('progress:updated')); },
  enroll(id) { const st = this.get(); id = Number(id); if (!st.enrolledCourseIds.includes(id)) { st.enrolledCourseIds.push(id); this.save(st); } },
  isEnrolled(id) { return this.get().enrolledCourseIds.includes(Number(id)); },
  key(c, cl) { return c + ':' + cl; },
  isDone(c, cl) { return this.get().completedLessonIds.includes(this.key(c, cl)); },
  toggleLesson(c, cl) { const st = this.get(); const k = this.key(c, cl); const i = st.completedLessonIds.indexOf(k); if (i>=0) st.completedLessonIds.splice(i,1); else st.completedLessonIds.push(k); this.save(st); },
  setLast(c, cl) { const st = this.get(); st.lastLessonByCourse[c] = cl; this.save(st); },
  getLast(c) { return this.get().lastLessonByCourse[c] || null; },
  courseProgress(curso) { const total = totalClases(curso); if (!total) return 0; const st = this.get(); const done = curso.modulos.reduce((s,m) => s + m.clases.filter(cl => st.completedLessonIds.includes(this.key(curso.id, cl.id))).length, 0); return Math.round(done/total*100); },
  saveNote(c, cl, t) { const st = this.get(); st.notesByLesson[this.key(c, cl)] = t; this.save(st); },
  getNote(c, cl) { return this.get().notesByLesson[this.key(c, cl)] || ''; },
  reset() { localStorage.removeItem(this.KEY); document.dispatchEvent(new CustomEvent('progress:updated')); }
};

const Session = {
  KEY: 'tarotstar_demo_session',
  isIn() { return localStorage.getItem(this.KEY) === '1'; },
  enter() { localStorage.setItem(this.KEY, '1'); },
  exit() { localStorage.removeItem(this.KEY); }
};

function showToast(msg) {
  let wrap = document.querySelector('.toast-wrap');
  if (!wrap) { wrap = document.createElement('div'); wrap.className = 'toast-wrap'; wrap.setAttribute('aria-live','polite'); document.body.appendChild(wrap); }
  const t = document.createElement('div');
  t.className = 'toast'; t.setAttribute('role','status');
  t.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg><span>' + esc(msg) + '</span>';
  wrap.appendChild(t);
  setTimeout(() => { t.classList.add('hiding'); setTimeout(() => t.remove(), 220); }, 3400);
}
