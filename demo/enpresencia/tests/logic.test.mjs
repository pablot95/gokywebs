import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const code = fs.readFileSync(path.join(root, 'data.js'), 'utf8') + '\n' + fs.readFileSync(path.join(root, 'app.js'), 'utf8');

function makeCtx() {
  const store = new Map();
  const localStorage = { getItem: k => (store.has(k) ? store.get(k) : null), setItem: (k, v) => store.set(k, String(v)), removeItem: k => store.delete(k) };
  const noop = () => {};
  const ctx = {
    localStorage, console,
    CustomEvent: class { constructor(type) { this.type = type; } },
    document: { addEventListener: noop, dispatchEvent: noop, querySelectorAll: () => [], querySelector: () => null, getElementById: () => null, createElement: () => ({ style: {}, classList: { add: noop } }), body: { dataset: {}, appendChild: noop, classList: { add: noop, remove: noop } }, head: { appendChild: noop } },
    setTimeout, clearTimeout, setInterval, clearInterval, Intl, Date, Math, JSON, performance: { now: () => 0 },
    history: { replaceState: noop }, location: { search: '', pathname: '/' }, requestAnimationFrame: noop
  };
  ctx.window = { matchMedia: () => ({ matches: false }), addEventListener: noop, innerHeight: 800, innerWidth: 1280, scrollY: 0, confirm: () => true, history: ctx.history };
  vm.createContext(ctx);
  vm.runInContext(code, ctx);
  return vm.runInContext('({ CURSOS, DOCENTES, Cart, Learn, Session, precioFinal, getCurso, allLessons, norm, formatearPrecio })', ctx);
}

test('precioFinal aplica descuento y redondea', () => {
  const c = makeCtx();
  const conDesc = c.CURSOS.find(x => x.descuento > 0);
  const sinDesc = c.CURSOS.find(x => x.descuento === 0);
  assert.equal(c.precioFinal(sinDesc), sinDesc.precio);
  assert.equal(c.precioFinal(conDesc), Math.round(conDesc.precio * (1 - conDesc.descuento / 100)));
});

test('dataset: 4 cursos, 3x3, 1 preview, ids/slugs unicos, docente valido', () => {
  const c = makeCtx();
  assert.equal(c.CURSOS.length, 4);
  const ids = new Set(), slugs = new Set();
  for (const curso of c.CURSOS) {
    assert.equal(curso.modulos.length, 3, curso.slug);
    let previews = 0, clases = 0;
    for (const m of curso.modulos) {
      assert.equal(m.clases.length, 3);
      for (const l of m.clases) { clases++; assert.ok(!ids.has(l.id), 'id repetido: ' + l.id); ids.add(l.id); if (l.preview) previews++; }
    }
    assert.equal(previews, 1, 'previews != 1 en ' + curso.slug);
    assert.equal(curso.cantidadClases, clases);
    assert.ok(!slugs.has(curso.slug)); slugs.add(curso.slug);
    assert.ok(c.DOCENTES.some(d => d.id === curso.docenteId));
    assert.ok(curso.precio > 0 && curso.resultados.length && curso.requisitos.length && curso.incluye.length);
  }
});

test('Cart: sin duplicados, total, id inexistente', () => {
  const c = makeCtx();
  c.Cart.add('c1'); c.Cart.add('c1'); c.Cart.add('c3'); c.Cart.add('zzz');
  assert.equal(c.Cart.count(), 3);
  assert.equal(c.Cart.total(), c.precioFinal(c.getCurso('c1')) + c.precioFinal(c.getCurso('c3')));
  c.Cart.clear(); assert.equal(c.Cart.count(), 0);
});

test('Learn: progreso, 100% con clase fantasma, nextLesson', () => {
  const c = makeCtx();
  const curso = c.getCurso('c1');
  c.Learn.enroll(['c1']);
  c.Learn.toggleLesson('c1m1l1'); c.Learn.toggleLesson('c1m1l2');
  const p = c.Learn.progress(curso);
  assert.equal(p.done, 2); assert.equal(p.total, 9); assert.equal(p.pct, 22);
  const curso2 = c.getCurso('c3'); c.Learn.enroll(['c3']);
  c.allLessons(curso2).forEach(l => c.Learn.toggleLesson(l.id));
  c.Learn.toggleLesson('fantasma-x');
  assert.equal(c.Learn.progress(curso2).pct, 100);
  assert.equal(c.Learn.nextLesson(c.getCurso('c4')), 'c4m1l1');
});

test('Session: seed c2 completo, c1 en progreso, c3 pendiente', () => {
  const c = makeCtx();
  c.Session.start();
  const st = c.Learn.get();
  assert.deepEqual(st.enrolledCourseIds, ['c2', 'c1', 'c3']);
  assert.equal(c.Learn.progress(c.getCurso('c2')).pct, 100);
  const p1 = c.Learn.progress(c.getCurso('c1'));
  assert.ok(p1.pct > 0 && p1.pct < 100);
  assert.equal(c.Learn.progress(c.getCurso('c3')).pct, 0);
});

test('norm y formatearPrecio', () => {
  const c = makeCtx();
  assert.equal(c.norm('Presencia atención'), 'presencia atencion');
  assert.equal(c.formatearPrecio(34900), '$' + (34900).toLocaleString('es-AR'));
});

test('categorias esperadas y clases de audio presentes', () => {
  const c = makeCtx();
  const cats = new Set(c.CURSOS.map(x => x.categoria));
  assert.ok(cats.has('Presencia') && cats.has('Mente'));
  const hayAudio = c.CURSOS.some(x => c.allLessons(x).some(l => l.tipo === 'audio'));
  assert.ok(hayAudio, 'deberia haber clases de audio (prácticas guiadas)');
});
