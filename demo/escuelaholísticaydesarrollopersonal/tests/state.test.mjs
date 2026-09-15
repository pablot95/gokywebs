import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import vm from 'node:vm';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const src = readFileSync(join(root, 'script.js'), 'utf-8');
const cut = src.indexOf('function renderShop()');
assert.ok(cut > 0, 'marcador renderShop encontrado');
const pure = src.slice(0, cut);

function makeSandbox() {
  const store = new Map();
  const noop = () => {};
  const sandbox = {
    window: { matchMedia: () => ({ matches: false, addEventListener: noop }), addEventListener: noop },
    document: { addEventListener: noop, dispatchEvent: noop, querySelector: () => null, querySelectorAll: () => [], createElement: () => ({ addEventListener: noop, setAttribute: noop, appendChild: noop, classList: { add: noop }, style: {} }), body: { appendChild: noop } },
    localStorage: {
      getItem: k => (store.has(k) ? store.get(k) : null),
      setItem: (k, v) => store.set(k, String(v)),
      removeItem: k => store.delete(k),
    },
    CustomEvent: class CustomEvent { constructor(type) { this.type = type; } },
    Intl,
    setTimeout: noop, clearTimeout: noop, requestAnimationFrame: noop,
    console,
    __store: store,
  };
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(pure, sandbox);
  return sandbox;
}

test('fixture: 8 cursos, ids únicos, 3+ módulos × 3 clases, 1 preview máx, docentes válidos', () => {
  const s = makeSandbox();
  const CURSOS = vm.runInContext('CURSOS', s);
  const DOCENTES = vm.runInContext('DOCENTES', s);
  const CATEGORIAS = vm.runInContext('CATEGORIAS', s);
  assert.equal(CURSOS.length, 8);
  const ids = CURSOS.map(c => c.id);
  assert.equal(new Set(ids).size, ids.length);
  const cats = new Set(CATEGORIAS.map(c => c.id));
  const docs = new Set(DOCENTES.map(d => d.id));
  for (const c of CURSOS) {
    assert.ok(cats.has(c.cat), `cat inválida en ${c.id}`);
    assert.ok(docs.has(c.docenteId), `docente inválido en ${c.id}`);
    assert.ok(c.precio > 0);
    assert.ok(c.modulos.length >= 3, `${c.id}: menos de 3 módulos`);
    c.modulos.forEach(m => assert.ok(m.clases.length >= 3, `${c.id}/${m.titulo}: menos de 3 clases`));
    const previews = c.modulos.flatMap(m => m.clases).filter(cl => cl.preview);
    assert.ok(previews.length <= 1, `${c.id}: más de una clase preview`);
    assert.ok(c.portada.startsWith('images/'));
  }
  assert.equal(CURSOS.filter(c => c.destacado).length, 4, 'destacadas debe ser exactamente 4');
});

test('precioFinal y formateo es-AR', () => {
  const s = makeSandbox();
  const pf = vm.runInContext('precioFinal', s);
  const f = vm.runInContext('formatearPrecio', s);
  assert.equal(pf({ precio: 85000, descuento: 15 }), 72250);
  assert.equal(pf({ precio: 52000, descuento: 10 }), 46800);
  assert.equal(pf({ precio: 28000, descuento: 0 }), 28000);
  assert.equal(f(220000), '$' + (220000).toLocaleString('es-AR'));
});

test('filtrar: búsqueda sin acentos + filtros combinados', () => {
  const s = makeSandbox();
  vm.runInContext('shopState.query = "utero"; ', s);
  let r = vm.runInContext('filtrarCursos()', s);
  assert.equal(r.length, 1);
  assert.equal(r[0].id, 'sanacion-utero');
  vm.runInContext('shopState.query = ""; shopState.cat = "energetica"; shopState.nivel = "Inicial";', s);
  r = vm.runInContext('filtrarCursos()', s);
  assert.ok(r.length >= 1 && r.every(c => c.cat === 'energetica' && c.nivel === 'Inicial'));
  vm.runInContext('shopState.nivel = "all"; shopState.modalidad = "En vivo";', s);
  r = vm.runInContext('filtrarCursos()', s);
  assert.ok(r.every(c => c.modalidad === 'En vivo'));
  vm.runInContext('shopState.cat = "all"; shopState.modalidad = "all"; shopState.query = "mariana";', s);
  r = vm.runInContext('filtrarCursos()', s);
  assert.ok(r.length >= 3 && r.every(c => c.docenteId === 'mariana'), 'busca por docente');
  vm.runInContext('shopState.query = "zzzz";', s);
  assert.equal(vm.runInContext('filtrarCursos().length', s), 0);
});

test('filtrar: órdenes de precio', () => {
  const s = makeSandbox();
  vm.runInContext('shopState.query = ""; shopState.orden = "precio-asc";', s);
  const asc = vm.runInContext('filtrarCursos()', s);
  const pf = vm.runInContext('precioFinal', s);
  for (let i = 1; i < asc.length; i++) assert.ok(pf(asc[i - 1]) <= pf(asc[i]));
  assert.equal(asc[0].id, 'chakras-intro', 'el más barato es la puerta de entrada');
});

test('Cart: un curso no se duplica, sin cantidades', () => {
  const s = makeSandbox();
  const dup = vm.runInContext(`
    const c = getCurso('ceremonia-cacao');
    const primera = Cart.add(c);
    const segunda = Cart.add(c);
    JSON.stringify({ primera, segunda, count: Cart.count() })
  `, s);
  assert.deepEqual(JSON.parse(dup), { primera: true, segunda: false, count: 1 });
  const raw = JSON.parse(s.__store.get('escuelauriel_cart'));
  assert.equal(raw[0].qty, 1);
  vm.runInContext(`Cart.add(getCurso('sanacion-utero'))`, s);
  assert.equal(vm.runInContext('Cart.total()', s), 68000 + 72250, 'total usa precio con descuento');
  vm.runInContext(`Cart.remove('ceremonia-cacao')`, s);
  assert.equal(vm.runInContext('Cart.count()', s), 1);
  vm.runInContext('Cart.clear()', s);
  assert.equal(vm.runInContext('Cart.count()', s), 0);
});

test('Cart: storage corrupto y curso fantasma', () => {
  const s = makeSandbox();
  s.__store.set('escuelauriel_cart', '{{{roto');
  assert.equal(vm.runInContext('Cart.get().length', s), 0);
  s.__store.set('escuelauriel_cart', JSON.stringify([{ id: 'no-existe', qty: 1 }, { id: 'reiki-1', qty: 1 }]));
  assert.equal(vm.runInContext('Cart.total()', s), 75000);
});
