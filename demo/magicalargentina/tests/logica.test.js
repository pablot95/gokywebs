const test = require('node:test');
const assert = require('node:assert');

const store = new Map();
globalThis.localStorage = {
  getItem: k => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: k => store.delete(k),
};
globalThis.CustomEvent = class { constructor(t) { this.type = t; } };
globalThis.window = { matchMedia: () => ({ matches: false }), addEventListener() {} };
globalThis.document = {
  addEventListener() {}, dispatchEvent() {},
  querySelectorAll: () => [], querySelector: () => null, getElementById: () => null,
};

const M = require('../script.js');
const { PRODUCTOS, CATEGORIAS, ENVASES, DESC_BULTO, ENVIO_GRATIS_DESDE, POR_PAGINA, estado, Cart, norm, filtrados, precioFinal, precioBulto, precioPres, formatearPrecio, mensajeWsp, getProducto } = M;

const reset = () => {
  Object.assign(estado, { cat: 'all', grupo: 'all', oferta: false, bulto: false, q: '', orden: 'rel', visibles: POR_PAGINA });
  Cart.clear();
};

test('el catálogo cumple la cantidad pedida y no tiene ids repetidos', () => {
  assert.ok(PRODUCTOS.length >= 50 && PRODUCTOS.length <= 100, `son ${PRODUCTOS.length}`);
  assert.strictEqual(new Set(PRODUCTOS.map(p => p.id)).size, PRODUCTOS.length);
});

test('todo producto tiene categoría válida, envase dibujable y precio positivo', () => {
  const cats = new Set(CATEGORIAS.map(c => c.id));
  for (const p of PRODUCTOS) {
    assert.ok(cats.has(p.cat), `${p.id} tiene categoría inválida: ${p.cat}`);
    assert.ok(ENVASES[p.tipo], `${p.id} usa un envase inexistente: ${p.tipo}`);
    assert.ok(p.precio > 0 && Number.isFinite(p.precio), `${p.id} sin precio`);
    assert.ok(p.d && p.d.length > 15, `${p.id} sin descripción usable`);
    assert.ok(['chico', 'bidon', 'seco'].includes(p.grupo), `${p.id} sin grupo válido`);
  }
});

test('cada categoría tiene productos y los destacados no pasan de 8', () => {
  for (const c of CATEGORIAS) {
    assert.ok(PRODUCTOS.some(p => p.cat === c.id), `la categoría ${c.id} quedó vacía`);
  }
  assert.ok(PRODUCTOS.filter(p => p.destacado).length <= 8);
  assert.ok(PRODUCTOS.filter(p => p.destacado).length >= 6);
});

test('precioFinal aplica el descuento y precioBulto suma el 12% del bulto', () => {
  const sinDesc = PRODUCTOS.find(p => !p.descuento);
  assert.strictEqual(precioFinal(sinDesc), sinDesc.precio);
  const conDesc = PRODUCTOS.find(p => p.descuento > 0);
  assert.strictEqual(precioFinal(conDesc), Math.round(conDesc.precio * (1 - conDesc.descuento / 100)));
  const conBulto = PRODUCTOS.find(p => p.bulto > 0);
  assert.strictEqual(precioBulto(conBulto), Math.round(precioFinal(conBulto) * conBulto.bulto * (1 - DESC_BULTO / 100)));
  assert.ok(precioBulto(conBulto) < precioFinal(conBulto) * conBulto.bulto);
});

test('precioPres cae a la unidad si el producto no tiene bulto', () => {
  const sinBulto = PRODUCTOS.find(p => !p.bulto);
  assert.strictEqual(precioPres(sinBulto, 'b'), precioFinal(sinBulto));
  const conBulto = PRODUCTOS.find(p => p.bulto > 0);
  assert.strictEqual(precioPres(conBulto, 'b'), precioBulto(conBulto));
  assert.strictEqual(precioPres(conBulto, 'u'), precioFinal(conBulto));
});

test('los precios se muestran en formato es-AR', () => {
  assert.strictEqual(formatearPrecio(12500), '$12.500');
  assert.strictEqual(formatearPrecio(3290.4), '$3.290');
  assert.strictEqual(formatearPrecio(148000), '$148.000');
});

test('la búsqueda ignora acentos y mayúsculas', () => {
  assert.strictEqual(norm('Jabón LÍQUIDO'), 'jabon liquido');
  reset();
  estado.q = 'JABON liquido';
  const r = filtrados();
  assert.ok(r.length > 0);
  assert.ok(r.every(p => norm(p.nombre + p.d).includes('jabon')));
});

test('la búsqueda combina todas las palabras y encuentra por rubro o uso', () => {
  reset();
  estado.q = 'bidon lavandina';
  assert.ok(filtrados().every(p => norm(p.nombre + p.pres + p.d).includes('lavandina')));
  reset();
  estado.q = 'papeleria';
  assert.ok(filtrados().length >= 5, 'busca también por nombre de rubro');
  reset();
  estado.q = 'zapatillas';
  assert.strictEqual(filtrados().length, 0);
});

test('los filtros de rubro, presentación, oferta y bulto se combinan', () => {
  reset();
  estado.cat = 'cocina';
  const soloCocina = filtrados();
  assert.ok(soloCocina.length > 0 && soloCocina.every(p => p.cat === 'cocina'));

  reset();
  estado.grupo = 'bidon';
  assert.ok(filtrados().every(p => p.grupo === 'bidon'));

  reset();
  estado.oferta = true;
  const ofertas = filtrados();
  assert.ok(ofertas.length > 0 && ofertas.every(p => p.descuento > 0));

  reset();
  estado.bulto = true;
  assert.ok(filtrados().every(p => p.bulto > 0));

  reset();
  estado.cat = 'pisos'; estado.grupo = 'bidon'; estado.oferta = true;
  const combo = filtrados();
  assert.ok(combo.every(p => p.cat === 'pisos' && p.grupo === 'bidon' && p.descuento > 0));
  assert.ok(combo.length < PRODUCTOS.length);
});

test('el orden por precio y por nombre es estable', () => {
  reset();
  estado.orden = 'asc';
  const asc = filtrados().map(precioFinal);
  assert.deepStrictEqual(asc, [...asc].sort((a, b) => a - b));
  estado.orden = 'desc';
  const desc = filtrados().map(precioFinal);
  assert.deepStrictEqual(desc, [...desc].sort((a, b) => b - a));
  estado.orden = 'az';
  const az = filtrados().map(p => p.nombre);
  assert.deepStrictEqual(az, [...az].sort((a, b) => a.localeCompare(b, 'es')));
});

test('la paginación muestra de a 12 y agota la lista', () => {
  reset();
  const total = filtrados().length;
  assert.ok(total > POR_PAGINA);
  assert.strictEqual(filtrados().slice(0, estado.visibles).length, POR_PAGINA);
  let visibles = POR_PAGINA;
  let vueltas = 0;
  while (visibles < total) { visibles += POR_PAGINA; vueltas++; }
  assert.ok(vueltas > 0);
  assert.strictEqual(filtrados().slice(0, visibles).length, total);
});

test('el carrito separa unidad de bulto y acumula cantidades', () => {
  reset();
  const p = PRODUCTOS.find(x => x.bulto > 0);
  Cart.add(p, 2, 'u');
  Cart.add(p, 1, 'u');
  assert.strictEqual(Cart.get().length, 1);
  assert.strictEqual(Cart.count(), 3);
  Cart.add(p, 1, 'b');
  assert.strictEqual(Cart.get().length, 2, 'unidad y bulto son dos líneas');
  assert.strictEqual(Cart.total(), precioFinal(p) * 3 + precioBulto(p));
  Cart.remove(p.id, 'b');
  assert.strictEqual(Cart.get().length, 1);
  Cart.clear();
  assert.strictEqual(Cart.count(), 0);
  assert.strictEqual(Cart.total(), 0);
});

test('setQty respeta el mínimo 1 y el máximo 99', () => {
  reset();
  const p = PRODUCTOS[0];
  Cart.add(p, 1, 'u');
  Cart.setQty(p.id, 'u', -5);
  assert.strictEqual(Cart.count(), 1);
  Cart.setQty(p.id, 'u', 500);
  assert.strictEqual(Cart.count(), 99);
  Cart.setQty('no-existe', 'u', 4);
  assert.strictEqual(Cart.count(), 99);
});

test('un carrito guardado corrupto no rompe la tienda', () => {
  localStorage.setItem(Cart.KEY, '{{ esto no es json');
  assert.deepStrictEqual(Cart.get(), []);
  assert.strictEqual(Cart.total(), 0);
  Cart.clear();
});

test('un producto borrado del catálogo no suma al total', () => {
  reset();
  localStorage.setItem(Cart.KEY, JSON.stringify([{ id: 'fantasma-99', pres: 'u', qty: 3 }]));
  assert.strictEqual(Cart.total(), 0);
  assert.strictEqual(Cart.count(), 3);
  Cart.clear();
});

test('el umbral de envío sin cargo es alcanzable con pocos artículos', () => {
  reset();
  const caro = [...PRODUCTOS].sort((a, b) => precioFinal(b) - precioFinal(a))[3];
  Cart.add(caro, 2, 'u');
  assert.ok(Cart.total() >= ENVIO_GRATIS_DESDE, 'dos artículos caros deberían alcanzar el envío gratis');
  Cart.clear();
});

test('el mensaje de WhatsApp lista cada línea con su precio y el total', () => {
  reset();
  const p1 = PRODUCTOS.find(x => x.bulto > 0);
  const p2 = PRODUCTOS.find(x => x.id !== p1.id);
  Cart.add(p1, 2, 'b');
  Cart.add(p2, 1, 'u');
  const msg = mensajeWsp();
  assert.ok(msg.includes(p1.nombre) && msg.includes(p2.nombre));
  assert.ok(msg.includes(`bulto x${p1.bulto}`));
  assert.ok(msg.includes(formatearPrecio(Cart.total())));
  assert.ok(msg.includes('2x'));
  assert.ok(encodeURIComponent(msg).length > 0);
  Cart.clear();
});

test('getProducto devuelve undefined sin romperse ante un id inexistente', () => {
  assert.strictEqual(getProducto('no-existe'), undefined);
  assert.ok(getProducto(PRODUCTOS[0].id));
});
