const test = require('node:test');
const assert = require('node:assert');

const store = new Map();
global.localStorage = {
  getItem: k => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: k => store.delete(k),
  clear: () => store.clear()
};
global.CustomEvent = class { constructor(t) { this.type = t; } };
global.document = undefined;

const L = require('../script.js');
const {
  PRODUCTOS, ENVIO_GRATIS_DESDE, Cart, normalizar, formatearPrecio,
  getProducto, precioBase, precioFinal, precioDesde,
  productosFiltrados, estadoEnvio, mensajeWsp
} = L;

const reset = () => { store.clear(); };

test('cada producto tiene al menos una variante y categoría conocida', () => {
  const cats = ['lavanderia', 'perfumeria', 'textil'];
  for (const p of PRODUCTOS) {
    assert.ok(p.variantes.length >= 1, `${p.id} sin variantes`);
    assert.ok(cats.includes(p.cat), `${p.id} categoría inválida`);
    assert.ok(['servicio', 'producto'].includes(p.tipo), `${p.id} tipo inválido`);
    for (const v of p.variantes) assert.ok(v.precio > 0, `${p.id}/${v.nombre} precio inválido`);
  }
});

test('el precio sale de la variante elegida, no del producto', () => {
  const p = getProducto('lavado-kilo');
  assert.strictEqual(precioBase(p, 'Bolsa 5 kg'), 18900);
  assert.strictEqual(precioBase(p, 'Bolsa 15 kg'), 46900);
  assert.notStrictEqual(precioBase(p, 'Bolsa 5 kg'), precioBase(p, 'Bolsa 10 kg'));
});

test('una variante inexistente cae a la primera en vez de romper', () => {
  const p = getProducto('lavado-kilo');
  assert.strictEqual(precioBase(p, 'Bolsa 500 kg'), 18900);
  assert.strictEqual(precioBase(p, undefined), 18900);
});

test('el descuento se aplica sobre la variante y redondea', () => {
  const p = getProducto('perfume-rose');
  assert.strictEqual(p.descuento, 10);
  assert.strictEqual(precioFinal(p, '50 ml'), Math.round(52900 * 0.9));
  assert.strictEqual(precioFinal(p, '100 ml'), Math.round(79900 * 0.9));
  const sin = getProducto('perfumina');
  assert.strictEqual(precioFinal(sin, '250 ml'), precioBase(sin, '250 ml'));
});

test('precioDesde toma la variante más barata ya con descuento', () => {
  const p = getProducto('perfume-rose');
  assert.strictEqual(precioDesde(p), Math.round(52900 * 0.9));
  assert.ok(precioDesde(p) < precioBase(p, '50 ml'));
});

test('agregar dos veces la misma variante acumula una sola línea', () => {
  reset();
  const p = getProducto('perfumina');
  Cart.add(p, '250 ml', 2);
  Cart.add(p, '250 ml', 3);
  assert.strictEqual(Cart.get().length, 1);
  assert.strictEqual(Cart.count(), 5);
});

test('el mismo producto en dos variantes son dos líneas con su propio precio', () => {
  reset();
  const p = getProducto('perfumina');
  Cart.add(p, '250 ml', 1);
  Cart.add(p, '500 ml', 1);
  const lineas = Cart.lineas();
  assert.strictEqual(lineas.length, 2);
  assert.strictEqual(Cart.total(), 12900 + 19900);
});

test('el total usa el precio con descuento, no el de lista', () => {
  reset();
  Cart.add(getProducto('perfume-rose'), '50 ml', 2);
  assert.strictEqual(Cart.total(), Math.round(52900 * 0.9) * 2);
});

test('totalProductos ignora los servicios de lavandería', () => {
  reset();
  Cart.add(getProducto('lavado-kilo'), 'Bolsa 10 kg', 1);   // servicio $33.900
  Cart.add(getProducto('perfumina'), '250 ml', 1);          // producto $12.900
  assert.strictEqual(Cart.total(), 33900 + 12900);
  assert.strictEqual(Cart.totalProductos(), 12900);
});

test('un carrito de puro servicio nunca dispara el envío gratis', () => {
  reset();
  Cart.add(getProducto('lavado-kilo'), 'Bolsa 15 kg', 2); // $93.800 > umbral
  assert.ok(Cart.total() > ENVIO_GRATIS_DESDE);
  assert.strictEqual(Cart.totalProductos(), 0);
  assert.strictEqual(estadoEnvio(Cart.totalProductos()).gratis, false);
});

test('el envío gratis se activa justo en el umbral y la barra no pasa de 100', () => {
  assert.strictEqual(estadoEnvio(ENVIO_GRATIS_DESDE - 1).gratis, false);
  assert.strictEqual(estadoEnvio(ENVIO_GRATIS_DESDE).gratis, true);
  assert.strictEqual(estadoEnvio(ENVIO_GRATIS_DESDE).falta, 0);
  assert.strictEqual(estadoEnvio(ENVIO_GRATIS_DESDE * 3).pct, 100);
  assert.strictEqual(estadoEnvio(0).pct, 0);
  assert.strictEqual(estadoEnvio(ENVIO_GRATIS_DESDE / 2).pct, 50);
});

test('setQty no baja de 1 y remove borra solo la variante indicada', () => {
  reset();
  const p = getProducto('perfumina');
  Cart.add(p, '250 ml', 1);
  Cart.add(p, '500 ml', 1);
  Cart.setQty(p.id, '250 ml', -5);
  assert.strictEqual(Cart.get().find(i => i.variante === '250 ml').qty, 1);
  Cart.remove(p.id, '250 ml');
  const items = Cart.get();
  assert.strictEqual(items.length, 1);
  assert.strictEqual(items[0].variante, '500 ml');
});

test('un localStorage corrupto no rompe el carrito', () => {
  reset();
  global.localStorage.setItem('lasamadas_cart', '{no es json');
  assert.deepStrictEqual(Cart.get(), []);
  assert.strictEqual(Cart.total(), 0);
  assert.strictEqual(Cart.count(), 0);
});

test('una línea de un producto que ya no existe se ignora sin romper el total', () => {
  reset();
  global.localStorage.setItem('lasamadas_cart', JSON.stringify([
    { id: 'producto-fantasma', variante: 'X', qty: 3 },
    { id: 'perfumina', variante: '250 ml', qty: 1 }
  ]));
  assert.strictEqual(Cart.lineas().length, 1);
  assert.strictEqual(Cart.total(), 12900);
});

test('el buscador ignora acentos y mayúsculas', () => {
  assert.strictEqual(normalizar('Perfumería'), 'perfumeria');
  assert.strictEqual(normalizar('SÁBANAS'), 'sabanas');
  assert.ok(productosFiltrados('all', 'sabanas').some(p => p.id === 'ropa-blanca'));
  assert.ok(productosFiltrados('all', 'SÁBANAS').some(p => p.id === 'ropa-blanca'));
});

test('el buscador encuentra por sinónimo del rubro y por variante', () => {
  assert.ok(productosFiltrados('all', 'plancha').some(p => p.id === 'lavado-planchado'));
  assert.ok(productosFiltrados('all', 'lavanda').some(p => p.id === 'sachets'));
  assert.ok(productosFiltrados('all', '100 ml').some(p => p.id === 'perfume-rose'));
});

test('el buscador combina varias palabras (AND, no OR)', () => {
  const r = productosFiltrados('all', 'perfume regalo');
  assert.ok(r.some(p => p.id === 'duo-perfumes'));
  assert.ok(!r.some(p => p.id === 'perfumina'));
});

test('filtro de categoría y búsqueda se combinan', () => {
  const soloLav = productosFiltrados('lavanderia', '');
  assert.ok(soloLav.length > 0);
  assert.ok(soloLav.every(p => p.cat === 'lavanderia'));
  assert.strictEqual(productosFiltrados('lavanderia', 'perfume internacional').length, 0);
  assert.strictEqual(productosFiltrados('all', 'zzzznoexiste').length, 0);
});

test('los precios se formatean en es-AR sin decimales', () => {
  assert.strictEqual(formatearPrecio(12900), '$12.900');
  assert.strictEqual(formatearPrecio(139900), '$139.900');
  assert.ok(!formatearPrecio(47610).includes(','));
});

test('el mensaje de WhatsApp separa retiro de envío y cierra con el total', () => {
  reset();
  Cart.add(getProducto('lavado-kilo'), 'Bolsa 10 kg', 1);
  Cart.add(getProducto('perfumina'), '250 ml', 2);
  const msg = mensajeWsp();
  assert.ok(msg.includes('PASAN A BUSCAR'));
  assert.ok(msg.includes('ME ENVÍAN'));
  assert.ok(msg.includes('Bolsa 10 kg'));
  assert.ok(msg.includes('x2'));
  assert.ok(msg.includes(formatearPrecio(Cart.total())));
  assert.ok(msg.indexOf('PASAN A BUSCAR') < msg.indexOf('ME ENVÍAN'));
});

test('sin servicios el mensaje no menciona el retiro', () => {
  reset();
  Cart.add(getProducto('perfumina'), '250 ml', 1);
  const msg = mensajeWsp();
  assert.ok(!msg.includes('PASAN A BUSCAR'));
  assert.ok(msg.includes('ME ENVÍAN'));
});
