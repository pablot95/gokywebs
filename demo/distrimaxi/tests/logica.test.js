const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const RAIZ = path.join(__dirname, '..');

function cargar() {
  const codigo = fs.readFileSync(path.join(RAIZ, 'script.js'), 'utf8');
  const store = new Map();
  const nodoVacio = {
    addEventListener() {}, removeEventListener() {}, querySelector: () => null,
    querySelectorAll: () => [], appendChild() {}, setAttribute() {}, removeAttribute() {},
    focus() {}, classList: { add() {}, remove() {}, toggle() {}, contains: () => false },
    style: {}, dataset: {}, closest: () => null, textContent: '1', innerHTML: '', hidden: false
  };
  const sandbox = {
    console,
    document: {
      addEventListener() {}, removeEventListener() {}, dispatchEvent() {},
      querySelector: () => null, querySelectorAll: () => [], getElementById: () => null,
      createElement: () => ({ ...nodoVacio }),
      body: { ...nodoVacio }, documentElement: { ...nodoVacio }, activeElement: null
    },
    window: {
      addEventListener() {}, removeEventListener() {}, scrollY: 0, innerHeight: 800,
      matchMedia: () => ({ matches: false, addEventListener() {} })
    },
    localStorage: {
      getItem: k => (store.has(k) ? store.get(k) : null),
      setItem: (k, v) => store.set(k, String(v)),
      removeItem: k => store.delete(k)
    },
    CustomEvent: class { constructor(t) { this.type = t; } },
    IntersectionObserver: class { observe() {} unobserve() {} },
    requestAnimationFrame: () => {},
    setTimeout, clearTimeout
  };
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  const exportar = `
    ;globalThis.__T = {
      PRODUCTOS, CATEGORIAS, Cart, PASO,
      precioBase, precioFinal, maxQty, normalizar, formatearPrecio, getProducto, getCategoria,
      productosFiltrados,
      setFiltros: (c, e, b) => { filtroCat = c; filtroEnvase = e; busqueda = b; },
      setModo: m => { MODO = m; },
      getModo: () => MODO
    };`;
  vm.runInContext(codigo + exportar, sandbox);
  return { ...sandbox.__T, store };
}

const T = cargar();
const reset = () => { T.Cart.clear(); T.setModo('bulto'); T.setFiltros('todos', 'todos', ''); };

/* ---------- Integridad del catálogo ---------- */

test('los ids de producto son únicos', () => {
  const ids = T.PRODUCTOS.map(p => p.id);
  assert.strictEqual(new Set(ids).size, ids.length);
});

test('hay 30 referencias repartidas en las 6 categorías declaradas', () => {
  assert.strictEqual(T.PRODUCTOS.length, 30);
  const cats = new Set(T.PRODUCTOS.map(p => p.cat));
  assert.strictEqual(cats.size, 6);
  for (const c of cats) assert.ok(T.CATEGORIAS.some(x => x.id === c), `categoría inexistente: ${c}`);
});

test('cada producto apunta a una imagen que existe en disco', () => {
  for (const p of T.PRODUCTOS) {
    assert.ok(fs.existsSync(path.join(RAIZ, p.img)), `falta la imagen ${p.img} de ${p.id}`);
  }
});

test('hay exactamente 8 destacados (el tope de la grilla)', () => {
  assert.strictEqual(T.PRODUCTOS.filter(p => p.destacado).length, 8);
});

test('comprar el bulto siempre conviene contra la unidad suelta', () => {
  for (const p of T.PRODUCTOS) {
    const prorrateo = p.precioBulto / p.unidadesPorBulto;
    assert.ok(prorrateo < p.precioUnidad, `${p.id}: el bulto no conviene (${prorrateo} vs ${p.precioUnidad})`);
  }
});

test('los descuentos están entre 0 y 100 y los stocks son positivos', () => {
  for (const p of T.PRODUCTOS) {
    assert.ok(p.descuento >= 0 && p.descuento < 100, `${p.id} descuento fuera de rango`);
    assert.ok(p.stockBultos > 0, `${p.id} sin stock`);
    assert.ok(p.unidadesPorBulto > 0, `${p.id} sin unidades por bulto`);
  }
});

/* ---------- Precios por modo ---------- */

test('sin descuento, el precio final es el del modo elegido', () => {
  const p = T.getProducto('gas-01');
  assert.strictEqual(T.precioFinal(p, 'bulto'), p.precioBulto);
  assert.strictEqual(T.precioFinal(p, 'unidad'), p.precioUnidad);
});

test('el descuento se aplica sobre la base del modo, no sobre una base fija', () => {
  const p = T.getProducto('gas-03');
  assert.strictEqual(p.descuento, 8);
  assert.strictEqual(T.precioFinal(p, 'bulto'), Math.round(p.precioBulto * 0.92));
  assert.strictEqual(T.precioFinal(p, 'unidad'), Math.round(p.precioUnidad * 0.92));
  assert.notStrictEqual(T.precioFinal(p, 'bulto'), T.precioFinal(p, 'unidad'));
});

test('el precio final siempre es entero (no arrastra centavos)', () => {
  for (const p of T.PRODUCTOS) {
    assert.ok(Number.isInteger(T.precioFinal(p, 'bulto')), `${p.id} bulto con decimales`);
    assert.ok(Number.isInteger(T.precioFinal(p, 'unidad')), `${p.id} unidad con decimales`);
  }
});

test('un producto inexistente no rompe el cálculo de precio', () => {
  assert.strictEqual(T.precioBase(undefined, 'bulto'), 0);
  assert.strictEqual(T.precioFinal(undefined, 'unidad'), 0);
});

test('formatearPrecio usa separador de miles es-AR y sin decimales', () => {
  assert.strictEqual(T.formatearPrecio(15600), '$15.600');
  assert.strictEqual(T.formatearPrecio(850), '$850');
  assert.strictEqual(T.formatearPrecio(1234567), '$1.234.567');
});

test('el tope de cantidad sale del stock en bultos y se libera por unidad', () => {
  const p = T.getProducto('vin-03');
  assert.strictEqual(p.stockBultos, 16);
  assert.strictEqual(T.maxQty(p, 'bulto'), 16);
  assert.strictEqual(T.maxQty(p, 'unidad'), 99);
});

/* ---------- Carrito con clave compuesta ---------- */

test('el mismo producto en bulto y en unidad son dos líneas distintas', () => {
  reset();
  const p = T.getProducto('cer-01');
  T.Cart.add(p, 'bulto', 2);
  T.Cart.add(p, 'unidad', 3);
  const items = T.Cart.get();
  assert.strictEqual(items.length, 2);
  assert.strictEqual(items.find(i => i.modo === 'bulto').qty, 2);
  assert.strictEqual(items.find(i => i.modo === 'unidad').qty, 3);
});

test('agregar dos veces el mismo id y modo acumula en una sola línea', () => {
  reset();
  const p = T.getProducto('agu-01');
  T.Cart.add(p, 'bulto', 2);
  T.Cart.add(p, 'bulto', 3);
  assert.strictEqual(T.Cart.get().length, 1);
  assert.strictEqual(T.Cart.get()[0].qty, 5);
});

test('el carrito nunca supera el stock de bultos disponible', () => {
  reset();
  const p = T.getProducto('vin-03');
  T.Cart.add(p, 'bulto', 50);
  assert.strictEqual(T.Cart.get()[0].qty, 16);
  T.Cart.setQty('vin-03', 'bulto', 999);
  assert.strictEqual(T.Cart.get()[0].qty, 16);
});

test('la cantidad nunca baja de 1 desde el stepper del carrito', () => {
  reset();
  T.Cart.add(T.getProducto('gas-01'), 'bulto', 1);
  T.Cart.setQty('gas-01', 'bulto', 0);
  assert.strictEqual(T.Cart.get()[0].qty, 1);
  T.Cart.setQty('gas-01', 'bulto', -8);
  assert.strictEqual(T.Cart.get()[0].qty, 1);
});

test('quitar una línea no toca la del otro modo del mismo producto', () => {
  reset();
  const p = T.getProducto('cer-02');
  T.Cart.add(p, 'bulto', 1);
  T.Cart.add(p, 'unidad', 4);
  T.Cart.remove('cer-02', 'bulto');
  const items = T.Cart.get();
  assert.strictEqual(items.length, 1);
  assert.strictEqual(items[0].modo, 'unidad');
  assert.strictEqual(items[0].qty, 4);
});

test('setQty sobre una línea que no existe no crea líneas fantasma', () => {
  reset();
  T.Cart.add(T.getProducto('gas-01'), 'bulto', 1);
  T.Cart.setQty('gas-01', 'unidad', 5);
  T.Cart.setQty('no-existe', 'bulto', 5);
  assert.strictEqual(T.Cart.get().length, 1);
});

test('el total mezcla modos y aplica el descuento de cada línea', () => {
  reset();
  const cer = T.getProducto('cer-02');
  const agu = T.getProducto('agu-01');
  T.Cart.add(cer, 'bulto', 2);
  T.Cart.add(agu, 'unidad', 3);
  const esperado = T.precioFinal(cer, 'bulto') * 2 + T.precioFinal(agu, 'unidad') * 3;
  assert.strictEqual(T.Cart.total(), esperado);
  assert.strictEqual(T.Cart.count(), 5);
});

test('el total ignora líneas de productos que ya no están en el catálogo', () => {
  reset();
  T.Cart.add(T.getProducto('gas-01'), 'bulto', 1);
  const items = T.Cart.get();
  items.push({ id: 'producto-borrado', modo: 'bulto', qty: 4 });
  T.Cart.save(items);
  assert.strictEqual(T.Cart.total(), T.precioFinal(T.getProducto('gas-01'), 'bulto'));
});

test('un localStorage corrupto devuelve un carrito vacío en vez de romper', () => {
  T.store.set('distrimaxi_cart', '{esto no es json');
  assert.strictEqual(T.Cart.get().length, 0);
  assert.strictEqual(T.Cart.total(), 0);
  assert.strictEqual(T.Cart.count(), 0);
});

test('agregar un producto inexistente no ensucia el carrito', () => {
  reset();
  T.Cart.add(undefined, 'bulto', 2);
  assert.strictEqual(T.Cart.get().length, 0);
});

/* ---------- Buscador y filtros ---------- */

test('la búsqueda ignora acentos en ambos sentidos', () => {
  reset();
  T.setFiltros('todos', 'todos', 'nectar');
  assert.ok(T.productosFiltrados().some(p => p.id === 'jug-03'));
  reset();
  T.setFiltros('todos', 'todos', 'néctar');
  assert.ok(T.productosFiltrados().some(p => p.id === 'jug-03'));
});

test('la búsqueda ignora mayúsculas y acepta varias palabras como AND', () => {
  reset();
  T.setFiltros('todos', 'todos', 'CERVEZA LATA');
  const r = T.productosFiltrados();
  assert.ok(r.length > 0);
  assert.ok(r.every(p => p.cat === 'cervezas' && p.envase === 'Lata'));
});

test('la búsqueda encuentra por etiqueta además de por nombre', () => {
  reset();
  T.setFiltros('todos', 'todos', 'casco');
  const ids = T.productosFiltrados().map(p => p.id);
  assert.ok(ids.includes('cer-01'));
  assert.ok(ids.includes('agu-04'));
});

test('categoría y envase se combinan en vez de pisarse', () => {
  reset();
  T.setFiltros('cervezas', 'Vidrio', '');
  const r = T.productosFiltrados();
  assert.ok(r.length > 0);
  assert.ok(r.every(p => p.cat === 'cervezas' && p.envase === 'Vidrio'));
  const soloCat = (T.setFiltros('cervezas', 'todos', ''), T.productosFiltrados());
  assert.ok(soloCat.length > r.length);
});

test('los tres filtros juntos siguen combinando', () => {
  reset();
  T.setFiltros('gaseosas', 'Descartable', 'cola');
  const r = T.productosFiltrados();
  assert.ok(r.every(p => p.cat === 'gaseosas' && p.envase === 'Descartable' && /cola/i.test(p.nombre)));
  assert.ok(r.length >= 1);
});

test('una búsqueda sin coincidencias devuelve lista vacía, no el catálogo entero', () => {
  reset();
  T.setFiltros('todos', 'todos', 'zapatillas');
  assert.strictEqual(T.productosFiltrados().length, 0);
});

test('sin filtros vuelve el catálogo completo', () => {
  reset();
  assert.strictEqual(T.productosFiltrados().length, 30);
});

test('cada categoría del filtro tiene al menos un producto que mostrar', () => {
  for (const c of T.CATEGORIAS) {
    reset();
    T.setFiltros(c.id, 'todos', '');
    assert.ok(T.productosFiltrados().length > 0, `pasillo vacío: ${c.id}`);
  }
});

/* ---------- Paginación ---------- */

test('la primera tanda del catálogo son 12 y quedan más para "Ver más"', () => {
  reset();
  const lista = T.productosFiltrados();
  assert.strictEqual(T.PASO, 12);
  assert.strictEqual(lista.slice(0, T.PASO).length, 12);
  assert.ok(lista.length > T.PASO);
});

test('con un filtro chico la paginación no inventa huecos', () => {
  reset();
  T.setFiltros('jugos', 'todos', '');
  const lista = T.productosFiltrados();
  assert.strictEqual(lista.length, 4);
  assert.strictEqual(lista.slice(0, T.PASO).length, 4);
});
