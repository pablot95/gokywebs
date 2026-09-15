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
const expuestos = 'PRODUCTOS, CATEGORIAS, USOS, Cart, estado, coincide, precioFinal, precioLinea, precioArmado, llevaArmado, formatearPrecio, cuotaDe, normalizar, ENVIO_GRATIS_DESDE, CUOTAS, ARMADO_PRECIO, OPCIONES_ENTREGA, WSP';
const cargar = new Function(
  'window', 'document', 'localStorage', 'CustomEvent', 'requestAnimationFrame',
  `${fuente}\nreturn { ${expuestos} };`
);
const api = cargar(
  windowStub, documentStub, localStorageStub,
  class { constructor(t) { this.type = t; } },
  () => 0
);
const {
  PRODUCTOS, CATEGORIAS, USOS, Cart, estado, coincide, precioFinal, precioLinea,
  precioArmado, formatearPrecio, cuotaDe, normalizar, ENVIO_GRATIS_DESDE, CUOTAS,
  ARMADO_PRECIO, OPCIONES_ENTREGA, WSP
} = api;

const prod = id => PRODUCTOS.find(p => p.id === id);
const reset = () => { store.clear(); estado.cat = 'all'; estado.uso = 'all'; estado.q = ''; };
const SOLO = OPCIONES_ENTREGA[0];
const ARMADO = OPCIONES_ENTREGA[1];

test('el dataset es coherente y las imágenes existen', () => {
  assert.equal(PRODUCTOS.length, 7);
  assert.equal(new Set(PRODUCTOS.map(p => p.id)).size, 7);
  PRODUCTOS.forEach(p => {
    assert.ok(CATEGORIAS[p.cat], `categoría inválida en ${p.id}`);
    assert.ok(USOS[p.uso], `uso inválido en ${p.id}`);
    assert.ok(p.precio > 0 && p.descuento >= 0 && p.descuento < 100);
    assert.equal(p.dim.length, 2);
    assert.ok(Object.keys(p.ficha).length >= 4, `${p.id} con ficha técnica pobre`);
    assert.ok(p.desc.length > 40, `${p.id} sin descripción real`);
    p.imgs.forEach(src => {
      assert.ok(fs.existsSync(path.join(raiz, src)), `falta la imagen ${src}`);
    });
  });
});

test('el WhatsApp es el real del cliente y está normalizado', () => {
  assert.equal(WSP, '5491131539555');
  assert.match(WSP, /^549\d{10}$/);
});

test('precioFinal aplica el descuento del combo', () => {
  assert.equal(precioFinal(prod('cinta')), 1290000);
  assert.equal(precioFinal(prod('combo-home')), 2191200);
  assert.equal(precioFinal({ precio: 999999, descuento: 33 }), 669999);
});

test('los precios se formatean en es-AR sin decimales', () => {
  assert.equal(formatearPrecio(1290000), '$1.290.000');
  assert.equal(formatearPrecio(420000), '$420.000');
});

test('la cuota se calcula sobre el precio final, no sobre el de lista', () => {
  assert.equal(CUOTAS, 12);
  assert.equal(cuotaDe(1290000), 107500);
  const combo = prod('combo-home');
  assert.equal(cuotaDe(precioFinal(combo)), Math.round(2191200 / 12));
});

test('el armado suma al precio, salvo en los combos que ya lo incluyen', () => {
  const cinta = prod('cinta');
  assert.equal(precioArmado(cinta), ARMADO_PRECIO);
  assert.equal(precioLinea(cinta, SOLO), 1290000);
  assert.equal(precioLinea(cinta, ARMADO), 1290000 + ARMADO_PRECIO);

  const combo = prod('combo-home');
  assert.equal(precioArmado(combo), 0, 'el combo no debe cobrar armado');
  assert.equal(precioLinea(combo, ARMADO), precioLinea(combo, SOLO));
});

test('el carrito acumula unidades de la misma línea', () => {
  reset();
  const p = prod('bici');
  Cart.add(p, 1, SOLO);
  Cart.add(p, 2, SOLO);
  const items = Cart.get();
  assert.equal(items.length, 1);
  assert.equal(items[0].qty, 3);
  assert.equal(Cart.total(), 680000 * 3);
});

test('la misma máquina con y sin armado son dos líneas distintas', () => {
  reset();
  const p = prod('cinta');
  Cart.add(p, 1, SOLO);
  Cart.add(p, 1, ARMADO);
  assert.equal(Cart.get().length, 2);
  assert.equal(Cart.count(), 2);
  assert.equal(Cart.total(), 1290000 + (1290000 + ARMADO_PRECIO));
});

test('setQty respeta el mínimo de 1 y el tope de 9', () => {
  reset();
  Cart.add(prod('remo'), 1, SOLO);
  Cart.setQty('remo', SOLO, 0);
  assert.equal(Cart.get()[0].qty, 1);
  Cart.setQty('remo', SOLO, -5);
  assert.equal(Cart.get()[0].qty, 1);
  Cart.setQty('remo', SOLO, 50);
  assert.equal(Cart.get()[0].qty, 9);
});

test('quitar una línea no toca la de la misma máquina con otra entrega', () => {
  reset();
  const p = prod('eliptica');
  Cart.add(p, 1, SOLO);
  Cart.add(p, 1, ARMADO);
  Cart.remove('eliptica', SOLO);
  const items = Cart.get();
  assert.equal(items.length, 1);
  assert.equal(items[0].entrega, ARMADO);
  Cart.clear();
  assert.deepEqual(Cart.get(), []);
});

test('un localStorage corrupto no rompe el carrito', () => {
  reset();
  store.set('caprifitness_cart', '{no es json');
  assert.deepEqual(Cart.get(), []);
  assert.equal(Cart.total(), 0);
  assert.equal(Cart.count(), 0);
});

test('una línea de una máquina inexistente no suma al total', () => {
  reset();
  store.set('caprifitness_cart', JSON.stringify([{ id: 'maquina-fantasma', entrega: SOLO, qty: 3 }]));
  assert.equal(Cart.total(), 0);
});

test('el total del carrito mezcla descuento y armado correctamente', () => {
  reset();
  Cart.add(prod('combo-home'), 1, ARMADO);
  Cart.add(prod('banco'), 2, ARMADO);
  const esperado = 2191200 + (420000 + ARMADO_PRECIO) * 2;
  assert.equal(Cart.total(), esperado);
});

test('la barra de envío gratis calcula lo que falta', () => {
  reset();
  const falta = () => ENVIO_GRATIS_DESDE - Cart.total();
  Cart.add(prod('banco'), 1, SOLO);
  assert.equal(Cart.total(), 420000);
  assert.equal(falta(), 80000);
  Cart.add(prod('bici'), 1, SOLO);
  assert.ok(falta() <= 0, 'con dos máquinas ya supera el umbral');
});

test('la búsqueda ignora mayúsculas y acentos', () => {
  assert.equal(normalizar('Elíptica'), 'eliptica');
  reset();
  estado.q = 'ELIPTICA';
  assert.ok(coincide(prod('eliptica')));
  estado.q = 'elíptica';
  assert.ok(coincide(prod('eliptica')));
  assert.ok(!coincide(prod('bici')));
});

test('la búsqueda encuentra por etiqueta y por ficha técnica', () => {
  reset();
  estado.q = 'trotadora';
  assert.ok(coincide(prod('cinta')), 'sinónimo cargado en tags');
  estado.q = 'poleas';
  assert.ok(coincide(prod('multifuncion')));
  estado.q = 'aire';
  assert.ok(coincide(prod('remo')), 'valor que solo está en la ficha técnica');
});

test('los filtros de categoría y uso se combinan', () => {
  reset();
  estado.cat = 'cardio';
  assert.equal(PRODUCTOS.filter(coincide).length, 4);
  estado.uso = 'hogar';
  const r = PRODUCTOS.filter(coincide);
  assert.equal(r.length, 1);
  assert.equal(r[0].id, 'bici');
  estado.q = 'multifuncion';
  assert.equal(PRODUCTOS.filter(coincide).length, 0, 'combinación sin resultados');
});

test('sin filtros se ven las siete máquinas', () => {
  reset();
  assert.equal(PRODUCTOS.filter(coincide).length, 7);
  estado.cat = 'fuerza';
  assert.equal(PRODUCTOS.filter(coincide).length, 2);
  reset();
  estado.uso = 'pro';
  assert.equal(PRODUCTOS.filter(coincide).length, 2);
});
