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
  const localStorage = {
    getItem: k => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: k => store.delete(k)
  };
  const noop = () => {};
  const ctx = {
    localStorage,
    console,
    CustomEvent: class { constructor(type) { this.type = type; } },
    document: { addEventListener: noop, dispatchEvent: noop, querySelectorAll: () => [], querySelector: () => null, getElementById: () => null, createElement: () => ({ style: {}, classList: { add: noop } }), body: { dataset: {}, appendChild: noop, classList: { add: noop, remove: noop } }, head: { appendChild: noop } },
    setTimeout, clearTimeout, setInterval, clearInterval,
    Intl, Date, Math, JSON, performance: { now: () => 0 },
    history: { replaceState: noop },
    location: { search: '', pathname: '/' },
    requestAnimationFrame: noop
  };
  ctx.window = { matchMedia: () => ({ matches: false }), addEventListener: noop, innerHeight: 800, innerWidth: 1280, scrollY: 0, confirm: () => true, history: ctx.history };
  vm.createContext(ctx);
  vm.runInContext(code, ctx);
  return vm.runInContext('({ CURSOS, DOCENTES, Cart, Learn, Session, precioFinal, getCurso, allLessons, norm, formatearPrecio, DISC_META, FORMADOR_DEMO, COMISION })', ctx);
}

test('precioFinal aplica descuento y redondea', () => {
  const c = makeCtx();
  const conDesc = c.CURSOS.find(x => x.descuento > 0);
  const sinDesc = c.CURSOS.find(x => x.descuento === 0);
  assert.equal(c.precioFinal(sinDesc), sinDesc.precio);
  assert.equal(c.precioFinal(conDesc), Math.round(conDesc.precio * (1 - conDesc.descuento / 100)));
});

test('dataset: 16 cursos, 3 modulos x 3 clases, 1 preview, ids unicos, docente y disciplina validos', () => {
  const c = makeCtx();
  assert.equal(c.CURSOS.length, 16);
  const ids = new Set();
  const slugs = new Set();
  for (const curso of c.CURSOS) {
    assert.equal(curso.modulos.length, 3, curso.slug);
    let previews = 0, clases = 0;
    for (const m of curso.modulos) {
      assert.equal(m.clases.length, 3);
      for (const l of m.clases) {
        clases++;
        assert.ok(!ids.has(l.id), 'id de clase repetido: ' + l.id);
        ids.add(l.id);
        if (l.preview) previews++;
      }
    }
    assert.equal(previews, 1, 'previews != 1 en ' + curso.slug);
    assert.equal(curso.cantidadClases, clases, 'cantidadClases mal en ' + curso.slug);
    assert.ok(!slugs.has(curso.slug), 'slug repetido: ' + curso.slug);
    slugs.add(curso.slug);
    assert.ok(c.DOCENTES.some(d => d.id === curso.docenteId), 'docente inexistente en ' + curso.slug);
    assert.ok(c.DISC_META[curso.categoria], 'disciplina sin meta: ' + curso.categoria);
    assert.ok(curso.precio > 0);
    assert.ok(curso.resultados.length && curso.requisitos.length && curso.incluye.length);
  }
});

test('cada disciplina de DISC_META tiene color e icono', () => {
  const c = makeCtx();
  for (const [nombre, meta] of Object.entries(c.DISC_META)) {
    assert.match(meta.color, /^#[0-9a-f]{6}$/i, 'color invalido en ' + nombre);
    assert.ok(meta.icon && meta.icon.length > 0, 'icono vacio en ' + nombre);
  }
});

test('Cart: sin duplicados, total y ahorro correctos', () => {
  const c = makeCtx();
  c.Cart.add('c1'); c.Cart.add('c1'); c.Cart.add('c2');
  assert.equal(c.Cart.count(), 2);
  const esperado = c.precioFinal(c.getCurso('c1')) + c.precioFinal(c.getCurso('c2'));
  assert.equal(c.Cart.total(), esperado);
  c.Cart.remove('c1');
  assert.equal(c.Cart.count(), 1);
  c.Cart.clear();
  assert.equal(c.Cart.count(), 0);
});

test('Cart: id inexistente no rompe el total', () => {
  const c = makeCtx();
  c.Cart.add('c1'); c.Cart.add('zzz');
  assert.equal(c.Cart.total(), c.precioFinal(c.getCurso('c1')));
});

test('Learn: progreso calculado desde clases completadas', () => {
  const c = makeCtx();
  const curso = c.getCurso('c1');
  assert.equal(c.Learn.progress(curso).pct, 0);
  c.Learn.enroll(['c1']);
  c.Learn.toggleLesson('c1m1l1');
  c.Learn.toggleLesson('c1m1l2');
  const p = c.Learn.progress(curso);
  assert.equal(p.done, 2);
  assert.equal(p.total, 9);
  assert.equal(p.pct, 22);
  c.Learn.toggleLesson('c1m1l1');
  assert.equal(c.Learn.progress(curso).done, 1);
});

test('Learn: curso completo llega a 100 y clase fantasma no rompe', () => {
  const c = makeCtx();
  const curso = c.getCurso('c3');
  c.Learn.enroll(['c3']);
  c.allLessons(curso).forEach(l => c.Learn.toggleLesson(l.id));
  c.Learn.toggleLesson('clase-eliminada-x');
  assert.equal(c.Learn.progress(curso).pct, 100);
});

test('Learn: nextLesson devuelve la primera pendiente y respeta lastLesson', () => {
  const c = makeCtx();
  const curso = c.getCurso('c2');
  c.Learn.enroll(['c2']);
  assert.equal(c.Learn.nextLesson(curso), 'c2m1l1');
  c.Learn.toggleLesson('c2m1l1');
  assert.equal(c.Learn.nextLesson(curso), 'c2m1l2');
  c.Learn.setLast('c2', 'c2m3l1');
  assert.equal(c.Learn.nextLesson(curso), 'c2m3l1');
});

test('Learn: enroll no duplica inscripciones', () => {
  const c = makeCtx();
  c.Learn.enroll(['c1']);
  c.Learn.enroll(['c1', 'c4']);
  const st = c.Learn.get();
  assert.deepEqual(st.enrolledCourseIds, ['c1', 'c4']);
  assert.equal(st.enrollments.length, 2);
});

test('Session: seed solo con estado vacio (c8 completo, c6 en progreso)', () => {
  const c = makeCtx();
  c.Session.start();
  const st = c.Learn.get();
  assert.deepEqual(st.enrolledCourseIds, ['c8', 'c6', 'c1']);
  assert.equal(c.Learn.progress(c.getCurso('c8')).pct, 100);
  assert.ok(c.Learn.progress(c.getCurso('c6')).pct > 0 && c.Learn.progress(c.getCurso('c6')).pct < 100);
  assert.equal(c.Learn.progress(c.getCurso('c1')).pct, 0);
  const c2 = makeCtx();
  c2.Learn.enroll(['c5']);
  c2.Session.start();
  assert.deepEqual(c2.Learn.get().enrolledCourseIds, ['c5']);
});

test('norm ignora mayusculas y acentos para la busqueda', () => {
  const c = makeCtx();
  assert.equal(c.norm('Programación Diseño'), 'programacion diseno');
  assert.equal(c.norm('INGLÉS'), 'ingles');
});

test('formatearPrecio usa es-AR sin decimales', () => {
  const c = makeCtx();
  assert.equal(c.formatearPrecio(46900), '$' + (46900).toLocaleString('es-AR'));
});

test('notas: se guardan y se borran por clase', () => {
  const c = makeCtx();
  c.Learn.saveNote('c1m1l1', 'mi nota');
  assert.equal(c.Learn.getNote('c1m1l1'), 'mi nota');
  c.Learn.saveNote('c1m1l1', '');
  assert.equal(c.Learn.getNote('c1m1l1'), '');
});

test('FORMADOR_DEMO: formadores validos, cursos propios y liquidacion coherente', () => {
  const c = makeCtx();
  for (const [docId, demo] of Object.entries(c.FORMADOR_DEMO)) {
    const doc = c.DOCENTES.find(d => d.id === docId);
    assert.ok(doc, 'FORMADOR_DEMO con docente inexistente: ' + docId);
    const propios = c.CURSOS.filter(x => x.docenteId === docId).map(x => x.id);
    for (const cid of Object.keys(demo.ventasCurso || {})) {
      assert.ok(propios.includes(cid), `curso ${cid} no pertenece a ${docId}`);
    }
    assert.equal(demo.chart.length, 6, 'chart debe tener 6 meses');
    const neto = Math.round(demo.ventasMes * (1 - c.COMISION));
    assert.ok(neto < demo.ventasMes && neto > 0, 'liquidacion neta incoherente');
  }
});

test('En vivo: los cursos por cohorte estan marcados como tal', () => {
  const c = makeCtx();
  const envivo = c.CURSOS.filter(x => x.modalidad === 'En vivo');
  assert.ok(envivo.length >= 1, 'deberia haber al menos un curso en vivo');
});
