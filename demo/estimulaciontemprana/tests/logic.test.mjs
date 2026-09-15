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
    localStorage, console,
    CustomEvent: class { constructor(type) { this.type = type; } },
    document: {
      addEventListener: noop, dispatchEvent: noop,
      querySelectorAll: () => [], querySelector: () => null, getElementById: () => null,
      createElement: () => ({ style: { setProperty: noop }, classList: { add: noop, remove: noop, toggle: noop } }),
      body: { dataset: {}, appendChild: noop, classList: { add: noop, remove: noop } },
      head: { appendChild: noop }
    },
    setTimeout, clearTimeout, setInterval, clearInterval, Intl, Date, Math, JSON,
    performance: { now: () => 0 },
    history: { replaceState: noop }, location: { search: '', pathname: '/' },
    requestAnimationFrame: noop
  };
  ctx.window = {
    matchMedia: () => ({ matches: false }), addEventListener: noop,
    innerHeight: 800, innerWidth: 1280, scrollY: 0, outerWidth: 1280, outerHeight: 800,
    confirm: () => true, history: ctx.history, setInterval
  };
  vm.createContext(ctx);
  vm.runInContext(code, ctx);
  return vm.runInContext('({ CURSOS, DOCENTES, ASESORIAS, WHATSAPP, Cart, precioFinal, getCurso, getCursoSlug, allLessons, norm, formatearPrecio, mensajeInscripcion })', ctx);
}

test('precioFinal aplica descuento y redondea', () => {
  const c = makeCtx();
  const conDesc = c.CURSOS.find(x => x.descuento > 0);
  const sinDesc = c.CURSOS.find(x => x.descuento === 0);
  assert.equal(c.precioFinal(sinDesc), sinDesc.precio);
  assert.equal(c.precioFinal(conDesc), Math.round(conDesc.precio * (1 - conDesc.descuento / 100)));
});

test('dataset: 5 cursos coherentes, ids y slugs unicos, una clase abierta por curso', () => {
  const c = makeCtx();
  assert.equal(c.CURSOS.length, 5);
  const ids = new Set(), slugs = new Set();
  let modulos = 0, clases = 0;
  for (const curso of c.CURSOS) {
    let previews = 0, clasesCurso = 0;
    assert.ok(curso.modulos.length >= 3, curso.slug);
    modulos += curso.modulos.length;
    for (const m of curso.modulos) {
      assert.equal(m.clases.length, 3, m.id);
      for (const l of m.clases) {
        clasesCurso++;
        assert.ok(!ids.has(l.id), 'id repetido: ' + l.id);
        ids.add(l.id);
        if (l.preview) previews++;
      }
    }
    clases += clasesCurso;
    assert.equal(previews, 1, 'previews != 1 en ' + curso.slug);
    assert.equal(curso.cantidadClases, clasesCurso, 'cantidadClases mal en ' + curso.slug);
    assert.ok(!slugs.has(curso.slug));
    slugs.add(curso.slug);
    assert.ok(c.DOCENTES.some(d => d.id === curso.docenteId));
    assert.ok(curso.precio > 0 && curso.resultados.length && curso.requisitos.length && curso.incluye.length);
    assert.ok(curso.portada.startsWith('images/'));
  }
  assert.equal(modulos, 19);
  assert.equal(clases, 57);
});

test('carrito: no duplica cursos, ignora ids inexistentes y suma el total', () => {
  const c = makeCtx();
  c.Cart.add('c1'); c.Cart.add('c1'); c.Cart.add('c3'); c.Cart.add('zzz');
  assert.equal(c.Cart.count(), 3);
  assert.equal(c.Cart.total(), c.precioFinal(c.getCurso('c1')) + c.precioFinal(c.getCurso('c3')));
  assert.equal(c.Cart.ahorro(), c.getCurso('c1').precio - c.precioFinal(c.getCurso('c1')));
  c.Cart.remove('zzz');
  c.Cart.clear();
  assert.equal(c.Cart.count(), 0);
  assert.equal(c.Cart.total(), 0);
});

test('mensaje de WhatsApp: lista los cursos elegidos y el total', () => {
  const c = makeCtx();
  c.Cart.add('c1'); c.Cart.add('c5');
  const msg = c.mensajeInscripcion(['c1', 'c5']);
  assert.ok(msg.includes(c.getCurso('c1').titulo));
  assert.ok(msg.includes(c.getCurso('c5').titulo));
  assert.ok(msg.includes(c.formatearPrecio(c.Cart.total())));
  assert.equal(c.WHATSAPP, '5493364363394');
});

test('busqueda: normaliza acentos y encuentra por etiqueta y por slug', () => {
  const c = makeCtx();
  assert.equal(c.norm('Música y calmá'), 'musica y calma');
  const q = c.norm('berrinches');
  const hits = c.CURSOS.filter(x => c.norm([x.titulo, x.categoria, x.descripcionCorta, ...(x.etiquetas || [])].join(' ')).includes(q));
  assert.equal(hits.length, 1);
  assert.equal(hits[0].slug, 'berrinches-sin-gritos');
  assert.ok(c.getCursoSlug('dormir-mejor'));
  assert.equal(c.getCursoSlug('no-existe'), undefined);
});

test('catalogo: categorias, modalidades y precios formateados es-AR', () => {
  const c = makeCtx();
  const cats = new Set(c.CURSOS.map(x => x.categoria));
  assert.deepEqual([...cats].sort(), ['Arte y emoción', 'Juego y estimulación', 'Música y calma', 'Sueño y rutinas']);
  assert.ok(c.CURSOS.some(x => x.modalidad === 'En vivo'));
  assert.ok(c.CURSOS.some(x => c.allLessons(x).some(l => l.tipo === 'audio')));
  assert.equal(c.formatearPrecio(32900), '$' + (32900).toLocaleString('es-AR'));
  assert.equal(c.ASESORIAS.length, 2);
});

test('vista rapida: cada curso tiene todo lo que muestra el modal', () => {
  const c = makeCtx();
  for (const curso of c.CURSOS) {
    assert.ok(curso.descripcionCompleta.length > 80, curso.slug);
    assert.ok(curso.modulos.every(m => m.titulo && m.clases.every(l => l.titulo && l.duracion && l.tipo)), curso.slug);
    assert.equal(c.allLessons(curso).filter(l => l.preview).length, 1, curso.slug);
    const d = c.DOCENTES.find(x => x.id === curso.docenteId);
    assert.ok(d.inicial && d.bio && d.rol);
    assert.equal(d.foto, null, 'sin retrato inventado');
  }
});
