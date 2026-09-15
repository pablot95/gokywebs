import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const store = new Map();
globalThis.localStorage = {
  getItem: k => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: k => store.delete(k)
};

const require = createRequire(import.meta.url);
const L = require('../script.js');
const { PRODUCTOS, ENVIO_GRATIS_DESDE, Cart, norm, formatearPrecio, precioFinal, formatearQty, filtrarProductos, armarMensajeWsp, getProducto } = L;

beforeEach(() => { store.clear(); });

test('norm quita mayúsculas y acentos', () => {
  assert.equal(norm('Bolsón SEMANAL'), 'bolson semanal');
  assert.equal(norm('Zanahoria frescá'), 'zanahoria fresca');
  assert.equal(norm(null), '');
});

test('filtro por texto encuentra con y sin acentos, en nombre y tags', () => {
  assert.deepEqual(filtrarProductos(PRODUCTOS, { q: 'bolsón' }).map(p => p.id), ['bolson']);
  assert.deepEqual(filtrarProductos(PRODUCTOS, { q: 'bolson' }).map(p => p.id), ['bolson']);
  assert.ok(filtrarProductos(PRODUCTOS, { q: 'pure' }).map(p => p.id).includes('papa'));
});

test('filtros combinados: texto + categoría, y limpiar', () => {
  assert.deepEqual(filtrarProductos(PRODUCTOS, { q: 'tomate', cat: 'hortalizas' }).map(p => p.id), ['tomate']);
  assert.deepEqual(filtrarProductos(PRODUCTOS, { q: 'tomate', cat: 'hoja' }), []);
  assert.equal(filtrarProductos(PRODUCTOS, { q: '', cat: 'todo' }).length, PRODUCTOS.length);
  assert.equal(filtrarProductos(PRODUCTOS, { q: 'zzz' }).length, 0);
});

test('categorías del HTML existen en los datos', () => {
  const cats = new Set(PRODUCTOS.map(p => p.categoria));
  for (const c of ['hortalizas', 'hoja', 'bolsones']) assert.ok(cats.has(c), c);
});

test('precioFinal aplica descuento redondeado y formatearPrecio usa es-AR', () => {
  const tomate = getProducto('tomate');
  assert.equal(precioFinal(tomate), 3315);
  assert.equal(precioFinal(getProducto('papa')), 1900);
  assert.equal(formatearPrecio(26500), '$' + (26500).toLocaleString('es-AR'));
});

test('formatearQty: gramos, kilos con coma y unidades con nombre propio', () => {
  const tomate = getProducto('tomate');
  assert.equal(formatearQty(tomate, 0.5), '500 g');
  assert.equal(formatearQty(tomate, 1), '1 kg');
  assert.equal(formatearQty(tomate, 1.5), '1,5 kg');
  const bolson = getProducto('bolson');
  assert.equal(formatearQty(bolson, 1), '1 bolsón');
  assert.equal(formatearQty(bolson, 2), '2 bolsones');
  const lechuga = getProducto('lechuga');
  assert.equal(formatearQty(lechuga, 1), '1 planta');
  assert.equal(formatearQty(lechuga, 3), '3 plantas');
});

test('Cart: agrega, acumula en pasos de medio kilo y respeta el stock', () => {
  const pepino = getProducto('pepino');
  Cart.clear();
  Cart.add(pepino, 0.5);
  Cart.add(pepino, 0.5);
  assert.equal(Cart.get()[0].qty, 1);
  Cart.add(pepino, 99);
  assert.equal(Cart.get()[0].qty, pepino.stock);
});

test('Cart.setQty clampa entre paso y stock', () => {
  const tomate = getProducto('tomate');
  Cart.clear();
  Cart.add(tomate, 1);
  Cart.setQty('tomate', 0);
  assert.equal(Cart.get()[0].qty, tomate.paso);
  Cart.setQty('tomate', 999);
  assert.equal(Cart.get()[0].qty, tomate.stock);
  Cart.setQty('fantasma', 3);
  assert.equal(Cart.get().length, 1);
});

test('Cart.total usa precio con descuento y qty fraccionaria', () => {
  Cart.clear();
  Cart.add(getProducto('tomate'), 1.5);
  Cart.add(getProducto('bolson'), 1);
  assert.equal(Cart.total(), Math.round(3315 * 1.5) + 26500 - 0.5);
  assert.ok(Math.abs(Cart.total() - (3315 * 1.5 + 26500)) < 1);
});

test('Cart.remove y count por líneas', () => {
  Cart.clear();
  Cart.add(getProducto('papa'), 2);
  Cart.add(getProducto('lechuga'), 1);
  assert.equal(Cart.count(), 2);
  Cart.remove('papa');
  assert.equal(Cart.count(), 1);
  Cart.remove('inexistente');
  assert.equal(Cart.count(), 1);
});

test('localStorage corrupto no rompe el carrito', () => {
  store.set(Cart.KEY, '{no es json');
  assert.deepEqual(Cart.get(), []);
  store.set(Cart.KEY, '"texto"');
  assert.deepEqual(Cart.get().length ?? 0, 0);
});

test('ID inexistente en el carrito no rompe total ni mensaje', () => {
  store.set(Cart.KEY, JSON.stringify([{ id: 'borrado', qty: 2 }, { id: 'papa', qty: 1 }]));
  assert.equal(Cart.total(), 1900);
  const msg = armarMensajeWsp(Cart.get());
  assert.ok(msg.includes('Papa lavada'));
  assert.ok(!msg.includes('borrado'));
});

test('syncStock elimina productos sin stock y recorta excedentes', () => {
  store.set(Cart.KEY, JSON.stringify([{ id: 'pepino', qty: 99 }, { id: 'borrado', qty: 1 }]));
  Cart.syncStock(PRODUCTOS);
  const items = Cart.get();
  assert.equal(items.length, 1);
  assert.equal(items[0].qty, getProducto('pepino').stock);
});

test('umbral de envío gratis', () => {
  Cart.clear();
  Cart.add(getProducto('papa'), 2);
  assert.ok(Cart.total() < ENVIO_GRATIS_DESDE);
  Cart.add(getProducto('bolson'), 1);
  assert.ok(Cart.total() >= ENVIO_GRATIS_DESDE);
});

test('mensaje de WhatsApp lista líneas con cantidades y total es-AR', () => {
  Cart.clear();
  Cart.add(getProducto('tomate'), 1.5);
  const msg = armarMensajeWsp(Cart.get());
  assert.ok(msg.includes('Tomate redondo × 1,5 kg'));
  assert.ok(msg.includes(`Total: ${formatearPrecio(Math.round(3315 * 1.5))}`));
});
