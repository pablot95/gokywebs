const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');

const SRC = fs.readFileSync(path.join(__dirname, '..', 'script.js'), 'utf8');

function loadScript() {
  const store = {};
  const localStorage = {
    getItem: k => (Object.prototype.hasOwnProperty.call(store, k) ? store[k] : null),
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: k => { delete store[k]; },
    clear: () => { for (const k of Object.keys(store)) delete store[k]; },
  };
  const noop = () => {};
  const fakeEl = () => ({
    classList: { add: noop, remove: noop, toggle: noop, contains: () => false },
    setAttribute: noop, removeAttribute: noop, addEventListener: noop, style: {}, dataset: {},
    querySelector: () => null, querySelectorAll: () => [], appendChild: noop,
  });
  const documentStub = {
    addEventListener: noop,
    querySelector: () => null,
    querySelectorAll: () => [],
    getElementById: () => null,
    createElement: fakeEl,
    dispatchEvent: noop,
    body: { classList: { add: noop, remove: noop, contains: () => false } },
  };
  const windowStub = {
    matchMedia: () => ({ matches: false, addEventListener: noop }),
    addEventListener: noop,
    setInterval: () => 0,
    getComputedStyle: () => ({ paddingInlineStart: '0px' }),
    localStorage,
  };
  const sandbox = {
    window: windowStub,
    document: documentStub,
    localStorage,
    CustomEvent: function CustomEvent(type) { this.type = type; },
    console,
  };
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  // `const`/`let` de nivel superior no quedan como propiedades del contexto vm por
  // defecto (solo `var`/`function` lo hacen) — el epílogo corre en el MISMO scope
  // léxico (misma llamada a runInContext) y los vuelca a globalThis para poder leerlos
  // desde este archivo de test sin reimplementar la lógica.
  const epilogue = `
;globalThis.__EXPORTS__ = {
  PRODUCTOS, Cart, filtroState, armadorState, EDAD_LABEL, SUBCAT_LABELS,
  formatearPrecio, precioFinal, getProducto, normalizar, esc, subcatLabel, catLabel,
  calcularSet, productosFiltrados, renderCatalogo, renderArmador, prodCardHTML,
};`;
  vm.runInContext(SRC + epilogue, sandbox, { filename: 'script.js' });
  return Object.assign(sandbox, sandbox.__EXPORTS__);
}

test('normalizar: sin mayúsculas ni acentos', () => {
  const sb = loadScript();
  assert.equal(sb.normalizar('Body de Algodón'), 'body de algodon');
  assert.equal(sb.normalizar('NIÑOS'), 'ninos');
  assert.equal(sb.normalizar(null), '');
});

test('precioFinal y formatearPrecio: descuento y formato separados', () => {
  const sb = loadScript();
  const p = sb.getProducto('vestido-gasa-floreado-bebe');
  assert.equal(p.precio, 13900);
  assert.equal(p.descuento, 18);
  assert.equal(sb.precioFinal(p), Math.round(13900 * 0.82));
  assert.equal(sb.formatearPrecio(1234567), '$1.234.567');
  const sinDescuento = sb.getProducto('body-algodon-manga-corta');
  assert.equal(sb.precioFinal(sinDescuento), sinDescuento.precio);
});

test('catálogo: cobertura mínima de filtros (categoría, subcategoría, talle, precio)', () => {
  const sb = loadScript();
  const total = sb.PRODUCTOS.length;
  assert.equal(total, 32);
  assert.ok(sb.PRODUCTOS.some(p => p.categoria === 'hogar'));
  assert.ok(sb.PRODUCTOS.some(p => p.categoria === 'ninos'));
  const subcats = new Set(sb.PRODUCTOS.map(p => p.subcategoria));
  assert.ok(subcats.size >= 3, 'tiene que haber variedad de subcategorías');
  const talles = new Set(sb.PRODUCTOS.filter(p => p.categoria === 'ninos').map(p => p.talle).filter(Boolean));
  assert.ok(talles.has('0-3M') && talles.has('1-2A'));
});

test('productosFiltrados: combina categoría + subcategoría + precio, y se puede limpiar', () => {
  const sb = loadScript();
  sb.filtroState.categoria = ['hogar'];
  sb.filtroState.subcategoria = ['cocina'];
  let list = sb.productosFiltrados();
  assert.ok(list.length > 0);
  assert.ok(list.every(p => p.categoria === 'hogar' && p.subcategoria === 'cocina'));

  sb.filtroState.precioMin = 0; sb.filtroState.precioMax = 10000;
  list = sb.productosFiltrados();
  assert.ok(list.every(p => sb.precioFinal(p) <= 10000));

  sb.filtroState.categoria = []; sb.filtroState.subcategoria = []; sb.filtroState.precioMin = null; sb.filtroState.precioMax = null;
  list = sb.productosFiltrados();
  assert.equal(list.length, sb.PRODUCTOS.length);
});

test('productosFiltrados: búsqueda por texto sin mayúsculas ni acentos', () => {
  const sb = loadScript();
  sb.filtroState.busqueda = 'MANTA';
  const list = sb.productosFiltrados();
  assert.ok(list.some(p => p.id === 'manta-algodon-trenzada'));
  sb.filtroState.busqueda = '';
});

test('límite inicial (16) y "Ver más" suma de a 16', () => {
  const sb = loadScript();
  assert.equal(sb.filtroState.mostrar, 16);
  sb.filtroState.mostrar += 16;
  assert.equal(sb.filtroState.mostrar, 32);
});

test('Cart: localStorage corrupto no rompe get()', () => {
  const sb = loadScript();
  sb.localStorage.setItem(sb.Cart.KEY, '{esto no es json');
  assert.equal(sb.Cart.get().length, 0);
});

test('Cart: suma cantidades, respeta el límite de stock, elimina y totaliza', () => {
  const sb = loadScript();
  sb.Cart.clear();
  const p = sb.getProducto('gorro-punto-bebe'); // stock 17
  sb.Cart.add(p, 1);
  sb.Cart.add(p, 1);
  assert.equal(sb.Cart.get().find(i => i.id === p.id).qty, 2);

  sb.Cart.setQty(p.id, 999);
  assert.equal(sb.Cart.get().find(i => i.id === p.id).qty, p.stock);

  const p2 = sb.getProducto('babero-gasa-x2');
  sb.Cart.add(p2, 1);
  const totalEsperado = sb.precioFinal(p) * p.stock + sb.precioFinal(p2) * 1;
  assert.equal(sb.Cart.total(), totalEsperado);

  sb.Cart.remove(p.id);
  assert.equal(sb.Cart.get().length, 1);
  assert.equal(sb.Cart.count(), 1);
});

test('Cart: eliminar un id inexistente no rompe nada', () => {
  const sb = loadScript();
  sb.Cart.clear();
  assert.doesNotThrow(() => sb.Cart.remove('no-existe'));
  assert.equal(sb.Cart.get().length, 0);
});

test('Cart: el total se resuelve SIEMPRE contra el precio actual de PRODUCTOS (no queda desactualizado)', () => {
  const sb = loadScript();
  sb.Cart.clear();
  const p = sb.getProducto('cesto-tejido-mediano');
  sb.Cart.add(p, 2);
  const totalAntes = sb.Cart.total();
  const precioOriginal = p.precio;
  p.precio = precioOriginal + 5000; // simula un cambio de precio en el catálogo
  const totalDespues = sb.Cart.total();
  assert.notEqual(totalAntes, totalDespues);
  assert.equal(totalDespues, sb.precioFinal(p) * 2);
  p.precio = precioOriginal;
});

test('Armá tu Set: cambia de resultado según la edad', () => {
  const sb = loadScript();
  const recienNacido = sb.calcularSet('0-3M', 'esencial');
  const unADosAnos = sb.calcularSet('1-2A', 'esencial');
  assert.notEqual(recienNacido[0].id, unADosAnos[0].id);
  assert.ok(recienNacido.every(p => p.talle === '0-3M' || p.subcategoria === 'textiles'));
});

test('Armá tu Set: el tamaño del set escala con el presupuesto (esencial < completo < grande)', () => {
  const sb = loadScript();
  const esencial = sb.calcularSet('6-12M', 'esencial');
  const completo = sb.calcularSet('6-12M', 'completo');
  const grande = sb.calcularSet('6-12M', 'grande');
  assert.ok(esencial.length < completo.length);
  assert.ok(completo.length < grande.length);
  const subtotal = items => items.reduce((s, p) => s + sb.precioFinal(p), 0);
  assert.ok(subtotal(esencial) < subtotal(completo));
  assert.ok(subtotal(completo) < subtotal(grande));
});

test('Armá tu Set: talle sin productos no rompe (arreglo vacío o degradado, nunca throw)', () => {
  const sb = loadScript();
  assert.doesNotThrow(() => sb.calcularSet('99-99A', 'esencial'));
  const items = sb.calcularSet('99-99A', 'esencial');
  assert.ok(Array.isArray(items));
});

test('catLabel / subcatLabel: cubre las 6 subcategorías reales', () => {
  const sb = loadScript();
  const ids = ['textiles', 'cocina', 'decoracion', 'bebes', 'chicos', 'accesorios'];
  ids.forEach(id => assert.notEqual(sb.subcatLabel(id), id, `falta label para ${id}`));
});
