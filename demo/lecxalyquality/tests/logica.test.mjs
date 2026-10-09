import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import vm from 'node:vm';

const raiz = dirname(dirname(fileURLToPath(import.meta.url)));

function cargarScript() {
  const almacen = new Map();
  const nulo = () => null;
  const lista = () => [];
  const nodo = { addEventListener() {}, removeEventListener() {}, querySelector: nulo, querySelectorAll: lista, classList: { add() {}, remove() {}, toggle() {}, contains: () => false }, style: {}, appendChild() {}, remove() {}, setAttribute() {}, removeAttribute() {}, getAttribute: nulo, hasAttribute: () => false, dataset: {}, focus() {} };
  const ctx = {
    console,
    setTimeout, clearTimeout,
    localStorage: { getItem: k => (almacen.has(k) ? almacen.get(k) : null), setItem: (k, v) => almacen.set(k, String(v)), removeItem: k => almacen.delete(k) },
    document: { ...nodo, body: { ...nodo }, head: { ...nodo }, documentElement: { ...nodo }, getElementById: nulo, createElement: () => ({ ...nodo }), dispatchEvent() { return true; }, activeElement: null, images: [] },
    window: { matchMedia: () => ({ matches: false, addEventListener() {} }), addEventListener() {}, scrollY: 0, history: { replaceState() {} }, fetch: () => Promise.reject(new Error('sin red en tests')) },
    location: { href: 'http://localhost/demo/lecxalyquality/', pathname: '/demo/lecxalyquality/', search: '' },
    navigator: {},
    requestAnimationFrame: () => 0,
    addEventListener() {},
    matchMedia: () => ({ matches: false, addEventListener() {} }),
    CustomEvent: class { constructor(type) { this.type = type; } },
    KeyboardEvent: class {},
    Event: class {},
    URL,
    encodeURIComponent, decodeURIComponent,
    fetch: () => Promise.reject(new Error('sin red en tests')),
  };
  ctx.globalThis = ctx;
  ctx.window.innerHeight = 800;
  const fuente = readFileSync(join(raiz, 'script.js'), 'utf8') + '\nglobalThis.__t = { Cart, precioFinal, precioBase, formatearPrecio, estiloFoto, PRODUCTOS };';
  vm.createContext(ctx);
  vm.runInContext(fuente, ctx, { filename: 'script.js' });
  return { t: ctx.__t, almacen };
}
const plano = v => JSON.parse(JSON.stringify(v));

const calzado = { id: 'urb-1', nombre: 'Urbana', precio: 48900, descuento: 0, stock: 10, categoria: 'Calzado', variantes: { tipo: 'talle', opciones: ['38', '39'] }, foco: { x: 50, y: 48, z: 2.6 } };
const remera = { id: 'rem-1', nombre: 'Remera', precio: 17900, descuento: 10, stock: 3, categoria: 'Indumentaria', variantes: { tipo: 'talle', opciones: ['M'] } };
const iphone = { id: 'ip-1', nombre: 'iPhone 17', precio: 1790000, descuento: 0, stock: 2, categoria: 'iPhone', variantes: { tipo: 'capacidad', opciones: ['256 GB', '512 GB'], extras: { '512 GB': 220000 } } };

test('precio final aplica descuento y extra de variante', () => {
  const { t } = cargarScript();
  assert.equal(t.precioFinal(calzado, '38'), 48900);
  assert.equal(t.precioFinal(remera, 'M'), 16110);
  assert.equal(t.precioBase(iphone, '512 GB'), 2010000);
  assert.equal(t.precioFinal(iphone, '256 GB'), 1790000);
  assert.equal(t.precioFinal({ ...iphone, descuento: 10 }, '512 GB'), 1809000);
});

test('formato de precio es-AR sin decimales', () => {
  const { t } = cargarScript();
  assert.equal(t.formatearPrecio(12500), '$12.500');
  assert.equal(t.formatearPrecio(1790000.4), '$1.790.000');
});

test('el recorte de foto nunca deja ver fuera de la imagen', () => {
  const { t } = cargarScript();
  const centro = t.estiloFoto({ foco: { x: 50, y: 48, z: 2.6 } });
  assert.match(centro, /--z:2\.6;--l:-80\.0%;--t:-74\.8%/);
  const borde = t.estiloFoto({ foco: { x: 95, y: 2, z: 2.6 } });
  assert.match(borde, /--l:-160\.0%;--t:0\.0%/);
  assert.match(t.estiloFoto({}), /--z:1;--l:0\.0%;--t:0\.0%/);
  assert.match(t.estiloFoto({ foco: { x: 10, y: 10, z: 0.2 } }), /--z:1;/);
});

test('el carrito agrupa por producto y variante y respeta el stock', () => {
  const { t } = cargarScript();
  t.PRODUCTOS.set(calzado.id, calzado);
  t.PRODUCTOS.set(remera.id, remera);
  t.PRODUCTOS.set(iphone.id, iphone);
  t.Cart.clear();
  t.Cart.add(calzado, '38', 2);
  t.Cart.add(calzado, '38', 3);
  t.Cart.add(calzado, '39', 1);
  t.Cart.add(remera, 'M', 9);
  t.Cart.add(iphone, '512 GB', 1);
  const items = plano(t.Cart.get());
  assert.deepEqual(items.map(i => [i.id, i.var, i.qty]), [['urb-1', '38', 5], ['urb-1', '39', 1], ['rem-1', 'M', 3], ['ip-1', '512 GB', 1]]);
  assert.equal(t.Cart.count(), 10);
  assert.equal(t.Cart.total(), 48900 * 6 + 16110 * 3 + 2010000);
  t.Cart.setQty('urb-1', '38', 50);
  assert.equal(t.Cart.get()[0].qty, 10);
  t.Cart.setQty('urb-1', '38', 0);
  assert.equal(t.Cart.get()[0].qty, 1);
  t.Cart.remove('urb-1', '39');
  assert.equal(t.Cart.get().length, 3);
  assert.ok(!t.Cart.get().some(i => i.id === 'urb-1' && i.var === '39'));
});

test('syncStock saca lo que ya no está en el catálogo y recorta cantidades', () => {
  const { t } = cargarScript();
  t.PRODUCTOS.set(calzado.id, { ...calzado, stock: 2 });
  t.Cart.save([{ id: 'urb-1', var: '38', qty: 6 }, { id: 'fantasma', var: '40', qty: 1 }, { id: 'rem-1', var: 'M', qty: 1 }]);
  t.PRODUCTOS.set(remera.id, { ...remera, stock: 0 });
  t.Cart.syncStock();
  assert.deepEqual(plano(t.Cart.get()), [{ id: 'urb-1', var: '38', qty: 2 }]);
});

test('un localStorage corrupto no rompe el carrito', () => {
  const { t, almacen } = cargarScript();
  almacen.set('lecxaly_cart', '{no es json');
  assert.deepEqual(plano(t.Cart.get()), []);
  assert.equal(t.Cart.count(), 0);
  assert.equal(t.Cart.total(), 0);
});
