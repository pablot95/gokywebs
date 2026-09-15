const { test, beforeEach } = require('node:test');
const assert = require('node:assert');

const store = new Map();
global.localStorage = {
  getItem: k => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: k => store.delete(k)
};
global.document = undefined;

const { PRODUCTOS, CATEGORIAS, Cart, precioFinal, formatearPrecio, filtrarProductos, ordenarProductos, normalizar, ENVIO_GRATIS_DESDE } = require('../script.js');

global.document = { dispatchEvent: () => {} };

beforeEach(() => { store.clear(); });

test('normalizar quita mayúsculas y acentos', () => {
  assert.strictEqual(normalizar('Plomería'), 'plomeria');
  assert.strictEqual(normalizar('ELÉCTRICAS'), 'electricas');
  assert.strictEqual(normalizar(null), '');
});

test('dataset coherente: ids únicos, categorías válidas, precios enteros positivos', () => {
  const ids = PRODUCTOS.map(p => p.id);
  assert.strictEqual(new Set(ids).size, ids.length);
  const cats = new Set(CATEGORIAS.map(c => c.id));
  PRODUCTOS.forEach(p => {
    assert.ok(cats.has(p.cat), `categoría inválida en ${p.id}`);
    assert.ok(Number.isInteger(p.precio) && p.precio > 0);
    assert.ok(p.descuento >= 0 && p.descuento < 100);
    assert.ok(p.stock > 0);
  });
  assert.strictEqual(PRODUCTOS.filter(p => p.destacado).length, 8);
});

test('precioFinal aplica descuento redondeado y respeta precio sin descuento', () => {
  const sin = PRODUCTOS.find(p => p.descuento === 0);
  assert.strictEqual(precioFinal(sin), sin.precio);
  const con = PRODUCTOS.find(p => p.descuento > 0);
  assert.strictEqual(precioFinal(con), Math.round(con.precio * (1 - con.descuento / 100)));
});

test('formatearPrecio usa separador es-AR', () => {
  assert.strictEqual(formatearPrecio(189000), '$' + (189000).toLocaleString('es-AR'));
  assert.ok(formatearPrecio(189000).includes('.'));
});

test('búsqueda ignora acentos y mayúsculas', () => {
  const r = filtrarProductos(PRODUCTOS, 'PLOMERÍA', 'all');
  assert.ok(r.length >= 4);
  assert.ok(r.every(p => p.cat === 'plomeria'));
});

test('búsqueda multi-palabra exige todas las palabras', () => {
  const r = filtrarProductos(PRODUCTOS, 'taladro percutor', 'all');
  assert.ok(r.length >= 1);
  assert.ok(r.every(p => normalizar(p.nombre + p.desc + p.tags.join(' ')).includes('taladro')));
});

test('filtro de categoría y búsqueda se combinan', () => {
  const r = filtrarProductos(PRODUCTOS, 'martillo', 'manuales');
  assert.ok(r.length >= 2);
  assert.ok(r.every(p => p.cat === 'manuales'));
  const vacio = filtrarProductos(PRODUCTOS, 'martillo', 'pintura');
  assert.strictEqual(vacio.length, 0);
});

test('limpiar filtros devuelve el catálogo completo', () => {
  assert.strictEqual(filtrarProductos(PRODUCTOS, '', 'all').length, PRODUCTOS.length);
});

test('ordenar por menor y mayor precio usa el precio final con descuento', () => {
  const menor = ordenarProductos(PRODUCTOS, 'menor');
  for (let i = 1; i < menor.length; i++) {
    assert.ok(precioFinal(menor[i - 1]) <= precioFinal(menor[i]));
  }
  const mayor = ordenarProductos(PRODUCTOS, 'mayor');
  assert.strictEqual(precioFinal(mayor[0]), Math.max(...PRODUCTOS.map(precioFinal)));
  const rel = ordenarProductos(PRODUCTOS, 'relevancia');
  assert.deepStrictEqual(rel.map(p => p.id), PRODUCTOS.map(p => p.id));
});

test('paginación: 12 iniciales, Ver más suma, filtro reinicia', () => {
  const PAGE = 12;
  let visibles = PAGE;
  const todos = filtrarProductos(PRODUCTOS, '', 'all');
  assert.strictEqual(todos.slice(0, visibles).length, 12);
  visibles += PAGE;
  assert.strictEqual(todos.slice(0, visibles).length, PRODUCTOS.length);
  visibles = PAGE;
  const filtrados = filtrarProductos(PRODUCTOS, '', 'pintura');
  assert.ok(filtrados.slice(0, visibles).length <= PAGE);
});

test('Cart: agregar suma cantidades y respeta stock', () => {
  Cart.clear();
  const p = PRODUCTOS.find(x => x.id === 'amoladora-180');
  Cart.add(p, 2);
  Cart.add(p, 5);
  assert.strictEqual(Cart.get().find(i => i.id === p.id).qty, p.stock);
  assert.strictEqual(Cart.count(), p.stock);
});

test('Cart: setQty acota entre 1 y stock, remove elimina, ids inexistentes no rompen', () => {
  Cart.clear();
  const p = PRODUCTOS[0];
  Cart.add(p, 1);
  Cart.setQty(p.id, 0);
  assert.strictEqual(Cart.get()[0].qty, 1);
  Cart.setQty(p.id, 999);
  assert.strictEqual(Cart.get()[0].qty, p.stock);
  Cart.setQty('no-existe', 3);
  Cart.remove('no-existe');
  assert.strictEqual(Cart.get().length, 1);
  Cart.remove(p.id);
  assert.strictEqual(Cart.get().length, 0);
});

test('Cart: total usa precio final con descuento', () => {
  Cart.clear();
  const con = PRODUCTOS.find(p => p.descuento > 0);
  Cart.add(con, 2);
  assert.strictEqual(Cart.total(), precioFinal(con) * 2);
});

test('Cart: localStorage corrupto devuelve carrito vacío', () => {
  store.set(Cart.KEY, '{{{no-json');
  assert.deepStrictEqual(Cart.get(), []);
});

test('Cart: producto eliminado del catálogo no rompe el total', () => {
  Cart.clear();
  store.set(Cart.KEY, JSON.stringify([{ id: 'producto-borrado', qty: 3 }, { id: PRODUCTOS[0].id, qty: 1 }]));
  assert.strictEqual(Cart.total(), precioFinal(PRODUCTOS[0]));
  assert.strictEqual(Cart.count(), 4);
});

test('envío gratis: umbral y progreso', () => {
  assert.strictEqual(ENVIO_GRATIS_DESDE, 80000);
  Cart.clear();
  const barato = PRODUCTOS.find(p => precioFinal(p) < ENVIO_GRATIS_DESDE);
  Cart.add(barato, 1);
  assert.ok(Cart.total() < ENVIO_GRATIS_DESDE);
  const caro = PRODUCTOS.find(p => precioFinal(p) >= ENVIO_GRATIS_DESDE);
  Cart.add(caro, 1);
  assert.ok(Cart.total() >= ENVIO_GRATIS_DESDE);
});
