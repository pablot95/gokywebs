import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import vm from 'node:vm';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = readFileSync(join(root, 'script.js'), 'utf-8');

function makeStore(initial = {}) {
  const map = new Map(Object.entries(initial));
  return {
    getItem: k => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => map.set(k, String(v)),
    removeItem: k => map.delete(k),
  };
}

function loadDemo(storeInit = {}) {
  const noop = () => {};
  const fakeEl = () => ({
    addEventListener: noop, setAttribute: noop, removeAttribute: noop, focus: noop,
    classList: { add: noop, remove: noop, toggle: noop, contains: () => false },
    style: {}, dataset: {}, appendChild: noop, querySelector: () => null, querySelectorAll: () => [],
    innerHTML: '', textContent: '', hidden: false, scrollTop: 0,
  });
  const sandbox = {
    window: { matchMedia: () => ({ matches: false }), addEventListener: noop, removeEventListener: noop, innerHeight: 800, scrollY: 0 },
    document: {
      addEventListener: noop, removeEventListener: noop, dispatchEvent: noop,
      querySelectorAll: () => [], querySelector: () => null, getElementById: () => null,
      createElement: fakeEl, body: fakeEl(), activeElement: null,
    },
    localStorage: makeStore(storeInit),
    location: { search: '', pathname: '/' },
    URLSearchParams,
    CustomEvent: class { constructor(t) { this.type = t; } },
    IntersectionObserver: undefined,
    requestAnimationFrame: noop,
    setTimeout, clearTimeout,
    console,
  };
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(src + '\n;__out = { norm, esc, precioFinal, formatearPrecio, Cart, PRODUCTOS, CATEGORIAS, DESTACADOS_IDS, productosFiltrados, filtros, waLink, getProducto, ENVIO_GRATIS_DESDE, PAGE_SIZE };', sandbox);
  return sandbox.__out;
}

test('norm ignora acentos y mayúsculas', () => {
  const { norm } = loadDemo();
  assert.equal(norm('Marroquinería'), 'marroquineria');
  assert.equal(norm('NIÑOS'), 'ninos');
  assert.equal(norm('Piqué Arena'), 'pique arena');
});

test('precioFinal aplica descuento redondeado y formatearPrecio usa es-AR', () => {
  const { precioFinal, formatearPrecio, getProducto } = loadDemo();
  const p = getProducto('vestido-fibrana-flores');
  assert.equal(p.descuento, 15);
  assert.equal(precioFinal(p), Math.round(52900 * 0.85));
  assert.equal(formatearPrecio(12500), '$' + (12500).toLocaleString('es-AR'));
  const sinDesc = getProducto('blazer-lino-crema');
  assert.equal(precioFinal(sinDesc), sinDesc.precio);
});

test('Cart: agrega, fusiona por id+talle y separa talles distintos', () => {
  const { Cart, getProducto } = loadDemo();
  const p = getProducto('blazer-lino-crema');
  Cart.add(p, 'M', 1);
  Cart.add(p, 'M', 2);
  Cart.add(p, 'L', 1);
  const items = Cart.get();
  assert.equal(items.length, 2);
  assert.equal(items.find(i => i.talle === 'M').qty, 3);
  assert.equal(items.find(i => i.talle === 'L').qty, 1);
  assert.equal(Cart.count(), 4);
});

test('Cart: setQty respeta mínimo 1, remove por variante y total con descuento', () => {
  const { Cart, getProducto, precioFinal } = loadDemo();
  const a = getProducto('vestido-fibrana-flores');
  const b = getProducto('cartera-hobo-crema');
  Cart.add(a, 'M', 2);
  Cart.add(b, null, 1);
  Cart.setQty(a.id, 'M', 0);
  assert.equal(Cart.get().find(i => i.id === a.id).qty, 1);
  assert.equal(Cart.total(), precioFinal(a) + precioFinal(b));
  Cart.remove(a.id, 'M');
  assert.equal(Cart.get().length, 1);
  Cart.clear();
  assert.equal(Cart.count(), 0);
});

test('Cart: localStorage corrupto no rompe', () => {
  const { Cart } = loadDemo({ emmel_cart: '{{{nojson' });
  assert.equal(Cart.get().length, 0);
});

test('Cart: item huérfano en storage no rompe el total', () => {
  const { Cart } = loadDemo({ emmel_cart: JSON.stringify([{ id: 'producto-borrado', talle: null, qty: 3 }]) });
  assert.equal(Cart.total(), 0);
  assert.equal(Cart.count(), 3);
});

test('búsqueda insensible a acentos en ambos sentidos', () => {
  const demo = loadDemo();
  demo.filtros.q = 'sabanas';
  assert.ok(demo.productosFiltrados().some(p => p.id === 'sabanas-queen-200'));
  demo.filtros.q = 'PIQUÉ';
  const res = demo.productosFiltrados();
  assert.ok(res.some(p => p.id === 'chomba-pique-arena'));
  assert.ok(res.some(p => p.id === 'conjunto-bebe-pique'));
});

test('filtros combinados: categoría + búsqueda + solo ofertas', () => {
  const demo = loadDemo();
  demo.filtros.cat = 'dama';
  demo.filtros.q = 'vestido';
  assert.equal(demo.productosFiltrados().map(p => p.id).join(','), 'vestido-fibrana-flores');
  demo.filtros.q = '';
  demo.filtros.ofertas = true;
  assert.equal(demo.productosFiltrados().map(p => p.id).join(','), 'vestido-fibrana-flores');
  demo.filtros.cat = 'all';
  const ofertas = demo.productosFiltrados();
  assert.equal(ofertas.length, 6);
  assert.ok(ofertas.every(p => p.descuento > 0));
});

test('orden por precio usa el precio final con descuento', () => {
  const demo = loadDemo();
  demo.filtros.orden = 'precio-asc';
  const asc = demo.productosFiltrados();
  for (let i = 1; i < asc.length; i++) {
    assert.ok(demo.precioFinal(asc[i - 1]) <= demo.precioFinal(asc[i]));
  }
  demo.filtros.orden = 'precio-desc';
  const desc = demo.productosFiltrados();
  assert.equal(demo.precioFinal(desc[0]), Math.max(...desc.map(demo.precioFinal)));
});

test('búsqueda sin resultados devuelve lista vacía', () => {
  const demo = loadDemo();
  demo.filtros.q = 'zzzz inexistente';
  assert.equal(demo.productosFiltrados().length, 0);
});

test('paginación: dataset supera una página y el corte es exacto', () => {
  const demo = loadDemo();
  assert.ok(demo.PRODUCTOS.length > demo.PAGE_SIZE);
  const lista = demo.productosFiltrados();
  assert.equal(lista.slice(0, demo.PAGE_SIZE).length, 12);
  assert.equal(lista.slice(0, demo.PAGE_SIZE * 3).length, demo.PRODUCTOS.length);
});

test('envío gratis: umbral y progreso', () => {
  const { Cart, getProducto, ENVIO_GRATIS_DESDE } = loadDemo();
  const caro = getProducto('campera-gabardina-marino');
  Cart.add(caro, 'L', 1);
  assert.ok(Cart.total() < ENVIO_GRATIS_DESDE);
  Cart.add(caro, 'XL', 1);
  assert.ok(Cart.total() >= ENVIO_GRATIS_DESDE);
});

test('integridad del dataset: categorías, destacados, talles e imágenes existen', () => {
  const { PRODUCTOS, CATEGORIAS, DESTACADOS_IDS, getProducto } = loadDemo();
  const catIds = new Set(CATEGORIAS.map(c => c.id));
  for (const p of PRODUCTOS) {
    assert.ok(catIds.has(p.cat), `cat inválida en ${p.id}`);
    assert.ok(p.precio > 0 && Number.isInteger(p.precio));
    assert.ok(p.descuento >= 0 && p.descuento < 100);
    if (p.talles) assert.ok(Array.isArray(p.talles) && p.talles.length > 0);
    assert.ok(existsSync(join(root, p.img)), `imagen faltante: ${p.img}`);
  }
  for (const c of CATEGORIAS) {
    assert.ok(existsSync(join(root, c.img)), `imagen de categoría faltante: ${c.img}`);
    assert.ok(PRODUCTOS.some(p => p.cat === c.id), `categoría vacía: ${c.id}`);
  }
  assert.equal(DESTACADOS_IDS.length, 8);
  for (const id of DESTACADOS_IDS) assert.ok(getProducto(id), `destacado inexistente: ${id}`);
  const ids = PRODUCTOS.map(p => p.id);
  assert.equal(new Set(ids).size, ids.length);
});

test('waLink codifica el mensaje con el número real', () => {
  const { waLink } = loadDemo();
  const url = waLink('Hola EMMEL, ¿tienen talle M?');
  assert.ok(url.startsWith('https://wa.me/5493496549220?text='));
  assert.ok(url.includes(encodeURIComponent('¿tienen talle M?')));
});

test('esc neutraliza HTML en nombres', () => {
  const { esc } = loadDemo();
  assert.equal(esc('<img onerror=x>'), '&lt;img onerror=x&gt;');
  assert.equal(esc("O'Brien \"x\""), 'O&#39;Brien &quot;x&quot;');
});
