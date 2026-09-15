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
  const localStorage = {
    getItem: k => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: k => store.delete(k),
  };
  const noop = () => {};
  const fakeEl = { addEventListener: noop, classList: { add: noop, remove: noop, toggle: noop }, appendChild: noop, setAttribute: noop, innerHTML: '', style: {} };
  const sandbox = {
    window: { matchMedia: () => ({ matches: false, addEventListener: noop }), addEventListener: noop },
    document: {
      addEventListener: noop,
      dispatchEvent: noop,
      createElement: () => ({ ...fakeEl }),
      querySelector: () => null,
      querySelectorAll: () => [],
      body: { ...fakeEl },
    },
    localStorage,
    CustomEvent: class CustomEvent { constructor(type) { this.type = type; } },
    setTimeout: noop,
    clearTimeout: noop,
    requestAnimationFrame: noop,
    console,
    __store: store,
  };
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(pure, sandbox);
  return sandbox;
}

test('norm pliega acentos y mayúsculas', () => {
  const s = makeSandbox();
  const norm = vm.runInContext('norm', s);
  assert.equal(norm('Lágrima HÍBRIDA'), 'lagrima hibrida');
  assert.equal(norm('pádel'), 'padel');
  assert.equal(norm(null), '');
});

test('precioFinal aplica descuento solo cuando corresponde', () => {
  const s = makeSandbox();
  const precioFinal = vm.runInContext('precioFinal', s);
  assert.equal(precioFinal({ precio: 398000, descuento: 10 }), 358200);
  assert.equal(precioFinal({ precio: 462000, descuento: 15 }), 392700);
  assert.equal(precioFinal({ precio: 19800, descuento: 0 }), 19800);
});

test('formatearPrecio usa formato es-AR con miles', () => {
  const s = makeSandbox();
  const f = vm.runInContext('formatearPrecio', s);
  assert.equal(f(19800), '$' + (19800).toLocaleString('es-AR'));
  assert.match(f(486000), /^\$\d{3}[.,]\d{3}$/);
});

test('fixture: ids únicos, categorías válidas, destacados 6-8, precios > 0', () => {
  const s = makeSandbox();
  const PRODUCTOS = vm.runInContext('PRODUCTOS', s);
  const CATEGORIAS = vm.runInContext('CATEGORIAS', s);
  const ids = PRODUCTOS.map(p => p.id);
  assert.equal(new Set(ids).size, ids.length, 'ids duplicados');
  const cats = new Set(CATEGORIAS.map(c => c.id));
  for (const p of PRODUCTOS) {
    assert.ok(cats.has(p.cat), `cat inválida en ${p.id}`);
    assert.ok(p.precio > 0 && Number.isInteger(p.precio));
    assert.ok(p.img.startsWith('images/'));
  }
  const destacados = PRODUCTOS.filter(p => p.destacado);
  assert.ok(destacados.length >= 6 && destacados.length <= 8, `destacados=${destacados.length}`);
});

test('filtrar: búsqueda sin acentos + categoría combinadas', () => {
  const s = makeSandbox();
  vm.runInContext('shopState.query = "lagrima"; shopState.cat = "all";', s);
  let r = vm.runInContext('filtrarProductos()', s);
  assert.ok(r.length >= 1 && r.every(p => /l[áa]grima/i.test(p.nombre + p.tags)));
  vm.runInContext('shopState.query = ""; shopState.cat = "cubregrips";', s);
  r = vm.runInContext('filtrarProductos()', s);
  assert.equal(r.length, 3);
  vm.runInContext('shopState.query = "pack"; shopState.cat = "cubregrips";', s);
  r = vm.runInContext('filtrarProductos()', s);
  assert.ok(r.length >= 1 && r.every(p => p.cat === 'cubregrips'));
  vm.runInContext('shopState.query = "zzz-nada"; shopState.cat = "all";', s);
  r = vm.runInContext('filtrarProductos()', s);
  assert.equal(r.length, 0);
});

test('filtrar: órdenes de precio y alfabético', () => {
  const s = makeSandbox();
  vm.runInContext('shopState.query = ""; shopState.cat = "all"; shopState.orden = "precio-asc";', s);
  const asc = vm.runInContext('filtrarProductos()', s);
  const precioFinal = vm.runInContext('precioFinal', s);
  for (let i = 1; i < asc.length; i++) assert.ok(precioFinal(asc[i - 1]) <= precioFinal(asc[i]));
  vm.runInContext('shopState.orden = "precio-desc";', s);
  const desc = vm.runInContext('filtrarProductos()', s);
  for (let i = 1; i < desc.length; i++) assert.ok(precioFinal(desc[i - 1]) >= precioFinal(desc[i]));
  vm.runInContext('shopState.orden = "az";', s);
  const az = vm.runInContext('filtrarProductos()', s);
  for (let i = 1; i < az.length; i++) assert.ok(az[i - 1].nombre.localeCompare(az[i].nombre, 'es') <= 0);
});

test('paginación: PAGE=16 y catálogo completo entra en una página', () => {
  const s = makeSandbox();
  assert.equal(vm.runInContext('PAGE', s), 16);
  vm.runInContext('shopState.query = ""; shopState.cat = "all"; shopState.page = 1; shopState.orden = "destacados";', s);
  const list = vm.runInContext('filtrarProductos()', s);
  const visible = list.slice(0, 1 * 16);
  assert.equal(visible.length, list.length, 'con 14 productos no debe haber "Ver más"');
});

test('Cart: add acumula, setQty clampa a 1, remove y clear', () => {
  const s = makeSandbox();
  vm.runInContext(`
    const p1 = getProducto('pal-lagrima-hibrida');
    const p2 = getProducto('grip-x3-negro-amarillo');
    Cart.add(p1, 2); Cart.add(p1, 1); Cart.add(p2, 1);
  `, s);
  assert.equal(vm.runInContext('Cart.count()', s), 4);
  const raw = JSON.parse(s.__store.get('alcortapadel_cart'));
  assert.deepEqual(Object.keys(raw[0]).sort(), ['id', 'qty'], 'el carrito guarda solo {id, qty}');
  vm.runInContext('Cart.setQty("pal-lagrima-hibrida", 0)', s);
  assert.equal(vm.runInContext('Cart.get().find(i => i.id === "pal-lagrima-hibrida").qty', s), 1);
  const esperado = 358200 * 1 + 9900 * 1;
  assert.equal(vm.runInContext('Cart.total()', s), esperado, 'total usa precio con descuento');
  vm.runInContext('Cart.remove("grip-x3-negro-amarillo")', s);
  assert.equal(vm.runInContext('Cart.count()', s), 1);
  vm.runInContext('Cart.clear()', s);
  assert.equal(vm.runInContext('Cart.count()', s), 0);
});

test('Cart: localStorage corrupto no rompe', () => {
  const s = makeSandbox();
  s.__store.set('alcortapadel_cart', '{{{corrupto');
  assert.equal(vm.runInContext('Cart.get().length', s), 0);
  assert.equal(vm.runInContext('Cart.total()', s), 0);
});

test('Cart: producto fantasma en storage no aporta al total', () => {
  const s = makeSandbox();
  s.__store.set('alcortapadel_cart', JSON.stringify([{ id: 'no-existe', qty: 3 }, { id: 'pel-tubo-x3', qty: 2 }]));
  assert.equal(vm.runInContext('Cart.total()', s), 39600);
  assert.equal(vm.runInContext('Cart.count()', s), 5);
});
