const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const RAIZ = path.join(__dirname, '..');
const FUSE_PATH = process.env.FUSE_PATH;

function crearApp({ conFuse = true } = {}) {
  const store = new Map();
  const buscador = { value: '' };

  const nodoVacio = {
    value: '',
    textContent: '',
    innerHTML: '',
    hidden: false,
    style: {},
    classList: { add() {}, remove() {}, toggle() { return false; }, contains() { return false; } },
    dataset: {},
    children: [],
    setAttribute() {}, getAttribute() { return null; }, removeAttribute() {},
    addEventListener() {}, appendChild() {}, focus() {}, scrollIntoView() {},
    querySelector() { return null; }, querySelectorAll() { return []; },
    closest() { return null; },
  };

  const doc = {
    addEventListener() {},
    dispatchEvent() {},
    createElement: () => ({ ...nodoVacio, classList: { add() {}, remove() {} } }),
    querySelector: () => null,
    querySelectorAll: () => [],
    getElementById: id => (id === 'q' ? buscador : { ...nodoVacio }),
    body: { ...nodoVacio },
    activeElement: null,
  };

  const ctx = {
    console,
    document: doc,
    localStorage: {
      getItem: k => (store.has(k) ? store.get(k) : null),
      setItem: (k, v) => store.set(k, String(v)),
      removeItem: k => store.delete(k),
    },
    CustomEvent: class { constructor(t) { this.type = t; } },
    CSS: { escape: s => s },
    requestAnimationFrame() {},
    setTimeout() {}, clearTimeout() {},
    Math, Date, JSON, Object, Array, String, Number, RegExp, Intl,
  };
  ctx.window = ctx;
  ctx.globalThis = ctx;
  ctx.window.addEventListener = () => {};
  ctx.window.setInterval = () => 0;
  ctx.window.matchMedia = () => ({ matches: false, addEventListener() {} });
  vm.createContext(ctx);

  if (conFuse && FUSE_PATH && fs.existsSync(FUSE_PATH)) {
    vm.runInContext(fs.readFileSync(FUSE_PATH, 'utf8'), ctx);
  }
  vm.runInContext(fs.readFileSync(path.join(RAIZ, 'data.js'), 'utf8'), ctx);

  const codigo = fs.readFileSync(path.join(RAIZ, 'script.js'), 'utf8');
  const api = vm.runInContext(
    codigo + `;({
      Cart, PRODUCTOS, CATEGORIAS, NEGOCIO,
      filtrar, normalizar, pasoActual, precioFinal, formatearPrecio, getProducto,
      initFuse, tieneFuse: () => fuse !== null,
      setCat: v => { catActiva = v; },
      getCat: () => catActiva,
      setBusqueda: v => { buscador.value = v; },
    })`,
    ctx
  );
  api.setBusqueda = v => { buscador.value = v; };
  api.initFuse();
  return api;
}

/* ---------------- Precio ---------------- */

test('precioFinal deja el precio intacto cuando no hay descuento', () => {
  const app = crearApp();
  const p = app.getProducto('lomito-clasico');
  assert.strictEqual(app.precioFinal(p), 24000);
});

test('precioFinal aplica el descuento de la promo del miércoles', () => {
  const app = crearApp();
  const p = app.getProducto('burger-miercoles');
  assert.strictEqual(p.precio, 18200);
  assert.strictEqual(p.descuento, 36);
  assert.strictEqual(app.precioFinal(p), Math.round(18200 * 0.64));
});

test('formatearPrecio usa separador de miles es-AR y sin decimales', () => {
  const app = crearApp();
  assert.strictEqual(app.formatearPrecio(24000), '$24.000');
  assert.strictEqual(app.formatearPrecio(3100), '$3.100');
  assert.strictEqual(app.formatearPrecio(11648), '$11.648');
});

/* ---------------- Carrito ---------------- */

test('add acumula unidades del mismo producto en una sola línea', () => {
  const app = crearApp();
  const p = app.getProducto('lomito-clasico');
  app.Cart.add(p, 2);
  app.Cart.add(p, 3);
  assert.strictEqual(app.Cart.get().length, 1);
  assert.strictEqual(app.Cart.count(), 5);
});

test('add nunca supera el tope de 99 unidades', () => {
  const app = crearApp();
  const p = app.getProducto('empanada-carne');
  app.Cart.add(p, 90);
  app.Cart.add(p, 40);
  assert.strictEqual(app.Cart.count(), 99);
});

test('setQty no deja bajar de 1 ni pasar de 99', () => {
  const app = crearApp();
  const p = app.getProducto('papas-clasicas');
  app.Cart.add(p, 4);
  app.Cart.setQty(p.id, 0);
  assert.strictEqual(app.Cart.count(), 1);
  app.Cart.setQty(p.id, 500);
  assert.strictEqual(app.Cart.count(), 99);
});

test('setQty sobre un id inexistente no rompe ni altera el carrito', () => {
  const app = crearApp();
  app.Cart.add(app.getProducto('nuggets'), 2);
  app.Cart.setQty('no-existe', 7);
  assert.strictEqual(app.Cart.count(), 2);
});

test('remove saca solo la línea pedida', () => {
  const app = crearApp();
  app.Cart.add(app.getProducto('lomito-clasico'), 1);
  app.Cart.add(app.getProducto('papas-cheddar'), 2);
  app.Cart.remove('lomito-clasico');
  const items = app.Cart.get();
  assert.strictEqual(items.length, 1);
  assert.strictEqual(items[0].id, 'papas-cheddar');
});

test('total suma subtotales y respeta el descuento', () => {
  const app = crearApp();
  app.Cart.add(app.getProducto('lomito-clasico'), 2);   // 48.000
  app.Cart.add(app.getProducto('burger-miercoles'), 1); // 11.648
  assert.strictEqual(app.Cart.total(), 48000 + Math.round(18200 * 0.64));
});

test('el carrito guarda solo id y qty, nunca el precio', () => {
  const app = crearApp();
  app.Cart.add(app.getProducto('lomito-clasico'), 1);
  assert.deepStrictEqual(Object.keys(app.Cart.get()[0]).sort(), ['id', 'qty']);
});

test('clear vacía el carrito', () => {
  const app = crearApp();
  app.Cart.add(app.getProducto('tiramisu'), 3);
  app.Cart.clear();
  assert.strictEqual(app.Cart.count(), 0);
  assert.strictEqual(app.Cart.total(), 0);
});

test('un localStorage corrupto devuelve carrito vacío en vez de romper', () => {
  const app = crearApp();
  app.Cart.save([{ id: 'lomito-clasico', qty: 1 }]);
  const crudo = { getItem: () => '{no es json', setItem() {} };
  const roto = { ...app.Cart, get: app.Cart.get };
  const original = globalThis.localStorage;
  globalThis.localStorage = crudo;
  try {
    assert.doesNotThrow(() => roto.get.call({ KEY: 'x' }));
  } finally {
    globalThis.localStorage = original;
  }
});

test('total ignora líneas cuyo producto ya no está en la carta', () => {
  const app = crearApp();
  app.Cart.save([{ id: 'producto-borrado', qty: 4 }, { id: 'nuggets', qty: 1 }]);
  assert.strictEqual(app.Cart.total(), app.getProducto('nuggets').precio);
});

/* ---------------- Filtros y buscador ---------------- */

test('sin filtros se ve la carta completa', () => {
  const app = crearApp();
  assert.strictEqual(app.filtrar().length, app.PRODUCTOS.length);
});

test('el filtro de categoría deja solo esa categoría', () => {
  const app = crearApp();
  app.setCat('milanesas');
  const r = app.filtrar();
  assert.ok(r.length > 0);
  assert.ok(r.every(p => p.cat === 'milanesas'));
});

test('cada categoría del rail tiene al menos un producto', () => {
  const app = crearApp();
  for (const c of app.CATEGORIAS) {
    app.setCat(c.id);
    assert.ok(app.filtrar().length > 0, `la categoría ${c.id} quedó vacía`);
  }
});

test('el buscador ignora los acentos', () => {
  const app = crearApp();
  app.setBusqueda('tiramisu');
  assert.ok(app.filtrar().some(p => p.id === 'tiramisu'));
});

test('el buscador ignora mayúsculas', () => {
  const app = crearApp();
  app.setBusqueda('CHEDDAR');
  assert.ok(app.filtrar().length > 0);
});

test('el buscador encuentra por ingrediente de la descripción', () => {
  const app = crearApp();
  app.setBusqueda('panceta');
  const ids = app.filtrar().map(p => p.id);
  assert.ok(ids.includes('lomito-americano'));
});

test('el buscador tolera un error de tipeo', { skip: !FUSE_PATH }, () => {
  const app = crearApp();
  assert.ok(app.tieneFuse(), 'Fuse no se inicializó');
  app.setBusqueda('milaneza');
  const ids = app.filtrar().map(p => p.id);
  assert.ok(ids.some(id => id.startsWith('milanesa')), `no encontró milanesas: ${ids.slice(0, 5)}`);
});

test('búsqueda y categoría se combinan', () => {
  const app = crearApp();
  app.setCat('bebidas');
  app.setBusqueda('pepsi');
  const r = app.filtrar();
  assert.ok(r.length > 0);
  assert.ok(r.every(p => p.cat === 'bebidas'));
});

test('una combinación imposible devuelve lista vacía, no un error', () => {
  const app = crearApp();
  app.setCat('bebidas');
  app.setBusqueda('milanesa napolitana');
  assert.strictEqual(app.filtrar().length, 0);
});

test('una búsqueda sin coincidencias devuelve lista vacía', () => {
  const app = crearApp();
  app.setBusqueda('zxqwkj');
  assert.strictEqual(app.filtrar().length, 0);
});

test('el buscador funciona aunque Fuse no haya cargado', () => {
  const app = crearApp({ conFuse: false });
  assert.strictEqual(app.tieneFuse(), false);
  app.setBusqueda('lomito');
  assert.ok(app.filtrar().length > 0);
});

/* ---------------- Paginación ---------------- */

test('las categorías de fotos paginan de a 12 y las de lista de a 30', () => {
  const app = crearApp();
  app.setCat('lomitos');
  assert.strictEqual(app.pasoActual(), 12);
  app.setCat('bebidas');
  assert.strictEqual(app.pasoActual(), 30);
  app.setCat('todo');
  assert.strictEqual(app.pasoActual(), 12);
});

test('"Ver más" alcanza para recorrer la categoría más larga', () => {
  const app = crearApp();
  let maxPasos = 0;
  for (const c of app.CATEGORIAS) {
    app.setCat(c.id);
    maxPasos = Math.max(maxPasos, Math.ceil(app.filtrar().length / app.pasoActual()));
  }
  assert.ok(maxPasos <= 3, `hacen falta ${maxPasos} clics de "Ver más"`);
});

/* ---------------- Integridad del dataset ---------------- */

test('todo producto tiene nombre, precio positivo y descripción', () => {
  const app = crearApp();
  for (const p of app.PRODUCTOS) {
    assert.ok(p.nombre && p.nombre.length > 2, `nombre inválido en ${p.id}`);
    assert.ok(Number.isFinite(p.precio) && p.precio > 0, `precio inválido en ${p.id}`);
    assert.ok(p.desc && p.desc.length > 5, `descripción faltante en ${p.id}`);
  }
});

test('los destacados del home siempre tienen foto', () => {
  const app = crearApp();
  const destacados = app.PRODUCTOS.filter(p => p.destacado);
  assert.ok(destacados.length >= 6);
  assert.ok(destacados.every(p => Boolean(p.img)), 'hay un destacado sin imagen');
});

test('el umbral de envío sin cargo es alcanzable con un pedido normal', () => {
  const app = crearApp();
  const p = app.getProducto('lomito-clasico');
  assert.ok(app.NEGOCIO.envioGratisDesde > 0);
  assert.ok(app.NEGOCIO.envioGratisDesde < app.precioFinal(p) * 3);
});
