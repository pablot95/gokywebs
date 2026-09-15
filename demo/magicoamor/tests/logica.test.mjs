import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const raiz = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const leer = f => fs.readFileSync(path.join(raiz, f), "utf8");

function domFalso() {
  const noop = () => {};
  const lista = [];
  lista.forEach = Array.prototype.forEach.bind(lista);
  const store = new Map();
  const doc = {
    getElementById: () => null,
    querySelector: () => null,
    querySelectorAll: () => lista,
    createElement: () => ({ style: {}, classList: { add: noop, remove: noop, toggle: noop, contains: () => false }, setAttribute: noop, appendChild: noop, addEventListener: noop, querySelector: () => null, querySelectorAll: () => lista }),
    addEventListener: noop,
    dispatchEvent: noop,
    body: { classList: { add: noop, remove: noop, contains: () => false }, appendChild: noop },
  };
  return {
    document: doc,
    window: { addEventListener: noop, matchMedia: () => ({ matches: false }), scrollY: 0, outerWidth: 1440, innerWidth: 1440, outerHeight: 900, innerHeight: 900, open: noop },
    localStorage: {
      getItem: k => (store.has(k) ? store.get(k) : null),
      setItem: (k, v) => store.set(k, String(v)),
      removeItem: k => store.delete(k),
      _corromper: k => store.set(k, "{{roto"),
      _vaciar: () => store.clear(),
    },
    CustomEvent: class { constructor(t) { this.type = t; } },
    performance: { now: () => 0 },
    requestAnimationFrame: noop,
    setTimeout: noop,
    setInterval: () => 0,
    matchMedia: () => ({ matches: false }),
    navigator: { userAgent: "node" },
  };
}

function cargar() {
  const ctx = vm.createContext(domFalso());
  ctx.globalThis = ctx;
  ctx.window.localStorage = ctx.localStorage;
  vm.runInContext(leer("data.js"), ctx, { filename: "data.js" });
  vm.runInContext(leer("script.js"), ctx, { filename: "script.js" });
  return ctx;
}

const ctx = cargar();
const M = ctx.MAGICO;
const datos = vm.runInContext("({ PRODUCTOS, CATEGORIAS, TALLES, MAYORISTA_OFF, MAYORISTA_MIN })", ctx);
const PRODUCTOS = Array.from(datos.PRODUCTOS);
const CATEGORIAS = Array.from(datos.CATEGORIAS);
const TALLES = Array.from(datos.TALLES);
const prod = id => PRODUCTOS.find(p => p.id === id);
const nums = arr => Array.from(arr);
const reset = () => { M.Cart.clear ? M.Cart.clear() : M.Cart.save([]); M.Modo.set(false); };

test("el motor queda expuesto para testear", () => {
  assert.ok(M, "script.js debe exponer globalThis.MAGICO");
  assert.equal(typeof M.precioVenta, "function");
});

/* ---------- dataset ---------- */

test("dataset: ids únicos y categorías/talles válidos", () => {
  const ids = PRODUCTOS.map(p => p.id);
  assert.equal(new Set(ids).size, ids.length, "hay ids repetidos");
  const cats = new Set(CATEGORIAS.map(c => c.id));
  const talles = new Set(TALLES.map(t => t.id));
  for (const p of PRODUCTOS) {
    assert.ok(cats.has(p.categoria), `${p.nombre}: categoría inexistente (${p.categoria})`);
    assert.ok(p.talles.length > 0, `${p.nombre}: sin talles`);
    for (const t of nums(p.talles)) assert.ok(talles.has(t), `${p.nombre}: talle inexistente (${t})`);
    assert.ok(p.precio > 0, `${p.nombre}: precio inválido`);
    assert.ok(p.descuento >= 0 && p.descuento < 100, `${p.nombre}: descuento fuera de rango`);
    assert.ok(p.tela && p.desc && p.desc.length > 40, `${p.nombre}: falta tela o descripción`);
  }
});

test("dataset: los talles de cada producto respetan el orden de la tabla", () => {
  const orden = TALLES.map(t => t.id);
  for (const p of PRODUCTOS) {
    const pos = nums(p.talles).map(t => orden.indexOf(t));
    assert.deepEqual(pos, [...pos].sort((a, b) => a - b), `${p.nombre}: talles desordenados`);
  }
});

test("dataset: cada categoría tiene productos y cada imagen existe en /images", () => {
  for (const c of CATEGORIAS) {
    assert.ok(PRODUCTOS.some(p => p.categoria === c.id), `categoría vacía: ${c.id}`);
    assert.ok(fs.existsSync(path.join(raiz, c.img)), `falta la imagen de categoría ${c.img}`);
  }
  for (const p of PRODUCTOS) assert.ok(fs.existsSync(path.join(raiz, p.img)), `falta ${p.img}`);
});

test("dataset: los factores de talle crecen con el tamaño", () => {
  const f = nums(TALLES.map(t => t.factor));
  assert.deepEqual(f, [...f].sort((a, b) => a - b));
  assert.equal(TALLES.find(t => t.id === "m").factor, 1, "el talle M es la base de precio");
});

/* ---------- precios ---------- */

test("precio: escala por talle y redondea a centenas", () => {
  reset();
  const p = prod(1);
  assert.equal(M.precioLista(p, "m"), p.precio);
  assert.equal(M.precioLista(p, "xl"), Math.round((p.precio * 1.42) / 100) * 100);
  assert.equal(M.precioLista(p, "s") % 100, 0);
  assert.ok(M.precioLista(p, "s") < M.precioLista(p, "l"));
});

test("precio: el descuento del producto solo aplica en minorista", () => {
  reset();
  const p = prod(5);
  assert.equal(p.descuento, 15);
  const lista = M.precioLista(p, "m");
  assert.equal(M.precioVenta(p, "m"), Math.round((lista * 0.85) / 100) * 100);
  assert.equal(M.precioTachado(p, "m"), lista);

  M.Modo.set(true);
  assert.equal(M.precioVenta(p, "m"), Math.round((lista * (1 - datos.MAYORISTA_OFF)) / 100) * 100);
  reset();
});

test("precio: mayorista siempre por debajo del minorista y sin tachado sobrante", () => {
  reset();
  for (const p of PRODUCTOS) {
    for (const t of nums(p.talles)) {
      const uni = M.precioVenta(p, t);
      if (p.descuento === 0) assert.equal(M.precioTachado(p, t), 0, `${p.nombre}: tachado sin descuento`);
      M.Modo.set(true);
      const mayo = M.precioVenta(p, t);
      assert.ok(mayo < uni, `${p.nombre} talle ${t}: mayorista no es más barato`);
      assert.equal(M.precioTachado(p, t), M.precioLista(p, t));
      M.Modo.set(false);
    }
  }
});

test("precio: formato es-AR sin decimales", () => {
  assert.equal(M.money(32900), "$32.900");
  assert.equal(M.money(7900.4), "$7.900");
  assert.ok(!M.money(1234567).includes(","));
});

/* ---------- carrito ---------- */

test("carrito: el mismo producto en dos talles son dos líneas", () => {
  reset();
  const p = prod(10);
  M.Cart.add(p, "s", 1);
  M.Cart.add(p, "l", 2);
  const items = M.Cart.get();
  assert.equal(items.length, 2);
  assert.equal(M.Cart.count(), 3);
  assert.equal(M.Cart.qtyOf(10, "s"), 1);
  assert.equal(M.Cart.qtyOf(10, "l"), 2);
});

test("carrito: sumar el mismo talle acumula, quitar borra solo esa línea", () => {
  reset();
  const p = prod(10);
  M.Cart.add(p, "s", 1);
  M.Cart.add(p, "s", 2);
  assert.equal(M.Cart.qtyOf(10, "s"), 3);
  M.Cart.add(p, "m", 1);
  M.Cart.remove(10, "s");
  assert.equal(M.Cart.qtyOf(10, "s"), 0);
  assert.equal(M.Cart.qtyOf(10, "m"), 1);
});

test("carrito: el total usa el precio del talle elegido", () => {
  reset();
  const p = prod(1);
  M.Cart.add(p, "xl", 2);
  M.Cart.add(prod(16), "m", 1);
  const esperado = M.precioVenta(p, "xl") * 2 + M.precioVenta(prod(16), "m");
  assert.equal(M.Cart.total(), esperado);
});

test("carrito: persiste en localStorage y aguanta datos corruptos", () => {
  reset();
  M.Cart.add(prod(7), "s", 1);
  const crudo = ctx.localStorage.getItem("magicoamor_cart");
  assert.equal(crudo, JSON.stringify([{ id: 7, talle: "s", qty: 1 }]));
  ctx.localStorage._corromper("magicoamor_cart");
  assert.equal(nums(M.Cart.get()).length, 0, "un storage roto no puede romper la tienda");
  assert.equal(M.Cart.total(), 0);
});

test("carrito: un producto borrado del catálogo no rompe el total", () => {
  reset();
  M.Cart.save([{ id: 999, talle: "m", qty: 3 }, { id: 1, talle: "m", qty: 1 }]);
  assert.equal(M.Cart.total(), M.precioVenta(prod(1), "m"));
  assert.equal(M.Cart.count(), 4);
});

/* ---------- modo mayorista ---------- */

test("mayorista: el mínimo pasa a 6 y las líneas viejas se ajustan", () => {
  reset();
  assert.equal(M.minQty(), 1);
  M.Cart.add(prod(1), "m", 1);
  M.Cart.add(prod(10), "s", 2);
  M.Modo.set(true);
  assert.equal(M.minQty(), datos.MAYORISTA_MIN);
  M.Cart.ajustarMinimo();
  assert.equal(nums(M.Cart.get()).map(i => i.qty).join(","), "6,6");
  M.Cart.setQty(1, "m", 2);
  assert.equal(M.Cart.qtyOf(1, "m"), 6, "no se puede bajar del mínimo mayorista");
  reset();
});

test("mayorista: el estado queda guardado en localStorage", () => {
  reset();
  M.Modo.set(true);
  assert.equal(ctx.localStorage.getItem("magicoamor_modo"), "mayo");
  M.Modo.set(false);
  assert.equal(ctx.localStorage.getItem("magicoamor_modo"), "uni");
});

/* ---------- filtros y paginación ---------- */

function filtrarCon({ q = "", cat = "", talle = "" }) {
  M.st.q = q; M.st.cat = cat; M.st.talle = talle;
  const res = M.filtrar();
  M.st.q = ""; M.st.cat = ""; M.st.talle = "";
  return res;
}

test("buscador: ignora acentos y mayúsculas", () => {
  assert.equal(M.norm("Moisés Ovalado"), "moises ovalado");
  assert.ok(nums(filtrarCon({ q: "moises" })).some(p => p.id === 8));
  assert.ok(nums(filtrarCon({ q: "MOISÉS" })).some(p => p.id === 8));
  assert.ok(nums(filtrarCon({ q: "polar" })).length >= 2, "busca también por tela");
  assert.equal(nums(filtrarCon({ q: "acuario" })).length, 0);
});

test("filtros: categoría y talle se combinan", () => {
  const ropa = nums(filtrarCon({ cat: "ropa" }));
  assert.ok(ropa.length > 0);
  assert.ok(ropa.every(p => p.categoria === "ropa"));

  const xl = nums(filtrarCon({ talle: "xl" }));
  assert.ok(xl.every(p => p.talles.includes("xl")));

  const ropaXl = nums(filtrarCon({ cat: "ropa", talle: "xl" }));
  assert.ok(ropaXl.every(p => p.categoria === "ropa" && p.talles.includes("xl")));
  assert.ok(ropaXl.length <= Math.min(ropa.length, xl.length));
});

test("filtros: una búsqueda imposible devuelve vacío sin romper", () => {
  assert.equal(nums(filtrarCon({ cat: "paseo", talle: "xs", q: "somier" })).length, 0);
});

test("paginación: 12 iniciales y +6 hasta agotar el catálogo", () => {
  const total = PRODUCTOS.length;
  assert.ok(total > M.PAGE, "el catálogo tiene que superar la primera página");
  let visibles = M.PAGE;
  assert.equal(Math.min(visibles, total), 12);
  visibles += M.STEP;
  assert.ok(visibles >= total, "con un click de Ver más se ve todo el catálogo");
  assert.equal(M.STEP, 6);
});
