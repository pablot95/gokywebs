const test = require('node:test');
const assert = require('node:assert');
const path = require('node:path');
const fs = require('node:fs');

const raiz = path.join(__dirname, '..');
const store = new Map();
const localStorageStub = {
  getItem: k => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: k => store.delete(k)
};
const nodoVacio = {
  addEventListener() {}, removeEventListener() {}, querySelector: () => null,
  querySelectorAll: () => [], classList: { add() {}, remove() {}, toggle() {}, contains: () => false },
  setAttribute() {}, removeAttribute() {}, focus() {}, style: {}, dataset: {}
};
const documentStub = {
  addEventListener() {}, removeEventListener() {},
  getElementById: () => null, querySelector: () => null, querySelectorAll: () => [],
  createElement: () => ({ ...nodoVacio }), body: nodoVacio,
  documentElement: { classList: { add() {}, remove() {} } },
  dispatchEvent() {}
};
const windowStub = {
  matchMedia: () => ({ matches: false, addEventListener() {} }),
  addEventListener() {}, removeEventListener() {}, scrollY: 0, innerHeight: 800
};

const fuente = fs.readFileSync(path.join(raiz, 'script.js'), 'utf8');
const expuestos = 'PRODUCTOS, CATEGORIAS, Cart, estado, coincide, precioFinal, formatearPrecio, fmtQty, pasoDe, unidadCorta, normalizar, ENVIO_GRATIS_DESDE, WSP';
const cargar = new Function(
  'window', 'document', 'localStorage', 'CustomEvent', 'requestAnimationFrame',
  `${fuente}\nreturn { ${expuestos} };`
);
const api = cargar(
  windowStub, documentStub, localStorageStub,
  class { constructor(t) { this.type = t; } },
  () => 0
);
const { PRODUCTOS, CATEGORIAS, Cart, estado, coincide, precioFinal, formatearPrecio, fmtQty, pasoDe, normalizar, ENVIO_GRATIS_DESDE, WSP } = api;

const prod = id => PRODUCTOS.find(p => p.id === id);
const reset = () => { store.clear(); estado.cat = 'all'; estado.q = ''; };

test('el dataset es coherente y usa imágenes que existen', () => {
  assert.equal(PRODUCTOS.length, 8);
  assert.equal(new Set(PRODUCTOS.map(p => p.id)).size, 8);
  PRODUCTOS.forEach(p => {
    assert.ok(CATEGORIAS[p.cat], `categoría inválida en ${p.id}`);
    assert.ok(p.opciones.length >= 2, `${p.id} sin opciones de preparación`);
    assert.ok(['kg', 'u'].includes(p.unidad));
    assert.ok(p.precio > 0 && p.descuento >= 0 && p.descuento < 100);
    assert.equal(p.dim.length, 2);
    p.imgs.forEach(src => {
      assert.ok(fs.existsSync(path.join(raiz, src)), `falta la imagen ${src}`);
    });
  });
});

test('el teléfono de WhatsApp es el real y está normalizado', () => {
  assert.equal(WSP, '5492646200439');
  assert.match(WSP, /^549\d{10}$/);
});

test('precioFinal aplica el descuento y lo redondea', () => {
  assert.equal(precioFinal(prod('alitas')), 4590);
  assert.equal(precioFinal(prod('pechuga')), 8900);
  assert.equal(precioFinal({ precio: 4999, descuento: 33 }), 3349);
});

test('los precios se formatean en es-AR sin decimales', () => {
  assert.equal(formatearPrecio(4900), '$4.900');
  assert.equal(formatearPrecio(46000), '$46.000');
  assert.equal(formatearPrecio(6885.4), '$6.885');
});

test('las cantidades muestran kilos fraccionados y unidades', () => {
  const kg = prod('pollo-entero');
  const un = prod('brochetas');
  assert.equal(pasoDe(kg), 0.5);
  assert.equal(pasoDe(un), 1);
  assert.equal(fmtQty(kg, 1), '1 kg');
  assert.equal(fmtQty(kg, 1.5), '1,5 kg');
  assert.equal(fmtQty(kg, 0.5), '0,5 kg');
  assert.equal(fmtQty(un, 1), '1 unidad');
  assert.equal(fmtQty(un, 4), '4 unidades');
});

test('el carrito acumula kilos sobre la misma línea', () => {
  reset();
  const p = prod('pechuga');
  Cart.add(p, 1, 'En filetes');
  Cart.add(p, 0.5, 'En filetes');
  const items = Cart.get();
  assert.equal(items.length, 1);
  assert.equal(items[0].qty, 1.5);
  assert.equal(Cart.total(), 13350);
});

test('un corte distinto abre una línea nueva del mismo producto', () => {
  reset();
  const p = prod('pollo-entero');
  Cart.add(p, 1, 'Entero');
  Cart.add(p, 2, 'Trozado en 8');
  assert.equal(Cart.get().length, 2);
  assert.equal(Cart.count(), 2);
  assert.equal(Cart.total(), 4900 * 3);
});

test('setQty nunca baja del mínimo vendible', () => {
  reset();
  const kg = prod('alitas');
  Cart.add(kg, 1, 'Enteras');
  Cart.setQty('alitas', 'Enteras', 0.5);
  assert.equal(Cart.get()[0].qty, 0.5);
  Cart.setQty('alitas', 'Enteras', 0);
  assert.equal(Cart.get()[0].qty, 0.5);
  Cart.setQty('alitas', 'Enteras', -3);
  assert.equal(Cart.get()[0].qty, 0.5);

  const un = prod('caja-semanal');
  Cart.add(un, 1, 'Surtido clásico');
  Cart.setQty('caja-semanal', 'Surtido clásico', 0);
  assert.equal(Cart.get().find(i => i.id === 'caja-semanal').qty, 1);
});

test('el total combina descuento, kilos fraccionados y unidades', () => {
  reset();
  Cart.add(prod('alitas'), 1.5, 'Enteras');
  Cart.add(prod('brochetas'), 4, 'Criolla');
  assert.equal(Cart.total(), Math.round(4590 * 1.5) + 2400 * 4);
});

test('quitar una línea no toca la del mismo producto con otro corte', () => {
  reset();
  const p = prod('pata-muslo');
  Cart.add(p, 1, 'Con hueso');
  Cart.add(p, 1, 'Deshuesada');
  Cart.remove('pata-muslo', 'Con hueso');
  const items = Cart.get();
  assert.equal(items.length, 1);
  assert.equal(items[0].corte, 'Deshuesada');
  Cart.clear();
  assert.deepEqual(Cart.get(), []);
});

test('un localStorage corrupto no rompe el carrito', () => {
  reset();
  store.set('pieldepollo_cart', '{esto no es json');
  assert.deepEqual(Cart.get(), []);
  assert.equal(Cart.total(), 0);
  assert.equal(Cart.count(), 0);
});

test('una línea de un producto inexistente no suma al total', () => {
  reset();
  store.set('pieldepollo_cart', JSON.stringify([{ id: 'pollo-de-hule', corte: 'Entero', qty: 2 }]));
  assert.equal(Cart.total(), 0);
});

test('la barra de envío gratis calcula lo que falta', () => {
  reset();
  const falta = () => ENVIO_GRATIS_DESDE - Cart.total();
  Cart.add(prod('pollo-entero'), 2, 'Entero');
  assert.equal(Cart.total(), 9800);
  assert.equal(falta(), 25200);
  Cart.add(prod('caja-semanal'), 1, 'Surtido clásico');
  assert.equal(Cart.total(), 55800);
  assert.ok(falta() <= 0);
});

test('la búsqueda ignora mayúsculas y acentos', () => {
  assert.equal(normalizar('Pechugá'), 'pechuga');
  reset();
  estado.q = 'PECHUGA';
  assert.ok(coincide(prod('pechuga')));
  estado.q = 'milanesas';
  assert.ok(coincide(prod('milanesas')));
  assert.ok(!coincide(prod('alitas')));
});

test('la búsqueda encuentra por categoría, etiqueta y opción de corte', () => {
  reset();
  estado.q = 'combos';
  assert.ok(coincide(prod('combo-parrillero')));
  estado.q = 'freidora';
  assert.ok(coincide(prod('alitas')));
  estado.q = 'mariposa';
  assert.ok(coincide(prod('pollo-entero')));
  estado.q = 'a la mariposa';
  assert.ok(coincide(prod('pollo-entero')));
});

test('el filtro de categoría se combina con la búsqueda', () => {
  reset();
  estado.cat = 'frescos';
  assert.ok(coincide(prod('alitas')));
  assert.ok(!coincide(prod('pechuga')));
  estado.q = 'pata';
  assert.ok(coincide(prod('pata-muslo')));
  assert.ok(!coincide(prod('alitas')));
  estado.q = 'zapallo';
  assert.equal(PRODUCTOS.filter(coincide).length, 0);
});

test('sin filtros se ven los ocho productos', () => {
  reset();
  assert.equal(PRODUCTOS.filter(coincide).length, 8);
  estado.cat = 'combos';
  assert.equal(PRODUCTOS.filter(coincide).length, 2);
});
