import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import vm from 'node:vm';

const src = readFileSync(join(dirname(fileURLToPath(import.meta.url)), '..', 'script.js'), 'utf8');
const MARKER = 'function cardHTML';
const core = src.slice(0, src.indexOf(MARKER));

function crearContexto(storageInicial = {}) {
  const store = new Map(Object.entries(storageInicial));
  const sandbox = {
    localStorage: {
      getItem: k => (store.has(k) ? store.get(k) : null),
      setItem: (k, v) => store.set(k, String(v)),
      removeItem: k => store.delete(k)
    },
    document: { dispatchEvent() {}, addEventListener() {}, querySelectorAll: () => [] },
    window: { matchMedia: () => ({ matches: false }) },
    CustomEvent: class { constructor(type) { this.type = type; } }
  };
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(
    core +
      `\n;globalThis.__api = { esc, formatearPrecio, precioFinal, getProducto, normalizar, Cart, PRODUCTOS, CAT_LABEL,
        filtrar: (cat, q) => { activeCat = cat; query = normalizar(q || ''); return productosFiltrados(); } };`,
    sandbox
  );
  return sandbox.__api;
}

test('el corte del script incluye la lógica pura', () => {
  assert.ok(src.includes(MARKER), 'el marcador de corte existe en script.js');
  for (const fn of ['const esc', 'const formatearPrecio', 'const precioFinal', 'const normalizar', 'const Cart', 'function productosFiltrados']) {
    assert.ok(core.includes(fn), `el corte contiene ${fn}`);
  }
});

test('precioFinal aplica descuento redondeado y respeta precio sin descuento', () => {
  const api = crearContexto();
  assert.equal(api.precioFinal({ precio: 118000, descuento: 15 }), 100300);
  assert.equal(api.precioFinal({ precio: 109000, descuento: 10 }), 98100);
  assert.equal(api.precioFinal({ precio: 125000, descuento: 0 }), 125000);
  assert.equal(api.precioFinal({ precio: 9999, descuento: 33 }), Math.round(9999 * 0.67));
});

test('formatearPrecio usa formato es-AR con punto de miles y sin decimales', () => {
  const api = crearContexto();
  assert.equal(api.formatearPrecio(118000), '$118.000');
  assert.equal(api.formatearPrecio(98100), '$98.100');
  assert.equal(api.formatearPrecio(1500.4), '$1.500');
});

test('normalizar ignora mayúsculas y acentos', () => {
  const api = crearContexto();
  assert.equal(api.normalizar('SULTÁN Rojo'), 'sultan rojo');
  assert.equal(api.normalizar('Árabe'), 'arabe');
  assert.equal(api.normalizar(null), '');
});

test('esc neutraliza HTML peligroso', () => {
  const api = crearContexto();
  assert.equal(api.esc('<img src=x onerror=alert(1)>'), '&lt;img src=x onerror=alert(1)&gt;');
  assert.equal(api.esc(`"a" & 'b'`), '&quot;a&quot; &amp; &#39;b&#39;');
});

test('los 6 productos tienen datos consistentes', () => {
  const api = crearContexto();
  assert.equal(api.PRODUCTOS.length, 6);
  const ids = new Set(api.PRODUCTOS.map(p => p.id));
  assert.equal(ids.size, 6, 'ids únicos');
  for (const p of api.PRODUCTOS) {
    assert.ok(p.precio > 0);
    assert.ok(p.descuento >= 0 && p.descuento < 100);
    assert.ok(api.CAT_LABEL[p.cat], `categoría conocida: ${p.cat}`);
    assert.ok(p.img.startsWith('images/'));
    if (p.tipo === 'zapatilla') assert.ok(Array.isArray(p.talles) && p.talles.length >= 6);
    else assert.equal(p.talles, null);
  }
});

test('filtro por categoría y búsqueda se combinan', () => {
  const api = crearContexto();
  assert.equal(api.filtrar('all', '').length, 6);
  assert.equal(api.filtrar('hombre', '').length, 2);
  assert.equal(api.filtrar('dama', '').length, 2);
  assert.equal(api.filtrar('perfumes', '').length, 2);
  assert.equal(api.filtrar('perfumes', 'oud').length, 1);
  assert.equal(api.filtrar('dama', 'oud').length, 0);
});

test('la búsqueda encuentra sin acentos y con varios términos', () => {
  const api = crearContexto();
  assert.equal(api.filtrar('all', 'sultan')[0].id, 'sultan-rojo');
  assert.equal(api.filtrar('all', 'SULTÁN')[0].id, 'sultan-rojo');
  assert.equal(api.filtrar('all', 'cuero negro hombre').length, 1);
  assert.equal(api.filtrar('all', 'inexistente xyz').length, 0);
});

test('Cart.add crea líneas separadas por talle y fusiona iguales', () => {
  const api = crearContexto();
  const p = api.getProducto('step-air-roja');
  api.Cart.add(p, 1, '41');
  api.Cart.add(p, 2, '41');
  api.Cart.add(p, 1, '42');
  const items = api.Cart.get();
  assert.equal(items.length, 2);
  assert.equal(items.find(i => i.talle === '41').qty, 3);
  assert.equal(items.find(i => i.talle === '42').qty, 1);
  assert.equal(api.Cart.count(), 4);
});

test('perfumes sin talle conviven con zapatillas del mismo carrito', () => {
  const api = crearContexto();
  api.Cart.add(api.getProducto('oud-nocturno'), 2, null);
  api.Cart.add(api.getProducto('step-cuero-black'), 1, '40');
  assert.equal(api.Cart.get().length, 2);
  assert.equal(api.Cart.count(), 3);
});

test('setQty respeta mínimo 1 y remove borra solo esa variante', () => {
  const api = crearContexto();
  const p = api.getProducto('court-blanca');
  api.Cart.add(p, 2, '37');
  api.Cart.add(p, 1, '38');
  api.Cart.setQty('court-blanca', '37', 0);
  assert.equal(api.Cart.get().find(i => i.talle === '37').qty, 1, 'no baja de 1');
  api.Cart.setQty('court-blanca', 'inexistente', 5);
  assert.equal(api.Cart.get().length, 2, 'setQty sobre línea inexistente no crea nada');
  api.Cart.remove('court-blanca', '37');
  const rest = api.Cart.get();
  assert.equal(rest.length, 1);
  assert.equal(rest[0].talle, '38');
});

test('Cart.total usa el precio con descuento desde PRODUCTOS', () => {
  const api = crearContexto();
  api.Cart.add(api.getProducto('step-air-roja'), 2, '43');
  api.Cart.add(api.getProducto('sultan-rojo'), 1, null);
  assert.equal(api.Cart.total(), 100300 * 2 + 72000);
});

test('un carrito con id huérfano no rompe el total ni el render de datos', () => {
  const api = crearContexto({ stepscente_cart: JSON.stringify([{ id: 'borrado', talle: null, qty: 3 }, { id: 'oud-nocturno', talle: null, qty: 1 }]) });
  assert.equal(api.Cart.total(), 84000, 'ignora el producto inexistente');
  assert.equal(api.Cart.count(), 4, 'count cuenta unidades aunque el precio se ignore');
});

test('localStorage corrupto devuelve carrito vacío sin crashear', () => {
  const api = crearContexto({ stepscente_cart: '{esto no es json' });
  assert.equal(JSON.stringify(api.Cart.get()), '[]');
  assert.equal(api.Cart.total(), 0);
});

test('Cart.clear vacía y persiste', () => {
  const api = crearContexto();
  api.Cart.add(api.getProducto('chunky-motion'), 1, '36');
  api.Cart.clear();
  assert.equal(JSON.stringify(api.Cart.get()), '[]');
});
